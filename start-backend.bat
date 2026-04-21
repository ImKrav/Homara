@echo off
REM Iniciar Homara Backend y Frontend en desarrollo

echo.
echo ========================================
echo   HOMARA - Development Startup
echo ========================================
echo.

REM Verificar que npm está instalado
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm no está instalado
    pause
    exit /b 1
)

echo Iniciando Backend (Puerto 5000)...
echo Abre una nueva terminal después para iniciar el Frontend
echo.

cd backend
npm run dev
