import { useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";
import type { Todo } from "../todos.types";
import { useTodos } from "../hooks/useTodos";

interface TodoItemProps {
  todo: Todo;
}

/**
 * Exibe uma tarefa individual com ações de concluir, editar e excluir.
 *
 * Editar e excluir exigem confirmação explícita do usuário.
 *
 * @param todo - Tarefa a ser exibida.
 */
export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, updateTodo, softDeleteTodo } = useTodos();

  // Estado do diálogo de edição e do título sendo editado.
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  // Estado da confirmação de salvar edição e da confirmação de exclusão.
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const trimmedTitle = editTitle.trim();
  const canSave = trimmedTitle.length > 0 && trimmedTitle !== todo.title;

  const handleConfirmEdit = () => {
    updateTodo.mutate(
      { id: todo.id, title: trimmedTitle },
      {
        onSuccess: () => {
          setConfirmEditOpen(false);
          setIsEditOpen(false);
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    softDeleteTodo.mutate(todo.id, {
      onSuccess: () => setConfirmDeleteOpen(false),
    });
  };

  return (
    <div className="flex items-center justify-between gap-2 p-3 rounded-lg border bg-card">
      <span
        className={cn(
          "flex-1 break-words",
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
          title="Concluir tarefa"
        >
          <Check className={cn("h-4 w-4", todo.completed && "text-green-600")} />
        </Button>

        {/* Botão e diálogo de edição */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setEditTitle(todo.title);
            setIsEditOpen(true);
          }}
          title="Editar tarefa"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        {/* Botão de exclusão */}
        <Button
          variant="destructive"
          size="icon"
          onClick={() => setConfirmDeleteOpen(true)}
          disabled={softDeleteTodo.isPending}
          title="Excluir tarefa"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Diálogo de edição da tarefa */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar tarefa</DialogTitle>
            <DialogDescription>
              Altere o texto da tarefa e clique em salvar.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Texto da tarefa..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSave) setConfirmEditOpen(true);
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => setConfirmEditOpen(true)}
              disabled={!canSave}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação de edição */}
      <AlertDialog open={confirmEditOpen} onOpenChange={setConfirmEditOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar edição</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja salvar as alterações desta tarefa?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmEdit}
              disabled={updateTodo.isPending}
            >
              Sim, salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmação de exclusão */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir a tarefa "{todo.title}"? Ela será
              movida para a lixeira e você poderá restaurá-la depois.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={softDeleteTodo.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
