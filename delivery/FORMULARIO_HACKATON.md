# Borrador privado para la web del hackatón

**No enviado.** No se ha abierto ni modificado el formulario. Los campos siguientes
son textos propuestos, no una transcripción de campos verificados de Taikai.
Se necesita una captura o URL del formulario para adaptar límites y campos exactos.

## Nombre de proyecto propuesto

Swarm Lab — Battery-Aware Edge Agent

Nombre provisional; no cambia TEAM_NAME ni se presenta como aprobado por el equipo.

## Descripción corta en inglés

A lightweight edge agent that balances resource utility, service floors and
battery recharge costs. Tested against three baseline bots with reproducible
experiments and a transparent live dashboard.

## Descripción completa en inglés

Swarm Lab is a containerised Python agent for the CoGNETs Smart Edge Resource
Auctions challenge. It joins the supplied Swarm Arena through its REST API,
maintains membership through heartbeats and submits valid bids for compute,
energy and security under a fresh per-round budget.

Our strategy evaluates the value of a resource bundle together with the future
cost of battery recharge. It estimates competing bids from settled allocations,
accounts explicitly for service-floor penalties, and searches a compact set of
candidate bids. It does not use hidden seeds, external AI services or modified
scoring rules.

We compared alternatives on 15 development seeds, then evaluated the frozen
policy on 50 separate seeds. Its mean score increased from 13.39 to 17.23
(+28.7%) over the starting policy and exceeded all three baseline bots in all
50 simulations. These tests isolate strategy and do not include network faults.
The final archived HTTP test ran 60 graded rounds with 97 injected errors,
finished first, and missed no eligible rounds. The first HTTP test finished
second and is retained as evidence of an integration issue we then corrected.

Our dashboard distinguishes live data from archived evidence and explains
battery, eligible participation and resource floors. The repository includes
reproducible benchmarks, official conformance results, additional regression
tests and an analysis of the negative impact on neighbouring agents. We do not
claim an official score or a guarantee of winning: the private reference policy
and final grading seeds remain unavailable.

## Problem / motivation

Resource allocation and availability are coupled: an edge device that claims
energy too aggressively may drain its battery, leave the swarm temporarily and
lose future utility. Our solution makes that trade-off explicit in each bid.

## Innovation / contribution

Allocation-based market estimation that avoids mixing lagged prices with current
capacities; battery opportunity-cost scoring; explicit floor-boundary candidates;
measured ablations; resilient result collection; transparent demo and evidence.

## Technology

Python 3.12; Docker / Docker Compose; HTTPX REST client; supplied FastAPI arena;
standard-library decision policy; HTML/CSS/JavaScript local dashboard.
Matplotlib is used only for offline experiment figures.

## Build and run

Dockerfile: `agent-template/Dockerfile`

Build: `docker build -t swarm-agent:submission agent-template`

Configuration: `ARENA_URL`, `TEAM_NAME`; optional `LOG_LEVEL`, `STRATEGY_MODE`.
Local full demo: `docker compose --profile agent up --build` after creating `.env`.

## Datos pendientes (no inventar ni publicar todavía)

| Campo | Valor |
|---|---|
| Nombre definitivo del proyecto | Pendiente de confirmación |
| TEAM_NAME | `los-bocatones` |
| Integrantes | Marc y Carlos (Los Bocatones) |
| Ruta del Dockerfile | `agent-template/Dockerfile` |
| URL del repositorio | https://github.com/carlosclariana/veleshack-2026-4th-challenge |
| URL de demo | Localhost no es una demo pública |
| Presentación | `LosBocatones_VelesHack.pptx` / `.pdf` |

## Adjuntos preparados y orden recomendado

1. `LosBocatones_VelesHack.pptx` (o `.pdf`) — la presentación.
2. `RESULTS.md` y `results/live-match.json` — evidencias con contexto.
3. `results/benchmark.png` — gráfico de las 50 semillas.
4. `README.md` — instrucciones y resumen ≤300 palabras.

No adjuntar `.env`, entornos virtuales ni datos de cuentas. El ZIP privado es una
copia de trabajo; el formato final de entrega debe ajustarse al formulario real.
