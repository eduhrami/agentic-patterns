# Traces de ejemplo de los patrones de orquestación

**Curso de Prompt Engineering y Agentes** · Eduardo Ramirez · 5 de octubre de 2026

Este documento presenta un trace simulado para cada patrón de orquestación del documento *Patrones de orquestación multi-agente*. Cada escenario retoma el ejemplo que da la fuente del patrón (Anthropic, Microsoft o Google ADK). Los nombres de personas, empresas, folios y cifras son ficticios.

Después de cada trace hay una **lectura** con tres puntos: qué decide quién, qué muestra el trace sobre el patrón y cómo se aplica el contrapunto de Cognition (2025).

## Convenciones de notación

| Etiqueta | Significado |
| --- | --- |
| `PATRÓN` | Patrón que ilustra el trace |
| `AGENTES` | Agentes que participan, con sus herramientas o su función |
| `ESTADO COMPARTIDO` | Claves donde los agentes escriben sus resultados |
| `PASO`, `TURNO`, `ITERACIÓN`, `RONDA` | Unidad de avance según el patrón |
| `Recibe` | Contexto que entra al agente en ese paso |
| `Acción` / `Observación` | Llamada a una herramienta y su resultado |
| `GATE` | Verificación programática entre pasos |
| `HANDOFF` | Transferencia del control completo a otro agente |
| `PAUSA` / `REANUDA` | Punto de aprobación humana |

## Índice

| Sección | Patrón | Escenario | Fuente del ejemplo |
| --- | --- | --- | --- |
| 1 | Secuencial | Generación de un contrato | Microsoft |
| 2 | Routing por clasificación | Mensajes de servicio al cliente | Anthropic |
| 3 | Coordinator/dispatcher | Cargo no reconocido y falla del módem | Google ADK |
| 4 | Handoff | Internet sin servicio y bonificación | Microsoft |
| 5 | Sectioning y fan-out/gather | Revisión de un pull request | Google ADK |
| 6 | Voting | Detección de vulnerabilidades | Anthropic |
| 7 | Selección dinámica y agregación | Análisis de una acción ficticia | Microsoft |
| 8 | Orchestrator-workers | Incidentes de soporte por región | Anthropic |
| 9 | Hierarchical decomposition | Reporte trimestral de satisfacción | Google ADK |
| 10 | Magentic | Respuesta a un incidente de SRE | Microsoft |
| 11 | Evaluator-optimizer y maker-checker | Traducción literaria | Anthropic |
| 12 | Generator-critic | Validación de una consulta SQL | Google ADK |
| 13 | Iterative refinement | Optimización de una función | Google ADK |
| 14 | Group chat | Evaluación de un parque | Microsoft |
| 15 | Human-in-the-loop | Reembolso por cobro duplicado | Google ADK y Microsoft |
| 16 | Patrones compuestos | Falla de sincronización de una app | Google ADK |

---

## 1. Patrón secuencial

Un despacho jurídico genera contratos con cuatro agentes en un orden fijo. Entre el segundo y el tercer paso, una verificación programática comprueba que el borrador incluya todos los términos negociados antes de continuar.

```text
PATRÓN       Secuencial (el diseño define el orden)
AGENTES
    A1 selector_plantilla        herramientas: biblioteca_plantillas
    A2 personalizador_clausulas  herramientas: ninguna (modelo ajustado)
    A3 revisor_cumplimiento      herramientas: base_regulatoria
    A4 evaluador_riesgos         herramientas: base_responsabilidad, guardar_documento
ESTADO COMPARTIDO
    solicitud · plantilla · borrador · observaciones_cumplimiento · evaluacion_riesgo

ENTRADA
    Contrato de prestación de servicios de consultoría
    Partes: Consultora Delta, S.A. de C.V. (proveedor) e Industrias Ríos, S.A. de C.V. (cliente)
    Jurisdicción: Monterrey, Nuevo León
    Términos negociados: $480,000 MXN más IVA · 3 exhibiciones ·
                         límite de responsabilidad igual al monto · vigencia de 6 meses

PASO 1 · A1 selector_plantilla
    Recibe:      solicitud
    Acción:      buscar_plantilla(tipo = "servicios profesionales", jurisdicción = "Nuevo León")
    Observación: plantilla PSP-NL-07, versión 2026-03
    Escribe:     plantilla

PASO 2 · A2 personalizador_clausulas
    Recibe:      solicitud + plantilla
    Salida:      borrador v1
                 Cláusula tercera (pago): 3 exhibiciones de $160,000 MXN más IVA
                 Cláusula octava (responsabilidad): límite de $480,000 MXN
                 Cláusula décima (vigencia): 6 meses a partir de la firma
    Escribe:     borrador

GATE 1 · verificación programática
    Regla:       cada término negociado aparece en el borrador
    Resultado:   monto ✔ · exhibiciones ✔ · límite de responsabilidad ✔ · vigencia ✔
    Decisión:    continúa al paso 3

PASO 3 · A3 revisor_cumplimiento
    Recibe:      solicitud + borrador v1
    Acción:      consultar_base_regulatoria(materias = ["datos personales", "facturación"])
    Observación: 1. El servicio da acceso a datos de empleados del cliente y la plantilla
                    carece de una cláusula de tratamiento de datos personales.
                 2. El borrador omite que cada exhibición requiere comprobante fiscal (CFDI).
    Salida:      borrador v2 con las cláusulas decimocuarta y decimoquinta
    Escribe:     observaciones_cumplimiento, borrador

PASO 4 · A4 evaluador_riesgos
    Recibe:      solicitud + borrador v2 + observaciones_cumplimiento
    Acción:      consultar_base_responsabilidad(tipo = "consultoría", monto = 480000)
    Observación: calificación de riesgo media
                 La cláusula de terminación anticipada no define penalización.
    Salida:      recomendación: agregar una penalización equivalente a una exhibición
    Acción:      guardar_documento("PSP-NL-07_Delta-Rios_v2.docx")
    Escribe:     evaluacion_riesgo

RESULTADO
    Contrato propuesto v2 con dos observaciones de cumplimiento atendidas y una
    recomendación de riesgo pendiente de decisión del abogado responsable.
```

