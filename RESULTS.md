# Measured results

Upstream: `4a156a78e9b03ded7ac1273955c0cb314224ec70`. Local evaluation on 2026-10-06.

## Held-out strategy evaluation

50 seeds (9000–9049), 60 rounds each; team `development-team`.
Each strategy is replayed in a separate unmodified Arena with the same seed and device.
These experiments have no network errors; they are not an official competition score.

| Strategy | Mean score | Mean idle rounds | Floor violations/run | Wins over all 3 bots |
|---|---:|---:|---:|---:|
| template | 13.3873 | 18.44 | 1.84 | 0/50 |
| taper | 16.4968 | 1.82 | 0.34 | 48/50 |
| adaptive | 17.2263 | 6.50 | 0.42 | 50/50 |

Adaptive improvement in mean score: **28.68%**. Paired seed bootstrap
95% interval: **25.69%–31.85%** (5,000 resamples; descriptive, not a guarantee).
Mean decision time: 3.10 ms. No invalid bids or protocol sanctions in these runs.

## Development and negative results

Seeds 1000–1014 were used for development. Adaptive averaged 17.0175,
versus 13.9160 for template and 15.9229 for battery taper alone.
Increasing the battery cost multiplier to 1.5 or 2 reduced the development
mean to 16.8757 and 16.6669. We rejected those variants before holdout testing.

## Effect on other nodes

Other nodes' combined mean score: 44.2443 → 38.4129.
Mean cumulative reported log social welfare: -190.5738 → -202.3644.
Our individual gain comes partly at neighbours’ expense. The reported welfare
sums log utilities of participating nodes only; changes in participation affect
the metric, so it is not a fixed-population welfare comparison.

## Reliability and delivery limits

The official 15-round conformance suite passed all 8 checks, including 25 injected
503/429 faults, 12/12 eligible rounds bid, zero misses, zero compromise and exit 0.
Three rounds were spent resting. Indicative functional/resilience: 30/30 and 20/20.
This is one local test, not the final organisers’ grade.

The live 60-round HTTP result is archived separately in `results/live-match.json`.
Image check, 2026-10-07 (`results/image-conformance.json`): `swarm-agent:submission`
was built from `agent-template` and passed all 8 conformance checks as a container:
14/14 eligible rounds bid, zero misses, zero compromise, 19 injected faults, one
resting round, exit 0. It was built from this working copy, not from a fresh clone.
The included GitHub Actions workflow repeats both steps on a clean runner after publication.
TEAM_NAME and member names still need confirmation. The hidden reference is unavailable.

## Reproduce

```sh
python experiments/benchmark.py --start 9000 --count 50 --output results/holdout.json
python -m pip install matplotlib
python experiments/report.py
```


## Live HTTP integration evidence

`live-match-before-history-fix.json`: seed 77123, rank 2/4, score 15.3849, 48 bids, 0 missed, 12 idle, compromise 0.0, exit 0. Injected faults: 75 HTTP 503 and 38 HTTP 429.

`live-match.json`: seed 77123, rank 1/4, score 16.6697, 48 bids, 0 missed, 12 idle, compromise 0.0, exit 0. Injected faults: 66 HTTP 503 and 31 HTTP 429.

The first live run finished second, slightly behind the best bot.
It revealed incomplete history collection. We retained it and revised the
transport integration, not the frozen strategy. A same-seed rerun is a
regression check, not independent evidence of universal wins; real HTTP
timing and fault sequences differ between runs.

Final conformance output is in `results/conformance-final.json`.
The final revision passed all 8 checks: 14/14 eligible rounds, zero
misses, zero sanctions, 20 injected faults, clean exit. Five focused
unit tests also pass. The earlier 25-fault result above is retained
as evidence from before the transport revision.

## Runs with the submitted team name

`TEAM_NAME=los-bocatones`, 2026-10-07. The team name changes the device profile,
so these repeat the checks above on the device that will be graded. The policy
was not changed for them.

| Check | Result | File |
|---|---|---|
| Benchmark, 20 seeds (12000–12019), no network faults | adaptive 17.4113 vs template 13.2753 (+31.2%); ahead of all three bots in 20/20 | `results/team-benchmark.json` |
| Same benchmark, battery taper only | 16.9998; 20/20 | `results/team-benchmark.json` |
| Live HTTP match, graded, seed 77123 | rank 1/4, 18.2397 vs 13.5109 for the best bot; 57 bids, 0 missed, 3 idle, 0 floor violations, compromise 0.0, exit 0; 58 HTTP 503 and 29 HTTP 429 injected | `results/team-live.json` |
| Conformance against the Docker image | 8/8; 14/14 eligible rounds, 21 injected faults | `results/team-image-conformance.json` |

Twenty seeds is a smaller sample than the 50-seed holdout, and the live match is
a single run on a known seed. Neither is an official score.

## Late tuning attempts that did not help

2026-10-07, seeds 1000–1014 on three device profiles (`los-bocatones`,
`development-team`, `team-kappa`; 45 runs per variant). Baseline: 17.2283.
Each row changes one knob of the submitted search.

| Variant | Mean score | Change |
|---|---:|---:|
| Recharge value × 0.7 (charge costs more) | 17.2346 | +0.006 |
| Recharge value × 0.85 | 17.2605 | +0.032 |
| Recharge value × 1.2 (charge costs less) | 17.1799 | −0.048 |
| Stop pricing charge in the last 4 rounds | 17.1956 | −0.033 |
| Stop pricing charge in the last 8 rounds | 17.1210 | −0.107 |
| Count waste from the 0.05 cutoff instead of zero | 17.1623 | −0.066 |
| Finer energy and split grid | 17.1463 | −0.082 |
| Floor safety margin 5% instead of 1% | 17.2467 | +0.018 |

Every difference is under 0.7% of the score and none wins on a clear majority
of runs, so the submitted policy was left unchanged. These seeds are the
development seeds, so this is not independent evidence either way.

Raw development, tuning and holdout traces are losslessly compressed as
`.json.gz`. This report script reads compressed holdout data directly
when plain JSON is absent.
