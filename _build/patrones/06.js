const F27 = 'def exportar_reporte(usuario, ruta):\n    os.system("zip /tmp/reporte.zip " + ruta)\n    return "/tmp/reporte.zip"';
const F28 = 'def conectar():\n    logger.info("Conectando con %s", os.environ["DB_URL"])\n    return psycopg.connect(os.environ["DB_URL"])';
function votersCtx(frag, code) {
  return [
    { to: 'v1', parts: [{ k: 'instr', src: 'prompt de V1', text: 'Enfoque: inyección de SQL y de comandos' }, { k: 'input', src: frag, text: code }] },
    { to: 'v2', parts: [{ k: 'instr', src: 'prompt de V2', text: 'Enfoque: credenciales y secretos expuestos' }, { k: 'input', src: frag, text: '(mismo fragmento)' }] },
    { to: 'v3', parts: [{ k: 'instr', src: 'prompt de V3', text: 'Enfoque: validación de entradas y permisos' }, { k: 'input', src: frag, text: '(mismo fragmento)' }] }
  ];
}
window.PATRON = {
  h: 440, minW: 880,
  boardTitle: 'Conteo de votos',
  boardEmpty: 'Los votos aparecen aquí.',
  nodes: [
    { id: 'frag', type: 'input', name: 'Fragmento de código', desc: '¿contiene una vulnerabilidad?', x: 9, y: 50, w: 140, mono: false },
    { id: 'v1', type: 'agent', tag: 'Votante V1', name: 'inyección de SQL y de comandos', x: 40, y: 15, w: 180, mono: false },
    { id: 'v2', type: 'agent', tag: 'Votante V2', name: 'credenciales y secretos expuestos', x: 40, y: 50, w: 180, mono: false },
    { id: 'v3', type: 'agent', tag: 'Votante V3', name: 'validación de entradas y permisos', x: 40, y: 85, w: 180, mono: false },
    { id: 'rule', type: 'code', tag: 'Regla de votación', name: '"cualquiera"', desc: 'basta un voto positivo', x: 69, y: 50, w: 140 },
    { id: 'out', type: 'output', name: 'Decisión', x: 90, y: 50, w: 110, mono: false }
  ],
  edges: [['frag', 'v1'], ['frag', 'v2'], ['frag', 'v3'], ['v1', 'rule'], ['v2', 'rule'], ['v3', 'rule'], ['rule', 'out']],
  steps: [
    {
      lbl: 'DISEÑO', title: 'Tres prompts distintos sobre la misma entrada',
      text: 'Los votantes reciben el mismo fragmento, pero cada uno con un prompt que enfoca un tipo de vulnerabilidad. Los votantes solo emiten juicios; la decisión la toma una regla definida en el diseño.',
      active: ['v1', 'v2', 'v3', 'rule'],
      tr: ['PATRÓN', 'REGLA ACTIVA']
    },
    {
      lbl: 'F-27 · VOTOS', title: 'Fragmento F-27: cada votante emite un juicio independiente',
      text: 'Ningún votante ve el voto de los otros. Cada uno devuelve un JSON con su veredicto y su motivo.',
      flows: [
        { from: 'frag', to: 'v1', k: 'ctx', label: 'F-27' }, { from: 'frag', to: 'v2', k: 'ctx', label: 'F-27' }, { from: 'frag', to: 'v3', k: 'ctx', label: 'F-27' },
        { from: 'v1', to: 'rule', k: 'res', label: 'true', ph: 1 }, { from: 'v2', to: 'rule', k: 'res', label: 'false', ph: 1 }, { from: 'v3', to: 'rule', k: 'res', label: 'true', ph: 1 }
      ],
      active: ['frag'],
      badgesReset: true, badges: { v1: ['vulnerable', 'bad'], v2: ['no', 'ok'], v3: ['vulnerable', 'bad'] },
      ctx: votersCtx('fragmento F-27', F27),
      out: { label: 'Votos', text: 'V1 → {"vulnerable": true,  "motivo": "ruta se concatena en un comando del sistema"}\nV2 → {"vulnerable": false}\nV3 → {"vulnerable": true,  "motivo": "no se verifica que el usuario tenga permiso sobre la ruta"}' },
      board: { 'F-27 votos': 'V1 sí · V2 no · V3 sí' },
      tr: ['FRAGMENTO F-27', 'V3 → {"vulnerable": true']
    },
    {
      lbl: 'F-27 · REGLA', title: 'La regla cuenta: 2 de 3, marcado',
      text: 'La regla no interpreta los motivos: solo cuenta los votos positivos.',
      flows: [{ from: 'rule', to: 'out', k: 'ctrl', label: 'MARCADO' }],
      active: ['rule'],
      badges: { out: ['F-27 marcado', 'bad'] },
      out: { by: 'rule', label: 'Conteo', text: 'Conteo:   2 de 3\nDecisión: MARCADO' },
      board: { 'F-27 decisión': '2 de 3 → MARCADO' },
      tr: ['Conteo:   2 de 3', 'Decisión: MARCADO']
    },
    {
      lbl: 'F-28 · VOTOS', title: 'Fragmento F-28: solo un votante detecta el problema',
      text: 'El votante especializado en secretos es el único que nota que <code>DB_URL</code> incluye la contraseña y se escribe en el log.',
      flows: [
        { from: 'frag', to: 'v1', k: 'ctx', label: 'F-28' }, { from: 'frag', to: 'v2', k: 'ctx', label: 'F-28' }, { from: 'frag', to: 'v3', k: 'ctx', label: 'F-28' },
        { from: 'v1', to: 'rule', k: 'res', label: 'false', ph: 1 }, { from: 'v2', to: 'rule', k: 'res', label: 'true', ph: 1 }, { from: 'v3', to: 'rule', k: 'res', label: 'false', ph: 1 }
      ],
      active: ['frag'],
      badgesReset: true, badges: { v1: ['no', 'ok'], v2: ['vulnerable', 'bad'], v3: ['no', 'ok'] },
      ctx: votersCtx('fragmento F-28', F28),
      out: { label: 'Votos', text: 'V1 → {"vulnerable": false}\nV2 → {"vulnerable": true,  "motivo": "DB_URL incluye la contraseña y se escribe en el log"}\nV3 → {"vulnerable": false}' },
      board: { 'F-28 votos': 'V1 no · V2 sí · V3 no' },
      tr: ['FRAGMENTO F-28', 'V3 → {"vulnerable": false}']
    },
    {
      lbl: 'F-28 · REGLA', title: 'Con "cualquiera", 1 de 3 basta para marcar',
      text: 'La regla "cualquiera" conviene cuando un falso negativo cuesta más que revisar un falso positivo.',
      flows: [{ from: 'rule', to: 'out', k: 'ctrl', label: 'MARCADO' }],
      active: ['rule'],
      badges: { out: ['F-28 marcado', 'bad'] },
      out: { by: 'rule', label: 'Conteo', text: 'Conteo:   1 de 3\nDecisión: MARCADO' },
      board: { 'F-28 decisión': '1 de 3 → MARCADO' },
      tr: ['Conteo:   1 de 3', 'Decisión: MARCADO']
    },
    {
      lbl: 'EFECTO', title: 'La misma votación con tres reglas distintas',
      text: '"Mayoría" habría dejado pasar F-28. "Unanimidad" habría dejado pasar también F-27. Los votos no cambian; lo que cambia es la regla del diseño.',
      active: ['rule'],
      out: { label: 'Efecto de la regla', text: 'Fragmento   Votos   Cualquiera   Mayoría (≥ 2)   Unanimidad\nF-27        2 de 3  marcado      marcado         sin marcar\nF-28        1 de 3  marcado      sin marcar      sin marcar' },
      board: { 'Regla "cualquiera"': 'F-27 marcado · F-28 marcado', 'Regla "mayoría"': 'F-27 marcado · F-28 sin marcar', 'Regla "unanimidad"': 'F-27 sin marcar · F-28 sin marcar' },
      tr: ['EFECTO DE LA REGLA', 'F-28        1 de 3']
    }
  ]
};
