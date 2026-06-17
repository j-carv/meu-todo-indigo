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
    <div
      className={cn(
        "group flex items-center justify-between gap-2 p-3 pl-4 rounded-2xl border border-transparent bg-secondary/60 transition-all hover:border-primary/30 hover:bg-secondary",
        todo.completed && "bg-muted/50"
      )}
    >
      <button
        type="button"
        onClick={() =>
          toggleTodo.mutate({ id: todo.id, completed: !todo.completed })
        }
        disabled={toggleTodo.isPending}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          todo.completed
            ? "border-accent bg-accent text-accent-foreground"
            : "border-muted-foreground/40 text-transparent hover:border-accent"
        )}
        aria-label={todo.completed ? "Marcar como pendente" : "Concluir tarefa"}
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <span
        className={cn(
          "flex-1",
          todo.completed && "line-through text-muted-foreground"
        )}
      >
        {todo.title}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteTodo.mutate(todo.id)}
        disabled={deleteTodo.isPending}
        className="rounded-xl text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}