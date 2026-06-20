# Bitácora de Investigación Comparativa de IA — Sistema Obsidian

**Mantenedor:** Comparative Researcher  
**Última Actualización:** 2026-06-20  

---

## 🔍 Tabla Comparativa de Soluciones y Competencia

| Solución / Competidor | Enfoque de Memoria | Costo de Integración | Viabilidad en nuestro Sistema |
| :--- | :--- | :--- | :--- |
| **Microsoft GraphRAG** | Grafo de conocimiento a gran escala (Neo4j / CosmosDB). | Muy alto. Requiere pipelines de ingestión e infraestructura pesada. | **Baja.** Demasiado lento y costoso para proyectos en local. |
| **Letta / Mem0** | Memoria jerárquica basada en base de datos PostgreSQL e historial. | Medio. Requiere APIs REST activas ejecutándose localmente. | **Media.** Se puede simular localmente a través del servidor MCP de Engram. |
| **Superpowers (GitHub)** | Scripts e instrucciones estrictas para TDD y Planificación. | Muy bajo. Son puros archivos de markdown de soporte. | **Alta.** Ya se integró bajo el principio "Pre-Flight" y las skills de TDD. |
| **Obsidian System (Nuestra)** | Grafo de Markdown ligero conectado por hipervínculos absolutos e inyección modular. | Nulo. Integrado nativamente en el sistema de archivos del usuario. | **Máxima (Activa).** |

---

## 💡 Propuestas de Integración Futuras

1.  **Delegación a Subagentes de Bajo Costo (Aprobado):** Implementar la definición de subagentes mediante `define_subagent` de Antigravity (utilizando modelos económicos como Gemini 1.5 Flash) para tareas rutinarias y de alto consumo de tokens como la generación de tests unitarios, documentación de APIs o formateo de CSS/HTML, reduciendo el consumo acumulativo en el hilo premium.
2.  **Orquestación de Terminales:** Estudiar la adopción de WezTerm/Ghostty en los manuales de usuario para evitar la lentitud de renderizado del stream RAG.
3.  **Evaluación de MemPalace:** Estudiar la arquitectura de `MemPalace` (recuperada en las búsquedas de Niche Researcher) para ver si podemos emular su estrategia de indexación temporal de corto plazo dentro de nuestras skills de markdown sin incurrir en dependencias de bases de datos.
4.  **Validación de Graphiti:** Investigar la biblioteca de código abierto Graphiti de Zep para evaluar si podemos integrarla como un servidor MCP local para gestionar relaciones de memoria con marcas de tiempo temporales.

