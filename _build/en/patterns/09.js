window.PATRON = {
  h: 480, minW: 900,
  boardTitle: 'Report in progress',
  boardEmpty: 'The report has no sections yet.',
  groups: [
    { x: 1.5, y: 4, w: 46, hh: 30, label: 'Level 1' },
    { x: 26, y: 40, w: 30, hh: 30, label: 'Level 2' },
    { x: 62, y: 40, w: 36, hh: 56, label: 'Level 3' }
  ],
  nodes: [
    { id: 'task', type: 'input', name: 'Task', desc: 'quarterly satisfaction report 2026-Q3', x: 11, y: 19, w: 140, mono: false },
    { id: 'n1', type: 'agent', tag: 'L1', name: 'report_writer', desc: 'tool: research_assistant', x: 35, y: 19, w: 175 },
    { id: 'n2', type: 'agent', tag: 'L2 · sub-agent as a tool', name: 'research_assistant', desc: 'tools: internal_search, summarizer', x: 41, y: 55, w: 190 },
    { id: 'bus', type: 'agent', tag: 'L3', name: 'internal_search', x: 80, y: 55, w: 160 },
    { id: 'res', type: 'agent', tag: 'L3', name: 'summarizer', x: 80, y: 84, w: 160 },
    { id: 'out', type: 'output', name: 'Three-section report', x: 80, y: 19, w: 160, mono: false }
  ],
  edges: [['task', 'n1'], ['n1', 'n2'], ['n2', 'bus'], ['n2', 'res'], ['n1', 'out']],
  steps: [
    {
      lbl: 'LEVELS', title: 'Three levels of agents',
      text: 'L1 writes the report. For L1, the research assistant is just another tool; that assistant, in turn, coordinates two sub-agents.',
      active: ['n1', 'n2', 'bus', 'res'],
      tr: ['PATTERN', 'L3 internal_search · summarizer']
    },
    {
      lbl: 'L1 · SECTION 1', title: 'L1 writes with the data it already has',
      text: 'L1 receives the task and writes the first section. Before the second one, it notices it needs to explain the August drop.',
      flows: [{ from: 'task', to: 'n1', k: 'ctx', label: 'task' }],
      active: ['n1'],
      ctx: { to: 'n1', parts: [{ k: 'input', src: 'task', text: '"Write the quarterly customer satisfaction report (2026-Q3)."' }] },
      out: { by: 'n1', label: 'Produces', text: 'Section 1 with the available data: NPS July 42 · August 35 · September 39\nThought: before section 2 I need to explain the August drop.' },
      board: { 'section 1': ['NPS July 42 · August 35 · September 39', 'L1'] },
      tr: ['TASK', 'Thought:     before section 2']
    },
    {
      lbl: 'L1 → L2', title: 'L1 delegates a scoped question and waits',
      text: 'L1 delegates only part of its task. It asks for causes <b>with evidence</b>, because it needs them to support section 2.',
      flows: [{ from: 'n1', to: 'n2', k: 'ctx', label: 'scoped question' }],
      active: ['n1'],
      badges: { n1: ['waiting', 'warn'] },
      ctx: { to: 'n2', parts: [{ k: 'instr', src: 'L1 report_writer', text: '"What explains the NPS drop from 42 to 35 in\nAugust 2026? Return causes with evidence."' }] },
      tr: ['Calls:       research_assistant', 'Waits for the result']
    },
    {
      lbl: 'L2 → L3', title: 'L2 decides how to investigate: first search',
      text: 'L1 decided what to ask; L2 decides how to investigate it.',
      flows: [
        { from: 'n2', to: 'bus', k: 'ctx', label: 'query' },
        { from: 'bus', to: 'n2', k: 'res', label: '38% wait time', ph: 1 }
      ],
      active: ['n2'],
      ctx: { to: 'bus', parts: [{ k: 'instr', src: 'L2', text: '"detractor comments, August 2026"' }] },
      out: { by: 'bus', label: 'Returns to L2', text: '1,180 comments; 38% mention the wait time' },
      tr: ['L2 · research_assistant', '38% mention the wait time']
    },
    {
      lbl: 'L2 → L3', title: 'Second search: the fact that confirms the hypothesis',
      text: 'The first search suggested the wait time; L2 verifies it with a second search.',
      flows: [
        { from: 'n2', to: 'bus', k: 'ctx', label: 'query' },
        { from: 'bus', to: 'n2', k: 'res', label: '4 → 11 min', ph: 1 }
      ],
      active: ['n2'],
      ctx: { to: 'bus', parts: [{ k: 'instr', src: 'L2', text: '"average phone line wait time, July and August 2026"' }] },
      out: { by: 'bus', label: 'Returns to L2', text: 'July 4 min · August 11 min' },
      tr: ['average phone line wait time', 'July 4 min · August 11 min']
    },
    {
      lbl: 'L2 → L3', title: 'The summarizer combines the two searches',
      text: 'The summarizer receives the results of the two searches and finds the match.',
      flows: [
        { from: 'n2', to: 'res', k: 'ctx', label: 'search results' },
        { from: 'res', to: 'n2', k: 'res', label: 'match', ph: 1 }
      ],
      active: ['n2'],
      ctx: { to: 'res', parts: [
        { k: 'result', src: 'search 1', text: '1,180 comments; 38% mention the wait time' },
        { k: 'result', src: 'search 2', text: 'July 4 min · August 11 min' }
      ] },
      out: { by: 'res', label: 'Returns to L2', text: 'the drop coincides with the increase in wait time' },
      tr: ['Calls:   summarizer', 'the drop coincides']
    },
    {
      lbl: 'L2 → L1', title: 'L2 returns cause and evidence, not the searches',
      text: 'L2 gives L1 a compact answer with the cause and its evidence. The detailed searches stay in L2\'s context and do not take up L1\'s context window.\n\nIf L2 had returned only "wait time", without the evidence, L1 could not support section 2.',
      flows: [{ from: 'n2', to: 'n1', k: 'res', label: 'cause + evidence' }],
      active: ['n2'],
      badges: { n1: null },
      ctx: { to: 'n1', parts: [{ k: 'result', src: 'research_assistant', text: 'Main cause: the wait time went from 4 to 11 minutes.\nEvidence: 38% of 1,180 detractor comments mention it.' }],
        miss: ['The L3 searches: they stayed in L2\'s context.'] },
      tr: ['Returns to L1:', 'Evidence: 38% of 1,180']
    },
    {
      lbl: 'L1 · CONTINUES', title: 'L1 resumes its own reasoning',
      text: 'L1 kept the thread and the state while it waited. With the answer it writes sections 2 and 3.',
      flows: [{ from: 'n1', to: 'out', k: 'res', label: 'report' }],
      active: ['n1'],
      board: {
        'section 2': ['Cause: the wait time went from 4 to 11 minutes (38% of 1,180 detractor comments)', 'L1'],
        'section 3': ['Recovery to 39 in September and recommendations', 'L1']
      },
      tr: ['L1 · report_writer (continues)', 'RESULT']
    }
  ]
};
