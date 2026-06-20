---
name: test-driven-development
description: Trigger obligatorio al escribir nuevos componentes, lógica compleja o antes de refactorizar. Fuerza el desarrollo guiado por pruebas (TDD).
---
# Test-Driven Development (TDD) Workflow
Sigue estrictamente el ciclo Red-Green-Refactor en todas tus implementaciones:

1. **RED:** Escribe el test unitario antes de implementar la funcionalidad. Asegúrate de ejecutarlo y verificar que falla.
2. **GREEN:** Escribe el código de producción mínimo y más simple que haga pasar la prueba.
3. **REFACTOR:** Limpia el código eliminando duplicaciones, mejorando nombres y estructurándolo sin alterar el comportamiento. Ejecuta los tests para validar.