#!/usr/bin/env node

/**
 * OpenLiteSpeed-compatible Node.js application entry point
 * This file serves as the main entry point for deployment on OpenLiteSpeed server
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import http from 'http';

// Import the main application from the API directory
// Note: Since the main app is written in TypeScript with ES modules,
// we need to use dynamic import or compile it first
export const startApp = async () => {
  try {
    // For production, use the compiled JavaScript
    let app;
    if (process.env.NODE_ENV === 'production') {
      // Use the compiled dist version
      const { default: compiledApp } = await import('./dist/api/index.js');
      app = compiledApp;
    } else {
      // For development, we'll need to compile or use ts-node
      // This requires the TypeScript app to be pre-compiled
      console.error('Development mode requires pre-compiled TypeScript files');
      console.error('Please run: npm run build:api');
      process.exit(1);
    }

    // Create HTTP server
    const server = http.createServer(app);

    // Configure server settings for OpenLiteSpeed
    const port = process.env.PORT || process.env.LSWS_PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';

    // Handle server errors
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Handle successful server startup
    server.on('listening', () => {
      const addr = server.address();
      const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
      console.log(`🚀 Server listening on ${bind}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 Auth Mode: ${process.env.AUTH_MODE || 'default'}`);

      // OpenLiteSpeed specific logging
      if (process.env.LSWS_PORT) {
        console.log(`🌐 OpenLiteSpeed detected - running on port ${process.env.LSWS_PORT}`);
      }
    });

    // Graceful shutdown handling
    const gracefulShutdown = () => {
      console.log('\n📴 Received shutdown signal, closing server...');
      server.close((err) => {
        if (err) {
          console.error('❌ Error during server shutdown:', err);
          process.exit(1);
        }
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
    };

    // Handle shutdown signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      gracefulShutdown();
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown();
    });

    // Start the server
    server.listen(port, host);

  } catch (error) {
    console.error('❌ Failed to start application:', error);
    console.error('Make sure to run "npm run build:api" first for production');
    process.exit(1);
  }
};

// Start the application
startApp().catch((error) => {
  console.error('💥 Application startup failed:', error);
  process.exit(1);
});

// Export for potential use by other modules
export { startApp };