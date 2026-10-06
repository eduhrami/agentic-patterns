window.PATRON = {
  h: 440, minW: 860,
  boardTitle: 'Conversación compartida',
  boardEmpty: 'La conversación aparece aquí conforme avanza.',
  nodes: [
    { id: 'user', type: 'input', tag: 'Usuario', name: 'Cliente C-5072', x: 9, y: 50, w: 130, mono: false },
    { id: 'coord', type: 'agent', tag: 'Coordinador', name: 'agente_coordinador', desc: 'lee las descripciones de los especialistas y decide a quién transferir', x: 40, y: 50, w: 190 },
    { id: 'fac', type: 'agent', tag: 'Especialista', name: 'facturacion', desc: 'Aclara cargos, facturas y pagos. Puede ajustar cargos.', x: 78, y: 20, w: 210 },
    { id: 'sop', type: 'agent', tag: 'Especialista', name: 'soporte_tecnico', desc: 'Diagnostica fallas de equipo y conexión. Puede actualizar el módem y programar visitas técnicas.', x: 78, y: 80, w: 210 }
  ],
  edges: [['user', 'coord'], ['coord', 'fac'], ['coord', 'sop']],
  steps: [
    {
      lbl: 'DISEÑO', title: 'El coordinador conoce a los especialistas por su descripción',
      text: 'El coordinador es un LLM. Para decidir a quién transferir, lee la descripción de cada especialista; esas descripciones son parte de su contexto.',
      active: ['coord'],
      ctx: { to: 'coord', parts: [
        { k: 'desc', src: 'facturacion', text: '"Aclara cargos, facturas y pagos. Puede ajustar cargos."' },
        { k: 'desc', src: 'soporte_tecnico', text: '"Diagnostica fallas de equipo y conexión. Puede actualizar\nel módem y programar visitas técnicas."' }
      ] },
      tr: ['PATRÓN', 'el módem y programar visitas técnicas']
    },
    {
      lbl: 'MENSAJE', title: 'El cliente plantea dos problemas en un mensaje',
      text: 'Un mismo mensaje trae un cargo no reconocido y una falla del módem.',
      flows: [{ from: 'user', to: 'coord', k: 'ctx', label: 'mensaje' }],
      active: ['user'],
      board: { mensaje: ['"Mi factura de septiembre trae un cargo de $350 por \'visita técnica\' que nunca\npedí, y además el módem se reinicia solo varias veces al día."', 'cliente'] },
      tr: ['MENSAJE DEL USUARIO', 'el módem se reinicia solo']
    },
    {
      lbl: 'TURNO 1', title: 'El coordinador separa las solicitudes y decide el orden',
      text: 'El coordinador identifica dos solicitudes y decide atender primero el cargo, porque puede depender del historial de visitas. Transfiere a facturación con la conversación completa.',
      flows: [{ from: 'coord', to: 'fac', k: 'ctx', label: 'conversación completa' }],
      active: ['coord'],
      badgesReset: true, badges: { fac: ['1.º', 'info'], sop: ['2.º', 'off'] },
      ctx: { to: 'fac', parts: [{ k: 'hist', src: 'conversación completa', text: 'Mensaje del cliente C-5072 (cargo de $350 y reinicios del módem)' }] },
      out: { by: 'coord', label: 'Decisión', text: 'Análisis: el mensaje tiene dos solicitudes: un cargo no reconocido y una falla de equipo.\nDecisión: atender primero el cargo, porque puede depender del historial de visitas.' },
      board: { 'decisión del coordinador': ['1. facturacion (cargo)  2. soporte_tecnico (módem)', 'coordinador'] },
      tr: ['TURNO 1', 'Contexto:    conversación completa']
    },
    {
      lbl: 'TURNO 2', title: 'Facturación resuelve el cargo y devuelve el control',
      text: 'El especialista consulta y ajusta el cargo. Al terminar, devuelve el control al coordinador junto con su resultado.',
      flows: [{ from: 'fac', to: 'coord', k: 'res', label: 'resultado + control' }],
      active: ['fac'],
      badges: { fac: ['resuelto', 'ok'] },
      out: { by: 'fac', label: 'Trabajo del especialista', text: 'Acción:      consultar_cargos(id_cliente = "C-5072", mes = "septiembre 2026")\nObservación: cargo VT-8812 · $350 · visita del 12 sep · estado: cancelada por el cliente\nAcción:      ajustar_cargo(id_cargo = "VT-8812", motivo = "visita cancelada")\nObservación: nota de crédito NC-3390 por $350 aplicada a la factura de octubre' },
      board: { 'resultado de facturacion': ['Cargo VT-8812 de una visita cancelada · nota de crédito NC-3390 por $350 en la factura de octubre', 'facturacion'] },
      tr: ['TURNO 2', 'Devuelve el control al coordinador']
    },
    {
      lbl: 'TURNO 3', title: 'El coordinador transfiere la segunda solicitud',
      text: 'Soporte técnico recibe la conversación completa <b>y el resultado de facturación</b>. Si ambos se hubieran atendido en paralelo, soporte podría haber programado una visita con costo mientras facturación cancelaba el cargo de otra visita.',
      flows: [{ from: 'coord', to: 'sop', k: 'ctx', label: 'conversación + resultado de facturación' }],
      active: ['coord'],
      badges: { sop: ['2.º', 'info'] },
      ctx: { to: 'sop', parts: [
        { k: 'hist', src: 'conversación completa', text: 'Mensaje del cliente C-5072' },
        { k: 'result', src: 'facturacion', text: 'Cargo VT-8812 de una visita cancelada; nota de crédito NC-3390 aplicada' }
      ] },
      tr: ['TURNO 3', 'Contexto:    conversación completa + resultado de facturacion']
    },
    {
      lbl: 'TURNO 4', title: 'Soporte técnico diagnostica el módem',
      text: 'El especialista encuentra un firmware desactualizado, programa la actualización y devuelve el control.',
      flows: [{ from: 'sop', to: 'coord', k: 'res', label: 'resultado + control' }],
      active: ['sop'],
      badges: { sop: ['resuelto', 'ok'] },
      out: { by: 'sop', label: 'Trabajo del especialista', text: 'Acción:      consultar_dispositivo(id_cliente = "C-5072")\nObservación: 14 reinicios en 72 horas · firmware 3.1.2 · versión vigente 3.4.0\nAcción:      actualizar_firmware(id_dispositivo = "MDM-55102", version = "3.4.0")\nObservación: actualización programada para las 02:00 h' },
      board: { 'resultado de soporte_tecnico': ['Firmware 3.1.2 desactualizado · actualización a 3.4.0 programada a las 02:00 h', 'soporte_tecnico'] },
      tr: ['TURNO 4', 'Devuelve el control al coordinador']
    },
    {
      lbl: 'RESPUESTA', title: 'El coordinador redacta la respuesta final',
      text: 'El coordinador siguió en la conversación después de cada transferencia. Con los dos resultados redacta una sola respuesta.',
      flows: [{ from: 'coord', to: 'user', k: 'res', label: 'respuesta final' }],
      active: ['coord'],
      ctx: { to: 'coord', parts: [
        { k: 'hist', src: 'conversación completa', text: 'Mensaje del cliente C-5072' },
        { k: 'result', src: 'facturacion', text: 'Nota de crédito NC-3390 por $350' },
        { k: 'result', src: 'soporte_tecnico', text: 'Actualización de firmware a las 02:00 h' }
      ] },
      out: { by: 'coord', label: 'Respuesta final', text: 'Revisamos los dos temas. El cargo de $350 correspondía a una visita que\ncancelaste; ya aplicamos una nota de crédito por ese monto en tu factura de\noctubre (folio NC-3390). Los reinicios se deben a un firmware desactualizado;\ntu módem se actualizará esta noche a las 2:00 h. Si los reinicios continúan,\npodemos programar una visita sin costo.' },
      tr: ['RESPUESTA FINAL', 'podemos programar una visita sin costo']
    }
  ]
};
