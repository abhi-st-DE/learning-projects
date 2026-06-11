import pathlib
import subprocess
from typing import Tuple

from langchain_core.tools import tool

PROJECTS_DIR = pathlib.Path.cwd() / "projects"

def safe_path_for_project(path: str, project_id: str) -> pathlib.Path:
    project_root = PROJECTS_DIR / project_id
    project_root.mkdir(parents=True, exist_ok=True)
    p = (project_root / path).resolve()
    if project_root.resolve() not in p.parents and project_root.resolve() != p.parent and project_root.resolve() != p:
        raise ValueError("Attempt to write outside project root")
    return p

@tool
def write_file(path: str, content: str, project_id: str = "default") -> str:
    """Writes content to a file at the specified path within the project root."""
    p = safe_path_for_project(path, project_id)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)
    return f"WROTE:{p}"

@tool
def read_file(path: str, project_id: str = "default") -> str:
    """Reads content from a file at the specified path within the project root."""
    p = safe_path_for_project(path, project_id)
    if not p.exists():
        return ""
    with open(p, "r", encoding="utf-8") as f:
        return f.read()

@tool
def get_current_directory(project_id: str = "default") -> str:
    """Returns the current working directory."""
    return str(PROJECTS_DIR / project_id)

@tool
def list_files(directory: str = ".", project_id: str = "default") -> str:
    """Lists all files in the specified directory within the project root."""
    p = safe_path_for_project(directory, project_id)
    if not p.is_dir():
        return f"ERROR: {p} is not a directory"
    files = [str(f.relative_to(PROJECTS_DIR / project_id)) for f in p.glob("**/*") if f.is_file()]
    return "\n".join(files) if files else "No files found."

@tool
def run_cmd(cmd: str, cwd: str = None, timeout: int = 30, project_id: str = "default") -> Tuple[int, str, str]:
    """Runs a shell command in the specified directory and returns the result."""
    cwd_dir = safe_path_for_project(cwd, project_id) if cwd else (PROJECTS_DIR / project_id)
    res = subprocess.run(cmd, shell=True, cwd=str(cwd_dir), capture_output=True, text=True, timeout=timeout)
    return res.returncode, res.stdout, res.stderr