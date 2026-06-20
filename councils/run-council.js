const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const topic = process.argv.slice(2).join(' ') || 'Analizar estado actual y planificar siguientes pasos';

const AGENTS_DIR   = path.join(__dirname, 'agents');
const NOTES_DIR    = path.join(__dirname, 'notes');
const RESEARCH_DIR = path.join(__dirname, 'research');
const DEBATES_DIR  = path.join(__dirname, 'debates');
const LOGS_BECARIO = path.join(__dirname, 'logs_becario');
const WORKING_MD_PATH   = path.join(__dirname, '..', 'working.md');
const PRINCIPLES_PATH   = path.join(require('os').homedir(), '.claude', 'principles.md');
const LEARNINGS_PATH    = path.join(__dirname, '..', 'learnings.md');

console.log(`=== INICIANDO DEBATE DEL CONSEJO CONSULTIVO ===`);
console.log(`Tema: "${topic}"\n`);

// 1. Leer estado actual del proyecto (working.md)
let workingContext = '';
if (fs.existsSync(WORKING_MD_PATH)) {
  workingContext = fs.readFileSync(WORKING_MD_PATH, 'utf8');
} else {
  workingContext = 'No se encontró working.md en la raíz.';
}

// 1b. Leer principios globales del sistema
let principlesContext = '';
if (fs.existsSync(PRINCIPLES_PATH)) {
  principlesContext = fs.readFileSync(PRINCIPLES_PATH, 'utf8');
  console.log('Principios globales cargados desde principles.md');
} else {
  principlesContext = '(Sin principles.md global encontrado)';
}

// 1c. Leer learnings.md del proyecto si existe
let learningsContext = '';
if (fs.existsSync(LEARNINGS_PATH)) {
  learningsContext = fs.readFileSync(LEARNINGS_PATH, 'utf8');
  console.log('Aprendizajes del proyecto cargados desde learnings.md');
} else {
  learningsContext = '(Sin learnings.md local encontrado en la raíz del proyecto)';
}

// 1d. Leer últimos 5 logs del becario para auditoría del Architect y Orchestrator
let internLogsContext = '';
if (fs.existsSync(LOGS_BECARIO)) {
  const logFiles = fs.readdirSync(LOGS_BECARIO)
    .filter(f => f.startsWith('log_') && f.endsWith('.md'))
    .sort()
    .slice(-5);

  if (logFiles.length > 0) {
    internLogsContext = logFiles.map(f => {
      const content = fs.readFileSync(path.join(LOGS_BECARIO, f), 'utf8');
      return `### ${f}\n${content.substring(0, 600)}${content.length > 600 ? '\n...(truncado)' : ''}`;
    }).join('\n\n---\n\n');
    console.log(`Últimos ${logFiles.length} log(s) del becario cargados para auditoría.`);
  } else {
    internLogsContext = '(Sin logs del becario disponibles todavía)';
  }
} else {
  internLogsContext = '(Carpeta logs_becario/ aún no creada — el becario no ha corrido ninguna tarea)';
}

// 2. Leer perfiles, notas e investigaciones de agentes
const agentsList = ['architect', 'cfo', 'orchestrator', 'niche_researcher', 'comparative_researcher'];
let agentsDataPrompt = '';

for (const agent of agentsList) {
  const agentFile = path.join(AGENTS_DIR, `${agent}.md`);
  const notesFile = path.join(NOTES_DIR, `${agent}_notes.md`);
  const researchFile = path.join(RESEARCH_DIR, `${agent}_research.md`);

  const personality = fs.existsSync(agentFile) ? fs.readFileSync(agentFile, 'utf8') : `(Sin archivo de personalidad para ${agent})`;
  const notes = fs.existsSync(notesFile) ? fs.readFileSync(notesFile, 'utf8') : `(Sin notas actuales para ${agent})`;
  const research = fs.existsSync(researchFile) ? fs.readFileSync(researchFile, 'utf8') : `(Sin investigaciones recientes para ${agent})`;

  agentsDataPrompt += `
========================================
AGENTE: ${agent.toUpperCase()}
========================================
### Personalidad e Instrucciones de ${agent.toUpperCase()}:
${personality}

### Notas y Opinión del Agente sobre la Situación Actual:
${notes}

### Últimas Investigaciones y Fuentes de Internet (Scraped):
${research}
\n`;
}

