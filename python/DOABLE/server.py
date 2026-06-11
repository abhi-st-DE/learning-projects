import json
import logging
import uuid
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from agent.graph import agent

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="DOABLE API")

# Serve static files
static_dir = Path(__file__).parent / "static"
static_dir.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

PROJECTS_DIR = Path.cwd() / "projects"
PROJECTS_DIR.mkdir(exist_ok=True)

class ChatRequest(BaseModel):
    prompt: str

@app.get("/", response_class=HTMLResponse)
async def read_root():
    index_path = static_dir / "index.html"
    if index_path.exists():
        with open(index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Frontend not found</h1>")

@app.post("/api/chat")
async def start_chat(req: ChatRequest):
    thread_id = str(uuid.uuid4())
    logger.info(f"Starting new chat thread {thread_id} for prompt: {req.prompt}")
    return {"thread_id": thread_id}

@app.get("/api/stream/{thread_id}")
async def stream_events(thread_id: str, prompt: str = None, resume: bool = False):
    config = {"configurable": {"thread_id": thread_id}, "recursion_limit": 100}
    
    async def event_generator():
        try:
            if not resume and prompt:
                input_data = {"user_prompt": prompt}
            else:
                input_data = None
                
            # Stream the execution
            for event in agent.stream(input_data, config):
                # event is a dict mapping node names to their output
                for node_name, node_state in event.items():
                    if node_name == "coder":
                        try:
                            cstate = node_state.get("coder_state") if isinstance(node_state, dict) else None
                            if cstate:
                                idx = cstate.get("current_step_idx", 1) - 1 if isinstance(cstate, dict) else cstate.current_step_idx - 1
                                yield {
                                    "event": "coder",
                                    "data": json.dumps({"step": idx})
                                }
                            else:
                                yield {"event": "coder", "data": json.dumps({"step": -1})}
                        except Exception:
                            yield {"event": "coder", "data": json.dumps({"step": -1})}
                    else:
                        yield {
                            "event": "update",
                            "data": json.dumps({"node": node_name, "message": f"✅ {node_name.capitalize()} finished step."})
                        }
                    
            # Execution stopped. Check state.
            state = agent.get_state(config)
            if state.next and ("coder" in state.next or "human_approval" in state.next):
                task_plan = state.values.get("task_plan")
                if task_plan:
                    yield {
                        "event": "interrupt",
                        "data": task_plan.model_dump_json()
                    }
            else:
                yield {"event": "done", "data": "🎉 Project built successfully!"}
        except Exception as e:
            logger.error(f"Error in stream: {e}", exc_info=True)
            yield {"event": "error", "data": str(e)}

    return EventSourceResponse(event_generator())

@app.get("/api/files")
async def list_files(thread_id: str = "default"):
    files = []
    proj_root = PROJECTS_DIR / thread_id
    if proj_root.exists():
        for path in proj_root.rglob("*"):
            if path.is_file():
                files.append(str(path.relative_to(proj_root)))
    return {"files": files}

@app.get("/api/files/{filepath:path}")
async def get_file(filepath: str, thread_id: str = "default"):
    proj_root = PROJECTS_DIR / thread_id
    file_path = (proj_root / filepath).resolve()
    if proj_root.resolve() not in file_path.parents and file_path != proj_root.resolve():
        return {"error": "Invalid path"}
    if file_path.exists() and file_path.is_file():
        return {"content": file_path.read_text(encoding="utf-8")}
    return {"error": "File not found"}
