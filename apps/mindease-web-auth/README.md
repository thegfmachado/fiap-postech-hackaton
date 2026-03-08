# 🔐 MindEase Web Auth

Micro frontend de autenticação construído com **Next.js 16**. Responsável por login, cadastro e recuperação de senha.

## 📋 Visão Geral

App independente que gerencia toda a autenticação do MindEase:
- Login com email e senha
- Cadastro de novos usuários
- Esqueci minha senha
- Redefinição de senha via link de email

## 🚀 Desenvolvimento

```bash
# Na raiz do monorepo
npm run dev --workspace apps/mindease-web-auth

# Ou inicie todos os apps
npm run dev
```

Acesse: [http://localhost:3001](http://localhost:3001)

> **Nota:** Em produção, este app é acessado via proxy do `mindease-web` nas rotas `/auth/*`.

## 📁 Estrutura

```
mindease-web-auth/
├── app/
│   ├── login/                 # Página de login (rota padrão '/')
│   ├── signup/                # Página de cadastro
│   ├── forgot-password/       # Esqueci minha senha
│   ├── reset-password/        # Redefinir senha
│   └── api/auth/
│       ├── route.ts           # Login (POST) / Get user (GET)
│       ├── signup/            # Cadastro
│       ├── signout/           # Logout
│       ├── forgot-password/   # Enviar email de reset
│       └── reset-password/    # Redefinir senha
├── client/                    # Serviços client-side
├── components/                # Componentes de formulário
└── lib/
    └── services/              # AuthService (server-side)
```

## 🔗 Como Funciona o Micro Frontend

O `mindease-web` faz proxy das requisições para este app:

```
Usuário acessa → localhost:3000/auth/login
                        ↓
             mindease-web (rewrite)
                        ↓
             localhost:3001/login
```

### Asset Prefix

Para servir assets corretamente via proxy:

```javascript
// next.config.mjs
assetPrefix: '/mindease-web-auth-static'
```

## 📡 API Routes

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth` | Login com email e senha |
| GET | `/api/auth` | Obter usuário atual da sessão |
| POST | `/api/auth/signup` | Cadastro de novo usuário |
| POST | `/api/auth/signout` | Logout |
| POST | `/api/auth/forgot-password` | Enviar email de redefinição de senha |
| PATCH | `/api/auth/reset-password` | Redefinir senha com novo valor |

## 🔐 Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
MINDEASE_WEB_DOMAIN=http://localhost:3000
```

## 📦 Dependências Internas

| Package | Função |
|---------|--------|
| `@mindease/design-system` | Componentes UI compartilhados |
| `@mindease/database` | Cliente Supabase + `AuthQueriesService` |
| `@mindease/validation-schemas` | Schemas Zod para formulários de auth |

## 🎯 Por que um App Separado?

1. **Deploy independente**: Atualizar auth sem afetar o app principal
2. **Isolamento**: Código de autenticação não mistura com regras de negócio
3. **Segurança**: Superfície de ataque reduzida por responsabilidade única
4. **Escalabilidade**: Pode ter infraestrutura dedicada se necessário
