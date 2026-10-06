const ESQ = 'pedidos(id, id_cliente, fecha TIMESTAMP, total)\nclientes(id, nombre, region)';
const SOL = '"Total vendido por región en septiembre de 2026, de mayor a menor."';
const Q1 = "SELECT c.region, SUM(p.monto)\nFROM pedidos p JOIN clientes c ON p.id_cliente = c.id\nWHERE p.fecha BETWEEN '2026-09-01' AND '2026-09-30'\nORDER BY 2 DESC;";
const ERR = 'R1 la columna p.monto no existe; la columna se llama total\nR2 c.region requiere GROUP BY c.region\nR3 BETWEEN excluye los pedidos del 30 de septiembre después de las 00:00:00';
window.PATRON = {
  h: 400, minW: 860,
  boardTitle: 'Iteraciones',
  boardEmpty: 'Todavía no hay consultas.',
  nodes: [
    { id: 'in', type: 'input', name: 'Solicitud + esquema', desc: 'pedidos · clientes', x: 9, y: 35, w: 140, mono: false },
    { id: 'gen', type: 'agent', tag: 'Generador', name: 'generador SQL', x: 38, y: 35, w: 150, mono: false },
    { id: 'cri', type: 'code', tag: 'Crítico (programa)', name: 'validador', desc: 'R1 columnas · R2 GROUP BY · R3 rangos semiabiertos', x: 68, y: 35, w: 180, mono: false },
    { id: 'out', type: 'output', name: 'Consulta aprobada', x: 91, y: 35, w: 110, mono: false }
  ],
  edges: [['in', 'gen'], ['gen', 'cri'], ['cri', 'out']],
  steps: [
    {
      lbl: 'DISEÑO', title: 'Un crítico que es un programa',
      text: 'El crítico no es un LLM: es un validador con tres reglas verificables. Su salida es binaria: "PASS" o una lista de errores.',
      active: ['cri'],
      out: { by: 'cri', label: 'Reglas del crítico', text: 'R1 las columnas existen en el esquema\nR2 toda columna sin agregar aparece en GROUP BY\nR3 los rangos de fecha sobre TIMESTAMP son semiabiertos (>= inicio y < fin)' },
      tr: ['PATRÓN', 'SALIDA']
    },
    {
      lbl: 'ITER 1 · GENERA', title: 'El generador escribe la primera consulta',
      text: 'El generador recibe la solicitud y el esquema.',
      flows: [{ from: 'in', to: 'gen', k: 'ctx', label: 'solicitud + esquema' }],
      active: ['gen'],
      ctx: { to: 'gen', parts: [{ k: 'input', src: 'solicitud', text: SOL }, { k: 'input', src: 'esquema', text: ESQ }] },
      out: { by: 'gen', label: 'Consulta 1', text: Q1 },
      board: { 'consulta 1': [Q1, 'generador'] },
      tr: ['ITERACIÓN 1', 'ORDER BY 2 DESC;']
    },
    {
      lbl: 'ITER 1 · VALIDA', title: 'El crítico rechaza: tres errores, tres reglas',
      text: 'Cada error tiene una regla que lo detecta. Una verificación determinista aplica la misma regla siempre.',
      flows: [{ from: 'gen', to: 'cri', k: 'ctx', label: 'consulta 1' }],
      active: ['cri'],
      badges: { cri: ['FAIL', 'bad'] },
      out: { by: 'cri', label: 'Salida del crítico', text: 'FAIL\n' + ERR },
      board: { 'validación 1': ['FAIL · R1, R2, R3', 'validador'] },
      tr: ['Crítico → FAIL', 'BETWEEN excluye']
    },
    {
      lbl: 'ITER 2 · GENERA', title: 'El generador corrige con la lista de errores',
      text: 'En la segunda iteración, el generador recibe cuatro cosas: la solicitud, el esquema, su consulta anterior y los errores. El crítico decide qué está mal; el generador decide cómo corregirlo.',
      flows: [{ from: 'cri', to: 'gen', k: 'fb', label: 'errores' }],
      active: ['gen'],
      badges: { cri: null },
      ctx: { to: 'gen', parts: [
        { k: 'input', src: 'solicitud', text: SOL },
        { k: 'input', src: 'esquema', text: ESQ },
        { k: 'result', src: 'su consulta anterior', text: Q1 },
        { k: 'feedback', src: 'validador', text: ERR }
      ] },
      out: { by: 'gen', label: 'Consulta 2', text: "SELECT c.region, SUM(p.total) AS total_vendido\nFROM pedidos p JOIN clientes c ON p.id_cliente = c.id\nWHERE p.fecha >= '2026-09-01' AND p.fecha < '2026-10-01'\nGROUP BY c.region\nORDER BY total_vendido DESC;" },
      board: { 'consulta 2': ["SELECT c.region, SUM(p.total) AS total_vendido\n... WHERE p.fecha >= '2026-09-01' AND p.fecha < '2026-10-01'\nGROUP BY c.region ...", 'generador'] },
      tr: ['ITERACIÓN 2', 'ORDER BY total_vendido DESC;']
    },
    {
      lbl: 'ITER 2 · VALIDA', title: 'PASS: el ciclo termina',
      text: 'La consulta 2 cumple las tres reglas.',
      flows: [
        { from: 'gen', to: 'cri', k: 'ctx', label: 'consulta 2' },
        { from: 'cri', to: 'out', k: 'res', label: 'PASS', ph: 1 }
      ],
      active: ['cri'],
      badges: { cri: ['PASS', 'ok'] },
      board: { 'validación 2': ['PASS', 'validador'], resultado: 'consulta 2, aprobada en la iteración 2' },
      tr: ['Crítico → PASS', 'RESULTADO']
    }
  ]
};
