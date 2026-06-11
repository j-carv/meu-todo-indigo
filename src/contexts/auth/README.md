# Contexto: Auth

Gerencia autenticação de usuários usando Supabase Auth nativo (email/senha).

## Arquitetura

- `hooks/useAuth.ts` — Hook global para sessão, login, logout e registro.
- Consumido por: `ProtectedRoute`, `LoginPage`, `HomePage`.

## Tabelas Utilizadas

- `auth.users` (Supabase Auth — gerenciado pelo Supabase)
- `user_management.app_users` (perfil estendido — gerenciado via trigger no Supabase)

## Decisões Técnicas

- Autenticação nativa email/senha do Supabase.
- Sessão persistida automaticamente pelo Supabase client.
- Redirecionamento pós-login para `/`.