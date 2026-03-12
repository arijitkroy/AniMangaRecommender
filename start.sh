#!/usr/bin/env bash

set -euo pipefail

# AniMangaRecommender - Startup Script

echo "Starting AniMangaRecommender..."

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

if ! command_exists python3; then
    echo "Error: python3 is not installed"
    exit 1
fi

if ! command_exists npm; then
    echo "Error: npm is not installed"
    exit 1
fi

cleanup() {
    if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo "Stopping backend server (PID: $BACKEND_PID)..."
        kill "$BACKEND_PID" 2>/dev/null || true
        wait "$BACKEND_PID" 2>/dev/null || true
    fi
}

trap cleanup EXIT INT TERM

echo "Installing backend dependencies..."
python3 -m pip install -r "$BACKEND_DIR/requirements.txt"

echo "Starting backend server..."
(
    cd "$BACKEND_DIR"
    python3 app.py
) &
BACKEND_PID=$!

sleep 3

echo "Installing frontend dependencies..."
(
    cd "$FRONTEND_DIR"
    npm install
)

echo "Starting frontend server..."
cd "$FRONTEND_DIR"
npm run dev