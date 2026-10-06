const ESQ = 'orders(id, customer_id, date TIMESTAMP, total)\ncustomers(id, name, region)';
const SOL = '"Total sales by region in September 2026, from highest to lowest."';
const Q1 = "SELECT c.region, SUM(o.amount)\nFROM orders o JOIN customers c ON o.customer_id = c.id\nWHERE o.date BETWEEN '2026-09-01' AND '2026-09-30'\nORDER BY 2 DESC;";
const ERR = 'R1 the column o.amount does not exist; the column is called total\nR2 c.region requires GROUP BY c.region\nR3 BETWEEN excludes orders on September 30 after 00:00:00';
window.PATRON = {
  h: 400, minW: 860,
  boardTitle: 'Iterations',
  boardEmpty: 'There are no queries yet.',
  nodes: [
    { id: 'in', type: 'input', name: 'Request + schema', desc: 'orders · customers', x: 9, y: 35, w: 140, mono: false },
    { id: 'gen', type: 'agent', tag: 'Generator', name: 'SQL generator', x: 38, y: 35, w: 150, mono: false },
    { id: 'cri', type: 'code', tag: 'Critic (program)', name: 'validator', desc: 'R1 columns · R2 GROUP BY · R3 half-open ranges', x: 68, y: 35, w: 180, mono: false },
    { id: 'out', type: 'output', name: 'Approved query', x: 91, y: 35, w: 110, mono: false }
  ],
  edges: [['in', 'gen'], ['gen', 'cri'], ['cri', 'out']],
  steps: [
    {
      lbl: 'DESIGN', title: 'A critic that is a program',
      text: 'The critic is not an LLM: it is a validator with three verifiable rules. Its output is binary: "PASS" or a list of errors.',
      active: ['cri'],
      out: { by: 'cri', label: 'Critic rules', text: 'R1 the columns exist in the schema\nR2 every non-aggregated column appears in GROUP BY\nR3 date ranges on TIMESTAMP are half-open (>= start and < end)' },
      tr: ['PATTERN', 'OUTPUT']
    },
    {
      lbl: 'ITER 1 · GENERATE', title: 'The generator writes the first query',
      text: 'The generator receives the request and the schema.',
      flows: [{ from: 'in', to: 'gen', k: 'ctx', label: 'request + schema' }],
      active: ['gen'],
      ctx: { to: 'gen', parts: [{ k: 'input', src: 'request', text: SOL }, { k: 'input', src: 'schema', text: ESQ }] },
      out: { by: 'gen', label: 'Query 1', text: Q1 },
      board: { 'query 1': [Q1, 'generator'] },
      tr: ['ITERATION 1', 'ORDER BY 2 DESC;']
    },
    {
      lbl: 'ITER 1 · VALIDATE', title: 'The critic rejects: three errors, three rules',
      text: 'Each error has a rule that detects it. A deterministic check always applies the same rule.',
      flows: [{ from: 'gen', to: 'cri', k: 'ctx', label: 'query 1' }],
      active: ['cri'],
      badges: { cri: ['FAIL', 'bad'] },
      out: { by: 'cri', label: 'Critic output', text: 'FAIL\n' + ERR },
      board: { 'validation 1': ['FAIL · R1, R2, R3', 'validator'] },
      tr: ['Critic → FAIL', 'BETWEEN excludes']
    },
    {
      lbl: 'ITER 2 · GENERATE', title: 'The generator fixes it with the list of errors',
      text: 'In the second iteration, the generator receives four things: the request, the schema, its previous query and the errors. The critic decides what is wrong; the generator decides how to fix it.',
      flows: [{ from: 'cri', to: 'gen', k: 'fb', label: 'errors' }],
      active: ['gen'],
      badges: { cri: null },
      ctx: { to: 'gen', parts: [
        { k: 'input', src: 'request', text: SOL },
        { k: 'input', src: 'schema', text: ESQ },
        { k: 'result', src: 'its previous query', text: Q1 },
        { k: 'feedback', src: 'validator', text: ERR }
      ] },
      out: { by: 'gen', label: 'Query 2', text: "SELECT c.region, SUM(o.total) AS total_sales\nFROM orders o JOIN customers c ON o.customer_id = c.id\nWHERE o.date >= '2026-09-01' AND o.date < '2026-10-01'\nGROUP BY c.region\nORDER BY total_sales DESC;" },
      board: { 'query 2': ["SELECT c.region, SUM(o.total) AS total_sales\n... WHERE o.date >= '2026-09-01' AND o.date < '2026-10-01'\nGROUP BY c.region ...", 'generator'] },
      tr: ['ITERATION 2', 'ORDER BY total_sales DESC;']
    },
    {
      lbl: 'ITER 2 · VALIDATE', title: 'PASS: the loop ends',
      text: 'Query 2 meets all three rules.',
      flows: [
        { from: 'gen', to: 'cri', k: 'ctx', label: 'query 2' },
        { from: 'cri', to: 'out', k: 'res', label: 'PASS', ph: 1 }
      ],
      active: ['cri'],
      badges: { cri: ['PASS', 'ok'] },
      board: { 'validation 2': ['PASS', 'validator'], result: 'query 2, approved in iteration 2' },
      tr: ['Critic → PASS', 'RESULT']
    }
  ]
};
