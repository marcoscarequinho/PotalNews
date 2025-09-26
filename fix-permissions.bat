@echo off
REM PotalNews - Fix Permissions Script (Windows)
REM Script para corrigir problemas no Windows

echo 🔧 Corrigindo configurações do PotalNews para Windows...

REM Verificar se estamos no diretório correto
if not exist "index.js" (
    echo ❌ Erro: Execute este script no diretório raiz do projeto PotalNews
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ❌ Erro: package.json não encontrado
    pause
    exit /b 1
)

REM 1. Verificar Node.js
echo 📦 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado. Instale o Node.js primeiro.
    pause
    exit /b 1
) else (
    echo ✅ Node.js encontrado
)

REM 2. Instalar dependências
echo 📚 Instalando dependências...
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)

REM 3. Fazer build
echo 🏗️ Fazendo build do projeto...
call npm run build:full
if errorlevel 1 (
    echo ⚠️ Aviso: Build falhou, mas continuando...
)

REM 4. Verificar arquivos críticos
echo 📄 Verificando arquivos críticos...
if exist "index.js" echo ✅ index.js encontrado
if exist "app.js" echo ✅ app.js encontrado
if exist "package.json" echo ✅ package.json encontrado

REM 5. Verificar .env
if exist ".env" (
    echo ✅ .env encontrado
) else (
    echo ⚠️ .env não encontrado - criando exemplo...
    echo NODE_ENV=production > .env.example
    echo PORT=3000 >> .env.example
    echo AUTH_MODE=default >> .env.example
    echo # Copie este arquivo para .env e configure suas variáveis >> .env.example
)

REM 6. Configurar firewall (opcional)
echo 🔥 Configurações de firewall...
echo Para permitir acesso ao Node.js, você pode precisar:
echo - Abrir porta 3000 no Windows Firewall
echo - Configurar regras de entrada/saída
echo - Verificar antivírus/software de segurança

REM 7. Testar servidor
echo 🧪 Testando configuração...
timeout /t 2 >nul
node diagnose.js

echo.
echo ✅ Configuração concluída!
echo.
echo 📋 Próximos passos:
echo 1. Configure o arquivo .env com suas variáveis
echo 2. Configure seu servidor web (Apache/IIS) para Node.js
echo 3. Execute: npm start
echo.
echo 🚀 Para iniciar o servidor localmente:
echo    npm run dev
echo.
pause