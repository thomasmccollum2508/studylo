@echo off
cd /d "%~dp0"
echo Starting dev server in: %CD%
node node_modules\next\dist\bin\next dev --webpack
pause
