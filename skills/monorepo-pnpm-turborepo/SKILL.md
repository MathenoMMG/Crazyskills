---
name: monorepo-pnpm-turborepo
description: Trigger automático al trabajar dentro de estructuras monorepo utilizando Turborepo, Yarn/pnpm Workspaces o Nx.
---
# Monorepo Orchestration with Turborepo & pnpm
- **Aislamiento:** Declara dependencias cruzadas entre paquetes de forma explícita en sus respectivos `package.json`.
- **Cache Hits:** Configura apropiadamente las entradas/salidas en el archivo `turbo.json` para evitar reconstrucciones innecesarias de artefactos linter/build.