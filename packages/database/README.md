# 🗄️ Database

Package de integração com **Supabase** (PostgreSQL + Auth + Storage).

## 📋 Visão Geral

Fornece cliente Supabase configurado e queries tipadas:
- Cliente para browser (client-side)
- Cliente para servidor (server-side com cookies SSR)
- Queries de tarefas e autenticação
- Tipos gerados do banco de dados

## 📦 Exports

```typescript
import { createClient }            from '@mindease/database/client';
import { createServerClient }      from '@mindease/database/server';
import { AuthQueriesService,
         TasksQueriesService }      from '@mindease/database/queries';
import type { ITask, ITaskInsert,
              ITaskUpdate, Database } from '@mindease/database/types';
```

## 🚀 Setup do Supabase Local

### 1. Pré-requisitos

- **Docker** instalado e rodando
- **Supabase CLI** (instalado automaticamente via npm)

### 2. Iniciar

```bash
# Na raiz do monorepo
npm run db:local:start
```

Na primeira execução, será exibido:
- **API URL**: `http://127.0.0.1:54321`
- **Anon Key**: chave pública para usar nos apps
- **Studio URL**: `http://127.0.0.1:54323`

### 3. URLs e Credenciais Locais

| Serviço | URL | Observação |
|---------|-----|------------|
| **API** | `http://127.0.0.1:54321` | Configurar nos `.env.local` |
| **Studio** | `http://127.0.0.1:54323` | Interface web do banco |
| **DB Direct** | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` | Conexão direta |

### 4. Configurar Variáveis de Ambiente

Copie as chaves para os arquivos `.env.local` dos apps:

```bash
# apps/mindease-web/.env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
MINDEASE_WEB_AUTH_DOMAIN=http://localhost:3001

# apps/mindease-web-auth/.env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
MINDEASE_WEB_DOMAIN=http://localhost:3000
```

> **💡 Nota:** Use `npm run db:local:status` para verificar as credenciais atuais.

### 5. Parar

```bash
npm run db:local:stop
```

## 📊 Schema do Banco

### Tabela: `tasks`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | TEXT | PK |
| `title` | TEXT | Título da tarefa |
| `description` | TEXT | Descrição (opcional) |
| `status` | TEXT | Estado: `todo`, `doing`, `done` |
| `priority` | ENUM | `low`, `medium`, `high` |
| `due_date` | TIMESTAMPTZ | Prazo (opcional) |
| `estimated_pomodoros` | INT | Pomodoros estimados |
| `completed_pomodoros` | INT | Pomodoros concluídos |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

### Tabela: `profiles`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | FK para `auth.users` |
| `email` | TEXT | Email do usuário |
| `name` | TEXT | Nome de exibição |
| `view_mode` | TEXT | `summary` ou `detailed` |
| `font_size` | TEXT | `small`, `medium`, `large` |
| `spacing` | TEXT | `small`, `medium`, `large` |
| `contrast_intensity` | TEXT | `low` ou `high` |
| `pomodoro_duration_minutes` | INT | Duração do pomodoro |
| `short_break_minutes` | INT | Duração da pausa curta |
| `long_break_minutes` | INT | Duração da pausa longa |
| `long_break_after_pomodoros` | INT | Pomodoros antes da pausa longa |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

### Row Level Security (RLS)

As tabelas possuem políticas RLS que garantem que cada usuário acessa apenas seus próprios dados. Consulte os arquivos de migração em `supabase/migrations/` para ver as políticas aplicadas.

## 📁 Estrutura

```
database/
├── src/
│   ├── client.ts              # Cliente browser
│   ├── server.ts              # Cliente server (SSR)
│   ├── types.ts               # ITask, ITaskInsert, ITaskUpdate
│   ├── generated-types.ts     # Tipos gerados do Supabase (não editar)
│   └── queries/
│       ├── index.ts
│       ├── auth/              # AuthQueriesService
│       └── tasks/             # TasksQueriesService
└── supabase/                  # Config Supabase CLI
```

## 🔧 Comandos

```bash
# Gerenciar Supabase local
npm run db:local:start     # Iniciar
npm run db:local:stop      # Parar
npm run db:local:status    # Ver status e credenciais
npm run db:local:reset     # Reset completo (⚠️ apaga dados!)

# Gerar tipos TypeScript do banco
npm run db:generate:types
```

## 🐛 Troubleshooting

<details>
<summary><b>Docker não está rodando</b></summary>

```bash
# Verificar
docker ps

# Iniciar Docker Desktop (Windows/macOS) ou:
sudo systemctl start docker  # Linux
```

</details>

<details>
<summary><b>Porta já em uso</b></summary>

```bash
npm run db:local:stop
npm run db:local:start
```

</details>
