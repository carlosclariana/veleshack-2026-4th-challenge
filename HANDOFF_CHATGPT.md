# Handoff: publish this project and finish the submission

This folder is the complete, tested submission of team **Los Bocatones** (Marc and
Carlos) for VelesHack 2026, Challenge 4 (CoGNETs). The code, tests, results,
dashboard and presentation are done. What is left is publishing it.

Do not change `agent-template/`, `arena/`, `baselines/` or `tests/`: the archived
results were measured on exactly this code.

## Fixed facts

| Field | Value |
|---|---|
| TEAM_NAME | `los-bocatones` (exact; it decides the device profile) |
| Dockerfile | `agent-template/Dockerfile` |
| Build command | `docker build -t swarm-agent:submission agent-template` |
| Upstream repository | https://github.com/czavitsanos-iti/veleshack-2026-4th-challenge |
| Upstream commit this work is based on | `4a156a78e9b03ded7ac1273955c0cb314224ec70` |
| Presentation | `delivery/LosBocatones_VelesHack.pptx` and `.pdf` |

## What to do

1. **Create a public fork** of the upstream repository in the team's GitHub account.
2. **Put this folder's contents on top of the fork**, on the default branch, keeping
   the fork's git history. This ZIP has no `.git` folder. Do not commit `.env`,
   `.browser-tools/`, `node_modules/` or `__pycache__/` (already in `.gitignore`).
   Every file under `results/` that is in this ZIP must be committed; the
   documentation cites them.
3. **Replace the placeholder `USERNAME`** with the real GitHub user or organisation:
   - slide 2 of `delivery/LosBocatones_VelesHack.pptx`, then export the PDF again
     (or change the URL string in `scripts/build_presentation.js` and rebuild);
   - the "URL del repositorio" row in `delivery/FORMULARIO_HACKATON.md`.
4. **Commit and push.** Suggested message: `Battery-aware agent - Los Bocatones`.
5. **Check GitHub Actions** (`.github/workflows/validate.yml`). It must be green: it
   runs the unit tests, the conformance suite, builds the image from a clean
   checkout and runs the suite against the image. This clean-clone build is the
   one check that has not been done locally.
6. **Update the README status line** once Actions is green: the repository is
   published and the clean build passed.
7. **Tell the team the fork URL.** They submit on taikai.network themselves:
   repository link, TEAM_NAME, Dockerfile path and build command, and the
   presentation. Ready-to-paste texts are in `delivery/FORMULARIO_HACKATON.md`.

## What the organisers ask for, and where it is

- Public Git repository, a fork of theirs: steps 1 to 4 above.
- TEAM_NAME: `los-bocatones`, stated in `README.md`.
- Dockerfile path and build command: stated in `README.md`.
- README with a strategy write-up of 300 words or fewer and all members named:
  `README.md`, section "Strategy write-up" (300 words). Do not lengthen it.
- Presentation on the organisers' template: `delivery/LosBocatones_VelesHack.pptx`.
  It follows the template's four slides (title, GitHub repo, Summary, Highlights)
  with the team's own visual design, not the organisers' background artwork.

## Verified locally on 2026-10-07

- 7/7 Python unit tests; 8/8 dashboard DOM tests.
- `swarm-agent:submission` built with Docker; official conformance suite against
  the image with `--team los-bocatones`: 8/8 checks.
- 20-seed benchmark and a live graded HTTP match as `los-bocatones`; see `RESULTS.md`.

## Still open for the team

- Submission deadline: ask the organisers.
- Surnames in the README, if the organisers require full names.
