# `@mindease/typescript-config`

Configuração TypeScript compartilhada para o workspace.

## 📦 Configs Disponíveis

| Config | Uso |
|--------|-----|
| `base.json` | Packages TypeScript genéricos |
| `nextjs.json` | Apps Next.js |
| `react-library.json` | Packages com componentes React |

## 🚀 Uso

```json
// tsconfig.json de um app Next.js
{
  "extends": "@mindease/typescript-config/nextjs",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}

// tsconfig.json de um package React
{
  "extends": "@mindease/typescript-config/react-library",
  "include": ["src"]
}
```
