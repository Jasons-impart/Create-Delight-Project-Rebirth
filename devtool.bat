@echo off
setlocal

title Create Delight Project Rebirth Devtool
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is required. Install Node.js LTS and make sure node is on PATH.
    if "%~1"=="" pause
    exit /b 1
)

set "CDPR_DEVTOOL_LAUNCHED_BY_BAT=1"
node "%~dp0scripts\devtool.mjs" %*
set "EXIT_CODE=%errorlevel%"

if not "%EXIT_CODE%"=="0" (
    echo.
    echo Devtool exited with code: %EXIT_CODE%
    echo Please send the error message above to the maintainer.
    echo.
    if "%~1"=="" pause
    exit /b %EXIT_CODE%
)

if "%~1"=="" (
    pause >nul
)

exit /b 0
