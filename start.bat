@echo off
setlocal EnableExtensions EnableDelayedExpansion
title AniMangaRecommender

echo Starting AniMangaRecommender...

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"

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
python -m pip install -r "%BACKEND_DIR%\requirements.txt"
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo Starting backend server...
start "Backend Server" cmd /k "cd /d ""%BACKEND_DIR%"" && python app.py"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Install frontend dependencies and start server
echo Installing frontend dependencies...
cd /d "%FRONTEND_DIR%"
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo Starting frontend server...
call npm run dev

echo.
echo Frontend stopped. Close the "Backend Server" window if it is still running.
pause