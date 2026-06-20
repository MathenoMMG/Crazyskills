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
- **`councils/`**:
  - `agents/`: Perfiles markdown de personalidad y aprendizajes acumulativos (`[agente].md`).
  - `notes/`: Notas y opiniones de los agentes sobre la situación actual (`[agente]_notes.md`).
  - `research/`: Datos y fuentes recolectadas sin tokens por el scraper diario (`[agente]_research.md`).
  - `debates/`: Transcripciones históricas de debates del consejo (`debate_[timestamp].md`).
  - `run-council.js`: Script de orquestación y parser automático para actualizar notas y memorias.
  - `scrape.js`: Scraper diario autónomo de Google News RSS y Dev.to.
  - `investigaciones.md`: Bitácora comparativa y propuestas de integración.

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
- [x] Creación del archivo de bitácora `comparativa_rendimiento.md` en `%USERPROFILE%\comparativa_rendimiento.md`.
- [x] Creación del sistema de deliberación **Councils** con los perfiles de los 5 agentes en `councils/agents/`.
- [x] Implementación del script de ejecución `councils/run-council.js` que invoca dinámicamente al agente local para el debate.
- [x] Creación del archivo inicial de comparación de competencia `councils/investigaciones.md`.
- [x] Estructuración de 3 archivos por agente (Personalidad/Memoria, Notas, Research).
- [x] Scraper diario libre de tokens configurado con Google News RSS y Dev.to/Reddit.
- [x] Parser automático de persistencia de opiniones y memorias en `run-council.js`.
- [x] Configuración de tareas programadas de Windows integradas en `setup.js`.

## Qué hace falta
- [ ] Ejecutar el primer debate del consejo usando el script `run-council.js` o mediante Antigravity para validar su funcionamiento completo y la persistencia de datos.
- [ ] Monitorización de los primeros ciclos automáticos de `auto-forge.js` tras capturas reales de observaciones para verificar la resolución correcta en Engram.
- [ ] Rellenar la comparativa cuantitativa y cualitativa de rendimiento dentro de una semana (2026-06-27).

## Qué está fallando
- Ningún fallo detectado. Los scrapers y el script del council han sido probados con éxito.
