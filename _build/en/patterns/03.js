window.PATRON = {
  h: 440, minW: 860,
  boardTitle: 'Shared conversation',
  boardEmpty: 'The conversation appears here as it progresses.',
  nodes: [
    { id: 'user', type: 'input', tag: 'User', name: 'Customer C-5072', x: 9, y: 50, w: 130, mono: false },
    { id: 'coord', type: 'agent', tag: 'Coordinator', name: 'coordinator_agent', desc: 'reads the specialist descriptions and decides who to transfer to', x: 40, y: 50, w: 190 },
    { id: 'fac', type: 'agent', tag: 'Specialist', name: 'billing', desc: 'Clarifies charges, invoices and payments. Can adjust charges.', x: 78, y: 20, w: 210 },
    { id: 'sop', type: 'agent', tag: 'Specialist', name: 'tech_support', desc: 'Diagnoses equipment and connection failures. Can update the modem and schedule technician visits.', x: 78, y: 80, w: 210 }
  ],
  edges: [['user', 'coord'], ['coord', 'fac'], ['coord', 'sop']],
  steps: [
    {
      lbl: 'DESIGN', title: 'The coordinator knows the specialists by their description',
      text: 'The coordinator is an LLM. To decide who to transfer to, it reads each specialist\'s description; those descriptions are part of its context.',
      active: ['coord'],
      ctx: { to: 'coord', parts: [
        { k: 'desc', src: 'billing', text: '"Clarifies charges, invoices and payments. Can adjust charges."' },
        { k: 'desc', src: 'tech_support', text: '"Diagnoses equipment and connection failures. Can update\nthe modem and schedule technician visits."' }
      ] },
      tr: ['PATTERN', 'the modem and schedule technician visits']
    },
    {
      lbl: 'MESSAGE', title: 'The customer raises two problems in one message',
      text: 'A single message contains an unrecognized charge and a modem failure.',
      flows: [{ from: 'user', to: 'coord', k: 'ctx', label: 'message' }],
      active: ['user'],
      board: { message: ['"My September bill has a $350 charge for a \'technician visit\' I never\nrequested, and on top of that the modem restarts by itself several times a day."', 'customer'] },
      tr: ['USER MESSAGE', 'the modem restarts by itself']
    },
    {
      lbl: 'TURN 1', title: 'The coordinator splits the requests and decides the order',
      text: 'The coordinator identifies two requests and decides to handle the charge first, because it may depend on the visit history. It transfers to billing with the full conversation.',
      flows: [{ from: 'coord', to: 'fac', k: 'ctx', label: 'full conversation' }],
      active: ['coord'],
      badgesReset: true, badges: { fac: ['1st', 'info'], sop: ['2nd', 'off'] },
      ctx: { to: 'fac', parts: [{ k: 'hist', src: 'full conversation', text: 'Message from customer C-5072 ($350 charge and modem restarts)' }] },
      out: { by: 'coord', label: 'Decision', text: 'Analysis: the message has two requests: an unrecognized charge and an equipment failure.\nDecision: handle the charge first, because it may depend on the visit history.' },
      board: { 'coordinator decision': ['1. billing (charge)  2. tech_support (modem)', 'coordinator'] },
      tr: ['TURN 1', 'Context:     full conversation']
    },
    {
      lbl: 'TURN 2', title: 'Billing resolves the charge and returns control',
      text: 'The specialist looks up and adjusts the charge. When done, it returns control to the coordinator along with its result.',
      flows: [{ from: 'fac', to: 'coord', k: 'res', label: 'result + control' }],
      active: ['fac'],
      badges: { fac: ['resolved', 'ok'] },
      out: { by: 'fac', label: 'Specialist work', text: 'Action:      get_charges(customer_id = "C-5072", month = "September 2026")\nObservation: charge VT-8812 · $350 · visit on Sep 12 · status: canceled by the customer\nAction:      adjust_charge(charge_id = "VT-8812", reason = "canceled visit")\nObservation: credit note NC-3390 for $350 applied to the October bill' },
      board: { 'billing result': ['Charge VT-8812 for a canceled visit · credit note NC-3390 for $350 on the October bill', 'billing'] },
      tr: ['TURN 2', 'Returns control to the coordinator']
    },
    {
      lbl: 'TURN 3', title: 'The coordinator transfers the second request',
      text: 'Tech support receives the full conversation <b>and the billing result</b>. If both had been handled in parallel, tech support could have scheduled a paid visit while billing was canceling the charge for another visit.',
      flows: [{ from: 'coord', to: 'sop', k: 'ctx', label: 'conversation + billing result' }],
      active: ['coord'],
      badges: { sop: ['2nd', 'info'] },
      ctx: { to: 'sop', parts: [
        { k: 'hist', src: 'full conversation', text: 'Message from customer C-5072' },
        { k: 'result', src: 'billing', text: 'Charge VT-8812 for a canceled visit; credit note NC-3390 applied' }
      ] },
      tr: ['TURN 3', 'Context:     full conversation + billing result']
    },
    {
      lbl: 'TURN 4', title: 'Tech support diagnoses the modem',
      text: 'The specialist finds outdated firmware, schedules the update and returns control.',
      flows: [{ from: 'sop', to: 'coord', k: 'res', label: 'result + control' }],
      active: ['sop'],
      badges: { sop: ['resolved', 'ok'] },
      out: { by: 'sop', label: 'Specialist work', text: 'Action:      get_device(customer_id = "C-5072")\nObservation: 14 restarts in 72 hours · firmware 3.1.2 · current version 3.4.0\nAction:      update_firmware(device_id = "MDM-55102", version = "3.4.0")\nObservation: update scheduled for 02:00' },
      board: { 'tech_support result': ['Outdated firmware 3.1.2 · update to 3.4.0 scheduled for 02:00', 'tech_support'] },
      tr: ['TURN 4', 'Returns control to the coordinator']
    },
    {
      lbl: 'RESPONSE', title: 'The coordinator writes the final response',
      text: 'The coordinator stayed in the conversation after each transfer. With both results it writes a single response.',
      flows: [{ from: 'coord', to: 'user', k: 'res', label: 'final response' }],
      active: ['coord'],
      ctx: { to: 'coord', parts: [
        { k: 'hist', src: 'full conversation', text: 'Message from customer C-5072' },
        { k: 'result', src: 'billing', text: 'Credit note NC-3390 for $350' },
        { k: 'result', src: 'tech_support', text: 'Firmware update at 02:00' }
      ] },
      out: { by: 'coord', label: 'Final response', text: 'We reviewed both issues. The $350 charge was for a visit you\ncanceled; we already applied a credit note for that amount to your October\nbill (reference NC-3390). The restarts are caused by outdated firmware;\nyour modem will be updated tonight at 2:00. If the restarts continue,\nwe can schedule a visit at no cost.' },
      tr: ['FINAL RESPONSE', 'we can schedule a visit at no cost']
    }
  ]
};
