# 🧪 Vitest Preset

Configurações **Vitest** compartilhadas para o monorepo.

## 📦 Exports

```javascript
// Configuração base (ambiente Node)
import { createBaseConfig } from '@mindease/vitest-preset';
import { createBaseConfig } from '@mindease/vitest-preset/base';

// Configuração para projetos React (jsdom + Testing Library)
import { createReactConfig } from '@mindease/vitest-preset/react';

// Arquivos de setup
import '@mindease/vitest-preset/setup';        // Setup base
import '@mindease/vitest-preset/setup-react';  // Setup com Testing Library
```

## 🚀 Uso

### Package Node/TypeScript puro

```javascript
// vitest.config.ts
import { createBaseConfig } from '@mindease/vitest-preset';

export default createBaseConfig({
  test: {
    // overrides específicos do package
  },
});
```

### App React / Next.js

```javascript
// vitest.config.ts
import { createReactConfig } from '@mindease/vitest-preset/react';

export default createReactConfig({
  test: {
    // overrides específicos do app
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

## ⚙️ Configuração Base (`createBaseConfig`)

- **Environment**: `node`
- **Globals**: `true` (describe, it, expect disponíveis sem importar)
- **Coverage**: provider `v8`, reporters `text`, `json`, `html`, `lcov`
- **Include**: `**/*.{test,spec}.{js,ts,jsx,tsx}`
- **Exclude**: `node_modules`, `dist`, `.next`, `build`

## ⚙️ Configuração React (`createReactConfig`)

Extends a base config com:
- **Environment**: `jsdom`
- **Plugin**: `@vitejs/plugin-react`
- **Setup**: `@testing-library/jest-dom` (matchers como `toBeInTheDocument`)
- **Coverage exclude extra**: `**/app/**/layout.tsx`, `**/app/**/page.tsx`

## 📋 Stack de Testes

| Lib | Versão | Função |
|-----|--------|--------|
| `vitest` | ^3.1 | Test runner e assertion |
| `@testing-library/react` | latest | Renderização de componentes |
| `@testing-library/user-event` | latest | Simulação de interações |
| `@testing-library/jest-dom` | latest | Matchers DOM customizados |
| `jsdom` | latest | DOM simulado para testes |

## 🎯 Por que um Package Separado?

- **Consistência**: Mesma configuração de testes em todos os packages
- **DRY**: Sem duplicação de `vitest.config` boilerplate
- **Fácil atualização**: Mudar a config base reflete em todo o monorepo
