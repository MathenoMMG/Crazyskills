# Proyecto: Sistema Obsidian

## Esquema Completo Actual
El sistema está desplegado en la raíz global de Claude (`%USERPROFILE%\.claude\`) y la configuración se unificó en `%USERPROFILE%\.claude.json`.

- **`/hooks`**:
  - `obsidian-capture.sh`: Captura de correcciones/preferencias.
  - `obsidian-flush.sh`: Ejecuta la consolidación y el script `auto-forge.js` al detenerse el agente.
  - `block-dangerous.sh`: Bloqueo de comandos críticos.
  - `auto-forge.js`: Consolidación en segundo plano de observaciones a `learnings.md`.
  - `weekly-audit.sh` & `weekly-review.sh`: Auditorías periódicas.
- **`/commands` & `/agents`**:
  - `obs.md` y `forge.md`.
- **`/skills`**:
  - 22 skills con manifiestos de reglas (`SKILL.md`) y delta de aprendizajes (`learnings.md`).
- **Programador de Tareas**:
  - Tarea registrada `ObsidianWeeklyAudit` programada para ejecutarse los viernes a las 18:00 de forma silenciosa.
- **`comparativa_rendimiento.md`**:
  - Bitácora global e independiente de herramientas, guardada directamente en tu carpeta de usuario `%USERPROFILE%\comparativa_rendimiento.md` para auditar el impacto en todos los proyectos de tu PC.

## Qué hay
- [x] Configuración de directrices globales y hooks de sistema en `settings.json` y `.claude.json`.
- [x] Scripts de control e integración de Node.js instalados y probados.
- [x] Skills básicas, avanzadas y transversales (22 en total) configuradas.
- [x] Automatización silenciosa del proceso de `forge` mediante `auto-forge.js` activada en el stop hook.
- [x] Registro de la tarea programada semanal en Windows Task Scheduler.
- [x] Reglas globales `AGENTS.md` y `CLAUDE.md` actualizadas con la regla del Logbook Activo (`working.md`).
- [x] Unificación del servidor MCP de `engram` en Claude Code.
- [x] Enlace físico bidireccional (Directory Junction) entre la carpeta de skills de Antigravity y Claude Code.
- [x] Empaquetado de scripts en `setup.js` para portabilidad del repositorio.
- [x] Corrección en `weekly-audit.sh` para ignorar la salida "No memories found" de Engram y evitar archivos vacíos.
- [x] Desvinculación de `comparativa_rendimiento.md` de Git y creación de `.gitignore`.
- [x] Reubicación del archivo de rendimiento a la raíz de tu perfil de usuario (`%USERPROFILE%\comparativa_rendimiento.md`) para centralizar la auditoría de todos los proyectos de tu PC.

## Qué hace falta
- [ ] Monitorización de los primeros ciclos automáticos de `auto-forge.js` tras capturas reales de observaciones para verificar la resolución correcta en Engram.
- [ ] Rellenar la comparativa cuantitativa y cualitativa de rendimiento dentro de una semana (2026-06-27).

## Qué está fallando
- Ningún fallo detectado. Los scripts han sido probados y responden correctamente en el entorno de Git Bash de Windows.
