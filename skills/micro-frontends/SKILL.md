---
name: micro-frontends
description: Trigger automático al dividir interfaces en múltiples micro-aplicaciones dinámicas (Module Federation, single-spa).
---
# Micro-Frontends Architecture
- **Estilos:** Aísla CSS para evitar fugas y colisiones globales entre aplicaciones hermanas.
- **Comunicación:** Prefiere Custom Events del navegador o event buses ligeros en lugar de persistir estados globales cruzados muy acoplados.