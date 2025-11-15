@echo off
echo Building mucchad...
zig build
if %errorlevel% equ 0 (
    echo Build successful!
    echo mucchad.exe should be in the output directory
) else (
    echo Build failed with error code %errorlevel%
)
pause