---
name: zero-downtime-databases
description: Trigger automático al alterar esquemas SQL/NoSQL, crear tablas, agregar índices o remover columnas de producción.
---
# Zero-Downtime Database Migrations
Toda mutación de base de datos en producción debe hacerse sin interrumpir el servicio:
- **Expand & Contract:** Para renombrar o borrar columnas: 1) Agrega la nueva columna, 2) Escribe en ambas, 3) Migra los datos antiguos, 4) Cambia la lectura a la nueva columna, 5) Elimina la columna antigua.
- **Locks:** Evita bloqueos de tablas pesadas usando escrituras/índices concurrentes (`CREATE INDEX CONCURRENTLY`).