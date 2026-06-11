import { TodoItem } from "./TodoItem";
import { useTodos } from "../hooks/useTodos";

/**
 * Lista de tarefas com estados de loading e vazio.
 *
 * Consumido por: HomePage.
 */
export function TodoList() {
  const { todos, isLoading, isError, error } = useTodos();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-lg border bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Erro ao carregar tarefas: {error?.message}
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma tarefa ainda. Adicione uma acima!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}