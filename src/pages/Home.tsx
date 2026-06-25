import { ListChecks, LogOut, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth/hooks/useAuth";
import { TodoForm } from "@/contexts/todos/components/TodoForm";
import { TodoList } from "@/contexts/todos/components/TodoList";
import { TodoTrash } from "@/contexts/todos/components/TodoTrash";

/**
 * Página inicial protegida — tarefas ativas e lixeira (soft delete) do usuário.
 *
 * Composição de: TodoForm + TodoList + TodoTrash.
 */
export default function HomePage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">TarefaZen</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </header>

        <Card className="border-primary/10 shadow-xl shadow-primary/5">
          <CardContent className="pt-6">
            <Tabs defaultValue="ativas" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ativas">
                  <ListChecks className="h-4 w-4 mr-2" />
                  Ativas
                </TabsTrigger>
                <TabsTrigger value="lixeira">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Lixeira
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ativas" className="space-y-4">
                <TodoForm />
                <TodoList />
              </TabsContent>

              <TabsContent value="lixeira">
                <TodoTrash />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
