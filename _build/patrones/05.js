window.PATRON = {
  h: 440, minW: 900,
  boardTitle: 'Estado compartido',
  boardEmpty: 'Cada revisor escribe en su propia clave.',
  nodes: [
    { id: 'pr', type: 'input', name: 'Pull request #418', desc: 'api/clientes.py (+64 −3) · db/consultas.py (+22 −0)', x: 9, y: 50, w: 150, mono: false },
    { id: 'seg', type: 'agent', name: 'auditor_seguridad', desc: '→ reporte_seguridad', x: 40, y: 15, w: 165 },
    { id: 'est', type: 'agent', name: 'revisor_estilo', desc: '→ reporte_estilo', x: 40, y: 50, w: 165 },
    { id: 'des', type: 'agent', name: 'analista_desempeno', desc: '→ reporte_desempeno', x: 40, y: 85, w: 165 },
    { id: 'sin', type: 'agent', tag: 'Gather', name: 'sintetizador', desc: 'combina los tres reportes', x: 70, y: 50, w: 150 },
    { id: 'out', type: 'output', name: 'Comentario en el PR', x: 91, y: 50, w: 120, mono: false }
  ],
  edges: [['pr', 'seg'], ['pr', 'est'], ['pr', 'des'], ['seg', 'sin'], ['est', 'sin'], ['des', 'sin'], ['sin', 'out']],
  steps: [
    {
      lbl: 'DISEÑO', title: 'Tres revisores definidos en el diseño',
      text: 'Tres agentes revisan el mismo pull request al mismo tiempo, cada uno desde un ángulo distinto. Cada uno escribe en una clave separada del estado, así que no se pisan entre sí.',
      active: ['seg', 'est', 'des'],
      tr: ['PATRÓN', 'analista_desempeno   → reporte_desempeno']
    },
    {
      lbl: 't = 0 s', title: 'Fan-out: los tres agentes reciben el mismo diff',
      text: 'Los tres inician en paralelo con la misma entrada. Lo que cambia entre ellos es su enfoque.',
      flows: [
        { from: 'pr', to: 'seg', k: 'ctx', label: 'diff' },
        { from: 'pr', to: 'est', k: 'ctx', label: 'diff' },
        { from: 'pr', to: 'des', k: 'ctx', label: 'diff' }
      ],
      active: ['pr'],
      badges: { seg: ['en curso', 'info'], est: ['en curso', 'info'], des: ['en curso', 'info'], sin: ['espera 0 de 3', 'off'] },
      ctx: { title: 'Reciben los tres revisores (misma entrada)', parts: [{ k: 'input', src: 'diff del PR #418', text: 'Pull request #418 "Agrega endpoint de búsqueda de clientes"\napi/clientes.py (+64 −3) · db/consultas.py (+22 −0)' }] },
      board: { tiempo: 't = 0 s' },
      tr: ['[t = 0 s]', '[t = 0 s]']
    },
    {
      lbl: 't = 9 s', title: 'Termina el revisor de estilo',
      text: 'El primero en terminar escribe su reporte en <code>reporte_estilo</code>. El sintetizador todavía espera a los otros dos.',
      flows: [{ from: 'est', to: 'sin', k: 'res', label: 'reporte_estilo' }],
      active: ['est'],
      badges: { est: ['listo', 'ok'], sin: ['espera 1 de 3', 'off'] },
      out: { by: 'est', label: 'Escribe reporte_estilo', text: '2 observaciones\n- api/clientes.py:41 · la variable `x` necesita un nombre descriptivo\n- db/consultas.py:12 · línea de 104 caracteres (límite: 100)' },
      board: { tiempo: 't = 9 s', reporte_estilo: ['2 observaciones (api/clientes.py:41, db/consultas.py:12)', 'revisor_estilo'] },
      tr: ['[t = 9 s]', 'línea de 104 caracteres']
    },
    {
      lbl: 't = 13 s', title: 'Termina el auditor de seguridad',
      text: 'Un hallazgo crítico en la línea 18 de <code>db/consultas.py</code>.',
      flows: [{ from: 'seg', to: 'sin', k: 'res', label: 'reporte_seguridad' }],
      active: ['seg'],
      badges: { seg: ['listo', 'ok'], sin: ['espera 2 de 3', 'off'] },
      out: { by: 'seg', label: 'Escribe reporte_seguridad', text: '1 hallazgo crítico\n- db/consultas.py:18 · el parámetro `nombre` se concatena en el SQL (riesgo de inyección)' },
      board: { tiempo: 't = 13 s', reporte_seguridad: ['1 hallazgo crítico (db/consultas.py:18, inyección de SQL)', 'auditor_seguridad'] },
      tr: ['[t = 13 s]', 'riesgo de inyección']
    },
    {
      lbl: 't = 16 s', title: 'Termina el analista de desempeño',
      text: 'Señala la misma línea 18, pero desde otro ángulo: una búsqueda sin índice sobre 1.2 millones de registros.',
      flows: [{ from: 'des', to: 'sin', k: 'res', label: 'reporte_desempeno' }],
      active: ['des'],
      badges: { des: ['listo', 'ok'], sin: ['3 de 3', 'ok'] },
      out: { by: 'des', label: 'Escribe reporte_desempeno', text: '1 observación\n- db/consultas.py:18 · búsqueda con LIKE \'%texto%\' sobre clientes (1.2 M registros) sin índice' },
      board: { tiempo: 't = 16 s', reporte_desempeno: ['1 observación (db/consultas.py:18, LIKE sin índice)', 'analista_desempeno'] },
      tr: ['[t = 16 s]', 'sin índice']
    },
    {
      lbl: 'GATHER', title: 'El sintetizador combina los tres reportes',
      text: 'El sintetizador recibe el diff y las tres claves. Ordena por severidad y une en un solo punto los dos reportes que señalaron la línea 18.',
      flows: [{ from: 'sin', to: 'out', k: 'res', label: 'comentario único' }],
      active: ['sin'],
      ctx: { to: 'sin', parts: [
        { k: 'input', src: 'diff', text: 'PR #418' },
        { k: 'state', src: 'reporte_seguridad', text: 'db/consultas.py:18 · inyección de SQL' },
        { k: 'state', src: 'reporte_estilo', text: 'api/clientes.py:41 · variable `x`\ndb/consultas.py:12 · línea de 104 caracteres' },
        { k: 'state', src: 'reporte_desempeno', text: 'db/consultas.py:18 · LIKE sin índice' }
      ] },
      out: { by: 'sin', label: 'Comentario único en el PR', text: '1. Bloqueante · db/consultas.py:18\n   Usar una consulta parametrizada. Al corregirla, conviene cambiar la búsqueda\n   a un índice de texto completo (señalado también por desempeño).\n2. Menor · db/consultas.py:12 · dividir la línea de 104 caracteres.\n3. Menor · api/clientes.py:41 · renombrar `x` como `filtro_busqueda`.\nEstado sugerido: cambios requeridos' },
      tr: ['GATHER', 'Estado sugerido: cambios requeridos']
    },
    {
      lbl: 'TIEMPO', title: 'El tiempo total es el del agente más lento',
      text: 'En paralelo, el patrón tarda 16 s. En secuencia habría tardado 38 s.',
      active: ['out'],
      board: { tiempo: ['16 s en paralelo (en secuencia: 9 + 13 + 16 = 38 s)', ''] },
      tr: ['TIEMPO TOTAL', 'TIEMPO TOTAL']
    }
  ]
};
