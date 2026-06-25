import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Todo, TodoInput } from "../todos.types";

/**
 * Hook para gerenciamento de tarefas (CRUD + soft delete) via TanStack Query.
 *
 * Soft delete: a exclusão apenas preenche `deleted_at`, sem remover o registro.
 * Tarefas na lixeira podem ser restauradas (reativadas) com `restoreTodo`.
 *
 * Depende de: supabase client, toast (sonner).
 * Consumido por: HomePage, TodoList, TodoForm, TodoTrash.
 */
export function useTodos() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
    queryClient.invalidateQueries({ queryKey: ["todos", "deleted"] });
  };

  // Tarefas ativas (não excluídas) do usuário logado.
  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Usuário não autenticado.");

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as Todo[];
    },
  });

  // Tarefas na lixeira (soft deleted) do usuário logado.
  const {
    data: deletedTodos,
    isLoading: isLoadingDeleted,
  } = useQuery({
    queryKey: ["todos", "deleted"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Usuário não autenticado.");

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as Todo[];
    },
  });

  const createTodo = useMutation({
    mutationFn: async (input: TodoInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Usuário não autenticado.");

      const { data, error } = await supabase
        .from("todos")
        .insert({ title: input.title, user_id: user.id })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Todo;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Tarefa criada!");
    },
    onError: (err) => toast.error("Erro ao criar: " + err.message),
  });

  const toggleTodo = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      const { data, error } = await supabase
        .from("todos")
        .update({ completed })
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Todo;
    },
    onSuccess: () => invalidate(),
    onError: (err) => toast.error("Erro ao atualizar: " + err.message),
  });

  const updateTodo = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { data, error } = await supabase
        .from("todos")
        .update({ title })
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Todo;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Tarefa atualizada!");
    },
    onError: (err) => toast.error("Erro ao editar: " + err.message),
  });

  // Soft delete: marca a tarefa como excluída sem apagar o registro.
  const softDeleteTodo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("todos")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Tarefa movida para a lixeira.");
    },
    onError: (err) => toast.error("Erro ao excluir: " + err.message),
  });

  // Restaura uma tarefa da lixeira para a lista de ativas.
  const restoreTodo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("todos")
        .update({ deleted_at: null })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Tarefa restaurada!");
    },
    onError: (err) => toast.error("Erro ao restaurar: " + err.message),
  });

  return {
    todos,
    deletedTodos,
    isLoading,
    isLoadingDeleted,
    isError,
    error,
    createTodo,
    toggleTodo,
    updateTodo,
    softDeleteTodo,
    restoreTodo,
  };
}
