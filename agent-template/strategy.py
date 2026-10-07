"""Battery-aware, risk-aware bidding using only public observations.

No seed, opponent identities or private arena state are used. See STRATEGY.md.
Copyright 2026 The CoGNETs Consortium; modifications by the submitting team.
SPDX-License-Identifier: Apache-2.0
"""
from __future__ import annotations

import math
import os
from statistics import median

RESOURCES = ("compute", "energy", "security")


def market_samples(budget, prices, capacities, profile, history):
    """Invert settled allocations, NOT lagged prices in a result record.

    b*(C/x-1) is the other bidders' total for that same round. Normalise
    by the historical wallet (all nodes receive the same wallet each round).
    Several samples preserve uncertainty about opponents resting.
    """
    samples = []
    for row in history[-5:]:
        spend = float(row.get("spend", 0))
        if spend <= 0:
            continue
        values = []
        for k in RESOURCES:
            b = float(row.get("bid", {}).get(k, 0))
            x = float(row.get("allocation", {}).get(k, 0))
            c = float(row.get("capacities", {}).get(k, 1))
            if b > 1e-7 and x > 1e-7:
                values.append(max(0.0, b * (c / x - 1)) / spend * budget)
            else:
                values.append(max(0.03, float(prices.get(k, 1)) * c) * 0.75)
        samples.append(values)
    w = profile.get("weights", {})
    prior = [budget * (2 * float(w.get(k, 1/3)) + 1/3) for k in RESOURCES]
    if not samples:
        return [prior]
    # A full-field prior prevents repeated lucky quiet rounds from teaching
    # the agent to underfund its floors when resting opponents return.
    return samples + [prior]


def energy_coefficient(profile, history):
    observed = []
    for row in history[-10:]:
        x = float(row.get("allocation", {}).get("energy", 0))
        if x > 0.002 and "battery_drawn" in row:
            observed.append(max(0.01, (float(row["battery_drawn"]) - 0.004) / x))
    return median(observed) if observed else 0.30 * (1 + float(profile.get("features", {}).get("mobility", 0)))


def taper_bid(budget, prices, capacities, profile, history):
    """Simple battery ablation: no optimisation or floor insurance."""
    w = profile.get("weights", {})
    bid = {k: budget * float(w.get(k, 1/3)) for k in RESOURCES}
    battery = float(profile.get("features", {}).get("battery", 1))
    freed = bid["energy"] * (1 - max(0, min(1, battery)) ** 2)
    bid["energy"] -= freed
    denom = max(1e-9, bid["compute"] + bid["security"])
    for k in ("compute", "security"):
        bid[k] += freed * bid[k] / denom
    return bid


def decide_bid(budget, prices, capacities, profile, history):
    """Search a small deterministic grid with exact service-floor breakpoints.

    The objective estimates utility per active+recharge round and penalises
    charge wasted beyond battery exhaustion. Floors are scored
    explicitly for each observed market, not assumed guaranteed.
    """
    if not math.isfinite(budget) or budget <= 0:
        return {k: 0.0 for k in RESOURCES}
    mode = os.environ.get("STRATEGY_MODE", "adaptive")
    if mode == "taper":
        return taper_bid(budget, prices, capacities, profile, history)
    w = [float(profile.get("weights", {}).get(k, 1/3)) for k in RESOURCES]
    if mode == "template":
        total = sum(w) or 1.0
        return {k: budget * v / total for k, v in zip(RESOURCES, w)}
    caps = [max(1e-8, float(capacities.get(k, 1))) for k in RESOURCES]
    markets = market_samples(budget, prices, capacities, profile, history)
    battery = max(0, float(profile.get("features", {}).get("battery", 1)))
    coefficient = energy_coefficient(profile, history)
    floors = [float(profile.get("q_min", 0)), float(profile.get("s_min", 0))]
    recharge = 0.22 / {"efficient": 1.5, "conservative": 2.0}.get(mode, 1.0)
    # Public recharge rate, with experimental opportunity-cost multipliers.
    best_value, best = -1.0, [budget/2, 0, budget/2]
    # Log-spaced energy bids capture efficient tiny shares as well as bursts.
    energy_fractions = [0, .0001, .0004, .001, .0025, .005, .01, .02, .035,
                        .055, .08, .12, .18, .26, .38, .52]
    for fraction in energy_fractions:
        e = fraction * budget
        rest = budget - e
        candidates = {rest * i / 16 for i in range(17)}
        # Exact boundaries are essential: a grid alone can miss a cheap way
        # to avoid losing half the utility. 1% margin covers rounding.
        for market in markets:
            for j, floor in ((0, floors[0]), (2, floors[1])):
                if 0 < floor < caps[j]:
                    need = market[j] * floor / (caps[j] - floor) * 1.01
                    candidate = need if j == 0 else rest - need
                    if 0 <= candidate <= rest:
                        candidates.add(candidate)
        for c in candidates:
            bid = [c, e, rest-c]
            value = 0.0
            for market in markets:
                x = [caps[j] * bid[j] / max(1e-12, bid[j] + market[j]) for j in range(3)]
                u = sum(w[j] * math.sqrt(x[j]) for j in range(3)) ** 2
                if x[0] + 1e-9 < floors[0]:
                    u *= .5
                if x[2] + 1e-9 < floors[1]:
                    u *= .5
                drain = coefficient * x[1] + .004
                # Charge has an opportunity cost: resting buys .22 charge
                # but forfeits a scoring round. Penalise waste beyond zero.
                waste = max(0.0, drain - battery)
                penalty = 1 + (drain + waste) / recharge
                value += u / penalty
            value /= len(markets)
            if value > best_value:
                best_value, best = value, bid
    scale = budget / max(budget, sum(best))
    return {k: max(0.0, v * scale) for k, v in zip(RESOURCES, best)}
