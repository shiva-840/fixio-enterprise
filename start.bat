@echo off
color 0A
echo ========================================================
echo        Fixio Enterprise Platform - Launch Sequence
echo ========================================================
echo.

echo [1/2] Booting FastAPI Backend and loading AI Models...
start "Fixio Backend Server" cmd /k ".\venv\Scripts\python.exe -m uvicorn main:app --reload"

echo [2/2] Booting React Frontend Server...
start "Fixio Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo Launch sequence initiated! 
echo Two new terminal windows have opened to run the servers.
echo You can now access the app at: http://localhost:3000
echo.
pause
