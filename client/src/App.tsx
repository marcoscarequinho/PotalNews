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
import UserManagement from "@/pages/UserManagement";
import PublicPortal from "@/pages/PublicPortal";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Switch>
      {/* Portal público como página inicial */}
      <Route path="/" component={PublicPortal} />
      
      {/* Página de login customizada */}
      <Route path="/login" component={Landing} />
      
      {/* Protected routes - only for authenticated users */}
      {isAuthenticated ? (
        <>
          <Route path="/admin" component={Home} />
          <Route path="/dashboard" component={AdminDashboard} />
          <Route path="/news" component={NewsManagement} />
          <Route path="/news/new" component={NewsEditor} />
          <Route path="/news/edit/:id" component={NewsEditor} />
          <Route path="/users" component={UserManagement} />
        </>
      ) : null}
      
      {/* Fallback 404 route */}
      <Route component={NotFound} />
    </Switch>
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
