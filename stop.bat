@echo off
title TrustHire AI - Shutdown
echo Stopping TrustHire AI processes...

REM Kill python app on port 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

REM Kill vite/node on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo TrustHire servers stopped.
timeout /t 2 >nul
exit
