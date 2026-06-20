---
name: edge-runtime-serverless
description: Trigger automático cuando diseñes endpoints de API serverless, middlewares de Next.js o workers en Cloudflare/Vercel.
---
# Edge Runtime & Serverless Best Practices
- **Restricciones:** No uses librerías dependientes de APIs nativas de Node.js (como `fs` o `child_process`) a menos que el entorno las simule explícitamente.
- **Cold Starts:** Reduce el tamaño de importaciones y mantén las dependencias en el scope mínimo para acelerar la inicialización de funciones.