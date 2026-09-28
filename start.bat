@echo off
title CHSL Mastery - SSC CHSL 2026 Complete Preparation Platform
color 0B
echo ============================================================
echo   CHSL Mastery - SSC CHSL 2026 Complete Preparation Platform
echo ============================================================
echo.

cd /d "%~dp0"

REM 1. Set Node PATH if OpenAI runtime is present
if exist "C:\Users\raksh\AppData\Local\OpenAI\Codex\runtimes\cua_node\f53823cd54b14f45\bin\node.exe" (
    set "PATH=C:\Users\raksh\AppData\Local\OpenAI\Codex\runtimes\cua_node\f53823cd54b14f45\bin;%PATH%"
)

REM 2. Check if Backend (Port 5000) is running
netstat -ano | findstr ":5000 " | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo [*] Backend API is already running on port 5000.
) else (
    echo [*] Starting Backend Server (Flask) on port 5000...
    start /b python -B backend/app/main.py > backend.log 2>&1
    timeout /t 2 /nobreak >nul
)

REM 3. Verify Server Health
curl.exe -s http://127.0.0.1:5000/api/chsl/status >nul
if %errorlevel% equ 0 (
    echo [v] CHSL Mastery Backend is HEALTHY.
) else (
    echo [!] Backend initializing...
)

echo.
echo ============================================================
echo   CHSL Mastery is LIVE!
echo   Main URL: http://localhost:5000
echo   Zero login required • Free core learning platform
echo ============================================================
echo.

REM 4. Open in Default Web Browser
start http://localhost:5000

timeout /t 3 >nul
exit
