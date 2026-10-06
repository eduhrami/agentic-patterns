window.PATRON = {
  h: 470, minW: 900,
  boardTitle: 'Shared thread',
  boardEmpty: 'The thread is empty.',
  nodes: [
    { id: 'prop', type: 'input', name: 'Proposal P-2026-14', desc: 'Las Lomas Park (fictitious)', x: 10, y: 14, w: 150, mono: false },
    { id: 'man', type: 'agent', tag: 'Chat manager', name: 'moderates the turns', desc: 'maximum 6 rounds · end: no participant has objections', x: 82, y: 14, w: 190, mono: false },
    { id: 'hilo', type: 'state', name: 'Shared thread', desc: 'all participants read the same thread', x: 46, y: 45, w: 220, mono: false },
    { id: 'com', type: 'agent', name: 'community', desc: 'accessibility and expected use', x: 12, y: 85, w: 150 },
    { id: 'amb', type: 'agent', name: 'environmental', desc: 'ecological impact and regulations', x: 36, y: 85, w: 150 },
    { id: 'pre', type: 'agent', name: 'budget', desc: 'construction and operating costs', x: 60, y: 85, w: 150 },
    { id: 'ana', type: 'human', name: 'Ana R.', desc: 'Parks Department', x: 84, y: 85, w: 140, mono: false }
  ],
  edges: [['prop', 'hilo'], ['man', 'hilo'], ['hilo', 'com'], ['hilo', 'amb'], ['hilo', 'pre'], ['hilo', 'ana']],
  steps: [
    {
      lbl: 'PROPOSAL', title: 'The proposal enters the shared thread',
      text: 'Three read-only agents and a department employee will evaluate the proposal. They all read the same thread. The chat manager decides who speaks and when the discussion ends.',
      flows: [{ from: 'prop', to: 'hilo', k: 'ctx', label: 'proposal' }],
      active: ['hilo'],
      board: { proposal: ['3.2 ha · artificial turf field · 1.1 km walking path · 120 trees\nconstruction: $18.5 M MXN · available annual maintenance budget: $1.3 M MXN', 'input'] },
      tr: ['PATTERN', 'available annual maintenance budget']
    },
    {
      lbl: 'ROUND 1', title: 'Each participant analyzes from its own angle',
      text: 'The manager gives the floor to three agents. Each message is added to the thread, so the next participant can already read it.',
      flows: [
        { from: 'man', to: 'com', k: 'ctrl', label: 'turn', ph: 0 }, { from: 'com', to: 'hilo', k: 'res', label: 'message', ph: 1 },
        { from: 'man', to: 'amb', k: 'ctrl', label: 'turn', ph: 2 }, { from: 'amb', to: 'hilo', k: 'res', label: 'message', ph: 3 },
        { from: 'man', to: 'pre', k: 'ctrl', label: 'turn', ph: 4 }, { from: 'pre', to: 'hilo', k: 'res', label: 'message', ph: 5 }
      ],
      active: ['man'],
      badges: { com: ['objection', 'bad'], amb: ['objection', 'bad'], pre: ['objection', 'bad'] },
      ctx: { title: 'Received by each participant', parts: [{ k: 'hist', src: 'shared thread', text: 'The proposal and the earlier messages of the round' }] },
      board: {
        'R1 · community': ['The walking path has no ramps on the west side, where the elementary school is.', 'community'],
        'R1 · environmental': ['The artificial turf seals 0.7 ha of permeable soil in an area prone to flooding.', 'environmental'],
        'R1 · budget': ['Annual maintenance with artificial turf: $1.4 M, which includes a $0.4 M reserve\nto replace the turf. It exceeds the $1.3 M budget.', 'budget']
      },
      tr: ['ROUND 1', 'It exceeds the $1.3 M budget.']
    },
    {
      lbl: 'ROUND 2', title: 'The manager proposes evaluating a change',
      text: 'With natural grass, permeability improves and construction costs drop, but maintenance is still above the budget.',
      flows: [
        { from: 'man', to: 'hilo', k: 'ctrl', label: 'evaluate natural grass', ph: 0 },
        { from: 'amb', to: 'hilo', k: 'res', label: 'message', ph: 1 },
        { from: 'pre', to: 'hilo', k: 'res', label: 'message', ph: 2 }
      ],
      active: ['man'],
      badges: { amb: ['reviewing', 'warn'], pre: ['objection', 'bad'] },
      board: {
        'R2 · manager': ['Asks to evaluate switching to natural grass', 'chat manager'],
        'R2 · environmental': ['Natural grass keeps the soil permeable, but it requires irrigation.', 'environmental'],
        'R2 · budget': ['Construction drops by $2.1 M. Maintenance removes the $0.4 M reserve and\nadds $0.35 M for care and irrigation: $1.35 M, still above the budget.', 'budget']
      },
      tr: ['ROUND 2', 'still above the budget']
    },
    {
      lbl: 'ROUND 3', title: 'The person provides the fact that unblocks the budget',
      text: 'Ana R. mentions the treated water agreement. Because the thread is shared, budget uses it in the same turn and maintenance falls within the budget.',
      flows: [
        { from: 'ana', to: 'hilo', k: 'human', label: 'treated water agreement', ph: 0 },
        { from: 'hilo', to: 'pre', k: 'ctx', label: 'full thread', ph: 1 },
        { from: 'pre', to: 'hilo', k: 'res', label: '$1.25 M', ph: 2 },
        { from: 'com', to: 'hilo', k: 'res', label: 'ramps $0.3 M', ph: 3 }
      ],
      active: ['ana'],
      badges: { pre: ['within budget', 'ok'], com: ['proposes', 'warn'] },
      ctx: { to: 'pre', parts: [
        { k: 'hist', src: 'shared thread', text: 'Proposal · round 1 · round 2 ($1.35 M, above the budget)' },
        { k: 'human', src: 'Ana R.', text: 'The city has an agreement for treated water for irrigation at half the cost.' }
      ] },
      board: {
        'R3 · Ana R.': ['The city has an agreement for treated water for irrigation at half the cost.', 'person'],
        'R3 · budget': ['Of the $0.35 M, $0.2 M is irrigation; with treated water it drops to $0.1 M.\nMaintenance: $1.25 M, within the budget.', 'budget'],
        'R3 · community': ['Two ramps on the west side cost $0.3 M in construction.', 'community']
      },
      tr: ['ROUND 3', 'Two ramps on the west side']
    },
    {
      lbl: 'ROUND 4', title: 'Summary and end criterion',
      text: 'The manager summarizes the adjusted proposal and asks everyone. Nobody has objections: the end criterion is met in round 4 of 6.',
      flows: [
        { from: 'man', to: 'hilo', k: 'ctrl', label: 'summary', ph: 0 },
        { from: 'com', to: 'hilo', k: 'res', label: 'no objections', ph: 1 }, { from: 'amb', to: 'hilo', k: 'res', label: 'no objections', ph: 1 },
        { from: 'pre', to: 'hilo', k: 'res', label: 'no objections', ph: 1 }, { from: 'ana', to: 'hilo', k: 'human', label: 'no objections', ph: 1 }
      ],
      active: ['man'],
      badges: { com: ['no objections', 'ok'], amb: ['no objections', 'ok'], pre: ['no objections', 'ok'], ana: ['no objections', 'ok'], man: ['end: round 4 of 6', 'ok'] },
      board: {
        'R4 · manager': ['Natural grass irrigated with treated water · two ramps on the west side\nConstruction: 18.5 − 2.1 + 0.3 = $16.7 M · maintenance: $1.25 M per year', 'chat manager'],
        'R4 · vote': ['community, environmental, budget and person: no objections', 'everyone']
      },
      tr: ['ROUND 4', 'RESULT']
    }
  ]
};