**Lectura del trace**

- **Quién decide:** el diseño fijó el orden de los cuatro agentes. Ningún agente eligió al siguiente.
- **Qué muestra:** si el gate hubiera encontrado un término faltante, la cadena se habría detenido antes de la revisión de cumplimiento, en lugar de propagar un borrador incompleto.
- **Contrapunto (Cognition):** A3 y A4 reciben la solicitud original además del borrador. Si A4 recibiera solo el borrador v2, desconocería que el límite de responsabilidad fue negociado y podría recomendar cambiarlo.

---

## 2. Routing por clasificación

Un clasificador con salida estructurada envía cada mensaje de servicio al cliente a una rama especializada. Cada rama tiene su propio prompt, herramientas y modelo. Una regla de código atiende los casos de baja confianza.

```text
PATRÓN       Routing por clasificación
CLASIFICADOR modelo pequeño con salida estructurada
             categorías: consulta_general | reembolso | soporte_tecnico
RAMAS
    consulta_general   prompt de preguntas frecuentes · base de conocimiento · modelo pequeño
    reembolso          prompt de políticas · consultar_pagos, solicitar_reembolso · modelo mediano
    soporte_tecnico    prompt de diagnóstico · consultar_dispositivo, buscar_incidentes · modelo grande
REGLA DE CÓDIGO
    confianza < 0.70 → consulta_general con la instrucción de pedir más detalle

MENSAJE 1 (cliente C-2210)
    "¿Hasta qué hora atienden los sábados?"
    Clasificador → {"categoria": "consulta_general", "confianza": 0.97}
    Ruta         → consulta_general
    Respuesta    "Los sábados atendemos de 9:00 a 14:00."

MENSAJE 2 (cliente C-1388)
    "Cancelé mi plan anual a los 10 días y no me han devuelto nada."
    Clasificador → {"categoria": "reembolso", "confianza": 0.93}
    Ruta         → reembolso
    Recibe       el mensaje original completo y el id del cliente
    Acción:      consultar_pagos(id_cliente = "C-1388")
    Observación: pago anual de $2,388 MXN el 4 sep · cancelación el 14 sep
    Acción:      solicitar_reembolso(id_pago = "P-90215", monto = 2388,
                                     motivo = "Cancelación dentro de 30 días")
    Observación: reembolso R-6120 creado
    Respuesta    "Tu cancelación ocurrió dentro de los primeros 30 días, así que
                 procede el reembolso completo de $2,388 MXN (folio R-6120)."

MENSAJE 3 (cliente C-0457)
    "Después de actualizar la app, el lector de códigos no abre la cámara."
    Clasificador → {"categoria": "soporte_tecnico", "confianza": 0.88}
    Ruta         → soporte_tecnico (modelo grande)

MENSAJE 4 (cliente C-3301)
    "Quiero saber si me pueden reembolsar o si el problema es de la app."
    Clasificador → {"categoria": "reembolso", "confianza": 0.52}
    Regla        confianza 0.52 < 0.70 → consulta_general
    Respuesta    "Con gusto te ayudo. ¿Me cuentas qué pasó con la app y qué
                 compra quieres que revisemos?"
```

**Lectura del trace**

- **Quién decide:** el clasificador toma una sola decisión por mensaje; la regla de baja confianza la decide el código.
- **Qué muestra:** cada rama usa el modelo que necesita. Las preguntas simples van al modelo pequeño y los diagnósticos al grande.
- **Contrapunto (Cognition):** la rama de reembolso recibe el mensaje original, sin la reformulación del clasificador. Así conserva detalles como "a los 10 días", que determinan la política aplicable.

---

## 3. Coordinator/dispatcher

Un agente coordinador lee las descripciones de dos especialistas y decide a quién enviar cada parte de la solicitud. El mensaje del cliente contiene dos problemas, y el coordinador los atiende uno tras otro.

```text
PATRÓN       Coordinator/dispatcher
COORDINADOR  agente_coordinador (LLM)
ESPECIALISTAS (descripciones que lee el coordinador)
    facturacion      "Aclara cargos, facturas y pagos. Puede ajustar cargos."
    soporte_tecnico  "Diagnostica fallas de equipo y conexión. Puede actualizar
                      el módem y programar visitas técnicas."

MENSAJE DEL USUARIO (cliente C-5072)
    "Mi factura de septiembre trae un cargo de $350 por 'visita técnica' que nunca
    pedí, y además el módem se reinicia solo varias veces al día."

TURNO 1 · coordinador
    Análisis:    el mensaje tiene dos solicitudes: un cargo no reconocido y una falla de equipo.
    Decisión:    atender primero el cargo, porque puede depender del historial de visitas.
    Transfiere a facturacion
    Contexto:    conversación completa

TURNO 2 · facturacion
    Acción:      consultar_cargos(id_cliente = "C-5072", mes = "septiembre 2026")
    Observación: cargo VT-8812 · $350 · visita del 12 sep · estado: cancelada por el cliente
    Acción:      ajustar_cargo(id_cargo = "VT-8812", motivo = "visita cancelada")
    Observación: nota de crédito NC-3390 por $350 aplicada a la factura de octubre
    Devuelve el control al coordinador

TURNO 3 · coordinador
    Decisión:    la primera solicitud quedó resuelta; transfiere la segunda.
    Transfiere a soporte_tecnico
    Contexto:    conversación completa + resultado de facturacion

TURNO 4 · soporte_tecnico
    Acción:      consultar_dispositivo(id_cliente = "C-5072")
    Observación: 14 reinicios en 72 horas · firmware 3.1.2 · versión vigente 3.4.0
    Acción:      actualizar_firmware(id_dispositivo = "MDM-55102", version = "3.4.0")
    Observación: actualización programada para las 02:00 h
    Devuelve el control al coordinador

RESPUESTA FINAL (coordinador)
    Revisamos los dos temas. El cargo de $350 correspondía a una visita que
    cancelaste; ya aplicamos una nota de crédito por ese monto en tu factura de
    octubre (folio NC-3390). Los reinicios se deben a un firmware desactualizado;
    tu módem se actualizará esta noche a las 2:00 h. Si los reinicios continúan,
    podemos programar una visita sin costo.
```

