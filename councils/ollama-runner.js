const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');

const OLLAMA_HOST = '127.0.0.1';
const OLLAMA_PORT = 11434;
const DEFAULT_MODEL = 'qwen2.5-coder:7b';
const SCRATCH_DIR = path.join(__dirname, 'scratch');

// 1. Sanitizador de privacidad para mitigar MosaicLeaks
function sanitizeText(text) {
  if (!text) return '';
  const homeDir = require('os').homedir();
  const escapedHome = homeDir.replace(/\\/g, '/');
  const doubleEscapedHome = homeDir.replace(/\\/g, '\\\\');

  let sanitized = text;
  // Reemplazar rutas absolutas de usuario
  sanitized = sanitized.replace(new RegExp(escapedHome, 'gi'), '[USER_HOME]');
  sanitized = sanitized.replace(new RegExp(doubleEscapedHome, 'gi'), '[USER_HOME]');
  sanitized = sanitized.replace(/C:\/Users\/[a-zA-Z0-9_-]+/gi, '[USER_HOME]');
  sanitized = sanitized.replace(/C:\\\\Users\\\\[a-zA-Z0-9_-]+/gi, '[USER_HOME]');
  
  // Reemplazar variables de entorno típicas que contengan tokens
  const envToStrip = ['GITHUB_TOKEN', 'CLAUDE_API_KEY', 'OPENAI_API_KEY', 'GEMINI_API_KEY'];
  for (const env of envToStrip) {
    if (process.env[env]) {
      sanitized = sanitized.replace(new RegExp(process.env[env], 'g'), `[STRIPPED_${env}]`);
    }
  }
  return sanitized;
}

// 2. Cliente HTTP nativo para conectar con Ollama sin dependencias externas
function queryOllama(prompt, model = DEFAULT_MODEL) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: model,
      prompt: sanitizeText(prompt),
      stream: false
    });

    const options = {
      hostname: OLLAMA_HOST,
      port: OLLAMA_PORT,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            return reject(new Error(`Ollama retornó código ${res.statusCode}: ${body}`));
          }
          const parsed = JSON.parse(body);
          resolve(parsed.response);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

// 3. Validador de Calidad en Sandbox (Linter y Compilación)
function validateCodeInSandbox(filePath) {
  console.log(`\n--- INICIANDO VALIDACIÓN EN SANDBOX (TDD) ---`);
  
  // A. Validación de sintaxis nativa de Node.js
  try {
    console.log('Verificando sintaxis del código generado...');
    execSync(`node -c "${filePath}"`, { stdio: 'ignore' });
    console.log('  -> [OK] Sintaxis de Node.js válida.');
  } catch (err) {
    throw new Error('El código generado contiene errores de sintaxis de JavaScript.');
  }

  // B. Validación de linter / formateador (Prettier si está disponible)
  try {
    console.log('Aplicando Prettier...');
    execSync(`npx prettier --write "${filePath}"`, { stdio: 'ignore' });
    console.log('  -> [OK] Formateo con Prettier completado.');
  } catch (err) {
    console.log('  -> [ADVERTENCIA] Prettier no está disponible o falló (se omite linter).');
  }

  // C. Ejecución de suite de tests unitarios (TDD) si aplica
  // Si existe un archivo de test de prueba para la función, lo corremos
  const testPath = filePath.replace('.js', '.test.js');
  if (fs.existsSync(testPath)) {
    try {
      console.log('Ejecutando pruebas de unidad (TDD)...');
      // Intentamos correr jest o vitest o simplemente node
      execSync(`npx jest "${testPath}"`, { stdio: 'inherit' });
      console.log('  -> [OK] Pruebas unitarias exitosas.');
    } catch (err) {
      throw new Error('El código generado no pasó la suite de pruebas unitarias (TDD).');
    }
  } else {
    console.log('No se encontraron pruebas unitarias asociadas (se omite validación TDD completa).');
  }

  console.log(`--- SANDBOX COMPLETADO CON ÉXITO ---\n`);
  return true;
}

