<div align="center">
  <h1>📋 MindEase</h1>
  <p><strong>Sistema de Produtividade Acessível para Neurodivergentes</strong></p>
</div>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white"/>
  <img alt="Supabase" src="https://img.shields.io/badge/Database-Supabase-3FCF8E?style=flat&logo=supabase"/>
  <img alt="Turborepo" src="https://img.shields.io/badge/Monorepo-Turborepo-EF4444?style=flat&logo=turborepo&logoColor=white"/>
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-início-rápido">Início Rápido</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-decisões-técnicas">Decisões Técnicas</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-comandos">Comandos</a>
</p>

## 📖 Sobre o Projeto

O **MindEase** é uma plataforma de produtividade desenvolvida especialmente para pessoas neurodivergentes. Combinando um quadro Kanban visual com técnicas de Pomodoro, oferecemos uma ferramenta acessível que respeita diferentes estilos de aprendizado e concentração.

### 🎯 Público-Alvo

Pessoas neurodivergentes (TDAH, autismo, dislexia, etc.) que buscam uma ferramenta de produtividade que:
- Seja visualmente clara e livre de distrações
- Permita personalização do nível de complexidade
- Respeite diferentes ritmos de trabalho
- Ofereça estrutura sem rigidez

### ✅ Funcionalidades

- **Quadro Kanban Visual**: Organize tarefas em colunas (A Fazer, Em Andamento, Concluído) com suporte a arrastar e soltar
- **Timer Pomodoro Flexível**: Intervalos de foco, pausa curta e pausa longa totalmente configuráveis
- **Integração Kanban + Pomodoro**: Rastreie pomodoros estimados e concluídos por tarefa
- **Configurações de Acessibilidade**: Modo de contraste, tamanho de fonte e espaçamento ajustáveis
- **Interface Adaptável**: Alternância entre modo simplificado e detalhado de exibição
- **Aplicação Web e Mobile**: Acesse de qualquer dispositivo com paridade de funcionalidades
- **Autenticação Segura**: Sistema completo com login, cadastro e recuperação de senha via Supabase

## 🚀 Início Rápido

### 📋 Pré-requisitos

- **Node.js** 20+ e **npm** 11.4.2+
- **Docker** (para Supabase local)

### ⚡ Instalação

```bash
# Clone e instale
git clone <repository-url>
cd fiap-postech-hackaton
npm install

# Configure as variáveis de ambiente de cada app
# Consulte a seção "Variáveis de Ambiente" e o README de cada app

# Inicie todas as aplicações
npm run dev
```

### 🌐 URLs de Desenvolvimento

