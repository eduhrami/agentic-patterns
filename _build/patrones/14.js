window.PATRON = {
  h: 470, minW: 900,
  boardTitle: 'Hilo compartido',
  boardEmpty: 'El hilo está vacío.',
  nodes: [
    { id: 'prop', type: 'input', name: 'Propuesta P-2026-14', desc: 'Parque Las Lomas (ficticio)', x: 10, y: 14, w: 150, mono: false },
    { id: 'man', type: 'agent', tag: 'Chat manager', name: 'modera los turnos', desc: 'máximo 6 rondas · fin: ningún participante tiene objeciones', x: 82, y: 14, w: 190, mono: false },
    { id: 'hilo', type: 'state', name: 'Hilo compartido', desc: 'todos los participantes leen el mismo hilo', x: 46, y: 45, w: 220, mono: false },
    { id: 'com', type: 'agent', name: 'comunidad', desc: 'accesibilidad y uso esperado', x: 12, y: 85, w: 150 },
    { id: 'amb', type: 'agent', name: 'ambiental', desc: 'impacto ecológico y normativa', x: 36, y: 85, w: 150 },
    { id: 'pre', type: 'agent', name: 'presupuesto', desc: 'costos de construcción y operación', x: 60, y: 85, w: 150 },
    { id: 'ana', type: 'human', name: 'Ana R.', desc: 'Departamento de Parques', x: 84, y: 85, w: 140, mono: false }
  ],
  edges: [['prop', 'hilo'], ['man', 'hilo'], ['hilo', 'com'], ['hilo', 'amb'], ['hilo', 'pre'], ['hilo', 'ana']],
  steps: [
    {
      lbl: 'PROPUESTA', title: 'La propuesta entra al hilo compartido',
      text: 'Tres agentes de solo lectura y una empleada del departamento evaluarán la propuesta. Todos leen el mismo hilo. El chat manager decide quién habla y cuándo termina la discusión.',
      flows: [{ from: 'prop', to: 'hilo', k: 'ctx', label: 'propuesta' }],
      active: ['hilo'],
      board: { 'propuesta': ['3.2 ha · cancha de pasto sintético · andador de 1.1 km · 120 árboles\nconstrucción: $18.5 M MXN · partida anual de mantenimiento disponible: $1.3 M MXN', 'entrada'] },
      tr: ['PATRÓN', 'partida anual de mantenimiento']
    },
    {
      lbl: 'RONDA 1', title: 'Cada participante analiza desde su ángulo',
      text: 'El manager da la palabra a tres agentes. Cada mensaje se agrega al hilo, así que el siguiente participante ya lo puede leer.',
      flows: [
        { from: 'man', to: 'com', k: 'ctrl', label: 'turno', ph: 0 }, { from: 'com', to: 'hilo', k: 'res', label: 'mensaje', ph: 1 },
        { from: 'man', to: 'amb', k: 'ctrl', label: 'turno', ph: 2 }, { from: 'amb', to: 'hilo', k: 'res', label: 'mensaje', ph: 3 },
        { from: 'man', to: 'pre', k: 'ctrl', label: 'turno', ph: 4 }, { from: 'pre', to: 'hilo', k: 'res', label: 'mensaje', ph: 5 }
      ],
      active: ['man'],
      badges: { com: ['objeción', 'bad'], amb: ['objeción', 'bad'], pre: ['objeción', 'bad'] },
      ctx: { title: 'Recibe cada participante', parts: [{ k: 'hist', src: 'hilo compartido', text: 'La propuesta y los mensajes anteriores de la ronda' }] },
      board: {
        'R1 · comunidad': ['El andador no tiene rampas en el lado poniente, donde está la escuela primaria.', 'comunidad'],
        'R1 · ambiental': ['El pasto sintético sella 0.7 ha de suelo permeable en una zona con encharcamientos.', 'ambiental'],
        'R1 · presupuesto': ['Mantenimiento anual con pasto sintético: $1.4 M, que incluye $0.4 M de reserva\npara reponer el pasto. Supera la partida de $1.3 M.', 'presupuesto']
      },
      tr: ['RONDA 1', 'Supera la partida de $1.3 M.']
    },
    {
      lbl: 'RONDA 2', title: 'El manager propone evaluar un cambio',
      text: 'Con pasto natural mejora la permeabilidad y baja la construcción, pero el mantenimiento sigue arriba de la partida.',
      flows: [
        { from: 'man', to: 'hilo', k: 'ctrl', label: 'evaluar pasto natural', ph: 0 },
        { from: 'amb', to: 'hilo', k: 'res', label: 'mensaje', ph: 1 },
        { from: 'pre', to: 'hilo', k: 'res', label: 'mensaje', ph: 2 }
      ],
      active: ['man'],
      badges: { amb: ['revisa', 'warn'], pre: ['objeción', 'bad'] },
      board: {
        'R2 · manager': ['Pide evaluar el cambio a pasto natural', 'chat manager'],
        'R2 · ambiental': ['El pasto natural conserva la permeabilidad, pero requiere riego.', 'ambiental'],
        'R2 · presupuesto': ['La construcción baja $2.1 M. El mantenimiento elimina la reserva de $0.4 M y\nsuma $0.35 M de cuidado y riego: $1.35 M, todavía arriba de la partida.', 'presupuesto']
      },
      tr: ['RONDA 2', 'todavía arriba de la partida']
    },
    {
      lbl: 'RONDA 3', title: 'La persona aporta el dato que destraba el presupuesto',
      text: 'Ana R. menciona el convenio de agua tratada. Como el hilo es compartido, presupuesto lo usa en el mismo turno y el mantenimiento queda dentro de la partida.',
      flows: [
        { from: 'ana', to: 'hilo', k: 'human', label: 'convenio de agua tratada', ph: 0 },
        { from: 'hilo', to: 'pre', k: 'ctx', label: 'hilo completo', ph: 1 },
        { from: 'pre', to: 'hilo', k: 'res', label: '$1.25 M', ph: 2 },
        { from: 'com', to: 'hilo', k: 'res', label: 'rampas $0.3 M', ph: 3 }
      ],
      active: ['ana'],
      badges: { pre: ['dentro de partida', 'ok'], com: ['propone', 'warn'] },
      ctx: { to: 'pre', parts: [
        { k: 'hist', src: 'hilo compartido', text: 'Propuesta · ronda 1 · ronda 2 ($1.35 M, arriba de la partida)' },
        { k: 'human', src: 'Ana R.', text: 'El municipio tiene un convenio de agua tratada para riego a la mitad del costo.' }
      ] },
      board: {
        'R3 · Ana R.': ['El municipio tiene un convenio de agua tratada para riego a la mitad del costo.', 'persona'],
        'R3 · presupuesto': ['De los $0.35 M, $0.2 M son riego; con agua tratada bajan a $0.1 M.\nMantenimiento: $1.25 M, dentro de la partida.', 'presupuesto'],
        'R3 · comunidad': ['Dos rampas en el lado poniente cuestan $0.3 M de construcción.', 'comunidad']
      },
      tr: ['RONDA 3', 'Dos rampas en el lado poniente']
    },
    {
      lbl: 'RONDA 4', title: 'Resumen y criterio de fin',
      text: 'El manager resume la propuesta ajustada y pregunta a todos. Nadie tiene objeciones: el criterio de fin se cumple en la ronda 4 de 6.',
      flows: [
        { from: 'man', to: 'hilo', k: 'ctrl', label: 'resumen', ph: 0 },
        { from: 'com', to: 'hilo', k: 'res', label: 'sin objeciones', ph: 1 }, { from: 'amb', to: 'hilo', k: 'res', label: 'sin objeciones', ph: 1 },
        { from: 'pre', to: 'hilo', k: 'res', label: 'sin objeciones', ph: 1 }, { from: 'ana', to: 'hilo', k: 'human', label: 'sin objeciones', ph: 1 }
      ],
      active: ['man'],
      badges: { com: ['sin objeciones', 'ok'], amb: ['sin objeciones', 'ok'], pre: ['sin objeciones', 'ok'], ana: ['sin objeciones', 'ok'], man: ['fin: ronda 4 de 6', 'ok'] },
      board: {
        'R4 · manager': ['Pasto natural con riego de agua tratada · dos rampas en el lado poniente\nConstrucción: 18.5 − 2.1 + 0.3 = $16.7 M · mantenimiento: $1.25 M al año', 'chat manager'],
        'R4 · votación': ['comunidad, ambiental, presupuesto y persona: sin objeciones', 'todos']
      },
      tr: ['RONDA 4', 'RESULTADO']
    }
  ]
};
