window.PATRON = {
  h: 470, minW: 900,
  boardTitle: 'Estado de la ejecución',
  boardEmpty: 'La ejecución no ha comenzado.',
  extra: 'Es el mismo caso del demo <a href="../anatomia_agentes.html#react">ReAct</a> de la anatomía de un agente.',
  nodes: [
    { id: 'cli', type: 'input', tag: 'Usuario', name: 'Cliente C-1027', desc: 'doble cobro de su suscripción', x: 9, y: 22, w: 140, mono: false },
    { id: 'ag', type: 'agent', name: 'agente de soporte', desc: 'ciclo ReAct', x: 33, y: 50, w: 150, mono: false },
    { id: 'con', type: 'tool', tag: 'Consultas (sin aprobación)', name: 'consultar_pagos · consultar_historial_cuenta · buscar_base_conocimiento', x: 33, y: 88, w: 230 },
    { id: 'rule', type: 'code', tag: 'Regla de aprobación', name: 'solicitar_reembolso con monto > $100 MXN', x: 62, y: 50, w: 175 },
    { id: 'ck', type: 'state', tag: 'Punto de control', name: 'CK-77', desc: 'estado guardado de la ejecución', x: 62, y: 13, w: 150 },
    { id: 'sup', type: 'human', name: 'supervisora de soporte', x: 62, y: 88, w: 160, mono: false },
    { id: 'reem', type: 'tool', name: 'solicitar_reembolso', x: 89, y: 50, w: 150 }
  ],
  edges: [['cli', 'ag'], ['ag', 'con'], ['ag', 'rule'], ['rule', 'ck'], ['rule', 'sup'], ['rule', 'reem']],
  steps: [
    {
      lbl: 'DISEÑO', title: 'La aprobación se limita a una herramienta y un umbral',
      text: 'Las consultas avanzan solas. Solo un reembolso mayor a $100 MXN pausa la ejecución hasta que una persona lo aprueba.',
      active: ['rule'],
      out: { by: 'rule', label: 'Regla de aprobación', text: 'consultar_pagos, consultar_historial_cuenta, buscar_base_conocimiento  → sin aprobación\nsolicitar_reembolso con monto > $100 MXN                               → requiere aprobación' },
      tr: ['PATRÓN', 'CASO']
    },
    {
      lbl: 'ITER 1 a 3', title: 'Las consultas no esperan a nadie',
      text: 'Tres iteraciones de consulta sin aprobación: pagos, historial y base de conocimiento.',
      flows: [
        { from: 'cli', to: 'ag', k: 'ctx', label: 'queja' },
        { from: 'ag', to: 'con', k: 'ctx', label: '3 consultas', ph: 1 },
        { from: 'con', to: 'ag', k: 'res', label: 'observaciones', ph: 2 }
      ],
      active: ['ag'],
      badges: { con: ['sin aprobación', 'ok'] },
      out: { label: 'Observaciones', text: 'consultar_pagos          → P-88310 (1 sep) y P-88342 (3 sep), $199 cada uno, tarjetas distintas\nconsultar_historial      → cambio de método de pago el 2 sep\nbuscar_base_conocimiento → error conocido #312: procede el reembolso del segundo cargo' },
      board: { 'iteraciones 1 a 3': ['Dos cargos de $199 · cambio de tarjeta el 2 sep · error conocido #312', 'agente'] },
      tr: ['ITERACIONES 1 a 3', 'buscar_base_conocimiento →']
    },
    {
      lbl: 'ITER 4 · REGLA', title: 'La acción propuesta activa la regla',
      text: 'El agente propone el reembolso. Antes de ejecutarlo, la regla compara el monto contra el umbral: 199 > 100.',
      flows: [{ from: 'ag', to: 'rule', k: 'ctrl', label: 'acción propuesta' }],
      active: ['rule'],
      badges: { rule: ['199 > 100', 'warn'] },
      out: { by: 'ag', label: 'Acción propuesta', text: 'solicitar_reembolso(id_pago = "P-88342", monto = 199,\n                    motivo = "Cargo duplicado, error #312")' },
      tr: ['ITERACIÓN 4', 'Regla:   199 > 100']
    },
    {
      lbl: 'PAUSA', title: 'Se guarda el estado en un punto de control',
      text: 'La ejecución se detiene y su estado queda guardado en CK-77. Así podrá reanudarse sin repetir las iteraciones 1 a 3.',
      flows: [{ from: 'rule', to: 'ck', k: 'ctrl', label: 'estado de la ejecución' }],
      active: ['ck'],
      badges: { ag: ['en pausa', 'warn'] },
      board: { 'punto de control': ['CK-77: iteraciones 1 a 3 + acción propuesta', 'regla'] },
      tr: ['PAUSA', 'PAUSA']
    },
    {
      lbl: 'SOLICITUD', title: 'La supervisora recibe evidencia, no solo "reembolsar $199"',
      text: 'La solicitud de aprobación incluye la acción, la evidencia y un enlace al trace. Con ese contexto la supervisora puede aprobar en minutos y detectar si algo no cuadra.',
      flows: [{ from: 'rule', to: 'sup', k: 'human', label: 'solicitud de aprobación' }],
      active: ['sup'],
      ctx: { to: 'sup', parts: [
        { k: 'instr', src: 'acción', text: 'reembolso de $199 MXN del pago P-88342' },
        { k: 'result', src: 'evidencia', text: 'dos cargos del mismo periodo · cambio de tarjeta el 2 sep ·\ncoincidencia con el error conocido #312' },
        { k: 'hist', src: 'trace', text: 'enlace a las iteraciones 1 a 3' }
      ] },
      tr: ['SOLICITUD DE APROBACIÓN', 'Trace:      enlace']
    },
    {
      lbl: 'APROBADO', title: 'La supervisora aprueba',
      text: 'La respuesta llega 14 minutos después. Mientras tanto, la ejecución esperó en el punto de control.',
      flows: [{ from: 'sup', to: 'rule', k: 'human', label: 'aprobado' }],
      active: ['sup'],
      badges: { sup: ['aprobado', 'ok'] },
      board: { 'aprobación': ['aprobado (14 minutos después)', 'supervisora'] },
      tr: ['RESPUESTA (14 minutos después)', 'RESPUESTA (14 minutos después)']
    },
    {
      lbl: 'REANUDA', title: 'La ejecución se reanuda desde CK-77',
      text: 'El agente retoma desde el punto de control, sin repetir las consultas, y ejecuta el reembolso.',
      flows: [
        { from: 'ck', to: 'rule', k: 'ctrl', label: 'estado CK-77' },
        { from: 'rule', to: 'reem', k: 'ctx', label: 'reembolso aprobado', ph: 1 },
        { from: 'reem', to: 'rule', k: 'res', label: 'R-5521', ph: 2 }
      ],
      active: ['ck', 'reem'],
      badges: { ag: null, rule: ['aprobado', 'ok'] },
      out: { label: 'Observación', text: 'reembolso R-5521 creado' },
      board: { reembolso: ['R-5521 creado', 'solicitar_reembolso'] },
      tr: ['REANUDA', 'Observación: reembolso R-5521']
    },
    {
      lbl: 'ITER 5', title: 'Respuesta final al cliente',
      text: 'El agente responde con la causa y el folio del reembolso.',
      flows: [{ from: 'ag', to: 'cli', k: 'res', label: 'causa + folio R-5521' }],
      active: ['ag'],
      tr: ['ITERACIÓN 5', 'Respuesta final al cliente']
    },
    {
      lbl: 'ALTERNATIVA', title: 'Si la supervisora hubiera respondido con retroalimentación',
      text: 'La aprobación no es solo sí o no. Si la supervisora pide una verificación adicional, su retroalimentación regresa al agente como una nueva observación y el ciclo continúa.',
      flows: [{ from: 'sup', to: 'ag', k: 'fb', label: 'retroalimentación' }],
      active: ['sup', 'ag'],
      badges: { sup: ['retroalimentación', 'warn'], rule: null },
      ctx: { to: 'ag', parts: [{ k: 'feedback', src: 'supervisora, como nueva observación', text: '"Verifica primero si P-88310 ya tiene un reembolso parcial."' }] },
      tr: ['ALTERNATIVA', 'la retroalimentación regresa al agente']
    }
  ]
};
