#!/usr/bin/env node

/**
 * PotalNews - Web Entry Point
 * Universal entry point that handles different deployment environments
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

async function startApplication() {
  console.log('🚀 Starting PotalNews application...');
  console.log(`📍 Working directory: ${process.cwd()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Auth mode: ${process.env.AUTH_MODE || 'default'}`);

  try {
    // Check if we're in a Vercel environment
    if (process.env.VERCEL) {
      console.log('☁️  Vercel environment detected - using serverless handler');
      const { default: handler } = await import('./api/vercel-handler.js');
      return handler;
    }

    // Check if we're in OpenLiteSpeed environment
    if (process.env.LSWS_PORT || process.env.OPENLITESPEED) {
      console.log('🌐 OpenLiteSpeed environment detected - using app.js');
      const appModule = await import('./app.js');
      return await appModule.startApp();
    }

    // Default: use the main API server
    console.log('🖥️  Standard environment - starting main server');

    // For production, use compiled version
    if (process.env.NODE_ENV === 'production') {
      // Check if dist/api/index.js exists
      const distPath = path.join(process.cwd(), 'dist', 'api', 'index.js');
      if (fs.existsSync(distPath)) {
        console.log('📦 Using compiled production build');
        const { default: app } = await import(distPath);
        return app;
      } else {
        console.log('⚠️  Production build not found, building first...');
        const { execSync } = await import('child_process');
        execSync('npm run build:full', { stdio: 'inherit' });
        const { default: app } = await import(distPath);
        return app;
      }
    } else {
      // Development: use TypeScript directly
      console.log('🔧 Development mode - using TypeScript source');
      const { default: app } = await import('./api/index.ts');
      return app;
    }

  } catch (error) {
    console.error('❌ Failed to start application:', error);

    // Provide helpful error messages
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('💡 Suggested fixes:');
      console.error('   - Run: npm install');
      console.error('   - For production: npm run build:full');
      console.error('   - Check your .env file configuration');
    }

    process.exit(1);
  }
}

// Handle different execution contexts
const isMainModule = import.meta.url === `file://${process.argv[1]}` ||
                     import.meta.url.endsWith(process.argv[1]);

if (isMainModule) {
  // Direct execution
  startApplication().catch((error) => {
    console.error('💥 Startup failed:', error);
    process.exit(1);
  });
}

// Export for module usage
export default startApplication;

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully');
  process.exit(0);
});