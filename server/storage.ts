import {
  users,
  categories,
  articles,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Article,
  type InsertArticle,
  type UpdateArticle,
  type ArticleWithRelations,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, like, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  // Article operations
  getArticles(options?: {
    status?: string;
    categoryId?: string;
    authorId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ArticleWithRelations[]>;
  getArticleById(id: string): Promise<ArticleWithRelations | undefined>;
  getArticleBySlug(slug: string): Promise<ArticleWithRelations | undefined>;
  getPublishedArticles(options?: {
    categoryId?: string;
    limit?: number;
    offset?: number;
  }): Promise<ArticleWithRelations[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: UpdateArticle): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  incrementViewCount(id: string): Promise<void>;
  
  // Statistics
  getStats(): Promise<{
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    totalUsers: number;
    totalViews: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Article operations
  async getArticles(options: {
    status?: string;
    categoryId?: string;
    authorId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ArticleWithRelations[]> {
    const { status, categoryId, authorId, search, limit = 50, offset = 0 } = options;

    let query = db
      .select()
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id));

    const conditions = [];
    if (status) conditions.push(eq(articles.status, status as any));
    if (categoryId) conditions.push(eq(articles.categoryId, categoryId));
    if (authorId) conditions.push(eq(articles.authorId, authorId));
    if (search) {
      conditions.push(
        or(
          like(articles.title, `%${search}%`),
          like(articles.content, `%${search}%`)
        )
      );
    }

    const finalQuery = conditions.length > 0 ? query.where(and(...conditions)) : query;

    const results = await finalQuery
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);

    return results.map(result => ({
      ...result.articles,
      category: result.categories!,
      author: result.users!,
    }));
  }

  async getArticleById(id: string): Promise<ArticleWithRelations | undefined> {
    const [result] = await db
      .select()
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.id, id));

    if (!result) return undefined;

    return {
      ...result.articles,
      category: result.categories!,
      author: result.users!,
    };
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithRelations | undefined> {
    const [result] = await db
      .select()
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.slug, slug));

    if (!result) return undefined;

    return {
      ...result.articles,
      category: result.categories!,
      author: result.users!,
    };
  }

  async getPublishedArticles(options: {
    categoryId?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ArticleWithRelations[]> {
    return this.getArticles({
      ...options,
      status: "published",
    });
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    // Generate slug from title
    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const [newArticle] = await db
      .insert(articles)
      .values({
        ...article,
        slug,
      })
      .returning();
    return newArticle;
  }

  async updateArticle(id: string, article: UpdateArticle): Promise<Article | undefined> {
    const updateData: any = { ...article, updatedAt: new Date() };
    
    // Update slug if title changed
    if (article.title) {
      updateData.slug = article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Set publishedAt when status changes to published
    if (article.status === 'published' && !article.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const [updated] = await db
      .update(articles)
      .set(updateData)
      .where(eq(articles.id, id))
      .returning();
    return updated;
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return (result.rowCount || 0) > 0;
  }

  async incrementViewCount(id: string): Promise<void> {
    await db
      .update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(eq(articles.id, id));
  }

  // Statistics
  async getStats(): Promise<{
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    totalUsers: number;
    totalViews: number;
  }> {
    const [totalArticlesResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(articles);

    const [publishedArticlesResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(articles)
      .where(eq(articles.status, 'published'));

    const [draftArticlesResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(articles)
      .where(eq(articles.status, 'draft'));

    const [totalUsersResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users);

    const [totalViewsResult] = await db
      .select({ sum: sql<number>`coalesce(sum(${articles.viewCount}), 0)::int` })
      .from(articles);

    return {
      totalArticles: totalArticlesResult.count,
      publishedArticles: publishedArticlesResult.count,
      draftArticles: draftArticlesResult.count,
      totalUsers: totalUsersResult.count,
      totalViews: totalViewsResult.sum,
    };
  }
}

export const storage = new DatabaseStorage();
