#!/usr/bin/env node

/**
 * PotalNews - Diagnostic Script
 * Script para diagnosticar problemas de Access Denied (403)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 PotalNews - Diagnóstico do Servidor\n');

// 1. Verificar arquivos essenciais
console.log('📁 Verificando arquivos essenciais...');
const essentialFiles = [
  'index.js',
  'app.js',
  'package.json',
  'api/index.ts',
  'client/index.html'
];

essentialFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} - Tamanho: ${stats.size} bytes`);
  } else {
    console.log(`❌ ${file} - ARQUIVO NÃO ENCONTRADO`);
  }
});

// 2. Verificar permissões (Linux/Unix)
console.log('\n🔐 Verificando permissões...');
if (process.platform !== 'win32') {
  try {
    const indexStats = fs.statSync(path.join(__dirname, 'index.js'));
    const mode = (indexStats.mode & parseInt('777', 8)).toString(8);
    console.log(`📄 index.js - Permissões: ${mode}`);

    if (mode < '644') {
      console.log('⚠️  Permissões insuficientes para index.js');
      console.log('🔧 Execute: chmod 755 index.js');
    }
  } catch (error) {
    console.log('❌ Erro ao verificar permissões:', error.message);
  }
} else {
  console.log('ℹ️  Sistema Windows - verificação de permissões não aplicável');
}

// 3. Verificar package.json
console.log('\n📦 Verificando package.json...');
try {
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  console.log(`✅ Nome: ${packageJson.name}`);
  console.log(`✅ Versão: ${packageJson.version}`);
  console.log(`✅ Tipo: ${packageJson.type || 'commonjs'}`);
  console.log(`✅ Main: ${packageJson.main || 'não definido'}`);

  if (packageJson.main !== 'index.js') {
    console.log('⚠️  Main entry point não está definido como index.js');
  }

  if (packageJson.type !== 'module') {
    console.log('⚠️  Tipo não está definido como "module"');
  }
} catch (error) {
  console.log('❌ Erro ao ler package.json:', error.message);
}

// 4. Verificar variáveis de ambiente
console.log('\n🌍 Verificando variáveis de ambiente...');
const envVars = ['NODE_ENV', 'PORT', 'AUTH_MODE', 'VERCEL', 'LSWS_PORT'];
envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚪ ${varName}: não definida`);
  }
});

// 5. Verificar arquivo .env
console.log('\n📄 Verificando arquivo .env...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo .env encontrado');
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    console.log(`📝 ${lines.length} variáveis definidas no .env`);
  } catch (error) {
    console.log('❌ Erro ao ler .env:', error.message);
  }
} else {
  console.log('⚠️  Arquivo .env não encontrado');
  console.log('💡 Crie um arquivo .env com suas configurações');
}

// 6. Verificar node_modules
console.log('\n📚 Verificando dependências...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules encontrado');
} else {
  console.log('❌ node_modules NÃO encontrado');
  console.log('🔧 Execute: npm install');
}

// 7. Verificar build
console.log('\n🏗️  Verificando build...');
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log('✅ Diretório dist/ encontrado');

  const apiDistPath = path.join(distPath, 'api', 'index.js');
  if (fs.existsSync(apiDistPath)) {
    console.log('✅ Build da API encontrado');
  } else {
    console.log('⚠️  Build da API não encontrado');
    console.log('🔧 Execute: npm run build:api');
  }
} else {
  console.log('⚠️  Diretório dist/ não encontrado');
  console.log('🔧 Execute: npm run build:full');
}

// 8. Testar import do módulo principal
console.log('\n🧪 Testando import do módulo...');
try {
  // Teste básico de import
  const indexPath = path.join(__dirname, 'index.js');
  console.log(`📍 Tentando importar: ${indexPath}`);

  // Verificar sintaxe básica
  const content = fs.readFileSync(indexPath, 'utf8');
  if (content.includes('import ') && content.includes('export ')) {
    console.log('✅ Sintaxe ES modules detectada');
  } else if (content.includes('require(') && content.includes('module.exports')) {
    console.log('⚠️  Sintaxe CommonJS detectada - pode causar problemas');
  }

} catch (error) {
  console.log('❌ Erro no teste de import:', error.message);
}

// 9. Sugestões de correção
console.log('\n💡 Sugestões para resolver Access Denied (403):\n');
console.log('1. Verificar permissões: chmod 755 index.js app.js');
console.log('2. Instalar dependências: npm install');
console.log('3. Fazer build: npm run build:full');
console.log('4. Configurar .env com variáveis necessárias');
console.log('5. Verificar configuração do servidor web');
console.log('6. Para OpenLiteSpeed: configurar Script Handler para Node.js');
console.log('7. Para Apache: verificar se mod_rewrite está ativo');
console.log('8. Testar localmente: npm run dev');

console.log('\n🚀 Para mais detalhes, consulte: server-config.md');
console.log('📞 Se o problema persistir, verifique os logs do servidor\n');