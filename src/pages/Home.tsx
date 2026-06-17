import { LogOut, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth/hooks/useAuth";
import { TodoForm } from "@/contexts/todos/components/TodoForm";
import { TodoList } from "@/contexts/todos/components/TodoList";

/**
 * Página inicial protegida — lista de tarefas do usuário.
 *
 * Composição de: TodoForm + TodoList.
 */
export default function HomePage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30">
              <ListChecks className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <Card className="border-none shadow-xl shadow-primary/5 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-primary to-accent" />
              Minhas Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TodoForm />
            <TodoList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}