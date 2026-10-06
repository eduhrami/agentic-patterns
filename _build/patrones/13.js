const OBJ = 'Función que devuelve los 10 clientes con más pedidos, como [[id_cliente, conteo], ...]';
const V1 = 'def top_clientes(pedidos):\n    conteo = []\n    for p in pedidos:\n        encontrado = False\n        for c in conteo:\n            if c[0] == p["id_cliente"]:\n                c[1] += 1\n                encontrado = True\n        if not encontrado:\n            conteo.append([p["id_cliente"], 1])\n    conteo.sort(key=lambda c: c[1], reverse=True)\n    return conteo[:10]';
const V2 = 'from collections import Counter\ndef top_clientes(pedidos):\n    return Counter(p["id_cliente"] for p in pedidos).most_common(10)';
const V3 = 'from collections import Counter\ndef top_clientes(pedidos):\n    conteo = Counter(p["id_cliente"] for p in pedidos)\n    return [[cliente, n] for cliente, n in conteo.most_common(10)]';
window.PATRON = {
  h: 460, minW: 880,
  boardTitle: 'Versiones y notas',
  boardEmpty: 'Todavía no hay código.',
  nodes: [
    { id: 'obj', type: 'input', name: 'Objetivo', desc: 'top 10 clientes como [[id_cliente, conteo], ...]', x: 10, y: 62, w: 150, mono: false },
    { id: 'gen', type: 'agent', name: 'generador', desc: 'borrador v1', x: 36, y: 22, w: 140 },
    { id: 'cri', type: 'agent', name: 'crítico', desc: 'notas de mejora con severidad', x: 62, y: 22, w: 150, mono: false },
    { id: 'ref', type: 'agent', name: 'refinador', desc: 'reescribe el código', x: 62, y: 72, w: 150 },
    { id: 'umb', type: 'code', tag: 'Condición de salida', name: 'sin notas medias o altas', desc: 'límite: 3 iteraciones', x: 88, y: 22, w: 150, mono: false },
    { id: 'out', type: 'output', name: 'Versión aceptada', x: 88, y: 72, w: 120, mono: false }
  ],
  edges: [['obj', 'gen'], ['gen', 'cri'], ['cri', 'ref'], ['obj', 'cri'], ['cri', 'umb'], ['umb', 'out']],
  steps: [
    {
      lbl: 'DISEÑO', title: 'Generar, criticar, refinar',
      text: 'A diferencia de generator-critic, el crítico no aprueba ni rechaza: escribe notas de mejora con severidad. El ciclo termina cuando ya no hay notas de severidad media o alta, o al llegar al límite.',
      active: ['gen', 'cri', 'ref', 'umb'],
      tr: ['PATRÓN', 'LÍMITE']
    },
    {
      lbl: 'BORRADOR v1', title: 'El generador escribe el primer borrador',
      text: 'El borrador cumple el formato pedido (lista de listas), pero es ineficiente.',
      flows: [{ from: 'obj', to: 'gen', k: 'ctx', label: 'objetivo' }],
      active: ['gen'],
      ctx: { to: 'gen', parts: [{ k: 'input', src: 'objetivo', text: OBJ }] },
      out: { by: 'gen', label: 'Borrador v1', text: V1 },
      board: { 'código actual': ['v1 (lista de listas, búsqueda lineal)', 'generador'] },
      tr: ['GENERADOR · borrador v1', 'return conteo[:10]']
    },
    {
      lbl: 'ITER 1 · CRÍTICO', title: 'El crítico señala dos problemas de eficiencia',
      text: 'El crítico recibe el objetivo original además del código. Eso le permitirá detectar más adelante un cambio que nadie pidió.',
      flows: [
        { from: 'gen', to: 'cri', k: 'ctx', label: 'v1' },
        { from: 'obj', to: 'cri', k: 'ctx', label: 'objetivo' }
      ],
      active: ['cri'],
      badges: { umb: ['alta + media', 'bad'] },
      ctx: { to: 'cri', parts: [{ k: 'input', src: 'objetivo original', text: OBJ }, { k: 'result', src: 'generador', text: 'borrador v1' }] },
      out: { by: 'cri', label: 'Notas', text: 'Alta:  la búsqueda lineal dentro del ciclo cuesta O(n × k) para n pedidos y k clientes.\nMedia: se ordena la lista completa para obtener solo 10 elementos.' },
      board: { 'notas iteración 1': ['Alta: búsqueda lineal O(n × k)\nMedia: ordena la lista completa', 'crítico'] },
      tr: ['ITERACIÓN 1', 'Media: se ordena la lista completa']
    },
    {
      lbl: 'ITER 1 · REFINADOR', title: 'El refinador mejora el código y cambia algo que nadie pidió',
      text: 'La versión 2 resuelve ambas notas, pero <code>most_common</code> devuelve tuplas, no listas. El refinador tomó una decisión implícita: cambió el tipo de retorno.',
      flows: [{ from: 'cri', to: 'ref', k: 'fb', label: 'notas' }],
      active: ['ref'],
      ctx: { to: 'ref', parts: [
        { k: 'result', src: 'código actual', text: 'borrador v1' },
        { k: 'feedback', src: 'crítico', text: 'Alta: búsqueda lineal O(n × k)\nMedia: se ordena la lista completa para obtener solo 10 elementos' }
      ] },
      out: { by: 'ref', label: 'Versión 2', text: V2 },
      board: { 'código actual': ['v2 (Counter.most_common: lista de tuplas)', 'refinador'] },
      tr: ['Refinador → v2', 'most_common(10)']
    },
    {
      lbl: 'ITER 2 · CRÍTICO', title: 'El crítico detecta el cambio de tipo',
      text: 'El crítico lo detecta porque recibe el objetivo original, que especifica el formato de salida. Sin el objetivo, v2 parecería una mejora sin defectos.',
      flows: [
        { from: 'ref', to: 'cri', k: 'ctx', label: 'v2' },
        { from: 'obj', to: 'cri', k: 'ctx', label: 'objetivo' }
      ],
      active: ['cri'],
      badges: { umb: ['media', 'bad'] },
      ctx: { to: 'cri', parts: [{ k: 'input', src: 'objetivo original', text: OBJ }, { k: 'result', src: 'refinador', text: 'versión 2' }] },
      out: { by: 'cri', label: 'Notas', text: 'Media: el tipo de retorno cambió de lista de listas a lista de tuplas;\n       el código que modifica c[1] en el resultado fallaría.' },
      board: { 'notas iteración 2': ['Media: el tipo de retorno cambió a lista de tuplas', 'crítico'] },
      tr: ['ITERACIÓN 2', 'el código que modifica c[1]']
    },
    {
      lbl: 'ITER 2 · REFINADOR', title: 'El refinador restaura el formato',
      text: 'La versión 3 conserva la eficiencia de <code>Counter</code> y devuelve otra vez una lista de listas.',
      flows: [{ from: 'cri', to: 'ref', k: 'fb', label: 'notas' }],
      active: ['ref'],
      ctx: { to: 'ref', parts: [
        { k: 'result', src: 'código actual', text: 'versión 2' },
        { k: 'feedback', src: 'crítico', text: 'Media: el tipo de retorno cambió de lista de listas a lista de tuplas' }
      ] },
      out: { by: 'ref', label: 'Versión 3', text: V3 },
      board: { 'código actual': ['v3 (Counter + lista de listas)', 'refinador'] },
      tr: ['Refinador → v3', 'return [[cliente, n]']
    },
    {
      lbl: 'ITER 3', title: 'Solo queda una nota baja: se alcanza el umbral',
      text: 'La única nota es de severidad baja. La condición de salida se cumple justo en el límite de iteraciones.',
      flows: [
        { from: 'ref', to: 'cri', k: 'ctx', label: 'v3' },
        { from: 'cri', to: 'umb', k: 'ctrl', label: 'solo nota baja', ph: 1 },
        { from: 'umb', to: 'out', k: 'res', label: 'v3', ph: 2 }
      ],
      active: ['cri', 'umb'],
      badges: { umb: ['umbral alcanzado', 'ok'] },
      out: { by: 'cri', label: 'Notas', text: 'Baja: agregar anotaciones de tipo.\nSeñal de salida: umbral alcanzado (sin observaciones medias o altas)' },
      board: { 'notas iteración 3': ['Baja: agregar anotaciones de tipo', 'crítico'], resultado: 'v3, aceptada en la iteración 3 de 3' },
      tr: ['ITERACIÓN 3', 'RESULTADO']
    }
  ]
};
