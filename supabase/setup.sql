-- ============================================================
-- TarefaZen - Setup completo do banco (rodar em banco novo)
-- Cole este arquivo inteiro no SQL Editor do Supabase e execute.
-- ============================================================

-- 1) Tabela de tarefas
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- 2) Row Level Security: cada usuario so acessa as proprias tarefas
alter table public.todos enable row level security;

drop policy if exists todos_select_own on public.todos;
drop policy if exists todos_insert_own on public.todos;
drop policy if exists todos_update_own on public.todos;
drop policy if exists todos_delete_own on public.todos;

create policy todos_select_own on public.todos for select using (auth.uid() = user_id);
create policy todos_insert_own on public.todos for insert with check (auth.uid() = user_id);
create policy todos_update_own on public.todos for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy todos_delete_own on public.todos for delete using (auth.uid() = user_id);

-- 3) Trigger para manter updated_at atualizado
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists todos_set_updated_at on public.todos;
create trigger todos_set_updated_at before update on public.todos
for each row execute function public.set_updated_at();

-- 4) Indice para consultas rapidas de tarefas ativas
create index if not exists todos_active_idx on public.todos (user_id, created_at desc) where deleted_at is null;
