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

---

## ADR-005

### Title

Adaptive Weight Selection

### Decision

The predictions API uses adaptive weight selection after the recommendation
strategy has been selected.

For the `simple` strategy:

- Generate eight candidate configurations from values `[1, 2]`
  for frequency, currentGap, and pairScore.
- Evaluate candidates using walk-forward backtesting.
- Use hit rate (`hitRate`) as the optimization metric.
- Require at least 30 predictions for a candidate to be eligible.
- Select the candidate with the highest hit rate.
- Preserve the first candidate when hit rates are equal.
- Normalize selected weights by dividing each component by the maximum
  component. The maximum normalized weight is therefore `1`.

If no eligible result exists, use default weights:

- frequency: `1`
- currentGap: `1`
- pairScore: `1`

For the `gap-focused` strategy, skip weight optimization and use default
weights because configurable weights do not affect its recommendation ranking.

The predictions API returns adaptation metadata:

- Selected strategy
- Strategy selection reason
- Applied weights
- Weight selection reason

Weight selection reasons:

- `highest-hit-rate`
- `insufficient-sample`
- `no-results`
- `invalid-profile`
- `not-applicable`

### Reason

Weight optimization should be reproducible and use historical evidence without
introducing future-draw information into backtesting.

The minimum sample prevents selecting a profile from a very small number
of predictions. Normalization preserves the relative proportions of weights
while keeping their scale consistent.

Strategy-specific behavior avoids optimizing parameters that do not affect
the actual recommendation ranking.
