# ✅ Validation Schemas

Schemas **Zod** compartilhados para validação de formulários.

## 📦 Exports

```typescript
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  commonValidations,
  withPasswordConfirmation,
} from '@mindease/validation-schemas';

import type {
  LoginSchema,
  SignupSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from '@mindease/validation-schemas';
```

## 📋 Schemas de Autenticação

### `loginSchema`

```typescript
// { email, password }
const form = useForm<LoginSchema>({
  resolver: zodResolver(loginSchema),
});
```

### `signupSchema`

```typescript
// { name, email, password, confirmPassword } + validação de senhas iguais
const form = useForm<SignupSchema>({
  resolver: zodResolver(signupSchema),
});
```

### `forgotPasswordSchema`

```typescript
// { email }
const form = useForm<ForgotPasswordSchema>({
  resolver: zodResolver(forgotPasswordSchema),
});
```

### `resetPasswordSchema`

```typescript
// { password, confirmPassword } + validação de senhas iguais
const form = useForm<ResetPasswordSchema>({
  resolver: zodResolver(resetPasswordSchema),
});
```

## 📋 Validações Comuns

Validadores reutilizáveis para campos de formulário:

```typescript
import { commonValidations } from '@mindease/validation-schemas';

// Campo de email
const emailField = commonValidations.email;

// Campo de senha (mínimo 6 caracteres)
const passwordField = commonValidations.password;

// String obrigatória com mensagem customizada
const titleField = commonValidations.requiredString('Título é obrigatório');

// Nome (mínimo 2 caracteres)
const nameField = commonValidations.name;

// Número positivo
const pomodorosField = commonValidations.positiveNumber;

// Data obrigatória
const dueDateField = commonValidations.requiredDate;
```

## 📋 Helper: `withPasswordConfirmation`

Adiciona validação de confirmação de senha a qualquer schema:

```typescript
import { withPasswordConfirmation } from '@mindease/validation-schemas';
import { z } from 'zod';

const changePasswordSchema = withPasswordConfirmation(
  z.object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
);
```

> **Nota:** `signupSchema` e `resetPasswordSchema` já incluem esta validação internamente.

## 🔗 Estendendo Schemas

Os schemas base foram projetados para extensão:

```typescript
import { loginSchema } from '@mindease/validation-schemas';

// Adicionar campo extra ao login
const loginWithRememberMe = loginSchema.extend({
  rememberMe: z.boolean().optional(),
});
```

## 🎯 Por que um Package Separado?

- **Reutilização**: Schemas compartilhados entre `mindease-web-auth` e `mindease-native`
- **Single Source of Truth**: Regras de validação definidas em um único lugar
- **Type Inference**: Zod infere os tipos TypeScript automaticamente
