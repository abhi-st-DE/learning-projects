# ✨ DOABLE

Welcome to **DOABLE** — an ambitious, self-correcting AI coding agent designed to take a single prompt and output a complete, fully functional project. 

Inspired by platforms like Lovable and v0, DOABLE was built with one core engineering philosophy: **Keep it simple, keep it robust, and make it beautiful.**

## 🎯 The Philosophy
Many AI coding agents rely on highly complex native API features (like structured tool calling) that frequently hallucinate and crash entire backend servers. DOABLE strips away that fragility. We parse raw, standard AI outputs locally using robust regex extraction and custom sandboxing, resulting in an agent that is incredibly stable, highly resilient, and virtually crash-proof. 

## 🧠 Architecture
Under the hood, DOABLE uses **LangGraph** to coordinate a team of specialized AI agents working together in a continuous loop:

1. **The Planner:** Takes your raw prompt, designs the tech stack, and decides what files need to be created.
2. **The Architect:** Breaks the project down into bite-sized, sequential implementation steps.
3. **The Coder:** Writes the actual code for each file.
4. **The Reviewer (Human-in-the-Loop):** A strict review agent that catches logic mismatches and syntax errors, kicking the code back to the Coder for revisions until it's perfect.

## 🚀 Features
- **Beautiful UI:** A stunning, Glassmorphism-styled web interface built in vanilla HTML/CSS/JS.
- **Isolated Sandboxing:** Every project you generate gets its own dedicated, isolated folder inside the `projects/` directory to ensure dependencies never clash.
- **Real-Time Streaming:** The backend uses Server-Sent Events (SSE) to stream the agent's thought process and progress directly to the frontend.
- **Human-in-the-Loop:** View and approve the Architect's task plan before the Coder starts spending tokens.
- **Live Code Viewer:** Click any generated file in the sidebar to view the syntax-highlighted code instantly.

## 🛠️ How to Run

DOABLE uses `uv` for lightning-fast python package management. 

1. Ensure `uv` is installed on your system.
2. Start the FastAPI backend:
   ```bash
   uv run main.py
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```
4. Type what you want to build into the chat box, click Generate, and watch DOABLE do the rest!

---
*Built with ❤️ for a future where coding is DOABLE for everyone.*
