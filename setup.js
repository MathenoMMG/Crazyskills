const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const USER_HOME = os.homedir();
const CLAUDE_DIR = path.join(USER_HOME, '.claude');
const CLAUDE_JSON_PATH = path.join(USER_HOME, '.claude.json');
const CURRENT_DIR = __dirname;

console.log('--- INICIANDO CONFIGURACIÓN PORTABLE DEL SISTEMA OBSIDIAN ---');
console.log(`Directorio del usuario detectado: ${USER_HOME}`);

// 1. Crear directorios base
const dirs = [
  CLAUDE_DIR,
  path.join(CLAUDE_DIR, 'hooks'),
  path.join(CLAUDE_DIR, 'commands'),
  path.join(CLAUDE_DIR, 'agents'),
  path.join(CLAUDE_DIR, 'skills'),
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const localClaudeDir = path.join(CURRENT_DIR, '.claude');
const localDirs = [
  localClaudeDir,
  path.join(localClaudeDir, 'commands'),
  path.join(localClaudeDir, 'agents'),
  path.join(localClaudeDir, 'skills'),
];

for (const dir of localDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 2. Copiar y adaptar scripts (reemplazando rutas del usuario original)
const scripts = ['obsidian-capture.sh', 'obsidian-flush.sh', 'weekly-audit.sh', 'weekly-review.sh'];

for (const s of scripts) {
  const srcPath = path.join(CURRENT_DIR, s);
  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf8');
    content = content.replace(/C:\\\\Users\\\\matyo/g, USER_HOME.replace(/\\/g, '\\\\'));
    content = content.replace(/C:\/Users\/matyo/g, USER_HOME.replace(/\\/g, '/'));
    fs.writeFileSync(path.join(CLAUDE_DIR, 'hooks', s), content, 'utf8');
  }
}

// Crear block-dangerous.sh
const blockDangerousContent = `#!/bin/bash
input=$(cat)
command=$(echo "$input" | node -e "const fs = require('fs'); const data = JSON.parse(fs.readFileSync(0, 'utf-8')); console.log(data.tool_input?.command || '');" 2>/dev/null)
if echo "$command" | grep -qE 'rm -rf|sudo|git push.*-f|git push.*--force'; then
  echo "Comando bloqueado por seguridad: $command" >&2
  exit 2
fi`;
fs.writeFileSync(path.join(CLAUDE_DIR, 'hooks', 'block-dangerous.sh'), blockDangerousContent, 'utf8');

// Crear auto-forge.js portable
const autoForgeContent = `const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const USERPROFILE = process.env.USERPROFILE || require('os').homedir();
const CLAUDE_DIR = path.join(USERPROFILE, '.claude');
const TEMP_EXPORT = path.join(CLAUDE_DIR, 'hooks', 'temp_export.json');

try {
  console.log('Running automatic forge...');
  execSync(\`engram export "\${TEMP_EXPORT}"\`, { stdio: 'ignore' });
  if (!fs.existsSync(TEMP_EXPORT)) return;
  
  const data = JSON.parse(fs.readFileSync(TEMP_EXPORT, 'utf8'));
  try { fs.unlinkSync(TEMP_EXPORT); } catch (e) {}
  
  if (!data.observations || data.observations.length === 0) return;
  
  const sessionDirs = {};
  if (data.sessions) {
    for (const sess of data.sessions) {
      if (sess.id && sess.directory) {
        sessionDirs[sess.id] = sess.directory;
      }
    }
  }
  
  const skillObs = data.observations.filter(obs => obs.scope && obs.scope.startsWith('skill:'));
  
  for (const obs of skillObs) {
    const skillName = obs.scope.substring('skill:'.length).trim();
    if (!skillName) continue;
    
    const globalLearningsPath = path.join(CLAUDE_DIR, 'skills', skillName, 'learnings.md');
    const projectDir = sessionDirs[obs.session_id];
    let localLearningsPath = null;
    if (projectDir && fs.existsSync(projectDir)) {
      localLearningsPath = path.join(projectDir, 'learnings.md');
    }
    
    let content = obs.content;
    let refLink = '';
    const refRegex = /Ref:\\s*\\[([^#\\]]+)(?:#L?(\\d+)(?:-L?(\\d+))?)?\\]/i;
    const match = content.match(refRegex);
    if (match) {
      const relPath = match[1].trim();
      const startLine = match[2];
      const endLine = match[3] || startLine;
      const fileBasename = path.basename(relPath);
      
      if (projectDir) {
        const absoluteFilePath = path.join(projectDir, relPath).replace(/\\\\/g, '/');
        const lineAnchor = startLine ? \`#L\${startLine}\${endLine ? \`-L\${endLine}\` : ''}\` : '';
        const lineLabel = startLine ? \`:L\${startLine}\${endLine && endLine !== startLine ? \`-\${endLine}\` : ''}\` : '';
        refLink = \` (Ref: [\${fileBasename}\${lineLabel}](file:///\${absoluteFilePath}\${lineAnchor}))\`;
      } else {
        refLink = \` (Ref: \\\`\${relPath}\${startLine ? \`:\${startLine}\` : ''}\\\`)\`;
      }
      content = content.replace(refRegex, '').trim();
    }
    
    const dateStr = obs.created_at.substring(0, 10);
    const formattedContent = content.replace(/\\r?\\n/g, ' ');
    const entry = \`- [\${dateStr}] \${obs.title} -> \${formattedContent}\${refLink}\\n\`;
    
    // Escribir a global
    const globalSkillDir = path.join(CLAUDE_DIR, 'skills', skillName);
    if (!fs.existsSync(globalSkillDir)) fs.mkdirSync(globalSkillDir, { recursive: true });
    fs.appendFileSync(globalLearningsPath, entry, 'utf8');
    
    // Escribir a local
    if (localLearningsPath) {
      fs.appendFileSync(localLearningsPath, entry, 'utf8');
    }
    
    try {
      execSync(\`engram delete \${obs.id}\`, { stdio: 'ignore' });
    } catch (err) {}
  }
} catch (err) {}`;
fs.writeFileSync(path.join(CLAUDE_DIR, 'hooks', 'auto-forge.js'), autoForgeContent, 'utf8');

// 3. Crear slash commands
const commands = ['obs.md', 'forge.md', 'mem.md'];
for (const c of commands) {
  const srcPath = path.join(CURRENT_DIR, c);
  if (fs.existsSync(srcPath)) {
    const content = fs.readFileSync(srcPath, 'utf8');
    fs.writeFileSync(path.join(CLAUDE_DIR, 'commands', c), content, 'utf8');
    fs.writeFileSync(path.join(CLAUDE_DIR, 'agents', c), content, 'utf8');
    fs.writeFileSync(path.join(localClaudeDir, 'commands', c), content, 'utf8');
    fs.writeFileSync(path.join(localClaudeDir, 'agents', c), content, 'utf8');
  }
}

// 4. Copiar Skills y crear deltas
const skillsSourceDir = path.join(CURRENT_DIR, 'skills');
if (fs.existsSync(skillsSourceDir)) {
  const skills = fs.readdirSync(skillsSourceDir);
  for (const s of skills) {
    const destSkillDir = path.join(CLAUDE_DIR, 'skills', s);
    if (!fs.existsSync(destSkillDir)) fs.mkdirSync(destSkillDir, { recursive: true });
    
    const skillMdSrc = path.join(skillsSourceDir, s, 'SKILL.md');
    if (fs.existsSync(skillMdSrc)) {
      fs.copyFileSync(skillMdSrc, path.join(destSkillDir, 'SKILL.md'));
    }
    fs.writeFileSync(path.join(destSkillDir, 'learnings.md'), '', 'utf8');
  }
}

// 5. Crear principles.md global
const principlesContent = `# Principios Globales Transversales — Ecosistema Obsidian

## 1. Lean Content (Contenido Esbelto)
Cada regla o skill debe contener exclusivamente instrucciones deterministas que afecten el comportamiento del agente en runtime. Changelogs, créditos y notas de versión van fuera de la memoria activa para ahorrar tokens de contexto.

## 2. Pre-Flight Principle (Relectura de Seguridad)
Toda tarea compleja de entrega debe realizar una relectura interna obligatoria de las instrucciones del proyecto antes de dar por finalizado el comando para asegurar cero alucinaciones de parámetros y firmas.

## 3. Anti-Embedding (Aislamiento de Carga)
Prohibido hacer que una skill cargue dinámicamente a otra. Deben invocarse de forma explícita e independiente desde CLAUDE.md o mediante los comandos asignados.

## 4. Markdown GraphRAG (Grafo Semántico de Código)
Para evitar lecturas masivas y búsquedas probabilísticas, la memoria del proyecto se estructura como un Grafo de Conocimiento conectado mediante enlaces físicos y nodos de entidad:
- **Mapas de Contenido (MOC):** El archivo \`working.md\` actúa como el nodo raíz del grafo. Debe conectar componentes complejos (ej. \`[[Mailer]]\`, \`[[Payments]]\`) con sus respectivos archivos y líneas físicas.
- **Formato de Enlace:** Toda referencia a un módulo del sistema debe declararse con su ruta física absoluta e hipervínculo clicable, por ejemplo: \`[NombreModulo](file:///ruta/al/archivo.ts#LStart-LEnd)\`.
- **Navegación Multi-Hop:** Antes de modificar un componente secundario, el agente debe seguir las conexiones del grafo indicadas en el \`working.md\` o en los \`learnings.md\` para entender las dependencias del archivo destino (ej. qué dependencias tiene \`Mailer\` con \`Users\`).
- **Cero Suposiciones (Zero Guessing):** Prohibido asumir importaciones o APIs. Si no se conoce la firma de un método enlazado, se debe saltar inmediatamente al enlace físico de la firma en la sesión activa.

## 5. Navegación en Grandes Proyectos (Circumstantial Expansion)
- **Lectura Circunstancial:** La lectura quirúrgica por rango de líneas es el enfoque por defecto. Sin embargo, si la complejidad de la lógica o el acoplamiento del código lo requiere, se debe ampliar la ventana de lectura de forma progresiva.
- **Protocolo de Búsqueda:** Para explorar el código de manera efectiva:
  1. Utiliza \`grep_search\` para ubicar las declaraciones y todos los usos (referencias cruzadas) de una clase, función o constante.
  2. Lee el archivo alrededor de la coincidencia (típicamente desde 20 líneas antes hasta 50 líneas después) para captar el contexto funcional.
  3. Revisa los tests unitarios del componente; las pruebas son la documentación más veraz y el mejor ejemplo de uso de la API interna.
- **Ventana de Contexto (Presupuesto de 150K):** Para proyectos grandes, el límite máximo de tolerancia de tokens acumulados en la sesión antes de sugerir un reinicio o \`/compact\` se establece en **150,000 tokens**. Mantén la sesión por debajo de este presupuesto para evitar latencia extrema y degradación de la atención del LLM.

## 6. Revelación Progresiva (Progressive Disclosure)
Para evitar el bloat de contexto y optimizar el presupuesto de tokens, las skills especializadas no se cargan todas de golpe. El agente debe seleccionar y cargar dinámicamente solo las skills necesarias para resolver la tarea en curso (ej. cargar \`security-hardening\` solo al modificar autenticación, red o filesystem).

## 7. Quality Gates y Plan-Before-Code
Cualquier modificación no trivial de código requiere la validación de un plan de diseño por parte del usuario. Antes de dar por completado un cambio, el código debe validarse mediante sintaxis de compilación (\`node -c\`) y pruebas de unidad (TDD) en el sandbox local.

## 8. Threat Modeling y Hardening Colectivo
Antes de realizar cambios sensibles que manipulen variables de entorno, APIs externas o acceso no supervisado a disco, se debe invocar proactivamente el protocolo de la skill \`obsidian-challenge\` para auditar vectores de ataque e inyecciones indirectas.`;
fs.writeFileSync(path.join(CLAUDE_DIR, 'principles.md'), principlesContent, 'utf8');

// 6. Crear Junction Link para Antigravity si es Windows
if (os.platform() === 'win32') {
  const geminiSkillsPath = path.join(USER_HOME, '.gemini', 'config', 'skills');
  const geminiConfigDir = path.join(USER_HOME, '.gemini', 'config');
  if (!fs.existsSync(geminiConfigDir)) {
    fs.mkdirSync(geminiConfigDir, { recursive: true });
  }
  if (!fs.existsSync(geminiSkillsPath)) {
    try {
      execSync(`New-Item -ItemType Junction -Path "${geminiSkillsPath}" -Target "${path.join(CLAUDE_DIR, 'skills')}"`, { shell: 'powershell.exe' });
      console.log('Junction Link de skills creado con éxito.');
    } catch (e) {
      console.log('Nota: No se pudo crear el Junction automáticamente.');
    }
  }
}

// 7. Configurar settings.json y fusionar en .claude.json
let engramPath = 'engram';
if (os.platform() === 'win32') {
  const possibleEngramPath = path.join(USER_HOME, '.gemini', 'antigravity', 'bin', 'engram.exe');
  if (fs.existsSync(possibleEngramPath)) {
    engramPath = possibleEngramPath;
  }
}

const settingsObj = {
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"]
    },
    "memory": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "~/.claude-memory/global.json"
      }
    },
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "engram": {
      "type": "stdio",
      "command": engramPath,
      "args": ["mcp", "--tools=agent"]
    }
  },
  "hooks": {
    "UserPromptSubmit": [{
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/obsidian-capture.sh",
        "async": true
      }]
    }],
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/obsidian-flush.sh",
        "async": true
      }]
    }],
    "PostToolUse": [{
      "matcher": "Write|Edit|MultiEdit",
      "hooks": [
        { "type": "command", "command": "npx prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || true" }
      ]
    }],
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/block-dangerous.sh"
      }]
    }]
  }
};

