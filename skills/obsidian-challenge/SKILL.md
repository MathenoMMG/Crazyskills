---
name: obsidian-challenge
description: Realiza un análisis crítico de seguridad, diseño y dependencias (Pre-Flight Challenge) antes de escribir o modificar código. Activa automáticamente cuando el usuario pida realizar cambios complejos de código, modificaciones de arquitectura, autenticación, acceso a disco, o cuando alguien mencione "/challenge" o "challenge".
---

# Obsidian Challenge — Pre-Flight Audit & Threat Modeling

Antes de escribir o integrar cualquier bloque de código en el proyecto, debes realizar una pausa cognitiva y formular un análisis crítico estructurado de la tarea para prevenir vulnerabilidades de seguridad, regresiones o mala arquitectura.

## 📋 Protocolo Challenge

Responde detallando los siguientes 4 puntos clave antes de proceder al desarrollo:

### 1. Modelado de Amenazas (Threat Modeling)
- **Acceso a Datos:** ¿La modificación expone variables de entorno, claves de API, tokens o información sensible?
- **Inyección y Ejecución:** ¿El código propuesto utiliza funciones de ejecución de comandos shell (`execSync`, `spawn`, `eval`) o lectura/escritura arbitraria de archivos? Si es así, ¿cómo se sanitiza el input?
- **Sandboxing:** ¿Cómo garantizaremos que el script se ejecute de forma segura en el sandbox local de Node?

### 2. Validación de Firmas (Zero Guessing)
- **Dependencias Cruzadas:** Identifica todas las dependencias del archivo a modificar utilizando el Grafo de Conocimiento (`working.md` y enlaces físicos).
- **Firmas Existentes:** Si el componente llama a APIs de otros módulos del proyecto, verifica las firmas exactas en sus archivos fuente antes de programar. **Prohibido asumir firmas de métodos.**

### 3. Criterios de Calidad (Quality Gates)
- **TDD (Test-Driven Development):** ¿Existe un archivo de pruebas unitarias asociado (`.test.js`)? Si no, define la estructura del test que validará el nuevo código.
- **Linter y Formateo:** Asegura que el archivo generado sea compatible con el compilador nativo (`node -c`) y pase Prettier.

### 4. Presupuesto de Tokens y Contexto (Progressive Disclosure)
- **Skills Requeridas:** Selecciona exclusivamente las skills necesarias para el cambio. No cargues skills redundantes para evitar el bloat de contexto.
- **Presupuesto de Tokens:** Verifica que el contexto conversacional se mantenga por debajo de los **150,000 tokens**. Si supera este límite, sugiere realizar un `/compact` o compactación al usuario.
