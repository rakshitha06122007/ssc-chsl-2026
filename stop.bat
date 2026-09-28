@echo off
title CHSL Mastery - Shutdown
echo Stopping CHSL Mastery local processes...

REM Kill python backend on port 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

REM Kill vite/node on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo CHSL Mastery servers stopped.
timeout /t 2 >nul
exit
