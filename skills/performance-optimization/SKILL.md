---
name: performance-optimization
description: Trigger cuando el usuario pida agilizar código, reducir tiempos de respuesta, optimizar base de datos o mejorar tiempos de renderizado.
---
# Performance Optimization & Benchmarking

## Reglas de Oro:
- **Complejidad Algorítmica:** Analiza la complejidad temporal/espacial usando notación Big-O antes de reescribir algoritmos críticos.
- **Base de Datos:** Evita consultas N+1. Utiliza eager loading, índices apropiados y consultas selectivas.
- **Gestión de Memoria:** Libera recursos, evita memory leaks por listeners no limpiados, y prefiere flujos de datos (Streams) para archivos pesados.