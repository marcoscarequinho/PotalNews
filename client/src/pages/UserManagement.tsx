import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserManagement() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "Admin access required. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        if (!isAuthenticated) {
          window.location.href = "/api/login";
        } else {
          window.location.href = "/dashboard";
        }
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-dark-blue" data-testid="text-page-title">Gerenciar Usuários</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestão de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">
                Funcionalidade em desenvolvimento. Os usuários são gerenciados automaticamente através do sistema de autenticação.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
