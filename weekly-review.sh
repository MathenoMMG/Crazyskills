#!/bin/bash
# Cron: 0 9 * * 1,4 ~/.claude/hooks/weekly-review.sh
echo "=== Obsidian Weekly Review $(date +%Y-%m-%d) ==="
echo "--- Observaciones abiertas ---"
engram search --scope "skill:*" --type observation --status open --format summary

SCOPES=$(engram search --scope "skill:*" --type observation --status open --format scopes-above-threshold --threshold 3 2>/dev/null)
if [ -z "$SCOPES" ]; then
  echo "Sin scopes con 3+ obs. Review completado."; exit 0
fi

echo "--- Forging: $SCOPES ---"
echo "$SCOPES" | while read scope; do
  claude --print "Usa obsidian-forge para el scope $scope. Sin preguntas, hazlo." 2>/dev/null
done
echo "=== Review completado ==="
