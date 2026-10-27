@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo Node nao encontrado. Instale o Node 24 e rode novamente.
    pause
    exit /b 1
)

if not exist node_modules (
    echo Instalando dependencias...
    call npm install --no-audit --no-fund
)

if not exist data\caderno.db (
    echo Criando banco com dados de exemplo...
    call npm run seed
)

echo.
echo   Caderno de Jogos
echo   http://localhost:3000
echo   Ctrl+C para encerrar
echo.

call npm run dev
