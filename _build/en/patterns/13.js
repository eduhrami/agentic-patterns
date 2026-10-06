const OBJ = 'Function that returns the 10 customers with the most orders, as [[customer_id, count], ...]';
const V1 = 'def top_customers(orders):\n    counts = []\n    for o in orders:\n        found = False\n        for c in counts:\n            if c[0] == o["customer_id"]:\n                c[1] += 1\n                found = True\n        if not found:\n            counts.append([o["customer_id"], 1])\n    counts.sort(key=lambda c: c[1], reverse=True)\n    return counts[:10]';
const V2 = 'from collections import Counter\ndef top_customers(orders):\n    return Counter(o["customer_id"] for o in orders).most_common(10)';
const V3 = 'from collections import Counter\ndef top_customers(orders):\n    counts = Counter(o["customer_id"] for o in orders)\n    return [[customer, n] for customer, n in counts.most_common(10)]';
window.PATRON = {
  h: 460, minW: 880,
  boardTitle: 'Versions and notes',
  boardEmpty: 'There is no code yet.',
  nodes: [
    { id: 'obj', type: 'input', name: 'Goal', desc: 'top 10 customers as [[customer_id, count], ...]', x: 10, y: 62, w: 150, mono: false },
    { id: 'gen', type: 'agent', name: 'generator', desc: 'draft v1', x: 36, y: 22, w: 140 },
    { id: 'cri', type: 'agent', name: 'critic', desc: 'improvement notes with severity', x: 62, y: 22, w: 150, mono: false },
    { id: 'ref', type: 'agent', name: 'refiner', desc: 'rewrites the code', x: 62, y: 72, w: 150 },
    { id: 'umb', type: 'code', tag: 'Exit condition', name: 'no medium or high notes', desc: 'limit: 3 iterations', x: 88, y: 22, w: 150, mono: false },
    { id: 'out', type: 'output', name: 'Accepted version', x: 88, y: 72, w: 120, mono: false }
  ],
  edges: [['obj', 'gen'], ['gen', 'cri'], ['cri', 'ref'], ['obj', 'cri'], ['cri', 'umb'], ['umb', 'out']],
  steps: [
    {
      lbl: 'DESIGN', title: 'Generate, critique, refine',
      text: 'Unlike generator-critic, the critic does not approve or reject: it writes improvement notes with severity. The loop ends when there are no more medium or high severity notes, or when the limit is reached.',
      active: ['gen', 'cri', 'ref', 'umb'],
      tr: ['PATTERN', 'LIMIT']
    },
    {
      lbl: 'DRAFT v1', title: 'The generator writes the first draft',
      text: 'The draft meets the requested format (list of lists), but it is inefficient.',
      flows: [{ from: 'obj', to: 'gen', k: 'ctx', label: 'goal' }],
      active: ['gen'],
      ctx: { to: 'gen', parts: [{ k: 'input', src: 'goal', text: OBJ }] },
      out: { by: 'gen', label: 'Draft v1', text: V1 },
      board: { 'current code': ['v1 (list of lists, linear search)', 'generator'] },
      tr: ['GENERATOR · draft v1', 'return counts[:10]']
    },
    {
      lbl: 'ITER 1 · CRITIC', title: 'The critic points out two efficiency problems',
      text: 'The critic receives the original goal in addition to the code. That will later allow it to detect a change nobody asked for.',
      flows: [
        { from: 'gen', to: 'cri', k: 'ctx', label: 'v1' },
        { from: 'obj', to: 'cri', k: 'ctx', label: 'goal' }
      ],
      active: ['cri'],
      badges: { umb: ['high + medium', 'bad'] },
      ctx: { to: 'cri', parts: [{ k: 'input', src: 'original goal', text: OBJ }, { k: 'result', src: 'generator', text: 'draft v1' }] },
      out: { by: 'cri', label: 'Notes', text: 'High:   the linear search inside the loop costs O(n × k) for n orders and k customers.\nMedium: the whole list is sorted to get only 10 elements.' },
      board: { 'iteration 1 notes': ['High: linear search O(n × k)\nMedium: sorts the whole list', 'critic'] },
      tr: ['ITERATION 1', 'Medium: the whole list is sorted']
    },
    {
      lbl: 'ITER 1 · REFINER', title: 'The refiner improves the code and changes something nobody asked for',
      text: 'Version 2 addresses both notes, but <code>most_common</code> returns tuples, not lists. The refiner made an implicit decision: it changed the return type.',
      flows: [{ from: 'cri', to: 'ref', k: 'fb', label: 'notes' }],
      active: ['ref'],
      ctx: { to: 'ref', parts: [
        { k: 'result', src: 'current code', text: 'draft v1' },
        { k: 'feedback', src: 'critic', text: 'High: linear search O(n × k)\nMedium: the whole list is sorted to get only 10 elements' }
      ] },
      out: { by: 'ref', label: 'Version 2', text: V2 },
      board: { 'current code': ['v2 (Counter.most_common: list of tuples)', 'refiner'] },
      tr: ['Refiner → v2', 'most_common(10)']
    },
    {
      lbl: 'ITER 2 · CRITIC', title: 'The critic detects the type change',
      text: 'The critic detects it because it receives the original goal, which specifies the output format. Without the goal, v2 would look like a flawless improvement.',
      flows: [
        { from: 'ref', to: 'cri', k: 'ctx', label: 'v2' },
        { from: 'obj', to: 'cri', k: 'ctx', label: 'goal' }
      ],
      active: ['cri'],
      badges: { umb: ['medium', 'bad'] },
      ctx: { to: 'cri', parts: [{ k: 'input', src: 'original goal', text: OBJ }, { k: 'result', src: 'refiner', text: 'version 2' }] },
      out: { by: 'cri', label: 'Notes', text: 'Medium: the return type changed from a list of lists to a list of tuples;\n        code that modifies c[1] in the result would fail.' },
      board: { 'iteration 2 notes': ['Medium: the return type changed to a list of tuples', 'critic'] },
      tr: ['ITERATION 2', 'code that modifies c[1]']
    },
    {
      lbl: 'ITER 2 · REFINER', title: 'The refiner restores the format',
      text: 'Version 3 keeps the efficiency of <code>Counter</code> and once again returns a list of lists.',
      flows: [{ from: 'cri', to: 'ref', k: 'fb', label: 'notes' }],
      active: ['ref'],
      ctx: { to: 'ref', parts: [
        { k: 'result', src: 'current code', text: 'version 2' },
        { k: 'feedback', src: 'critic', text: 'Medium: the return type changed from a list of lists to a list of tuples' }
      ] },
      out: { by: 'ref', label: 'Version 3', text: V3 },
      board: { 'current code': ['v3 (Counter + list of lists)', 'refiner'] },
      tr: ['Refiner → v3', 'return [[customer, n]']
    },
    {
      lbl: 'ITER 3', title: 'Only a low note remains: the threshold is reached',
      text: 'The only note is low severity. The exit condition is met right at the iteration limit.',
      flows: [
        { from: 'ref', to: 'cri', k: 'ctx', label: 'v3' },
        { from: 'cri', to: 'umb', k: 'ctrl', label: 'low note only', ph: 1 },
        { from: 'umb', to: 'out', k: 'res', label: 'v3', ph: 2 }
      ],
      active: ['cri', 'umb'],
      badges: { umb: ['threshold reached', 'ok'] },
      out: { by: 'cri', label: 'Notes', text: 'Low: add type annotations.\nExit signal: threshold reached (no medium or high notes)' },
      board: { 'iteration 3 notes': ['Low: add type annotations', 'critic'], result: 'v3, accepted in iteration 3 of 3' },
      tr: ['ITERATION 3', 'RESULT']
    }
  ]
};
