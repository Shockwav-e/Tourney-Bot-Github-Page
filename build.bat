@echo off
set PATH=C:\Users\Uday\Downloads\Programs\w64devkit\bin;%PATH%

echo Compiling resources...
windres etc/clumsy.rc -O coff -o mucchad_res.o -D X64

echo Building mucchad...
gcc -o mucchad.exe src/*.c mucchad_res.o -I external/WinDivert-2.2.0-A/include -I external/iup-3.30_Win64_mingw6_lib/include -L external/WinDivert-2.2.0-A/x64 -L external/iup-3.30_Win64_mingw6_lib external/iup-3.30_Win64_mingw6_lib/libiup.a -lWinDivert -lcomctl32 -lWinmm -lws2_32 -liphlpapi -lkernel32 -lgdi32 -lcomdlg32 -luuid -lole32 -mwindows -O2

if %errorlevel% equ 0 (
    echo Build successful!
    echo mucchad.exe is ready
) else (
    echo Build failed!
)
pause
