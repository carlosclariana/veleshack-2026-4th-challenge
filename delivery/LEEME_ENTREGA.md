# Material de entrega: empieza aquí

Equipo Los Bocatones (Marc y Carlos), `TEAM_NAME=los-bocatones`. Nada se ha
publicado ni enviado al concurso todavía. Swarm Lab es el nombre del panel.

## Qué abrir

| Para qué | Archivo |
|---|---|
| Revisar cumplimiento de los dos PDF | REVISION_INSTRUCCIONES.md |
| Entender el proyecto y responder al jurado | EXPLICACION_Y_DEMO.md |
| Presentar | LosBocatones_VelesHack.pptx (o el .pdf) |
| Ensayar el pitch | PRESENTACION_3_DIAPOSITIVAS.md |
| Probar el panel sin Docker | PANEL_PREVIEW.html (abrir en Chrome o Edge) |
| Preparar la inscripción | FORMULARIO_HACKATON.md |

## Presentación

`LosBocatones_VelesHack.pptx` sigue la plantilla de los organizadores diapositiva
a diapositiva (portada, GitHub repo, Summary, Highlights) con el diseño del panel
de la batería; no usa el fondo gráfico de la plantilla. Está en inglés, con notas
del ponente en español. Usa la fuente Bahnschrift, que viene con Windows; en otro
sistema abrid el PDF. Falta poner el usuario de GitHub en la diapositiva 2.

## Cómo actualizar el proyecto en Windows

1. En la ventana de la partida anterior, pulsad Ctrl+C.
2. En esa carpeta ejecutad `docker compose --profile agent down`.
3. Extraed este ZIP en una carpeta nueva. Conservad la versión anterior.
4. Copiad vuestro `.env` a la carpeta nueva (o usad `Copy-Item .env.example .env`).
5. Abrid PowerShell en la carpeta que contiene `docker-compose.yml`.
6. Ejecutad `docker compose --profile agent up --build`.
7. Abrid http://localhost:8080 y recargad con Ctrl+F5.

No hace falta subir el proyecto a GitHub. No ejecutéis dos copias a la vez en
el puerto 8080. `PANEL_PREVIEW.html` es el mismo panel abierto sobre la prueba
archivada; para ver una partida actual se utiliza localhost con Docker.

## Estado real de verificación

- Política del agente sin cambios respecto a los benchmarks archivados.
- Motor de puntuación y bots sin cambios; se modifica el HTML del panel local.
- Siete pruebas unitarias pasan, incluidas caducidad y renovación de token.
- Ocho pruebas DOM del panel pasan, incluida exportación, error de conexión y nombres seguros.
- Ruta del panel y estado público comprobados con el cliente de pruebas de FastAPI.
- Las ocho pruebas oficiales y la prueba HTTP anterior se conservan; no se
  presentan como ejecutadas de nuevo tras cambios que solo afectan al panel y documentación.
- Panel revisado en Chrome el 7 de octubre de 2026 a tamaño de escritorio: partida
  en directo, prueba archivada y las tres pestañas, sin errores de consola. No se
  ha revisado en móvil ni en el proyector de la sala.
- Imagen `swarm-agent:submission` construida con Docker y comprobada con la suite
  oficial el 7 de octubre de 2026: 8/8, 14/14 rondas elegibles, 19 fallos
  inyectados, cero sanciones (`results/image-conformance.json`).
- La misma suite con `--team los-bocatones`: 8/8, 14/14 rondas elegibles, 21
  fallos inyectados, cero sanciones (`results/team-image-conformance.json`).
- **Pendiente**: repetir esa construcción desde un clon limpio del fork. Las
  pruebas anteriores usaron esta carpeta de trabajo.

## Qué falta para adaptar el formulario

El enlace del fork público y una URL o captura de los campos del formulario.
No se han inventado límites de caracteres ni enlaces públicos. El borrador está
listo para copiar una vez revisado; pulsar “Enviar” requerirá autorización expresa.
