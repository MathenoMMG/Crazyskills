---
name: obsidian-forge
description: Trigger explícito cuando el usuario ejecute /forge, /forge --all, o "crea skill", "mejora skill X". Sigue las directrices oficiales del Anthropic skill-creator loop.
---
# Obsidian Forge — Meta-Evolución

## Flujo de Trabajo (Inspirado en Anthropic Skill-Creator):
1. Extrae las observaciones de Engram (`engram search`).
2. Sigue el bucle continuo: Analiza feedback → Consolida deltas → Protege contra el "undertriggering" forzando descripciones directas basadas en frases de activación explícitas del usuario.
3. No alteres el `SKILL.md` original; vuelca los hallazgos en formato delta incremental en su respectivo archivo hermano `learnings.md`.