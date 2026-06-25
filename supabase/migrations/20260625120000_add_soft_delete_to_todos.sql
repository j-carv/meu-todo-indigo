-- Soft delete para a tabela de tarefas (TarefaZen)
-- Adiciona a coluna deleted_at: NULL = tarefa ativa, preenchido = na lixeira.
-- Idempotente: pode ser executado com segurança mesmo se a coluna já existir.

alter table public.todos
  add column if not exists deleted_at timestamptz;

-- Índice parcial para consultas rápidas de tarefas ativas (deleted_at is null).
create index if not exists todos_active_idx
  on public.todos (user_id, created_at desc)
  where deleted_at is null;
