import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsCardProps {
  article: any;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, status: string) => void;
}

export default function NewsCard({ 
  article, 
  showActions = true, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: NewsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      case 'review': return 'Em Revisão';
      default: return status;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`card-news-${article.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-16 h-10 object-cover rounded"
            />
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-dark-blue mb-1" data-testid={`text-article-title-${article.id}`}>
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  <span data-testid={`text-article-author-${article.id}`}>
                    Por: {article.author?.firstName} {article.author?.lastName}
                  </span> • {" "}
                  <span data-testid={`text-article-date-${article.id}`}>
                    {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(article.status)}`}>
                  {getStatusText(article.status)}
                </span>
                {showActions && (
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(article.id)}
                      data-testid={`button-edit-${article.id}`}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    {onToggleStatus && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleStatus(article.id, article.status)}
                        data-testid={`button-toggle-status-${article.id}`}
                      >
                        <i className={`fas ${article.status === 'published' ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(article.id)}
                        className="text-red-600 hover:text-red-800"
                        data-testid={`button-delete-${article.id}`}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
