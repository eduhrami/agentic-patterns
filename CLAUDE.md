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
- **Publicado en:** https://eduhrami.github.io/agentic-patterns/ (repo `eduhrami/agentic-patterns`)

## Estructura

El sitio es bilingüe: español en la raíz e inglés en `en/`. El motor es uno solo.

```
index.html                     Índice en español con selector de idioma (GENERADO)
anatomia_agentes.html          Demo de anatomía en español, escrito a mano
patrones/NN_slug.html          16 páginas en español (GENERADAS, no editar a mano)
*.md                           Traces fuente en español
en/
    index.html                 Índice en inglés con selector de idioma (GENERADO)
    agent_anatomy.html         Demo de anatomía en inglés, escrito a mano
    patterns/NN_slug.html      16 páginas en inglés (GENERADAS)
    *.md                       Traces fuente traducidos al inglés
_build/
    construir.py               Genera los patrones y los índices de ambos idiomas
    verificar.py               Pruebas con Playwright sobre las páginas de ambos idiomas
    plantilla.html             Esqueleto HTML de cada patrón, con marcadores {{t:clave}}
    motor.css / motor.js       Motor común (diagrama, animación, paneles, popovers)
    patrones/NN.js             Diagrama y pasos de cada patrón en español (window.PATRON)
    prompts/NN.js              System prompts en español (window.PROMPTS)
    en/patterns/NN.js          Diagrama y pasos en inglés
    en/prompts/NN.js           System prompts en inglés
    frameworks/NN.js           Opcional: comparación con frameworks (window.FRAMEWORKS), español
    en/frameworks/NN.js        Opcional: comparación con frameworks, inglés
.nojekyll                      Necesario para que GitHub Pages sirva la carpeta _build/
```

## Idiomas
- **Cada cambio de contenido se hace en ambos idiomas.** Si se edita un trace, un paso o un prompt en
  español, se aplica el mismo cambio en su equivalente en inglés (y viceversa). `verificar.py` detecta
  marcas de trace rotas y prompts faltantes en ambos idiomas, pero no detecta diferencias de contenido.
- **Textos de la interfaz:** viven en el diccionario `LANGS[lang]["ui"]` de `construir.py`. El motor
  (`motor.js`) los recibe como `window.UI` y la plantilla los usa como `{{t:clave}}`. No escribir
  textos visibles directamente en `motor.js` ni en `plantilla.html`.
- **Rutas y nombres de archivo:** `SLUGS[lang]` en `construir.py`. Cada página tiene un botón al
  mismo patrón en el otro idioma, calculado por el script.
- **Identificadores en inglés:** en la versión en inglés, los nombres de agentes, herramientas,
  parámetros y claves del estado también están traducidos (por ejemplo `selector_plantilla` →
  `template_selector`). Folios, nombres propios, cifras y monedas (MXN) se conservan.
- **Marcas `tr` en inglés:** se refieren a las líneas del trace en inglés
  (`en/orchestration_patterns_traces.md`), no a las del español.
- **Anatomía:** `anatomia_agentes.html` y `en/agent_anatomy.html` son dos archivos escritos a mano con
  el mismo motor y datos traducidos. Un cambio de motor o de diseño se aplica en ambos. El enlace de
  idioma conserva el caso abierto (`#precios` ↔ `#prices`, `#fc`, `#react`).
- **Inglés:** en las páginas en inglés, prosa directa en segunda persona (you); las mismas reglas de
  estilo (sin em-dashes, sin emojis, sin frases de encuadre).

## Fuentes de verdad
- `traces_patrones_orquestacion.md` (y su traducción `en/orchestration_patterns_traces.md`): título,
  introducción, trace, "Lectura del trace" / "Reading the trace" y referencias de cada patrón, más la
  tabla del índice y las convenciones de notación. `construir.py` los extrae directamente; **no copiar
  esos textos a los archivos `.js`**.
