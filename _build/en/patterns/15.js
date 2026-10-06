window.PATRON = {
  h: 470, minW: 900,
  boardTitle: 'Execution state',
  boardEmpty: 'Execution has not started.',
  extra: 'It is the same case as the <a href="../agent_anatomy.html#react">ReAct</a> demo in the anatomy of an agent.',
  nodes: [
    { id: 'cli', type: 'input', tag: 'User', name: 'Customer C-1027', desc: 'duplicate charge for their subscription', x: 9, y: 22, w: 140, mono: false },
    { id: 'ag', type: 'agent', name: 'support agent', desc: 'ReAct loop', x: 33, y: 50, w: 150, mono: false },
    { id: 'con', type: 'tool', tag: 'Queries (no approval)', name: 'get_payments · get_account_history · search_knowledge_base', x: 33, y: 88, w: 230 },
    { id: 'rule', type: 'code', tag: 'Approval rule', name: 'request_refund with amount > $100 MXN', x: 62, y: 50, w: 175 },
    { id: 'ck', type: 'state', tag: 'Checkpoint', name: 'CK-77', desc: 'saved execution state', x: 62, y: 13, w: 150 },
    { id: 'sup', type: 'human', name: 'support supervisor', x: 62, y: 88, w: 160, mono: false },
    { id: 'reem', type: 'tool', name: 'request_refund', x: 89, y: 50, w: 150 }
  ],
  edges: [['cli', 'ag'], ['ag', 'con'], ['ag', 'rule'], ['rule', 'ck'], ['rule', 'sup'], ['rule', 'reem']],
  steps: [
    {
      lbl: 'DESIGN', title: 'Approval is limited to one tool and one threshold',
      text: 'Queries proceed on their own. Only a refund greater than $100 MXN pauses execution until a person approves it.',
      active: ['rule'],
      out: { by: 'rule', label: 'Approval rule', text: 'get_payments, get_account_history, search_knowledge_base  → no approval\nrequest_refund with amount > $100 MXN                     → requires approval' },
      tr: ['PATTERN', 'CASE']
    },
    {
      lbl: 'ITER 1 to 3', title: 'Queries do not wait for anyone',
      text: 'Three query iterations without approval: payments, history and knowledge base.',
      flows: [
        { from: 'cli', to: 'ag', k: 'ctx', label: 'complaint' },
        { from: 'ag', to: 'con', k: 'ctx', label: '3 queries', ph: 1 },
        { from: 'con', to: 'ag', k: 'res', label: 'observations', ph: 2 }
      ],
      active: ['ag'],
      badges: { con: ['no approval', 'ok'] },
      out: { label: 'Observations', text: 'get_payments             → P-88310 (Sep 1) and P-88342 (Sep 3), $199 each, different cards\nget_account_history      → payment method changed on Sep 2\nsearch_knowledge_base    → known error #312: the second charge is refundable' },
      board: { 'iterations 1 to 3': ['Two $199 charges · card change on Sep 2 · known error #312', 'agent'] },
      tr: ['ITERATIONS 1 to 3', 'search_knowledge_base    →']
    },
    {
      lbl: 'ITER 4 · RULE', title: 'The proposed action triggers the rule',
      text: 'The agent proposes the refund. Before executing it, the rule compares the amount against the threshold: 199 > 100.',
      flows: [{ from: 'ag', to: 'rule', k: 'ctrl', label: 'proposed action' }],
      active: ['rule'],
      badges: { rule: ['199 > 100', 'warn'] },
      out: { by: 'ag', label: 'Proposed action', text: 'request_refund(payment_id = "P-88342", amount = 199,\n               reason = "Duplicate charge, error #312")' },
      tr: ['ITERATION 4', 'Rule:    199 > 100']
    },
    {
      lbl: 'PAUSE', title: 'The state is saved to a checkpoint',
      text: 'Execution stops and its state is saved to CK-77. That way it can resume without repeating iterations 1 to 3.',
      flows: [{ from: 'rule', to: 'ck', k: 'ctrl', label: 'execution state' }],
      active: ['ck'],
      badges: { ag: ['paused', 'warn'] },
      board: { checkpoint: ['CK-77: iterations 1 to 3 + proposed action', 'rule'] },
      tr: ['PAUSE', 'PAUSE']
    },
    {
      lbl: 'REQUEST', title: 'The supervisor receives evidence, not just "refund $199"',
      text: 'The approval request includes the action, the evidence and a link to the trace. With that context the supervisor can approve in minutes and spot anything that doesn\'t add up.',
      flows: [{ from: 'rule', to: 'sup', k: 'human', label: 'approval request' }],
      active: ['sup'],
      ctx: { to: 'sup', parts: [
        { k: 'instr', src: 'action', text: 'refund of $199 MXN for payment P-88342' },
        { k: 'result', src: 'evidence', text: 'two charges for the same period · card change on Sep 2 ·\nmatch with known error #312' },
        { k: 'hist', src: 'trace', text: 'link to iterations 1 to 3' }
      ] },
      tr: ['APPROVAL REQUEST', 'Trace:      link']
    },
    {
      lbl: 'APPROVED', title: 'The supervisor approves',
      text: 'The response arrives 14 minutes later. Meanwhile, execution waited at the checkpoint.',
      flows: [{ from: 'sup', to: 'rule', k: 'human', label: 'approved' }],
      active: ['sup'],
      badges: { sup: ['approved', 'ok'] },
      board: { approval: ['approved (14 minutes later)', 'supervisor'] },
      tr: ['RESPONSE (14 minutes later)', 'RESPONSE (14 minutes later)']
    },
    {
      lbl: 'RESUME', title: 'Execution resumes from CK-77',
      text: 'The agent picks up from the checkpoint, without repeating the queries, and executes the refund.',
      flows: [
        { from: 'ck', to: 'rule', k: 'ctrl', label: 'CK-77 state' },
        { from: 'rule', to: 'reem', k: 'ctx', label: 'approved refund', ph: 1 },
        { from: 'reem', to: 'rule', k: 'res', label: 'R-5521', ph: 2 }
      ],
      active: ['ck', 'reem'],
      badges: { ag: null, rule: ['approved', 'ok'] },
      out: { label: 'Observation', text: 'refund R-5521 created' },
      board: { refund: ['R-5521 created', 'request_refund'] },
      tr: ['RESUME', 'Observation: refund R-5521']
    },
    {
      lbl: 'ITER 5', title: 'Final answer to the customer',
      text: 'The agent replies with the cause and the refund reference.',
      flows: [{ from: 'ag', to: 'cli', k: 'res', label: 'cause + reference R-5521' }],
      active: ['ag'],
      tr: ['ITERATION 5', 'Final answer to the customer']
    },
    {
      lbl: 'ALTERNATIVE', title: 'If the supervisor had responded with feedback',
      text: 'Approval is not just yes or no. If the supervisor asks for an additional check, their feedback goes back to the agent as a new observation and the loop continues.',
      flows: [{ from: 'sup', to: 'ag', k: 'fb', label: 'feedback' }],
      active: ['sup', 'ag'],
      badges: { sup: ['feedback', 'warn'], rule: null },
      ctx: { to: 'ag', parts: [{ k: 'feedback', src: 'supervisor, as a new observation', text: '"First check whether P-88310 already has a partial refund."' }] },
      tr: ['ALTERNATIVE', 'the feedback goes back to the agent']
    }
  ]
};
