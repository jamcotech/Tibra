@echo off
cd /d "D:\E\Tibra Project\Tibra website"
echo ========================================================
echo Pushing Tibra Natural project to GitHub:
echo https://github.com/jamcotech/Tibra
echo (node_modules is 100%% excluded)
echo ========================================================
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ----------------------------------------------------
    echo If push failed, please ensure:
    echo 1. You created the repo on https://github.com/new with name: Tibra
    echo 2. You are logged into GitHub in your browser
    echo ----------------------------------------------------
)
pause
