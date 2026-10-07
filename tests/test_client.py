"""Ensure optional result reads cannot borrow the bid retry policy."""
from pathlib import Path
import sys
import unittest
from unittest.mock import Mock
import httpx

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'agent-template'))
from client import ArenaClient, ArenaClientError


class ResultReadTests(unittest.TestCase):
    def client(self, status):
        client = ArenaClient.__new__(ArenaClient)
        client.base_url = 'http://arena.invalid'
        client.token = None
        client.max_attempts = 5
        self.requests = []
        def respond(request):
            self.requests.append(request)
            return httpx.Response(status, json={'round':1}, headers={'retry-after':'1'})
        client._http = httpx.Client(transport=httpx.MockTransport(respond), trust_env=False)
        client._sleep_backoff = Mock()
        self.addCleanup(client.close)
        return client

    def test_failed_optional_read_never_sleeps_or_mutates_retry_policy(self):
        client = self.client(503)
        with self.assertRaises(ArenaClientError):
            client.get_result(1, attempts=1)
        self.assertEqual(len(self.requests), 1)
        client._sleep_backoff.assert_not_called()
        self.assertEqual(client.max_attempts, 5)
        self.assertEqual(self.requests[0].extensions['timeout']['read'], .4)

    def test_successful_optional_read(self):
        client = self.client(200)
        self.assertEqual(client.get_result(1, attempts=1), {'round':1})
        self.assertEqual(client.max_attempts, 5)

if __name__ == '__main__':
    unittest.main()