// 3. Construir prompt final para el LLM
const prompt = `Actúa como un Consejo Consultivo simulando una discusión altamente técnica y de negocios sobre el siguiente tema:
"${topic}"

---
ESTADO ACTUAL DEL PROYECTO (working.md):
${workingContext}
---

PRINCIPIOS GLOBALES DEL SISTEMA (principles.md):
${principlesContext}
---

APRENDIZAJES DEL PROYECTO (learnings.md — deltas acumulados):
${learningsContext}
---

AUDITORÍA DE LOGS DEL BECARIO (Ollama — últimos 5 logs | ARCHITECT y ORCHESTRATOR: revisar alertas de seguridad [⚠️ SECURITY_WARN]):
${internLogsContext}
---

INFORMACION Y PERSONALIDADES DE LOS AGENTES DEL CONSEJO:
${agentsDataPrompt}

Estructura del Output esperado:
1. DIÁLOGO: Un debate dinámico en el que cada agente expone sus argumentos desde su perspectiva técnica, operativa o de negocio.
2. REPORTE DE VIABILIDAD Y RECOMENDACIONES: Un informe final consolidado que resuma los acuerdos del consejo y sugiera pasos concretos a seguir.
3. ACTUALIZACIÓN DE MEMORIA DEL CONSEJO:
Debes generar de forma obligatoria las actualizaciones de notas y memorias para cada uno de los agentes utilizando EXACTAMENTE el formato delimitado a continuación para que nuestro parser pueda actualizar los archivos del proyecto automáticamente.

====== CORTE DE CONTROL DE NOTAS ======
<<<START_NOTES:architect>>>
[Notas cortas actualizadas de architect sobre su opinión del proyecto actual]
<<<END_NOTES:architect>>>
<<<START_NOTES:cfo>>>
[Notas cortas actualizadas de cfo sobre su opinión del proyecto actual]
<<<END_NOTES:cfo>>>
<<<START_NOTES:orchestrator>>>
[Notas cortas actualizadas de orchestrator sobre su opinión del proyecto actual]
<<<END_NOTES:orchestrator>>>
<<<START_NOTES:niche_researcher>>>
[Notas cortas actualizadas de niche_researcher sobre su opinión del proyecto actual]
<<<END_NOTES:niche_researcher>>>
<<<START_NOTES:comparative_researcher>>>
[Notas cortas actualizadas de comparative_researcher sobre su opinión del proyecto actual]
<<<END_NOTES:comparative_researcher>>>

====== CORTE DE CONTROL DE MEMORIAS ======
<<<START_MEMORIES:architect>>>
[Lista de aprendizajes recientes y memorias técnicas con fecha. Mantén o agrega la lista acumulativa de aprendizajes del agente]
<<<END_MEMORIES:architect>>>
<<<START_MEMORIES:cfo>>>
[Lista de aprendizajes recientes y memorias técnicas con fecha. Mantén o agrega la lista acumulativa de aprendizajes del agente]
<<<END_MEMORIES:cfo>>>
<<<START_MEMORIES:orchestrator>>>
[Lista de aprendizajes recientes y memorias técnicas con fecha. Mantén o agrega la lista acumulativa de aprendizajes del agente]
<<<END_MEMORIES:orchestrator>>>
<<<START_MEMORIES:niche_researcher>>>
[Lista de aprendizajes recientes y memorias técnicas con fecha. Mantén o agrega la lista acumulativa de aprendizajes del agente]
<<<END_MEMORIES:niche_researcher>>>
<<<START_MEMORIES:comparative_researcher>>>
[Lista de aprendizajes recientes y memorias técnicas con fecha. Mantén o agrega la lista acumulativa de aprendizajes del agente]
<<<END_MEMORIES:comparative_researcher>>>

Responde de forma concisa, directa y sin introducciones amigables, enfocándote 100% en el análisis.`;

