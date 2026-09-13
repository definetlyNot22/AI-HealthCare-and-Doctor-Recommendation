@echo off
title TriHealth AI - Health Care & Doctor Recommendation System
echo ======================================================================
echo           TriHealth AI - Tri-Paradigm Medical Platform
echo          (Ayurveda + Homeopathy + Allopathy + Doctor Booking)
echo ======================================================================
echo.

REM Check if Python venv exists
if not exist "backend\venv\Scripts\python.exe" (
    echo [*] Creating Python virtual environment...
    python -m venv backend\venv
    echo [*] Installing backend dependencies...
    backend\venv\Scripts\python.exe -m pip install -r backend\requirements.txt
)

REM Check if frontend node_modules exists
if not exist "frontend\node_modules" (
    echo [*] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo [*] Starting Backend Server (FastAPI on http://127.0.0.1:8000)...
start "TriHealth AI Backend" cmd /k "cd /d %~dp0backend && ..\backend\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [*] Starting Frontend Server (Vite on http://localhost:5173)...
start "TriHealth AI Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ======================================================================
echo  Servers are launching!
echo  Backend:  http://127.0.0.1:8000 (Swagger docs at /docs)
echo  Frontend: http://localhost:5173
echo ======================================================================
echo.
timeout /t 3 >nul
start http://localhost:5173
