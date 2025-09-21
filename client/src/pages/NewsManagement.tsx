import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NewsCard from "@/components/News/NewsCard";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ArticleWithRelations, Category } from "@shared/schema";

export default function NewsManagement() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    author: "",
  });

  const { data: articles = [], isLoading: articlesLoading } = useQuery<ArticleWithRelations[]>({
    queryKey: ["/api/articles", filters],
    enabled: isAuthenticated,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'all') params.append('categoryId', filters.category);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.author) params.append('authorId', filters.author);

      const url = `/api/articles?${params.toString()}`;
      const response = await apiRequest("GET", url);
      return response.json();
    },
  });

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Sucesso",
        description: "Notícia excluída com sucesso",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao excluir notícia",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PUT", `/api/articles/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao atualizar status",
        variant: "destructive",
      });
    },
  });



  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-blue"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-dark-blue" data-testid="text-page-title">Gerenciar Notícias</h1>
          <div className="flex space-x-4">
            <Link href="/news/new">
              <Button className="bg-secondary-blue hover:bg-blue-600 text-white" data-testid="button-new-article">
                <i className="fas fa-plus mr-2"></i>
                Nova Notícia
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                <Input
                  placeholder="Título da notícia..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  data-testid="input-search"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories?.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger data-testid="select-status">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="review">Em Revisão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        <Card>
          <CardContent className="p-6">
            {articlesLoading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : articles?.length > 0 ? (
              <div className="space-y-6">
                {articles && articles.map((article: any) => (
                  <div key={article.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-6">
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-32 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-dark-blue mb-2" data-testid={`text-article-title-${article.id}`}>
                              {article.title}
                            </h3>
                            <p className="text-gray-600 mb-3">{article.excerpt}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span><i className="fas fa-user mr-1"></i>{article.author?.firstName} {article.author?.lastName}</span>
                              <span><i className="fas fa-calendar mr-1"></i>{new Date(article.createdAt).toLocaleDateString()}</span>
                              <span><i className="fas fa-eye mr-1"></i>{article.viewCount} visualizações</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 text-white text-sm rounded-full ${
                              article.category?.color ? `bg-[${article.category.color}]` : 'bg-secondary-blue'
                            }`}>
                              {article.category?.name}
                            </span>
                            <span className={`px-3 py-1 text-sm rounded-full ${
                              article.status === 'published' ? 'bg-green-100 text-green-800' :
                              article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {article.status === 'published' ? 'Publicado' :
                               article.status === 'draft' ? 'Rascunho' : 'Em Revisão'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2 mt-4">
                          {(user?.role === 'admin' || article.authorId === user?.id) && (
                            <Link href={`/news/edit/${article.id}`}>
                              <Button variant="outline" size="sm" data-testid={`button-edit-${article.id}`}>
                                <i className="fas fa-edit mr-2"></i>Editar
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(article.id, article.status)}
                            disabled={updateStatusMutation.isPending}
                            data-testid={`button-toggle-status-${article.id}`}
                          >
                            <i className={`fas ${article.status === 'published' ? 'fa-eye-slash' : 'fa-eye'} mr-2`}></i>
                            {article.status === 'published' ? 'Despublicar' : 'Publicar'}
                          </Button>
                          {(user?.role === 'admin' || article.authorId === user?.id) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(article.id)}
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-${article.id}`}
                            >
                              <i className="fas fa-trash mr-2"></i>Excluir
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 mb-4">Nenhuma notícia encontrada</p>
                <Link href="/news/new">
                  <Button className="bg-secondary-blue hover:bg-blue-600 text-white">
                    <i className="fas fa-plus mr-2"></i>
                    Criar Nova Notícia
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
