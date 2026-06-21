---
description: |
  Comando maestro de memoria. Captura todo lo relevante de la sesión actual,
  consolida learnings en las skills correspondientes, propone nuevas skills si
  hay patrones emergentes, y actualiza working.md. NO activa el Council ni gasta
  tokens premium extras. Uso: /mem [nota opcional]
---

Ejecuta el ciclo completo de memoria Obsidian para la sesión actual. Sigue estos pasos en orden:

## PASO 1 — Revisar el contexto de la sesión
Analiza silenciosamente el historial de esta conversación e identifica:
- Errores que cometiste y corregiste
- Restricciones de proyecto descubiertas (puertos, rutas, claves, configuraciones)
- Patrones de diseño o código que funcionaron especialmente bien
- Preferencias explícitas o implícitas del usuario
- Cualquier cosa que si olvidaras en la próxima sesión causaría un error repetido

## PASO 2 — Guardar observaciones en Engram
Por cada aprendizaje identificado, ejecuta silenciosamente:
```
engram save --type observation --scope skill:[skill-mas-relevante] --title "[Verbo]+[Sustantivo]" --content "Qué: [descripción] · Por qué importa: [impacto] · Principio: [regla generalizable]"
```
Si el usuario pasó $ARGUMENTS (texto adicional), inclúyelo como observación prioritaria con la skill inferida del contexto.

Skills disponibles para scope: security-hardening, test-driven-development, accessibility-a11y, api-conventions, zero-downtime-databases, performance-optimization, edge-runtime-serverless, ci-cd-pipelines, monorepo-pnpm-turborepo, git-workflow, agentic-tool-use, vector-search-rag, obsidian-forge, obsidian-pulse, frontend-design, taste-skill, hallmark, awesome-claude-design, micro-frontends, graphql-codegen-safety, ui-ux-pro-max

## PASO 3 — Consolidar a learnings.md (auto-forge)
Ejecuta el procesamiento de observaciones pendientes de Engram hacia los archivos learnings.md de sus skills. Para cada scope con observaciones:
1. Lee las observaciones de ese scope: `engram search --scope skill:[nombre] --type observation`
2. Añade cada una como entrada `- [fecha] Título -> contenido` al archivo `~/.claude/skills/[nombre]/learnings.md`
3. Elimina la observación procesada de Engram: `engram delete [id]`

## PASO 4 — Detectar oportunidades de nueva skill
Si durante el análisis detectas un patrón de conocimiento que NO tiene skill existente y tiene 3+ instancias de aprendizaje en la sesión, propone crear una nueva skill con:
```
/forge nueva:[nombre-propuesto]
```
Solo propón, no crees automáticamente — espera confirmación del usuario.

## PASO 5 — Actualizar working.md
Si estás dentro de un proyecto con working.md, actualiza la sección "Qué está fallando" y "Qué hace falta" con lo que aprendiste en la sesión. Mantén el documento conciso.

## PASO 6 — Confirmar resumen (una sola respuesta compacta)
Responde con un resumen de una sola vez en este formato exacto:

```
✅ /mem ejecutado — [fecha/hora]
📝 Observaciones guardadas: N (skills: [lista])
🔁 Learnings.md actualizados: [lista de skills]
💡 Nueva skill sugerida: [nombre o "ninguna"]
📋 working.md: [actualizado / sin cambios]
```

## REGLA CRÍTICA — Council y tokens
- Este comando NO llama a `run-council.js` ni activa ningún debate del Council.
- El Council se activa ÚNICAMENTE cuando el usuario dice explícitamente "inicia el council".
- /mem es operación local de memoria, 0 tokens extra de API más allá de esta respuesta.
