# Ecosistema Obsidian — Meta-Aprendizaje Activo para Claude Code y Antigravity

Este repositorio contiene la configuración consolidada, las skills personalizadas y los ganchos de automatización del **Sistema Obsidian**, diseñado para optimizar el meta-aprendizaje dinámico de Claude Code y Antigravity en Windows. El sistema desacopla el almacenamiento de lecciones de la sesión activa utilizando **Engram** como base de datos semántica para ahorrar hasta un **95% de tokens por sesión**.

---

## 🏗️ Arquitectura del Ecosistema

El sistema opera mediante una estructura unificada en `%USERPROFILE%\.claude\` (compartida físicamente con `%USERPROFILE%\.gemini\config\skills` mediante un **Directory Junction Link** en Windows) y un sistema local de deliberación multi-agente en el proyecto:

```
councils/                       # Sistema del Consejo Consultivo
├── agents/                     # Personalidades e instrucciones de los 5 agentes
│   ├── architect.md            # Software Architect (Patrón-Senior)
│   ├── cfo.md                  # Financial / Lean Operations (Lean-CFO)
│   ├── orchestrator.md         # Systems Integrator & Hook Engineer
│   ├── niche_researcher.md     # Rastreador de tendencias de IA
│   └── comparative_researcher.md # Analista comparativo y de integraciones
├── investigaciones.md          # Bitácora comparativa con la competencia de IA
├── run-council.js              # Script ejecutable para lanzar debates en caliente
└── debates/                    # Transcripciones y actas de debates históricos
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
El archivo de configuración de Claude (`.claude.json`) se declara con:
* `filesystem`: Acceso a archivos locales.
* `memory`: Memoria global aislada.
* `github`: Integración nativa con repositorios.
* `test-sprite`: Tests integrados.
* `engram`: Integración de base de datos semántica.

---

## 🧠 Bucle de Aprendizaje por Refuerzo Auto-Dirigido (Auto-RL)

El agente aprende y registra conocimiento de forma autónoma sin intervención del usuario:
1. **Auto-Corrección:** El agente detecta cuando se autocorrige tras un fallo en caliente.
2. **Alertas del Compilador:** Si falla el linter o los tests unitarios, el error y su solución se registran en Engram.
3. **Logbook Activo (`working.md`):** Cada proyecto mantiene un archivo `working.md` dinámico con el estado de tareas que sincroniza el progreso y evita tener que re-analizar directorios completos en nuevas sesiones.

---

## 🏛️ Sistema del Consejo Consultivo (Councils)

El proyecto incluye un motor para debatir temas en caliente utilizando las personalidades locales de los 5 agentes. El sistema es autoevolutivo: los perfiles markdown de los agentes se actualizan y enriquecen de forma dinámica con el uso.

### Cómo ejecutar un debate:
Desde la terminal del proyecto, ejecuta:
```bash
node councils/run-council.js "optimizar cache de Next.js en produccion"
```
* **Resultado:** El script consolidará los perfiles locales de los agentes, formulará el prompt atómico, invocará al modelo CLI local (`opencode` o `claude`), mostrará el debate en vivo por consola y guardará la transcripción en un archivo Markdown bajo `councils/debates/debate_YYYYMMDD_HHMMSS.md`.

---

## 📈 Impacto de Tokens y Rendimiento
* **Contexto por Turno:** Reducción del prompt base de **4,200 tokens fijos a ~250 tokens** (carga modular de skills).
* **Consumo por Sesión Promedio:** Reducción de **641K tokens a ~35K tokens** (ahorro neto del **~94%**).
* **Latencia:** Reducción de tiempos de procesamiento por sesión gracias a un contexto optimizado y libre de polución de chat.
