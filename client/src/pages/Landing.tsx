import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/Layout/PublicLayout";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary-orange via-secondary-blue to-accent-yellow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-dark-blue">PORTAL NOTÍCIAS</h1>
                <p className="text-gray-600">Sistema Administrativo</p>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Acesse o sistema para gerenciar conteúdo jornalístico, criar notícias e administrar o portal.
                </p>
                
                <Button
                  onClick={handleLogin}
                  className="w-full bg-secondary-blue hover:bg-blue-600 text-white"
                  data-testid="button-login"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Entrar no Sistema
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/portal"}
                  className="w-full border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white"
                  data-testid="button-public-portal"
                >
                  <i className="fas fa-globe mr-2"></i>
                  Ver Portal Público
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
