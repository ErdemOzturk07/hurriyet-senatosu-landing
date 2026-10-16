@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Hurriyet Senatosu - Onizleme

rem Sunucu zaten calisiyor mu? (port 8000 dinleniyor mu)
netstat -an | findstr /R /C:":8000 " | findstr LISTENING >nul
if not errorlevel 1 goto zaten

where python >nul 2>nul
if errorlevel 1 goto pythonyok

echo.
echo  Hurriyet Senatosu onizleme sunucusu baslatiliyor...
echo  Adres: http://localhost:8000
echo  Durdurmak icin: bu pencerede Ctrl+C (veya pencereyi kapat)
echo.
python scripts\serve.py 8000 --open
pause
exit /b

:zaten
echo Sunucu zaten calisiyor. Tarayici aciliyor: http://localhost:8000
start "" http://localhost:8000/
timeout /t 3 >nul
exit /b

:pythonyok
echo.
echo  Python bulunamadi.
echo  Cozum 1: https://www.python.org/downloads/ adresinden kur (PATH'e ekle)
echo           ve bu dosyayi tekrar cift tikla.
echo  Cozum 2: index.html dosyasina cift tikla - sunucu gerekmeden de onizlenir.
echo.
pause
exit /b
