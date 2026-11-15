# Architecture Decisions

---

## ADR-001

### Title

Recommendation Score

### Decision

Recommendation Score is informational.

It is calculated but does not affect recommendation ordering.

### Reason

There is currently not enough evidence that Score is a better ranking criterion than the existing recommendation algorithm.

---

## ADR-002

### Title

Recommendation Details

### Decision

Recommendation contains:

- Frequency
- Current Gap
- Last Seen
- Pair Score
- Recommendation Score

### Reason

These fields are required to explain every recommendation.

---

## ADR-003

### Title

Sprint Discipline

### Decision

Sprint scope cannot change after Sprint starts.

New ideas are scheduled for future sprints.

### Reason

Keeps development predictable and aligned with TDD.

---

## ADR-004

### Title

Strategy Performance History

### Decision

Strategy performance comparisons are stored as immutable snapshots.

Each snapshot contains:

- Evaluation timestamp
- Latest draw date included in the comparison
- Complete comparison results for both strategies
- Winning strategy

Snapshots are append-only.

Historical snapshots are returned in chronological order.

### Reason

Strategy performance history provides historical evidence
for future adaptive strategy selection.
