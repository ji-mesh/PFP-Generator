@echo off
REM @jimesh/pfp-generator — Windows Double-Click Launcher (starts server + opens browser)
cd /d "%~dp0"
set PORT=4180
set URL=http://127.0.0.1:%PORT%

echo [PFP-Generator] Starting backend server on %URL% ...
start "JiMesh PFP Generator Server" /min node backend\server.js
timeout /t 1 /nobreak >nul
start "" "%URL%"
