import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Stats } from "@shared/types";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();
  
  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const isActive = (path: string) => location === path;

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-dark-blue mb-4">Menu Principal</h3>
          <nav className="space-y-2">
            <Link href="/dashboard">
              <a className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-blue-50 text-secondary-blue' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`} data-testid="nav-dashboard">
                <i className="fas fa-tachometer-alt mr-3"></i>
                Dashboard
              </a>
            </Link>
            <Link href="/news">
              <a className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                location.startsWith('/news') || location.startsWith('/admin/news')
                  ? 'bg-blue-50 text-secondary-blue' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`} data-testid="nav-news-management">
                <i className="fas fa-newspaper mr-3"></i>
                Gerenciar Notícias
              </a>
            </Link>
            <Link href="/news/new">
              <a className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive('/news/new') || isActive('/admin/news/new')
                  ? 'bg-blue-50 text-secondary-blue' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`} data-testid="nav-new-news">
                <i className="fas fa-plus-circle mr-3"></i>
                Nova Notícia
              </a>
            </Link>
            {user?.role === 'admin' && (
              <Link href="/users">
                <a className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive('/users') || isActive('/admin/users')
                    ? 'bg-blue-50 text-secondary-blue' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`} data-testid="nav-users">
                  <i className="fas fa-users mr-3"></i>
                  Usuários
                </a>
              </Link>
            )}
          </nav>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-dark-blue mb-4">Estatísticas Rápidas</h3>
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-secondary-blue font-semibold" data-testid="stat-published-news">
                {stats?.publishedArticles || 0}
              </div>
              <div className="text-sm text-gray-600">Notícias Publicadas</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-accent-yellow font-semibold" data-testid="stat-draft-news">
                {stats?.draftArticles || 0}
              </div>
              <div className="text-sm text-gray-600">Rascunhos</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-green-600 font-semibold" data-testid="stat-total-views">
                {stats?.totalViews?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-gray-600">Visualizações Totais</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
