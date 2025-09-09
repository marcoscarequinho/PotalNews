import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import cityBackground from "@assets/Screenshot (9)_1755383303689.png";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o painel administrativo...",
      });
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ email, password });
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
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Logo/Icon */}
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-primary-orange rounded-2xl flex items-center justify-center shadow-lg mb-6">
                  <i className="fas fa-newspaper text-3xl text-white"></i>
                </div>
                
                {/* Title */}
                <div className="space-y-3">
                  <h1 className="text-4xl font-bold text-gray-900">PORTAL NOTÍCIAS</h1>
                  <p className="text-xl text-gray-600">Sistema Administrativo</p>
                </div>
              </div>
              
              {/* Login Form */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                    data-testid="input-email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-medium text-gray-700">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base"
                    data-testid="input-password"
                    required
                  />
                </div>
                
                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-primary-orange hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-3"></i>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt mr-3 text-xl"></i>
                      Entrar no Sistema
                    </>
                  )}
                </Button>
                
                {/* Back to Portal Button */}
                <Button
                  type="button"
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
              <div className="pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  Sistema exclusivo para jornalistas e administradores
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Acesso disponível para: Administradores, Editores e Jornalistas
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
