# Presentación: guion de las diapositivas

Equipo **Los Bocatones** (Marc y Carlos) · `TEAM_NAME=los-bocatones`

La presentación ya está hecha: `LosBocatones_VelesHack.pptx` (y `.pdf`). Sigue
la plantilla de los organizadores: portada, GitHub repo, Summary y Highlights.
Las diapositivas están en inglés; este guion, y las notas del ponente dentro del
archivo, están en español. El pitch dura tres minutos según la introducción del
reto. Falta sustituir `USERNAME` en la diapositiva 2 por vuestro usuario de GitHub.

Lo que sigue es el guion largo del que salió la presentación, por si queréis
ensayar con más detalle.

Las cifras de 50 semillas se midieron con el equipo de prueba `development-team`.
Con `los-bocatones` (`results/team-*.json`): +31,2 % sobre la plantilla en 20
semillas, por delante de los tres bots en las 20, y primera en la partida real
por HTTP con 18,24 puntos frente a 13,51 del mejor bot. Podéis usar estas en la
diapositiva 3 si preferís hablar de vuestro propio dispositivo.

## Diapositiva 1 · El problema

**Título:** Ganar energía hoy puede dejarte fuera mañana.

- Tres recursos, un presupuesto por ronda: cómputo, energía y seguridad.
- La energía que ganas se descuenta de tu propia batería. Sin batería, descansas
  una ronda y no puntúas.
- La plantilla ignora ese coste: descansa unas 18 de cada 60 rondas.

**Qué decir (1 min):** Somos Los Bocatones. Nuestro agente es un dispositivo que
compite cada ronda por cómputo, energía y seguridad. El problema no es repartir
bien una ronda, sino no quedarse sin batería para las siguientes. La plantilla
de partida no lo tiene en cuenta y pierde casi un tercio de la partida descansando.

## Diapositiva 2 · Nuestra estrategia

**Título:** La batería es un recurso económico más.

- Estimamos qué pujan los demás a partir de lo que realmente nos asignaron
  (Kelly invertido), sin mezclar precios atrasados con capacidades actuales.
- Probamos un conjunto pequeño de ofertas y puntuamos cada una: utilidad,
  penalización por mínimos y coste de recargar.
- Sin IA externa ni semillas ocultas. Unos 3 ms por decisión en nuestras pruebas.

**Qué decir (1 min):** Tratamos la batería como dinero. Antes de pujar,
reconstruimos la competencia a partir de nuestras asignaciones anteriores. Luego
comparamos unas pocas ofertas candidatas y elegimos la que da más utilidad por
ronda contando también las rondas que nos costará recargar. Protegemos los dos
mínimos, porque incumplir uno divide la ronda por dos.

## Diapositiva 3 · Qué medimos y qué salió mal

**Título:** +28,7 % sobre la plantilla, y lo que no funcionó.

- 50 semillas reservadas: 17,23 puntos frente a 13,39. Por delante de los tres
  bots en las 50.
- Prueba real por HTTP con fallos inyectados: primera, sin perder rondas
  elegibles. La primera vez quedó segunda: el historial llegaba incompleto y lo corregimos.
- Ahorrar más batería puntuó peor, y lo descartamos. Los otros nodos puntúan
  menos con nuestro agente: 44,24 → 38,41.

**Qué decir (1 min):** Fijamos la estrategia con 15 semillas y la medimos en 50
distintas: un 28,7 % más que la plantilla. En red real con errores 503 y 429
quedó primera, pero el primer intento quedó segundo y lo conservamos porque nos
enseñó un fallo de integración. Dos resultados negativos: ser más conservador
con la batería empeora la nota, y nuestra mejora sale en parte de los vecinos.
No tenemos el agente de referencia ni las semillas finales, así que no
prometemos nota.

## Para la demostración, si hay tiempo

Abrid http://localhost:8080 con la partida en marcha: la cifra grande y el fondo
son la batería. Si no hay red, abrid `PANEL_PREVIEW.html`, que muestra la prueba
archivada y lo indica en pantalla.
