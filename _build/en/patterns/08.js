const W_INSTR = 'Query the incidents of region R in 2026-Q3. Return the total,\nthe top 3 causes with their counts and one example ticket.\nDo not write conclusions.';
window.PATRON = {
  h: 460, minW: 900,
  boardTitle: 'Worker results',
  boardEmpty: 'The orchestrator has not created workers yet.',
  nodes: [
    { id: 'sol', type: 'input', name: 'Request', desc: 'Q3 incidents by region', x: 8, y: 50, w: 120, mono: false },
    { id: 'orq', type: 'agent', name: 'orchestrator', desc: 'plans, creates workers and synthesizes', x: 30, y: 50, w: 150 },
    { id: 'w1', type: 'agent', tag: 'Worker W1', name: 'North', desc: 'read-only', x: 60, y: 12, w: 140, hidden: true, mono: false },
    { id: 'w2', type: 'agent', tag: 'Worker W2', name: 'Central', desc: 'read-only', x: 60, y: 37, w: 140, hidden: true, mono: false },
    { id: 'w3', type: 'agent', tag: 'Worker W3', name: 'West', desc: 'read-only', x: 60, y: 63, w: 140, hidden: true, mono: false },
    { id: 'w4', type: 'agent', tag: 'Worker W4', name: 'Southeast', desc: 'read-only', x: 60, y: 88, w: 140, hidden: true, mono: false },
    { id: 'out', type: 'output', name: 'Executive summary', x: 88, y: 50, w: 130, mono: false }
  ],
  edges: [['sol', 'orq'], ['orq', 'w1'], ['orq', 'w2'], ['orq', 'w3'], ['orq', 'w4'], ['orq', 'out']],
  steps: [
    {
      lbl: 'REQUEST', title: 'The orchestrator receives the request',
      text: 'At the start there are no workers. The orchestrator does not yet know how many subtasks there will be.',
      flows: [{ from: 'sol', to: 'orq', k: 'ctx', label: 'request' }],
      active: ['orq'],
      ctx: { to: 'orq', parts: [{ k: 'input', src: 'request', text: '"Summarize the third-quarter support incidents by region and\npoint out the most frequent cause in each one."' }] },
      tr: ['PATTERN', 'point out the most frequent cause']
    },
    {
      lbl: 'PLANNING', title: 'The orchestrator queries the data before splitting the work',
      text: 'First it finds out how many regions have incidents. The subtasks are defined during execution, not in the design: in the fourth quarter there could be five regions.',
      active: ['orq'],
      out: { by: 'orq', label: 'Action', text: 'Action:      list_regions_with_incidents(quarter = "2026-Q3")\nObservation: North, Central, West, Southeast' },
      board: { regions: ['North, Central, West, Southeast', 'orchestrator'] },
      tr: ['ORCHESTRATOR · planning', 'Observation: North']
    },
    {
      lbl: 'CREATES WORKERS', title: 'Four workers with the same scoped instruction',
      text: 'The orchestrator creates one worker per region. All of them receive the same instruction, with their region substituted. The instruction forbids them from writing conclusions.',
      show: ['w1', 'w2', 'w3', 'w4'],
      flows: [
        { from: 'orq', to: 'w1', k: 'ctx', label: 'instruction (North)' }, { from: 'orq', to: 'w2', k: 'ctx', label: 'instruction (Central)' },
        { from: 'orq', to: 'w3', k: 'ctx', label: 'instruction (West)' }, { from: 'orq', to: 'w4', k: 'ctx', label: 'instruction (Southeast)' }
      ],
      active: ['orq'],
      ctx: { to: 'w1', title: 'Received by each worker', parts: [
        { k: 'instr', src: 'orchestrator', text: '"' + W_INSTR + '"' },
        { k: 'instr', src: 'R', text: 'North | Central | West | Southeast (one per worker)' }
      ], miss: ['The results of the other workers.'] },
      out: { by: 'orq', label: 'Decision', text: 'create 4 workers, one per region, with the same scoped instruction' },
      tr: ['Decision:    create 4 workers', 'Do not write conclusions']
    },
    {
      lbl: 'WORKERS', title: 'The workers return structured data',
      text: 'In parallel and read-only, each worker returns the same format: total, three causes with counts and one example ticket.',
      flows: [
        { from: 'w1', to: 'orq', k: 'res', label: 'total 412' }, { from: 'w2', to: 'orq', k: 'res', label: 'total 655' },
        { from: 'w3', to: 'orq', k: 'res', label: 'total 298' }, { from: 'w4', to: 'orq', k: 'res', label: 'total 187' }
      ],
      active: ['w1', 'w2', 'w3', 'w4'],
      badges: { w1: ['done', 'ok'], w2: ['done', 'ok'], w3: ['done', 'ok'], w4: ['done', 'ok'] },
      board: {
        'W1 North': ['total 412 · fiber 168 · modem config. 97 · billing 61 · e.g. T-30418', 'W1'],
        'W2 Central': ['total 655 · modem config. 240 · fiber 151 · billing 118 · e.g. T-31902', 'W2'],
        'W3 West': ['total 298 · modem config. 121 · billing 74 · fiber 52 · e.g. T-30777', 'W3'],
        'W4 Southeast': ['total 187 · fiber 89 · billing 41 · modem config. 30 · e.g. T-32050', 'W4']
      },
      tr: ['WORKERS (in parallel', 'W4 Southeast']
    },
    {
      lbl: 'SYNTHESIS', title: 'The orchestrator keeps the conclusions',
      text: 'The workers investigated; the orchestrator decides and concludes with a single criterion for "main cause". If each worker had written its own section, there would be four styles and four different criteria.',
      flows: [{ from: 'orq', to: 'out', k: 'res', label: 'executive summary' }],
      active: ['orq'],
      ctx: { to: 'orq', parts: [
        { k: 'input', src: 'request', text: 'Q3 incidents by region and most frequent cause' },
        { k: 'result', src: 'W1 to W4', text: 'Four results with the same format' }
      ] },
      out: { by: 'orq', label: 'Synthesis', text: 'Quarter total: 412 + 655 + 298 + 187 = 1,552 incidents\nMost frequent cause by region:\n    North      fiber failures            168 of 412  (41%)\n    Central    modem configuration       240 of 655  (37%)\n    West       modem configuration       121 of 298  (41%)\n    Southeast  fiber failures             89 of 187  (48%)\nCross-cutting observation: modem configuration is the main cause in two of\nfour regions (Central and West), which suggests reviewing the installation guide.' },
      tr: ['SYNTHESIS · orchestrator', 'RESULT']
    }
  ]
};
