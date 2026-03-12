# 🔌 Services

Serviços HTTP e storage compartilhados entre os apps.

## 📦 Exports

```typescript
import { HTTPService, HttpClient, HttpError, handleResponseError } from '@mindease/services/http';
import { StorageService } from '@mindease/services/storage';
// ou tudo de uma vez:
import { HTTPService, StorageService } from '@mindease/services';
```

## 📋 HTTP Service

### `HTTPService`

Cliente HTTP com Content-Type `application/json` e tratamento de erros:

```typescript
const http = new HTTPService();

// GET
const data = await http.get<Task[]>('/api/tasks');

// POST
const task = await http.post<Task>('/api/tasks', {
  title: 'Nova tarefa',
  status: 'todo',
});

// PATCH
await http.patch<Task>(`/api/tasks/${id}`, { status: 'done' });

// DELETE
await http.delete<Task>(`/api/tasks/${id}`);
```

### `HttpClient`

Cliente HTTP simplificado com suporte a `baseUrl`:

```typescript
const client = new HttpClient('http://localhost:3000');

const tasks = await client.get<Task[]>('/api/tasks');
await client.post('/api/tasks', task);
await client.put(`/api/tasks/${id}`, updates);
await client.delete(`/api/tasks/${id}`);
```

### `HttpError`

Classe de erro HTTP com código de status:

```typescript
throw new HttpError(404, 'Task not found');
// err.status === 404
// err.message === 'Task not found'
```

### `handleResponseError`

Converte erros em `Response` padronizado para uso em API Routes:

```typescript
// Em app/api/tasks/route.ts
try {
  const task = await service.create(data);
  return Response.json(task);
} catch (err) {
  return handleResponseError(err);
  // HttpError(404)  → Response(message, { status: 404 })
  // outros erros    → Response('Internal Server Error', { status: 500 })
}
```

## 📋 Storage Service

Wrapper SSR-safe em torno do `localStorage`:

```typescript
const storage = new StorageService();

storage.setItem('pomodoroSettings', JSON.stringify(settings));
const raw = storage.getItem('pomodoroSettings');
storage.removeItem('pomodoroSettings');
storage.clear();
```

> **Nota:** Todos os métodos verificam `typeof window !== 'undefined'` antes de executar, prevenindo erros em SSR.

## 🎯 Por que um Package Separado?

- **Reutilização**: Mesmo cliente HTTP em `mindease-web` e `mindease-native`
- **Abstração**: Encapsula lógica de rede e storage em um único lugar
- **Centralização**: Tratamento de erros consistente em todos os apps
