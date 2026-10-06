const ORIG = '"La tarde se deshizo sobre los tejados como una promesa que nadie había pedido."';
const CRIT = 'C1 fidelidad de sentido · C2 conserva la imagen principal · C3 registro literario';
window.PATRON = {
  h: 420, minW: 860,
  boardTitle: 'Iteraciones',
  boardEmpty: 'Todavía no hay versiones.',
  nodes: [
    { id: 'orig', type: 'input', name: 'Original y criterios', desc: 'fragmento literario en español', x: 10, y: 68, w: 140, mono: false },
    { id: 'tra', type: 'agent', tag: 'Maker', name: 'traductor', x: 38, y: 30, w: 150 },
    { id: 'eva', type: 'agent', tag: 'Checker', name: 'evaluador', desc: 'C1 · C2 · C3', x: 68, y: 30, w: 150 },
    { id: 'lim', type: 'code', tag: 'Límite', name: '3 iteraciones', desc: 'al alcanzarlo, escalar a una persona', x: 68, y: 82, w: 170, mono: false },
    { id: 'out', type: 'output', name: 'Traducción aprobada', x: 91, y: 30, w: 120, mono: false }
  ],
  edges: [['orig', 'tra'], ['tra', 'eva'], ['orig', 'eva'], ['eva', 'lim'], ['eva', 'out']],
  steps: [
    {
      lbl: 'DISEÑO', title: 'Un traductor, un evaluador y un límite',
      text: 'El traductor propone; el evaluador revisa contra tres criterios y devuelve retroalimentación específica. El ciclo termina al aprobar o al alcanzar el límite de iteraciones.',
      active: ['tra', 'eva', 'lim'],
      tr: ['PATRÓN', 'LÍMITE']
    },
    {
      lbl: 'ITER 1 · MAKER', title: 'El traductor propone la versión 1',
      text: 'El traductor recibe el original y los criterios con los que lo van a evaluar.',
      flows: [{ from: 'orig', to: 'tra', k: 'ctx', label: 'original + criterios' }],
      active: ['tra'],
      ctx: { to: 'tra', parts: [{ k: 'input', src: 'original', text: ORIG }, { k: 'instr', src: 'criterios', text: CRIT }] },
      out: { by: 'tra', label: 'Versión 1', text: '"The afternoon fell apart over the roofs like a promise nobody asked for."' },
      board: { iteración: '1 de 3', 'versión 1': ['"The afternoon fell apart over the roofs like a promise nobody asked for."', 'traductor'] },
      tr: ['ORIGINAL', 'The afternoon fell apart']
    },
    {
      lbl: 'ITER 1 · CHECKER', title: 'El evaluador rechaza con retroalimentación específica',
      text: 'El evaluador recibe el original además de la versión. Sin el original evaluaría la naturalidad del inglés, no la fidelidad.',
      flows: [
        { from: 'tra', to: 'eva', k: 'ctx', label: 'versión 1' },
        { from: 'orig', to: 'eva', k: 'ctx', label: 'original + criterios' }
      ],
      active: ['eva'],
      badges: { eva: ['revisar', 'bad'], lim: ['1 de 3', 'info'] },
      ctx: { to: 'eva', parts: [
        { k: 'input', src: 'original', text: ORIG },
        { k: 'instr', src: 'criterios', text: CRIT },
        { k: 'result', src: 'traductor', text: 'versión 1' }
      ] },
      out: { by: 'eva', label: 'Evaluación', text: 'C1 ✔\nC2 ✘ "fell apart" sugiere ruptura; "se deshizo" sugiere una disolución gradual.\nC3 ✘ "nobody asked for" es coloquial; el original usa pluscuamperfecto.\nVeredicto: revisar' },
      board: { 'veredicto 1': ['revisar (C2 ✘, C3 ✘)', 'evaluador'] },
      tr: ['Evaluador (recibe: original + criterios + versión 1)', 'Veredicto: revisar']
    },
    {
      lbl: 'ITER 2 · MAKER', title: 'El traductor corrige con la retroalimentación',
      text: 'En la segunda iteración, el traductor recibe tres cosas: el original, su versión anterior y la retroalimentación.',
      flows: [{ from: 'eva', to: 'tra', k: 'fb', label: 'retroalimentación' }],
      active: ['tra'],
      badges: { eva: null },
      ctx: { to: 'tra', parts: [
        { k: 'input', src: 'original', text: ORIG },
        { k: 'result', src: 'su versión anterior', text: '"The afternoon fell apart over the roofs like a promise nobody asked for."' },
        { k: 'feedback', src: 'evaluador', text: 'C2: "fell apart" sugiere ruptura; "se deshizo" sugiere una disolución gradual.\nC3: "nobody asked for" es coloquial; el original usa pluscuamperfecto.' }
      ] },
      out: { by: 'tra', label: 'Versión 2', text: '"The evening dissolved over the rooftops like a promise no one had asked for."' },
      board: { iteración: '2 de 3', 'versión 2': ['"The evening dissolved over the rooftops like a promise no one had asked for."', 'traductor'] },
      tr: ['Traductor (recibe: original + versión 1 + retroalimentación)', 'The evening dissolved']
    },
    {
      lbl: 'ITER 2 · CHECKER', title: 'El evaluador aprueba',
      text: 'Los tres criterios se cumplen. El evaluador agrega una nota sobre la elección de "evening".',
      flows: [
        { from: 'tra', to: 'eva', k: 'ctx', label: 'versión 2' },
        { from: 'eva', to: 'out', k: 'res', label: 'aprobado', ph: 1 }
      ],
      active: ['eva'],
      badges: { eva: ['aprobado', 'ok'], lim: ['2 de 3', 'info'] },
      out: { by: 'eva', label: 'Evaluación', text: 'C1 ✔\nC2 ✔ "dissolved" conserva la disolución gradual.\nC3 ✔ "no one had asked for" mantiene el pluscuamperfecto y el registro.\nNota: "evening" traduce "tarde" en su sentido de caída del sol.\nVeredicto: aprobado' },
      board: { 'veredicto 2': ['aprobado', 'evaluador'], resultado: 'versión 2, aprobada en 2 de 3 iteraciones' },
      tr: ['ITERACIÓN 2', 'RESULTADO']
    }
  ]
};
