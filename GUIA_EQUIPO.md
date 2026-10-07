# Guía del equipo: de esta entrega al concurso

## 1. Datos que faltan

- Equipo: Los Bocatones (Marc y Carlos). `TEAM_NAME=los-bocatones`, ya puesto en
  `.env` y en README.md. Usad siempre ese nombre exacto: decide el dispositivo.
- Presentación lista en `delivery/LosBocatones_VelesHack.pptx`; falta poner el usuario de GitHub en la diapositiva 2.
- Falta el fork público en GitHub y el envío en Taikai.
- Confirmad la fecha límite con los organizadores.
- El formulario está preparado como borrador en `delivery/FORMULARIO_HACKATON.md`.

El nombre y la semilla influyen en el dispositivo. Las cifras de 50 semillas usan
`development-team`; las de `los-bocatones` están en `results/team-*.json`.

## 2. Arranque con Docker Desktop

Desde la carpeta del proyecto (en Windows podéis usar PowerShell):

```powershell
Copy-Item .env.example .env
```

Comprobad que `.env` dice `TEAM_NAME=los-bocatones`. No subáis `.env`.

```sh
docker compose up -d --build arena bot-naive-max bot-even-split bot-proportional
docker compose --profile agent up --build agent
```

Abrid http://localhost:8080 para ver el marcador. Para una prueba más limpia,
arrancad todos los servicios juntos: `docker compose --profile agent up --build`.
Para reiniciar: `docker compose --profile agent down -v`, después arrancad otra vez.
El simulador empieza tras unos segundos: no dediquéis minutos a arrancar el agente.

## 3. Pruebas antes de entregar

Con Python 3.12, desde la raíz:

```sh
python -m pip install -e .
python -m unittest discover -s tests -p 'test_*.py' -v
python tests/conformance.py --team NOMBRE_DEFINITIVO --json results/team-check.json
python experiments/benchmark.py --team NOMBRE_DEFINITIVO --start 12000 --count 20 --output results/team-benchmark.json
python experiments/live_match.py --team NOMBRE_DEFINITIVO --output results/team-live.json
```

El último comando dura unos cuatro minutos y usa el escenario graded real.
Con Docker, probad además el entregable exacto:

```sh
docker build -t swarm-agent:submission agent-template
python tests/conformance.py --image swarm-agent:submission --team NOMBRE_DEFINITIVO
```

El contexto de construcción es **agent-template**, no la raíz. El 7 de octubre
de 2026 la imagen se construyó en Windows y pasó las ocho pruebas con el equipo
de prueba (`results/image-conformance.json`). Repetidlo con vuestro nombre
definitivo, porque el nombre cambia el perfil del dispositivo.

## 4. Publicación futura (no autorizada)

La rama de trabajo se llama `feat/battery-aware-agent`. Solo cuando se autorice la publicación, subidla a vuestro
fork y dejad la versión final en la rama que vayan a revisar los jueces.
GitHub Actions ejecuta pruebas nativas y del contenedor al subir el código;
comprobad que el resultado es verde. El ZIP contiene el proyecto, sin entorno
virtual, secretos ni archivos temporales.

## 5. Presentación y envío

- Utilizad `delivery/PRESENTACION_3_DIAPOSITIVAS.md` como guion y mostrad el gráfico de results/benchmark.png.
- Mostrad el marcador en una partida real; indicad claramente la semilla.
- Añadid al formulario de Taikai el enlace público del fork, TEAM_NAME, ruta
  `agent-template/Dockerfile`, comando de construcción y miembros del equipo.
- Incluid README con el resumen de estrategia y la presentación `delivery/LosBocatones_VelesHack.pptx`.
- Adjuntad resultados reales, sin presentar la mejora local como una nota oficial.

## Actualizar desde la primera versión sin perder vuestra carpeta

1. Detened la partida anterior con Ctrl+C en su PowerShell.
2. Ejecutad `docker compose --profile agent down` en esa carpeta.
3. Extraed el nuevo ZIP en **otra carpeta** y conservad la versión anterior.
4. Copiad vuestro `.env` local a la carpeta nueva, o creadlo desde `.env.example`.
5. Desde la carpeta nueva: `docker compose --profile agent up --build`.
6. Abrid localhost:8080 y recargad con Ctrl+F5 para ver el panel nuevo.

Para graded en PowerShell, antes de arrancar:

```powershell
$env:SCENARIO = "graded"
docker compose --profile agent up --build
```

Al terminar, `Remove-Item Env:SCENARIO` vuelve al valor del archivo `.env`.
No mezclar a la vez dos versiones de Compose: usan los mismos nombres y puerto.
