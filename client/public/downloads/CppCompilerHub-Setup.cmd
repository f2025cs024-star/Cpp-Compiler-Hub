@echo off
setlocal
title C++ Compiler Hub - Desktop Setup

echo ============================================================
echo           C++ Compiler Hub - Windows Desktop Setup
echo ============================================================
echo.
echo Installing C++ Compiler Hub to your Windows PC...
echo.

set TARGET_DIR=%LOCALAPPDATA%\CppCompilerHub
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

:: Create Desktop shortcut
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'C++ Compiler Hub.lnk')); $s.TargetPath = 'msedge.exe'; $s.Arguments = '--app=https://cpp-compiler-hub.onrender.com --window-size=1280,820'; $s.Description = 'C++ Compiler Hub - Online Interactive IDE'; $s.Save()"

:: Create Start Menu shortcut
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([System.IO.Path]::Combine([Environment]::GetFolderPath('StartMenu'), 'Programs', 'C++ Compiler Hub.lnk')); $s.TargetPath = 'msedge.exe'; $s.Arguments = '--app=https://cpp-compiler-hub.onrender.com --window-size=1280,820'; $s.Description = 'C++ Compiler Hub - Online Interactive IDE'; $s.Save()"

echo [SUCCESS] Desktop and Start Menu shortcuts created!
echo [SUCCESS] Launching C++ Compiler Hub...
echo.

start msedge --app=https://cpp-compiler-hub.onrender.com --window-size=1280,820
exit
