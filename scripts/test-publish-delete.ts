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

  // Create draft
  const draft = await storage.createArticle({
    title: 'Publicar e Excluir - Teste',
    content: 'Conteúdo de teste para publicar e excluir.',
    excerpt: 'Teste publish/delete',
    imageUrl: null as any,
    status: 'draft',
    categoryId,
    authorId: userId,
    videoUrl: null as any,
    tags: null as any,
  } as any);
  console.log('Criado rascunho:', { id: draft.id, slug: draft.slug, status: draft.status });

  // Publish
  const published = await storage.updateArticle(draft.id, { status: 'published' } as any);
  console.log('Publicado:', { id: published?.id, status: published?.status, publishedAt: published?.publishedAt });

  // Delete
  const deleted = await storage.deleteArticle(draft.id);
  console.log('Excluído:', deleted);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

