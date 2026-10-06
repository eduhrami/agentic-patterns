window.PATRON = {
  h: 460, minW: 900,
  boardTitle: 'Registro de enrutamiento',
  boardEmpty: 'Aquí se registra la ruta que tomó cada mensaje.',
  nodes: [
    { id: 'msg', type: 'input', name: 'Mensaje del cliente', x: 8, y: 50, w: 120, mono: false },
    { id: 'clf', type: 'agent', tag: 'Clasificador', name: 'modelo pequeño', desc: 'salida estructurada: categoria + confianza', x: 29, y: 50, w: 150, mono: false },
    { id: 'rule', type: 'code', tag: 'Regla de código', name: 'confianza < 0.70', desc: '→ consulta_general con la instrucción de pedir más detalle', x: 51, y: 50, w: 150 },
    { id: 'cg', type: 'agent', tag: 'Rama', name: 'consulta_general', desc: 'prompt de preguntas frecuentes · base de conocimiento · modelo pequeño', x: 79, y: 15, w: 200 },
    { id: 're', type: 'agent', tag: 'Rama', name: 'reembolso', desc: 'prompt de políticas · consultar_pagos, solicitar_reembolso · modelo mediano', x: 79, y: 50, w: 200 },
    { id: 'st', type: 'agent', tag: 'Rama', name: 'soporte_tecnico', desc: 'prompt de diagnóstico · consultar_dispositivo, buscar_incidentes · modelo grande', x: 79, y: 85, w: 200 }
  ],
  edges: [['msg', 'clf'], ['clf', 'rule'], ['rule', 'cg'], ['rule', 're'], ['rule', 'st']],
  steps: [
    {
      lbl: 'DISEÑO', title: 'Un clasificador y tres ramas especializadas',
      text: 'Un clasificador con salida estructurada decide la categoría de cada mensaje. Cada rama tiene su propio prompt, sus herramientas y su modelo.\n\nUna <b>regla de código</b> se coloca entre el clasificador y las ramas: atiende los casos de baja confianza sin depender del modelo.',
      active: ['clf', 'rule'],
      tr: ['PATRÓN', 'confianza < 0.70']
    },
    {
      lbl: 'MENSAJE 1', title: 'Pregunta simple: va al modelo pequeño',
      text: 'El clasificador devuelve un JSON. Con 0.97 de confianza, la regla deja pasar la decisión y el mensaje llega a <code>consulta_general</code>.',
      flows: [
        { from: 'msg', to: 'clf', k: 'ctx', label: 'mensaje' },
        { from: 'clf', to: 'rule', k: 'ctrl', label: 'JSON', ph: 1 },
        { from: 'rule', to: 'cg', k: 'ctx', label: 'mensaje', ph: 2 }
      ],
      active: ['clf'],
      badgesReset: true, badges: { rule: ['0.97 ✔', 'ok'], cg: ['ruta', 'info'] },
      ctx: { to: 'clf', parts: [{ k: 'input', src: 'cliente C-2210', text: '"¿Hasta qué hora atienden los sábados?"' }] },
      out: [
        { by: 'clf', label: 'Salida del clasificador', text: '{"categoria": "consulta_general", "confianza": 0.97}' },
        { by: 'cg', label: 'Respuesta de la rama', text: '"Los sábados atendemos de 9:00 a 14:00."' }
      ],
      board: { 'Mensaje 1 · C-2210': ['consulta_general · confianza 0.97', 'clasificador'] },
      tr: ['MENSAJE 1', 'Respuesta    "Los sábados']
    },
    {
      lbl: 'MENSAJE 2 · A', title: 'Reclamo de reembolso: el clasificador decide la rama',
      text: 'Confianza de 0.93: la regla deja pasar la decisión y el mensaje va a la rama de reembolso, con modelo mediano.',
      flows: [
        { from: 'msg', to: 'clf', k: 'ctx', label: 'mensaje' },
        { from: 'clf', to: 'rule', k: 'ctrl', label: 'JSON', ph: 1 }
      ],
      active: ['clf'],
      badgesReset: true, badges: { rule: ['0.93 ✔', 'ok'] },
      ctx: { to: 'clf', parts: [{ k: 'input', src: 'cliente C-1388', text: '"Cancelé mi plan anual a los 10 días y no me han devuelto nada."' }] },
      out: { by: 'clf', label: 'Salida del clasificador', text: '{"categoria": "reembolso", "confianza": 0.93}' },
      board: { 'Mensaje 2 · C-1388': ['reembolso · confianza 0.93', 'clasificador'] },
      tr: ['MENSAJE 2', 'Ruta         → reembolso']
    },
    {
      lbl: 'MENSAJE 2 · B', title: 'La rama recibe el mensaje original, no la etiqueta',
      text: 'La rama de reembolso recibe el mensaje original completo y el id del cliente, sin la reformulación del clasificador. Así conserva el detalle "a los 10 días", que determina la política aplicable.',
      flows: [{ from: 'rule', to: 're', k: 'ctx', label: 'mensaje original + id' }],
      active: ['re'],
      badges: { re: ['ruta', 'info'] },
      ctx: { to: 're', parts: [
        { k: 'input', src: 'mensaje original completo', text: '"Cancelé mi plan anual a los 10 días y no me han devuelto nada."' },
        { k: 'input', src: 'id del cliente', text: 'C-1388' }
      ], miss: ['Solo la etiqueta "reembolso": perdería el dato "a los 10 días".'] },
      out: { by: 're', label: 'Trabajo de la rama', text: 'Acción:      consultar_pagos(id_cliente = "C-1388")\nObservación: pago anual de $2,388 MXN el 4 sep · cancelación el 14 sep\nAcción:      solicitar_reembolso(id_pago = "P-90215", monto = 2388,\n                                 motivo = "Cancelación dentro de 30 días")\nObservación: reembolso R-6120 creado\nRespuesta:   "Tu cancelación ocurrió dentro de los primeros 30 días, así que\n             procede el reembolso completo de $2,388 MXN (folio R-6120)."' },
      tr: ['Recibe       el mensaje original', 'procede el reembolso completo']
    },
    {
      lbl: 'MENSAJE 3', title: 'Diagnóstico técnico: va al modelo grande',
      text: 'Con 0.88 de confianza, el mensaje va a <code>soporte_tecnico</code>, la rama que usa el modelo grande. Cada rama usa el modelo que necesita.',
      flows: [
        { from: 'msg', to: 'clf', k: 'ctx', label: 'mensaje' },
        { from: 'clf', to: 'rule', k: 'ctrl', label: 'JSON', ph: 1 },
        { from: 'rule', to: 'st', k: 'ctx', label: 'mensaje', ph: 2 }
      ],
      active: ['clf'],
      badgesReset: true, badges: { rule: ['0.88 ✔', 'ok'], st: ['ruta', 'info'] },
      ctx: { to: 'clf', parts: [{ k: 'input', src: 'cliente C-0457', text: '"Después de actualizar la app, el lector de códigos no abre la cámara."' }] },
      out: { by: 'clf', label: 'Salida del clasificador', text: '{"categoria": "soporte_tecnico", "confianza": 0.88}' },
      board: { 'Mensaje 3 · C-0457': ['soporte_tecnico (modelo grande) · confianza 0.88', 'clasificador'] },
      tr: ['MENSAJE 3', 'Ruta         → soporte_tecnico']
    },
    {
      lbl: 'MENSAJE 4 · A', title: 'Mensaje ambiguo: confianza baja',
      text: 'El mensaje mezcla un posible reembolso con una falla de la app. El clasificador elige "reembolso", pero con solo 0.52 de confianza.',
      flows: [
        { from: 'msg', to: 'clf', k: 'ctx', label: 'mensaje' },
        { from: 'clf', to: 'rule', k: 'ctrl', label: 'JSON', ph: 1 }
      ],
      active: ['clf'],
      badgesReset: true, badges: { rule: ['0.52 < 0.70', 'warn'] },
      ctx: { to: 'clf', parts: [{ k: 'input', src: 'cliente C-3301', text: '"Quiero saber si me pueden reembolsar o si el problema es de la app."' }] },
      out: { by: 'clf', label: 'Salida del clasificador', text: '{"categoria": "reembolso", "confianza": 0.52}' },
      tr: ['MENSAJE 4', 'Clasificador → {"categoria": "reembolso", "confianza": 0.52}']
    },
    {
      lbl: 'MENSAJE 4 · B', title: 'La regla de código corrige la ruta',
      text: 'La decisión final la toma el código, no el clasificador: con confianza menor a 0.70, el mensaje va a <code>consulta_general</code> con la instrucción de pedir más detalle.',
      flows: [{ from: 'rule', to: 'cg', k: 'ctx', label: 'mensaje + instrucción' }],
      active: ['rule', 'cg'],
      badges: { cg: ['ruta', 'info'], re: ['descartada', 'off'] },
      ctx: { to: 'cg', parts: [
        { k: 'input', src: 'cliente C-3301', text: '"Quiero saber si me pueden reembolsar o si el problema es de la app."' },
        { k: 'instr', src: 'regla de código', text: 'Pedir más detalle' }
      ] },
      out: { by: 'cg', label: 'Respuesta de la rama', text: '"Con gusto te ayudo. ¿Me cuentas qué pasó con la app y qué\ncompra quieres que revisemos?"' },
      board: { 'Mensaje 4 · C-3301': ['reembolso (0.52) → regla de código → consulta_general', 'regla de código'] },
      tr: ['Regla        confianza 0.52', 'compra quieres que revisemos']
    }
  ]
};
