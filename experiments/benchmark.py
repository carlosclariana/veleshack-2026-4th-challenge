"""Paired local strategy experiments using the UNMODIFIED official Arena.

This is not the organisers' hidden reference or a network resilience test.
Run: python experiments/benchmark.py --count 40 --start 1000
"""
from __future__ import annotations
import argparse
import json
import os
from pathlib import Path
import statistics
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT), str(ROOT / 'agent-template'), str(ROOT / 'baselines')]
from arena.config import ScenarioConfig
from arena.state import Arena
from bot import STRATEGIES
from strategy import decide_bid


def run(seed, team, mode, rounds=60):
    os.environ['STRATEGY_MODE'] = mode
    cfg = ScenarioConfig(seed=seed, total_rounds=rounds, round_seconds=1000)
    arena = Arena(cfg)
    ours = arena.register(team)
    bots = [(arena.register('bot-' + name), fn) for name, fn in STRATEGIES.items()]
    times = []
    for _ in range(rounds):
        rnd = arena.open_round()
        for node, fn in [(ours, decide_bid)] + bots:
            if not node.admissible(cfg.battery_cutoff, cfg.kappa_bar):
                continue
            begin = time.perf_counter()
            bid = fn(node.budget, rnd.prices, rnd.capacities, node.profile(), node.history)
            if node is ours:
                times.append(time.perf_counter() - begin)
            arena.submit(node, rnd.index, bid)
        arena.settle()
    return dict(seed=seed, team=team, mode=mode, score=ours.score,
                idle=ours.rounds_idle, floors=ours.floor_violations,
                missed=ours.rounds_missed, compromise=ours.compromise,
                best_bot=max(n.score for n, _ in bots),
                other_scores=sum(n.score for n, _ in bots),
                lsw=sum(r.lsw for r in arena.rounds),
                mean_ms=statistics.mean(times)*1000,
                trace=[{'round':r.index, 'lsw':r.lsw,
                        'nodes':{n.team:r.results.get(n.node_id, {}) for n in arena.nodes.values()}}
                       for r in arena.rounds])


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--count', type=int, default=20)
    p.add_argument('--start', type=int, default=1000)
    p.add_argument('--team', default='development-team')
    p.add_argument('--rounds', type=int, default=60)
    p.add_argument('--modes', default='template,taper,adaptive')
    p.add_argument('--output', default='results/benchmark.json')
    args = p.parse_args()
    rows = []
    for seed in range(args.start, args.start + args.count):
        for mode in args.modes.split(','):
            rows.append(run(seed, args.team, mode, args.rounds))
        if (seed-args.start+1) % 5 == 0:
            print(f'{seed-args.start+1}/{args.count} seeds complete', flush=True)
    summary = {}
    for mode in args.modes.split(','):
        group = [r for r in rows if r['mode'] == mode]
        summary[mode] = {k:statistics.mean(r[k] for r in group)
                        for k in ('score','idle','floors','missed','compromise','best_bot','other_scores','lsw','mean_ms')}
        summary[mode]['wins'] = sum(r['score'] > r['best_bot'] for r in group)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps({'settings':vars(args), 'summary':summary, 'runs':rows}, indent=2)+'\n')
    print(json.dumps(summary, indent=2))

if __name__ == '__main__':
    main()
