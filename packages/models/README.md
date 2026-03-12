# 📝 Models

Tipos, interfaces e enums TypeScript compartilhados entre os apps.

## 📦 Exports

```typescript
import {
  IUser,
  Task,
  TaskToInsert,
  Settings,
  ChecklistItem,
  Status,
  Priority,
  ViewMode,
  ContrastMode,
  Size,
} from '@mindease/models';
```

## 📋 Interfaces

### `Task`

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  dueDate?: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt?: string;
  updatedAt?: string;
  priority: Priority;
}
```

### `TaskToInsert`

```typescript
interface TaskToInsert {
  id?: string;
  title: string;
  description?: string;
  status?: Status;
  dueDate?: string;
  estimatedPomodoros?: number;
  completedPomodoros?: number;
  priority?: Priority;
  userId?: string;
}
```

### `Settings`

```typescript
interface Settings {
  pomodoroDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
  longBreakAfterPomodoros: number;
  viewMode: ViewMode;
  contrastMode: ContrastMode;
  spacing: Size;
  fontSize: Size;
}
```

### `IUser`

```typescript
interface IUser {
  email: string;
  password: string;
  name: string;
}
```

### `ChecklistItem`

```typescript
interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
}
```

## 🏷️ Enums

| Enum | Valores |
|------|---------|
| `Status` | `todo`, `doing`, `done` |
| `Priority` | `low`, `medium`, `high` |
| `ViewMode` | `summary`, `detailed` |
| `ContrastMode` | `low`, `high` |
| `Size` | `small`, `medium`, `large` |

## 🎯 Por que um Package Separado?

- **Compartilhamento**: Mesmos tipos em `mindease-web`, `mindease-web-auth` e `mindease-native`
- **Single Source of Truth**: Uma mudança de tipo atualiza todo o monorepo
- **Type Safety**: TypeScript garante consistência entre apps e packages
