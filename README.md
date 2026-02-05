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

- **Quadro Kanban Visual**: Organize tarefas em colunas (A Fazer, Em Andamento, Concluído)
- **Timer Pomodoro Flexível**: Intervalos personalizáveis para manter o foco
- **Interface Adaptável**: Níveis de complexidade variáveis na exibição
- **Design Acessível**: Focado em reduzir sobrecarga sensorial
- **Aplicação Web e Mobile**: Acesse de qualquer dispositivo
- **Autenticação Segura**: Sistema completo com Supabase

## 🚀 Início Rápido

### 📋 Pré-requisitos

- **Node.js** 20+
- **npm** 11.4.2+
- **Docker** (opcional, para Supabase local)

### ⚡ Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd fiap-postech-hackaton

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase

# Inicie todas as aplicações
npm run dev
```

### 🌐 URLs de Desenvolvimento

| Serviço | URL | Descrição |
|---------|-----|-----------|
| App Principal | [localhost:3000](http://localhost:3000) | Interface web principal |
| App Auth | [localhost:3001](http://localhost:3001) | Autenticação (micro frontend) |
| App Mobile | [localhost:8081](http://localhost:8081) | Aplicação mobile (Expo Web) |

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
    ├── design-system/          # Componentes UI compartilhados
    ├── models/                 # Tipos e interfaces TypeScript
    ├── services/               # Serviços HTTP e storage
    ├── utils/                  # Funções utilitárias
    ├── validation-schemas/     # Schemas Zod para validação
    ├── eslint-config/          # Configuração ESLint
    └── typescript-config/      # Configuração TypeScript
```

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
│ • Timer Pomodoro│  │ • Auth Flow     │  │ • Pomodoro      │
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

## 🔧 Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| **Frontend Web** | Next.js 15, React 19, TypeScript 5.8, TailwindCSS |
| **Frontend Mobile** | React Native 0.79, Expo SDK 53, NativeWind |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Build** | TurboRepo 2.5 |
| **UI** | Radix UI, Design System compartilhado |
| **Validação** | Zod, React Hook Form |

## 📋 Comandos

### Desenvolvimento

```bash
npm run dev              # Iniciar todas as apps
npm run build            # Build de produção
npm run lint             # Verificar código
npm run check-types      # Verificar tipos TypeScript
```

### Banco de Dados

```bash
npm run db:local:start   # Iniciar Supabase local
npm run db:local:stop    # Parar Supabase local
npm run db:local:status  # Ver status e credenciais
```

### Docker

```bash
npm run docker:build     # Build das imagens
npm run docker:up        # Subir containers
npm run docker:down      # Parar containers
```

### Workspace Específico

```bash
npm run dev --workspace apps/mindease-web
npm run dev --workspace apps/mindease-native
npm run build --workspace packages/design-system
```

## 🌍 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
MINDEASE_WEB_DOMAIN=http://localhost:3000
MINDEASE_WEB_AUTH_DOMAIN=http://localhost:3001
```

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

## 📄 Licença

Este projeto faz parte do Hackathon FIAP Pós-Tech.
