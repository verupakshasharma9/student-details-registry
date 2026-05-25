#!/bin/bash

# ==============================================================================
# Student Details Registry - Self-Contained Local Setup and Run Script
# This script downloads portable Python 3.11 and Node.js 20 runtimes for macOS arm64,
# installs all dependencies, and launches both frontend and backend on localhost.
# No system-level installation or Xcode-select tools are required.
# ==============================================================================

set -e

WORKSPACE_DIR="/Users/durgaprasadponukumati/.gemini/antigravity/scratch/student-details-registry"
RUNTIMES_DIR="$WORKSPACE_DIR/runtimes"

echo "======================================================================"
echo "🚀 Bootstrapping Self-Contained Environment on Local Host (macOS arm64)"
echo "======================================================================"
echo "Workspace: $WORKSPACE_DIR"
echo "Runtimes directory: $RUNTIMES_DIR"
echo ""

mkdir -p "$RUNTIMES_DIR"

# 1. Download and Extract Node.js Standalone Runtime
NODE_VERSION="20.12.2"
NODE_DIR="$RUNTIMES_DIR/node-v$NODE_VERSION-darwin-arm64"
NODE_BIN_DIR="$NODE_DIR/bin"

if [ ! -d "$NODE_DIR" ]; then
    echo "📦 Downloading portable Node.js v$NODE_VERSION..."
    NODE_TARBALL="$RUNTIMES_DIR/node.tar.gz"
    curl -L "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-darwin-arm64.tar.gz" -o "$NODE_TARBALL"
    
    echo "📂 Extracting Node.js..."
    tar -xzf "$NODE_TARBALL" -C "$RUNTIMES_DIR"
    rm "$NODE_TARBALL"
    echo "✅ Node.js standalone setup complete."
else
    echo "✅ Standalone Node.js already present."
fi

# 2. Download and Extract Python Standalone Runtime
PYTHON_VERSION="3.11.7"
PYTHON_DIR="$RUNTIMES_DIR/python"
PYTHON_BIN_DIR="$PYTHON_DIR/bin"

if [ ! -d "$PYTHON_DIR" ]; then
    echo "📦 Downloading portable Python v$PYTHON_VERSION (standalone)..."
    PYTHON_TARBALL="$RUNTIMES_DIR/python.tar.gz"
    curl -L "https://github.com/indygreg/python-build-standalone/releases/download/20240107/cpython-$PYTHON_VERSION+20240107-aarch64-apple-darwin-install_only.tar.gz" -o "$PYTHON_TARBALL"
    
    echo "📂 Extracting Python..."
    mkdir -p "$PYTHON_DIR"
    tar -xzf "$PYTHON_TARBALL" -C "$PYTHON_DIR" --strip-components=1
    rm "$PYTHON_TARBALL"
    echo "✅ Standalone Python setup complete."
else
    echo "✅ Standalone Python already present."
fi

# 3. Configure PATH to prioritize portable runtimes
export PATH="$NODE_BIN_DIR:$PYTHON_BIN_DIR:$PATH"

echo ""
echo "🔍 Verifying active runtimes:"
echo "👉 Node.js version: $(node --version)"
echo "👉 npm version: $(npm --version)"
echo "👉 Python version: $(python3 --version)"
echo ""

# 4. Bootstrap Python Virtual Environment
VENV_DIR="$WORKSPACE_DIR/venv"
if [ ! -d "$VENV_DIR" ]; then
    echo "🐍 Creating isolated Python Virtual Environment (venv)..."
    python3 -m venv "$VENV_DIR"
    echo "✅ Virtual environment created."
fi

echo "🔌 Activating virtual environment..."
source "$VENV_DIR/bin/activate"

echo "📦 Upgrading pip..."
pip install --upgrade pip

echo "📦 Installing Backend Dependencies..."
pip install -r "$WORKSPACE_DIR/backend/requirements.txt"
echo "✅ Backend dependencies installed."

# 5. Bootstrap Frontend Dependencies
echo "📦 Installing Frontend Dependencies..."
cd "$WORKSPACE_DIR/frontend"
npm install
echo "✅ Frontend dependencies installed."

# 6. Launch Applications
echo ""
echo "======================================================================"
echo "🏁 Starting Local Host Servers..."
echo "======================================================================"

# Track child processes
pids=()

# Clean shutdown function
cleanup() {
    echo ""
    echo "🛑 Shutting down backend and frontend servers..."
    for pid in "${pids[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
        fi
    done
    echo "👋 Servers stopped. Cleanup completed."
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "⚙️ Starting FastAPI Backend at http://127.0.0.1:8000..."
cd "$WORKSPACE_DIR/backend"
# Set environment variables for config
export DATABASE_URL="sqlite:///./student_records.db"
export JWT_SECRET="development_secret_key"
export ACCESS_TOKEN_EXPIRE_MINUTES="30"

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 > "$WORKSPACE_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
pids+=("$BACKEND_PID")
echo "👉 Backend running in background (PID: $BACKEND_PID). Logs: $WORKSPACE_DIR/backend.log"

# Wait a brief moment to let the backend bind to the port
sleep 2

echo "⚙️ Starting React + Vite Frontend at http://127.0.0.1:3000..."
cd "$WORKSPACE_DIR/frontend"
npm run dev -- --host 127.0.0.1 --port 3000 &
FRONTEND_PID=$!
pids+=("$FRONTEND_PID")
echo "👉 Frontend running in background (PID: $FRONTEND_PID)."
echo ""
echo "🟢 Services launched successfully!"
echo "👉 Frontend: http://127.0.0.1:3000"
echo "👉 Backend API: http://127.0.0.1:8000"
echo "👉 Swagger Docs: http://127.0.0.1:8000/docs"
echo ""
echo "Press [Ctrl+C] to stop both servers."
echo "======================================================================"

# Keep script running to maintain servers
wait
