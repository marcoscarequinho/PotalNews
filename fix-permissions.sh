#!/bin/bash

# PotalNews - Fix Permissions Script
# Script para corrigir permissões e resolver erro 403

echo "🔧 Corrigindo permissões do PotalNews..."

# Verificar se estamos no diretório correto
if [ ! -f "index.js" ] || [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto PotalNews"
    exit 1
fi

# 1. Corrigir permissões de diretórios
echo "📁 Corrigindo permissões de diretórios..."
find . -type d -exec chmod 755 {} \;

# 2. Corrigir permissões de arquivos gerais
echo "📄 Corrigindo permissões de arquivos..."
find . -type f -exec chmod 644 {} \;

# 3. Tornar scripts executáveis
echo "🚀 Tornando scripts executáveis..."
chmod +x index.js
chmod +x app.js
chmod +x diagnose.js
chmod +x fix-permissions.sh

# 4. Permissões específicas para Node.js
echo "⚙️  Configurando permissões para Node.js..."
chmod 755 index.js app.js

# 5. Diretório de uploads (se existir)
if [ -d "uploads" ]; then
    echo "📤 Configurando diretório de uploads..."
    chmod 755 uploads/
    if [ "$(ls -A uploads/)" ]; then
        chmod 644 uploads/*
    fi
fi

# 6. Diretório dist (se existir)
if [ -d "dist" ]; then
    echo "🏗️  Configurando diretório dist..."
    find dist/ -type d -exec chmod 755 {} \;
    find dist/ -type f -exec chmod 644 {} \;
fi

# 7. Node modules
if [ -d "node_modules" ]; then
    echo "📚 Configurando node_modules..."
    find node_modules/ -type d -exec chmod 755 {} \;
    find node_modules/ -type f -name "*.js" -exec chmod 755 {} \;
fi

# 8. Verificar proprietário (se executado como root)
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  Executando como root - configurando proprietário..."
    read -p "Digite o usuário do servidor web (ex: www-data, apache, nginx): " WEBUSER
    if [ ! -z "$WEBUSER" ]; then
        chown -R $WEBUSER:$WEBUSER .
        echo "✅ Proprietário alterado para $WEBUSER"
    fi
fi

echo ""
echo "✅ Permissões corrigidas com sucesso!"
echo ""
echo "📋 Resumo das permissões aplicadas:"
echo "   - Diretórios: 755 (rwxr-xr-x)"
echo "   - Arquivos: 644 (rw-r--r--)"
echo "   - Scripts: 755 (rwxr-xr-x)"
echo ""
echo "🧪 Para verificar as correções, execute:"
echo "   node diagnose.js"
echo ""
echo "🚀 Para iniciar o servidor:"
echo "   npm start"