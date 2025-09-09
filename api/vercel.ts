// Vercel API route handler for the Express app
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../api/index';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Pass the request to the Express app
  // Note: This is a simplified approach. For production use,
  // consider using @vendia/serverless-express for better compatibility
  try {
    // This is a basic wrapper - you may need to adjust based on your specific needs
    return app(req as any, res as any);
  } catch (error) {
    console.error('Error in Vercel API handler:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to process request'
    });
  }
}