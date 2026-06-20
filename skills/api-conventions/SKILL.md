---
name: api-conventions
description: Trigger automático cuando diseñes rutas HTTP, endpoints de API RESTful, schemas GraphQL o respuestas de servicios.
---
# API Design & Conventions

## Estándares:
- **Códigos de Estado:** Usa códigos HTTP explícitos y correctos (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Error).
- **Estructura de Errores:** Retorna respuestas de error uniformes: `{ "error": { "code": "STATUS", "message": "Mensaje legible" } }`.
- **Versionado:** Usa versionado explícito en la URL (ej. `/api/v1/...`).