@echo off
setlocal

title Create Delight Project Rebirth Devtool
cd /d "%~dp0"

set "CDPR_DEVTOOL_LAUNCHED_BY_BAT=1"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\devtool.ps1" %*
set "EXIT_CODE=%errorlevel%"

if not "%EXIT_CODE%"=="0" (
    echo.
    echo Devtool exited with code: %EXIT_CODE%
    echo Please send the error message above to the maintainer.
    echo.
    pause
    exit /b %EXIT_CODE%
)

if "%~1"=="" (
    pause >nul
)

exit /b 0
