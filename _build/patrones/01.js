window.PATRON = {
  h: 440, minW: 980,
  boardTitle: 'Estado compartido',
  boardEmpty: 'Las claves del estado compartido se llenan conforme avanzan los agentes.',
  nodes: [
    { id: 'in', type: 'input', name: 'Solicitud', desc: 'Contrato de consultoría', x: 7, y: 28, w: 110, mono: false },
    { id: 'a1', type: 'agent', tag: 'Agente A1', name: 'selector_plantilla', desc: 'biblioteca_plantillas', x: 22, y: 28, w: 135 },
    { id: 'a2', type: 'agent', tag: 'Agente A2', name: 'personalizador_clausulas', desc: 'modelo ajustado', x: 38, y: 28, w: 140 },
    { id: 'gate', type: 'code', tag: 'Gate 1', name: 'verificación programática', desc: 'términos negociados', x: 53.5, y: 28, w: 125, mono: false },
    { id: 'a3', type: 'agent', tag: 'Agente A3', name: 'revisor_cumplimiento', desc: 'base_regulatoria', x: 69, y: 28, w: 135 },
    { id: 'a4', type: 'agent', tag: 'Agente A4', name: 'evaluador_riesgos', desc: 'base_responsabilidad, guardar_documento', x: 84.5, y: 28, w: 135 },
    { id: 'st', type: 'state', name: 'Estado compartido', desc: 'solicitud · plantilla · borrador · observaciones_cumplimiento · evaluacion_riesgo', x: 45, y: 78, w: 380, mono: false },
    { id: 'out', type: 'output', name: 'Contrato v2', desc: 'para el abogado responsable', x: 84.5, y: 78, w: 135, mono: false }
  ],
  edges: [['in', 'a1'], ['a1', 'a2'], ['a2', 'gate'], ['gate', 'a3'], ['a3', 'a4'],
          ['in', 'st'], ['a1', 'st'], ['a2', 'st'], ['gate', 'st'], ['a3', 'st'], ['a4', 'st'], ['a4', 'out']],
  steps: [
    {
      lbl: 'DISEÑO', title: 'El diseño fija el orden de los cuatro agentes',
      text: 'Cuatro agentes en un orden fijo, con una verificación programática (gate) entre el segundo y el tercero. Ningún agente decide quién sigue: el orden está escrito en el diseño.\n\nTodos leen y escriben en un <b>estado compartido</b> con cinco claves. Observa en cada paso qué claves recibe cada agente.',
      active: ['a1', 'a2', 'gate', 'a3', 'a4'],
      tr: ['PATRÓN', 'solicitud · plantilla · borrador']
    },
    {
      lbl: 'ENTRADA', title: 'La solicitud entra al estado compartido',
      text: 'La solicitud con los términos negociados queda guardada en la clave <code>solicitud</code>. Cualquier agente de la cadena puede leerla.',
      flows: [{ from: 'in', to: 'st', k: 'ctx', label: 'solicitud' }],
      board: { solicitud: ['Contrato de prestación de servicios de consultoría\nPartes: Consultora Delta (proveedor) e Industrias Ríos (cliente)\nJurisdicción: Monterrey, Nuevo León\nTérminos: $480,000 MXN más IVA · 3 exhibiciones ·\nlímite de responsabilidad igual al monto · vigencia de 6 meses', 'entrada'] },
      tr: ['ENTRADA', 'límite de responsabilidad igual al monto']
    },
    {
      lbl: 'PASO 1', title: 'A1 elige la plantilla',
      text: 'A1 recibe solo la solicitud, busca en la biblioteca y escribe la plantilla elegida en el estado.',
      flows: [
        { from: 'st', to: 'a1', k: 'ctx', label: 'solicitud' },
        { from: 'a1', to: 'st', k: 'res', label: 'plantilla', ph: 1 }
      ],
      active: ['a1'],
      ctx: { to: 'a1', parts: [{ k: 'state', src: 'solicitud', text: 'Contrato de servicios de consultoría · Nuevo León · términos negociados' }] },
      out: { by: 'a1', label: 'Produce', text: 'Acción:      buscar_plantilla(tipo = "servicios profesionales", jurisdicción = "Nuevo León")\nObservación: plantilla PSP-NL-07, versión 2026-03' },
      board: { plantilla: ['PSP-NL-07, versión 2026-03', 'A1 selector_plantilla'] },
      tr: ['PASO 1 ·', 'Escribe:     plantilla']
    },
    {
      lbl: 'PASO 2', title: 'A2 personaliza las cláusulas',
      text: 'A2 recibe la solicitud y la plantilla. Con los términos negociados redacta el borrador v1.',
      flows: [
        { from: 'st', to: 'a2', k: 'ctx', label: 'solicitud + plantilla' },
        { from: 'a2', to: 'st', k: 'res', label: 'borrador v1', ph: 1 }
      ],
      active: ['a2'],
      ctx: { to: 'a2', parts: [
        { k: 'state', src: 'solicitud', text: '$480,000 MXN más IVA · 3 exhibiciones · límite de responsabilidad igual al monto · vigencia de 6 meses' },
        { k: 'state', src: 'plantilla (A1)', text: 'PSP-NL-07, versión 2026-03' }
      ] },
      out: { by: 'a2', label: 'Produce', text: 'borrador v1\nCláusula tercera (pago): 3 exhibiciones de $160,000 MXN más IVA\nCláusula octava (responsabilidad): límite de $480,000 MXN\nCláusula décima (vigencia): 6 meses a partir de la firma' },
      board: { borrador: ['v1: cláusulas tercera (pago), octava (responsabilidad) y décima (vigencia)', 'A2 personalizador_clausulas'] },
      tr: ['PASO 2 ·', 'Escribe:     borrador']
    },
    {
      lbl: 'GATE 1', title: 'Una verificación programática revisa el borrador',
      text: 'El gate no es un agente: es código que compara cada término negociado contra el borrador. Si faltara uno, la cadena se detendría aquí en lugar de propagar un borrador incompleto.',
      flows: [{ from: 'st', to: 'gate', k: 'ctrl', label: 'solicitud + borrador v1' }],
      active: ['gate'],
      badges: { gate: ['continúa', 'ok'] },
      out: { by: 'gate', label: 'Resultado', text: 'Regla:     cada término negociado aparece en el borrador\nResultado: monto ✔ · exhibiciones ✔ · límite de responsabilidad ✔ · vigencia ✔\nDecisión:  continúa al paso 3' },
      tr: ['GATE 1', 'Decisión:    continúa al paso 3']
    },
    {
      lbl: 'PASO 3', title: 'A3 revisa el cumplimiento',
      text: 'A3 recibe la solicitud original además del borrador. Consulta la base regulatoria, encuentra dos omisiones y produce el borrador v2. Escribe en dos claves.',
      flows: [
        { from: 'st', to: 'a3', k: 'ctx', label: 'solicitud + borrador v1' },
        { from: 'a3', to: 'st', k: 'res', label: 'observaciones + borrador v2', ph: 1 }
      ],
      active: ['a3'],
      ctx: { to: 'a3', parts: [
        { k: 'state', src: 'solicitud', text: 'Contrato de servicios de consultoría · términos negociados' },
        { k: 'state', src: 'borrador (A2)', text: 'borrador v1' }
      ] },
      out: { by: 'a3', label: 'Produce', text: 'Acción:      consultar_base_regulatoria(materias = ["datos personales", "facturación"])\nObservación: 1. Falta una cláusula de tratamiento de datos personales.\n             2. El borrador omite que cada exhibición requiere CFDI.\nSalida:      borrador v2 con las cláusulas decimocuarta y decimoquinta' },
      board: {
        borrador: ['v2: agrega las cláusulas decimocuarta y decimoquinta', 'A3 revisor_cumplimiento'],
        observaciones_cumplimiento: ['1. Cláusula de tratamiento de datos personales\n2. CFDI por cada exhibición', 'A3 revisor_cumplimiento']
      },
      tr: ['PASO 3 ·', 'Escribe:     observaciones_cumplimiento']
    },
    {
      lbl: 'PASO 4', title: 'A4 evalúa riesgos y guarda el documento',
      text: 'A4 recibe tres claves: la solicitud, el borrador v2 y las observaciones de cumplimiento.\n\nSi A4 recibiera solo el borrador v2, desconocería que el límite de responsabilidad fue negociado y podría recomendar cambiarlo.',
      flows: [
        { from: 'st', to: 'a4', k: 'ctx', label: 'solicitud + borrador v2 + observaciones' },
        { from: 'a4', to: 'st', k: 'res', label: 'evaluacion_riesgo', ph: 1 }
      ],
      active: ['a4'],
      ctx: { to: 'a4', parts: [
        { k: 'state', src: 'solicitud', text: 'Límite de responsabilidad igual al monto (término negociado)' },
        { k: 'state', src: 'borrador (A3)', text: 'borrador v2' },
        { k: 'state', src: 'observaciones_cumplimiento (A3)', text: 'Datos personales · CFDI por exhibición' }
      ] },
      out: { by: 'a4', label: 'Produce', text: 'Acción:      consultar_base_responsabilidad(tipo = "consultoría", monto = 480000)\nObservación: calificación de riesgo media\n             La cláusula de terminación anticipada no define penalización.\nSalida:      recomendación: agregar una penalización equivalente a una exhibición\nAcción:      guardar_documento("PSP-NL-07_Delta-Rios_v2.docx")' },
      board: { evaluacion_riesgo: ['Riesgo medio · recomendación: penalización equivalente a una exhibición', 'A4 evaluador_riesgos'] },
      tr: ['PASO 4 ·', 'Escribe:     evaluacion_riesgo']
    },
    {
      lbl: 'RESULTADO', title: 'El contrato v2 pasa al abogado responsable',
      text: 'La cadena termina. La decisión sobre la recomendación de riesgo queda en manos de una persona.',
      flows: [{ from: 'a4', to: 'out', k: 'res', label: 'contrato v2' }],
      active: ['out'],
      out: { label: 'Resultado', text: 'Contrato propuesto v2 con dos observaciones de cumplimiento atendidas y una\nrecomendación de riesgo pendiente de decisión del abogado responsable.' },
      tr: ['RESULTADO', 'recomendación de riesgo pendiente']
    }
  ]
};
