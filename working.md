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
  - `logs_becario/`: Logs de auditoría del becario local — **ignorados por Git**, solo en local.
  - `ollama-runner.js`: Runner del becario local con escáner de seguridad (`securityScan` — 8 patrones regex) y logger mandatorio (`writeInternLog` → `councils/logs_becario/log_[timestamp].md`).
  - `run-council.js`: Script de orquestación que carga `principles.md` global, `learnings.md` del proyecto y últimos 5 logs del becario antes de cada debate.
  - `scrape.js`: Scraper diario autónomo de Google News RSS y Dev.to/Reddit.
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
- [x] Corrección en `weekly-audit.sh` para ignorar la salida "No memories found" de Engram.
- [x] Creación del archivo de bitácora `comparativa_rendimiento.md` en `%USERPROFILE%\comparativa_rendimiento.md`.
- [x] Sistema de deliberación **Councils** con perfiles de 5 agentes en `councils/agents/`.
- [x] Script `run-council.js` con inyección de `principles.md`, `learnings.md` y últimos 5 logs del becario.
- [x] Scraper diario libre de tokens con Google News RSS, Dev.to, Reddit, Hacker News, YouTube y GitHub RSS.
- [x] Parser automático de persistencia de opiniones y memorias en `run-council.js`.
- [x] Configuración de tareas programadas de Windows integradas en `setup.js`.
- [x] `.gitignore` protegiendo: `notes/`, `research/`, `debates/`, `logs_becario/`, `learnings.md`.
- [x] **Becario local (Ollama):** `securityScan()` con 8 patrones regex + `writeInternLog()` en todos los modos (`--code`, `--test`, `--summarize`).
- [x] **Auditoría del becario:** `run-council.js` carga los últimos 5 logs para que Architect y Orchestrator detecten vulnerabilidades antes de aprobar código.
- [x] `setup.js` crea `logs_becario/` en instalaciones nuevas (ignorado por Git).
- [x] **Configuración Híbrida 7B:** Activación de `qwen2.5-coder:7b` limitando la carga a 15 capas en la GPU dedicada (GTX 1650 Ti) para conservar margen de VRAM y derivar el resto a los 24GB de RAM.
- [x] Commit `f145e48` pusheado a origin/main.


- [x] Ejecutar primer ciclo real del becario: `node councils/ollama-runner.js --test` y verificar que se genera `log_[timestamp].md` en `councils/logs_becario/`.
- [x] Ejecutar `node councils/run-council.js` para validar que los 4 bloques de contexto (working.md, principles.md, learnings.md, logs del becario) aparecen correctamente en el prompt.
- [x] Rellenar comparativa cuantitativa en `comparativa_rendimiento.md` con los datos reales obtenidos de `opencode stats`.
- [x] Definir e implementar la política de rotación de logs del becario (máximo 30 archivos, eliminar el más antiguo en `ollama-runner.js`).
- [x] Diseñar, implementar y desplegar el nuevo slash command `/rese` (`rese.md`) de forma global (`%USERPROFILE%\.claude\`) y local (`.claude/`).
- [x] Ejecutar la prueba completa de `/rese mejores skills para nuestro proyecto actual` utilizando scraping real (búsqueda web) y síntesis del becario local (Ollama).
- [x] Iniciar debate del consejo consultivo (Council) para deliberar sobre las nuevas nociones de arquitectura y seguridad.
- [x] Crear e integrar la nueva skill de seguridad `/challenge` (`skills/obsidian-challenge/SKILL.md`) para modelado de amenazas antes de codificar.
- [x] Formalizar las directivas de Revelación Progresiva, Quality Gates y Threat Modeling en el archivo global de principios (`principles.md` y `setup.js`).
- [x] Actualizar las notas y opiniones del consejo de los 5 agentes del sistema en `councils/notes/` para sincronizar su base de conocimiento.

## Qué hace falta
- [ ] Monitorizar primeros ciclos de `auto-forge.js` tras capturas reales de observaciones.
- [ ] Recopilar métricas de uso semanales en `comparativa_rendimiento.md` tras 7 días de desarrollo activo (fecha límite: 2026-06-28).

## Qué está fallando
- Ningún fallo detectado. Todos los scripts han sido probados con éxito o validados estáticamente.
