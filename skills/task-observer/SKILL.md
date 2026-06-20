---
name: task-observer
description: Herramienta de análisis profundo y meta-aprendizaje. NOTA: No activar de forma global. Solo se invoca explícitamente para auditorías completas de código o revisiones de confidencialidad de datos.
---
# Task Observer (Meta-Learning Engine)

## Protocolo de Auditoría:
1. Realiza un análisis exhaustivo de la sesión evaluando la efectividad cualitativa de los outputs generados.
2. Ejecuta el control de confidencialidad de 5 capas (Confidentiality Sweeps), incluyendo el barrido cruzado de reidentificación de datos de clientes (cross-product re-identifiability sweep) antes de proponer actualizaciones de código abierto o compartible.
3. Almacena los hallazgos en la estructura compartida del espacio de trabajo.