import 'dotenv/config';
import { storage } from '../api/storage.ts';

async function ensureAdmin(): Promise<string> {
  const email = 'contato@mcdetranrj.com';
  const existing = await storage.getUserByEmail(email);
  if (existing) return existing.id;
  const user = await storage.createUser({
    email,
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
  });
  return user.id;
}

async function ensureCategory(): Promise<string> {
  const cats = await storage.getCategories();
  if (cats.length > 0) return cats[0].id;
  const cat = await storage.createCategory({
    name: 'Geral',
    slug: 'geral',
    description: 'Categoria padrão de teste',
    color: '#3498DB',
  });
  return cat.id;
}

async function main() {
  const userId = await ensureAdmin();
  const categoryId = await ensureCategory();

  const title = 'Teste de Slug Repetido';
  const payload = {
    title,
    content: 'Conteúdo mínimo para teste de slug único.',
    excerpt: 'Teste de slug',
    imageUrl: null as any,
    status: 'draft' as const,
    categoryId,
    authorId: userId,
    videoUrl: null as any,
    tags: null as any,
  };

  const a1 = await storage.createArticle(payload as any);
  const a2 = await storage.createArticle(payload as any);

  console.log('Article 1 slug:', a1.slug);
  console.log('Article 2 slug:', a2.slug);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

