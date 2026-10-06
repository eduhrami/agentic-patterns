# Agente de precios: traces de ejemplo

Oct 5, 2026 · @Eduardo Ramirez

## Introducción

En el siguiente ejemplo veremos el ciclo de ejecución de un agente que informa el precio de un producto en la divisa que indique el usuario; en este caso, en pesos mexicanos. El agente cuenta con dos herramientas, un motor de búsqueda y una calculadora, y recibe unas instrucciones del sistema que le indican qué herramientas tiene disponibles y en qué formato debe responder. En cada iteración, el programa del agente envía al LLM un prompt con el objetivo y las observaciones acumuladas, y el LLM responde con la siguiente acción a realizar. En la primera iteración, el LLM decide buscar el precio del producto en dólares; en la segunda, con ese precio ya en sus observaciones, busca el tipo de cambio del día; en la tercera, pide a la calculadora multiplicar el precio por el tipo de cambio; y en la cuarta, al contar con todos los datos, declara el objetivo logrado y redacta la respuesta final para el usuario.

El precio y el tipo de cambio son valores ilustrativos para la simulación.

## Trace 1: vista general del ciclo

Esta versión muestra solo las decisiones del LLM y las observaciones que regresan las herramientas.

```text
OBJETIVO: "¿Cuánto cuesta en pesos mexicanos la consola Nintendo Switch 2?"
HERRAMIENTAS: motor de búsqueda, calculadora
OBSERVACIONES: ninguna

ITERACIÓN 1
    El LLM analiza el objetivo y las observaciones.
        Acción:       usar la herramienta motor de búsqueda
        Entrada:      precio Nintendo Switch 2 en dólares
    Se ejecuta el motor de búsqueda.
        Observación:  "Nintendo Switch 2: 449.99 USD en la tienda oficial
                      de Estados Unidos"
    Observaciones: ["Nintendo Switch 2: 449.99 USD"]
    ¿Objetivo logrado? No. Se repite el ciclo.

ITERACIÓN 2
    El LLM analiza el objetivo y las observaciones.
        Acción:       usar la herramienta motor de búsqueda
        Entrada:      tipo de cambio dólar a peso mexicano hoy
    Se ejecuta el motor de búsqueda.
        Observación:  "1 USD = 18.40 MXN"
    Observaciones: ["Nintendo Switch 2: 449.99 USD", "1 USD = 18.40 MXN"]
    ¿Objetivo logrado? No. Se repite el ciclo.

ITERACIÓN 3
    El LLM analiza el objetivo y las observaciones.
        Acción:       usar la herramienta calculadora
        Entrada:      449.99 × 18.40
    Se ejecuta la calculadora.
        Observación:  8279.816
    Observaciones: ["Nintendo Switch 2: 449.99 USD", "1 USD = 18.40 MXN",
                    8279.816]
    ¿Objetivo logrado? No. Se repite el ciclo.

ITERACIÓN 4
    El LLM analiza el objetivo y las observaciones.
        Acción:       objetivo logrado
        Respuesta:    La Nintendo Switch 2 cuesta 449.99 dólares, que equivalen
                      a unos 8,279.82 pesos mexicanos al tipo de cambio de hoy
                      (18.40 pesos por dólar).
    ¿Objetivo logrado? Sí. Termina el ciclo.

RESPUESTA FINAL
    La Nintendo Switch 2 cuesta 449.99 dólares, que equivalen a unos
    8,279.82 pesos mexicanos al tipo de cambio de hoy.
```

## Trace 2: el ciclo con los prompts intermedios

Esta versión muestra, en cada iteración, el prompt exacto que recibe el LLM y la respuesta que devuelve.

