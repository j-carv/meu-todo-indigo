import { LogOut } from "lucide-react";
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
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Meu To Do</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Minhas Tarefas</CardTitle>
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