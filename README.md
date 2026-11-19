# Lottery Prediction Engine

The service analyzes historical lottery draws, generates number recommendations with explanations, stores predictions, and evaluates them against actual results.

## Documentation

- [Roadmap and sprint plan](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Architecture decisions](docs/DECISIONS.md)

## Project Status

- Version: v1
- Current epic: Strategy Intelligence & Adaptation
- Latest completed sprint: Sprint 41 — Adaptive Weights
- Next sprint: Sprint 42 — Prediction analytics API

Sprint 40 implements adaptive recommendation strategy selection from persisted
performance history.

Sprint 41 adds adaptive weight selection for the simple strategy using
walk-forward backtesting. It evaluates eight candidate profiles, requires
a minimum sample of 30 predictions, normalizes selected weights, and falls
back to default weights when results are unavailable or insufficient.

The predictions API returns adaptation metadata containing the selected
strategy, strategy selection reason, applied weights, and weight selection
reason. Weight optimization is skipped for the gap-focused strategy because
its ranking does not depend on configurable weights.

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
