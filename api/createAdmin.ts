import { storage } from './storage.ts';

async function createAdmin() {
  try {
    const email = 'contato@mcdetranrj.com';
    const existingUser = await storage.getUserByEmail(email);

    if (existingUser) {
      console.log('Admin user already exists.');
      return;
    }

    const newUser = await storage.createUser({
      email,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    });

    console.log('Admin user created successfully:');
    console.log(newUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // The script should exit after running.
    process.exit(0);
  }
}

createAdmin();
