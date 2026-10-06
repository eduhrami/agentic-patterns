const ORIG = '"La tarde se deshizo sobre los tejados como una promesa que nadie había pedido."';
const CRIT = 'C1 fidelity of meaning · C2 preserves the main image · C3 literary register';
window.PATRON = {
  h: 420, minW: 860,
  boardTitle: 'Iterations',
  boardEmpty: 'There are no versions yet.',
  nodes: [
    { id: 'orig', type: 'input', name: 'Original and criteria', desc: 'literary fragment in Spanish', x: 10, y: 68, w: 140, mono: false },
    { id: 'tra', type: 'agent', tag: 'Maker', name: 'translator', x: 38, y: 30, w: 150 },
    { id: 'eva', type: 'agent', tag: 'Checker', name: 'evaluator', desc: 'C1 · C2 · C3', x: 68, y: 30, w: 150 },
    { id: 'lim', type: 'code', tag: 'Limit', name: '3 iterations', desc: 'when reached, escalate to a person', x: 68, y: 82, w: 170, mono: false },
    { id: 'out', type: 'output', name: 'Approved translation', x: 91, y: 30, w: 120, mono: false }
  ],
  edges: [['orig', 'tra'], ['tra', 'eva'], ['orig', 'eva'], ['eva', 'lim'], ['eva', 'out']],
  steps: [
    {
      lbl: 'DESIGN', title: 'A translator, an evaluator and a limit',
      text: 'The translator proposes; the evaluator reviews against three criteria and returns specific feedback. The loop ends upon approval or when the iteration limit is reached.',
      active: ['tra', 'eva', 'lim'],
      tr: ['PATTERN', 'LIMIT']
    },
    {
      lbl: 'ITER 1 · MAKER', title: 'The translator proposes version 1',
      text: 'The translator receives the original and the criteria it will be evaluated against.',
      flows: [{ from: 'orig', to: 'tra', k: 'ctx', label: 'original + criteria' }],
      active: ['tra'],
      ctx: { to: 'tra', parts: [{ k: 'input', src: 'original', text: ORIG }, { k: 'instr', src: 'criteria', text: CRIT }] },
      out: { by: 'tra', label: 'Version 1', text: '"The afternoon fell apart over the roofs like a promise nobody asked for."' },
      board: { iteration: '1 of 3', 'version 1': ['"The afternoon fell apart over the roofs like a promise nobody asked for."', 'translator'] },
      tr: ['ORIGINAL', 'The afternoon fell apart']
    },
    {
      lbl: 'ITER 1 · CHECKER', title: 'The evaluator rejects with specific feedback',
      text: 'The evaluator receives the original in addition to the version. Without the original it would evaluate how natural the English sounds, not its fidelity.',
      flows: [
        { from: 'tra', to: 'eva', k: 'ctx', label: 'version 1' },
        { from: 'orig', to: 'eva', k: 'ctx', label: 'original + criteria' }
      ],
      active: ['eva'],
      badges: { eva: ['revise', 'bad'], lim: ['1 of 3', 'info'] },
      ctx: { to: 'eva', parts: [
        { k: 'input', src: 'original', text: ORIG },
        { k: 'instr', src: 'criteria', text: CRIT },
        { k: 'result', src: 'translator', text: 'version 1' }
      ] },
      out: { by: 'eva', label: 'Evaluation', text: 'C1 ✔\nC2 ✘ "fell apart" suggests breaking; "se deshizo" suggests a gradual dissolving.\nC3 ✘ "nobody asked for" is colloquial; the original uses the pluperfect.\nVerdict: revise' },
      board: { 'verdict 1': ['revise (C2 ✘, C3 ✘)', 'evaluator'] },
      tr: ['Evaluator (receives: original + criteria + version 1)', 'Verdict: revise']
    },
    {
      lbl: 'ITER 2 · MAKER', title: 'The translator fixes it with the feedback',
      text: 'In the second iteration, the translator receives three things: the original, its previous version and the feedback.',
      flows: [{ from: 'eva', to: 'tra', k: 'fb', label: 'feedback' }],
      active: ['tra'],
      badges: { eva: null },
      ctx: { to: 'tra', parts: [
        { k: 'input', src: 'original', text: ORIG },
        { k: 'result', src: 'its previous version', text: '"The afternoon fell apart over the roofs like a promise nobody asked for."' },
        { k: 'feedback', src: 'evaluator', text: 'C2: "fell apart" suggests breaking; "se deshizo" suggests a gradual dissolving.\nC3: "nobody asked for" is colloquial; the original uses the pluperfect.' }
      ] },
      out: { by: 'tra', label: 'Version 2', text: '"The evening dissolved over the rooftops like a promise no one had asked for."' },
      board: { iteration: '2 of 3', 'version 2': ['"The evening dissolved over the rooftops like a promise no one had asked for."', 'translator'] },
      tr: ['Translator (receives: original + version 1 + feedback)', 'The evening dissolved']
    },
    {
      lbl: 'ITER 2 · CHECKER', title: 'The evaluator approves',
      text: 'All three criteria are met. The evaluator adds a note about the choice of "evening".',
      flows: [
        { from: 'tra', to: 'eva', k: 'ctx', label: 'version 2' },
        { from: 'eva', to: 'out', k: 'res', label: 'approved', ph: 1 }
      ],
      active: ['eva'],
      badges: { eva: ['approved', 'ok'], lim: ['2 of 3', 'info'] },
      out: { by: 'eva', label: 'Evaluation', text: 'C1 ✔\nC2 ✔ "dissolved" preserves the gradual dissolving.\nC3 ✔ "no one had asked for" keeps the pluperfect and the register.\nNote: "evening" translates "tarde" in its sense of the sun going down.\nVerdict: approved' },
      board: { 'verdict 2': ['approved', 'evaluator'], result: 'version 2, approved in 2 of 3 iterations' },
      tr: ['ITERATION 2', 'RESULT']
    }
  ]
};
