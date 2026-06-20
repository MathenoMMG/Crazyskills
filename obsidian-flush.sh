#!/bin/bash
# Hook Stop async — consolida si hay 5+ observaciones del día
OBS_COUNT=$(engram search --scope "skill:*" --type observation --since "24h" --format count 2>/dev/null || echo 0)
if [ "$OBS_COUNT" -ge 5 ]; then
  engram consolidate --scope "skill:*" --since "24h" 2>/dev/null &
fi
exit 0
