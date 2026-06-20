#!/bin/bash
# Hook UserPromptSubmit — detecta correcciones y señaliza para captura
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('user_prompt',''))" 2>/dev/null)

if echo "$PROMPT" | grep -iqE "no[, ]?(así|hagas|uses)|mejor (sería|hacerlo)|cambia (eso|esto)|recuerda (que|esto)|anota|^obs:|guarda esto|siempre (uso|hago|prefiero)|nunca (uses|hagas|vuelvas)"; then
  echo '{"additionalContext": "SEÑAL DE CORRECCIÓN: el usuario está corrigiendo o expresando preferencia persistente. Captura en Engram con obsidian-pulse antes de responder."}'
fi
exit 0