fs.writeFileSync(path.join(CLAUDE_DIR, 'settings.json'), JSON.stringify(settingsObj, null, 2), 'utf8');

if (fs.existsSync(CLAUDE_JSON_PATH)) {
  const currentSettings = JSON.parse(fs.readFileSync(CLAUDE_JSON_PATH, 'utf8'));
  if (!currentSettings.hooks) currentSettings.hooks = {};
  for (const key of Object.keys(settingsObj.hooks)) {
    currentSettings.hooks[key] = settingsObj.hooks[key];
  }
  if (!currentSettings.mcpServers) currentSettings.mcpServers = {};
  for (const key of Object.keys(settingsObj.mcpServers)) {
    currentSettings.mcpServers[key] = settingsObj.mcpServers[key];
  }
  fs.writeFileSync(CLAUDE_JSON_PATH, JSON.stringify(currentSettings, null, 2), 'utf8');
} else {
  fs.writeFileSync(CLAUDE_JSON_PATH, JSON.stringify(settingsObj, null, 2), 'utf8');
}

// 8. Configurar Tareas Programadas en Windows si aplica (Solo Auditoría de Memoria Semanal)
if (os.platform() === 'win32') {
  console.log('Configurando Tareas Programadas en Windows...');
  
  let bashPath = 'bash.exe';
  const possibleBashPaths = [
    'C:\\Program Files\\Git\\bin\\bash.exe',
    'C:\\Program Files\\Git\\git-bash.exe',
    'C:\\Git\\bin\\bash.exe',
  ];
  for (const p of possibleBashPaths) {
    if (fs.existsSync(p)) {
      bashPath = p;
      break;
    }
  }
  
  const auditScript = path.join(CLAUDE_DIR, 'hooks', 'weekly-audit.sh');
  try {
    const cmdWeekly = `schtasks /create /tn "ObsidianWeeklyAudit" /tr "\\\"${bashPath}\\\" \\\"${auditScript}\\\"" /sc weekly /d FRI /st 18:00 /f`;
    execSync(cmdWeekly, { stdio: 'ignore' });
    execSync(`powershell -Command "Set-ScheduledTask -TaskName 'ObsidianWeeklyAudit' -Settings (New-ScheduledTaskSettingsSet -StartWhenAvailable)"`, { stdio: 'ignore' });
    console.log('  -> Tarea programada "ObsidianWeeklyAudit" registrada/actualizada con éxito (con ejecución inmediata si se pierde el horario).');
  } catch (err) {
    console.log('  -> Nota: No se pudo registrar la tarea ObsidianWeeklyAudit automáticamente.');
  }
}

console.log('--- INSTALACIÓN Y CONFIGURACIÓN COMPLETADA CON ÉXITO ---');
