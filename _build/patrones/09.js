window.PATRON = {
  h: 480, minW: 900,
  boardTitle: 'Reporte en construcción',
  boardEmpty: 'El reporte todavía no tiene secciones.',
  groups: [
    { x: 1.5, y: 4, w: 46, hh: 30, label: 'Nivel 1' },
    { x: 26, y: 40, w: 30, hh: 30, label: 'Nivel 2' },
    { x: 62, y: 40, w: 36, hh: 56, label: 'Nivel 3' }
  ],
  nodes: [
    { id: 'task', type: 'input', name: 'Tarea', desc: 'reporte trimestral de satisfacción 2026-T3', x: 11, y: 19, w: 140, mono: false },
    { id: 'n1', type: 'agent', tag: 'N1', name: 'redactor_reporte', desc: 'herramienta: asistente_investigacion', x: 35, y: 19, w: 175 },
    { id: 'n2', type: 'agent', tag: 'N2 · sub-agente como herramienta', name: 'asistente_investigacion', desc: 'herramientas: busqueda_interna, resumidor', x: 41, y: 55, w: 190 },
    { id: 'bus', type: 'agent', tag: 'N3', name: 'busqueda_interna', x: 80, y: 55, w: 160 },
    { id: 'res', type: 'agent', tag: 'N3', name: 'resumidor', x: 80, y: 84, w: 160 },
    { id: 'out', type: 'output', name: 'Reporte de tres secciones', x: 80, y: 19, w: 160, mono: false }
  ],
  edges: [['task', 'n1'], ['n1', 'n2'], ['n2', 'bus'], ['n2', 'res'], ['n1', 'out']],
  steps: [
    {
      lbl: 'NIVELES', title: 'Tres niveles de agentes',
      text: 'N1 escribe el reporte. Para N1, el asistente de investigación es una herramienta más; ese asistente, a su vez, coordina a dos sub-agentes.',
      active: ['n1', 'n2', 'bus', 'res'],
      tr: ['PATRÓN', 'N3 busqueda_interna · resumidor']
    },
    {
      lbl: 'N1 · SECCIÓN 1', title: 'N1 escribe con los datos que ya tiene',
      text: 'N1 recibe la tarea y escribe la primera sección. Antes de la segunda, nota que necesita explicar la caída de agosto.',
      flows: [{ from: 'task', to: 'n1', k: 'ctx', label: 'tarea' }],
      active: ['n1'],
      ctx: { to: 'n1', parts: [{ k: 'input', src: 'tarea', text: '"Redacta el reporte trimestral de satisfacción del cliente (2026-T3)."' }] },
      out: { by: 'n1', label: 'Produce', text: 'Sección 1 con los datos disponibles: NPS julio 42 · agosto 35 · septiembre 39\nPensamiento: antes de la sección 2 necesito explicar la caída de agosto.' },
      board: { 'sección 1': ['NPS julio 42 · agosto 35 · septiembre 39', 'N1'] },
      tr: ['TAREA', 'Pensamiento: antes de la sección 2']
    },
    {
      lbl: 'N1 → N2', title: 'N1 delega una pregunta acotada y espera',
      text: 'N1 delega solo una parte de su tarea. Pide causas <b>con evidencia</b>, porque las necesita para sustentar la sección 2.',
      flows: [{ from: 'n1', to: 'n2', k: 'ctx', label: 'pregunta acotada' }],
      active: ['n1'],
      badges: { n1: ['espera', 'warn'] },
      ctx: { to: 'n2', parts: [{ k: 'instr', src: 'N1 redactor_reporte', text: '"¿Qué explica la caída del NPS de 42 a 35 en\nagosto de 2026? Devuelve causas con evidencia."' }] },
      tr: ['Llama:       asistente_investigacion', 'Espera el resultado']
    },
    {
      lbl: 'N2 → N3', title: 'N2 decide cómo investigar: primera búsqueda',
      text: 'N1 decidió qué preguntar; N2 decide cómo investigarlo.',
      flows: [
        { from: 'n2', to: 'bus', k: 'ctx', label: 'consulta' },
        { from: 'bus', to: 'n2', k: 'res', label: '38% tiempo de espera', ph: 1 }
      ],
      active: ['n2'],
      ctx: { to: 'bus', parts: [{ k: 'instr', src: 'N2', text: '"comentarios de detractores, agosto 2026"' }] },
      out: { by: 'bus', label: 'Devuelve a N2', text: '1,180 comentarios; 38% mencionan el tiempo de espera' },
      tr: ['N2 · asistente_investigacion', '38% mencionan el tiempo de espera']
    },
    {
      lbl: 'N2 → N3', title: 'Segunda búsqueda: el dato que confirma la hipótesis',
      text: 'La primera búsqueda sugirió el tiempo de espera; N2 lo verifica con una segunda búsqueda.',
      flows: [
        { from: 'n2', to: 'bus', k: 'ctx', label: 'consulta' },
        { from: 'bus', to: 'n2', k: 'res', label: '4 → 11 min', ph: 1 }
      ],
      active: ['n2'],
      ctx: { to: 'bus', parts: [{ k: 'instr', src: 'N2', text: '"tiempo promedio de espera en la línea telefónica, julio y agosto 2026"' }] },
      out: { by: 'bus', label: 'Devuelve a N2', text: 'julio 4 min · agosto 11 min' },
      tr: ['tiempo promedio de espera', 'julio 4 min · agosto 11 min']
    },
    {
      lbl: 'N2 → N3', title: 'El resumidor combina las dos búsquedas',
      text: 'El resumidor recibe los resultados de las dos búsquedas y encuentra la coincidencia.',
      flows: [
        { from: 'n2', to: 'res', k: 'ctx', label: 'resultados de las búsquedas' },
        { from: 'res', to: 'n2', k: 'res', label: 'coincidencia', ph: 1 }
      ],
      active: ['n2'],
      ctx: { to: 'res', parts: [
        { k: 'result', src: 'búsqueda 1', text: '1,180 comentarios; 38% mencionan el tiempo de espera' },
        { k: 'result', src: 'búsqueda 2', text: 'julio 4 min · agosto 11 min' }
      ] },
      out: { by: 'res', label: 'Devuelve a N2', text: 'la caída coincide con el aumento del tiempo de espera' },
      tr: ['Llama:   resumidor', 'la caída coincide']
    },
    {
      lbl: 'N2 → N1', title: 'N2 devuelve causa y evidencia, no las búsquedas',
      text: 'N2 entrega a N1 una respuesta compacta con la causa y su evidencia. Las búsquedas detalladas quedan en el contexto de N2 y no ocupan la ventana de contexto de N1.\n\nSi N2 hubiera devuelto solo "tiempo de espera", sin la evidencia, N1 no podría sustentar la sección 2.',
      flows: [{ from: 'n2', to: 'n1', k: 'res', label: 'causa + evidencia' }],
      active: ['n2'],
      badges: { n1: null },
      ctx: { to: 'n1', parts: [{ k: 'result', src: 'asistente_investigacion', text: 'Causa principal: el tiempo de espera pasó de 4 a 11 minutos.\nEvidencia: 38% de 1,180 comentarios de detractores lo mencionan.' }],
        miss: ['Las búsquedas de N3: quedaron en el contexto de N2.'] },
      tr: ['Devuelve a N1:', 'Evidencia: 38% de 1,180']
    },
    {
      lbl: 'N1 · CONTINÚA', title: 'N1 retoma su propio razonamiento',
      text: 'N1 conservó el hilo y el estado mientras esperaba. Con la respuesta escribe las secciones 2 y 3.',
      flows: [{ from: 'n1', to: 'out', k: 'res', label: 'reporte' }],
      active: ['n1'],
      board: {
        'sección 2': ['Causa: el tiempo de espera pasó de 4 a 11 minutos (38% de 1,180 comentarios de detractores)', 'N1'],
        'sección 3': ['Recuperación a 39 en septiembre y recomendaciones', 'N1']
      },
      tr: ['N1 · redactor_reporte (continúa)', 'RESULTADO']
    }
  ]
};
