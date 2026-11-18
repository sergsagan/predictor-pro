# Lottery Prediction Engine

The service analyzes historical lottery draws, generates number recommendations with explanations, stores predictions, and evaluates them against actual results.

## Documentation

- [Roadmap and sprint plan](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Architecture decisions](docs/DECISIONS.md)

## Project Status

- Version: v1
- Current epic: Strategy Intelligence & Adaptation
- Latest completed sprint: Sprint 40 — Adaptive Strategy Selection
- Next sprint: Sprint 41 — Adaptive Weights

Sprint 40 is complete: the adaptive selector and evaluator are integrated into the predictions API and covered by tests. The roadmap contains the detailed plan for Sprints 41–48.

## Technology and Practices

- Nuxt 4, Vue 3, TypeScript
- Clean Architecture, DDD, TDD
- Vitest, ESLint, Prettier
- CSV repositories for local data storage

## Development

```sh
npm install
npm run dev
```

Common commands:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The current implementation focuses on server APIs and domain logic. A complete user interface has not been implemented yet; it is planned as a separate epic after the APIs are stable.
