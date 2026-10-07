# Battery-aware resource bidding

## What changes

The submitted agent maximises estimated utility per active-plus-recharge round,
using a small deterministic search over energy bids and compute/security splits.
The official scoring engine and three baseline policies are unchanged. The
local dashboard HTML is redesigned for demonstration only.

For candidate allocation `x`, the approximate objective in each sampled market is:

```
u = (sum_k w_k sqrt(x_k))^2 × service-floor penalties
drain = a × x_energy + 0.004
objective = u / (1 + (drain + max(0, drain - battery)) / 0.22)
```

`a` is estimated from our observed `battery_drawn` and energy allocations, with
`0.30 × (1 + mobility)` as the cold-start fallback. The idle drain, recharge
rate and fallback coefficient are public scenario constants, not hidden state.
This is a heuristic average-reward approximation, not a proof of optimality or
an exact finite-horizon dynamic programme. It deliberately allows useful energy
consumption and occasional recharge rounds instead of treating zero idle rounds
as the objective.

## Market estimate and uncertainty

For a settled round, Kelly allocation gives other bids exactly (up to rounding):

```
other_bid = my_bid × (capacity / my_allocation - 1)
```

Historical samples are scaled by the ratio of current to past wallet. All nodes
receive the same wallet each round. We use the last five observations and a
full-field cold-start prior based on the public three-bot setup and shared
profile. This prior is approximate, not a reconstruction of hidden bids. Zero
bids/allocations cannot be inverted; those observations fall back to lagged
market signals. The method does not use seed, tokens, identities, privileged
endpoints, future capacities or simulated opponent battery states.

There is a relevant discrepancy in the upstream documentation: a settled
result's `prices` field is the *previous* clearing price, while `capacities`
is the current capacity. Multiplying them does not reconstruct that result's
actual total bids. Our allocation-based inversion avoids mixing rounds.

## Search and risk

We consider 16 energy bid fractions, 17 uniform compute/security splits, and
additional breakpoints that satisfy either service floor against each market
sample with a 1% margin. Each candidate is scored against every sampled market,
including the actual half/quarter penalties. We spend the full wallet and clamp
roundoff. The search takes about 3 ms per decision in the local benchmark;
this is a measurement of this machine, not a deployment guarantee.

No random training, model download, additional package or external API is needed.
`STRATEGY_MODE` selects `adaptive` (default), `template`, `taper`, `efficient`
or `conservative` for experiments. The last two increase charge cost by 1.5×
and 2× and performed worse on development seeds. The chosen default was frozen
before the separate holdout evaluation.

## Integration repairs

The original agent could discard the previous result when advancing to a new
round. We now attempt one result read before deciding, only when the published
bidding window has more than 1.5 seconds remaining. That request has a 400 ms
HTTP timeout and one attempt with no backoff. Because HTTPX timeouts are per
network phase, this is a bound per phase rather than an absolute wall-clock
deadline. We also retrieve after the bid as a fallback. We stop repeatedly
polling results for an unsettled current round. Missing observations remain
valid inputs, and the agent always prioritises a bid when time is short.

The client's optional attempt count is local to the request. It no longer
mutates the shared retry configuration while the heartbeat thread may be using
it. There is no pointless sleep after a final failed attempt.

We also wait for the final round to be reported settled instead of exiting after
a fixed three seconds, which is shorter than a graded four-second round. This
handles a final round spent resting as well. Registration, heartbeats, budget
sanitisation and exponential retries retain the supplied protocol.

## Measurement limits

See `RESULTS.md` for measured outcomes. The in-process benchmark invokes the
unmodified official Arena but supplies complete history and synchronous bids:
it measures strategy, not HTTP reliability. The live HTTP match tests the real
loop with the three bots, latency and injected failures. The official
conformance suite is also run separately. Its lease check does not actually
force expiry, so passing it is not proof of recovery from every possible outage.

The organisers' reference agent is not provided. We cannot compute the official
25-point strategy score or guarantee a competition placing. Opponent responses
and resting patterns change between paired strategy runs; that is part of the
causal effect of changing our strategy, not an identical fixed market.