// 4. Comandos CLI del Runner
async function run() {
  const args = process.argv.slice(2);
  
  // Buscar e inyectar skill si se especifica
  const skillIdx = args.indexOf('--skill');
  let skillPromptContent = '';
  if (skillIdx !== -1 && args[skillIdx + 1]) {
    const skillName = args[skillIdx + 1];
    args.splice(skillIdx, 2); // Remover --skill y su valor de la lista de argumentos
    
    const globalSkillsDir = path.join(require('os').homedir(), '.claude', 'skills', skillName);
    const skillMd = path.join(globalSkillsDir, 'SKILL.md');
    const learningsMd = path.join(globalSkillsDir, 'learnings.md');
    
    if (fs.existsSync(skillMd)) {
      skillPromptContent += `\n\n--- INSTRUCCIONES DE LA SKILL (${skillName.toUpperCase()}): ---\n`;
      skillPromptContent += fs.readFileSync(skillMd, 'utf8');
      if (fs.existsSync(learningsMd)) {
        const delta = fs.readFileSync(learningsMd, 'utf8').trim();
        if (delta) {
          skillPromptContent += `\n\n--- APRENDIZAJES RECIENTES (DELTAS): ---\n${delta}`;
        }
      }
      skillPromptContent += `\n--- FIN DE LA SKILL ---\n\n`;
      console.log(`Inyectando contexto de skill: ${skillName}`);
    } else {
      console.log(`Advertencia: No se encontró la skill "${skillName}" en ${skillMd}`);
    }
  }

  const mode = args[0]; // --code, --summarize, --test

  if (!mode || mode === '--help' || mode === '-h') {
    console.log('Uso:');
    console.log('  node councils/ollama-runner.js --code "[prompt]" [dest_file.js] [--skill nombre-skill]');
    console.log('  node councils/ollama-runner.js --summarize "[text_or_readme]"');
    console.log('  node councils/ollama-runner.js --test');
    process.exit(0);
  }

  // Asegurar que la carpeta scratch existe
  if (!fs.existsSync(SCRATCH_DIR)) {
    fs.mkdirSync(SCRATCH_DIR, { recursive: true });
  }

  if (mode === '--test') {
    console.log('=== TEST DE INTEGRACIÓN DE OLLAMA ===');
    const promptTest = 'Escribe una función de suma simple en JS que exporte module.exports = (a, b) => a + b;';
    console.log(`Prompt: "${promptTest}"`);
    console.log('Conectando a Ollama local...');
    
    try {
      const response = await queryOllama(promptTest);
      const tempFile = path.join(SCRATCH_DIR, 'test_suma.js');
      
      let cleanCode = response.replace(/```javascript|```js|```/g, '').trim();
      fs.writeFileSync(tempFile, cleanCode, 'utf8');
      console.log(`Código escrito en sandbox: ${tempFile}`);

      validateCodeInSandbox(tempFile);
      console.log('Test completado exitosamente.');
    } catch (err) {
      console.error('Error durante el test:', err.message);
      process.exit(1);
    }
  }

  else if (mode === '--code') {
    const prompt = args[1];
    const destFile = args[2];

    if (!prompt || !destFile) {
      console.error('Falta el prompt o el archivo destino.');
      process.exit(1);
    }

    const tempFile = path.join(SCRATCH_DIR, 'temp_code.js');
    console.log('Generando código con Ollama...');

    try {
      let fullPrompt = prompt;
      if (skillPromptContent) {
        fullPrompt = `${skillPromptContent}\n\nRequisito del usuario: ${prompt}\n\nEscribe el código siguiendo estrictamente las instrucciones de la skill anterior. No agregues introducciones amigables, solo el código limpio de JavaScript.`;
      }
      
      const response = await queryOllama(fullPrompt);
      let cleanCode = response.replace(/```javascript|```js|```/g, '').trim();
      fs.writeFileSync(tempFile, cleanCode, 'utf8');
      console.log(`Código escrito en sandbox: ${tempFile}`);

      // Validar código
      validateCodeInSandbox(tempFile);

      // Copiar a destino final si todo está bien
      const destPath = path.resolve(process.cwd(), destFile);
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      
      fs.copyFileSync(tempFile, destPath);
      console.log(`[EXITO] Código integrado correctamente en: ${destPath}`);
      try { fs.unlinkSync(tempFile); } catch (e) {}
    } catch (err) {
      console.error(`[ERROR] La validación falló. Código retenido en el sandbox: ${tempFile}`);
      console.error(`Detalle: ${err.message}`);
      process.exit(1);
    }
  }

  else if (mode === '--summarize') {
    const textToSummarize = args[1];
    if (!textToSummarize) {
      console.error('Falta el texto a resumir.');
      process.exit(1);
    }

    const prompt = `Condensa el siguiente texto técnico en un resumen ejecutivo muy conciso de 3 a 5 viñetas, destacando lógicas clave, APIs y configuraciones importantes en español:\n\n${textToSummarize}`;
    
    try {
      console.log('Generando resumen técnico...');
      const response = await queryOllama(prompt);
      console.log('\n--- RESUMEN EJECUTIVO (OLLAMA) ---');
      console.log(response);
      console.log('-----------------------------------\n');
    } catch (err) {
      console.error('Error al conectar con Ollama:', err.message);
      process.exit(1);
    }
  }
}

// Si se ejecuta directamente, iniciar
if (require.main === module) {
  run();
}

module.exports = { queryOllama, sanitizeText };
