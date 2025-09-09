import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Test API endpoint hit:', req.method, req.url);
  
  if (req.method === 'POST' && req.url === '/api/auth/login') {
    console.log('Login endpoint hit');
    return res.status(200).json({ message: 'Login endpoint working' });
  }
  
  if (req.url?.startsWith('/api/')) {
    console.log('API endpoint hit:', req.url);
    return res.status(200).json({ message: 'API endpoint working', url: req.url });
  }
  
  return res.status(404).json({ error: 'Not found' });
}