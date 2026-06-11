import os
import re
from dotenv import load_dotenv
from langchain_core.globals import set_verbose, set_debug
from langchain_groq.chat_models import ChatGroq
from langgraph.constants import END
from langgraph.graph import StateGraph
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.runnables import RunnableConfig

from agent.prompts import *
from agent.states import *
from agent.tools import write_file, read_file, get_current_directory, list_files

_ = load_dotenv()

# Debugging is handled nicely by LangSmith, keeping CLI output clean.
# set_debug(False)
# set_verbose(False)

llm = ChatGroq(model="llama-3.3-70b-versatile", max_retries=5)


def planner_agent(state: dict) -> dict:
    """Converts user prompt into a structured Plan."""
    user_prompt = state["user_prompt"]
    resp = llm.with_structured_output(Plan).with_retry(stop_after_attempt=3, wait_exponential_jitter=True).invoke(
        planner_prompt(user_prompt)
    )
    if resp is None:
        raise ValueError("Planner did not return a valid response.")
    return {"plan": resp}


def architect_agent(state: dict) -> dict:
    """Creates TaskPlan from Plan."""
    plan: Plan = state["plan"]
    resp = llm.with_structured_output(TaskPlan).with_retry(stop_after_attempt=3, wait_exponential_jitter=True).invoke(
        architect_prompt(plan=plan.model_dump_json())
    )
    if resp is None:
        raise ValueError("Planner did not return a valid response.")

    resp.plan = plan
    print(resp.model_dump_json())
    return {"task_plan": resp}


def coder_agent(state: dict, config: RunnableConfig) -> dict:
    """Generates code for the current task."""
    thread_id = config["configurable"].get("thread_id", "default")
    coder_state: CoderState = state.get("coder_state")
    if coder_state is None:
        coder_state = CoderState(task_plan=state["task_plan"], current_step_idx=0)

    steps = coder_state.task_plan.implementation_steps
    if coder_state.current_step_idx >= len(steps):
        return {"coder_state": coder_state, "status": "DONE"}

    current_task = steps[coder_state.current_step_idx]
    existing_content = read_file.invoke({"path": current_task.filepath})

    system_prompt = coder_system_prompt()
    user_prompt = (
        f"Task: {current_task.task_description}\n"
        f"File: {current_task.filepath}\n"
        f"Existing content:\n{existing_content}\n"
    )
    
    feedback = state.get("reviewer_feedback")
    if feedback:
        user_prompt += f"\nCRITICAL FEEDBACK FROM PREVIOUS ATTEMPT:\n{feedback}\nPlease fix these issues.\n"

    # Direct LLM invocation to bypass fragile Groq native tool calling
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
    response = llm.invoke(messages)
    content = response.content

    # Extract code between <file_content> tags
    match = re.search(r"<file_content>(.*?)</file_content>", content, re.DOTALL)
    if match:
        extracted_code = match.group(1).strip()
    else:
        # Fallback to markdown blocks or raw text if the LLM ignored tags
        match_md = re.search(r"```[a-zA-Z]*\n(.*?)```", content, re.DOTALL)
        if match_md:
            extracted_code = match_md.group(1).strip()
        else:
            extracted_code = content.strip()

    # Manually write the file
    write_file.invoke({"path": current_task.filepath, "content": extracted_code, "project_id": thread_id})

    coder_state.current_step_idx += 1
    return {"coder_state": coder_state}


def reviewer_agent(state: dict, config: RunnableConfig) -> dict:
    """Reviews the coder's work and decides whether to proceed or retry."""
    thread_id = config["configurable"].get("thread_id", "default")
    coder_state: CoderState = state.get("coder_state")
    if not coder_state or coder_state.current_step_idx == 0:
        return {}
        
    finished_idx = coder_state.current_step_idx - 1
    steps = coder_state.task_plan.implementation_steps
    if finished_idx >= len(steps):
         return {}

    current_task = steps[finished_idx]
    file_content = read_file.invoke({"path": current_task.filepath, "project_id": thread_id})
    
    retry_count = state.get("retry_count", 0)
    
    if retry_count >= 3:
        # Give up and move to next task
        return {"reviewer_feedback": "", "retry_count": 0}

    prompt = reviewer_prompt(current_task.task_description, current_task.filepath, file_content)
    reviewer_llm = ChatGroq(model="llama-3.1-8b-instant", max_retries=5)
    
    response = reviewer_llm.invoke(prompt)
    content = response.content
    
    import json
    import re
    match = re.search(r"```json\n(.*?)\n```", content, re.DOTALL)
    if match:
        json_str = match.group(1).strip()
    else:
        json_str = content[content.find('{') : content.rfind('}')+1]
        
    try:
        data = json.loads(json_str)
        is_valid = data.get("is_valid", False)
        feedback = data.get("feedback", "")
    except Exception:
        is_valid = False
        feedback = "Failed to parse reviewer feedback JSON."
    
    if not is_valid:
        coder_state.current_step_idx -= 1
        return {"reviewer_feedback": feedback, "retry_count": retry_count + 1, "coder_state": coder_state}
    
    return {"reviewer_feedback": "", "retry_count": 0, "coder_state": coder_state}


graph = StateGraph(GraphState)

def human_approval(state: dict) -> dict:
    return state

graph.add_node("planner", planner_agent)
graph.add_node("architect", architect_agent)
graph.add_node("human_approval", human_approval)
graph.add_node("coder", coder_agent)
graph.add_node("reviewer", reviewer_agent)

graph.add_edge("planner", "architect")
graph.add_edge("architect", "human_approval")
graph.add_edge("human_approval", "coder")
graph.add_conditional_edges(
    "coder",
    lambda s: "END" if s.get("status") == "DONE" else "reviewer",
    {"END": END, "reviewer": "reviewer"}
)
graph.add_edge("reviewer", "coder")

graph.set_entry_point("planner")
memory = MemorySaver()
agent = graph.compile(checkpointer=memory, interrupt_before=["human_approval"])
if __name__ == "__main__":
    result = agent.invoke({"user_prompt": "Build a colourful modern todo app in html css and js"},
                          {"recursion_limit": 100})
    print("Final State:", result)