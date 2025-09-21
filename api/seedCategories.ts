import 'dotenv/config';
import { storage } from './storage';

async function main() {
  const defaults = [
    { name: 'Noticias Local', slug: 'local', description: 'Cobertura local', color: '#3498DB' },
    { name: 'Notícias Regionais', slug: 'regional', description: 'Cobertura regional', color: '#2ECC71' },
    { name: 'Nacional', slug: 'nacional', description: 'Cobertura nacional', color: '#16A085' },
    { name: 'Internacional', slug: 'internacional', description: 'Cobertura internacional', color: '#9B59B6' },
  ];

  for (const c of defaults) {
    const existing = await storage.getCategoryBySlug(c.slug);
    if (existing) {
      console.log(`Categoria já existe: ${c.name} (${c.slug})`);
      continue;
    }
    const created = await storage.createCategory({
      name: c.name,
      slug: c.slug,
      description: c.description,
      color: c.color,
    });
    console.log(`Criada: ${created.name} (${created.slug})`);
  }

  console.log('Seed de categorias concluído.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

