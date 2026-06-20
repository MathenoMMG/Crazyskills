---
name: obsidian-forge
description: Crea skills nuevas y evoluciona skills existentes usando las observaciones almacenadas en Engram. Activa cuando el usuario pida crear una skill, cuando Engram tenga 3+ observaciones del mismo scope, durante el review semanal, o cuando alguien diga "forge", "crea skill", "mejora skill X", "review de skills". También activa proactivamente si obsidian-pulse ha guardado 2+ entradas en scope nueva:*.
---

# Obsidian Forge — Creación y Evolución de Skills

Forge transforma las observaciones de Engram en SKILL.md reales.
Usa skill-creator de Anthropic como motor cuando esté disponible.

## Paso 1 — Recopilar de Engram

```bash
# Para evolucionar skill existente
engram search --scope "skill:[nombre]" --type observation --limit 20

# Para detectar candidatas nuevas
engram search --scope "skill:nueva:*" --type observation

# Para principios globales
engram search --scope "skill:global" --type observation
```

## Paso 2 — Clasificar

**Evolucionar skill existente** (3+ obs del mismo scope):
Lee SKILL.md actual → integra obs como delta nativo → no reescribas si no es necesario.

**Skill nueva** (scope nueva:* con 2+ entradas, o usuario la pide explícitamente):
Lanza flujo de creación (ver Paso 4).

**Principio global** (scope skill:global):
Añade a `~/.claude/principles.md` y referencia desde CLAUDE.md nano.

## Paso 3 — Evolucionar skill existente

Lee SKILL.md actual. Para cada observación:
- Regla nueva → añade en sección correspondiente, estilo nativo
- Anti-patrón → añade en sección de anti-patrones o créala
- Corrección de regla existente → modifica en su sitio, no dupliques
- Simplificación → elimina lo que nunca se usa

**Criterio de economía:** no reescribas la skill entera.
Cambia solo lo que cambia. Si cambios > 30% del contenido → propón reescritura y pide confirmación.

Crea/actualiza `learnings.md` con un log de los cambios (una línea por entrada):
```
- [fecha] [título obs Engram] → [qué cambió en la skill]
```

## Paso 4 — Crear skill nueva (proceso del skill-creator de Anthropic)

**a) Capturar intent desde Engram:**
```bash
engram search --scope "skill:nueva:[nombre]" --type observation
```
Extrae: qué hace, cuándo activa, output esperado, diferencia de skills existentes.

**b) Entrevistar al usuario (si está presente):**
- ¿Qué debe hacer exactamente esta skill?
- ¿Qué frases del usuario deben triggerearla?
- ¿Cuál es el formato de output esperado?
- ¿Tiene scripts o referencias que añadir?

**c) Escribir SKILL.md draft:**
```yaml
---
name: [kebab-case, max 64 chars]
description: [qué hace + cuándo activa, formulado pushily para que Claude lo dispare.
             Incluye frases concretas que deben triggerarlo. Claude undertriggers — sé explícito.]
---
```
Cuerpo: proceso en pasos, ejemplos, anti-patrones. **Máx 500 líneas.**
Si necesita más → usa `references/` para material auxiliar con punteros claros desde SKILL.md.

**d) Verificar antes de guardar:**
- ¿Description suficientemente pushy? (undertriggering es el fallo más común)
- ¿Cuerpo contiene SOLO proceso? (no contexto, no histórico, no brand guidelines)
- ¿Output format definido explícitamente?
- ¿learnings.md vacío creado?

**e) Crear estructura:**
```bash
mkdir -p ~/.claude/skills/[nombre]/{scripts,references}
# guardar SKILL.md
touch ~/.claude/skills/[nombre]/learnings.md
```

**f) Marcar observaciones como procesadas:**
```bash
engram tag --scope "skill:nueva:[nombre]" --status resolved
```

## Paso 5 — Tras evolucionar o crear

Presenta archivo con `present_files`.
Una línea: qué cambió y cuántas obs de Engram se procesaron.

## Principio de economía (Lean Content)

Una skill contiene solo lo que cambia el comportamiento de Claude en runtime.
Fuera: changelogs, créditos, racionalizaciones, histórico de versiones.
Dentro: proceso, ejemplos con contexto real, anti-patrones, output format.
El historial vive en Engram. La skill es la destilación actual.
