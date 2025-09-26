#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔨 Building with Node.js directly...');

try {
  // Build frontend
  console.log('📦 Building frontend...');
  const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  execSync(`node "${vitePath}" build`, { stdio: 'inherit' });

  // Build API
  console.log('🔧 Building API...');
  const esbuildPath = path.join(__dirname, 'node_modules', '.bin', 'esbuild');
  execSync(`node "${esbuildPath}" api/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/api/index.js`, { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}