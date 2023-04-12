Zorro y los Sabuesos AI
=========================


## Características de la aplicacion

### Principal objetivos

- Jugar con 2 jugadores en la misma PC
- Jugar contra un AI siendo este el zorro
- Algoritmo de Minimax y pseudo Random


## Estructura del protecto

El estilo y color se dividen en varios archivos en la carpeta css. Los íconos se ubican en la carpeta img. La carpeta js contiene todo el código de la aplicación. El código se divide en tres archivos:

### ai.js

Contiene todo el código de IA, como recursividad Minimax, evaluaciones, decisiones y otros códigos relacionados con algoritmos.


### board.js

En este archivo se almacenan las clases de tablero, zorro y sabueso, con operaciones de movimiento, indicador de victoria y código para mostrar el tablero.

### main.js

Este archivo es el principal de toda la aplicacion. Da instrucciones para generar el tablero, da la posibilidad de iniciar la AI y contiene una función global para las notificaciones.


### Funcion minimax

"minmax" utiliza una función de evaluación para asignar un valor a cada posición en el juego. Este valor indica la calidad de la posición para el jugador en ese momento. El objetivo de la técnica es maximizar la función de evaluación del jugador y minimizar la función de evaluación del oponente.

Para calcular la mejor jugada posible, la técnica "minmax" realiza una búsqueda en el árbol de posibles movimientos, evaluando cada nodo del árbol en función de las funciones de evaluación. La técnica "minmax" considera que el oponente intentará minimizar el valor de la función de evaluación del jugador, por lo que trata de maximizarla.


## Para

Universidad De Oriente 
Nucleo Anzoategui
Programa hecho para la materia de Taller de Inteligencia de Artificial perdiodo academico 2022-1

# Zorro-y-los-Sabuesos
