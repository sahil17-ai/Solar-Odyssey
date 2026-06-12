@echo off
echo ==============================================
echo        SOLAR ODYSSEY - INITIALIZING
echo ==============================================

cd /d "%~dp0solar-odyssey-app"

echo Installing dependencies...
call npm install

echo Starting Solar Odyssey...
call npm run dev

pause
