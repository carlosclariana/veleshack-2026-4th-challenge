"""Explicit lease expiry and HTTP token-renewal regressions."""
from pathlib import Path
import sys
import time
import unittest
import httpx
sys.path[:0] = [str(Path(__file__).resolve().parents[1]), str(Path(__file__).resolve().parents[1]/'agent-template')]
from arena.config import ScenarioConfig
from arena.state import Arena
from client import ArenaClient

class LifecycleTests(unittest.TestCase):
    def test_expired_lease_reactivates_and_preserves_score(self):
        arena=Arena(ScenarioConfig())
        node=arena.register('lease-test')
        node.score=7.25
        original_id=node.node_id
        node.last_heartbeat=time.time()-100
        arena.expire_leases()
        self.assertFalse(node.active)
        # Upstream retains the token on lease expiry; heartbeat is sufficient.
        arena.heartbeat(node)
        self.assertTrue(node.active)
        self.assertEqual(node.score,7.25)
        # Explicit re-registration is also supported and retains identity.
        old_token=node.token
        resumed=arena.register('lease-test')
        self.assertEqual(resumed.node_id,original_id)
        self.assertEqual(resumed.score,7.25)
        self.assertNotEqual(resumed.token,old_token)

    def test_client_reregisters_after_401_and_retries_original_request(self):
        calls=[]
        def respond(request):
            calls.append((request.method,request.url.path))
            if request.url.path=='/v1/register':
                return httpx.Response(200,json={'token':'test-renewed','node_id':'node-test','profile':{},'arena':{}})
            if request.headers.get('Authorization')!='Bearer test-renewed':
                return httpx.Response(401,json={'detail':'expired token'})
            return httpx.Response(200,json={'round':3,'budget':1,'you':{'battery':.5}})
        client=ArenaClient.__new__(ArenaClient)
        client.base_url='http://arena.invalid';client.team='test';client.token='test-old'
        client.node_id='node-test';client.profile={};client.arena_info={};client.max_attempts=5
        client._http=httpx.Client(transport=httpx.MockTransport(respond),trust_env=False)
        try:
            self.assertEqual(client.get_round()['round'],3)
            self.assertEqual(calls,[('GET','/v1/round'),('POST','/v1/register'),('GET','/v1/round')])
            self.assertEqual(client.profile['features']['battery'],.5)
        finally:client.close()

if __name__=='__main__':unittest.main()
