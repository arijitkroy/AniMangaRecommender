#!/bin/bash

# Anime & Manga Recommendation System - Startup Script

echo "Starting Anime & Manga Recommendation System..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if required commands are available
if ! command_exists python3; then
    echo "Error: python3 is not installed"
    exit 1
fi

if ! command_exists npm; then
    echo "Error: npm is not installed"
    exit 1
fi

# Start backend in background
echo "Starting backend server..."
cd backend
pip install -r requirements.txt
python app.py &

# Store the process ID
BACKEND_PID=$!

# Give backend a moment to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm install
npm run dev

# Kill backend when frontend is stopped
kill $BACKEND_PID