**Lectura del trace**

- **Quién decide:** el coordinador elige al especialista con base en sus descripciones y decide el orden de atención.
- **Qué muestra:** el coordinador sigue en la conversación después de cada transferencia y redacta la respuesta final.
- **Contrapunto (Cognition):** si el coordinador hubiera enviado ambas partes en paralelo, soporte técnico podría haber programado una visita con costo mientras facturación cancelaba el cargo de otra visita. Atender en secuencia, con la conversación completa y el resultado de facturación, evita esas decisiones en conflicto.

---

## 4. Handoff

Un portal de soporte de telecomunicaciones usa handoff entre especialistas. Cada agente decide si resuelve o transfiere el control completo. El agente de finanzas tiene un límite de bonificación, y el caso termina con una persona.

```text
PATRÓN       Handoff (un agente activo a la vez)
AGENTES
    triage        atiende problemas comunes; transfiere el resto
    tecnico_red   diagnostica fallas de red y cobertura
    finanzas      bonificaciones y ajustes; límite de $100 MXN por caso
    persona       asesor humano de soporte
LÍMITE         5 transferencias por conversación

MENSAJE DEL USUARIO (cliente C-7740)
    "Llevo tres días sin internet. Ya reinicié todo. Quiero que me descuenten estos días."

AGENTE ACTIVO · triage
    Pensamiento: el cliente ya reinició el equipo; el problema excede la guía básica.
    HANDOFF → tecnico_red        transferencias: 1 de 5
    Contexto transferido: trace completo (mensaje y pasos de triage)

AGENTE ACTIVO · tecnico_red
    Acción:      consultar_estado_nodo(id_cliente = "C-7740")
    Observación: nodo MTY-NORTE-14 con corte de fibra desde el 2 oct; reparado el 5 oct a las 16:40
    Acción:      verificar_conexion(id_cliente = "C-7740")
    Observación: conexión restablecida a 300 Mbps
    Pensamiento: la falla técnica está resuelta; la bonificación corresponde a finanzas.
    HANDOFF → finanzas           transferencias: 2 de 5
    Contexto transferido: trace completo + diagnóstico del nodo

AGENTE ACTIVO · finanzas
    Acción:      calcular_bonificacion(cuota_mensual = 1200, dias_sin_servicio = 3)
    Observación: bonificación de $120 MXN (1,200 / 30 × 3)
    Pensamiento: $120 supera mi límite de $100 por caso.
    HANDOFF → persona            transferencias: 3 de 5
    Contexto transferido: trace completo + bonificación calculada

AGENTE ACTIVO · persona (asesor Luis M.)
    Revisa el trace: corte de fibra confirmado, servicio restablecido, bonificación de $120 calculada.
    Acción:      aplicar_bonificacion(id_cliente = "C-7740", monto = 120)
    Respuesta    "Confirmamos un corte de fibra en tu zona del 2 al 5 de octubre.
                 El servicio ya está restablecido y aplicamos una bonificación de
                 $120 MXN en tu siguiente factura."
```

**Lectura del trace**

- **Quién decide:** cada agente activo decide si resuelve o transfiere. Al inicio nadie sabía que el caso terminaría en finanzas y después con una persona.
- **Qué muestra:** el contador de transferencias protege contra ciclos infinitos, el riesgo principal que señala Microsoft para este patrón.
- **Contrapunto (Cognition):** cada transferencia incluye el trace completo. Por eso la persona aprueba sin volver a preguntar al cliente cuántos días estuvo sin servicio. Como solo hay un agente activo, no hay decisiones simultáneas en conflicto.

---

## 5. Sectioning y fan-out/gather

Tres agentes revisan el mismo pull request al mismo tiempo, cada uno desde un ángulo distinto, y escriben en claves separadas del estado. Un sintetizador combina los tres reportes en un solo comentario.

```text
PATRÓN       Parallel fan-out/gather (sectioning)
ENTRADA      Pull request #418 "Agrega endpoint de búsqueda de clientes"
             api/clientes.py (+64 −3) · db/consultas.py (+22 −0)
FAN-OUT      en paralelo, cada agente escribe en su propia clave
    auditor_seguridad    → reporte_seguridad
    revisor_estilo       → reporte_estilo
    analista_desempeno   → reporte_desempeno

[t = 0 s]   Inician los tres agentes con el mismo diff

[t = 9 s]   revisor_estilo termina
    reporte_estilo: 2 observaciones
      - api/clientes.py:41 · la variable `x` necesita un nombre descriptivo
      - db/consultas.py:12 · línea de 104 caracteres (límite: 100)

[t = 13 s]  auditor_seguridad termina
    reporte_seguridad: 1 hallazgo crítico
      - db/consultas.py:18 · el parámetro `nombre` se concatena en el SQL (riesgo de inyección)

[t = 16 s]  analista_desempeno termina
    reporte_desempeno: 1 observación
      - db/consultas.py:18 · búsqueda con LIKE '%texto%' sobre clientes (1.2 M registros) sin índice

GATHER · sintetizador
    Recibe:  diff + reporte_seguridad + reporte_estilo + reporte_desempeno
    Salida:  comentario único en el PR, ordenado por severidad
      1. Bloqueante · db/consultas.py:18
         Usar una consulta parametrizada. Al corregirla, conviene cambiar la búsqueda
         a un índice de texto completo (señalado también por desempeño).
      2. Menor · db/consultas.py:12 · dividir la línea de 104 caracteres.
      3. Menor · api/clientes.py:41 · renombrar `x` como `filtro_busqueda`.
      Estado sugerido: cambios requeridos

TIEMPO TOTAL   16 s en paralelo (en secuencia: 9 + 13 + 16 = 38 s)
```

**Lectura del trace**

