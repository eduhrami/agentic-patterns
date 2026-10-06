# CLAUDE.md: Demos de agentes y orquestación

## Proyecto
Sitio estático de demos interactivos para enseñar, paso a paso, cómo funcionan los agentes LLM:
1. **Anatomía de un agente** (`anatomia_agentes.html`): qué responde el modelo, qué ejecuta el
   harness, cómo regresan las observaciones y cómo crece el prompt. Tres casos: agente de precios,
   Function Calling y ReAct.
2. **Patrones de orquestación multi-agente** (`patrones/`): 16 demos a nivel workflow que muestran
   qué contexto recibe cada agente, qué escribe en el estado compartido, quién decide el siguiente
   paso y dónde intervienen el código y las personas. Cada agente incluye un system prompt hipotético.

Material del curso de Prompt Engineering y Agentes (TEC de Monterrey / TLG y Curso UTEC).

- **Autor:** Eduardo H. Ramirez, PhD (eduardo.h.ramirez@tec.mx)
- **Publicado en:** https://eduhrami.github.io/demos-agentes/ (repo `eduhrami/demos-agentes`)

## Estructura

```
index.html                     Índice: tarjetas a los 3 casos de anatomía y a los 16 patrones (GENERADO)
anatomia_agentes.html          Demo de anatomía, escrito a mano (no lo genera el script)
patrones/NN_slug.html          16 páginas autocontenidas (GENERADAS, no editar a mano)
*.md                           Traces fuente: la única fuente de verdad del contenido
_build/
    construir.py               Genera patrones/*.html e index.html
    verificar.py               Pruebas con Playwright sobre las páginas generadas
    plantilla.html             Esqueleto HTML de cada patrón
    motor.css / motor.js       Motor común (diagrama, animación, paneles, popovers)
    patrones/NN.js             Diagrama y pasos de cada patrón (window.PATRON)
    prompts/NN.js              System prompts hipotéticos de cada agente (window.PROMPTS)
.nojekyll                      Necesario para que GitHub Pages sirva la carpeta _build/
```

## Fuentes de verdad
- `traces_patrones_orquestacion.md`: título, introducción, trace, "Lectura del trace" y referencias
  de cada patrón, más la tabla del índice y las convenciones de notación. `construir.py` los extrae
  directamente; **no copiar esos textos a los archivos `.js`**.
- `Agente de precios traces de ejemplo.md` y `Function Calling vs. ReAct traces de ejemplo.md`:
  fuente del demo de anatomía. Sus datos están transcritos dentro de `anatomia_agentes.html`;
  si cambian los .md, actualizar el HTML a mano.
- Basarse **exclusivamente** en los traces. No inventar datos, cifras ni pasos que no estén ahí.
  Donde el trace no especifica algo (por ejemplo, qué contexto exacto recibe un agente), elegir la
  opción más neutral y avisar a Eduardo.

## Flujo de trabajo

```
python3 _build/construir.py      # regenera patrones/*.html e index.html
python3 _build/verificar.py      # valida (requiere playwright + chromium)
```

Después de cualquier cambio en `_build/` o en `traces_patrones_orquestacion.md`: construir,
verificar y revisar visualmente al menos una página afectada (captura con Playwright en tema claro
y oscuro, y en 390 px de ancho).

