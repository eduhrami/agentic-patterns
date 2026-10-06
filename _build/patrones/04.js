window.PATRON = {
  h: 400, minW: 940,
  boardTitle: 'Control de la conversación',
  boardEmpty: 'Aquí se registra quién tiene el control y qué contexto se transfiere.',
  nodes: [
    { id: 'user', type: 'input', tag: 'Usuario', name: 'Cliente C-7740', x: 8, y: 30, w: 120, mono: false },
    { id: 'tri', type: 'agent', name: 'triage', desc: 'atiende problemas comunes; transfiere el resto', x: 27, y: 30, w: 150 },
    { id: 'red', type: 'agent', name: 'tecnico_red', desc: 'diagnostica fallas de red y cobertura', x: 47, y: 30, w: 150 },
    { id: 'fin', type: 'agent', name: 'finanzas', desc: 'bonificaciones y ajustes; límite de $100 MXN por caso', x: 67, y: 30, w: 160 },
    { id: 'per', type: 'human', name: 'persona', desc: 'asesor humano de soporte', x: 88, y: 30, w: 140 },
    { id: 'lim', type: 'code', tag: 'Límite', name: '5 transferencias por conversación', x: 47, y: 82, w: 230, mono: false }
  ],
  edges: [['user', 'tri'], ['tri', 'red'], ['red', 'fin'], ['fin', 'per'], ['tri', 'lim'], ['red', 'lim'], ['fin', 'lim']],
  steps: [
    {
      lbl: 'DISEÑO', title: 'Un agente activo a la vez',
      text: 'Cada agente decide si resuelve o transfiere el <b>control completo</b> a otro (handoff). A diferencia del coordinador, el agente que transfiere ya no regresa.\n\nUn contador en código limita las transferencias para evitar ciclos infinitos.',
      active: ['lim'],
      board: { 'agente activo': 'ninguno', transferencias: '0 de 5' },
      tr: ['PATRÓN', 'LÍMITE']
    },
    {
      lbl: 'TRIAGE', title: 'Triage recibe el mensaje y decide transferir',
      text: 'El cliente ya reinició el equipo, así que el problema excede la guía básica de triage. Triage transfiere el control a <code>tecnico_red</code>.',
      flows: [
        { from: 'user', to: 'tri', k: 'ctx', label: 'mensaje' },
        { from: 'tri', to: 'red', k: 'handoff', label: 'trace completo', ph: 1 }
      ],
      active: ['tri'],
      badgesReset: true, badges: { tri: ['activo', 'info'] },
      ctx: { to: 'tri', parts: [{ k: 'input', src: 'cliente C-7740', text: '"Llevo tres días sin internet. Ya reinicié todo. Quiero que me descuenten estos días."' }] },
      out: { by: 'tri', label: 'Decisión', text: 'Pensamiento: el cliente ya reinició el equipo; el problema excede la guía básica.\nHANDOFF → tecnico_red' },
      board: { 'agente activo': ['triage', 'triage'], transferencias: ['1 de 5', 'contador'] },
      tr: ['MENSAJE DEL USUARIO', 'Contexto transferido: trace completo (mensaje']
    },
    {
      lbl: 'TÉCNICO RED', title: 'El técnico recibe todo el trace y diagnostica',
      text: 'El agente de red recibe el trace completo: el mensaje y los pasos de triage. Confirma el corte de fibra y la reparación. La bonificación no le corresponde, así que transfiere a finanzas con su diagnóstico.',
      flows: [{ from: 'red', to: 'fin', k: 'handoff', label: 'trace + diagnóstico' }],
      active: ['red'],
      badgesReset: true, badges: { red: ['activo', 'info'], tri: ['inactivo', 'off'] },
      ctx: { to: 'red', parts: [
        { k: 'input', src: 'mensaje', text: '"Llevo tres días sin internet. Ya reinicié todo. Quiero que me descuenten estos días."' },
        { k: 'hist', src: 'pasos de triage', text: 'El cliente ya reinició el equipo; el problema excede la guía básica.' }
      ] },
      out: { by: 'red', label: 'Trabajo y decisión', text: 'Acción:      consultar_estado_nodo(id_cliente = "C-7740")\nObservación: nodo MTY-NORTE-14 con corte de fibra desde el 2 oct; reparado el 5 oct a las 16:40\nAcción:      verificar_conexion(id_cliente = "C-7740")\nObservación: conexión restablecida a 300 Mbps\nPensamiento: la falla técnica está resuelta; la bonificación corresponde a finanzas.\nHANDOFF → finanzas' },
      board: { 'agente activo': ['tecnico_red', 'triage'], transferencias: ['2 de 5', 'contador'], 'diagnóstico': ['Corte de fibra en MTY-NORTE-14 del 2 al 5 oct · restablecido a 300 Mbps', 'tecnico_red'] },
      tr: ['AGENTE ACTIVO · tecnico_red', 'Contexto transferido: trace completo + diagnóstico']
    },
    {
      lbl: 'FINANZAS', title: 'Finanzas calcula la bonificación y choca con su límite',
      text: 'Finanzas recibe el trace completo y el diagnóstico. La bonificación calculada ($120) supera su límite de $100 por caso, así que transfiere a una persona.',
      flows: [{ from: 'fin', to: 'per', k: 'handoff', label: 'trace + bonificación' }],
      active: ['fin'],
      badgesReset: true, badges: { fin: ['activo', 'info'], tri: ['inactivo', 'off'], red: ['inactivo', 'off'] },
      ctx: { to: 'fin', parts: [
        { k: 'hist', src: 'trace completo', text: 'Mensaje del cliente · pasos de triage · pasos de tecnico_red' },
        { k: 'result', src: 'diagnóstico (tecnico_red)', text: 'Corte de fibra del 2 al 5 oct; servicio restablecido' }
      ] },
      out: { by: 'fin', label: 'Trabajo y decisión', text: 'Acción:      calcular_bonificacion(cuota_mensual = 1200, dias_sin_servicio = 3)\nObservación: bonificación de $120 MXN (1,200 / 30 × 3)\nPensamiento: $120 supera mi límite de $100 por caso.\nHANDOFF → persona' },
      board: { 'agente activo': ['finanzas', 'tecnico_red'], transferencias: ['3 de 5', 'contador'], 'bonificación': ['$120 MXN (1,200 / 30 × 3), arriba del límite de $100', 'finanzas'] },
      tr: ['AGENTE ACTIVO · finanzas', 'Contexto transferido: trace completo + bonificación']
    },
    {
      lbl: 'PERSONA', title: 'Una persona aprueba sin volver a preguntar',
      text: 'El asesor revisa el trace: corte confirmado, servicio restablecido, bonificación calculada. Como cada transferencia incluyó el trace completo, no necesita volver a preguntar al cliente cuántos días estuvo sin servicio.',
      flows: [{ from: 'per', to: 'user', k: 'res', label: 'respuesta' }],
      active: ['per'],
      badgesReset: true, badges: { per: ['activo', 'info'], tri: ['inactivo', 'off'], red: ['inactivo', 'off'], fin: ['inactivo', 'off'] },
      ctx: { to: 'per', title: 'Recibe persona (asesor Luis M.)', parts: [
        { k: 'hist', src: 'trace completo', text: 'Mensaje · pasos de triage · diagnóstico del nodo · cálculo de finanzas' },
        { k: 'result', src: 'finanzas', text: 'Bonificación calculada: $120 MXN' }
      ] },
      out: { by: 'per', label: 'Acción y respuesta', text: 'Acción:    aplicar_bonificacion(id_cliente = "C-7740", monto = 120)\nRespuesta: "Confirmamos un corte de fibra en tu zona del 2 al 5 de octubre.\n           El servicio ya está restablecido y aplicamos una bonificación de\n           $120 MXN en tu siguiente factura."' },
      board: { 'agente activo': ['persona (asesor Luis M.)', 'finanzas'] },
      tr: ['AGENTE ACTIVO · persona', '$120 MXN en tu siguiente factura']
    }
  ]
};