- **Quién decide:** el diseño definió los tres revisores; el sintetizador decide el orden de severidad.
- **Qué muestra:** el tiempo total equivale al del agente más lento. Dos reportes señalaron la misma línea, y el sintetizador los unió en un solo punto.
- **Contrapunto (Cognition):** el riesgo es bajo porque los tres agentes analizan la misma entrada y solo reportan. Si cada agente hubiera modificado el código para corregir su hallazgo, las correcciones a la línea 18 podrían haber chocado entre sí.

---

## 6. Voting

Tres prompts distintos revisan el mismo fragmento de código en busca de vulnerabilidades. La regla de votación determina si el fragmento se marca. El trace compara dos fragmentos bajo tres reglas.

```text
PATRÓN       Voting
TAREA        ¿El fragmento contiene una vulnerabilidad?
VOTANTES     prompts distintos sobre la misma entrada
    V1  enfoque: inyección de SQL y de comandos
    V2  enfoque: credenciales y secretos expuestos
    V3  enfoque: validación de entradas y permisos
REGLA ACTIVA "cualquiera": basta un voto positivo

FRAGMENTO F-27
    def exportar_reporte(usuario, ruta):
        os.system("zip /tmp/reporte.zip " + ruta)
        return "/tmp/reporte.zip"

    V1 → {"vulnerable": true,  "motivo": "ruta se concatena en un comando del sistema"}
    V2 → {"vulnerable": false}
    V3 → {"vulnerable": true,  "motivo": "no se verifica que el usuario tenga permiso sobre la ruta"}
    Conteo:   2 de 3
    Decisión: MARCADO

FRAGMENTO F-28
    def conectar():
        logger.info("Conectando con %s", os.environ["DB_URL"])
        return psycopg.connect(os.environ["DB_URL"])

    V1 → {"vulnerable": false}
    V2 → {"vulnerable": true,  "motivo": "DB_URL incluye la contraseña y se escribe en el log"}
    V3 → {"vulnerable": false}
    Conteo:   1 de 3
    Decisión: MARCADO

EFECTO DE LA REGLA
    Fragmento   Votos   Cualquiera   Mayoría (≥ 2)   Unanimidad
    F-27        2 de 3  marcado      marcado         sin marcar
    F-28        1 de 3  marcado      sin marcar      sin marcar
```

**Lectura del trace**

- **Quién decide:** la regla de votación, definida en el diseño. Los votantes solo emiten juicios.
- **Qué muestra:** solo un votante, el especializado en secretos, detectó el problema de F-28. "Cualquiera" lo marca; "mayoría" lo habría dejado pasar. Es la regla adecuada cuando un falso negativo cuesta más que revisar un falso positivo. "Unanimidad" habría dejado pasar también F-27.
- **Contrapunto (Cognition):** los votantes emiten juicios independientes sobre el mismo objeto y la regla solo los cuenta, así que no hay decisiones implícitas que combinar. El costo es económico: tres llamadas por fragmento.

---

## 7. Selección dinámica y agregación ponderada

Un orquestador elige qué analistas invocar según la solicitud y combina sus puntajes con una fórmula, sin usar un LLM para sintetizar. La empresa es ficticia y el ejemplo tiene fines didácticos; no constituye una recomendación de inversión.

```text
PATRÓN       Concurrent con selección dinámica y agregación ponderada
AGENTES REGISTRADOS
    fundamental   estados financieros y posición competitiva
    tecnico       precio, volumen y momentum
    sentimiento   noticias y redes sociales
    esg           reportes ambientales, sociales y de gobierno corporativo

SOLICITUD
    "Con horizonte de dos semanas, ¿conviene mantener la posición en GRPX
    (empresa ficticia) antes de su reporte trimestral?"

SELECCIÓN DINÁMICA · orquestador
    Pensamiento: el horizonte es de dos semanas; el análisis ESG aporta a horizontes largos.
    Invoca:      fundamental, tecnico, sentimiento
    Omite:       esg

EJECUCIÓN EN PARALELO (puntaje de −2 a +2)
    fundamental → +1   márgenes estables y deuda baja
                       (internamente consulta a dos sub-agentes: estados_financieros y competencia)
    tecnico     → −1   el precio cotiza por debajo de su promedio de 50 días
    sentimiento →  0   noticias mixtas antes del reporte

AGREGACIÓN (código)
    Pesos:     fundamental 0.4 · tecnico 0.3 · sentimiento 0.3
    Puntaje:   0.4 × (+1) + 0.3 × (−1) + 0.3 × (0) = +0.1
    Regla:     > +0.5 aumentar · de −0.5 a +0.5 mantener · < −0.5 reducir
    Resultado: MANTENER

SALIDA
    Recomendación: mantener la posición. Se adjuntan los tres análisis con sus
    puntajes para revisión del gestor de portafolio.
```

**Lectura del trace**

- **Quién decide:** el orquestador decide qué agentes invocar; la fórmula, definida en el diseño, decide el resultado.
- **Qué muestra:** las dos decisiones del patrón concurrente de Microsoft: selección dinámica (se omitió ESG) y una estrategia de agregación (combinación ponderada). El agente fundamental usa su propia orquestación interna.
- **Contrapunto (Cognition):** la agregación con una fórmula evita el paso en el que un LLM sintetizador combina interpretaciones distintas. Si se requiriera una narrativa, el sintetizador necesitaría los análisis completos, no solo los puntajes.

---

## 8. Orchestrator-workers

El orquestador consulta primero cuántas regiones tienen incidentes y crea un worker por región. Los workers solo consultan datos y devuelven resultados estructurados; el orquestador redacta las conclusiones.

