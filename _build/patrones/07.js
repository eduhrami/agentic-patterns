window.PATRON = {
  h: 460, minW: 900,
  boardTitle: 'Puntajes y agregación',
  boardEmpty: 'Los puntajes de los analistas aparecen aquí.',
  nodes: [
    { id: 'sol', type: 'input', name: 'Solicitud', desc: 'horizonte de dos semanas', x: 8, y: 50, w: 115, mono: false },
    { id: 'orq', type: 'agent', name: 'orquestador', desc: 'selección dinámica', x: 27, y: 50, w: 140 },
    { id: 'fun', type: 'agent', name: 'fundamental', desc: 'estados financieros y posición competitiva', x: 55, y: 12, w: 185 },
    { id: 'tec', type: 'agent', name: 'tecnico', desc: 'precio, volumen y momentum', x: 55, y: 37, w: 185 },
    { id: 'sen', type: 'agent', name: 'sentimiento', desc: 'noticias y redes sociales', x: 55, y: 62, w: 185 },
    { id: 'esg', type: 'agent', name: 'esg', desc: 'reportes ambientales, sociales y de gobierno corporativo', x: 55, y: 88, w: 185 },
    { id: 'agg', type: 'code', tag: 'Agregación (código)', name: 'promedio ponderado', desc: '0.4 · 0.3 · 0.3', x: 80, y: 37, w: 140, mono: false },
    { id: 'out', type: 'output', name: 'Recomendación', desc: 'para el gestor de portafolio', x: 80, y: 80, w: 140, mono: false }
  ],
  edges: [['sol', 'orq'], ['orq', 'fun'], ['orq', 'tec'], ['orq', 'sen'], ['orq', 'esg'], ['fun', 'agg'], ['tec', 'agg'], ['sen', 'agg'], ['agg', 'out']],
  steps: [
    {
      lbl: 'DISEÑO', title: 'Cuatro analistas registrados, una fórmula para combinarlos',
      text: 'El orquestador decide qué analistas invocar según la solicitud. Sus puntajes se combinan con una fórmula en código, sin un LLM que sintetice.',
      active: ['orq', 'agg'],
      tr: ['PATRÓN', 'esg           reportes ambientales']
    },
    {
      lbl: 'SELECCIÓN', title: 'El orquestador elige a quién invocar',
      text: 'Con un horizonte de dos semanas, el orquestador omite ESG porque ese análisis aporta a horizontes largos. Es la <b>selección dinámica</b>: los agentes invocados dependen de la solicitud.',
      flows: [{ from: 'sol', to: 'orq', k: 'ctx', label: 'solicitud' }],
      active: ['orq'],
      badges: { esg: ['omitido', 'off'] },
      ctx: { to: 'orq', parts: [{ k: 'input', src: 'solicitud', text: '"Con horizonte de dos semanas, ¿conviene mantener la posición en GRPX\n(empresa ficticia) antes de su reporte trimestral?"' }] },
      out: { by: 'orq', label: 'Decisión', text: 'Pensamiento: el horizonte es de dos semanas; el análisis ESG aporta a horizontes largos.\nInvoca:      fundamental, tecnico, sentimiento\nOmite:       esg' },
      board: { 'agentes invocados': ['fundamental, tecnico, sentimiento (esg omitido)', 'orquestador'] },
      tr: ['SOLICITUD', 'Omite:       esg']
    },
    {
      lbl: 'PARALELO', title: 'Tres analistas trabajan en paralelo',
      text: 'Cada analista devuelve un puntaje de −2 a +2 con su justificación. El agente fundamental usa su propia orquestación interna: consulta a dos sub-agentes.',
      flows: [
        { from: 'orq', to: 'fun', k: 'ctx', label: 'invoca' }, { from: 'orq', to: 'tec', k: 'ctx', label: 'invoca' }, { from: 'orq', to: 'sen', k: 'ctx', label: 'invoca' },
        { from: 'fun', to: 'agg', k: 'res', label: '+1', ph: 1 }, { from: 'tec', to: 'agg', k: 'res', label: '−1', ph: 1 }, { from: 'sen', to: 'agg', k: 'res', label: '0', ph: 1 }
      ],
      active: ['fun', 'tec', 'sen'],
      badges: { fun: ['+1', 'ok'], tec: ['−1', 'bad'], sen: ['0', 'info'] },
      out: { label: 'Resultados (puntaje de −2 a +2)', text: 'fundamental → +1   márgenes estables y deuda baja\n                   (internamente consulta a dos sub-agentes: estados_financieros y competencia)\ntecnico     → −1   el precio cotiza por debajo de su promedio de 50 días\nsentimiento →  0   noticias mixtas antes del reporte' },
      board: { fundamental: ['+1 · márgenes estables y deuda baja', 'fundamental'], tecnico: ['−1 · precio debajo de su promedio de 50 días', 'tecnico'], sentimiento: ['0 · noticias mixtas antes del reporte', 'sentimiento'] },
      tr: ['EJECUCIÓN EN PARALELO', 'sentimiento →  0']
    },
    {
      lbl: 'AGREGACIÓN', title: 'Una fórmula decide el resultado',
      text: 'La agregación recibe solo los puntajes. No hay un LLM que combine interpretaciones: la fórmula y la regla de umbrales están escritas en el diseño.',
      flows: [{ from: 'agg', to: 'out', k: 'res', label: 'MANTENER' }],
      active: ['agg'],
      badges: { agg: ['+0.1', 'info'] },
      ctx: { to: 'agg', parts: [{ k: 'result', src: 'tres analistas', text: 'fundamental +1 · tecnico −1 · sentimiento 0' }], miss: ['Las justificaciones de cada análisis: solo usa los puntajes.'] },
      out: [
        { by: 'agg', label: 'Cálculo', text: 'Pesos:     fundamental 0.4 · tecnico 0.3 · sentimiento 0.3\nPuntaje:   0.4 × (+1) + 0.3 × (−1) + 0.3 × (0) = +0.1\nRegla:     > +0.5 aumentar · de −0.5 a +0.5 mantener · < −0.5 reducir\nResultado: MANTENER' },
        { label: 'Salida', text: 'Recomendación: mantener la posición. Se adjuntan los tres análisis con sus\npuntajes para revisión del gestor de portafolio.' }
      ],
      board: { 'puntaje ponderado': ['+0.1 → MANTENER', 'código'] },
      tr: ['AGREGACIÓN (código)', 'puntajes para revisión']
    }
  ]
};
