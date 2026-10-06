window.PATRON = {
  h: 480, minW: 900,
  boardTitle: 'Registro de tareas',
  boardEmpty: 'El manager todavía no construye el registro.',
  nodes: [
    { id: 'inc', type: 'input', name: 'Incidente 09:12', desc: 'tasa de error del servicio de pedidos: 23% (umbral: 2%)', x: 9, y: 22, w: 150, mono: false },
    { id: 'man', type: 'agent', tag: 'Manager', name: 'manager_sre', desc: 'planea, asigna y reordena tareas', x: 36, y: 50, w: 160 },
    { id: 'dia', type: 'agent', name: 'diagnostico', desc: 'logs y métricas (solo lectura)', x: 75, y: 11, w: 190 },
    { id: 'inf', type: 'agent', name: 'infraestructura', desc: 'estado del sistema y opciones de recuperación (CLI)', x: 75, y: 37, w: 190 },
    { id: 'rev', type: 'agent', name: 'reversion', desc: 'reversión de despliegues (Git, CLI)', x: 75, y: 63, w: 190 },
    { id: 'com', type: 'agent', name: 'comunicacion', desc: 'avisos a interesados (API de mensajería)', x: 75, y: 89, w: 190 },
    { id: 'hum', type: 'human', tag: 'Persona', name: 'Mariana T.', desc: 'ingeniera de guardia', x: 24, y: 86, w: 140, mono: false }
  ],
  edges: [['inc', 'man'], ['man', 'dia'], ['man', 'inf'], ['man', 'rev'], ['man', 'com'], ['man', 'hum']],
  steps: [
    {
      lbl: 'REGISTRO v1', title: 'El manager construye un registro de tareas',
      text: 'El manager recibe el incidente y escribe un plan inicial. T2 es una hipótesis: revertir el despliegue de las 08:55. El registro de tareas es el contexto compartido del patrón.',
      flows: [{ from: 'inc', to: 'man', k: 'ctx', label: 'incidente' }],
      active: ['man'],
      ctx: { to: 'man', parts: [{ k: 'input', src: 'incidente', text: '09:12 · tasa de error del servicio de pedidos: 23% (umbral: 2%)' }] },
      board: {
        meta: ['Restaurar el servicio de pedidos', 'manager_sre'],
        T1: ['Identificar la causa · pendiente', 'manager_sre'],
        T2: ['Revertir el despliegue de las 08:55 (v4.18) · pendiente (hipótesis inicial)', 'manager_sre'],
        T3: ['Avisar en el canal de incidentes · pendiente', 'manager_sre']
      },
      tr: ['PATRÓN', 'T3 Avisar en el canal de incidentes                pendiente']
    },
    {
      lbl: 'ITER 1 · AVISO', title: 'Primer aviso a los interesados',
      text: 'El manager asigna el aviso inicial al especialista de comunicación.',
      flows: [
        { from: 'man', to: 'com', k: 'ctx', label: 'aviso inicial' },
        { from: 'com', to: 'man', k: 'res', label: 'publicado', ph: 1 }
      ],
      active: ['man'],
      out: { by: 'com', label: 'Observación', text: 'aviso publicado en #incidentes' },
      tr: ['ITERACIÓN 1', 'Observación: aviso publicado']
    },
    {
      lbl: 'ITER 1 · DIAGNÓSTICO', title: 'El diagnóstico descarta la hipótesis inicial',
      text: 'El especialista de diagnóstico, de solo lectura, encuentra conexiones agotadas en la base de datos. El despliegue v4.18 no modificó el acceso a datos.',
      flows: [
        { from: 'man', to: 'dia', k: 'ctx', label: 'instrucción' },
        { from: 'dia', to: 'man', k: 'res', label: 'too many connections', ph: 1 }
      ],
      active: ['man'],
      ctx: { to: 'dia', parts: [{ k: 'instr', src: 'manager_sre', text: '"Analiza logs y métricas desde las 08:45"' }] },
      out: { by: 'dia', label: 'Observación', text: 'errores "too many connections" en la base de datos de pedidos\ndesde las 09:05; el despliegue v4.18 no modificó el acceso a datos' },
      tr: ['manager → diagnostico', 'el despliegue v4.18 no modificó']
    },
    {
      lbl: 'REGISTRO v2', title: 'El manager reescribe el plan',
      text: 'T2 queda descartada y aparece T4. El registro documenta por qué cambió el plan; el especialista de reversión ya no se necesita.',
      active: ['man'],
      badges: { rev: ['sin uso', 'off'], com: ['T3 ✔', 'ok'] },
      board: {
        T1: ['Identificar la causa · en curso: conexiones agotadas', 'manager_sre'],
        T2: ['Revertir el despliegue v4.18 · DESCARTADA (sin relación con la causa)', 'manager_sre'],
        T3: ['Avisar en el canal de incidentes · completada', 'manager_sre'],
        T4: ['Restaurar la conectividad a la BD · nueva', 'manager_sre']
      },
      tr: ['REGISTRO DE TAREAS v2', 'T4 Restaurar la conectividad']
    },
    {
      lbl: 'ITER 2 · ESTADO', title: 'Infraestructura encuentra al culpable',
      text: 'Un proceso nocturno abrió 140 conexiones. Infraestructura devuelve el diagnóstico y dos opciones.',
      flows: [
        { from: 'man', to: 'inf', k: 'ctx', label: 'estado del pool' },
        { from: 'inf', to: 'man', k: 'res', label: 'pool 200 de 200 + opciones', ph: 1 }
      ],
      active: ['man'],
      out: { by: 'inf', label: 'Observación', text: 'pool en 200 de 200; el proceso RPT-NIGHTLY abrió 140 conexiones a las 09:04\nOpciones: (a) detener RPT-NIGHTLY · (b) ampliar el pool a 300' },
      tr: ['ITERACIÓN 2', 'Opciones:']
    },
    {
      lbl: 'APROBACIÓN', title: 'Una acción sobre producción pasa por una persona',
      text: 'El manager propone la opción (a) por ser reversible. Como afecta producción, requiere aprobación de la ingeniera de guardia.',
      flows: [
        { from: 'man', to: 'hum', k: 'human', label: 'propuesta (a)' },
        { from: 'hum', to: 'man', k: 'human', label: 'aprobado 09:24', ph: 1 }
      ],
      active: ['man', 'hum'],
      badges: { hum: ['aprobado', 'ok'] },
      ctx: { to: 'hum', parts: [{ k: 'result', src: 'manager_sre', text: 'Propuesta: (a) detener RPT-NIGHTLY, por ser reversible; afecta producción' }] },
      out: { by: 'hum', label: 'Respuesta', text: 'APROBACIÓN · ingeniera de guardia Mariana T.: aprobado (09:24)' },
      board: { 'aprobación': ['Detener RPT-NIGHTLY · aprobado por Mariana T. (09:24)', 'persona'] },
      tr: ['manager: propone (a)', 'APROBACIÓN']
    },
    {
      lbl: 'ITER 2 · ACCIÓN', title: 'Infraestructura ejecuta la acción aprobada',
      text: 'Tres minutos después, la tasa de error baja a 0.8%.',
      flows: [
        { from: 'man', to: 'inf', k: 'ctx', label: 'detener RPT-NIGHTLY' },
        { from: 'inf', to: 'man', k: 'res', label: 'error 0.8%', ph: 1 }
      ],
      active: ['man'],
      out: { by: 'inf', label: 'Observación', text: 'pool en 64 de 200 · tasa de error 0.8% a las 09:27' },
      tr: ['manager → infraestructura: detener', 'pool en 64 de 200']
    },
    {
      lbl: 'ITER 3', title: 'Aviso de recuperación',
      text: 'El manager vuelve a usar al especialista de comunicación.',
      flows: [
        { from: 'man', to: 'com', k: 'ctx', label: 'aviso de recuperación' },
        { from: 'com', to: 'man', k: 'res', label: 'publicado', ph: 1 }
      ],
      active: ['man'],
      out: { by: 'com', label: 'Observación', text: 'aviso publicado en #incidentes' },
      tr: ['ITERACIÓN 3', 'Observación: aviso publicado']
    },
    {
      lbl: 'REGISTRO v3', title: 'Meta cumplida y una tarea para una persona',
      text: 'El manager evalúa la meta y termina. La pregunta de fondo (por qué el proceso corrió en horario de operación) queda asignada a una persona. El registro completo queda disponible para la revisión posterior.',
      active: ['man'],
      badges: { dia: ['✔', 'ok'], inf: ['T4 ✔', 'ok'] },
      board: {
        T1: ['completada', 'manager_sre'], T2: ['descartada', 'manager_sre'], T3: ['completada', 'manager_sre'], T4: ['completada', 'manager_sre'],
        T5: ['Revisar por qué RPT-NIGHTLY corrió en horario de operación · asignada a una persona', 'manager_sre'],
        'evaluación': ['¿Se cumplió la meta? Sí → fin · duración: 18 minutos', 'manager_sre']
      },
      tr: ['REGISTRO DE TAREAS v3', 'DURACIÓN']
    }
  ]
};
