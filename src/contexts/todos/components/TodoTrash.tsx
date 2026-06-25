import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTodos } from "../hooks/useTodos";
import type { Todo } from "../todos.types";

/**
 * Lixeira de tarefas: lista as tarefas com soft delete e permite restaurá-las.
 *
 * Restaurar exige confirmação explícita do usuário.
 *
 * Consumido por: HomePage.
 */
export function TodoTrash() {
  const { deletedTodos, isLoadingDeleted, restoreTodo } = useTodos();

  // Tarefa selecionada para o diálogo de confirmação de restauração.
  const [toRestore, setToRestore] = useState<Todo | null>(null);

  if (isLoadingDeleted) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-lg border bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!deletedTodos || deletedTodos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
        <Trash2 className="h-6 w-6" />
        <p className="text-sm">A lixeira está vazia.</p>
      </div>
    );
  }

  const handleConfirmRestore = () => {
    if (!toRestore) return;
    restoreTodo.mutate(toRestore.id, {
      onSuccess: () => setToRestore(null),
    });
  };

  return (
    <div className="space-y-2">
      {deletedTodos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between gap-2 p-3 rounded-lg border border-dashed bg-muted/40"
        >
          <span className="flex-1 break-words text-muted-foreground line-through">
            {todo.title}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setToRestore(todo)}
            disabled={restoreTodo.isPending}
            title="Restaurar tarefa"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar
          </Button>
        </div>
      ))}

      {/* Confirmação de restauração */}
      <AlertDialog
        open={toRestore !== null}
        onOpenChange={(open) => !open && setToRestore(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja restaurar a tarefa "{toRestore?.title}" de volta para a
              lista de tarefas ativas?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRestore}
              disabled={restoreTodo.isPending}
            >
              Sim, restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
