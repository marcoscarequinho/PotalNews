import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import cityBackground from "@assets/Screenshot (9)_1755383303689.png";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cityBackground})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center space-y-8">
              {/* Logo/Icon */}
              <div className="mx-auto w-20 h-20 bg-primary-orange rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-newspaper text-3xl text-white"></i>
              </div>
              
              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-gray-900">PORTAL NOTÍCIAS</h1>
                <p className="text-xl text-gray-600">Sistema Administrativo</p>
              </div>
              
              {/* Description */}
              <div className="space-y-4">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Acesse o sistema para gerenciar conteúdo jornalístico, criar e editar notícias, e administrar todo o portal de comunicação.
                </p>
                
                {/* Login Button */}
                <Button
                  onClick={handleLogin}
                  className="w-full bg-primary-orange hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                  data-testid="button-login"
                >
                  <i className="fas fa-sign-in-alt mr-3 text-xl"></i>
                  Entrar no Sistema
                </Button>
                
                {/* Back to Portal Button */}
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/"}
                  className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-4 text-lg font-medium rounded-xl transition-all duration-200"
                  data-testid="button-public-portal"
                >
                  <i className="fas fa-arrow-left mr-3"></i>
                  Voltar ao Portal Público
                </Button>
              </div>
              
              {/* Footer Info */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Sistema exclusivo para jornalistas e administradores
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
