const F27 = 'def export_report(user, path):\n    os.system("zip /tmp/report.zip " + path)\n    return "/tmp/report.zip"';
const F28 = 'def connect():\n    logger.info("Connecting to %s", os.environ["DB_URL"])\n    return psycopg.connect(os.environ["DB_URL"])';
function votersCtx(frag, code) {
  return [
    { to: 'v1', parts: [{ k: 'instr', src: 'V1 prompt', text: 'Focus: SQL and command injection' }, { k: 'input', src: frag, text: code }] },
    { to: 'v2', parts: [{ k: 'instr', src: 'V2 prompt', text: 'Focus: exposed credentials and secrets' }, { k: 'input', src: frag, text: '(same fragment)' }] },
    { to: 'v3', parts: [{ k: 'instr', src: 'V3 prompt', text: 'Focus: input validation and permissions' }, { k: 'input', src: frag, text: '(same fragment)' }] }
  ];
}
window.PATRON = {
  h: 440, minW: 880,
  boardTitle: 'Vote count',
  boardEmpty: 'The votes appear here.',
  nodes: [
    { id: 'frag', type: 'input', name: 'Code fragment', desc: 'does it contain a vulnerability?', x: 9, y: 50, w: 140, mono: false },
    { id: 'v1', type: 'agent', tag: 'Voter V1', name: 'SQL and command injection', x: 40, y: 15, w: 180, mono: false },
    { id: 'v2', type: 'agent', tag: 'Voter V2', name: 'exposed credentials and secrets', x: 40, y: 50, w: 180, mono: false },
    { id: 'v3', type: 'agent', tag: 'Voter V3', name: 'input validation and permissions', x: 40, y: 85, w: 180, mono: false },
    { id: 'rule', type: 'code', tag: 'Voting rule', name: '"any"', desc: 'a single positive vote is enough', x: 69, y: 50, w: 140 },
    { id: 'out', type: 'output', name: 'Decision', x: 90, y: 50, w: 110, mono: false }
  ],
  edges: [['frag', 'v1'], ['frag', 'v2'], ['frag', 'v3'], ['v1', 'rule'], ['v2', 'rule'], ['v3', 'rule'], ['rule', 'out']],
  steps: [
    {
      lbl: 'DESIGN', title: 'Three different prompts over the same input',
      text: 'The voters receive the same fragment, but each one with a prompt focused on one type of vulnerability. The voters only issue judgments; the decision is made by a rule defined in the design.',
      active: ['v1', 'v2', 'v3', 'rule'],
      tr: ['PATTERN', 'ACTIVE RULE']
    },
    {
      lbl: 'F-27 · VOTES', title: 'Fragment F-27: each voter issues an independent judgment',
      text: 'No voter sees the others\' votes. Each one returns JSON with its verdict and its reason.',
      flows: [
        { from: 'frag', to: 'v1', k: 'ctx', label: 'F-27' }, { from: 'frag', to: 'v2', k: 'ctx', label: 'F-27' }, { from: 'frag', to: 'v3', k: 'ctx', label: 'F-27' },
        { from: 'v1', to: 'rule', k: 'res', label: 'true', ph: 1 }, { from: 'v2', to: 'rule', k: 'res', label: 'false', ph: 1 }, { from: 'v3', to: 'rule', k: 'res', label: 'true', ph: 1 }
      ],
      active: ['frag'],
      badgesReset: true, badges: { v1: ['vulnerable', 'bad'], v2: ['no', 'ok'], v3: ['vulnerable', 'bad'] },
      ctx: votersCtx('fragment F-27', F27),
      out: { label: 'Votes', text: 'V1 → {"vulnerable": true,  "reason": "path is concatenated into a system command"}\nV2 → {"vulnerable": false}\nV3 → {"vulnerable": true,  "reason": "it does not check that the user has permission on the path"}' },
      board: { 'F-27 votes': 'V1 yes · V2 no · V3 yes' },
      tr: ['FRAGMENT F-27', 'V3 → {"vulnerable": true']
    },
    {
      lbl: 'F-27 · RULE', title: 'The rule counts: 2 of 3, flagged',
      text: 'The rule does not interpret the reasons: it only counts the positive votes.',
      flows: [{ from: 'rule', to: 'out', k: 'ctrl', label: 'FLAGGED' }],
      active: ['rule'],
      badges: { out: ['F-27 flagged', 'bad'] },
      out: { by: 'rule', label: 'Count', text: 'Count:    2 of 3\nDecision: FLAGGED' },
      board: { 'F-27 decision': '2 of 3 → FLAGGED' },
      tr: ['Count:    2 of 3', 'Decision: FLAGGED']
    },
    {
      lbl: 'F-28 · VOTES', title: 'Fragment F-28: only one voter detects the problem',
      text: 'The voter specialized in secrets is the only one that notices that <code>DB_URL</code> includes the password and is written to the log.',
      flows: [
        { from: 'frag', to: 'v1', k: 'ctx', label: 'F-28' }, { from: 'frag', to: 'v2', k: 'ctx', label: 'F-28' }, { from: 'frag', to: 'v3', k: 'ctx', label: 'F-28' },
        { from: 'v1', to: 'rule', k: 'res', label: 'false', ph: 1 }, { from: 'v2', to: 'rule', k: 'res', label: 'true', ph: 1 }, { from: 'v3', to: 'rule', k: 'res', label: 'false', ph: 1 }
      ],
      active: ['frag'],
      badgesReset: true, badges: { v1: ['no', 'ok'], v2: ['vulnerable', 'bad'], v3: ['no', 'ok'] },
      ctx: votersCtx('fragment F-28', F28),
      out: { label: 'Votes', text: 'V1 → {"vulnerable": false}\nV2 → {"vulnerable": true,  "reason": "DB_URL includes the password and is written to the log"}\nV3 → {"vulnerable": false}' },
      board: { 'F-28 votes': 'V1 no · V2 yes · V3 no' },
      tr: ['FRAGMENT F-28', 'V3 → {"vulnerable": false}']
    },
    {
      lbl: 'F-28 · RULE', title: 'With "any", 1 of 3 is enough to flag',
      text: 'The "any" rule makes sense when a false negative costs more than reviewing a false positive.',
      flows: [{ from: 'rule', to: 'out', k: 'ctrl', label: 'FLAGGED' }],
      active: ['rule'],
      badges: { out: ['F-28 flagged', 'bad'] },
      out: { by: 'rule', label: 'Count', text: 'Count:    1 of 3\nDecision: FLAGGED' },
      board: { 'F-28 decision': '1 of 3 → FLAGGED' },
      tr: ['Count:    1 of 3', 'Decision: FLAGGED']
    },
    {
      lbl: 'EFFECT', title: 'The same vote under three different rules',
      text: '"Majority" would have let F-28 through. "Unanimity" would also have let F-27 through. The votes do not change; what changes is the rule in the design.',
      active: ['rule'],
      out: { label: 'Effect of the rule', text: 'Fragment    Votes   Any          Majority (≥ 2)  Unanimity\nF-27        2 of 3  flagged      flagged         not flagged\nF-28        1 of 3  flagged      not flagged     not flagged' },
      board: { 'Rule "any"': 'F-27 flagged · F-28 flagged', 'Rule "majority"': 'F-27 flagged · F-28 not flagged', 'Rule "unanimity"': 'F-27 not flagged · F-28 not flagged' },
      tr: ['EFFECT OF THE RULE', 'F-28        1 of 3']
    }
  ]
};
