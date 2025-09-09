import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, CalendarIcon, EyeIcon, UserIcon } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SaveArticleButton } from "@/components/SaveArticleButton";
import type { ArticleWithRelations } from "@shared/schema";

export function SavedArticles() {
  const { data: savedArticles, isLoading, error } = useQuery<ArticleWithRelations[]>({
    queryKey: ["/api/saved-articles"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-red-600">Erro ao carregar artigos salvos</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="heading-saved-articles">
          Artigos Salvos
        </h1>
        <p className="text-gray-600">
          Seus artigos salvos para leitura posterior
        </p>
      </div>

      {savedArticles && savedArticles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BookmarkIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum artigo salvo
            </h3>
            <p className="text-gray-500 mb-4">
              Você ainda não salvou nenhum artigo para leitura posterior.
            </p>
            <Link href="/news">
              <Button data-testid="button-browse-articles">
                Explorar Artigos
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {savedArticles?.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge 
                    variant="secondary" 
                    style={{ backgroundColor: article.category?.color || '#6B7280' }}
                    className="text-white"
                    data-testid={`badge-category-${article.id}`}
                  >
                    {article.category?.name || 'Sem categoria'}
                  </Badge>
                  <SaveArticleButton 
                    articleId={article.id} 
                    variant="ghost"
                    size="sm"
                  />
                </div>
                <CardTitle className="text-xl">
                  <Link 
                    href={`/news/${article.slug}`}
                    className="hover:text-blue-600 transition-colors"
                    data-testid={`link-article-${article.id}`}
                  >
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    <span data-testid={`text-author-${article.id}`}>
                      {article.author ? `${article.author.firstName} ${article.author.lastName}` : 'Autor desconhecido'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span data-testid={`text-date-${article.id}`}>
                      {article.createdAt ? formatDistanceToNow(new Date(article.createdAt), { 
                        addSuffix: true, 
                        locale: ptBR 
                      }) : 'Data não disponível'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    <span data-testid={`text-views-${article.id}`}>
                      {article.viewCount || 0} visualizações
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}