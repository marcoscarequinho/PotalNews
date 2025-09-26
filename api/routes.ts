import type { Express } from "express";
import { createServer, type Server } from "http";
import { promises as fs } from "fs";
import path from "path";
import { storage } from "./storage";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { setupAuth } from "./replitAuth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { insertCategorySchema, insertArticleSchema, updateArticleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('Registering routes...');
  
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  // Health check (diagnostic)
  app.get('/api/health', async (_req, res) => {
    const start = Date.now();
    const env = {
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL === '1' || process.env.VERCEL === 'true',
      vercelRegion: process.env.VERCEL_REGION,
      authMode: process.env.AUTH_MODE,
    };
    try {
      const result: any = await db.execute(sql`select current_timestamp as now`);
      const now = result?.rows?.[0]?.now ?? null;
      res.json({
        ok: true,
        env,
        db: { status: 'connected', now },
        responseTimeMs: Date.now() - start,
      });
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        env,
        db: { status: 'error', message: error?.message || 'DB error' },
        responseTimeMs: Date.now() - start,
      });
    }
  });

  // Extended health check with table existence and counts
  app.get('/api/health/full', async (_req, res) => {
    const start = Date.now();
    const env = {
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL === '1' || process.env.VERCEL === 'true',
      vercelRegion: process.env.VERCEL_REGION,
      authMode: process.env.AUTH_MODE,
    };
    const result: any = { ok: false, env, responseTimeMs: 0, db: {}, tables: {} };
    try {
      const ts: any = await db.execute(sql`select current_timestamp as now, current_user, version()`);
      result.db = {
        status: 'connected',
        now: ts?.rows?.[0]?.now ?? null,
        user: ts?.rows?.[0]?.current_user ?? null,
        version: ts?.rows?.[0]?.version ?? null,
      };

      // Table checks: users, categories, articles, saved_articles
      const checks = [
        { key: 'users', q: sql`select count(*)::int as count from users` },
        { key: 'categories', q: sql`select count(*)::int as count from categories` },
        { key: 'articles', q: sql`select count(*)::int as count from articles` },
        { key: 'saved_articles', q: sql`select count(*)::int as count from saved_articles` },
      ];

      for (const c of checks) {
        try {
          const r: any = await db.execute(c.q);
          result.tables[c.key] = { exists: true, count: r?.rows?.[0]?.count ?? 0 };
        } catch (e: any) {
          result.tables[c.key] = { exists: false, error: e?.message || 'error' };
        }
      }

      result.ok = true;
      result.responseTimeMs = Date.now() - start;
      res.json(result);
    } catch (error: any) {
      result.ok = false;
      result.db = { status: 'error', message: error?.message || 'DB error' };
      result.responseTimeMs = Date.now() - start;
      res.status(500).json(result);
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    console.log('Login route hit:', req.body);
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
      }

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // For demo purposes, we'll accept any password for existing users
      // In production, you'd verify the password hash
      if (!user.isActive) {
        return res.status(401).json({ message: "Conta desativada" });
      }

      // Create session (simplified for demo)
      (req.session as any).userId = user.id;
      (req.session as any).user = user;

      res.json({ 
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (!(req.session as any)?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser((req.session as any).userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Create a custom isAdmin middleware
  const isAdmin = async (req: any, res: any, next: any) => {
    try {
      if (!(req.session as any)?.userId) {
        return res.status(401).json({ message: "Login necessário" });
      }

      const user = await storage.getUser((req.session as any).userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Usuário inválido" });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Acesso restrito apenas para administradores" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error checking admin access:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  // Category routes
  app.get('/api/features', async (_req, res) => {
    try {
      // uploadsEnabled se PRIVATE_OBJECT_DIR estiver configurado
      let uploadsEnabled = true;
      try {
        const svc = new ObjectStorageService();
        svc.getPrivateObjectDir();
      } catch {
        uploadsEnabled = false;
      }
      res.json({ uploadsEnabled });
    } catch (e) {
      res.json({ uploadsEnabled: false });
    }
  });

  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Create a custom auth middleware for our system
  const requireAuth = async (req: any, res: any, next: any) => {
    try {
      if (!(req.session as any)?.userId) {
        return res.status(401).json({ message: "Login necessário" });
      }

      const user = await storage.getUser((req.session as any).userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Usuário inválido" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error checking authentication:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  app.post('/api/categories', isAdmin, async (req: any, res) => {
    try {

      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put('/api/categories/:id', isAdmin, async (req: any, res) => {
    try {

      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, categoryData);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete('/api/categories/:id', isAdmin, async (req: any, res) => {
    try {

      const success = await storage.deleteCategory(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Article routes
  app.get('/api/articles', async (req, res) => {
    try {
      const { status, categoryId, authorId, search, limit, offset } = req.query;
      const articles = await storage.getArticles({
        status: status as string,
        categoryId: categoryId as string,
        authorId: authorId as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get('/api/articles/published', async (req, res) => {
    try {
      const { categoryId, limit, offset } = req.query;
      const articles = await storage.getPublishedArticles({
        categoryId: categoryId as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(articles);
    } catch (error) {
      console.error("Error fetching published articles:", error);
      res.status(500).json({ message: "Failed to fetch published articles" });
    }
  });

  app.get('/api/articles/:id', async (req, res) => {
    try {
      const article = await storage.getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.get('/api/articles/slug/:slug', async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment view count
      await storage.incrementViewCount(article.id);
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article by slug:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post('/api/articles', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;

      const articleData = insertArticleSchema.parse({
        ...req.body,
        authorId: userId,
      });
      
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put('/api/articles/:id', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;

      // Check if user can edit this article
      const article = await storage.getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Only admins or the article author can edit
      if (req.user.role !== 'admin' && article.authorId !== userId) {
        return res.status(403).json({ message: "Not authorized to edit this article" });
      }

      const articleData = updateArticleSchema.parse(req.body);
      const updatedArticle = await storage.updateArticle(req.params.id, articleData);
      
      if (!updatedArticle) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(updatedArticle);
    } catch (error) {
      console.error("Error updating article:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  // Allow admins or the article author to delete
  app.delete('/api/articles/:id', requireAuth, async (req: any, res) => {
    try {
      const article = await storage.getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      const isOwner = article.authorId === req.user.id;
      const isAdminUser = req.user.role === 'admin';
      if (!isAdminUser && !isOwner) {
        return res.status(403).json({ message: "Not authorized to delete this article" });
      }

      const success = await storage.deleteArticle(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Statistics route
  app.get('/api/stats', requireAuth, async (req: any, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // User management routes (Admin only)
  app.get('/api/users', isAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post('/api/users', isAdmin, async (req: any, res) => {
    try {
      const { email, firstName, lastName, role, password } = req.body;
      
      if (!email || !firstName || !lastName || !role) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      if (!['editor', 'journalist'].includes(role)) {
        return res.status(400).json({ message: "Papel inválido. Use 'editor' ou 'journalist'" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Usuário já existe com este email" });
      }

      const newUser = await storage.createUser({
        email,
        firstName,
        lastName,
        role,
        isActive: true
      });

      res.status(201).json({
        message: "Usuário criado com sucesso",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          isActive: newUser.isActive
        }
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Erro ao criar usuário" });
    }
  });

  app.put('/api/users/:id', isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, role, isActive } = req.body;

      const updatedUser = await storage.updateUser(id, {
        firstName,
        lastName,
        role,
        isActive
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json({
        message: "Usuário atualizado com sucesso",
        user: updatedUser
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  });

  app.delete('/api/users/:id', isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      if (id === req.user.id) {
        return res.status(400).json({ message: "Não é possível deletar sua própria conta" });
      }

      const success = await storage.deleteUser(id);
      if (!success) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Erro ao deletar usuário" });
    }
  });

  // Object storage routes for image uploads
  app.post("/api/objects/upload", requireAuth, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  app.put("/api/article-images", requireAuth, async (req: any, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    const userId = req.user.claims.sub;

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
          owner: userId,
          visibility: "public", // News images should be publicly accessible
        },
      );

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting article image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Local image upload fallback (base64 JSON payload)
  // Accepts: { filename: string, data: string (base64) }
  app.post("/api/uploads/images", requireAuth, async (req: any, res) => {
    try {
      const { filename, data } = req.body || {};
      if (!filename || !data) {
        return res.status(400).json({ message: "filename e data (base64) são obrigatórios" });
      }

      const uploadDir = path.resolve("uploads", "images");
      await fs.mkdir(uploadDir, { recursive: true });

      const safeName = filename.replace(/[^a-zA-Z0-9_.-]+/g, "-");
      const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const finalName = `${unique}-${safeName}`;
      const filePath = path.join(uploadDir, finalName);

      // data may come like: data:image/png;base64,AAAA... or plain base64
      const base64 = String(data).includes(",") ? String(data).split(",", 2)[1] : String(data);
      const buffer = Buffer.from(base64, "base64");
      await fs.writeFile(filePath, buffer);

      const urlPath = `/uploads/images/${finalName}`;
      return res.status(201).json({ url: urlPath });
    } catch (err) {
      console.error("Error uploading image locally:", err);
      return res.status(500).json({ message: "Falha ao fazer upload da imagem" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Saved articles endpoints (read later functionality)
  app.post("/api/articles/:id/save", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const articleId = req.params.id;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const savedArticle = await storage.saveArticle(userId, articleId);
      res.json(savedArticle);
    } catch (error) {
      console.error("Error saving article:", error);
      res.status(500).json({ message: "Failed to save article" });
    }
  });

  app.delete("/api/articles/:id/save", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const articleId = req.params.id;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const success = await storage.unsaveArticle(userId, articleId);
      if (success) {
        res.json({ message: "Article unsaved successfully" });
      } else {
        res.status(404).json({ message: "Saved article not found" });
      }
    } catch (error) {
      console.error("Error unsaving article:", error);
      res.status(500).json({ message: "Failed to unsave article" });
    }
  });

  app.get("/api/saved-articles", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const savedArticles = await storage.getSavedArticles(userId);
      res.json(savedArticles);
    } catch (error) {
      console.error("Error fetching saved articles:", error);
      res.status(500).json({ message: "Failed to fetch saved articles" });
    }
  });

  app.get("/api/articles/:id/is-saved", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const articleId = req.params.id;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const isSaved = await storage.isArticleSaved(userId, articleId);
      res.json({ isSaved });
    } catch (error) {
      console.error("Error checking if article is saved:", error);
      res.status(500).json({ message: "Failed to check article save status" });
    }
  });

  const httpServer = createServer(app);
  console.log('Routes registered successfully');
  return httpServer;
}
