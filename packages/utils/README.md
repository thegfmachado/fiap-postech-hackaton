# 🛠️ Utils

Funções utilitárias compartilhadas entre os apps.

## 📦 Exports

```typescript
import { formatDate, formatCurrency } from '@mindease/utils';
```

## 📋 Funções

### `formatDate`

Formata datas no padrão brasileiro com suporte a diferentes estilos:

```typescript
formatDate(new Date('2025-01-15'));              // "15/01/2025"
formatDate(new Date(), 'long');                  // "15 de janeiro de 2025"
formatDate(new Date(), 'medium');                // "15 de jan. de 2025"
```

O segundo argumento aceita todos os valores de `Intl.DateTimeFormatOptions["dateStyle"]`:
- `"short"` (padrão) — `15/01/2025`
- `"medium"` — `15 de jan. de 2025`
- `"long"` — `15 de janeiro de 2025`
- `"full"` — `quarta-feira, 15 de janeiro de 2025`

### `formatCurrency`

Formata valores monetários em Real brasileiro:

```typescript
formatCurrency(1234.56);   // "R$ 1.234,56"
formatCurrency(0);         // "R$ 0,00"
formatCurrency(-500);      // "-R$ 500,00"

// Com opções customizadas do Intl.NumberFormat:
formatCurrency(50, { maximumFractionDigits: 0 }); // "R$ 50"
```

## 🎯 Por que um Package Separado?

- **DRY**: Sem duplicação de lógica de formatação em cada app
- **Consistência**: Mesmo formato em `mindease-web` e `mindease-native`
- **Testabilidade**: Funções puras com testes unitários via Vitest
