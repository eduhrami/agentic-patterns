const MSG16 = '"Since I updated the app my orders don\'t sync anymore. This is the third time it\'s happened."';
const DOC16 = 'article KB-77: version 5.2.0 loses the sync session when updating on\nAndroid 14; solution: sign out and sign in again; fix included in 5.2.1';
const HIS16 = 'Android 14 · app 5.2.0 · previous tickets T-201 (July) and T-344 (August) for\nsyncing, both closed with "reinstall"';
const CRIT16 = 'acknowledges the recurrence · avoids technical terms · gives a single clear solution step';
window.PATRON = {
  h: 470, minW: 960,
  boardTitle: 'Context transfer points',
  boardEmpty: 'There are no transfers yet.',
  groups: [
    { x: 1.5, y: 30, w: 30, hh: 40, label: 'Stage 1 · coordinator/dispatcher' },
    { x: 34, y: 6, w: 22, hh: 88, label: 'Stage 2 · parallel fan-out' },
    { x: 58.5, y: 30, w: 40, hh: 40, label: 'Stage 3 · generator-critic' }
  ],
  nodes: [
    { id: 'msg', type: 'input', tag: 'User', name: 'Customer C-6195', x: 8, y: 50, w: 110, mono: false },
    { id: 'coord', type: 'agent', name: 'coordinator', desc: 'routes by intent', x: 23, y: 50, w: 120 },
    { id: 'doc', type: 'agent', name: 'docs_search', desc: 'app_support branch · read-only', x: 45, y: 25, w: 160 },
    { id: 'his', type: 'agent', name: 'history_search', desc: 'app_support branch · read-only', x: 45, y: 75, w: 160 },
    { id: 'gen', type: 'agent', name: 'generator', desc: 'writes the response', x: 68, y: 50, w: 120 },
    { id: 'cri', type: 'agent', tag: 'Critic', name: 'tone critic', x: 89, y: 50, w: 140, mono: false }
  ],
  edges: [['msg', 'coord'], ['coord', 'doc'], ['coord', 'his'], ['doc', 'gen'], ['his', 'gen'], ['gen', 'cri']],
  steps: [
    {
      lbl: 'DESIGN', title: 'Three chained patterns',
      text: 'Each stage uses the pattern that suits its task: a coordinator routes, two searches run in parallel and a generator-critic loop reviews the tone. Between stages there are three context transfer points.',
      active: ['coord', 'doc', 'his', 'gen', 'cri'],
      tr: ['PATTERN', 'PATTERN']
    },
    {
      lbl: 'STAGE 1', title: 'The coordinator routes to the app_support branch',
      text: 'The coordinator identifies a technical problem with the app. It transfers the full message and the customer id to the <code>app_support</code> branch, which launches two searches.',
      flows: [
        { from: 'msg', to: 'coord', k: 'ctx', label: 'message' },
        { from: 'coord', to: 'doc', k: 'ctx', label: 'message + id', ph: 1 },
        { from: 'coord', to: 'his', k: 'ctx', label: 'message + id', ph: 1 }
      ],
      active: ['coord'],
      ctx: { title: 'Received by the app_support branch', parts: [{ k: 'input', src: 'full message', text: MSG16 }, { k: 'input', src: 'customer id', text: 'C-6195' }] },
      out: { by: 'coord', label: 'Decision', text: 'intent = technical problem with the app → app_support branch' },
      board: { '1. coordinator → app_support branch': ['full message + customer id', 'coordinator'] },
      tr: ['MESSAGE (customer C-6195)', 'Context transferred: full message']
    },
    {
      lbl: 'STAGE 2', title: 'Two parallel searches and a gather',
      text: 'The documentation explains the defect; the history provides a fact that will change the tone: this is the third time it has happened to this customer.',
      flows: [
        { from: 'doc', to: 'gen', k: 'res', label: 'KB-77' },
        { from: 'his', to: 'gen', k: 'res', label: 'tickets T-201, T-344' }
      ],
      active: ['doc', 'his'],
      out: [
        { by: 'doc', label: 'Result', text: DOC16 },
        { by: 'his', label: 'Result', text: HIS16 },
        { label: 'Gather', text: 'diagnosis = defect KB-77; recurrence confirmed (third case)' }
      ],
      board: { '2. parallel searches → generator': ['diagnosis KB-77 + recurrence (third case)', 'gather'] },
      tr: ['STAGE 2', 'GATHER']
    },
    {
      lbl: 'STAGE 3 · v1', title: 'The generator writes a first version',
      text: 'Version 1 is technically correct, but it uses jargon and does not acknowledge the recurrence.',
      active: ['gen'],
      ctx: { to: 'gen', parts: [
        { k: 'input', src: 'original message', text: MSG16 },
        { k: 'result', src: 'docs_search', text: 'KB-77: defect in 5.2.0; sign out; fix in 5.2.1' },
        { k: 'result', src: 'history_search', text: 'previous tickets T-201 and T-344 (third case)' }
      ] },
      out: { by: 'gen', label: 'Generator v1', text: '"Your issue corresponds to defect KB-77 in version 5.2.0, which invalidates\nthe sync token after the update."' },
      tr: ['STAGE 3', 'the sync token after the update']
    },
    {
      lbl: 'STAGE 3 · FAIL', title: 'The critic rejects the tone',
      text: 'The critic evaluates against three tone criteria.',
      flows: [
        { from: 'gen', to: 'cri', k: 'ctx', label: 'v1' },
        { from: 'cri', to: 'gen', k: 'fb', label: 'FAIL', ph: 1 }
      ],
      active: ['cri'],
      badges: { cri: ['FAIL', 'bad'] },
      ctx: { to: 'cri', parts: [{ k: 'instr', src: 'critic criteria', text: CRIT16 }, { k: 'result', src: 'generator', text: 'version 1' }] },
      out: { by: 'cri', label: 'Critic → FAIL', text: 'uses "issue" and "token" · does not acknowledge it is the third time · gives no clear step' },
      board: { '3. generator ↔ critic': ['v1 → FAIL (jargon, no recurrence, no clear step)', 'critic'] },
      tr: ['Critic → FAIL', 'gives no clear step']
    },
    {
      lbl: 'STAGE 3 · PASS', title: 'Version 2 mentions that it is the third time',
      text: 'The generator can acknowledge the recurrence because it received the history result. At each transfer point, the receiver had what it needed.',
      flows: [
        { from: 'gen', to: 'cri', k: 'ctx', label: 'v2' },
        { from: 'cri', to: 'msg', k: 'res', label: 'final response v2', ph: 1 }
      ],
      active: ['gen', 'cri'],
      badges: { cri: ['PASS', 'ok'] },
      out: { by: 'gen', label: 'Generator v2 (final response)', text: '"We\'re sorry this is happening to you for the third time. We found the cause: a bug\nin version 5.2.0. To fix it, sign out of the app and sign back in.\nVersion 5.2.1, already available, fixes the bug for good."' },
      board: { '3. generator ↔ critic': ['v1 → FAIL · v2 → PASS', 'critic'] },
      tr: ['Generator v2', '3. generator ↔ critic']
    }
  ]
};
