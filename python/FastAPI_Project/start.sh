#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# Automatically kill all background processes started by this script on exit (Ctrl+C)
trap "kill 0" EXIT

echo "🚀 Starting FastAPI backend..."
uv run main.py &

# Wait a brief moment for the backend to initialize
sleep 2

echo "✨ Starting Streamlit frontend..."
uv run streamlit run frontend.py &

# Wait for all background jobs to finish
wait
