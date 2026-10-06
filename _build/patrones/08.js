const W_INSTR = 'Consulta los incidentes de la región R en 2026-T3. Devuelve el total,\nlas 3 causas principales con su conteo y un ticket de ejemplo.\nNo redactes conclusiones.';
window.PATRON = {
  h: 460, minW: 900,
  boardTitle: 'Resultados de los workers',
  boardEmpty: 'El orquestador todavía no crea workers.',
  nodes: [
    { id: 'sol', type: 'input', name: 'Solicitud', desc: 'incidentes del T3 por región', x: 8, y: 50, w: 120, mono: false },
    { id: 'orq', type: 'agent', name: 'orquestador', desc: 'planea, crea workers y sintetiza', x: 30, y: 50, w: 150 },
    { id: 'w1', type: 'agent', tag: 'Worker W1', name: 'Norte', desc: 'solo lectura', x: 60, y: 12, w: 140, hidden: true, mono: false },
    { id: 'w2', type: 'agent', tag: 'Worker W2', name: 'Centro', desc: 'solo lectura', x: 60, y: 37, w: 140, hidden: true, mono: false },
    { id: 'w3', type: 'agent', tag: 'Worker W3', name: 'Occidente', desc: 'solo lectura', x: 60, y: 63, w: 140, hidden: true, mono: false },
    { id: 'w4', type: 'agent', tag: 'Worker W4', name: 'Sureste', desc: 'solo lectura', x: 60, y: 88, w: 140, hidden: true, mono: false },
    { id: 'out', type: 'output', name: 'Resumen ejecutivo', x: 88, y: 50, w: 130, mono: false }
  ],
  edges: [['sol', 'orq'], ['orq', 'w1'], ['orq', 'w2'], ['orq', 'w3'], ['orq', 'w4'], ['orq', 'out']],
  steps: [
    {
      lbl: 'SOLICITUD', title: 'El orquestador recibe la solicitud',
      text: 'Al inicio no existen workers. El orquestador todavía no sabe cuántas subtareas habrá.',
      flows: [{ from: 'sol', to: 'orq', k: 'ctx', label: 'solicitud' }],
      active: ['orq'],
      ctx: { to: 'orq', parts: [{ k: 'input', src: 'solicitud', text: '"Resume los incidentes de soporte del tercer trimestre por región y\nseñala la causa más frecuente en cada una."' }] },
      tr: ['PATRÓN', 'señala la causa más frecuente']
    },
    {
      lbl: 'PLANEACIÓN', title: 'El orquestador consulta los datos antes de dividir el trabajo',
      text: 'Primero averigua cuántas regiones tienen incidentes. Las subtareas se definen durante la ejecución, no en el diseño: en el cuarto trimestre podrían ser cinco regiones.',
      active: ['orq'],
      out: { by: 'orq', label: 'Acción', text: 'Acción:      listar_regiones_con_incidentes(trimestre = "2026-T3")\nObservación: Norte, Centro, Occidente, Sureste' },
      board: { regiones: ['Norte, Centro, Occidente, Sureste', 'orquestador'] },
      tr: ['ORQUESTADOR · planeación', 'Observación: Norte']
    },
    {
      lbl: 'CREA WORKERS', title: 'Cuatro workers con la misma instrucción acotada',
      text: 'El orquestador crea un worker por región. Todos reciben la misma instrucción, con su región sustituida. La instrucción les prohíbe redactar conclusiones.',
      show: ['w1', 'w2', 'w3', 'w4'],
      flows: [
        { from: 'orq', to: 'w1', k: 'ctx', label: 'instrucción (Norte)' }, { from: 'orq', to: 'w2', k: 'ctx', label: 'instrucción (Centro)' },
        { from: 'orq', to: 'w3', k: 'ctx', label: 'instrucción (Occidente)' }, { from: 'orq', to: 'w4', k: 'ctx', label: 'instrucción (Sureste)' }
      ],
      active: ['orq'],
      ctx: { to: 'w1', title: 'Recibe cada worker', parts: [
        { k: 'instr', src: 'orquestador', text: '"' + W_INSTR + '"' },
        { k: 'instr', src: 'R', text: 'Norte | Centro | Occidente | Sureste (una por worker)' }
      ], miss: ['Los resultados de los otros workers.'] },
      out: { by: 'orq', label: 'Decisión', text: 'crear 4 workers, uno por región, con la misma instrucción acotada' },
      tr: ['Decisión:    crear 4 workers', 'No redactes conclusiones']
    },
    {
      lbl: 'WORKERS', title: 'Los workers devuelven datos estructurados',
      text: 'En paralelo y en solo lectura, cada worker devuelve el mismo formato: total, tres causas con conteo y un ticket de ejemplo.',
      flows: [
        { from: 'w1', to: 'orq', k: 'res', label: 'total 412' }, { from: 'w2', to: 'orq', k: 'res', label: 'total 655' },
        { from: 'w3', to: 'orq', k: 'res', label: 'total 298' }, { from: 'w4', to: 'orq', k: 'res', label: 'total 187' }
      ],
      active: ['w1', 'w2', 'w3', 'w4'],
      badges: { w1: ['listo', 'ok'], w2: ['listo', 'ok'], w3: ['listo', 'ok'], w4: ['listo', 'ok'] },
      board: {
        'W1 Norte': ['total 412 · fibra 168 · config. de módem 97 · facturación 61 · ej. T-30418', 'W1'],
        'W2 Centro': ['total 655 · config. de módem 240 · fibra 151 · facturación 118 · ej. T-31902', 'W2'],
        'W3 Occidente': ['total 298 · config. de módem 121 · facturación 74 · fibra 52 · ej. T-30777', 'W3'],
        'W4 Sureste': ['total 187 · fibra 89 · facturación 41 · config. de módem 30 · ej. T-32050', 'W4']
      },
      tr: ['WORKERS (en paralelo', 'W4 Sureste']
    },
    {
      lbl: 'SÍNTESIS', title: 'El orquestador conserva las conclusiones',
      text: 'Los workers investigaron; el orquestador decide y concluye con un solo criterio para "causa principal". Si cada worker hubiera redactado su sección, llegarían cuatro estilos y cuatro criterios distintos.',
      flows: [{ from: 'orq', to: 'out', k: 'res', label: 'resumen ejecutivo' }],
      active: ['orq'],
      ctx: { to: 'orq', parts: [
        { k: 'input', src: 'solicitud', text: 'Incidentes del T3 por región y causa más frecuente' },
        { k: 'result', src: 'W1 a W4', text: 'Cuatro resultados con el mismo formato' }
      ] },
      out: { by: 'orq', label: 'Síntesis', text: 'Total del trimestre: 412 + 655 + 298 + 187 = 1,552 incidentes\nCausa más frecuente por región:\n    Norte      fallas de fibra           168 de 412  (41%)\n    Centro     configuración de módem    240 de 655  (37%)\n    Occidente  configuración de módem    121 de 298  (41%)\n    Sureste    fallas de fibra            89 de 187  (48%)\nObservación transversal: la configuración de módem es la causa principal en dos de\ncuatro regiones (Centro y Occidente), lo que sugiere revisar la guía de instalación.' },
      tr: ['SÍNTESIS · orquestador', 'RESULTADO']
    }
  ]
};
