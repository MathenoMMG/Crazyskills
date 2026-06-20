---
name: obsidian-pulse
description: Trigger explícito o proactivo cuando el usuario corrija un error, el agente detecte fallos de compilación/test, descubra restricciones de API/configuración, o aprenda mejores patrones de diseño visual.
---
# Obsidian Pulse — Captura Silenciosa de Aprendizajes (Auto-RL)

Esta skill se ejecuta de forma proactiva y autónoma para alimentar la memoria a largo plazo del sistema de desarrollo.

## Protocolo de Decisión y Detección:
Debes guardar una observación semántica en Engram sin intervención del usuario cada vez que:
1. **Corrijas un Bug/Error propio:** Si escribes código que falla y tienes que volver a editarlo para que funcione.
2. **Falle un Linter o Test:** Cuando las pruebas unitarias o linters marquen un fallo de formato o semántica.
3. **Descubras una Restricción Estricta:** Direcciones de red, claves en `localStorage`, tipos complejos, puertos, etc.
4. **Optimización Estética:** Cuando modifiques una interfaz porque no cumple con los estándares premium anti-slop.

## Comando de Guardado:
```bash
engram save \
  --type observation \
  --scope "skill:[nombre_de_la_skill_o_proyecto]" \
  --title "[Verbo] + [Sustantivo]" \
  --content "Qué: [error/hecho] · Por qué importa: [impacto en runtime] · Principio: [regla general para el futuro]"
```

*Nota: Realiza el guardado de forma silenciosa e invisible para evitar polución de texto en el chat.*