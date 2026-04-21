# PowerShell Script para iniciar Homara en desarrollo

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HOMARA - Development Startup Script  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que npm esté instalado
Write-Host "Verificando npm..." -ForegroundColor Yellow
npm -v | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm no está instalado" -ForegroundColor Red
    exit 1
}

# Mostrar instrucciones
Write-Host "Para que la conexión funcione, necesitas ejecutar en 2 terminales separadas:" -ForegroundColor Green
Write-Host ""
Write-Host "========== TERMINAL 1: Backend ==========" -ForegroundColor Green
Write-Host ""
Write-Host "  cd backend" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "========== TERMINAL 2: Frontend ==========" -ForegroundColor Green  
Write-Host ""
Write-Host "  cd frontend" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "========== VERIFICAR CONEXIÓN ==========" -ForegroundColor Green
Write-Host ""
Write-Host "Abre en el navegador:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000/test-connection" -ForegroundColor Cyan
Write-Host ""
Write-Host "O visita el catálogo:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000/catalogo" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Preguntar si desea iniciar el backend
$answer = Read-Host "¿Deseas iniciar el backend ahora? (s/n)"
if ($answer -eq "s") {
    Write-Host ""
    Write-Host "Iniciando Backend..." -ForegroundColor Green
    Write-Host "Escucha en http://localhost:5000" -ForegroundColor Cyan
    Write-Host ""
    cd backend
    npm run dev
}
