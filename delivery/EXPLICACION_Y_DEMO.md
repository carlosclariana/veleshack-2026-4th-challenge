# Cómo entender y demostrar el proyecto

## Explicación en 30 segundos

Nuestro programa representa un dispositivo que comparte cómputo, energía y
seguridad con otros tres. Cada ronda tiene un presupuesto y decide cómo
repartirlo. Comprar energía aumenta la utilidad, pero también gasta batería;
quedarse sin batería obliga a descansar. Buscamos más puntos durante toda la
partida, protegiendo los mínimos y valorando el coste de recargar.

## Recorrido completo de una ronda

1. El cliente se registra y recibe su identidad, perfil y configuración.
2. Un hilo de heartbeats mantiene activa su pertenencia a la arena.
3. El cliente consulta la ronda, el presupuesto, capacidades y batería actual.
4. Recupera resultados anteriores si hay tiempo; la oferta tiene prioridad.
5. `decide_bid` estima la competencia con lo que realmente obtuvo antes.
6. Compara ofertas: utilidad, penalizaciones por mínimos y coste de recarga.
7. Valida que cada importe sea finito, no negativo y que la suma no exceda el presupuesto.
8. Envía la oferta; el servidor hace el reparto Kelly y calcula la utilidad CES.
9. Se actualizan la batería, puntuación y datos que usarán las siguientes decisiones.

Ejemplo: si hay 1 unidad de cómputo, apostamos 2 y los rivales 6, obtenemos 0,25.
No estamos pagando euros: son unidades normalizadas del juego.

## Qué es de los organizadores y qué es nuestro

| Organizadores | Nuestra aportación |
|---|---|
| Arena, API, reglas, bots y plantilla | Política adaptativa de ofertas |
| Dockerfiles y cliente iniciales | Correcciones de historial y final de partida |
| Marcador inicial | Panel didáctico, exportación y modo presentación |
| Suite oficial | Experimentos reproducibles, pruebas adicionales y análisis |

## Demostración segura en cinco pasos

1. Abrir localhost:8080 con la arena y el agente ejecutándose.
2. Señalar equipo, escenario y número de ronda. Decir si es práctica o graded.
3. Empezar por la batería: es la cifra grande y el fondo de la pantalla, que se
   vacía y cambia de color con la carga. Después, puntos, participación elegible
   y mínimos, y la subasta de la ronda con capacidad y precio por recurso.
4. Entrar en “Cómo funciona” y explicar observación, decisión y oferta.
5. Entrar en “Evidencias”, explicar las condiciones de las pruebas y exportar el resultado.

“Ver prueba archivada” muestra un resultado guardado, claramente rotulado. Es un
respaldo para presentar sin depender del tiempo de una partida. No fingir que
es directo ni que ese resultado corresponde al TEAM_NAME definitivo.

## Preguntas del jurado

**¿Por qué no gastar siempre lo mismo?** Porque capacidades, competencia y batería
cambian; una decisión rentable ahora puede hacer perder una ronda después.

**¿Por qué no reducir energía a cero?** También tiene valor en la utilidad CES.
Minimizar descansos no siempre maximiza puntos; medimos variantes más conservadoras
que puntuaron peor.

**¿Es aprendizaje automático?** No: estimación con historial y búsqueda pequeña de
ofertas. Es interpretable y no depende de servicios externos.

**¿Por qué sois mejores?** En nuestras 50 semillas reservadas, la media subió 28,7%
respecto a plantilla. Es evidencia local, no prueba de optimalidad ni nota oficial.

**¿Mejoráis la red completa?** No en esos experimentos: los otros nodos puntúan
menos. Lo presentamos como una limitación del incentivo individual.

**¿Qué pasa si se corta la comunicación?** Reintentos con backoff, heartbeats y
renovación de registro si el token se rechaza. Las pérdidas de rondas todavía
pueden ocurrir; no afirmamos disponibilidad perfecta.

**¿Qué falta?** Publicar el fork y validar el contenedor desde un clon limpio.
