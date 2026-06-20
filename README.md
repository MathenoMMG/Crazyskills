# Ecosistema Obsidian — Meta-Aprendizaje Activo para Claude Code y Antigravity

Este repositorio contiene la configuración consolidada, las skills personalizadas y los ganchos de automatización del **Sistema Obsidian**, diseñado para optimizar el meta-aprendizaje dinámico de Claude Code y Antigravity en Windows. El sistema desacopla el almacenamiento de lecciones de la sesión activa utilizando **Engram** como base de datos semántica para ahorrar hasta un **95% de tokens por sesión**.

---

## 🏗️ Arquitectura del Sistema

El sistema opera mediante una estructura unificada en `%USERPROFILE%\.claude\` (compartida físicamente con `%USERPROFILE%\.gemini\config\skills` mediante un **Directory Junction Link** en Windows):

```
.claude/
├── CLAUDE.md                   # Instrucciones globales e identidad visual anti-slop
├── principles.md               # Principios globales de diseño (Lean Content, Pre-Flight, etc.)
├── settings.json               # Configuración de hooks de ciclo de vida y MCP servers
├── commands/                   # Definición de slash commands (/obs y /forge)
├── hooks/
│   ├── obsidian-capture.sh     # Gancho de pre-prompt que detecta correcciones
│   ├── obsidian-flush.sh       # Gancho asíncrono que inicia la auto-consolidación
│   ├── auto-forge.js           # Script en Node.js que migra observaciones a learnings.md
│   └── block-dangerous.sh      # Firewall de comandos destructivos (rm -rf, sudo)
└── skills/                     # 22 skills específicas de producción con learnings.md
```

---

## 🛠️ Instalación y Configuración

### 1. Requisitos Previos
* Tener instalado Node.js (v18+) en Windows.
* Contar con el binario de **Engram** configurado en el PATH.

### 2. Vinculación de Herramientas
Para que Claude Code y Antigravity compartan las skills y su histórico en tiempo real, se establece una unión de directorios en la terminal de Windows (PowerShell):
```powershell
New-Item -ItemType Junction -Path "$env:USERPROFILE\.gemini\config\skills" -Target "$env:USERPROFILE\.claude\skills"
```

### 3. Servidores MCP Globales
El archivo de configuración de Claude (`.claude.json`) se actualiza para declarar los siguientes servidores:
* `filesystem`: Acceso a archivos locales.
* `memory`: Memoria global aislada.
* `github`: Integración nativa con repositorios.
* `test-sprite`: Tests integrados.
* `engram`: Integración de base de datos semántica.

---

## 🧠 Bucle de Aprendizaje por Refuerzo Auto-Dirigido (Auto-RL)

El agente aprende y registra conocimiento de forma autónoma sin intervención del usuario:
1. **Auto-Corrección:** El agente detecta cuando se autocorrige tras un fallo en caliente.
2. **Alertas del Compilador:** Si falla el linter (`eslint`) o los tests unitarios, el error y su solución se registran en Engram.
3. **Logbook Activo (`working.md`):** Cada proyecto mantiene un archivo `working.md` dinámico con el estado de tareas que sincroniza el progreso y evita tener que re-analizar directorios completos en nuevas sesiones.

---

## 📈 Impacto de Tokens y Rendimiento
* **Contexto por Turno:** Reducción del prompt base de **4,200 tokens fijos a ~250 tokens** (carga modular de skills).
* **Consumo por Sesión Promedio:** Reducción de **641K tokens a ~35K tokens** (ahorro neto del **~94%**).
* **Latencia:** Reducción de tiempos de procesamiento por sesión gracias a un contexto optimizado y libre de polución de chat.
