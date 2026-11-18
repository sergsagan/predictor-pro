# Lottery Prediction Engine — Roadmap

## Vision

The service analyzes historical lottery draws, generates recommendations with explanations, stores predictions, and measures their quality. Further development will make strategy adaptation measurable and transparent, analytics useful, and the application reliable to operate.

## Status

- Current version: v1
- Current epic: Strategy Intelligence & Adaptation
- Latest completed sprint: Sprint 40 — Adaptive Strategy Selection
- Next sprint: Sprint 41 — Adaptive Weights

Sprints 1–39 are complete, as recorded in the history below. Sprint 40 is implemented: the selector reads strategy performance history, falls back to the simple strategy when no history exists, and passes the latest snapshot to the evaluator. The predictions API integration and tests are in place.

### EPIC 1 — Statistics Engine

- [x] Sprint 1 — Number frequency
- [x] Sprint 2 — Last seen
- [x] Sprint 3 — Gaps between appearances
- [x] Sprint 4 — Current gap
- [x] Sprint 5 — Statistics result
- [x] Sprint 6 — Statistics API
- [x] Sprint 7 — Pair frequency
- [x] Sprint 8 — Pair frequency integration

### EPIC 2 — Recommendation Engine

- [x] Sprint 9 — Basic recommendation engine
- [x] Sprint 10 — Pair-aware recommendations
- [x] Sprint 11 — Recommendation score
- [x] Sprint 12 — Recommendation details and explanations

### EPIC 3 — Number Analysis

- [x] Sprint 13 — Number analysis model
- [x] Sprint 14 — Number analysis service
- [x] Sprint 15 — Recommendation view model
- [x] Sprint 16 — Recommendations API

### EPIC 4 — Recommendation Validation

- [x] Sprint 17 — Backtesting engine
- [x] Sprint 18 — Accuracy metrics
- [x] Sprint 19 — Recommendation history
- [x] Sprint 20 — Algorithm comparison

### EPIC 5 — Weighted Recommendation

- [x] Sprint 21 — Weighted score
- [x] Sprint 22 — Configurable weights
- [x] Sprint 23 — Alternative recommendation strategies

### EPIC 6 — Recommendation Optimization

- [x] Sprint 24 — Strategy configuration
- [x] Sprint 25 — Weight optimization
- [x] Sprint 26 — Parameter search
- [x] Sprint 27 — Strategy optimization

### EPIC 7 — Prediction API & Application Layer

- [x] Sprint 28 — Prediction service
- [x] Sprint 29 — Predictions API
- [x] Sprint 30 — Strategy comparison API
- [x] Sprint 31 — Recommendation explanations

### EPIC 8 — Prediction History & Persistence

- [x] Sprint 32 — Prediction model and repository
- [x] Sprint 33 — Prediction history service
- [x] Sprint 34 — Prediction history API
- [x] Sprint 35 — Prediction evaluation against actual draws

### EPIC 9 — Automated Prediction & Evaluation

- [x] Sprint 36 — Prediction scheduler
- [x] Sprint 37 — Automatic prediction evaluation
- [x] Sprint 38 — Prediction performance API

### EPIC 10 — Strategy Intelligence & Adaptation

- [x] Sprint 39 — Strategy performance history
- [x] Sprint 40 — Adaptive strategy selection
- [ ] Sprint 41 — Adaptive weights
  - **Goal:** Use evaluation results to choose recommendation weights under clear constraints.
  - **Scope:** Define the evaluation metric and time window; implement a domain service for weight adaptation; set weight bounds and behavior for small or missing samples; pass selected weights to the next prediction; include the applied weights and selection reason in the prediction result.
  - **Acceptance criteria:** Identical inputs produce identical weights; weights are always valid and normalized according to the chosen rule; documented defaults apply when data is insufficient; evaluation does not use future draws; unit and integration tests cover the behavior.
  - **Dependencies:** Sprints 39 and 40.

### EPIC 11 — Prediction Analytics

