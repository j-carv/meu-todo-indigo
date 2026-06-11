import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTodos } from "../hooks/useTodos";

const todoSchema = z.object({
  title: z.string().min(1, "Digite uma tarefa."),
});

type TodoFormData = z.infer<typeof todoSchema>;

/**
 * Formulário de criação rápida de tarefas.
 *
 * Consumido por: HomePage.
 */
export function TodoForm() {
  const { createTodo } = useTodos();

  const form = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = (data: TodoFormData) => {
    createTodo.mutate(
      { title: data.title },
      {
        onSuccess: () => form.reset(),
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Nova tarefa..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createTodo.isPending}>
          {createTodo.isPending ? "..." : "Adicionar"}
        </Button>
      </form>
    </Form>
  );
}