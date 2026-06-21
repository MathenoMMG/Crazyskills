# Proyecto: Sistema Obsidian (Entorno de Memoria Centralizado)

## Esquema Completo Actual
El sistema de memoria pura está desplegado en la raíz global de Claude (`%USERPROFILE%\.claude\`) y la configuración se unificó en `%USERPROFILE%\.claude.json`.

- **`/hooks`**:
  - `obsidian-capture.sh`: Captura de correcciones/preferencias.
  - `obsidian-flush.sh`: Ejecuta la consolidación y el script `auto-forge.js` al detenerse el agente.
  - `block-dangerous.sh`: Bloqueo de comandos críticos.
  - `auto-forge.js`: Consolidación en segundo plano de observaciones a `learnings.md`.
  - `weekly-audit.sh` & `weekly-review.sh`: Auditorías periódicas.
- **`/commands` & `/agents`**:
  - `obs.md`, `forge.md`, `mem.md`.
- **`/skills`**:
  - 23 skills con manifiestos de reglas (`SKILL.md`) y delta de aprendizajes (`learnings.md`), incluyendo la skill `obsidian-challenge`.
- **Programador de Tareas**:
  - Tarea registrada `ObsidianWeeklyAudit` programada para ejecutarse los viernes a las 18:00 de forma silenciosa.
- **`comparativa_rendimiento.md`**:
  - Bitácora global e independiente de herramientas, guardada directamente en tu carpeta de usuario `%USERPROFILE%\comparativa_rendimiento.md` para auditar el impacto en todos los proyectos de tu PC.

## Qué hay
- [x] Configuración de directrices globales y hooks de sistema en `settings.json` y `.claude.json`.
- [x] Scripts de control e integración de Node.js instalados y probados.
- [x] Skills básicas, avanzadas y transversales (23 en total) configuradas.
- [x] Automatización silenciosa del proceso de `forge` mediante `auto-forge.js` activada en el stop hook.
- [x] Registro de la tarea programada semanal en Windows Task Scheduler.
- [x] Reglas globales `AGENTS.md` y `CLAUDE.md` actualizadas con la regla del Logbook Activo (`working.md`).
- [x] Unificación del servidor MCP de `engram` en Claude Code.
- [x] Enlace físico bidireccional (Directory Junction) entre la carpeta de skills de Antigravity y Claude Code.
- [x] Empaquetado de scripts en `setup.js` para portabilidad del repositorio.
- [x] Corrección en `weekly-audit.sh` para ignorar la salida "No memories found" de Engram.
- [x] Creación del archivo de bitácora `comparativa_rendimiento.md` en `%USERPROFILE%\comparativa_rendimiento.md`.
- [x] Configuración de tareas programadas de Windows integradas en `setup.js` (Solo auditoría semanal).
- [x] `.gitignore` protegiendo: `learnings.md` locales.
- [x] Eliminada la infraestructura de Ollama, Councils, Scrapers y tareas asociadas en la rama `memory-only`.
- [x] Despliegue de los comandos locales en `.claude/` y globales en `%USERPROFILE%\.claude\`.

## Qué hace falta
- [ ] Monitorizar primeros ciclos de `auto-forge.js` tras capturas reales de observaciones.
- [ ] Recopilar métricas de uso semanales en `comparativa_rendimiento.md` tras 7 días de desarrollo activo (fecha límite: 2026-06-28).

## Qué está fallando
- Ningún fallo detectado. Todos los scripts de memoria han sido probados con éxito o validados estáticamente.cripts han sido probados con éxito o validados estáticamente.
