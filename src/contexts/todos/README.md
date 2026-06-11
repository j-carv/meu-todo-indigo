# Contexto: Todos

Gerencia tarefas (to-do items) do usuário autenticado.

## Arquitetura

- `todos.types.ts` — Tipagens das tarefas.
- `hooks/useTodos.ts` — Queries e mutations via TanStack Query.
- `components/TodoForm.tsx` — Formulário de criação.
- `components/TodoList.tsx` — Listagem de tarefas.
- `components/TodoItem.tsx` — Item individual com ações.

## Tabelas Utilizadas

- `public.todos` — Tarefas do usuário (RLS ativado, acesso por user_id).

## Decisões Técnicas

- TanStack Query para sincronização de dados.
- Mutations com invalidação automática de cache.
- Formulários validados com Zod.