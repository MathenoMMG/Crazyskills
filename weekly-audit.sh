#!/bin/bash
REPORT_PATH="$HOME/Desktop/Reporte_Skills_Semanal.md"

echo "=== INICIANDO AUDITORÍA SEMANAL DE SKILLS ==="
OBSERVACIONES=$(engram search --scope "skill:*" --type observation --since "7 days ago" --format summary 2>/dev/null)

# Verificar si hay observaciones reales (evitar falso positivo con "No memories found")
if [ -z "$OBSERVACIONES" ] || echo "$OBSERVACIONES" | grep -qi "No memories"; then
    echo "No hay observaciones pendientes para esta semana. Saliendo..."
    exit 0
fi

if command -v claude &>/dev/null; then
  cat << EOF | claude --print 2>/dev/null > "$REPORT_PATH"
Analiza las siguientes observaciones de la última semana y compáralas con el directorio ~/.claude/skills/.
Genera un reporte conciso en Markdown para mi escritorio.

Reglas:
1. Si una skill tiene observaciones repetidas de que falla o no se usa, márcala como [MUERTA] y sugiere su eliminación.
2. Si tiene mejoras, desglosa los cambios a añadir en su respectivo 'learnings.md'.
3. Sé directo, antislop, y ultra-conciso.

Observaciones de la semana:
$OBSERVACIONES
EOF
else
  # Fallback to opencode run
  PROMPT=$(cat << EOF
Analiza las siguientes observaciones de la última semana y compáralas con el directorio ~/.claude/skills/.
Genera un reporte conciso en Markdown para mi escritorio.

Reglas:
1. Si una skill tiene observaciones repetidas de que falla o no se usa, márcala como [MUERTA] y sugiere su eliminación.
2. Si tiene mejoras, desglosa los cambios a añadir en su respectivo 'learnings.md'.
3. Sé directo, antislop, y ultra-conciso.

Observaciones de la semana:
$OBSERVACIONES
EOF
)
  opencode run "$PROMPT" --format default 2>/dev/null > "$REPORT_PATH"
fi