import { useQuery } from "@tanstack/react-query";
import PublicLayout from "@/components/Layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import type { ArticleWithRelations } from "@shared/schema";

export default function PublicPortal() {
  const { data: articles, isLoading: articlesLoading } = useQuery<ArticleWithRelations[]>({
    queryKey: ["/api/articles/published"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const articlesArray = Array.isArray(articles) ? articles : [];
  const featuredArticle = articlesArray[0];
  const sideArticles = articlesArray.slice(1, 3);
  const localNews = articlesArray.filter((article: any) => article.category?.slug === 'local').slice(0, 3);
  const regionalNews = articlesArray.filter((article: any) => article.category?.slug === 'regional').slice(0, 3);

  return (
    <PublicLayout>
      {/* Hero Section with Current Date and Social Links */}
      <div className="bg-gray-100 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <span className="text-gray-600" data-testid="text-current-date">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-primary-orange" data-testid="link-facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-orange" data-testid="link-instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-orange" data-testid="link-twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-orange" data-testid="link-youtube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-primary-orange shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex-1"></div>
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-white mb-2" data-testid="text-site-title">PORTAL NOTÍCIAS</h1>
              <p className="text-white/90">Notícias Locais, Regionais e Nacionais</p>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => window.location.href = "/login"}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-white/20 hover:border-white/40"
                data-testid="button-admin-login"
              >
                <i className="fas fa-user-shield mr-2"></i>
                Área Administrativa
              </button>
            </div>
          </div>
        </div>
        
        <nav className="bg-accent-yellow">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex space-x-8 py-3">
              <li><a href="#" className="text-dark-blue font-medium hover:text-primary-orange transition-colors" data-testid="nav-home">INÍCIO</a></li>
              <li><a href="#" className="text-dark-blue font-medium hover:text-primary-orange transition-colors" data-testid="nav-local">LOCAL</a></li>
              <li><a href="#" className="text-dark-blue font-medium hover:text-primary-orange transition-colors" data-testid="nav-regional">REGIONAL</a></li>
              <li><a href="#" className="text-dark-blue font-medium hover:text-primary-orange transition-colors" data-testid="nav-national">NACIONAL</a></li>
              <li><a href="#" className="text-dark-blue font-medium hover:text-primary-orange transition-colors" data-testid="nav-international">INTERNACIONAL</a></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {articlesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-blue"></div>
          </div>
        ) : (
          <>
            {/* Featured News */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Main Featured News */}
              <div className="lg:col-span-2">
                {featuredArticle ? (
                  <Card className="overflow-hidden shadow-lg" data-testid="card-featured-article">
                    {featuredArticle.imageUrl && (
                      <img 
                        src={featuredArticle.imageUrl} 
                        alt={featuredArticle.title}
                        className="w-full h-64 object-cover"
                      />
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span 
                          className="text-white px-3 py-1 text-sm rounded-full"
                          style={{ backgroundColor: featuredArticle.category?.color || '#3498DB' }}
                        >
                          {featuredArticle.category?.name}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {featuredArticle.createdAt ? new Date(featuredArticle.createdAt).toLocaleDateString('pt-BR') : ''}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-dark-blue mb-3">{featuredArticle.title}</h2>
                      <p className="text-gray-600 mb-4">{featuredArticle.excerpt}</p>
                      <a href="#" className="text-secondary-blue font-medium hover:text-blue-700">
                        Leia mais →
                      </a>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="p-6">
                    <div className="text-center">
                      <i className="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500">Nenhuma notícia em destaque</p>
                    </div>
                  </Card>
                )}
              </div>
              
              {/* Side Articles */}
              <div className="space-y-6">
                {sideArticles.map((article: any) => (
                  <Card key={article.id} className="overflow-hidden shadow-md" data-testid={`card-side-article-${article.id}`}>
                    {article.imageUrl && (
                      <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <CardContent className="p-4">
                      <span 
                        className="text-white px-2 py-1 text-xs rounded-full"
                        style={{ backgroundColor: article.category?.color || '#3498DB' }}
                      >
                        {article.category?.name}
                      </span>
                      <h3 className="font-semibold text-dark-blue mt-2 mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm">{article.excerpt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* News Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Local News */}
              <div>
                <div className="bg-secondary-blue text-white p-3 rounded-t-lg">
                  <h3 className="font-semibold" data-testid="text-local-news-title">Notícias Locais</h3>
                </div>
                <Card className="rounded-t-none">
                  <CardContent className="p-4">
                    {localNews.length > 0 ? (
                      <div className="space-y-4">
                        {localNews.map((article: any) => (
                          <div key={article.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0" data-testid={`card-local-article-${article.id}`}>
                            {article.imageUrl && (
                              <img 
                                src={article.imageUrl} 
                                alt={article.title}
                                className="w-16 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-dark-blue text-sm">{article.title}</h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {article.createdAt ? new Date(article.createdAt).toLocaleDateString('pt-BR') : ''}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">Nenhuma notícia local disponível</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Regional News */}
              <div>
                <div className="bg-accent-yellow text-dark-blue p-3 rounded-t-lg">
                  <h3 className="font-semibold" data-testid="text-regional-news-title">Notícias Regionais</h3>
                </div>
                <Card className="rounded-t-none">
                  <CardContent className="p-4">
                    {regionalNews.length > 0 ? (
                      <div className="space-y-4">
                        {regionalNews.map((article: any) => (
                          <div key={article.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0" data-testid={`card-regional-article-${article.id}`}>
                            {article.imageUrl && (
                              <img 
                                src={article.imageUrl} 
                                alt={article.title}
                                className="w-16 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-dark-blue text-sm">{article.title}</h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {article.createdAt ? new Date(article.createdAt).toLocaleDateString('pt-BR') : ''}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">Nenhuma notícia regional disponível</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </PublicLayout>
  );
}
