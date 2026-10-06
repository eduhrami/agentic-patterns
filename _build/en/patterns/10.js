window.PATRON = {
  h: 480, minW: 900,
  boardTitle: 'Task ledger',
  boardEmpty: 'The manager has not built the ledger yet.',
  nodes: [
    { id: 'inc', type: 'input', name: 'Incident 09:12', desc: 'error rate of the orders service: 23% (threshold: 2%)', x: 9, y: 22, w: 150, mono: false },
    { id: 'man', type: 'agent', tag: 'Manager', name: 'sre_manager', desc: 'plans, assigns and reorders tasks', x: 36, y: 50, w: 160 },
    { id: 'dia', type: 'agent', name: 'diagnostics', desc: 'logs and metrics (read-only)', x: 75, y: 11, w: 190 },
    { id: 'inf', type: 'agent', name: 'infrastructure', desc: 'system status and recovery options (CLI)', x: 75, y: 37, w: 190 },
    { id: 'rev', type: 'agent', name: 'rollback', desc: 'deployment rollback (Git, CLI)', x: 75, y: 63, w: 190 },
    { id: 'com', type: 'agent', name: 'communications', desc: 'notices to stakeholders (messaging API)', x: 75, y: 89, w: 190 },
    { id: 'hum', type: 'human', tag: 'Person', name: 'Mariana T.', desc: 'on-call engineer', x: 24, y: 86, w: 140, mono: false }
  ],
  edges: [['inc', 'man'], ['man', 'dia'], ['man', 'inf'], ['man', 'rev'], ['man', 'com'], ['man', 'hum']],
  steps: [
    {
      lbl: 'LEDGER v1', title: 'The manager builds a task ledger',
      text: 'The manager receives the incident and writes an initial plan. T2 is a hypothesis: roll back the 08:55 deployment. The task ledger is the shared context of the pattern.',
      flows: [{ from: 'inc', to: 'man', k: 'ctx', label: 'incident' }],
      active: ['man'],
      ctx: { to: 'man', parts: [{ k: 'input', src: 'incident', text: '09:12 · error rate of the orders service: 23% (threshold: 2%)' }] },
      board: {
        goal: ['Restore the orders service', 'sre_manager'],
        T1: ['Identify the cause · pending', 'sre_manager'],
        T2: ['Roll back the 08:55 deployment (v4.18) · pending (initial hypothesis)', 'sre_manager'],
        T3: ['Post a notice in the incidents channel · pending', 'sre_manager']
      },
      tr: ['PATTERN', 'T3 Post a notice']
    },
    {
      lbl: 'ITER 1 · NOTICE', title: 'First notice to stakeholders',
      text: 'The manager assigns the initial notice to the communications specialist.',
      flows: [
        { from: 'man', to: 'com', k: 'ctx', label: 'initial notice' },
        { from: 'com', to: 'man', k: 'res', label: 'posted', ph: 1 }
      ],
      active: ['man'],
      out: { by: 'com', label: 'Observation', text: 'notice posted in #incidents' },
      tr: ['ITERATION 1', 'Observation: notice posted']
    },
    {
      lbl: 'ITER 1 · DIAGNOSIS', title: 'The diagnosis rules out the initial hypothesis',
      text: 'The read-only diagnostics specialist finds exhausted connections in the database. Deployment v4.18 did not change data access.',
      flows: [
        { from: 'man', to: 'dia', k: 'ctx', label: 'instruction' },
        { from: 'dia', to: 'man', k: 'res', label: 'too many connections', ph: 1 }
      ],
      active: ['man'],
      ctx: { to: 'dia', parts: [{ k: 'instr', src: 'sre_manager', text: '"Analyze logs and metrics since 08:45"' }] },
      out: { by: 'dia', label: 'Observation', text: '"too many connections" errors in the orders database\nsince 09:05; deployment v4.18 did not change data access' },
      tr: ['manager → diagnostics', 'deployment v4.18 did not change']
    },
    {
      lbl: 'LEDGER v2', title: 'The manager rewrites the plan',
      text: 'T2 is discarded and T4 appears. The ledger documents why the plan changed; the rollback specialist is no longer needed.',
      active: ['man'],
      badges: { rev: ['unused', 'off'], com: ['T3 ✔', 'ok'] },
      board: {
        T1: ['Identify the cause · in progress: connections exhausted', 'sre_manager'],
        T2: ['Roll back deployment v4.18 · DISCARDED (unrelated to the cause)', 'sre_manager'],
        T3: ['Post a notice in the incidents channel · completed', 'sre_manager'],
        T4: ['Restore connectivity to the DB · new', 'sre_manager']
      },
      tr: ['TASK LEDGER v2', 'T4 Restore connectivity']
    },
    {
      lbl: 'ITER 2 · STATUS', title: 'Infrastructure finds the culprit',
      text: 'A nightly process opened 140 connections. Infrastructure returns the diagnosis and two options.',
      flows: [
        { from: 'man', to: 'inf', k: 'ctx', label: 'pool status' },
        { from: 'inf', to: 'man', k: 'res', label: 'pool 200 of 200 + options', ph: 1 }
      ],
      active: ['man'],
      out: { by: 'inf', label: 'Observation', text: 'pool at 200 of 200; the RPT-NIGHTLY process opened 140 connections at 09:04\nOptions: (a) stop RPT-NIGHTLY · (b) expand the pool to 300' },
      tr: ['ITERATION 2', 'Options:']
    },
    {
      lbl: 'APPROVAL', title: 'An action on production goes through a person',
      text: 'The manager proposes option (a) because it is reversible. Since it affects production, it requires approval from the on-call engineer.',
      flows: [
        { from: 'man', to: 'hum', k: 'human', label: 'proposal (a)' },
        { from: 'hum', to: 'man', k: 'human', label: 'approved 09:24', ph: 1 }
      ],
      active: ['man', 'hum'],
      badges: { hum: ['approved', 'ok'] },
      ctx: { to: 'hum', parts: [{ k: 'result', src: 'sre_manager', text: 'Proposal: (a) stop RPT-NIGHTLY, because it is reversible; it affects production' }] },
      out: { by: 'hum', label: 'Response', text: 'APPROVAL · on-call engineer Mariana T.: approved (09:24)' },
      board: { approval: ['Stop RPT-NIGHTLY · approved by Mariana T. (09:24)', 'person'] },
      tr: ['manager: proposes (a)', 'APPROVAL']
    },
    {
      lbl: 'ITER 2 · ACTION', title: 'Infrastructure executes the approved action',
      text: 'Three minutes later, the error rate drops to 0.8%.',
      flows: [
        { from: 'man', to: 'inf', k: 'ctx', label: 'stop RPT-NIGHTLY' },
        { from: 'inf', to: 'man', k: 'res', label: 'error 0.8%', ph: 1 }
      ],
      active: ['man'],
      out: { by: 'inf', label: 'Observation', text: 'pool at 64 of 200 · error rate 0.8% at 09:27' },
      tr: ['manager → infrastructure: stop', 'pool at 64 of 200']
    },
    {
      lbl: 'ITER 3', title: 'Recovery notice',
      text: 'The manager uses the communications specialist again.',
      flows: [
        { from: 'man', to: 'com', k: 'ctx', label: 'recovery notice' },
        { from: 'com', to: 'man', k: 'res', label: 'posted', ph: 1 }
      ],
      active: ['man'],
      out: { by: 'com', label: 'Observation', text: 'notice posted in #incidents' },
      tr: ['ITERATION 3', 'Observation: notice posted']
    },
    {
      lbl: 'LEDGER v3', title: 'Goal met and one task for a person',
      text: 'The manager evaluates the goal and ends. The underlying question (why the process ran during business hours) is assigned to a person. The full ledger is available for the post-incident review.',
      active: ['man'],
      badges: { dia: ['✔', 'ok'], inf: ['T4 ✔', 'ok'] },
      board: {
        T1: ['completed', 'sre_manager'], T2: ['discarded', 'sre_manager'], T3: ['completed', 'sre_manager'], T4: ['completed', 'sre_manager'],
        T5: ['Review why RPT-NIGHTLY ran during business hours · assigned to a person', 'sre_manager'],
        evaluation: ['Was the goal met? Yes → end · duration: 18 minutes', 'sre_manager']
      },
      tr: ['TASK LEDGER v3', 'DURATION']
    }
  ]
};
