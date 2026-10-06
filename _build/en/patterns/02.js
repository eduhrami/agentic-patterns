window.PATRON = {
  h: 460, minW: 900,
  boardTitle: 'Routing log',
  boardEmpty: 'The route taken by each message is logged here.',
  nodes: [
    { id: 'msg', type: 'input', name: 'Customer message', x: 8, y: 50, w: 120, mono: false },
    { id: 'clf', type: 'agent', tag: 'Classifier', name: 'small model', desc: 'structured output: category + confidence', x: 29, y: 50, w: 150, mono: false },
    { id: 'rule', type: 'code', tag: 'Code rule', name: 'confidence < 0.70', desc: '→ general_inquiry with the instruction to ask for more detail', x: 51, y: 50, w: 150 },
    { id: 'cg', type: 'agent', tag: 'Branch', name: 'general_inquiry', desc: 'FAQ prompt · knowledge base · small model', x: 79, y: 15, w: 200 },
    { id: 're', type: 'agent', tag: 'Branch', name: 'refund', desc: 'policy prompt · get_payments, request_refund · medium model', x: 79, y: 50, w: 200 },
    { id: 'st', type: 'agent', tag: 'Branch', name: 'tech_support', desc: 'diagnostic prompt · get_device, search_incidents · large model', x: 79, y: 85, w: 200 }
  ],
  edges: [['msg', 'clf'], ['clf', 'rule'], ['rule', 'cg'], ['rule', 're'], ['rule', 'st']],
  steps: [
    {
      lbl: 'DESIGN', title: 'A classifier and three specialized branches',
      text: 'A classifier with structured output decides the category of each message. Each branch has its own prompt, its tools and its model.\n\nA <b>code rule</b> sits between the classifier and the branches: it handles low-confidence cases without relying on the model.',
      active: ['clf', 'rule'],
      tr: ['PATTERN', 'confidence < 0.70']
    },
    {
      lbl: 'MESSAGE 1', title: 'Simple question: goes to the small model',
      text: 'The classifier returns JSON. With 0.97 confidence, the rule lets the decision through and the message reaches <code>general_inquiry</code>.',
      flows: [
        { from: 'msg', to: 'clf', k: 'ctx', label: 'message' },
        { from: 'clf', to: 'rule', k: 'ctrl', label: 'JSON', ph: 1 },
        { from: 'rule', to: 'cg', k: 'ctx', label: 'message', ph: 2 }
      ],
      active: ['clf'],
      badgesReset: true, badges: { rule: ['0.97 ✔', 'ok'], cg: ['route', 'info'] },
      ctx: { to: 'clf', parts: [{ k: 'input', src: 'customer C-2210', text: '"What time are you open until on Saturdays?"' }] },
      out: [
        { by: 'clf', label: 'Classifier output', text: '{"category": "general_inquiry", "confidence": 0.97}' },
        { by: 'cg', label: 'Branch response', text: '"On Saturdays we are open from 9:00 to 14:00."' }
      ],
      board: { 'Message 1 · C-2210': ['general_inquiry · confidence 0.97', 'classifier'] },
      tr: ['MESSAGE 1', 'Response   "On Saturdays']
    },
    {
      lbl: 'MESSAGE 2 · A', title: 'Refund claim: the classifier decides the branch',
      text: 'Confidence of 0.93: the rule lets the decision through and the message goes to the refund branch, with a medium model.',
      flows: [
        { from: 'msg', to: 'clf', k: 'ctx', label: 'message' },
        { from: 'clf', to: 'rule', k: 'ctrl', label: 'JSON', ph: 1 }
      ],
      active: ['clf'],
      badgesReset: true, badges: { rule: ['0.93 ✔', 'ok'] },
      ctx: { to: 'clf', parts: [{ k: 'input', src: 'customer C-1388', text: '"I canceled my annual plan after 10 days and I haven\'t gotten anything back."' }] },
      out: { by: 'clf', label: 'Classifier output', text: '{"category": "refund", "confidence": 0.93}' },
      board: { 'Message 2 · C-1388': ['refund · confidence 0.93', 'classifier'] },
      tr: ['MESSAGE 2', 'Route      → refund']
    },
    {
      lbl: 'MESSAGE 2 · B', title: 'The branch receives the original message, not the label',
      text: 'The refund branch receives the full original message and the customer id, without the classifier\'s rewording. That way it keeps the detail "after 10 days", which determines the applicable policy.',
      flows: [{ from: 'rule', to: 're', k: 'ctx', label: 'original message + id' }],
      active: ['re'],
      badges: { re: ['route', 'info'] },
      ctx: { to: 're', parts: [
        { k: 'input', src: 'full original message', text: '"I canceled my annual plan after 10 days and I haven\'t gotten anything back."' },
        { k: 'input', src: 'customer id', text: 'C-1388' }
      ], miss: ['Only the "refund" label: it would lose the detail "after 10 days".'] },
      out: { by: 're', label: 'Branch work', text: 'Action:      get_payments(customer_id = "C-1388")\nObservation: annual payment of $2,388 MXN on Sep 4 · cancellation on Sep 14\nAction:      request_refund(payment_id = "P-90215", amount = 2388,\n                            reason = "Cancellation within 30 days")\nObservation: refund R-6120 created\nResponse:    "Your cancellation happened within the first 30 days, so a full\n             refund of $2,388 MXN applies (reference R-6120)."' },
      tr: ['Receives   the full original message', 'refund of $2,388 MXN applies']
    },
    {
      lbl: 'MESSAGE 3', title: 'Technical diagnosis: goes to the large model',
      text: 'With 0.88 confidence, the message goes to <code>tech_support</code>, the branch that uses the large model. Each branch uses the model it needs.',
      flows: [
        { from: 'msg', to: 'clf', k: 'ctx', label: 'message' },
        { from: 'clf', to: 'rule', k: 'ctrl', label: 'JSON', ph: 1 },
        { from: 'rule', to: 'st', k: 'ctx', label: 'message', ph: 2 }
      ],
      active: ['clf'],
      badgesReset: true, badges: { rule: ['0.88 ✔', 'ok'], st: ['route', 'info'] },
      ctx: { to: 'clf', parts: [{ k: 'input', src: 'customer C-0457', text: '"After updating the app, the code scanner won\'t open the camera."' }] },
      out: { by: 'clf', label: 'Classifier output', text: '{"category": "tech_support", "confidence": 0.88}' },
      board: { 'Message 3 · C-0457': ['tech_support (large model) · confidence 0.88', 'classifier'] },
      tr: ['MESSAGE 3', 'Route      → tech_support']
    },
    {
      lbl: 'MESSAGE 4 · A', title: 'Ambiguous message: low confidence',
      text: 'The message mixes a possible refund with an app failure. The classifier chooses "refund", but with only 0.52 confidence.',
      flows: [
        { from: 'msg', to: 'clf', k: 'ctx', label: 'message' },
        { from: 'clf', to: 'rule', k: 'ctrl', label: 'JSON', ph: 1 }
      ],
      active: ['clf'],
      badgesReset: true, badges: { rule: ['0.52 < 0.70', 'warn'] },
      ctx: { to: 'clf', parts: [{ k: 'input', src: 'customer C-3301', text: '"I want to know if you can refund me or if the problem is with the app."' }] },
      out: { by: 'clf', label: 'Classifier output', text: '{"category": "refund", "confidence": 0.52}' },
      tr: ['MESSAGE 4', 'Classifier → {"category": "refund", "confidence": 0.52}']
    },
    {
      lbl: 'MESSAGE 4 · B', title: 'The code rule corrects the route',
      text: 'The final decision is made by code, not by the classifier: with confidence below 0.70, the message goes to <code>general_inquiry</code> with the instruction to ask for more detail.',
      flows: [{ from: 'rule', to: 'cg', k: 'ctx', label: 'message + instruction' }],
      active: ['rule', 'cg'],
      badges: { cg: ['route', 'info'], re: ['discarded', 'off'] },
      ctx: { to: 'cg', parts: [
        { k: 'input', src: 'customer C-3301', text: '"I want to know if you can refund me or if the problem is with the app."' },
        { k: 'instr', src: 'code rule', text: 'Ask for more detail' }
      ] },
      out: { by: 'cg', label: 'Branch response', text: '"Happy to help. Can you tell me what happened with the app and which\npurchase you\'d like us to review?"' },
      board: { 'Message 4 · C-3301': ['refund (0.52) → code rule → general_inquiry', 'code rule'] },
      tr: ['Rule       confidence 0.52', 'purchase you\'d like us to review']
    }
  ]
};
