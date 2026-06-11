import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Todo } from "../todos.types";
import { useTodos } from "../hooks/useTodos";

interface TodoItemProps {
  todo: Todo;
}

/**
 * Exibe uma tarefa individual com ações de concluir e excluir.
 *
 * @param todo - Tarefa a ser exibida.
 */
export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodos();

  return (
    <div className="flex items-center justify-between gap-2 p-3 rounded-lg border bg-card">
      <span
        className={cn(
          "flex-1",
          todo.completed && "line-through text-muted-foreground"
        )}
      >
        {todo.title}
      </span>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            toggleTodo.mutate({ id: todo.id, completed: !todo.completed })
          }
          disabled={toggleTodo.isPending}
        >
          <Check className={cn("h-4 w-4", todo.completed && "text-green-600")} />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => deleteTodo.mutate(todo.id)}
          disabled={deleteTodo.isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}