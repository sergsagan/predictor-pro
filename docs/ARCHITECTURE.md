# Architecture

The project follows **Clean Architecture**, **DDD** and **TDD** principles.

The goal is to keep business logic independent from infrastructure, APIs and presentation.

---

# Project Structure

```
server/
├── application/
├── domain/
├── infrastructure/
└── test/
```

## Domain

Contains business logic.

Examples:

- Models
- Value Objects
- Domain Services
- Engines
- Calculators

The Domain layer **must not know anything about**:

- HTTP
- REST
- Vue
- UI
- CSV formatting
- Localization
- Databases

---

## Application

Coordinates business logic.

Responsible for:

- Use Cases
- DTOs
- Mappers
- Presenters
- API Contracts

---

## Infrastructure

Responsible for external systems.

Examples:

- CSV Repository
- Database
- REST
- External APIs
- File System

---

## Test

Contains:

- Unit Tests
- Fixtures
- Test Helpers

Tests should never contain business logic.

---

# Core Components

## Statistics Engine

Responsible for calculating all historical statistics.

Examples:

- Frequency
- Gap
- Current Gap
- Last Seen
- Pair Frequency

Statistics Engine never recommends numbers.

---

## Recommendation Engine

Responsible for selecting the best candidate numbers using historical statistics.

Recommendation Engine:

- selects numbers
- ranks candidates
- calculates recommendation score

Recommendation Engine does **not**:

- format output
- generate UI
- localize text
- explain recommendations

---

## Number Analysis

Responsible for explaining why a number was recommended.

Examples:

- Frequency
- Current Gap
- Last Seen
- Pair Score
- Recommendation Score

Number Analysis never selects numbers.

---

# Development Rules

## Definition of Done

A Sprint is considered complete when:

- Business requirement implemented
- All tests are green
- Refactoring completed (if needed)
- Documentation updated
- ROADMAP updated
- DECISIONS updated
- Commit created

---

## TDD

Every feature follows:

```
RED
 ↓
GREEN
 ↓
REFACTOR
```

Rules:

- Every new feature starts with a failing test.
- Only write enough code to make the test pass.
- Refactor only after all tests are green.

---

## Sprint Rule

Sprint goals are fixed after the Sprint starts.

New ideas are **never** added to the active Sprint.

Instead, they are added to the Roadmap for future planning.

---

## Refactoring Rule

Refactoring is performed only when:

- all tests are green;
- behavior does not change;
- code readability or maintainability improves.

---

## Feature Rule

Every new property or algorithm must answer two questions:

1. What business problem does it solve?

2. Where will the user see or use it?

If either answer is missing, the feature should not be implemented.

---

## Documentation Rule

Documentation evolves together with the code.

Every completed Sprint should update:

- ROADMAP.md
- DECISIONS.md
- README.md (when appropriate)

---

# Engineering Principles

1. Business rules before implementation.

2. Simplicity over cleverness.

3. Small, focused commits.

4. Working software after every Sprint.

5. Tests are part of the implementation.

6. Architecture is more important than frameworks.

7. Documentation is part of the product.

8. Prefer explicit code over hidden magic.

9. Optimize only when there is evidence.

10. Build software that is easy to understand six months later.

---

# Long-Term Vision

The project evolves through independent Epics.

Each Epic is divided into small Sprints.

Each Sprint delivers a working increment of the product.

The objective is not only to build a Lottery Prediction Engine, but also to create a maintainable, testable and well-documented software system.
