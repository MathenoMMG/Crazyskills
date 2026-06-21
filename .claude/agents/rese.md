---
description: |
  Realiza una investigación profunda con scraping web sobre un tema en específico.
  Llama al becario local (Ollama) para sintetizar las fuentes recopiladas de forma detallada,
  entregando un reporte final con información de cada fuente para tomar mejores decisiones.
  Uso: /rese [tema de investigación]
---

Cuando el usuario ejecute este comando, realiza las siguientes acciones:

1. **Recolección de Información (Web Search / Scraping):**
   Utiliza la herramienta `search_web` para buscar información relevante sobre el tema proporcionado en el argumento.
   Recupera los enlaces y resúmenes de al menos las 5 fuentes más relevantes del buscador.

2. **Procesar Fuentes:**
   Para cada una de las fuentes encontradas, compila una lista estructurada indicando el título de la fuente, la URL y el fragmento/resumen obtenido.

3. **Delegación al Becario Local (Ollama):**
   Llama al becario local (`node councils/ollama-runner.js --summarize "[fuentes compiladas]"`) para que procese toda la información compilada. El becario procesará el texto en tu GPU dedicada (CUDA) a costo cero y generará una síntesis ejecutiva estructurada destacando los puntos más importantes de cada fuente.

4. **Reporte Final:**
   Presenta el reporte en el chat con el siguiente formato estructurado:
   - **Tema Investigado:** [Tema]
   - **Tabla de Fuentes:** Lista de enlaces y títulos con hipervínculos clicables.
   - **Análisis Detallado del Becario (Ollama):** La síntesis estructurada generada localmente.
   - **Recomendación para Toma de Decisiones:** Propuesta concreta para continuar según el análisis.
