#!/usr/bin/env node

// Force production environment
process.env.NODE_ENV = 'production';
process.env.AUTH_MODE = 'mock';

console.log('🚀 Starting PotalNews in production mode...');
console.log('📍 Working directory:', process.cwd());
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔐 Auth mode:', process.env.AUTH_MODE);

// Import and start the application
import('./index.js').catch(console.error);