# Function Calling vs. ReAct: traces de ejemplo

Oct 5, 2026 · @Eduardo Ramirez

## Cuándo usar cada estrategia

Por ejemplo, en un asistente de servicio al cliente con consultas estructuradas, como el estado de un pedido o la cancelación de una suscripción, FC es la opción más adecuada: el agente reconoce la intención del usuario, invoca la función del CRM y devuelve el resultado. Por otra parte, si ese mismo asistente debe manejar quejas abiertas, donde necesita analizar el problema, determinar la causa y consultar varias fuentes, ReAct permite llevar a cabo un mejor proceso de razonamiento.

## Ejemplo 1: Function Calling (estado de un pedido)

En el primer ejemplo, un usuario pregunta dónde viene su pedido. Como es una consulta estructurada, el asistente usa FC: al LLM se le envían, junto con el mensaje, las definiciones de las funciones disponibles, cada una con su nombre, sus parámetros y una breve descripción. El LLM reconoce que la intención del usuario corresponde a `consultar_pedido`, extrae el número de pedido del mensaje y devuelve la llamada en formato JSON. El programa ejecuta esa función en el CRM y le entrega el resultado al LLM, que lo convierte en una respuesta clara para el usuario. Todo ocurre en un solo paso y sin razonamiento intermedio visible.

```text
FUNCIONES DISPONIBLES (se envían al LLM junto con el mensaje)
    consultar_pedido(id_pedido: texto)
        Devuelve el estado, la paquetería y la fecha estimada de entrega.
    cancelar_suscripcion(id_cliente: texto)
        Cancela la suscripción activa del cliente.

MENSAJE DEL USUARIO
    "Hola, ¿me dicen dónde viene mi pedido 48213?"

PASO 1: EL LLM IDENTIFICA LA INTENCIÓN Y ELIGE LA FUNCIÓN
    Llamada a función:
        {
          "nombre": "consultar_pedido",
          "argumentos": { "id_pedido": "48213" }
        }

PASO 2: EL PROGRAMA EJECUTA LA FUNCIÓN EN EL CRM
    Resultado:
        {
          "estado": "en tránsito",
          "paqueteria": "Envíos del Norte",
          "entrega_estimada": "2026-09-25"
        }

PASO 3: EL LLM REDACTA LA RESPUESTA
    Respuesta final:
        Tu pedido 48213 va en camino con Envíos del Norte y la entrega
        estimada es el viernes 25 de septiembre.
```

## Ejemplo 2: ReAct (queja por cobro duplicado)

En el segundo ejemplo, un usuario se queja de que le cobraron dos veces su suscripción. Aquí no basta con invocar una función: el asistente tiene que confirmar el problema, averiguar la causa y decidir qué solución corresponde, por lo que usa ReAct. En cada iteración, el LLM escribe un pensamiento en el que razona sobre lo que sabe hasta el momento, elige una acción y recibe una observación que orienta el siguiente paso. Así, primero revisa los pagos del cliente, luego el historial de su cuenta, después consulta la base de conocimiento para saber si se trata de un error conocido y, al final, solicita el reembolso antes de responder con la causa del problema y la solución.

```text
HERRAMIENTAS DISPONIBLES
    consultar_pagos(id_cliente, mes)
    consultar_historial_cuenta(id_cliente)
    buscar_base_conocimiento(consulta)
    solicitar_reembolso(id_pago, monto, motivo)

MENSAJE DEL USUARIO (cliente C-1027)
    "Me cobraron dos veces la suscripción este mes. Esto es inaceptable,
    quiero una solución."

ITERACIÓN 1
    Pensamiento:  El cliente reporta un doble cobro. Primero verifico sus
                  pagos de septiembre para confirmarlo.
    Acción:       consultar_pagos(id_cliente = "C-1027", mes = "septiembre 2026")
    Observación:  P-88310   1 sep   $199 MXN   Suscripción Premium   tarjeta ...4411
                  P-88342   3 sep   $199 MXN   Suscripción Premium   tarjeta ...8830

ITERACIÓN 2
    Pensamiento:  Hay dos cargos por el mismo periodo, con tarjetas
                  distintas. Reviso el historial de la cuenta para
                  entender por qué.
    Acción:       consultar_historial_cuenta(id_cliente = "C-1027")
    Observación:  2 sep: el cliente cambió su método de pago a la tarjeta ...8830
                  3 sep: el sistema cobró la suscripción con el nuevo método

ITERACIÓN 3
    Pensamiento:  Al cambiar la tarjeta, el sistema parece haber cobrado
                  de nuevo un periodo ya pagado. Busco si es un error
                  conocido y qué indica la política.
    Acción:       buscar_base_conocimiento("cobro duplicado al cambiar método de pago")
    Observación:  "Error conocido #312: al actualizar el método de pago, el
                  sistema puede cobrar de nuevo el periodo en curso. Procede
                  el reembolso completo del segundo cargo; se refleja en 5 a
                  10 días hábiles."

ITERACIÓN 4
    Pensamiento:  El caso coincide con el error #312. Procede reembolsar
                  el segundo cargo.
    Acción:       solicitar_reembolso(id_pago = "P-88342", monto = 199,
                                      motivo = "Cargo duplicado, error #312")
    Observación:  "Reembolso R-5521 creado. Se reflejará en 5 a 10 días hábiles."

ITERACIÓN 5
    Pensamiento:  Ya confirmé el problema, identifiqué la causa y generé el
                  reembolso. Puedo responder al cliente.
    Respuesta final:
        Tienes razón, se te cobró dos veces la suscripción de septiembre.
        Ocurrió por un error de nuestro sistema al actualizar tu método de
        pago el 2 de septiembre. Ya generamos el reembolso del segundo
        cargo ($199 MXN, folio R-5521), que verás reflejado en 5 a 10 días
        hábiles. Lamentamos la molestia.
```

## Diferencias clave

FC resuelve en un solo paso lo que ya está estructurado; ReAct encadena varios pasos cuando el agente tiene que averiguar qué hacer.

| Aspecto | Function Calling | ReAct |
| --- | --- | --- |
| Pasos | Uno: la intención se traduce directamente en una llamada | Varios: el agente no sabe de antemano cuántas consultas necesitará |
| Razonamiento | Implícito, no se muestra | Explícito: un *Pensamiento* antes de cada acción |
| Formato de la acción | JSON con argumentos definidos por un esquema, fácil de validar | Acción elegida tras razonar sobre las observaciones previas |
| Papel de las observaciones | El resultado se usa para redactar la respuesta | Cada observación cambia el siguiente paso (dos tarjetas distintas llevan a revisar el historial) |
| Caso ideal | Consultas estructuradas: estado de pedido, cancelación | Quejas abiertas: analizar, encontrar la causa, consultar varias fuentes |

En la práctica no son excluyentes: muchos agentes ReAct usan function calling como mecanismo para invocar sus herramientas; lo que distingue a ReAct es el ciclo de razonamiento explícito alrededor de esas llamadas.
