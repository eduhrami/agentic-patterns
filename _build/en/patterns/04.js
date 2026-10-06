window.PATRON = {
  h: 400, minW: 940,
  boardTitle: 'Conversation control',
  boardEmpty: 'Who has control and which context is transferred are logged here.',
  nodes: [
    { id: 'user', type: 'input', tag: 'User', name: 'Customer C-7740', x: 8, y: 30, w: 120, mono: false },
    { id: 'tri', type: 'agent', name: 'triage', desc: 'handles common problems; transfers the rest', x: 27, y: 30, w: 150 },
    { id: 'red', type: 'agent', name: 'network_tech', desc: 'diagnoses network and coverage failures', x: 47, y: 30, w: 150 },
    { id: 'fin', type: 'agent', name: 'finance', desc: 'credits and adjustments; limit of $100 MXN per case', x: 67, y: 30, w: 160 },
    { id: 'per', type: 'human', name: 'human', desc: 'human support advisor', x: 88, y: 30, w: 140 },
    { id: 'lim', type: 'code', tag: 'Limit', name: '5 transfers per conversation', x: 47, y: 82, w: 230, mono: false }
  ],
  edges: [['user', 'tri'], ['tri', 'red'], ['red', 'fin'], ['fin', 'per'], ['tri', 'lim'], ['red', 'lim'], ['fin', 'lim']],
  steps: [
    {
      lbl: 'DESIGN', title: 'One active agent at a time',
      text: 'Each agent decides whether to resolve or to transfer <b>full control</b> to another one (handoff). Unlike the coordinator, the agent that transfers does not come back.\n\nA counter in code limits the transfers to prevent infinite loops.',
      active: ['lim'],
      board: { 'active agent': 'none', transfers: '0 of 5' },
      tr: ['PATTERN', 'LIMIT']
    },
    {
      lbl: 'TRIAGE', title: 'Triage receives the message and decides to transfer',
      text: 'The customer already restarted the equipment, so the problem exceeds triage\'s basic guide. Triage transfers control to <code>network_tech</code>.',
      flows: [
        { from: 'user', to: 'tri', k: 'ctx', label: 'message' },
        { from: 'tri', to: 'red', k: 'handoff', label: 'full trace', ph: 1 }
      ],
      active: ['tri'],
      badgesReset: true, badges: { tri: ['active', 'info'] },
      ctx: { to: 'tri', parts: [{ k: 'input', src: 'customer C-7740', text: '"I\'ve been without internet for three days. I already restarted everything. I want a discount for those days."' }] },
      out: { by: 'tri', label: 'Decision', text: 'Thought: the customer already restarted the equipment; the problem exceeds the basic guide.\nHANDOFF → network_tech' },
      board: { 'active agent': ['triage', 'triage'], transfers: ['1 of 5', 'counter'] },
      tr: ['USER MESSAGE', 'Context transferred: full trace (message']
    },
    {
      lbl: 'NETWORK TECH', title: 'The technician receives the whole trace and diagnoses',
      text: 'The network agent receives the full trace: the message and the triage steps. It confirms the fiber cut and the repair. The credit is not its job, so it transfers to finance with its diagnosis.',
      flows: [{ from: 'red', to: 'fin', k: 'handoff', label: 'trace + diagnosis' }],
      active: ['red'],
      badgesReset: true, badges: { red: ['active', 'info'], tri: ['inactive', 'off'] },
      ctx: { to: 'red', parts: [
        { k: 'input', src: 'message', text: '"I\'ve been without internet for three days. I already restarted everything. I want a discount for those days."' },
        { k: 'hist', src: 'triage steps', text: 'The customer already restarted the equipment; the problem exceeds the basic guide.' }
      ] },
      out: { by: 'red', label: 'Work and decision', text: 'Action:      get_node_status(customer_id = "C-7740")\nObservation: node MTY-NORTE-14 with a fiber cut since Oct 2; repaired on Oct 5 at 16:40\nAction:      check_connection(customer_id = "C-7740")\nObservation: connection restored at 300 Mbps\nThought:     the technical failure is resolved; the credit belongs to finance.\nHANDOFF → finance' },
      board: { 'active agent': ['network_tech', 'triage'], transfers: ['2 of 5', 'counter'], diagnosis: ['Fiber cut at MTY-NORTE-14 from Oct 2 to 5 · restored at 300 Mbps', 'network_tech'] },
      tr: ['ACTIVE AGENT · network_tech', 'Context transferred: full trace + node diagnosis']
    },
    {
      lbl: 'FINANCE', title: 'Finance calculates the credit and hits its limit',
      text: 'Finance receives the full trace and the diagnosis. The calculated credit ($120) exceeds its limit of $100 per case, so it transfers to a person.',
      flows: [{ from: 'fin', to: 'per', k: 'handoff', label: 'trace + credit' }],
      active: ['fin'],
      badgesReset: true, badges: { fin: ['active', 'info'], tri: ['inactive', 'off'], red: ['inactive', 'off'] },
      ctx: { to: 'fin', parts: [
        { k: 'hist', src: 'full trace', text: 'Customer message · triage steps · network_tech steps' },
        { k: 'result', src: 'diagnosis (network_tech)', text: 'Fiber cut from Oct 2 to 5; service restored' }
      ] },
      out: { by: 'fin', label: 'Work and decision', text: 'Action:      calculate_credit(monthly_fee = 1200, days_without_service = 3)\nObservation: credit of $120 MXN (1,200 / 30 × 3)\nThought:     $120 exceeds my limit of $100 per case.\nHANDOFF → human' },
      board: { 'active agent': ['finance', 'network_tech'], transfers: ['3 of 5', 'counter'], credit: ['$120 MXN (1,200 / 30 × 3), above the $100 limit', 'finance'] },
      tr: ['ACTIVE AGENT · finance', 'Context transferred: full trace + calculated credit']
    },
    {
      lbl: 'HUMAN', title: 'A person approves without asking again',
      text: 'The advisor reviews the trace: cut confirmed, service restored, credit calculated. Because each transfer included the full trace, there is no need to ask the customer again how many days they were without service.',
      flows: [{ from: 'per', to: 'user', k: 'res', label: 'response' }],
      active: ['per'],
      badgesReset: true, badges: { per: ['active', 'info'], tri: ['inactive', 'off'], red: ['inactive', 'off'], fin: ['inactive', 'off'] },
      ctx: { to: 'per', title: 'Received by the human (advisor Luis M.)', parts: [
        { k: 'hist', src: 'full trace', text: 'Message · triage steps · node diagnosis · finance calculation' },
        { k: 'result', src: 'finance', text: 'Calculated credit: $120 MXN' }
      ] },
      out: { by: 'per', label: 'Action and response', text: 'Action:   apply_credit(customer_id = "C-7740", amount = 120)\nResponse: "We confirmed a fiber cut in your area from October 2 to 5.\n          Service has been restored and we applied a credit of\n          $120 MXN to your next bill."' },
      board: { 'active agent': ['human (advisor Luis M.)', 'finance'] },
      tr: ['ACTIVE AGENT · human', '$120 MXN to your next bill']
    }
  ]
};
