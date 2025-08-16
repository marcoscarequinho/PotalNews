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

  return (
    <Switch>
      {isLoading ? (
        <Route path="*" component={() => <div className="flex items-center justify-center min-h-screen">Loading...</div>} />
      ) : !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/portal" component={PublicPortal} />
          <Route component={NotFound} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={AdminDashboard} />
          <Route path="/news" component={NewsManagement} />
          <Route path="/news/new" component={NewsEditor} />
          <Route path="/news/edit/:id" component={NewsEditor} />
          <Route path="/users" component={UserManagement} />
          <Route path="/portal" component={PublicPortal} />
          <Route component={NotFound} />
        </>
      )}
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
