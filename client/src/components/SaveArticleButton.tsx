import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface SaveArticleButtonProps {
  articleId: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function SaveArticleButton({ 
  articleId, 
  className, 
  variant = "outline",
  size = "sm" 
}: SaveArticleButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if article is saved
  const { data: saveStatus, isLoading: isCheckingStatus } = useQuery({
    queryKey: ["/api/articles", articleId, "is-saved"],
    enabled: isAuthenticated,
    retry: false,
  });

  const isSaved = (saveStatus as any)?.isSaved || false;

  // Save article mutation
  const saveArticleMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/articles/${articleId}/save`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles", articleId, "is-saved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-articles"] });
      toast({
        title: "Artigo salvo",
        description: "O artigo foi adicionado à sua lista de leitura posterior.",
      });
    },
    onError: (error) => {
      console.error("Error saving article:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o artigo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Unsave article mutation
  const unsaveArticleMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/articles/${articleId}/save`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles", articleId, "is-saved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-articles"] });
      toast({
        title: "Artigo removido",
        description: "O artigo foi removido da sua lista de leitura posterior.",
      });
    },
    onError: (error) => {
      console.error("Error unsaving article:", error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o artigo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleToggleSave = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para salvar artigos.",
        variant: "destructive",
      });
      return;
    }

    if (isSaved) {
      unsaveArticleMutation.mutate();
    } else {
      saveArticleMutation.mutate();
    }
  };

  const isLoading = isCheckingStatus || saveArticleMutation.isPending || unsaveArticleMutation.isPending;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSave}
      disabled={isLoading || !isAuthenticated}
      className={className}
      data-testid={`button-save-article-${articleId}`}
    >
      <BookmarkIcon 
        className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} 
      />
      {isLoading ? "..." : isSaved ? "Salvo" : "Salvar"}
    </Button>
  );
}