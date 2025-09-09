import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios" });
  }

  // For demo purposes, we'll accept any password for existing users
  // In production, you'd verify the password hash
  
  // Return a successful response
  return res.status(200).json({ 
    message: "Login realizado com sucesso",
    user: {
      id: 'test-user-id',
      email: email,
      firstName: 'Test',
      lastName: 'User',
      role: 'admin'
    }
  });
}