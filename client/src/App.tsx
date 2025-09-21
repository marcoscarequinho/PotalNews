import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import NewsManagement from "@/pages/NewsManagement";
import NewsEditor from "@/pages/NewsEditor";
import NewsView from "@/pages/NewsView";
import UserManagement from "@/pages/UserManagement";
import CategoriesManagement from "@/pages/CategoriesManagement";
import PublicPortal from "@/pages/PublicPortal";
import { SavedArticles } from "@/pages/SavedArticles";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const isAdmin = user?.role === 'admin';

  return (
    <Switch>
      {/* Portal público como página inicial */}
      <Route path="/" component={PublicPortal} />
      
      {/* Página de visualização de notícias - deve vir depois das rotas específicas */}
      
      {/* Artigos salvos - usuários autenticados */}
      {isAuthenticated ? (
        <Route path="/saved" component={SavedArticles} />
      ) : null}
      
      {/* Página de login customizada */}
      <Route path="/login" component={Landing} />
      
      {/* Protected routes - only for authenticated admin users */}
      {isAuthenticated && isAdmin ? (
        <>
          <Route path="/admin" component={Home} />
          <Route path="/dashboard" component={AdminDashboard} />
          <Route path="/news" component={NewsManagement} />
          <Route path="/admin/news" component={NewsManagement} />
          <Route path="/news/new" component={NewsEditor} />
          <Route path="/admin/news/new" component={NewsEditor} />
          <Route path="/news/edit/:id" component={NewsEditor} />
          <Route path="/admin/news/edit/:id" component={NewsEditor} />
          <Route path="/users" component={UserManagement} />
          <Route path="/admin/users" component={UserManagement} />
          <Route path="/categories" component={CategoriesManagement} />
          <Route path="/admin/categories" component={CategoriesManagement} />
        </>
      ) : isAuthenticated ? (
        // Non-admin authenticated users get redirected to access denied
        <Route path="/admin*" component={() => <AccessDenied />} />
      ) : null}
      
      {/* Página de visualização de notícias - deve vir por último para não conflitar */}
      <Route path="/news/:id" component={NewsView} />
      
      {/* Fallback 404 route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Component for non-admin users
function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-lock text-3xl text-red-600"></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h1>
        <p className="text-gray-600 mb-6">
          Apenas administradores têm acesso a esta área do sistema.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = "/"}
            className="bg-primary-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Voltar ao Portal Público
          </button>
          <br />
          <button
            onClick={() => window.location.href = "/api/auth/logout"}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Fazer Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
