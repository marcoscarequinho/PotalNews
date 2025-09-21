import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (_) {
      // ignore network errors on logout
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <header className="bg-primary-orange shadow-lg">
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
      
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2" data-testid="text-site-title">PORTAL NOTÍCIAS</h1>
            <p className="text-white/90 text-sm">Sistema Administrativo - Gestão de Conteúdo Jornalístico</p>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <span className="text-white text-sm">Logado como:</span>
                <span className="text-white font-semibold ml-1" data-testid="text-user-name">
                  {user.firstName} {user.lastName}
                </span>
                <span className={`text-xs px-2 py-1 rounded ml-2 ${
                  user.role === 'admin' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-dark-blue'
                }`} data-testid="text-user-role">
                  {user.role === 'admin' ? 'Administrador' : 'Editor'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:text-accent-yellow"
                data-testid="button-logout"
              >
                <i className="fas fa-sign-out-alt"></i>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <nav className="bg-accent-yellow">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex space-x-8 py-3">
            <li><a href="/dashboard" className="text-dark-blue font-medium hover:text-primary-orange transition-colors" data-testid="nav-dashboard">Dashboard</a></li>
            <li><a href="/news" className="text-dark-blue font-medium hover:text-primary-orange transition-colors" data-testid="nav-news">Notícias</a></li>
            {user?.role === 'admin' && (
              <li><a href="/users" className="text-dark-blue font-medium hover:text-primary-orange transition-colors" data-testid="nav-users">Usuários</a></li>
            )}
            <li><a href="/" className="text-dark-blue font-medium hover:text-primary-orange transition-colors" data-testid="nav-portal">Portal Público</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
