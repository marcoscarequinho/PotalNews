// Vercel API route handler
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Simple health check endpoint
  res.status(200).json({ 
    message: 'API is running', 
    timestamp: new Date().toISOString(),
    platform: 'Vercel'
  });
}