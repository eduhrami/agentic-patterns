const MSG16 = '"Desde que actualicé la app ya no se sincronizan mis pedidos. Es la tercera vez que pasa."';
const DOC16 = 'artículo KB-77: la versión 5.2.0 pierde la sesión de sincronización al actualizar en\nAndroid 14; solución: cerrar sesión e iniciar de nuevo; corrección incluida en la 5.2.1';
const HIS16 = 'Android 14 · app 5.2.0 · tickets previos T-201 (julio) y T-344 (agosto) por\nsincronización, ambos cerrados con "reinstalar"';
const CRIT16 = 'reconoce la recurrencia · evita términos técnicos · da un solo paso de solución claro';
window.PATRON = {
  h: 470, minW: 960,
  boardTitle: 'Puntos de transferencia de contexto',
  boardEmpty: 'Todavía no hay transferencias.',
  groups: [
    { x: 1.5, y: 30, w: 30, hh: 40, label: 'Etapa 1 · coordinator/dispatcher' },
    { x: 34, y: 6, w: 22, hh: 88, label: 'Etapa 2 · parallel fan-out' },
    { x: 58.5, y: 30, w: 40, hh: 40, label: 'Etapa 3 · generator-critic' }
  ],
  nodes: [
    { id: 'msg', type: 'input', tag: 'Usuario', name: 'Cliente C-6195', x: 8, y: 50, w: 110, mono: false },
    { id: 'coord', type: 'agent', name: 'coordinador', desc: 'enruta por intención', x: 23, y: 50, w: 120 },
    { id: 'doc', type: 'agent', name: 'busqueda_documentacion', desc: 'rama soporte_app · solo lectura', x: 45, y: 25, w: 160 },
    { id: 'his', type: 'agent', name: 'busqueda_historial', desc: 'rama soporte_app · solo lectura', x: 45, y: 75, w: 160 },
    { id: 'gen', type: 'agent', name: 'generador', desc: 'redacta la respuesta', x: 68, y: 50, w: 120 },
    { id: 'cri', type: 'agent', tag: 'Crítico', name: 'crítico de tono', x: 89, y: 50, w: 140, mono: false }
  ],
  edges: [['msg', 'coord'], ['coord', 'doc'], ['coord', 'his'], ['doc', 'gen'], ['his', 'gen'], ['gen', 'cri']],
  steps: [
    {
      lbl: 'DISEÑO', title: 'Tres patrones encadenados',
      text: 'Cada etapa usa el patrón que conviene a su tarea: un coordinador enruta, dos búsquedas corren en paralelo y un ciclo generator-critic revisa el tono. Entre etapas hay tres puntos de transferencia de contexto.',
      active: ['coord', 'doc', 'his', 'gen', 'cri'],
      tr: ['PATRÓN', 'PATRÓN']
    },
    {
      lbl: 'ETAPA 1', title: 'El coordinador enruta a la rama soporte_app',
      text: 'El coordinador identifica un problema técnico de la app. Transfiere el mensaje completo y el id del cliente a la rama <code>soporte_app</code>, que lanza dos búsquedas.',
      flows: [
        { from: 'msg', to: 'coord', k: 'ctx', label: 'mensaje' },
        { from: 'coord', to: 'doc', k: 'ctx', label: 'mensaje + id', ph: 1 },
        { from: 'coord', to: 'his', k: 'ctx', label: 'mensaje + id', ph: 1 }
      ],
      active: ['coord'],
      ctx: { title: 'Recibe la rama soporte_app', parts: [{ k: 'input', src: 'mensaje completo', text: MSG16 }, { k: 'input', src: 'id del cliente', text: 'C-6195' }] },
      out: { by: 'coord', label: 'Decisión', text: 'intención = problema técnico de la app → rama soporte_app' },
      board: { '1. coordinador → rama soporte_app': ['mensaje completo + id del cliente', 'coordinador'] },
      tr: ['MENSAJE (cliente C-6195)', 'Contexto transferido: mensaje completo']
    },
    {
      lbl: 'ETAPA 2', title: 'Dos búsquedas en paralelo y un gather',
      text: 'La documentación explica el defecto; el historial aporta un dato que cambiará el tono: es la tercera vez que le pasa a este cliente.',
      flows: [
        { from: 'doc', to: 'gen', k: 'res', label: 'KB-77' },
        { from: 'his', to: 'gen', k: 'res', label: 'tickets T-201, T-344' }
      ],
      active: ['doc', 'his'],
      out: [
        { by: 'doc', label: 'Resultado', text: DOC16 },
        { by: 'his', label: 'Resultado', text: HIS16 },
        { label: 'Gather', text: 'diagnóstico = defecto KB-77; recurrencia confirmada (tercer caso)' }
      ],
      board: { '2. búsquedas paralelas → generador': ['diagnóstico KB-77 + recurrencia (tercer caso)', 'gather'] },
      tr: ['ETAPA 2', 'GATHER']
    },
    {
      lbl: 'ETAPA 3 · v1', title: 'El generador escribe una primera versión',
      text: 'La versión 1 es técnicamente correcta, pero usa jerga y no reconoce la recurrencia.',
      active: ['gen'],
      ctx: { to: 'gen', parts: [
        { k: 'input', src: 'mensaje original', text: MSG16 },
        { k: 'result', src: 'busqueda_documentacion', text: 'KB-77: defecto de la 5.2.0; cerrar sesión; corrección en la 5.2.1' },
        { k: 'result', src: 'busqueda_historial', text: 'tickets previos T-201 y T-344 (tercer caso)' }
      ] },
      out: { by: 'gen', label: 'Generador v1', text: '"Su incidencia corresponde al defecto KB-77 de la versión 5.2.0, que invalida\nel token de sincronización tras la actualización."' },
      tr: ['ETAPA 3', 'el token de sincronización']
    },
    {
      lbl: 'ETAPA 3 · FAIL', title: 'El crítico rechaza el tono',
      text: 'El crítico evalúa contra tres criterios de tono.',
      flows: [
        { from: 'gen', to: 'cri', k: 'ctx', label: 'v1' },
        { from: 'cri', to: 'gen', k: 'fb', label: 'FAIL', ph: 1 }
      ],
      active: ['cri'],
      badges: { cri: ['FAIL', 'bad'] },
      ctx: { to: 'cri', parts: [{ k: 'instr', src: 'criterios del crítico', text: CRIT16 }, { k: 'result', src: 'generador', text: 'versión 1' }] },
      out: { by: 'cri', label: 'Crítico → FAIL', text: 'usa "incidencia" y "token" · no reconoce que es la tercera vez · no da un paso claro' },
      board: { '3. generador ↔ crítico': ['v1 → FAIL (jerga, sin recurrencia, sin paso claro)', 'crítico'] },
      tr: ['Crítico → FAIL', 'no da un paso claro']
    },
    {
      lbl: 'ETAPA 3 · PASS', title: 'La versión 2 menciona que es la tercera vez',
      text: 'El generador puede reconocer la recurrencia porque recibió el resultado del historial. En cada punto de transferencia, el receptor tuvo lo que necesitaba.',
      flows: [
        { from: 'gen', to: 'cri', k: 'ctx', label: 'v2' },
        { from: 'cri', to: 'msg', k: 'res', label: 'respuesta final v2', ph: 1 }
      ],
      active: ['gen', 'cri'],
      badges: { cri: ['PASS', 'ok'] },
      out: { by: 'gen', label: 'Generador v2 (respuesta final)', text: '"Lamentamos que esto te pase por tercera vez. Identificamos la causa: un error de\nla versión 5.2.0. Para resolverlo, cierra sesión en la app y vuelve a entrar.\nLa versión 5.2.1, ya disponible, corrige el error de forma definitiva."' },
      board: { '3. generador ↔ crítico': ['v1 → FAIL · v2 → PASS', 'crítico'] },
      tr: ['Generador v2', '3. generador ↔ crítico']
    }
  ]
};