| Serviço | URL | Descrição |
|---------|-----|-----------|
| App Principal | [localhost:3000](http://localhost:3000) | Interface web principal |
| App Auth | [localhost:3001](http://localhost:3001) | Autenticação (micro frontend) |
| App Mobile | [localhost:8081](http://localhost:8081) | Versão mobile (Expo Web) |

## 🏗️ Arquitetura

Monorepo gerenciado com **TurboRepo**, organizado em apps e packages compartilhados:

```
fiap-postech-hackaton/
├── apps/
│   ├── mindease-web/           # App principal (Next.js)
│   ├── mindease-web-auth/      # Micro frontend auth (Next.js)
│   └── mindease-native/        # App mobile (React Native/Expo)
└── packages/
    ├── database/               # Cliente e queries Supabase
    ├── design-system/          # Componentes UI + Storybook
    ├── models/                 # Tipos e interfaces TypeScript
    ├── services/               # Serviços HTTP e storage
    ├── utils/                  # Funções utilitárias
    ├── validation-schemas/     # Schemas Zod
    ├── vitest-preset/          # Configuração Vitest compartilhada
    ├── eslint-config/          # Configuração ESLint
    └── typescript-config/      # Configuração TypeScript
```

> 📚 Consulte o [README de variáveis de ambiente](#-variáveis-de-ambiente) para configurar o projeto corretamente.

<details>
<summary><b>📊 Diagrama de Arquitetura</b></summary>

```
┌────────────────────────────────────────────────────────────┐
│                         USUÁRIO                            │
│                  (Neurodivergente)                         │
└─────────────────────────────┬──────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  mindease-web   │  │mindease-web-auth│  │ mindease-native │
│   (Next.js)     │◄─│   (Next.js)     │  │  (Expo/RN)      │
│   Port: 3000    │  │   Port: 3001    │  │   Port: 8081    │
│                 │  │                 │  │                 │
│ • Quadro Kanban │  │ • Login/Signup  │  │ • Board Mobile  │
│ • Timer Pomodoro│  │ • Recuperação   │  │ • Pomodoro      │
│ • Configurações │  │   de senha      │  │ • Configurações │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────┐
         │           PACKAGES COMPARTILHADOS      │
         │  database │ design-system │ models     │
         │  services │ utils │ validation-schemas │
         └────────────────────┬───────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────┐
         │              SUPABASE                  │
         │   PostgreSQL + Auth + Storage          │
         │   • Usuários  • Tarefas  • Sessões     │
         └────────────────────────────────────────┘
```

</details>

<details>
<summary><b>🔄 Fluxo de Micro Frontend (Auth)</b></summary>

O app de autenticação funciona como um **micro frontend** integrado via rewrites do Next.js:

```
┌──────────────────┐    ┌───────────────────┐    ┌──────────────┐
│    Usuário       │    │   mindease-web    │    │  web-auth    │
└────────┬─────────┘    └─────────┬─────────┘    └──────┬───────┘
         │                        │                     │
         │  GET /auth/login       │                     │
         │───────────────────────>│                     │
         │                        │                     │
         │                        │  Proxy (rewrite)    │
         │                        │────────────────────>│
         │                        │                     │
         │  Página de login       │                     │
         │<───────────────────────│<────────────────────│
         │                        │                     │
         │  POST credenciais      │                     │
         │───────────────────────────────────────────────>
         │                        │                     │
         │  Set cookies + redirect /home                │
         │<───────────────────────────────────────────────
```

**Rotas proxy:** `/auth/*` e `/api/auth/*` → `mindease-web-auth`

</details>

## 🎯 Decisões Técnicas

### Por que TurboRepo?

Ferramenta moderna de monorepo com **cache inteligente**, desenvolvida pela Vercel (mesma do Next.js), garantindo boa integração e builds rápidos. Permite compartilhar packages como `models`, `services` e `design-system` entre as três aplicações sem duplicação.

### Por que Micro Frontend para Auth?

Separamos a autenticação para **deploy independente** e **isolamento de responsabilidade**. O código de auth não se mistura com regras de negócio e pode escalar separadamente. Em produção, os dois containers se comunicam via rede Docker interna.

### Por que Context API ao invés de Redux/Zustand?

O projeto **não possui estado global complexo**. Os únicos estados compartilhados são o usuário logado (`auth-context`) e o modo de exibição (`display-mode-context`). Context API atende bem, com menos boilerplate e sem dependências extras.

### Por que Supabase?

Oferece **PostgreSQL + Auth + Storage** em uma solução integrada. O **Row Level Security (RLS)** garante que cada usuário acessa apenas seus próprios dados, sem necessidade de lógica extra no frontend. A geração automática de tipos TypeScript a partir do schema mantém o código seguro de ponta a ponta.

### Por que React Hook Form + Zod?

**RHF** usa refs e evita re-renders desnecessários nos formulários de autenticação. **Zod** infere tipos automaticamente e os schemas são compartilhados via `@mindease/validation-schemas`, reutilizáveis entre web e mobile.

### Por que Design System compartilhado?

Centralizar os componentes UI garante **consistência visual** entre `mindease-web` e `mindease-web-auth`. Construído sobre Radix UI (acessibilidade nativa) e Tailwind CSS v4, com Storybook para documentação e desenvolvimento isolado de componentes.

### Por que Expo para o Mobile?

**Setup simplificado** sem necessidade de configurar Xcode/Android Studio para desenvolvimento. O **Expo Go** permite testar rapidamente em dispositivos físicos e o `expo-router` reutiliza os mesmos patterns de roteamento do Next.js, reduzindo a curva de aprendizado.

## 🔧 Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| **Frontend Web** | Next.js 16, React 19, TypeScript 5.8, TailwindCSS 4 |
| **Frontend Mobile** | React Native 0.79, Expo SDK 53, expo-router 5 |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Build** | TurboRepo 2.5, Turbopack |
| **UI** | Radix UI, Design System compartilhado, Storybook 8.6 |
| **Validação** | Zod 3.24, React Hook Form 7.60 |
| **Testes** | Vitest 3, Jest 29, Testing Library |

## 📋 Comandos

### Desenvolvimento

```bash
npm run dev              # Iniciar todas as apps
npm run build            # Build de produção
npm run lint             # Verificar código
npm run format           # Formatar código (Prettier)
```

### Testes

```bash
npm run test             # Executar todos os testes
npm run test:coverage    # Executar testes com cobertura
```

### Banco de Dados

```bash
npm run db:local:start   # Iniciar Supabase local
npm run db:local:stop    # Parar Supabase local
npm run db:local:status  # Ver status e credenciais
npm run db:local:reset   # Resetar banco local
npm run db:generate:types # Gerar tipos TypeScript do schema
```

### Docker

```bash
npm run docker:build     # Build das imagens
npm run docker:up        # Subir containers de produção
npm run docker:down      # Parar containers
npm run docker:logs      # Acompanhar logs dos containers
```

### Workspace Específico

```bash
npm run dev --workspace apps/mindease-web
npm run dev --workspace apps/mindease-native
npm run build --workspace packages/design-system
```

## 🌍 Variáveis de Ambiente

> **⚠️ Importante:** Cada app precisa do seu próprio arquivo `.env.local` dentro de sua pasta raiz para funcionar corretamente. As variáveis abaixo são um ponto de partida — consulte o README de cada app para a lista completa.
> No app mobile (`mindease-native`), os nomes das variáveis mudam por conta do Expo (prefixo `EXPO_PUBLIC_` ao invés de `NEXT_PUBLIC_`). Consulte o [README do mindease-native](apps/mindease-native/README.md) para detalhes.

Variáveis comuns entre os apps web:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
MINDEASE_WEB_DOMAIN=http://localhost:3000
MINDEASE_WEB_AUTH_DOMAIN=http://localhost:3001
```

> Em produção via Docker, `MINDEASE_WEB_AUTH_DOMAIN` deve apontar para o container interno: `http://mindease-web-auth-app:3001`.

## 🐛 Troubleshooting

<details>
<summary><b>Porta já está em uso</b></summary>

```bash
# Linux/macOS
lsof -i :3000 && kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

</details>

<details>
<summary><b>Problemas com dependências</b></summary>

```bash
# Limpe e reinstale
rm -rf node_modules package-lock.json
npm install

# Windows
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

</details>

<details>
<summary><b>Erro ao iniciar Supabase local</b></summary>

Certifique-se de que o Docker está rodando:

```bash
docker ps
```

Se necessário, pare e reinicie:

```bash
npm run db:local:stop
npm run db:local:start
```

</details>

## 📚 Documentação

### Apps

| Módulo | Descrição | README |
|--------|-----------|--------|
| **mindease-web** | App principal (Next.js) | [📖 Ver docs](apps/mindease-web/README.md) |
| **mindease-web-auth** | Micro frontend de autenticação | [📖 Ver docs](apps/mindease-web-auth/README.md) |
| **mindease-native** | App mobile (Expo/React Native) | [📖 Ver docs](apps/mindease-native/README.md) |

### Packages

| Package | Descrição | README |
|---------|-----------|--------|
| **database** | Cliente Supabase, queries tipadas e schema | [📖 Ver docs](packages/database/README.md) |
| **design-system** | Componentes UI + Storybook | [📖 Ver docs](packages/design-system/README.md) |
| **models** | Tipos, interfaces e enums TypeScript | [📖 Ver docs](packages/models/README.md) |
| **services** | Serviços HTTP e storage | [📖 Ver docs](packages/services/README.md) |
| **utils** | Funções utilitárias (formatDate, formatCurrency) | [📖 Ver docs](packages/utils/README.md) |
| **validation-schemas** | Schemas Zod compartilhados | [📖 Ver docs](packages/validation-schemas/README.md) |
| **vitest-preset** | Configuração Vitest compartilhada | [📖 Ver docs](packages/vitest-preset/README.md) |
| **eslint-config** | Configuração ESLint | [📖 Ver docs](packages/eslint-config/README.md) |
| **typescript-config** | Configuração TypeScript | [📖 Ver docs](packages/typescript-config/README.md) |

## 📄 Licença

Este projeto faz parte do Hackathon FIAP Pós-Tech.
