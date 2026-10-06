window.PATRON = {
  h: 440, minW: 900,
  boardTitle: 'Shared state',
  boardEmpty: 'Each reviewer writes to its own key.',
  nodes: [
    { id: 'pr', type: 'input', name: 'Pull request #418', desc: 'api/customers.py (+64 −3) · db/queries.py (+22 −0)', x: 9, y: 50, w: 150, mono: false },
    { id: 'seg', type: 'agent', name: 'security_auditor', desc: '→ security_report', x: 40, y: 15, w: 165 },
    { id: 'est', type: 'agent', name: 'style_reviewer', desc: '→ style_report', x: 40, y: 50, w: 165 },
    { id: 'des', type: 'agent', name: 'performance_analyst', desc: '→ performance_report', x: 40, y: 85, w: 165 },
    { id: 'sin', type: 'agent', tag: 'Gather', name: 'synthesizer', desc: 'combines the three reports', x: 70, y: 50, w: 150 },
    { id: 'out', type: 'output', name: 'Comment on the PR', x: 91, y: 50, w: 120, mono: false }
  ],
  edges: [['pr', 'seg'], ['pr', 'est'], ['pr', 'des'], ['seg', 'sin'], ['est', 'sin'], ['des', 'sin'], ['sin', 'out']],
  steps: [
    {
      lbl: 'DESIGN', title: 'Three reviewers defined in the design',
      text: 'Three agents review the same pull request at the same time, each from a different angle. Each one writes to a separate key of the state, so they do not overwrite each other.',
      active: ['seg', 'est', 'des'],
      tr: ['PATTERN', 'performance_analyst    → performance_report']
    },
    {
      lbl: 't = 0 s', title: 'Fan-out: the three agents receive the same diff',
      text: 'The three start in parallel with the same input. What differs between them is their focus.',
      flows: [
        { from: 'pr', to: 'seg', k: 'ctx', label: 'diff' },
        { from: 'pr', to: 'est', k: 'ctx', label: 'diff' },
        { from: 'pr', to: 'des', k: 'ctx', label: 'diff' }
      ],
      active: ['pr'],
      badges: { seg: ['running', 'info'], est: ['running', 'info'], des: ['running', 'info'], sin: ['waiting 0 of 3', 'off'] },
      ctx: { title: 'Received by the three reviewers (same input)', parts: [{ k: 'input', src: 'diff of PR #418', text: 'Pull request #418 "Add customer search endpoint"\napi/customers.py (+64 −3) · db/queries.py (+22 −0)' }] },
      board: { time: 't = 0 s' },
      tr: ['[t = 0 s]', '[t = 0 s]']
    },
    {
      lbl: 't = 9 s', title: 'The style reviewer finishes',
      text: 'The first one to finish writes its report to <code>style_report</code>. The synthesizer is still waiting for the other two.',
      flows: [{ from: 'est', to: 'sin', k: 'res', label: 'style_report' }],
      active: ['est'],
      badges: { est: ['done', 'ok'], sin: ['waiting 1 of 3', 'off'] },
      out: { by: 'est', label: 'Writes style_report', text: '2 findings\n- api/customers.py:41 · the variable `x` needs a descriptive name\n- db/queries.py:12 · line of 104 characters (limit: 100)' },
      board: { time: 't = 9 s', style_report: ['2 findings (api/customers.py:41, db/queries.py:12)', 'style_reviewer'] },
      tr: ['[t = 9 s]', 'line of 104 characters']
    },
    {
      lbl: 't = 13 s', title: 'The security auditor finishes',
      text: 'One critical finding on line 18 of <code>db/queries.py</code>.',
      flows: [{ from: 'seg', to: 'sin', k: 'res', label: 'security_report' }],
      active: ['seg'],
      badges: { seg: ['done', 'ok'], sin: ['waiting 2 of 3', 'off'] },
      out: { by: 'seg', label: 'Writes security_report', text: '1 critical finding\n- db/queries.py:18 · the `name` parameter is concatenated into the SQL (injection risk)' },
      board: { time: 't = 13 s', security_report: ['1 critical finding (db/queries.py:18, SQL injection)', 'security_auditor'] },
      tr: ['[t = 13 s]', 'injection risk']
    },
    {
      lbl: 't = 16 s', title: 'The performance analyst finishes',
      text: 'It flags the same line 18, but from another angle: a search without an index over 1.2 million rows.',
      flows: [{ from: 'des', to: 'sin', k: 'res', label: 'performance_report' }],
      active: ['des'],
      badges: { des: ['done', 'ok'], sin: ['3 of 3', 'ok'] },
      out: { by: 'des', label: 'Writes performance_report', text: '1 finding\n- db/queries.py:18 · LIKE \'%text%\' search on customers (1.2 M rows) without an index' },
      board: { time: 't = 16 s', performance_report: ['1 finding (db/queries.py:18, LIKE without an index)', 'performance_analyst'] },
      tr: ['[t = 16 s]', 'without an index']
    },
    {
      lbl: 'GATHER', title: 'The synthesizer combines the three reports',
      text: 'The synthesizer receives the diff and the three keys. It orders by severity and merges into a single point the two reports that flagged line 18.',
      flows: [{ from: 'sin', to: 'out', k: 'res', label: 'single comment' }],
      active: ['sin'],
      ctx: { to: 'sin', parts: [
        { k: 'input', src: 'diff', text: 'PR #418' },
        { k: 'state', src: 'security_report', text: 'db/queries.py:18 · SQL injection' },
        { k: 'state', src: 'style_report', text: 'api/customers.py:41 · variable `x`\ndb/queries.py:12 · 104-character line' },
        { k: 'state', src: 'performance_report', text: 'db/queries.py:18 · LIKE without an index' }
      ] },
      out: { by: 'sin', label: 'Single comment on the PR', text: '1. Blocking · db/queries.py:18\n   Use a parameterized query. While fixing it, consider switching the search\n   to a full-text index (also flagged by performance).\n2. Minor · db/queries.py:12 · split the 104-character line.\n3. Minor · api/customers.py:41 · rename `x` to `search_filter`.\nSuggested status: changes requested' },
      tr: ['GATHER', 'Suggested status: changes requested']
    },
    {
      lbl: 'TIME', title: 'The total time is that of the slowest agent',
      text: 'In parallel, the pattern takes 16 s. In sequence it would have taken 38 s.',
      active: ['out'],
      board: { time: ['16 s in parallel (in sequence: 9 + 13 + 16 = 38 s)', ''] },
      tr: ['TOTAL TIME', 'TOTAL TIME']
    }
  ]
};
