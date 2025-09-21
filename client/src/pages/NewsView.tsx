import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SaveArticleButton } from "@/components/SaveArticleButton";

export default function NewsView() {
  const { id } = useParams();

  const { data: article, isLoading } = useQuery<any>({
    queryKey: ["/api/articles", id],
    enabled: !!id,
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando notícia...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Notícia não encontrada</h1>
          <Link href="/">
            <Button className="bg-secondary-blue hover:bg-blue-600 text-white">
              Voltar ao Portal
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const category = categories.find((cat: any) => cat.id === article.categoryId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold text-dark-blue cursor-pointer">
                Portal de Notícias
              </h1>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-dark-blue transition-colors">
                Início
              </Link>
              <Link href="/saved" className="text-gray-700 hover:text-dark-blue transition-colors">
                Artigos Salvos
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-dark-blue transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8">
            {/* Category Badge */}
            {category && (
              <div className="mb-4">
                <span
                  className="inline-block px-3 py-1 text-white text-sm rounded-full"
                  style={{ backgroundColor: category.color || '#3B82F6' }}
                >
                  {category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-dark-blue mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center space-x-6 text-gray-600 mb-8 pb-6 border-b">
              <div className="flex items-center">
                <i className="fas fa-user mr-2"></i>
                <span>{article.author?.firstName} {article.author?.lastName}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-calendar mr-2"></i>
                <span>{new Date(article.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-eye mr-2"></i>
                <span>{article.viewCount} visualizações</span>
              </div>
            </div>

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="mb-8">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    // Se a imagem falhar, mostra um placeholder
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVIMjI1VjEyNUgxNzVWNzVaIiBmaWxsPSIjOUIxMDFGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCI+SW1hZ2VtIG5vw6kgZGlzcG9uw65lbDwvdGV4dD4KPC9zdmc+';
                  }}
                />
              </div>
            )}

            {/* Video */}
            {article.videoUrl && (
              <div className="mb-8">
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                  {/* YouTube embed */}
                  {article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={article.videoUrl.includes('youtu.be')
                        ? `https://www.youtube.com/embed/${article.videoUrl.split('/').pop()}`
                        : article.videoUrl.replace('watch?v=', 'embed/')
                      }
                      title={article.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : /* Vimeo embed */
                  article.videoUrl.includes('vimeo.com') ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${article.videoUrl.split('/').pop()}`}
                      title={article.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : /* Other video URLs - try direct embed */
                  (
                    <video
                      controls
                      className="w-full h-full"
                      poster={article.imageUrl}
                    >
                      <source src={article.videoUrl} type="video/mp4" />
                      <source src={article.videoUrl} type="video/webm" />
                      <source src={article.videoUrl} type="video/ogg" />
                      Seu navegador não suporta reprodução de vídeo.
                    </video>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <SaveArticleButton 
                articleId={article.id}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              />
              <Button 
                className="bg-primary-orange hover:bg-orange-600 text-white"
                data-testid="button-share"
              >
                <i className="fas fa-share mr-2"></i>
                Compartilhar
              </Button>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Back Button */}
            <div className="mt-8 pt-6 border-t">
              <Link href="/">
                <Button variant="outline" className="text-dark-blue border-dark-blue hover:bg-dark-blue hover:text-white">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Voltar ao Portal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}