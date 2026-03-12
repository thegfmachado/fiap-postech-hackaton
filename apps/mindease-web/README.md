# 🌐 MindEase Web

Aplicação principal de produtividade construída com **Next.js 16** e **React 19**.

## 📋 Visão Geral

App principal do MindEase, responsável por:
- Quadro Kanban com gerenciamento visual de tarefas
- Timer Pomodoro com modos configuráveis
- Página de configurações de acessibilidade e produtividade
- Proxy para o micro frontend de autenticação

## 🚀 Desenvolvimento

```bash
# Na raiz do monorepo
npm run dev --workspace apps/mindease-web

# Ou inicie todos os apps
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura

```
mindease-web/
├── app/                       # App Router (Next.js)
│   ├── page.tsx               # Landing page (público)
│   ├── layout.tsx             # Layout raiz
│   ├── home/                  # Quadro Kanban
│   ├── pomodoro/              # Timer Pomodoro
│   ├── settings/              # Configurações
│   └── api/
│       └── tasks/             # API Routes (CRUD de tarefas)
│           └── [id]/
├── client/
│   └── services/              # TasksService (client-side)
├── components/                # Componentes específicos do app
│   ├── task-card/
│   ├── task-form.tsx
│   ├── task-details-modal.tsx
│   ├── pomodoro-widget.tsx
│   └── template/
├── contexts/                  # React Contexts
│   ├── auth-context.tsx
│   └── display-mode-context/
├── hooks/                     # Custom hooks
│   ├── use-auth.ts
│   ├── use-current-user.ts
│   ├── use-display-mode.ts
│   └── use-pomodoro-timer/
├── lib/
│   ├── services/              # TaskService (server-side)
│   └── utils/                 # Middleware, helpers
└── styles/
    └── globals.css
```

## 🎨 Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page pública com cards de funcionalidades e CTA |
| `/home` | Quadro Kanban com colunas: A Fazer, Em Andamento, Concluído |
| `/pomodoro` | Timer Pomodoro com modos Foco, Pausa Curta e Pausa Longa |
| `/settings` | Modo de exibição, acessibilidade e configurações do Pomodoro |

## 🔌 API Routes

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/tasks` | Listar tarefas do usuário |
| POST | `/api/tasks` | Criar nova tarefa |
| GET | `/api/tasks/[id]` | Buscar tarefa por ID |
| PATCH | `/api/tasks/[id]` | Atualizar tarefa |
| DELETE | `/api/tasks/[id]` | Excluir tarefa |

## 🔗 Integração com Auth (Micro Frontend)

Todas as rotas `/auth/*` e `/api/auth/*` são redirecionadas para `mindease-web-auth` via rewrites do Next.js:

```javascript
// next.config.mjs
async rewrites() {
  return [
    { source: '/auth/:path+',                 destination: `${AUTH_DOMAIN}/:path+` },
    { source: '/api/auth',                    destination: `${AUTH_DOMAIN}/api/auth` },
    { source: '/api/auth/:path+',             destination: `${AUTH_DOMAIN}/api/auth/:path+` },
    { source: '/mindease-web-auth-static/:path+', destination: `${AUTH_DOMAIN}/mindease-web-auth-static/:path+` },
  ];
}
```

O middleware intercepta requisições e redireciona usuários não autenticados:

```
/home  → (não autenticado) → /auth/login
/auth/login → (autenticado) → /home
```

## 🔐 Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
MINDEASE_WEB_AUTH_DOMAIN=http://localhost:3001
```

## 📦 Dependências Internas

| Package | Função |
|---------|--------|
| `@mindease/design-system` | Componentes UI compartilhados |
| `@mindease/database` | Cliente Supabase + queries tipadas |
| `@mindease/models` | Interfaces TypeScript (`Task`, `Settings`, etc.) |
| `@mindease/services` | `HTTPService`, `StorageService` |
