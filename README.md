# Ecosistema Obsidian — Entorno de Memoria Centralizado y Puro

Esta rama (`memory-only`) contiene la configuración consolidada, las skills personalizadas y los hooks de automatización del **Sistema Obsidian**, enfocados **exclusivamente en la funcionalidad de memoria semántica y la centralización del conocimiento** entre Claude Code y Antigravity en Windows. 

Esta versión **no requiere Ollama, no ejecuta modelos locales en la GPU, ni realiza scraping de internet**. Utiliza únicamente **Engram** como base de datos semántica para ahorrar hasta un **95% de tokens por sesión** al consolidar aprendizajes en segundo plano.

---

## 🏗️ Arquitectura del Sistema de Memoria

El sistema opera mediante una estructura unificada en `%USERPROFILE%\.claude\` (compartida físicamente con `%USERPROFILE%\.gemini\config\skills` mediante un **Directory Junction Link** en Windows) y hooks de ciclo de vida automatizados:

```
.claude/
├── commands/                   # Comandos de slash (/obs, /forge, /mem)
├── agents/                     # Agentes espejo para Claude Code
├── hooks/
│   ├── obsidian-capture.sh     # Captura de observaciones en caliente
│   ├── obsidian-flush.sh       # Consolidación automática al salir
│   ├── block-dangerous.sh      # Hook de seguridad para comandos bash
│   ├── auto-forge.js           # Motor de compilación silencioso en segundo plano
│   └── weekly-audit.sh         # Auditoría y consolidación de fin de semana
└── skills/                     # 22 Skills de desarrollo personalizables
```

---

## 🛠️ Instalación y Configuración (Rama `memory-only`)

Sigue estos pasos para instalar y sincronizar el entorno de memoria pura en tu PC:

### 1. Requisitos Previos
* Tener instalado Node.js (v18+) en Windows.
* Contar con el binario de **Engram** en el PATH (suele instalarse automáticamente con Antigravity en `%USERPROFILE%\.gemini\antigravity\bin\engram.exe`).

### 2. Clonar y Desplegar
Clona esta rama del repositorio en tu máquina y ejecuta el script de instalación automática:
```powershell
# Clonar y entrar al directorio
git clone -b memory-only <repositorio-url> Crazskills
cd Crazskills

# Ejecutar el instalador
node setup.js
```
El script `setup.js` realizará las siguientes tareas automáticamente:
1. Creará los directorios base en `~/.claude/`.
2. Copiará los hooks y scripts de automatización portables.
3. Desplegará los comandos slash `/obs`, `/forge`, `/mem` de forma global (`~/.claude/commands/`) y local (`.claude/commands/`).
4. Creará el **Directory Junction Link** físico para que Antigravity y Claude Code compartan las mismas skills en tiempo real.
5. Configurará el programador de tareas de Windows para ejecutar la auditoría semanal silenciosa de memoria.

---

## 🧠 Comandos Slash Disponibles

*   **`/obs`**: Captura observaciones puntuales de manera rápida en caliente, guardándolas bajo el scope correspondiente en Engram.
*   **`/forge`**: Inicia la consolidación manual o generación de skills nuevas procesando las observaciones acumuladas en Engram.
*   **`/mem`**: Ejecuta el ciclo completo de exportación y consolidación de memoria de la sesión actual.

---

## 📊 Integración Auto-RL y Consolidación de Memoria
*   **Auto-RL Activo:** Cada vez que corrijas al agente en el chat, el hook `obsidian-capture.sh` guardará la observación de forma transparente en Engram.
*   **Auto-Forge al Salir:** Al cerrar tu sesión de desarrollo, `obsidian-flush.sh` invoca a `auto-forge.js` para extraer las observaciones, resolverlas, inyectar el delta de aprendizaje en `learnings.md` de la skill relevante y limpiar Engram para la siguiente sesión.
*   **Weekly Audit:** Todos los viernes a las 18:00 se ejecuta la tarea programada `ObsidianWeeklyAudit` para compilar un reporte de mejoras de skills directamente en tu escritorio en `Reporte_Skills_Semanal.md`.

---

## 📈 Impacto de Tokens y Rendimiento
*   **Ahorro de Contexto:** Al aislar las lecciones en archivos `learnings.md` por skill y inyectarlas bajo demanda, el contexto inicial disminuye de **4,200 a ~250 tokens**.
*   **Optimización del Presupuesto:** Mantiene tus sesiones ágiles y por debajo del límite sugerido de **150,000 tokens**, evitando la latencia y la degradación en el razonamiento del LLM.
