@echo off
echo ========================================
echo   LaTeX Editor - Setup Backend
echo ========================================
echo.

echo [1/4] Verificando dependencias do sistema...
echo.

REM Verificar pdflatex
where pdflatex >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] pdflatex nao encontrado!
    echo.
    echo Por favor, instale MiKTeX:
    echo https://miktex.org/download
    echo.
    pause
    exit /b 1
)
echo [OK] pdflatex encontrado
pdflatex --version 2>nul | findstr /C:"pdfTeX" >nul
if %ERRORLEVEL% EQU 0 (
    echo     MiKTeX instalado com sucesso
)

echo.

REM Verificar ImageMagick (testar magick.exe primeiro, depois convert.exe)
where magick.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] ImageMagick encontrado
    magick --version 2>nul | findstr /C:"ImageMagick" >nul
    if %ERRORLEVEL% EQU 0 (
        echo     ImageMagick instalado com sucesso
    )
    goto imagemagick_ok
)

where convert.exe >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    goto imagemagick_error
)

REM Verificar se e o ImageMagick convert ou Windows convert
convert -version 2>nul | findstr /C:"ImageMagick" >nul
if %ERRORLEVEL% NEQ 0 (
    goto imagemagick_error
)

echo [OK] ImageMagick encontrado
echo     ImageMagick instalado com sucesso
goto imagemagick_ok

:imagemagick_error
echo [ERRO] ImageMagick nao encontrado!
echo.
echo ========================================
echo   OPCOES DE INSTALACAO:
echo ========================================
echo.
echo 1. MANUAL (Recomendado):
echo    Baixe: https://imagemagick.org/script/download.php
echo    Execute o instalador e marque:
echo    - "Add to system path"
echo    - "Install legacy utilities"
echo.
echo 2. CHOCOLATEY (requer admin):
echo    Abra PowerShell como Administrador:
echo    choco install imagemagick -y
echo.
echo 3. WINGET:
echo    winget install ImageMagick.ImageMagick
echo.
echo Consulte INSTALL-IMAGEMAGICK.md para detalhes
echo ========================================
echo.
pause
exit /b 1

:imagemagick_ok

echo.
echo [2/4] Instalando dependencias do backend...
echo.

cd backend
if not exist "package.json" (
    echo [ERRO] Pasta backend/package.json nao encontrada!
    pause
    exit /b 1
)

call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo [3/4] Configurando arquivo .env...
echo.

cd ..
if not exist ".env" (
    copy .env.example .env
    echo [OK] Arquivo .env criado
) else (
    echo [OK] Arquivo .env ja existe
)

echo.
echo [4/4] Setup concluido!
echo.
echo ========================================
echo   Proximos passos:
echo ========================================
echo.
echo 1. Iniciar backend:
echo    cd backend
echo    npm start
echo.
echo 2. Em outro terminal, iniciar frontend:
echo    npm start
echo.
echo ========================================
echo.
pause
