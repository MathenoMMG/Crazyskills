const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const topic = process.argv.slice(2).join(' ');
if (!topic) {
  console.log('Uso: node councils/run-council.js "[Tema del debate]"');
  process.exit(1);
}

const AGENTS_DIR = path.join(__dirname, 'agents');

console.log(`=== INICIANDO DEBATE DEL CONSEJO CONSULTIVO ===`);
console.log(`Tema: "${topic}"\n`);

// Leer perfiles de agentes
let agentPrompts = '';
try {
  const files = fs.readdirSync(AGENTS_DIR);
  for (const f of files) {
    if (f.endsWith('.md')) {
      const content = fs.readFileSync(path.join(AGENTS_DIR, f), 'utf8');
      agentPrompts += `\n---\n${content}\n`;
    }
  }
} catch (e) {
  console.error('Error al cargar agentes:', e.message);
  process.exit(1);
}

// Construir prompt final
const prompt = `Actúa como un Consejo Consultivo simulando una discusión altamente técnica y de negocios sobre el siguiente tema:
"${topic}"

Deberás simular un diálogo estructurado en el que participen los siguientes 5 agentes con sus respectivas personalidades e instrucciones definidas a continuación:
${agentPrompts}

Estructura del Output esperado:
1. DIÁLOGO: Un debate dinámico en el que cada agente expone sus argumentos desde su perspectiva técnica, operativa o de negocio.
2. REPORTE DE VIABILIDAD Y RECOMENDACIONES: Un informe final consolidado que resuma los acuerdos del consejo y sugiera pasos concretos a seguir.

Responde de forma concisa, directa y sin introducciones amigables, enfocándote 100% en el análisis.`;

// Determinar ejecutable del agente
let cmd = 'claude';
try {
  execSync('where.exe claude', { stdio: 'ignore' });
} catch (e) {
  cmd = 'opencode';
}

console.log(`Lanzando consulta a través de ${cmd}...`);

const dateStr = new Date().toISOString().replace(/T/, '_').replace(/:/g, '').substring(0, 15);
const logName = `debate_${dateStr}.md`;
const logPath = path.join(__dirname, 'debates', logName);

try {
  let result;
  if (cmd === 'claude') {
    result = execSync(`claude --print "${prompt.replace(/"/g, '\\"')}"`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  } else {
    // Escape and pass argument to opencode run
    result = execSync(`opencode run "${prompt.replace(/"/g, '\\"')}" --format default`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  }
  
  // Guardar debate
  fs.writeFileSync(logPath, result, 'utf8');
  console.log(`\nDebate finalizado con éxito. Transcripción guardada en: ${logPath}`);
  console.log('--- CONTENIDO DEL DEBATE ---');
  console.log(result);
  
} catch (err) {
  console.error('Error al ejecutar el debate a través del agente:', err.message);
}
