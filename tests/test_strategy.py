"""Regression tests for budget safety, market inversion and public inputs."""
import copy
import math
from pathlib import Path
import random
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'agent-template'))
from strategy import decide_bid, market_samples


class StrategyTests(unittest.TestCase):
    def test_allocation_inversion_ignores_lagged_prices(self):
        row = {'spend':1, 'bid':dict.fromkeys(('compute','energy','security'),.2),
               'allocation':dict.fromkeys(('compute','energy','security'),.25),
               'capacities':dict.fromkeys(('compute','energy','security'),1),
               'prices':dict.fromkeys(('compute','energy','security'),99)}
        estimates = market_samples(2, {}, {}, {}, [row])[0]
        for value in estimates:
            self.assertAlmostEqual(value, 1.2)

    def test_random_public_profiles_produce_legal_bids_without_mutation(self):
        rng = random.Random(413)
        for _ in range(150):
            budget = rng.uniform(.01,2)
            weights = [rng.random() for _ in range(3)]
            weights = [w/sum(weights) for w in weights]
            profile = {'weights':dict(zip(('compute','energy','security'),weights)),
                       'features':{'battery':rng.uniform(.051,1),'mobility':rng.random()},
                       'q_min':rng.uniform(0,.8), 's_min':rng.uniform(0,.8)}
            original = copy.deepcopy(profile)
            caps = {k:rng.uniform(.05,2) for k in profile['weights']}
            result = decide_bid(budget, {}, caps, profile, [])
            self.assertEqual(profile, original)
            self.assertEqual(set(result), set(profile['weights']))
            self.assertTrue(all(math.isfinite(x) and x >= 0 for x in result.values()))
            self.assertLessEqual(sum(result.values()), budget + 1e-10)
            self.assertAlmostEqual(sum(result.values()), budget)

    def test_zero_budget(self):
        self.assertEqual(sum(decide_bid(0, {}, {}, {}, []).values()), 0)


if __name__ == '__main__':
    unittest.main()