Para agregar un patrón nuevo: agregar la sección `## N. Título` en el .md (con párrafo de
introducción, bloque ```text con el trace y **Lectura del trace**), su fila en la tabla de índice,
el slug en `SLUGS` de `construir.py`, y los archivos `_build/patrones/NN.js` y `_build/prompts/NN.js`.

## Formato de datos de un patrón (`_build/patrones/NN.js`)

```js
window.PATRON = {
  h: 440, minW: 900,                        // alto del diagrama y ancho mínimo (px)
  boardTitle: 'Estado compartido',          // pestaña del panel derecho
  boardEmpty: 'texto cuando está vacío',
  extra: 'HTML opcional añadido a la introducción',
  groups: [{ x, y, w, hh, label }],         // recuadros punteados (en %)
  nodes: [{ id, type, name, desc, tag, x, y, w, mono, hidden }],
  edges: [['a', 'b'], ...],                 // líneas grises fijas
  steps: [{
    lbl, title, text,                       // text admite HTML; párrafos separados por \n\n
    flows: [{ from, to, k, label, pk, ph }],
    active: ['id'],                         // nodos resaltados
    ctx: { to, title, parts: [{ k, src, text }], miss: ['lo que NO recibe'] },  // o arreglo
    out: { by, label, text },               // o arreglo
    board: { clave: ['valor', 'quién escribe'] | 'valor' | null },  // null borra la clave
    boardReset: true,
    badges: { id: ['texto', 'ok'|'bad'|'warn'|'info'|'off'] | null },  // 'off' atenúa el nodo
    badgesReset: true,
    show: ['id'],                           // revela nodos con hidden: true
    tr: ['marca inicial', 'marca final']    // subcadenas de líneas del trace a resaltar
  }]
};
```

- `type` de nodo: `input`, `agent`, `code`, `human`, `output`, `state`, `tool`.
- `k` de flujo: `ctx` (contexto), `res` (resultado), `handoff`, `human`, `ctrl` (control), `fb` (retroalimentación).
  `ph` es la fase de animación (0, 1, 2...): las de la misma fase salen en paralelo.
- `k` de parte de contexto: `input`, `instr`, `state`, `result`, `feedback`, `human`, `desc`, `hist`.
- `tr`: las marcas se buscan en orden a partir de la marca inicial del paso anterior. Si una marca no
  se encuentra, `verificar.py` lo reporta.
- Coordenadas `x`, `y` en porcentaje del escenario. Evitar que una línea de flujo atraviese otro nodo.

## Formato de system prompts (`_build/prompts/NN.js`)

```js
window.PROMPTS = {
  idDelNodo: {
    prompt: `Eres ...`,                     // instrucciones del agente
    tools: [{ sig: 'nombre(param: tipo)', desc: '...' }],
    salida: 'formato de salida esperado',   // opcional
    nota: 'HTML: conecta el prompt con lo que pasa en el trace'  // opcional, se muestra como "Observa:"
  }
};
```

- Solo los nodos `type: 'agent'` llevan prompt (los nodos de código, personas, entradas y salidas no).
  `verificar.py` exige un prompt por agente y ningún prompt sin nodo.
- Los prompts son **hipotéticos pero plausibles**: deben ser coherentes con el trace y no contradecirlo.
  Usar los nombres y parámetros de herramientas del trace; las herramientas hipotéticas adicionales
  (por ejemplo `transferir(...)`) se agregan solo donde el patrón las requiere.
- Si el trace muestra un error o una decisión implícita de un agente, el prompt no debe impedirlo;
  la `nota` explica qué falta en el prompt (ejemplo: el refinador del patrón 13).
- Las constantes de nivel superior de `patrones/NN.js` y `prompts/NN.js` comparten el ámbito global
  de la página: no repetir nombres entre ambos archivos del mismo patrón.
- Saltos de línea manuales a ~78 columnas; el motor los reacomoda (`reflow`) conservando viñetas
  y encabezados terminados en ":".

## Diseño y comportamiento
- Páginas autocontenidas: sin CDN ni dependencias externas; deben abrirse con doble clic (file://).
- Tema claro y oscuro con variables CSS en `:root`; botón de alternancia en cada página.
- Sin desborde horizontal en 390 px (el diagrama tiene su propio scroll horizontal).
- Controles: Anterior, Reproducir/Pausa, Siguiente, Reiniciar, Repetir animación, velocidad;
  teclado con flechas y espacio. Popover de system prompt: hover lo muestra, clic lo fija, Esc lo cierra.
- Barra de autor en la parte superior de todas las páginas: Eduardo H. Ramirez, PhD, con enlaces a
  LinkedIn (ehramirez), X (eduhrami) y GitHub (eduhrami). En los patrones viene de `plantilla.html`,
  en el índice de `construir.py` y en la anatomía está en el propio HTML.

## Reglas de escritura
- Español, segunda persona (tú) en las instrucciones al estudiante; términos técnicos en inglés.
- **Sin em-dashes ni en-dashes** (U+2014 y U+2013) en ningún archivo. Sustituir por `:`, `,`, `;` o paréntesis.
  El signo menos `−` de las cifras de los traces sí se conserva.
- Sin emojis.
- Lenguaje directo, sin frases de encuadre retóricas ("El giro conceptual...", "Lo que hay que
  subrayar..."). El encabezado o el bullet dicen el hecho directamente.
- Nombres de personas, empresas, folios y cifras son ficticios y vienen de los traces.

## Publicación
Este repositorio se publica con GitHub Pages desde `main`, en la raíz.

- **Como repo independiente** (`eduhrami/demos-agentes`): commit y push a `main`; Pages se
  actualiza en uno o dos minutos. Comprobar con `curl -I https://eduhrami.github.io/demos-agentes/`.
- **Si se edita desde el repo de cursos** (`tlg_cursos_genia_2026/demos_agentes/`): hacer commit
  ahí y publicar con
  `git subtree split --prefix demos_agentes -b demos-agentes-pages && git push https://github.com/eduhrami/demos-agentes.git demos-agentes-pages:main`.
  Elegir uno de los dos flujos para no divergir; si se edita en ambos, sincronizar antes de publicar.
- Commit, push y publicación solo cuando Eduardo lo pida. Los commits terminan con los trailers
  `Co-Authored-By` y `Claude-Session` que indique el entorno.
