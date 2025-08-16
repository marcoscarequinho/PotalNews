import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RichTextEditor from "./RichTextEditor";
import { ObjectUploader } from "@/components/ObjectUploader";
import { apiRequest } from "@/lib/queryClient";

const articleSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  imageUrl: z.string().optional(),
  status: z.enum(["draft", "review", "published"]).default("draft"),
  tags: z.string().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface NewsFormProps {
  initialData?: any;
  categories: any[];
  onSubmit: (data: ArticleFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function NewsForm({ 
  initialData, 
  categories, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: NewsFormProps) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      categoryId: initialData?.categoryId || "",
      imageUrl: initialData?.imageUrl || "",
      status: initialData?.status || "draft",
      tags: initialData?.tags || "",
    },
  });

  const handleImageUpload = async () => {
    try {
      const response = await apiRequest("POST", "/api/objects/upload");
      const data = await response.json();
      return {
        method: "PUT" as const,
        url: data.uploadURL,
      };
    } catch (error) {
      console.error("Error getting upload URL:", error);
      throw error;
    }
  };

  const handleImageComplete = async (result: any) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      try {
        const response = await apiRequest("PUT", "/api/article-images", {
          imageURL: uploadedFile.uploadURL,
        });
        const data = await response.json();
        setImageUrl(data.objectPath);
        form.setValue("imageUrl", data.objectPath);
      } catch (error) {
        console.error("Error setting image ACL:", error);
      }
    }
  };

  const handleSubmit = (data: ArticleFormData) => {
    onSubmit({
      ...data,
      imageUrl: imageUrl || undefined,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título da notícia..." {...field} data-testid="input-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumo/Subtítulo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Breve resumo da notícia..." 
                      rows={3} 
                      {...field} 
                      data-testid="textarea-excerpt"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagem Principal</label>
              <div className="space-y-4">
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={10485760}
                  onGetUploadParameters={handleImageUpload}
                  onComplete={handleImageComplete}
                  buttonClassName="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-secondary-blue transition-colors"
                >
                  <div className="text-center space-y-4">
                    <i className="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
                    <div>
                      <p className="text-gray-600">Arraste e solte uma imagem aqui ou</p>
                      <span className="text-secondary-blue font-medium hover:text-blue-700">
                        clique para selecionar
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP até 10MB</p>
                  </div>
                </ObjectUploader>
                
                {imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="max-w-xs rounded-lg"
                      data-testid="img-preview"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo da Notícia *</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Digite o conteúdo da notícia..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Publishing Options */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-dark-blue mb-4">Opções de Publicação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="review">Em Revisão</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="política, segurança, local" 
                          {...field} 
                          data-testid="input-tags"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-secondary-blue hover:bg-blue-600 text-white"
                disabled={isLoading}
                data-testid="button-submit"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Salvar Notícia
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