- [ ] Sprint 42 — Prediction analytics API
  - **Goal:** Provide a consistent API for assessing historical predictions.
  - **Scope:** Aggregate existing evaluations by time range, match count, and trend; define contracts, date filters, and empty-history behavior; return DTOs instead of domain models.
  - **Acceptance criteria:** The API has a documented, stable contract; handles empty data, date boundaries, and missing evaluations; metrics reconcile with individual evaluation records; use-case and API tests cover the behavior.
  - **Dependencies:** Sprints 35 and 38.
- [ ] Sprint 43 — Strategy analytics
  - **Goal:** Explain how strategies perform over time and make selector decisions transparent.
  - **Scope:** Aggregate comparison snapshots by strategy and period; expose observation counts, metrics used, the winner, and the decision reason; define minimum sample size and tie handling.
  - **Acceptance criteria:** Results are reproducible and do not mix different evaluation windows; every adaptive decision can be traced to its source data; the API returns validated DTOs; aggregation and integration tests are included.
  - **Dependencies:** Sprints 39 and 40.
- [ ] Sprint 44 — Optimization analytics
  - **Goal:** Show the origin and effect of strategy and weight optimization results.
  - **Scope:** Define how optimization runs are stored; return best parameters with metrics, data period, and configuration; compare optimization results with baseline parameters.
  - **Acceptance criteria:** Each result contains enough information to reproduce it; the API does not return results without data context; empty and invalid runs have defined behavior; tests cover persistence, retrieval, and comparison.
  - **Dependencies:** Sprints 25–27; preferably after Sprints 42–43 to align analytics contracts.

### EPIC 12 — Production Readiness

- [ ] Sprint 45 — Configuration management
  - **Goal:** Move critical infrastructure settings out of route handlers.
  - **Scope:** Centralize storage paths, scheduler timing, adaptation parameters, and environment settings; validate configuration at startup; provide safe defaults for local development.
  - **Acceptance criteria:** The application fails startup with a clear error for invalid required settings; configuration is not scattered across API handlers; local startup is documented and repeatable.
- [ ] Sprint 46 — Validation and error handling
  - **Goal:** Make API behavior predictable for invalid requests and dependency failures.
  - **Scope:** Define request and configuration validation schemas; standardize error response format and HTTP status codes; add error boundaries for repositories and application use cases.
  - **Acceptance criteria:** Invalid input returns a stable client error; internal details are not exposed in responses; errors can be identified by code and correlation ID; API tests verify the contract.
  - **Dependencies:** Sprint 45.
- [ ] Sprint 47 — Observability and logging
  - **Goal:** Make failures and background evaluation behavior diagnosable.
  - **Scope:** Add structured logs for requests, prediction, and evaluation; correlation IDs; key success and failure counters; define sensitive data masking and logging levels.
  - **Acceptance criteria:** Critical flows can be traced from request to storage; failed scheduler jobs are visible; logs contain no secrets; the format and local verification steps are documented.
  - **Dependencies:** Sprint 46.
- [ ] Sprint 48 — End-to-end verification
  - **Goal:** Verify the complete application flow in a clean environment.
  - **Scope:** Automate the flow from reading or loading draws through prediction, persistence, evaluation, and analytics retrieval; verify configuration and recovery from failures; document local setup and a release checklist.
  - **Acceptance criteria:** The complete flow passes on a clean checkout; API results are consistent across the flow; repeated runs do not create duplicates where idempotency is required; lint, typecheck, tests, and production build pass.
  - **Dependencies:** Sprints 42–47.

## After v1 — Product UI

The repository currently contains only `app/app.vue` and has no dedicated user screens. After the APIs are stable, plan a separate UI epic covering the latest prediction overview, history and evaluation, strategy comparison, analytics, loading and error states, and accessibility. Define contracts and designs before starting that epic.

## Sprint Definition of Done

- Implementation meets the agreed goal and acceptance criteria.
- New business rules have unit tests; integration and API scenarios are verified where relevant.
- Lint and typecheck pass; run the full test suite and production build as appropriate.
- Documentation and README status are updated.
- Decisions that affect architecture or behavior are recorded in `docs/DECISIONS.md`.
