window.PATRON = {
  h: 440, minW: 980,
  boardTitle: 'Shared state',
  boardEmpty: 'The shared state keys fill up as the agents progress.',
  nodes: [
    { id: 'in', type: 'input', name: 'Request', desc: 'Consulting agreement', x: 7, y: 28, w: 110, mono: false },
    { id: 'a1', type: 'agent', tag: 'Agent A1', name: 'template_selector', desc: 'template_library', x: 22, y: 28, w: 135 },
    { id: 'a2', type: 'agent', tag: 'Agent A2', name: 'clause_customizer', desc: 'fine-tuned model', x: 38, y: 28, w: 140 },
    { id: 'gate', type: 'code', tag: 'Gate 1', name: 'programmatic check', desc: 'negotiated terms', x: 53.5, y: 28, w: 125, mono: false },
    { id: 'a3', type: 'agent', tag: 'Agent A3', name: 'compliance_reviewer', desc: 'regulatory_db', x: 69, y: 28, w: 135 },
    { id: 'a4', type: 'agent', tag: 'Agent A4', name: 'risk_assessor', desc: 'liability_db, save_document', x: 84.5, y: 28, w: 135 },
    { id: 'st', type: 'state', name: 'Shared state', desc: 'request · template · draft · compliance_findings · risk_assessment', x: 45, y: 78, w: 380, mono: false },
    { id: 'out', type: 'output', name: 'Contract v2', desc: 'for the responsible attorney', x: 84.5, y: 78, w: 135, mono: false }
  ],
  edges: [['in', 'a1'], ['a1', 'a2'], ['a2', 'gate'], ['gate', 'a3'], ['a3', 'a4'],
          ['in', 'st'], ['a1', 'st'], ['a2', 'st'], ['gate', 'st'], ['a3', 'st'], ['a4', 'st'], ['a4', 'out']],
  steps: [
    {
      lbl: 'DESIGN', title: 'The design fixes the order of the four agents',
      text: 'Four agents in a fixed order, with a programmatic check (gate) between the second and the third. No agent decides who comes next: the order is written in the design.\n\nAll of them read from and write to a <b>shared state</b> with five keys. At each step, notice which keys each agent receives.',
      active: ['a1', 'a2', 'gate', 'a3', 'a4'],
      tr: ['PATTERN', 'request · template · draft']
    },
    {
      lbl: 'INPUT', title: 'The request enters the shared state',
      text: 'The request with the negotiated terms is stored in the <code>request</code> key. Any agent in the chain can read it.',
      flows: [{ from: 'in', to: 'st', k: 'ctx', label: 'request' }],
      board: { request: ['Consulting services agreement\nParties: Consultora Delta (provider) and Industrias Ríos (client)\nJurisdiction: Monterrey, Nuevo León\nTerms: $480,000 MXN plus VAT · 3 installments ·\nliability cap equal to the contract amount · 6-month term', 'input'] },
      tr: ['INPUT', 'liability cap equal to the contract amount']
    },
    {
      lbl: 'STEP 1', title: 'A1 chooses the template',
      text: 'A1 receives only the request, searches the library and writes the chosen template to the state.',
      flows: [
        { from: 'st', to: 'a1', k: 'ctx', label: 'request' },
        { from: 'a1', to: 'st', k: 'res', label: 'template', ph: 1 }
      ],
      active: ['a1'],
      ctx: { to: 'a1', parts: [{ k: 'state', src: 'request', text: 'Consulting services agreement · Nuevo León · negotiated terms' }] },
      out: { by: 'a1', label: 'Produces', text: 'Action:      find_template(type = "professional services", jurisdiction = "Nuevo León")\nObservation: template PSP-NL-07, version 2026-03' },
      board: { template: ['PSP-NL-07, version 2026-03', 'A1 template_selector'] },
      tr: ['STEP 1 ·', 'Writes:      template']
    },
    {
      lbl: 'STEP 2', title: 'A2 customizes the clauses',
      text: 'A2 receives the request and the template. With the negotiated terms it writes draft v1.',
      flows: [
        { from: 'st', to: 'a2', k: 'ctx', label: 'request + template' },
        { from: 'a2', to: 'st', k: 'res', label: 'draft v1', ph: 1 }
      ],
      active: ['a2'],
      ctx: { to: 'a2', parts: [
        { k: 'state', src: 'request', text: '$480,000 MXN plus VAT · 3 installments · liability cap equal to the contract amount · 6-month term' },
        { k: 'state', src: 'template (A1)', text: 'PSP-NL-07, version 2026-03' }
      ] },
      out: { by: 'a2', label: 'Produces', text: 'draft v1\nThird clause (payment): 3 installments of $160,000 MXN plus VAT\nEighth clause (liability): cap of $480,000 MXN\nTenth clause (term): 6 months from signature' },
      board: { draft: ['v1: third (payment), eighth (liability) and tenth (term) clauses', 'A2 clause_customizer'] },
      tr: ['STEP 2 ·', 'Writes:      draft']
    },
    {
      lbl: 'GATE 1', title: 'A programmatic check reviews the draft',
      text: 'The gate is not an agent: it is code that compares each negotiated term against the draft. If one were missing, the chain would stop here instead of propagating an incomplete draft.',
      flows: [{ from: 'st', to: 'gate', k: 'ctrl', label: 'request + draft v1' }],
      active: ['gate'],
      badges: { gate: ['continue', 'ok'] },
      out: { by: 'gate', label: 'Result', text: 'Rule:     every negotiated term appears in the draft\nResult:   amount ✔ · installments ✔ · liability cap ✔ · term ✔\nDecision: continue to step 3' },
      tr: ['GATE 1', 'Decision:    continue to step 3']
    },
    {
      lbl: 'STEP 3', title: 'A3 reviews compliance',
      text: 'A3 receives the original request in addition to the draft. It queries the regulatory database, finds two omissions and produces draft v2. It writes to two keys.',
      flows: [
        { from: 'st', to: 'a3', k: 'ctx', label: 'request + draft v1' },
        { from: 'a3', to: 'st', k: 'res', label: 'findings + draft v2', ph: 1 }
      ],
      active: ['a3'],
      ctx: { to: 'a3', parts: [
        { k: 'state', src: 'request', text: 'Consulting services agreement · negotiated terms' },
        { k: 'state', src: 'draft (A2)', text: 'draft v1' }
      ] },
      out: { by: 'a3', label: 'Produces', text: 'Action:      query_regulatory_db(topics = ["personal data", "invoicing"])\nObservation: 1. A personal data processing clause is missing.\n             2. The draft omits that each installment requires a CFDI.\nOutput:      draft v2 with the fourteenth and fifteenth clauses' },
      board: {
        draft: ['v2: adds the fourteenth and fifteenth clauses', 'A3 compliance_reviewer'],
        compliance_findings: ['1. Personal data processing clause\n2. CFDI for each installment', 'A3 compliance_reviewer']
      },
      tr: ['STEP 3 ·', 'Writes:      compliance_findings']
    },
    {
      lbl: 'STEP 4', title: 'A4 assesses risk and saves the document',
      text: 'A4 receives three keys: the request, draft v2 and the compliance findings.\n\nIf A4 received only draft v2, it would not know that the liability cap was negotiated and might recommend changing it.',
      flows: [
        { from: 'st', to: 'a4', k: 'ctx', label: 'request + draft v2 + findings' },
        { from: 'a4', to: 'st', k: 'res', label: 'risk_assessment', ph: 1 }
      ],
      active: ['a4'],
      ctx: { to: 'a4', parts: [
        { k: 'state', src: 'request', text: 'Liability cap equal to the contract amount (negotiated term)' },
        { k: 'state', src: 'draft (A3)', text: 'draft v2' },
        { k: 'state', src: 'compliance_findings (A3)', text: 'Personal data · CFDI per installment' }
      ] },
      out: { by: 'a4', label: 'Produces', text: 'Action:      query_liability_db(type = "consulting", amount = 480000)\nObservation: medium risk rating\n             The early termination clause does not define a penalty.\nOutput:      recommendation: add a penalty equal to one installment\nAction:      save_document("PSP-NL-07_Delta-Rios_v2.docx")' },
      board: { risk_assessment: ['Medium risk · recommendation: penalty equal to one installment', 'A4 risk_assessor'] },
      tr: ['STEP 4 ·', 'Writes:      risk_assessment']
    },
    {
      lbl: 'RESULT', title: 'Contract v2 goes to the responsible attorney',
      text: 'The chain ends. The decision on the risk recommendation is left to a person.',
      flows: [{ from: 'a4', to: 'out', k: 'res', label: 'contract v2' }],
      active: ['out'],
      out: { label: 'Result', text: 'Proposed contract v2 with two compliance findings addressed and one risk\nrecommendation pending a decision by the responsible attorney.' },
      tr: ['RESULT', 'recommendation pending a decision']
    }
  ]
};