```text
PATRÓN       Orchestrator-workers
SOLICITUD    "Resume los incidentes de soporte del tercer trimestre por región y
             señala la causa más frecuente en cada una."

ORQUESTADOR · planeación
    Acción:      listar_regiones_con_incidentes(trimestre = "2026-T3")
    Observación: Norte, Centro, Occidente, Sureste
    Decisión:    crear 4 workers, uno por región, con la misma instrucción acotada:
                 "Consulta los incidentes de la región R en 2026-T3. Devuelve el total,
                 las 3 causas principales con su conteo y un ticket de ejemplo.
                 No redactes conclusiones."

WORKERS (en paralelo, solo lectura)
    W1 Norte      total 412 · fibra 168 · config. de módem 97 · facturación 61 · ej. T-30418
    W2 Centro     total 655 · config. de módem 240 · fibra 151 · facturación 118 · ej. T-31902
    W3 Occidente  total 298 · config. de módem 121 · facturación 74 · fibra 52 · ej. T-30777
    W4 Sureste    total 187 · fibra 89 · facturación 41 · config. de módem 30 · ej. T-32050

SÍNTESIS · orquestador
    Total del trimestre: 412 + 655 + 298 + 187 = 1,552 incidentes
    Causa más frecuente por región:
        Norte      fallas de fibra           168 de 412  (41%)
        Centro     configuración de módem    240 de 655  (37%)
        Occidente  configuración de módem    121 de 298  (41%)
        Sureste    fallas de fibra            89 de 187  (48%)
    Observación transversal: la configuración de módem es la causa principal en dos de
    cuatro regiones (Centro y Occidente), lo que sugiere revisar la guía de instalación.

RESULTADO    resumen ejecutivo con la tabla anterior y los cuatro tickets de ejemplo
```

**Lectura del trace**

- **Quién decide:** el orquestador decide cuántos workers crear después de consultar los datos. En el cuarto trimestre podrían ser cinco regiones.
- **Qué muestra:** la diferencia con la paralelización: aquí las subtareas se definen durante la ejecución, no en el diseño.
- **Contrapunto (Cognition):** los workers investigan y el orquestador conserva las decisiones y las conclusiones, el diseño que Cognition considera viable. Si cada worker hubiera redactado su propia sección del resumen, el orquestador recibiría cuatro estilos y cuatro criterios distintos para "causa principal".

---

## 9. Hierarchical decomposition

Un agente redactor escribe un reporte y delega una pregunta acotada en un asistente de investigación. El asistente coordina a su vez a un agente de búsqueda y a un agente que resume. El redactor espera el resultado y continúa su propio razonamiento.

```text
PATRÓN       Hierarchical decomposition
NIVELES
    N1 redactor_reporte          herramienta: asistente_investigacion (sub-agente como herramienta)
    N2 asistente_investigacion   herramientas: busqueda_interna, resumidor (sub-agentes)
    N3 busqueda_interna · resumidor
TAREA        "Redacta el reporte trimestral de satisfacción del cliente (2026-T3)."

N1 · redactor_reporte
    Escribe la sección 1 con los datos disponibles: NPS julio 42 · agosto 35 · septiembre 39
    Pensamiento: antes de la sección 2 necesito explicar la caída de agosto.
    Llama:       asistente_investigacion("¿Qué explica la caída del NPS de 42 a 35 en
                 agosto de 2026? Devuelve causas con evidencia.")
    Espera el resultado

    N2 · asistente_investigacion
        Llama:   busqueda_interna("comentarios de detractores, agosto 2026")
            N3 · busqueda_interna → 1,180 comentarios; 38% mencionan el tiempo de espera
        Llama:   busqueda_interna("tiempo promedio de espera en la línea telefónica, julio y agosto 2026")
            N3 · busqueda_interna → julio 4 min · agosto 11 min
        Llama:   resumidor(resultados de las dos búsquedas)
            N3 · resumidor → la caída coincide con el aumento del tiempo de espera
        Devuelve a N1:
            Causa principal: el tiempo de espera pasó de 4 a 11 minutos.
            Evidencia: 38% de 1,180 comentarios de detractores lo mencionan.

N1 · redactor_reporte (continúa)
    Escribe la sección 2 con la causa y la evidencia recibidas.
    Escribe la sección 3: la recuperación a 39 en septiembre y recomendaciones.

RESULTADO    reporte de tres secciones; la búsqueda detallada quedó en el contexto de N2
```

**Lectura del trace**

- **Quién decide:** N1 decide qué preguntar y cuándo; N2 decide cómo investigar.
- **Qué muestra:** a diferencia del enrutamiento, N1 delegó solo una parte de su tarea y siguió escribiendo con el resultado. Las búsquedas de N3 no ocuparon la ventana de contexto de N1.
- **Contrapunto (Cognition):** N1 conserva el hilo y el estado, y N2 responde una pregunta acotada, la estructura que Yan (2026) describe como la que funciona. Cada nivel es una transferencia de contexto: si N2 hubiera devuelto solo "tiempo de espera", sin la evidencia, N1 no podría sustentar la sección 2.

---

## 10. Magentic

Un manager de SRE construye un registro de tareas, consulta a especialistas y cambia el plan cuando el diagnóstico descarta su hipótesis inicial. Una acción sobre producción requiere aprobación humana.

```text
PATRÓN       Magentic
MANAGER      manager_sre
ESPECIALISTAS
    diagnostico      logs y métricas (solo lectura)
    infraestructura  estado del sistema y opciones de recuperación (CLI)
    reversion        reversión de despliegues (Git, CLI)
    comunicacion     avisos a interesados (API de mensajería)
INCIDENTE    09:12 · tasa de error del servicio de pedidos: 23% (umbral: 2%)

REGISTRO DE TAREAS v1 (09:13)
    Meta: restaurar el servicio de pedidos
    T1 Identificar la causa                            pendiente
    T2 Revertir el despliegue de las 08:55 (v4.18)     pendiente (hipótesis inicial)
    T3 Avisar en el canal de incidentes                pendiente

ITERACIÓN 1
    manager → comunicacion: aviso inicial
        Observación: aviso publicado en #incidentes
    manager → diagnostico: "Analiza logs y métricas desde las 08:45"
        Observación: errores "too many connections" en la base de datos de pedidos
                     desde las 09:05; el despliegue v4.18 no modificó el acceso a datos

REGISTRO DE TAREAS v2 (09:18)
    T1 Identificar la causa                  en curso: conexiones agotadas
    T2 Revertir el despliegue v4.18          DESCARTADA (sin relación con la causa)
    T3 Avisar en el canal de incidentes      completada
    T4 Restaurar la conectividad a la BD     nueva

ITERACIÓN 2
    manager → infraestructura: estado del pool de conexiones
        Observación: pool en 200 de 200; el proceso RPT-NIGHTLY abrió 140 conexiones a las 09:04
        Opciones:    (a) detener RPT-NIGHTLY · (b) ampliar el pool a 300
    manager: propone (a) por ser reversible; afecta producción → requiere aprobación
    APROBACIÓN · ingeniera de guardia Mariana T.: aprobado (09:24)
    manager → infraestructura: detener RPT-NIGHTLY
        Observación: pool en 64 de 200 · tasa de error 0.8% a las 09:27

ITERACIÓN 3
    manager → comunicacion: aviso de recuperación
        Observación: aviso publicado en #incidentes

REGISTRO DE TAREAS v3 (09:30)
    T1 completada · T2 descartada · T3 completada · T4 completada
    T5 Revisar por qué RPT-NIGHTLY corrió en horario de operación   asignada a una persona

EVALUACIÓN · ¿se cumplió la meta? Sí → fin
DURACIÓN     18 minutos · registro completo disponible para la revisión posterior
```

