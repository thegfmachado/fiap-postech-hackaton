# `@mindease/eslint-config`

Configuração ESLint compartilhada para o workspace.

## 📦 Configs Disponíveis

| Config | Uso |
|--------|-----|
| `base.js` | Projetos TypeScript genéricos |
| `next.js` | Apps Next.js |
| `react-internal.js` | Packages React internos (design-system, etc.) |

## 🚀 Uso

```javascript
// eslint.config.js de um app Next.js
import { nextConfig } from '@mindease/eslint-config/next';
export default [...nextConfig];

// eslint.config.js de um package React
import { reactInternalConfig } from '@mindease/eslint-config/react-internal';
export default [...reactInternalConfig];
```
