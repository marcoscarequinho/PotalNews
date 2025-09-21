import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Category } from "@shared/schema";

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function CategoriesManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const [form, setForm] = useState({ name: "", slug: "", color: "#3498DB", description: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ [k: string]: any }>({});

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      await apiRequest("POST", "/api/categories", payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setForm({ name: "", slug: "", color: "#3498DB", description: "" });
      toast({ title: "Sucesso", description: "Categoria criada." });
    },
    onError: () => toast({ title: "Erro", description: "Falha ao criar categoria", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      await apiRequest("PUT", `/api/categories/${id}`, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setEditing(null);
      toast({ title: "Sucesso", description: "Categoria atualizada." });
    },
    onError: () => toast({ title: "Erro", description: "Falha ao atualizar categoria", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Sucesso", description: "Categoria excluída." });
    },
    onError: () => toast({ title: "Erro", description: "Falha ao excluir categoria", variant: "destructive" }),
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Nome</label>
                <Input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({ ...f, name, slug: slugify(name) }));
                  }}
                  placeholder="Ex.: Notícias Locais"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Slug</label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                  placeholder="ex.: local"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Cor</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    className="h-10 w-10 rounded border"
                  />
                  <Input
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    placeholder="#3498DB"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Descrição</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Resumo curto da categoria"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-secondary-blue hover:bg-blue-600 text-white"
                onClick={() => createMutation.mutate(form)}
                disabled={!form.name || !form.slug || createMutation.isPending}
              >
                <i className="fas fa-plus mr-2" /> Criar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.length === 0 ? (
              <div className="text-gray-500">Nenhuma categoria.</div>
            ) : (
              <div className="space-y-3">
                {categories.map((c) => (
                  <div key={c.id} className="border rounded-lg p-4 flex items-center gap-4">
                    {editing === c.id ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <Input
                          defaultValue={c.name}
                          onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="Nome"
                        />
                        <Input
                          defaultValue={c.slug}
                          onChange={(e) => setEditForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                          placeholder="Slug"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            defaultValue={c.color || "#3498DB"}
                            onChange={(e) => setEditForm((f) => ({ ...f, color: e.target.value }))}
                            className="h-10 w-10 rounded border"
                          />
                          <Input
                            defaultValue={c.color || "#3498DB"}
                            onChange={(e) => setEditForm((f) => ({ ...f, color: e.target.value }))}
                            placeholder="#3498DB"
                          />
                        </div>
                        <Input
                          defaultValue={c.description || ""}
                          onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                          placeholder="Descrição"
                        />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: c.color || '#3498DB' }} />
                          {c.name} <span className="text-gray-400">({c.slug})</span>
                        </div>
                        {c.description ? (
                          <div className="text-gray-600 text-sm">{c.description}</div>
                        ) : null}
                      </div>
                    )}

                    {editing === c.id ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditing(null);
                            setEditForm({});
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          className="bg-secondary-blue hover:bg-blue-600 text-white"
                          onClick={() => updateMutation.mutate({ id: c.id!, payload: editForm })}
                          disabled={updateMutation.isPending}
                        >
                          Salvar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setEditing(c.id!)}>
                          <i className="fas fa-edit mr-2" /> Editar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Excluir esta categoria? Artigos existentes manterão o vínculo.")) {
                              deleteMutation.mutate(c.id!);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <i className="fas fa-trash mr-2" /> Excluir
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