// 4. Determinar ejecutable del agente
let cmd = 'claude';
try {
  execSync('where.exe claude', { stdio: 'ignore' });
} catch (e) {
  cmd = 'opencode';
}

console.log(`Lanzando consulta a través de ${cmd}...`);

const dateStr = new Date().toISOString().replace(/T/, '_').replace(/:/g, '').substring(0, 15);
const logName = `debate_${dateStr}.md`;
const logPath = path.join(DEBATES_DIR, logName);
const pendingPromptPath = path.join(DEBATES_DIR, 'prompt_pendiente.md');

// Asegurar que la carpeta debates existe
if (!fs.existsSync(DEBATES_DIR)) {
  fs.mkdirSync(DEBATES_DIR, { recursive: true });
}

try {
  let result;
  if (cmd === 'claude') {
    result = execSync('claude --print', { input: prompt, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], maxBuffer: 10 * 1024 * 1024, timeout: 15000 });
  } else {
    result = execSync('opencode run --format default', { input: prompt, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], maxBuffer: 10 * 1024 * 1024, timeout: 15000 });
  }
  
  // Guardar debate
  fs.writeFileSync(logPath, result, 'utf8');
  console.log(`\nDebate finalizado con éxito. Transcripción guardada en: ${logPath}`);
  
  // Procesar actualizaciones de archivos
  console.log('\nProcesando actualizaciones de notas y memorias de agentes...');
  for (const agent of agentsList) {
    // Parser Notas
    const notesRegex = new RegExp(`<<<START_NOTES:${agent}>>>([\\s\\S]*?)<<<END_NOTES:${agent}>>>`);
    const notesMatch = result.match(notesRegex);
    if (notesMatch && notesMatch[1].trim()) {
      const notesPath = path.join(NOTES_DIR, `${agent}_notes.md`);
      const notesContent = `# Opiniones y Notas sobre la Situación Actual — ${agent.toUpperCase()}\n\n${notesMatch[1].trim()}\n`;
      fs.writeFileSync(notesPath, notesContent, 'utf8');
      console.log(`  -> Notas actualizadas para ${agent}`);
    }

    // Parser Memorias
    const memoriesRegex = new RegExp(`<<<START_MEMORIES:${agent}>>>([\\s\\S]*?)<<<END_MEMORIES:${agent}>>>`);
    const memoriesMatch = result.match(memoriesRegex);
    if (memoriesMatch && memoriesMatch[1].trim()) {
      const agentPath = path.join(AGENTS_DIR, `${agent}.md`);
      if (fs.existsSync(agentPath)) {
        let agentContent = fs.readFileSync(agentPath, 'utf8');
        const marker = '## Notas y Aprendizajes Recientes';
        const markerIdx = agentContent.indexOf(marker);
        if (markerIdx !== -1) {
          let baseContent = agentContent.substring(0, markerIdx + marker.length);
          baseContent += '\n' + memoriesMatch[1].trim() + '\n';
          fs.writeFileSync(agentPath, baseContent, 'utf8');
        } else {
          agentContent += `\n\n${marker}\n${memoriesMatch[1].trim()}\n`;
          fs.writeFileSync(agentPath, agentContent, 'utf8');
        }
        console.log(`  -> Memorias actualizadas para ${agent}`);
      }
    }
  }
  
  console.log('\n--- CONTENIDO DEL DEBATE ---');
  console.log(result.substring(0, 1000) + '\n... (truncado para la consola) ...');
  
} catch (err) {
  // Guardar el prompt formateado como fallback de excelente UX
  fs.writeFileSync(pendingPromptPath, prompt, 'utf8');
  console.log('\n[!] No se pudo ejecutar el debate de forma automática (probable falta de TTY o CLI local).');
  console.log(`He guardado el prompt estructurado en: ${pendingPromptPath}`);
  console.log('Puedes copiar su contenido y pegarlo directamente en este chat para iniciar el debate.');
}
