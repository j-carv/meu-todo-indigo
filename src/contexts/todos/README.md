# Contexto: Todos

Gerencia tarefas (to-do items) do usuário autenticado.

## Arquitetura

- `todos.types.ts` — Tipagens das tarefas (inclui `deleted_at`).
- `hooks/useTodos.ts` — Queries e mutations via TanStack Query (ativas, lixeira, soft delete e restore).
- `components/TodoForm.tsx` — Formulário de criação.
- `components/TodoList.tsx` — Listagem de tarefas ativas.
- `components/TodoItem.tsx` — Item individual com ações (concluir, editar, excluir).
- `components/TodoTrash.tsx` — Lixeira: lista tarefas excluídas e permite restaurar.

## Tabelas Utilizadas

- `public.todos` — Tarefas do usuário (RLS ativado, acesso por user_id).
  - `deleted_at timestamptz` — soft delete. `NULL` = ativa; preenchido = na lixeira.
  - Migration: `supabase/migrations/20260625120000_add_soft_delete_to_todos.sql`.

## Decisões Técnicas

- TanStack Query para sincronização de dados.
- Mutations com invalidação automática de cache (chaves `["todos"]` e `["todos","deleted"]`).
- **Soft delete**: excluir apenas preenche `deleted_at` (não remove o registro);
  a tarefa vai para a Lixeira e pode ser restaurada (`deleted_at = null`).
- Exclusão e restauração exigem confirmação explícita do usuário (AlertDialog).
- Formulários validados com Zod.