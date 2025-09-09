import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/News/NewsCard";
import { Stats } from "@shared/types";
import { ArticleWithRelations } from "@shared/schema";

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    enabled: isAuthenticated,
  });

  const { data: recentArticles, isLoading: articlesLoading } = useQuery<ArticleWithRelations[]>({
    queryKey: ["/api/articles"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

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
          <h1 className="text-3xl font-bold text-dark-blue" data-testid="text-page-title">Dashboard</h1>
          <Button 
            className="bg-secondary-blue hover:bg-blue-600 text-white"
            data-testid="button-refresh"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Atualizar
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-secondary-blue">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <i className="fas fa-newspaper text-secondary-blue text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total de Notícias</h3>
                  <p className="text-2xl font-bold text-dark-blue" data-testid="text-total-articles">
                    {statsLoading ? "..." : stats?.totalArticles || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <i className="fas fa-eye text-green-500 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Visualizações</h3>
                  <p className="text-2xl font-bold text-dark-blue" data-testid="text-total-views">
                    {statsLoading ? "..." : stats?.totalViews?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent-yellow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <i className="fas fa-users text-accent-yellow text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Usuários</h3>
                  <p className="text-2xl font-bold text-dark-blue" data-testid="text-total-users">
                    {statsLoading ? "..." : stats?.totalUsers || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <i className="fas fa-edit text-red-500 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Rascunhos</h3>
                  <p className="text-2xl font-bold text-dark-blue" data-testid="text-draft-articles">
                    {statsLoading ? "..." : stats?.draftArticles || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent News */}
        <Card>
          <CardHeader>
            <CardTitle className="text-dark-blue">Notícias Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {articlesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : recentArticles && recentArticles.length > 0 ? (
              <div className="space-y-4">
                {recentArticles.slice(0, 5).map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 mb-4">Nenhuma notícia encontrada</p>
                <Link href="/news/new">
                  <Button className="bg-secondary-blue hover:bg-blue-600 text-white">
                    <i className="fas fa-plus mr-2"></i>
                    Criar Primeira Notícia
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
