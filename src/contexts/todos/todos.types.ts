/**
 * Representa uma tarefa (to-do) no banco de dados.
 */
export interface Todo {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Dados necessários para criar uma nova tarefa.
 */
export interface TodoInput {
  title: string;
}