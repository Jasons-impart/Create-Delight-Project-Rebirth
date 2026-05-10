@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

set "CONFIG_FILE=variables.txt"

if not exist "%CONFIG_FILE%" (
    echo Error: config file "%CONFIG_FILE%" does not exist.
    echo Please check whether the server pack was extracted correctly.
    pause
    exit /b 1
)

for /f "usebackq delims=" %%a in ("%CONFIG_FILE%") do (
    set "line=%%a"
    if not "!line!"=="" (
        if not "!line:~0,1!"=="#" (
            for /f "tokens=1,* delims==" %%b in ("!line!") do (
                set "varName=%%b"
                set "varValue=%%c"
                if not "!varValue!"=="" (
                    set "!varName!=!varValue!"
                    echo !varName!=!varValue!
                )
            )
        )
    )
)

if not defined JAVA set "JAVA=java"
if not defined NEOFORGE_INSTALLER set "NEOFORGE_INSTALLER=neoforge.jar"
if not defined RECOMMENDED_JAVA_VER set "RECOMMENDED_JAVA_VER=21"
if not defined ACCEPT_EULA set "ACCEPT_EULA=false"
if not defined AUTO_RESTART set "AUTO_RESTART=false"
if not defined RESTART_DELAY_SECONDS set "RESTART_DELAY_SECONDS=10"
if not defined NEOFORGE_VERSION (
    echo Error: NEOFORGE_VERSION must be set in %CONFIG_FILE%.
    pause
    exit /b 1
)
if not defined NEOFORGE_INSTALLER_URL set "NEOFORGE_INSTALLER_URL=https://maven.neoforged.net/releases/net/neoforged/neoforge/!NEOFORGE_VERSION!/neoforge-!NEOFORGE_VERSION!-installer.jar"

echo Checking Java existence...
%JAVA% -version >nul 2>&1
if errorlevel 1 (
    echo Java not found. Install Java %RECOMMENDED_JAVA_VER% or set JAVA in %CONFIG_FILE%.
    pause
    exit /b 1
)

for /f "tokens=3 delims= " %%i in ('%JAVA% -version 2^>^&1 ^| findstr /i "version"') do (
    set "JAVA_VER=%%i"
)
set "JAVA_VER=!JAVA_VER:"=!"
for /f "delims=. tokens=1" %%a in ("!JAVA_VER!") do set "MAJOR_VER=%%a"
echo Detected Java version: !JAVA_VER!, major version: !MAJOR_VER!

if not "!MAJOR_VER!"=="!RECOMMENDED_JAVA_VER!" (
    echo Error: detected Java !MAJOR_VER!, but Java !RECOMMENDED_JAVA_VER! is required for Minecraft !MC_VERSION!.
    echo Set JAVA in %CONFIG_FILE% to a Java !RECOMMENDED_JAVA_VER! executable.
    pause
    exit /b 1
)

set "NEOFORGE_ARGS=libraries\net\neoforged\neoforge\!NEOFORGE_VERSION!\win_args.txt"
if not exist "!NEOFORGE_ARGS!" (
    echo NeoForge argument file not found. Installing NeoForge server...
    if not exist "%NEOFORGE_INSTALLER%" (
        echo NeoForge installer "%NEOFORGE_INSTALLER%" not found. Downloading...
        where curl.exe >nul 2>&1
        if errorlevel 1 (
            powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri '%NEOFORGE_INSTALLER_URL%' -OutFile '%NEOFORGE_INSTALLER%'"
        ) else (
            curl.exe --ssl-no-revoke -fL --retry 3 --retry-connrefused -o "%NEOFORGE_INSTALLER%" "%NEOFORGE_INSTALLER_URL%"
        )
        if errorlevel 1 (
            echo Failed to download NeoForge installer from:
            echo %NEOFORGE_INSTALLER_URL%
            pause
            exit /b 1
        )
        if not exist "%NEOFORGE_INSTALLER%" (
            echo Download finished but "%NEOFORGE_INSTALLER%" was not created.
            pause
            exit /b 1
        )
    )
    %JAVA% -jar "%NEOFORGE_INSTALLER%" --installServer
    if errorlevel 1 (
        echo NeoForge install failed. Check the error above.
        pause
        exit /b 1
    )
    if not exist "!NEOFORGE_ARGS!" (
        echo NeoForge install completed but "!NEOFORGE_ARGS!" was not generated.
        pause
        exit /b 1
    )
)

if not exist user_jvm_args.txt (
    echo !JVM_ARGS! > user_jvm_args.txt
)

if /I "!ACCEPT_EULA!"=="true" (
    if not exist eula.txt (
        echo eula=true > eula.txt
    )
    findstr /I /C:"eula=true" eula.txt >nul 2>&1
    if errorlevel 1 (
        echo eula=true > eula.txt
    )
) else (
    if not exist eula.txt (
        echo Error: eula.txt does not exist. Set ACCEPT_EULA=true in %CONFIG_FILE% or create eula.txt manually.
        pause
        exit /b 1
    )
    findstr /I /C:"eula=true" eula.txt >nul 2>&1
    if errorlevel 1 (
        echo Error: eula.txt does not contain eula=true.
        pause
        exit /b 1
    )
)

:launch
echo Launching server...
%JAVA% @user_jvm_args.txt @"!NEOFORGE_ARGS!" %*
set "SERVER_EXIT_CODE=%errorlevel%"

if /I "!AUTO_RESTART!"=="true" (
    echo Server exited with code !SERVER_EXIT_CODE!. Restarting in !RESTART_DELAY_SECONDS! seconds...
    timeout /t !RESTART_DELAY_SECONDS! /nobreak
    goto launch
)

pause
exit /b %SERVER_EXIT_CODE%

endlocal