**Lectura del trace**

- **Quién decide:** el manager planea, asigna y reordena las tareas; una persona aprueba la acción sobre producción.
- **Qué muestra:** el plan cambió de revertir el despliegue a restaurar la base de datos. El registro de tareas documenta por qué se descartó T2.
- **Contrapunto (Cognition):** un solo manager centraliza las decisiones en el registro. El riesgo está en las acciones sobre sistemas externos, que llevan decisiones implícitas; por eso la detención del proceso pasó por aprobación y quedó registrada.

---

## 11. Evaluator-optimizer y maker-checker

Un agente traductor propone una versión y un agente evaluador la revisa contra tres criterios. El evaluador devuelve retroalimentación específica hasta aprobar o hasta alcanzar el límite de iteraciones. El texto original es un fragmento escrito para este ejemplo.

```text
PATRÓN       Evaluator-optimizer (maker-checker)
TAREA        Traducir al inglés un fragmento literario
CRITERIOS DEL EVALUADOR
    C1 fidelidad de sentido · C2 conserva la imagen principal · C3 registro literario
LÍMITE       3 iteraciones; al alcanzarlo, escalar a una persona

ORIGINAL
    "La tarde se deshizo sobre los tejados como una promesa que nadie había pedido."

ITERACIÓN 1
    Traductor (recibe: original + criterios)
        "The afternoon fell apart over the roofs like a promise nobody asked for."
    Evaluador (recibe: original + criterios + versión 1)
        C1 ✔
        C2 ✘ "fell apart" sugiere ruptura; "se deshizo" sugiere una disolución gradual.
        C3 ✘ "nobody asked for" es coloquial; el original usa pluscuamperfecto.
        Veredicto: revisar

ITERACIÓN 2
    Traductor (recibe: original + versión 1 + retroalimentación)
        "The evening dissolved over the rooftops like a promise no one had asked for."
    Evaluador
        C1 ✔
        C2 ✔ "dissolved" conserva la disolución gradual.
        C3 ✔ "no one had asked for" mantiene el pluscuamperfecto y el registro.
        Nota: "evening" traduce "tarde" en su sentido de caída del sol.
        Veredicto: aprobado

RESULTADO    versión 2, aprobada en 2 de 3 iteraciones
```

**Lectura del trace**

- **Quién decide:** el evaluador decide si la versión pasa; el límite de iteraciones decide cuándo escalar.
- **Qué muestra:** el patrón encaja porque la retroalimentación mejora la traducción de forma visible y el evaluador sabe articularla, las dos señales que menciona Anthropic.
- **Contrapunto (Cognition):** el traductor y el evaluador trabajan por turnos sobre el mismo texto. El evaluador recibe el original además de cada versión; sin él, evaluaría la naturalidad del inglés y no la fidelidad.

---

## 12. Generator-critic

Un generador escribe una consulta SQL y un crítico la valida contra el esquema y tres reglas. El ciclo es de aprobado o rechazado y termina cuando el crítico aprueba.

```text
PATRÓN       Generator-critic
ESQUEMA
    pedidos(id, id_cliente, fecha TIMESTAMP, total)
    clientes(id, nombre, region)
SOLICITUD    "Total vendido por región en septiembre de 2026, de mayor a menor."
CRÍTICO      validador programático con tres reglas
    R1 las columnas existen en el esquema
    R2 toda columna sin agregar aparece en GROUP BY
    R3 los rangos de fecha sobre TIMESTAMP son semiabiertos (>= inicio y < fin)
SALIDA       "PASS" o lista de errores

ITERACIÓN 1
    Generador
        SELECT c.region, SUM(p.monto)
        FROM pedidos p JOIN clientes c ON p.id_cliente = c.id
        WHERE p.fecha BETWEEN '2026-09-01' AND '2026-09-30'
        ORDER BY 2 DESC;
    Crítico → FAIL
        R1 la columna p.monto no existe; la columna se llama total
        R2 c.region requiere GROUP BY c.region
        R3 BETWEEN excluye los pedidos del 30 de septiembre después de las 00:00:00

ITERACIÓN 2
    Generador (recibe: solicitud + esquema + consulta 1 + errores)
        SELECT c.region, SUM(p.total) AS total_vendido
        FROM pedidos p JOIN clientes c ON p.id_cliente = c.id
        WHERE p.fecha >= '2026-09-01' AND p.fecha < '2026-10-01'
        GROUP BY c.region
        ORDER BY total_vendido DESC;
    Crítico → PASS

RESULTADO    consulta 2, aprobada en la iteración 2
```

**Lectura del trace**

- **Quién decide:** el crítico decide con reglas verificables; el generador decide cómo corregir.
- **Qué muestra:** el enfoque es la corrección. Cada error tiene una regla que lo detecta, y la respuesta es aprobado o rechazado.
- **Contrapunto (Cognition):** el crítico es un programa, no un LLM. Una verificación determinista aplica la misma regla siempre y no introduce interpretaciones propias.

