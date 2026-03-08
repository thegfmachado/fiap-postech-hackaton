# 🎨 Design System

Biblioteca de componentes UI reutilizáveis, documentada com **Storybook 8.6**.

## 📋 Visão Geral

Design System compartilhado entre os apps web do MindEase:
- Componentes baseados em **Radix UI** (acessibilidade nativa)
- Estilização com **TailwindCSS v4** e **CVA**
- Ícones via **Lucide React**
- Documentação interativa no Storybook

## 🚀 Desenvolvimento

```bash
# Iniciar Storybook
npm run dev --workspace packages/design-system
```

## 📦 Componentes

| Componente | Descrição |
|------------|-----------|
| `Button` | Botões com variantes (default, outline, ghost, etc.) |
| `Card` | Container com header, content e footer |
| `Checkbox` | Caixas de seleção acessíveis |
| `Form` | Wrapper para React Hook Form |
| `Input` | Campos de texto |
| `Label` | Labels de formulário |
| `NavigationMenu` | Menu de navegação |
| `Skeleton` | Loading placeholders |
| `Toaster` | Notificações via Sonner |

## 🎯 Uso

```tsx
import { Button, Card, Input, Toaster } from '@mindease/design-system/components';

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Título da tarefa" />
      <Button variant="default">Criar Tarefa</Button>
    </Card>
  );
}
```

## CSS Global

```tsx
// No layout raiz do app
import '@mindease/design-system/globals.css';
```

## 🛠️ Stack

- **Radix UI**: Primitivos acessíveis (foco, teclado, aria)
- **TailwindCSS v4**: Utilitários de estilo
- **CVA (Class Variance Authority)**: Variantes de componentes
- **Lucide React**: Ícones
- **Sonner**: Sistema de toasts
- **next-themes**: Suporte a tema claro/escuro
- **Storybook**: Documentação e desenvolvimento isolado

## 📁 Estrutura

```
design-system/
├── src/
│   ├── components/            # Componentes UI
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   └── button.stories.tsx
│   │   ├── card/
│   │   ├── checkbox/
│   │   ├── form/
│   │   ├── input/
│   │   ├── label/
│   │   ├── navigation-menu/
│   │   ├── skeleton/
│   │   ├── toaster/
│   │   └── index.ts          # Re-exports
│   ├── lib/                  # Utilitários (cn, etc.)
│   └── styles/
│       └── globals.css
├── .storybook/               # Configuração Storybook
└── postcss.config.mjs
```

## 🎨 Criando um Novo Componente

1. Crie a pasta em `src/components/novo-componente/`
2. Implemente o componente
3. Crie stories em `novo-componente.stories.tsx`
4. Exporte em `src/components/index.ts`

```tsx
// src/components/novo-componente/novo-componente.tsx
import { cn } from '../../lib/utils';

export interface NovoComponenteProps {
  children: React.ReactNode;
  className?: string;
}

export function NovoComponente({ children, className }: NovoComponenteProps) {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  );
}
```