- `Agente de precios traces de ejemplo.md` y `Function Calling vs. ReAct traces de ejemplo.md`:
  fuente del demo de anatomía (sus traducciones están en `en/`). Sus datos están transcritos dentro
  de `anatomia_agentes.html` y `en/agent_anatomy.html`; si cambian los .md, actualizar ambos HTML a mano.
- Basarse **exclusivamente** en los traces. No inventar datos, cifras ni pasos que no estén ahí.
  Donde el trace no especifica algo (por ejemplo, qué contexto exacto recibe un agente), elegir la
  opción más neutral y avisar a Eduardo.

## Flujo de trabajo

```
python3 _build/construir.py      # regenera los patrones y los índices de ambos idiomas
python3 _build/verificar.py      # valida (requiere playwright + chromium)
```

Después de cualquier cambio en `_build/` o en `traces_patrones_orquestacion.md`: construir,
verificar y revisar visualmente al menos una página afectada (captura con Playwright en tema claro
y oscuro, y en 390 px de ancho).

Para agregar un patrón nuevo, en **ambos idiomas**: agregar la sección `## N. Título` en cada .md
(con párrafo de introducción, bloque ```text con el trace y **Lectura del trace** / **Reading the
trace**), su fila en la tabla de índice, el slug en `SLUGS["es"]` y `SLUGS["en"]` de `construir.py`, y
los archivos `_build/patrones/NN.js`, `_build/prompts/NN.js`, `_build/en/patterns/NN.js` y
`_build/en/prompts/NN.js`.

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

## Comparación con frameworks (`_build/frameworks/NN.js`, opcional)

Sección desplegable "Cómo lo implementan los frameworks", entre los paneles y la lectura del trace,
más un chip "en los frameworks" junto a las herramientas de orquestación en el popover del system
prompt (hover muestra una línea; clic abre la sección). Si un patrón no tiene archivo, no aparece nada.
Existe para los 16 patrones.

```js
window.FRAMEWORKS = {
  reviewed: 'fecha de revisión de las fuentes',
  demo: 'HTML: qué mecanismo usa el demo y por qué',
  cols: ['...', '...', '...', '...'],      // opcional: encabezados propios (por defecto: framework, cómo enruta, ¿regresa el control?, API)
  rows: [{ fw, how, back, api }],           // HTML; una fila por framework o variante; los campos siguen el orden de cols
  equiv: 'HTML: a qué patrón del demo equivale la variante distinta',  // opcional
  sources: ['HTML de cada referencia'],
  toolNotes: { idDelNodo: { nombre_herramienta: 'HTML de una línea' } }  // opcional
};
```

- El demo mantiene un mecanismo uniforme en todos los patrones; esta sección explica en qué se
  parece y en qué difiere de cada framework. No cambiar los prompts para imitar un framework.
- Cada fila debe estar respaldada por la documentación oficial citada en `sources`, con la fecha
  de revisión. Estas APIs cambian rápido: revisar las fuentes antes de editar.
- `toolNotes` se asocia por el nombre de la herramienta (el inicio de `sig` en el prompt).

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

- **Como repo independiente** (`eduhrami/agentic-patterns`): commit y push a `main`; Pages se
  actualiza en uno o dos minutos. Comprobar con `curl -I https://eduhrami.github.io/agentic-patterns/`.
- **Si se edita desde el repo de cursos** (`tlg_cursos_genia_2026/demos_agentes/`): hacer commit
  ahí y publicar con
  `git subtree split --prefix demos_agentes -b agentic-patterns-pages && git push https://github.com/eduhrami/agentic-patterns.git agentic-patterns-pages:main`.
  Elegir uno de los dos flujos para no divergir; si se edita en ambos, sincronizar antes de publicar.
- **URL anterior:** el repo se llamaba `demos-agentes`. El repo `eduhrami/demos-agentes` es ahora un
  stub de redirección (`index.html` y `404.html`) que envía cualquier ruta de
  `eduhrami.github.io/demos-agentes/` a la misma ruta en `agentic-patterns`. No publicar ahí.
- Commit, push y publicación solo cuando Eduardo lo pida. Los commits terminan con los trailers
  `Co-Authored-By` y `Claude-Session` que indique el entorno.