---

## 13. Iterative refinement

Un generador escribe una función, un crítico escribe notas de mejora y un refinador reescribe el código. En la primera iteración, el refinador introduce un cambio que nadie pidió, y el crítico lo detecta en la segunda.

````text
PATRÓN       Iterative refinement
OBJETIVO     Función que devuelve los 10 clientes con más pedidos, como [[id_cliente, conteo], ...]
UMBRAL       el crítico no reporta observaciones de severidad media o alta
LÍMITE       3 iteraciones

GENERADOR · borrador v1
    def top_clientes(pedidos):
        conteo = []
        for p in pedidos:
            encontrado = False
            for c in conteo:
                if c[0] == p["id_cliente"]:
                    c[1] += 1
                    encontrado = True
            if not encontrado:
                conteo.append([p["id_cliente"], 1])
        conteo.sort(key=lambda c: c[1], reverse=True)
        return conteo[:10]

ITERACIÓN 1
    Crítico → notas
        Alta:  la búsqueda lineal dentro del ciclo cuesta O(n × k) para n pedidos y k clientes.
        Media: se ordena la lista completa para obtener solo 10 elementos.
    Refinador → v2
        from collections import Counter
        def top_clientes(pedidos):
            return Counter(p["id_cliente"] for p in pedidos).most_common(10)

ITERACIÓN 2
    Crítico → notas
        Media: el tipo de retorno cambió de lista de listas a lista de tuplas;
               el código que modifica c[1] en el resultado fallaría.
    Refinador → v3
        from collections import Counter
        def top_clientes(pedidos):
            conteo = Counter(p["id_cliente"] for p in pedidos)
            return [[cliente, n] for cliente, n in conteo.most_common(10)]

ITERACIÓN 3
    Crítico → notas
        Baja: agregar anotaciones de tipo.
    Señal de salida: umbral alcanzado (sin observaciones medias o altas)

RESULTADO    v3, aceptada en la iteración 3 de 3
````

**Lectura del trace**

- **Quién decide:** el crítico define qué mejorar y la condición de salida decide cuándo parar.
- **Qué muestra:** a diferencia de generator-critic, el crítico entrega notas de mejora con severidad, no un aprobado o rechazado. El ciclo terminó al alcanzar el umbral, justo en el límite de iteraciones.
- **Contrapunto (Cognition):** el cambio de tipo en v2 es una decisión implícita del refinador, el mismo problema que Cognition describe con los modelos de edición. El crítico lo detectó porque recibe el objetivo original, que especifica el formato de salida.

---

## 14. Group chat

Tres agentes de solo lectura y una empleada del departamento evalúan la propuesta de un parque en un hilo compartido. El chat manager decide quién habla y termina la discusión cuando ningún participante tiene objeciones.

```text
PATRÓN       Group chat
CHAT MANAGER modera los turnos · máximo 6 rondas · fin: ningún participante tiene objeciones
PARTICIPANTES (solo lectura)
    comunidad    accesibilidad y uso esperado
    ambiental    impacto ecológico y normativa
    presupuesto  costos de construcción y operación
    persona      Ana R., Departamento de Parques
PROPUESTA P-2026-14 · Parque Las Lomas (ficticio)
    3.2 ha · cancha de pasto sintético · andador de 1.1 km · 120 árboles
    construcción: $18.5 M MXN · partida anual de mantenimiento disponible: $1.3 M MXN

RONDA 1
    manager → comunidad
        El andador no tiene rampas en el lado poniente, donde está la escuela primaria.
    manager → ambiental
        El pasto sintético sella 0.7 ha de suelo permeable en una zona con encharcamientos.
    manager → presupuesto
        Mantenimiento anual con pasto sintético: $1.4 M, que incluye $0.4 M de reserva
        para reponer el pasto. Supera la partida de $1.3 M.

RONDA 2
    manager: pide evaluar el cambio a pasto natural
    ambiental
        El pasto natural conserva la permeabilidad, pero requiere riego.
    presupuesto
        La construcción baja $2.1 M. El mantenimiento elimina la reserva de $0.4 M y
        suma $0.35 M de cuidado y riego: $1.35 M, todavía arriba de la partida.

RONDA 3
    persona (Ana R.)
        El municipio tiene un convenio de agua tratada para riego a la mitad del costo.
    presupuesto
        De los $0.35 M, $0.2 M son riego; con agua tratada bajan a $0.1 M.
        Mantenimiento: $1.25 M, dentro de la partida.
    comunidad
        Dos rampas en el lado poniente cuestan $0.3 M de construcción.

RONDA 4
    manager: resume la propuesta ajustada
        Pasto natural con riego de agua tratada · dos rampas en el lado poniente
        Construcción: 18.5 − 2.1 + 0.3 = $16.7 M · mantenimiento: $1.25 M al año
    comunidad: sin objeciones · ambiental: sin objeciones ·
    presupuesto: sin objeciones · persona: sin objeciones
    Criterio de fin cumplido en la ronda 4 de 6

RESULTADO    propuesta ajustada lista para la consulta con la comunidad
```

**Lectura del trace**

- **Quién decide:** el chat manager decide los turnos y aplica el criterio objetivo de fin; los agentes solo aportan análisis.
- **Qué muestra:** la información que destrabó el presupuesto, el convenio de agua tratada, vino de la persona. El hilo compartido permitió que presupuesto la usara en el mismo turno.
- **Contrapunto (Cognition):** el group chat sirvió para deliberar, no para construir. Todos los participantes ven el mismo hilo (Principio 1), y como son de solo lectura, ninguno ejecutó cambios con supuestos que los demás no conocían.

---

## 15. Human-in-the-loop

El agente del trace de ReAct sobre el cobro duplicado ahora tiene una regla de aprobación limitada a una herramienta. Las consultas avanzan solas; el reembolso mayor a $100 MXN pausa la ejecución hasta que una persona lo aprueba.

