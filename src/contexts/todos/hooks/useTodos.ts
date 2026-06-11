import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Todo, TodoInput } from "../todos.types";

/**
 * Hook para gerenciamento de tarefas (CRUD) via TanStack Query.
 *
 * Depende de: supabase client, toast (sonner).
 * Consumido por: HomePage, TodoList, TodoForm.
 */
export function useTodos() {
  const queryClient = useQueryClient();

  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });
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
      queryClient.invalidateQueries({ queryKey: ["todos"] });
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    onError: (err) => toast.error("Erro ao atualizar: " + err.message),
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Tarefa removida!");
    },
    onError: (err) => toast.error("Erro ao remover: " + err.message),
  });

  return {
    todos,
    isLoading,
    isError,
    error,
    createTodo,
    toggleTodo,
    deleteTodo,
  };
}