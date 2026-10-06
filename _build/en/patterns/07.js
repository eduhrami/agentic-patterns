window.PATRON = {
  h: 460, minW: 900,
  boardTitle: 'Scores and aggregation',
  boardEmpty: 'The analysts\' scores appear here.',
  nodes: [
    { id: 'sol', type: 'input', name: 'Request', desc: 'two-week horizon', x: 8, y: 50, w: 115, mono: false },
    { id: 'orq', type: 'agent', name: 'orchestrator', desc: 'dynamic selection', x: 27, y: 50, w: 140 },
    { id: 'fun', type: 'agent', name: 'fundamental', desc: 'financial statements and competitive position', x: 55, y: 12, w: 185 },
    { id: 'tec', type: 'agent', name: 'technical', desc: 'price, volume and momentum', x: 55, y: 37, w: 185 },
    { id: 'sen', type: 'agent', name: 'sentiment', desc: 'news and social media', x: 55, y: 62, w: 185 },
    { id: 'esg', type: 'agent', name: 'esg', desc: 'environmental, social and corporate governance reports', x: 55, y: 88, w: 185 },
    { id: 'agg', type: 'code', tag: 'Aggregation (code)', name: 'weighted average', desc: '0.4 · 0.3 · 0.3', x: 80, y: 37, w: 140, mono: false },
    { id: 'out', type: 'output', name: 'Recommendation', desc: 'for the portfolio manager', x: 80, y: 80, w: 140, mono: false }
  ],
  edges: [['sol', 'orq'], ['orq', 'fun'], ['orq', 'tec'], ['orq', 'sen'], ['orq', 'esg'], ['fun', 'agg'], ['tec', 'agg'], ['sen', 'agg'], ['agg', 'out']],
  steps: [
    {
      lbl: 'DESIGN', title: 'Four registered analysts, one formula to combine them',
      text: 'The orchestrator decides which analysts to invoke based on the request. Their scores are combined with a formula in code, without an LLM that synthesizes.',
      active: ['orq', 'agg'],
      tr: ['PATTERN', 'esg           environmental, social']
    },
    {
      lbl: 'SELECTION', title: 'The orchestrator chooses who to invoke',
      text: 'With a two-week horizon, the orchestrator skips ESG because that analysis contributes to long horizons. This is <b>dynamic selection</b>: the agents invoked depend on the request.',
      flows: [{ from: 'sol', to: 'orq', k: 'ctx', label: 'request' }],
      active: ['orq'],
      badges: { esg: ['skipped', 'off'] },
      ctx: { to: 'orq', parts: [{ k: 'input', src: 'request', text: '"With a two-week horizon, should we hold the position in GRPX\n(fictitious company) ahead of its quarterly report?"' }] },
      out: { by: 'orq', label: 'Decision', text: 'Thought:     the horizon is two weeks; ESG analysis contributes to long horizons.\nInvokes:     fundamental, technical, sentiment\nSkips:       esg' },
      board: { 'invoked agents': ['fundamental, technical, sentiment (esg skipped)', 'orchestrator'] },
      tr: ['REQUEST', 'Skips:       esg']
    },
    {
      lbl: 'PARALLEL', title: 'Three analysts work in parallel',
      text: 'Each analyst returns a score from −2 to +2 with its justification. The fundamental agent uses its own internal orchestration: it consults two sub-agents.',
      flows: [
        { from: 'orq', to: 'fun', k: 'ctx', label: 'invokes' }, { from: 'orq', to: 'tec', k: 'ctx', label: 'invokes' }, { from: 'orq', to: 'sen', k: 'ctx', label: 'invokes' },
        { from: 'fun', to: 'agg', k: 'res', label: '+1', ph: 1 }, { from: 'tec', to: 'agg', k: 'res', label: '−1', ph: 1 }, { from: 'sen', to: 'agg', k: 'res', label: '0', ph: 1 }
      ],
      active: ['fun', 'tec', 'sen'],
      badges: { fun: ['+1', 'ok'], tec: ['−1', 'bad'], sen: ['0', 'info'] },
      out: { label: 'Results (score from −2 to +2)', text: 'fundamental → +1   stable margins and low debt\n                   (internally consults two sub-agents: financial_statements and competition)\ntechnical   → −1   the price trades below its 50-day average\nsentiment   →  0   mixed news ahead of the report' },
      board: { fundamental: ['+1 · stable margins and low debt', 'fundamental'], technical: ['−1 · price below its 50-day average', 'technical'], sentiment: ['0 · mixed news ahead of the report', 'sentiment'] },
      tr: ['PARALLEL EXECUTION', 'sentiment   →  0']
    },
    {
      lbl: 'AGGREGATION', title: 'A formula decides the result',
      text: 'The aggregation receives only the scores. There is no LLM combining interpretations: the formula and the threshold rule are written in the design.',
      flows: [{ from: 'agg', to: 'out', k: 'res', label: 'HOLD' }],
      active: ['agg'],
      badges: { agg: ['+0.1', 'info'] },
      ctx: { to: 'agg', parts: [{ k: 'result', src: 'three analysts', text: 'fundamental +1 · technical −1 · sentiment 0' }], miss: ['The justifications of each analysis: it only uses the scores.'] },
      out: [
        { by: 'agg', label: 'Calculation', text: 'Weights:   fundamental 0.4 · technical 0.3 · sentiment 0.3\nScore:     0.4 × (+1) + 0.3 × (−1) + 0.3 × (0) = +0.1\nRule:      > +0.5 increase · from −0.5 to +0.5 hold · < −0.5 reduce\nResult:    HOLD' },
        { label: 'Output', text: 'Recommendation: hold the position. The three analyses are attached with their\nscores for review by the portfolio manager.' }
      ],
      board: { 'weighted score': ['+0.1 → HOLD', 'code'] },
      tr: ['AGGREGATION (code)', 'scores for review']
    }
  ]
};