```text
PATRÓN       Human-in-the-loop
REGLA DE APROBACIÓN (limitada a herramientas)
    consultar_pagos, consultar_historial_cuenta, buscar_base_conocimiento  → sin aprobación
    solicitar_reembolso con monto > $100 MXN                               → requiere aprobación
CASO         cliente C-1027 reporta un doble cobro de su suscripción

ITERACIONES 1 a 3 (sin aprobación)
    consultar_pagos         → P-88310 (1 sep) y P-88342 (3 sep), $199 cada uno, tarjetas distintas
    consultar_historial     → cambio de método de pago el 2 sep
    buscar_base_conocimiento → error conocido #312: procede el reembolso del segundo cargo

ITERACIÓN 4
    Acción propuesta: solicitar_reembolso(id_pago = "P-88342", monto = 199,
                                          motivo = "Cargo duplicado, error #312")
    Regla:   199 > 100 → requiere aprobación
    PAUSA    se guarda el estado de la ejecución (punto de control CK-77)

    SOLICITUD DE APROBACIÓN → supervisora de soporte
        Acción:     reembolso de $199 MXN del pago P-88342
        Evidencia:  dos cargos del mismo periodo · cambio de tarjeta el 2 sep ·
                    coincidencia con el error conocido #312
        Trace:      enlace a las iteraciones 1 a 3
    RESPUESTA (14 minutos después): aprobado

    REANUDA  desde CK-77, sin repetir las iteraciones 1 a 3
    Acción:      solicitar_reembolso(id_pago = "P-88342", monto = 199, ...)
    Observación: reembolso R-5521 creado

ITERACIÓN 5
    Respuesta final al cliente con la causa y el folio R-5521

ALTERNATIVA · si la supervisora hubiera respondido con retroalimentación
    "Verifica primero si P-88310 ya tiene un reembolso parcial."
    → la retroalimentación regresa al agente como nueva observación y el ciclo continúa
```

**Lectura del trace**

- **Quién decide:** la regla de aprobación decide cuándo pausar; la supervisora decide si la acción procede.
- **Qué muestra:** la aprobación está limitada a una herramienta y a un umbral, así que las consultas no esperan a nadie. El punto de control permite reanudar sin repetir trabajo.
- **Contrapunto (Cognition):** la supervisora recibe la evidencia y el enlace al trace, no solo "reembolsar $199". Con ese contexto puede aprobar en minutos y detectar si algo no cuadra.

---

## 16. Patrones compuestos

Un sistema de soporte combina tres patrones: un coordinador enruta el mensaje, la rama técnica busca en paralelo en la documentación y en el historial del cliente, y un ciclo generator-critic revisa el tono de la respuesta.

```text
PATRÓN       Compuesto: coordinator/dispatcher → parallel fan-out → generator-critic
MENSAJE (cliente C-6195)
    "Desde que actualicé la app ya no se sincronizan mis pedidos. Es la tercera vez que pasa."

ETAPA 1 · COORDINATOR/DISPATCHER
    coordinador: intención = problema técnico de la app → rama soporte_app
    Contexto transferido: mensaje completo + id del cliente

ETAPA 2 · PARALLEL FAN-OUT (rama soporte_app, solo lectura)
    busqueda_documentacion → artículo KB-77: la versión 5.2.0 pierde la sesión de
                             sincronización al actualizar en Android 14; solución: cerrar
                             sesión e iniciar de nuevo; corrección incluida en la 5.2.1
    busqueda_historial     → Android 14 · app 5.2.0 · tickets previos T-201 (julio) y
                             T-344 (agosto) por sincronización, ambos cerrados con "reinstalar"
    GATHER: diagnóstico = defecto KB-77; recurrencia confirmada (tercer caso)

ETAPA 3 · GENERATOR-CRITIC (tono)
    Criterios del crítico: reconoce la recurrencia · evita términos técnicos ·
                           da un solo paso de solución claro
    Generador v1
        "Su incidencia corresponde al defecto KB-77 de la versión 5.2.0, que invalida
        el token de sincronización tras la actualización."
    Crítico → FAIL
        usa "incidencia" y "token" · no reconoce que es la tercera vez · no da un paso claro
    Generador v2
        "Lamentamos que esto te pase por tercera vez. Identificamos la causa: un error de
        la versión 5.2.0. Para resolverlo, cierra sesión en la app y vuelve a entrar.
        La versión 5.2.1, ya disponible, corrige el error de forma definitiva."
    Crítico → PASS

RESPUESTA FINAL   versión v2

PUNTOS DE TRANSFERENCIA DE CONTEXTO
    1. coordinador → rama soporte_app
    2. búsquedas paralelas → generador
    3. generador ↔ crítico
```

**Lectura del trace**

- **Quién decide:** el coordinador elige la rama, el diseño define las búsquedas paralelas y el crítico decide si el tono es adecuado.
- **Qué muestra:** cada etapa usa el patrón que conviene a su tarea. El historial aportó un dato, la recurrencia, que cambió el tono de la respuesta.
- **Contrapunto (Cognition):** el trace termina listando los tres puntos de transferencia. En cada uno, el receptor tiene lo que necesita: el generador recibe el mensaje original y ambos resultados, por eso la versión 2 menciona que es la tercera vez.

---

## Referencias

Anthropic. (2024, 19 de diciembre). *Building effective agents*. [https://www.anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)

Cognition. (2025, 12 de junio). *Don't build multi-agents* (W. Yan). [https://cognition.com/blog/dont-build-multi-agents](https://cognition.com/blog/dont-build-multi-agents)

Google. (2025, 16 de diciembre). *Developer's guide to multi-agent patterns in ADK* (S. Saboo). Google Developers Blog. [https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/)

Microsoft. (2026, 12 de febrero). *AI agent orchestration patterns* (C. Kittel y C. Siemens). Azure Architecture Center. [https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)

Ramirez, E. (2026). *Function Calling vs. ReAct: traces de ejemplo* [Material del curso].

Yan, W. (2026, 22 de abril). *Multi-agents: What's actually working* [Publicación en X]. [https://x.com/walden_yan/status/2047054554433462360](https://x.com/walden_yan/status/2047054554433462360)