```text
INSTRUCCIONES DEL SISTEMA (se envían al LLM en cada iteración)
    Eres un agente que informa el precio de cualquier producto en la
    divisa que solicite el usuario.
    Para lograrlo, busca el precio del producto; si está en una divisa
    distinta a la solicitada, busca el tipo de cambio entre ambas
    divisas y usa la calculadora para hacer la conversión.
    Herramientas disponibles:
        - motor de búsqueda: busca información en internet.
        - calculadora: evalúa operaciones aritméticas.
    En cada paso responde con una de estas dos opciones:
        Acción: <herramienta>        Entrada: <texto para la herramienta>
        Acción: objetivo logrado     Respuesta: <respuesta para el usuario>

OBJETIVO: "¿Cuánto cuesta en pesos mexicanos la consola Nintendo Switch 2?"
OBSERVACIONES: ninguna

ITERACIÓN 1
    Prompt al LLM:
        Objetivo: ¿Cuánto cuesta en pesos mexicanos la consola Nintendo Switch 2?
        Observaciones: ninguna
        ¿Cuál es tu siguiente acción?
    Respuesta del LLM:
        Acción:       motor de búsqueda
        Entrada:      precio Nintendo Switch 2 en dólares
    Se ejecuta el motor de búsqueda.
        Observación:  "Nintendo Switch 2: 449.99 USD en la tienda oficial
                      de Estados Unidos"
    ¿Objetivo logrado? No. Se repite el ciclo.

ITERACIÓN 2
    Prompt al LLM:
        Objetivo: ¿Cuánto cuesta en pesos mexicanos la consola Nintendo Switch 2?
        Observaciones:
            1. Nintendo Switch 2: 449.99 USD en la tienda oficial de Estados Unidos
        ¿Cuál es tu siguiente acción?
    Respuesta del LLM:
        Acción:       motor de búsqueda
        Entrada:      tipo de cambio dólar a peso mexicano hoy
    Se ejecuta el motor de búsqueda.
        Observación:  "1 USD = 18.40 MXN"
    ¿Objetivo logrado? No. Se repite el ciclo.

ITERACIÓN 3
    Prompt al LLM:
        Objetivo: ¿Cuánto cuesta en pesos mexicanos la consola Nintendo Switch 2?
        Observaciones:
            1. Nintendo Switch 2: 449.99 USD en la tienda oficial de Estados Unidos
            2. 1 USD = 18.40 MXN
        ¿Cuál es tu siguiente acción?
    Respuesta del LLM:
        Acción:       calculadora
        Entrada:      449.99 × 18.40
    Se ejecuta la calculadora.
        Observación:  8279.816
    ¿Objetivo logrado? No. Se repite el ciclo.

ITERACIÓN 4
    Prompt al LLM:
        Objetivo: ¿Cuánto cuesta en pesos mexicanos la consola Nintendo Switch 2?
        Observaciones:
            1. Nintendo Switch 2: 449.99 USD en la tienda oficial de Estados Unidos
            2. 1 USD = 18.40 MXN
            3. 8279.816
        ¿Cuál es tu siguiente acción?
    Respuesta del LLM:
        Acción:       objetivo logrado
        Respuesta:    La Nintendo Switch 2 cuesta 449.99 dólares, que equivalen
                      a unos 8,279.82 pesos mexicanos al tipo de cambio de hoy
                      (18.40 pesos por dólar).
    ¿Objetivo logrado? Sí. Termina el ciclo.

RESPUESTA FINAL
    La Nintendo Switch 2 cuesta 449.99 dólares, que equivalen a unos
    8,279.82 pesos mexicanos al tipo de cambio de hoy.
```

## Qué observar en los traces

- **La misma herramienta, dos propósitos.** El agente usa el motor de búsqueda dos veces: primero para el precio y después para el tipo de cambio.
- **Las instrucciones del sistema no cambian.** Le dicen al LLM qué herramientas tiene y en qué formato responder, para que el programa pueda leer su respuesta y ejecutar la herramienta indicada.
- **El prompt crece en cada iteración.** La lista de observaciones es lo único que el LLM "recuerda" de los pasos anteriores.
- **El LLM nunca ejecuta nada.** Solo responde con texto; el programa del agente lee "Acción: calculadora", llama a la herramienta y agrega el resultado al siguiente prompt.
- **El LLM también aporta criterio.** Redondea el resultado de la calculadora a dos decimales para presentarlo como una cantidad en pesos.
