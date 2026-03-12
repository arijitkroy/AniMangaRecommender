@echo off
title Anime & Manga Recommendation System

echo Starting Anime & Manga Recommendation System...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Install backend dependencies and start server
echo Installing backend dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    cd ..
    pause
    exit /b 1
)

echo Starting backend server...
start "Backend Server" cmd /k "python app.py"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Install frontend dependencies and start server
echo Installing frontend dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo Starting frontend server...
call npm run dev

echo.
echo Press any key to close all servers...
pause >nul
