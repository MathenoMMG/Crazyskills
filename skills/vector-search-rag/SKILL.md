---
name: vector-search-rag
description: Trigger automático al diseñar flujos de Retrieval Augmented Generation (RAG) o integrar bases de datos vectoriales.
---
# Vector Search & RAG Optimizations
- **Chunking:** Divide documentos inteligentemente basándote en la semántica o marcas Markdown en lugar de solo longitud de caracteres.
- **Search:** Prefiere búsquedas híbridas (combinando búsqueda vectorial por coseno con filtros léxicos BM25) para mejorar relevancia.
- **Context:** Diseña prompts de RAG para evitar "lost in the middle", ordenando los resultados más relevantes al inicio y final del prompt.