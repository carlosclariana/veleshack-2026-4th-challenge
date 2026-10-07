"""Run a real HTTP graded match with all opponents and archive public results."""
import argparse
import json
import os
from pathlib import Path
import socket
import subprocess
import sys
import time
import httpx

ROOT = Path(__file__).resolve().parents[1]


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--team', default='development-team')
    p.add_argument('--seed', type=int, default=77123)
    p.add_argument('--output', default='results/live-match.json')
    args = p.parse_args()
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    url = f'http://127.0.0.1:{port}'
    env = {**os.environ, 'ARENA_SCENARIO':'graded','ARENA_SEED':str(args.seed),
           'ARENA_START_DELAY':'12','ARENA_URL':url, 'PYTHONPATH':str(ROOT),
           'PYTHONUNBUFFERED':'1','STRATEGY_MODE':'adaptive'}
    processes, handles = [], []
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    def launch(name, command, extras=None):
        handle = (output.parent / f'{name}.log').open('w')
        handles.append(handle)
        process = subprocess.Popen([sys.executable, *command], cwd=ROOT,
                                   env={**env, **(extras or {})},stdout=handle,stderr=subprocess.STDOUT)
        processes.append(process)
        return process
    try:
        arena = launch('live-arena',['-m','arena','--port',str(port)])
        with httpx.Client(timeout=5) as client:
            deadline = time.monotonic()+30
            while True:
                try:
                    if client.get(url+'/healthz').status_code == 200:
                        break
                except httpx.HTTPError:
                    pass
                if arena.poll() is not None or time.monotonic() > deadline:
                    raise RuntimeError('Arena failed to start; see live-arena.log')
                time.sleep(.2)
            agent = launch('live-agent',['agent-template/agent.py'],{'TEAM_NAME':args.team})
            # Wait for participant so every baseline starts on its device.
            deadline = time.monotonic()+30
            while not any(n['team']==args.team for n in client.get(url+'/v1/swarm').json()['nodes']):
                if time.monotonic()>deadline:
                    raise RuntimeError('Agent did not register')
                time.sleep(.2)
            for bot in ('naive-max','even-split','proportional'):
                launch('live-'+bot,['baselines/bot.py'],{'BOT':bot,'TEAM_NAME':'bot-'+bot})
            deadline = time.monotonic()+330
            previous = -1
            while time.monotonic()<deadline:
                status = client.get(url+'/v1/status').json()
                if status['round'] != previous and status['round']%10 == 0:
                    print(f"HTTP match round {status['round']}/60",flush=True)
                    previous=status['round']
                if status['finished']:
                    break
                if agent.poll() is not None:
                    raise RuntimeError(f'Agent exited before arena finished: {agent.returncode}')
                time.sleep(.5)
            else:
                raise RuntimeError('Match timed out')
            board=client.get(url+'/v1/leaderboard').json()
            try:
                code=agent.wait(timeout=12)
            except subprocess.TimeoutExpired:
                code=None
            result={'seed':args.seed,'team':args.team,'status':status,'leaderboard':board,
                    'agent_exit_code':code,'transport':'real HTTP; graded 60 x 4s, chaos enabled'}
            output.write_text(json.dumps(result,indent=2)+'\n')
            print(json.dumps(result,indent=2),flush=True)
    finally:
        for process in reversed(processes):
            if process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=8)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()
        for handle in handles:
            handle.close()

if __name__=='__main__':
    main()
