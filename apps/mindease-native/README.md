# 📱 MindEase Native

Aplicação mobile construída com **React Native 0.79** e **Expo SDK 53**.

## 📋 Visão Geral

App mobile do MindEase com roteamento via **Expo Router** e compartilhamento de packages com os apps web:
- Reutiliza `@mindease/models`, `@mindease/services` e `@mindease/database`
- Roteamento file-based idêntico ao padrão Next.js

## 🚀 Desenvolvimento

```bash
# Na raiz do monorepo
npm run dev --workspace apps/mindease-native

# Ou inicie todos os apps
npm run dev
```

### Executar no Dispositivo

1. Instale o **Expo Go** (App Store / Google Play)
2. Escaneie o QR code exibido no terminal

### Executar no Emulador

```bash
cd apps/mindease-native

# iOS (requer macOS + Xcode)
npm run ios

# Android (requer Android Studio)
npm run android
```

### Executar no Navegador

Acesse: [http://localhost:8081](http://localhost:8081)

## 📁 Estrutura

```
mindease-native/
├── app/
│   ├── _layout.tsx            # Layout raiz (Expo Router)
│   └── index.tsx              # Tela inicial
├── components/
│   └── ui/                    # Componentes UI mobile
├── constants/
│   └── Colors.ts              # Paleta de cores
├── hooks/
│   └── useThemeColor.ts       # Hook de tema
└── __mocks__/                 # Mocks para testes (Jest)
    ├── expo-asset.js
    ├── expo-constants.js
    ├── expo-font.js
    └── expo-symbols.js
```

## 🔐 Autenticação

O app usa o cliente Supabase compartilhado do package `@mindease/database`:

```typescript
import { createClient } from '@mindease/database/client';

const supabase = createClient();
```

## 🧪 Testes

```bash
# Na raiz do monorepo
npm run test --workspace apps/mindease-native

# Ou diretamente
cd apps/mindease-native
npm test
```

Usa **Jest** com `jest-expo` preset para suporte a módulos nativos.

## 🔐 Variáveis de Ambiente

```bash
# apps/mindease-native/.env.local
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

## 📦 Dependências Internas

| Package | Função |
|---------|--------|
| `@mindease/database` | Cliente Supabase |
| `@mindease/models` | Interfaces TypeScript compartilhadas |
| `@mindease/services` | `HTTPService`, `StorageService` |

## 🛠️ Stack Mobile

| Tech | Versão | Função |
|------|--------|--------|
| React Native | 0.79.5 | Framework mobile |
| Expo SDK | ~53.0 | Toolchain e APIs nativas |
| Expo Router | ~5.1 | Roteamento file-based |
| react-native-reanimated | latest | Animações fluidas |
| react-native-gesture-handler | latest | Gestos nativos |
| react-native-web | latest | Suporte a Expo Web |
