@echo off
cd /d "%~dp0"
echo Installing dependencies in: %CD%
npm install
echo.
echo Done. Press any key to close.
pause >nul
