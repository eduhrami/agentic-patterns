#!/usr/bin/env python3
"""Construye los demos de patrones de orquestación y los índices, en español y en inglés.

Uso:  python3 _build/construir.py   (desde demos_agentes/ o desde cualquier ruta)

Para cada idioma de LANGS toma del .md de traces el título, la introducción, el
trace, la lectura y las referencias de cada patrón; de los archivos de datos
(_build/patrones o _build/en/patterns) el diagrama y los pasos, y de los de
prompts (_build/prompts o _build/en/prompts) los system prompts hipotéticos, y
de los opcionales de frameworks (_build/frameworks o _build/en/frameworks) la
comparación de cómo implementan el patrón los principales frameworks.
Genera las páginas autocontenidas de cada patrón y el índice de cada idioma:
  es: index.html y patrones/NN_slug.html
  en: en/index.html y en/patterns/NN_slug.html
"""
import html
import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
BUILD = BASE / "_build"

SLUGS = {
    "es": {
        1: "secuencial", 2: "routing", 3: "coordinator_dispatcher", 4: "handoff",
        5: "fan_out_gather", 6: "voting", 7: "seleccion_dinamica", 8: "orchestrator_workers",
        9: "hierarchical", 10: "magentic", 11: "evaluator_optimizer", 12: "generator_critic",
        13: "iterative_refinement", 14: "group_chat", 15: "human_in_the_loop", 16: "compuestos",
    },
    "en": {
        1: "sequential", 2: "routing", 3: "coordinator_dispatcher", 4: "handoff",
        5: "fan_out_gather", 6: "voting", 7: "dynamic_selection", 8: "orchestrator_workers",
        9: "hierarchical", 10: "magentic", 11: "evaluator_optimizer", 12: "generator_critic",
        13: "iterative_refinement", 14: "group_chat", 15: "human_in_the_loop", 16: "composite",
    },
}

# Configuración por idioma: rutas de entrada y salida, marcadores del .md y textos de la interfaz.
LANGS = {
    "es": {
        "md": BASE / "traces_patrones_orquestacion.md",
        "root": BASE,                      # carpeta del índice
        "pages": "patrones",               # subcarpeta de los patrones (relativa a root)
        "data": BUILD / "patrones", "prompts": BUILD / "prompts", "frameworks": BUILD / "frameworks",
        "anatomy": "anatomia_agentes.html", "anatomy_hash": ["precios", "fc", "react"],
        "reading_mark": "**Lectura del trace**", "refs_head": "## Referencias",
        "ui": {
            "social": "Redes sociales", "index": "Índice de demos", "prevPattern": "Patrón anterior",
            "nextPattern": "Patrón siguiente", "theme": "Tema claro / oscuro", "reset": "Reiniciar",
            "prev": "Anterior", "play": "Reproducir", "pause": "Pausa", "next": "Siguiente",
            "replay": "Repetir animación", "speed": "Velocidad", "slow": "Lento", "normal": "Normal",
            "fast": "Rápido", "keys": "Flechas para avanzar o retroceder, espacio para reproducir",
            "sharedState": "Estado compartido",
            "fullTrace": "Mostrar el trace completo (las líneas futuras aparecen tenues)",
            "types": {"input": "Entrada", "agent": "Agente", "code": "Código", "human": "Persona",
                      "output": "Salida", "state": "Estado", "tool": "Herramienta"},
            "flows": {"ctx": "Contexto", "res": "Resultado", "handoff": "Handoff", "human": "Persona",
                      "ctrl": "Control", "fb": "Retroalimentación"},
            "parts": {"input": "Entrada original", "instr": "Instrucción", "state": "Del estado compartido",
                      "result": "Resultado de otro agente", "feedback": "Retroalimentación",
                      "human": "De una persona", "desc": "Descripciones de agentes", "hist": "Historial"},
            "scenario": "Escenario", "source": "Fuente del ejemplo", "patternOf": "Patrón {n} de {t}",
            "reading": "Lectura del trace", "refs": "Referencias", "flow": "Flujo",
            "spLegend": "pasa el cursor o haz clic para ver las instrucciones de cada agente",
            "spAria": "Ver el system prompt de", "flowsInStep": "Flujos de información en este paso",
            "ctxHead": "Contexto que recibe", "receives": "Recibe", "notReceive": "No recibe",
            "produces": "Produce", "updated": "ACTUALIZADO", "isNew": "NUEVO", "writes": "escribe",
            "empty": "Todavía vacío.", "stepOf": "Paso {n} de {t}", "close": "Cerrar",
            "spTools": "Herramientas que puede invocar", "spOut": "Formato de salida esperado",
            "spNote": "Observa:",
            "spFoot": "Instrucciones hipotéticas, redactadas para ilustrar el rol del agente. No forman parte del trace original.",
            "fwTitle": "Cómo lo implementan los frameworks", "fwDemo": "En este demo:",
            "fwCols": ["Framework", "Cómo enruta", "¿Regresa el control?", "API"],
            "fwEquiv": "Equivale en el demo a:", "fwSources": "Fuentes", "fwReviewed": "Revisado el",
            "fwChip": "en los frameworks", "fwSee": "Ver la comparación completa",
            # Índice
            "langLabel": "Idioma",
            "title": "Demos de agentes y orquestación",
            "lede": "En los siguientes demos podrás analizar a través de ejemplos y animaciones paso a paso los componentes de un agente (prompts, harness, modelo, etc.) así como las principales estrategias de orquestación y uso de funciones.",
            "s1": "1. Anatomía de un agente",
            "s1lead": "Un solo agente por dentro: qué responde el modelo, qué ejecuta el harness, cómo regresan las observaciones y cómo crece el prompt en cada iteración.",
            "case": "Anatomía · caso",
            "cases": [["Agente de precios", "Ciclo básico de acción y observación con un motor de búsqueda y una calculadora."],
                      ["Function Calling", "Estado de un pedido: el modelo devuelve una llamada en JSON y el programa la ejecuta."],
                      ["ReAct", "Queja por cobro duplicado: pensamiento, acción y observación en cinco iteraciones."]],
            "s2": "2. Patrones de orquestación multi-agente",
            "s2lead": "Cada demo muestra el flujo a nivel workflow: qué agente recibe qué contexto, qué escribe en el estado compartido, quién decide el siguiente paso y dónde intervienen el código y las personas. Cada agente tiene un chip <b>system prompt</b>: al pasar el cursor o hacer clic se muestran sus instrucciones y herramientas hipotéticas. Los nombres de personas, empresas, folios y cifras son ficticios.",
            "pattern": "Patrón", "sourceShort": "Fuente",
            "convHead": "Convenciones de notación de los traces", "convCols": ["Etiqueta", "Significado"],
        },
    },
    "en": {
        "md": BASE / "en" / "orchestration_patterns_traces.md",
        "root": BASE / "en",
        "pages": "patterns",
        "data": BUILD / "en" / "patterns", "prompts": BUILD / "en" / "prompts", "frameworks": BUILD / "en" / "frameworks",
        "anatomy": "agent_anatomy.html", "anatomy_hash": ["prices", "fc", "react"],
        "reading_mark": "**Reading the trace**", "refs_head": "## References",
        "ui": {
            "social": "Social media", "index": "Demo index", "prevPattern": "Previous pattern",
            "nextPattern": "Next pattern", "theme": "Light / dark theme", "reset": "Restart",
            "prev": "Previous", "play": "Play", "pause": "Pause", "next": "Next",
            "replay": "Replay animation", "speed": "Speed", "slow": "Slow", "normal": "Normal",
            "fast": "Fast", "keys": "Arrow keys to move forward or back, space to play",
            "sharedState": "Shared state",
            "fullTrace": "Show the full trace (upcoming lines appear faded)",
            "types": {"input": "Input", "agent": "Agent", "code": "Code", "human": "Person",
                      "output": "Output", "state": "State", "tool": "Tool"},
            "flows": {"ctx": "Context", "res": "Result", "handoff": "Handoff", "human": "Person",
                      "ctrl": "Control", "fb": "Feedback"},
            "parts": {"input": "Original input", "instr": "Instruction", "state": "From shared state",
                      "result": "Result from another agent", "feedback": "Feedback",
                      "human": "From a person", "desc": "Agent descriptions", "hist": "History"},
            "scenario": "Scenario", "source": "Example source", "patternOf": "Pattern {n} of {t}",
            "reading": "Reading the trace", "refs": "References", "flow": "Flow",
            "spLegend": "hover or click to see each agent's instructions",
            "spAria": "See the system prompt of", "flowsInStep": "Information flows in this step",
            "ctxHead": "Context received", "receives": "Receives", "notReceive": "Does not receive",
            "produces": "Produces", "updated": "UPDATED", "isNew": "NEW", "writes": "written by",
            "empty": "Still empty.", "stepOf": "Step {n} of {t}", "close": "Close",
            "spTools": "Tools it can call", "spOut": "Expected output format",
            "spNote": "Notice:",
            "spFoot": "Hypothetical instructions, written to illustrate the agent's role. They are not part of the original trace.",
            "fwTitle": "How frameworks implement it", "fwDemo": "In this demo:",
            "fwCols": ["Framework", "How it routes", "Does control return?", "API"],
            "fwEquiv": "Equivalent in the demo:", "fwSources": "Sources", "fwReviewed": "Reviewed on",
            "fwChip": "in frameworks", "fwSee": "See the full comparison",
            "langLabel": "Language",
            "title": "Agent and orchestration demos",
            "lede": "In the following demos you can explore, through examples and step-by-step animations, the components of an agent (prompts, harness, model, etc.) as well as the main strategies for orchestration and tool use.",
            "s1": "1. Anatomy of an agent",
            "s1lead": "A single agent from the inside: what the model answers, what the harness executes, how observations come back and how the prompt grows in each iteration.",
            "case": "Anatomy · case",
            "cases": [["Price agent", "Basic action and observation loop with a search engine and a calculator."],
                      ["Function Calling", "Order status: the model returns a JSON call and the program executes it."],
                      ["ReAct", "Duplicate charge complaint: thought, action and observation over five iterations."]],
            "s2": "2. Multi-agent orchestration patterns",
            "s2lead": "Each demo shows the flow at the workflow level: which agent receives which context, what it writes to the shared state, who decides the next step and where code and people step in. Each agent has a <b>system prompt</b> chip: hover or click to see its hypothetical instructions and tools. The names of people, companies, reference numbers and figures are fictitious.",
            "pattern": "Pattern", "sourceShort": "Source",
            "convHead": "Trace notation conventions", "convCols": ["Label", "Meaning"],
        },
    },
}


def md_inline(text):
    t = html.escape(text, quote=False)
    t = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" target="_blank" rel="noopener">\1</a>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?!\w)", r"<i>\1</i>", t)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    return t


def parse_md(cfg):
    lines = cfg["md"].read_text(encoding="utf-8").splitlines()
    index = {}
    for ln in lines:
        m = re.match(r"^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$", ln)
        if m:
            index[int(m.group(1))] = {"patron": m.group(2), "escenario": m.group(3), "fuente": m.group(4)}

    sections, refs = {}, []
    heads = [(i, re.match(r"^## (\d+)\. (.+)$", ln)) for i, ln in enumerate(lines)]
    heads = [(i, m) for i, m in heads if m]
    ref_start = next(i for i, ln in enumerate(lines) if ln.strip() == cfg["refs_head"])
    for k, (i, m) in enumerate(heads):
        end = heads[k + 1][0] if k + 1 < len(heads) else ref_start
        body = lines[i + 1:end]
        num = int(m.group(1))
        # Introducción: primer párrafo
        intro, j = [], 0
        while j < len(body) and not body[j].strip():
            j += 1
        while j < len(body) and body[j].strip():
            intro.append(body[j].strip())
            j += 1
        # Trace: primer bloque de código
        start = next(x for x, ln in enumerate(body) if re.match(r"^`{3,}text", ln))
        fence = re.match(r"^(`{3,})", body[start]).group(1)
        stop = next(x for x in range(start + 1, len(body)) if body[x].strip() == fence)
        trace = "\n".join(body[start + 1:stop])
        # Lectura
        lect_i = next(x for x, ln in enumerate(body) if ln.strip() == cfg["reading_mark"])
        lectura = [md_inline(ln[2:].strip()) for ln in body[lect_i + 1:] if ln.startswith("- ")]
        sections[num] = {"title": m.group(2), "intro": md_inline(" ".join(intro)), "trace": trace, "lectura": lectura}
    for ln in lines[ref_start + 1:]:
        if ln.strip():
            refs.append(ln.strip())
    return index, sections, refs


def pick_refs(refs, fuente, sec):
    text = " ".join(sec["lectura"]) + " " + sec["intro"]
    keys = []
    for name in ("Anthropic", "Microsoft", "Google"):
        if name in fuente:
            keys.append(name)
    keys.append("Cognition")
    if "Yan" in text:
        keys.append("Yan")
    if "ReAct" in sec["intro"]:
        keys.append("Ramirez")
    return [md_inline(r) for r in refs if any(r.startswith(k) for k in keys)]


def fname(lang, num):
    return f"{num:02d}_{SLUGS[lang][num]}.html"


def other(lang):
    return "en" if lang == "es" else "es"


def page_url(lang, num, from_lang):
    """Ruta relativa a la página del patrón num en `lang`, vista desde un patrón en `from_lang`."""
    cfg = LANGS[lang]
    up = "../" * (len(LANGS[from_lang]["root"].relative_to(BASE).parts) + 1)
    return up + "/".join([*cfg["root"].relative_to(BASE).parts, cfg["pages"], fname(lang, num)])


LANG_LABEL = {"es": "Español", "en": "English"}


def fill_ui(text, ui):
    return re.sub(r"\{\{t:(\w+)\}\}", lambda m: ui[m.group(1)], text)


def build_lang(lang):
    cfg = LANGS[lang]
    ui = cfg["ui"]
    index, sections, refs = parse_md(cfg)
    css = (BUILD / "motor.css").read_text(encoding="utf-8")
    js = (BUILD / "motor.js").read_text(encoding="utf-8")
    tpl = fill_ui((BUILD / "plantilla.html").read_text(encoding="utf-8"), ui)
    out = cfg["root"] / cfg["pages"]
    out.mkdir(parents=True, exist_ok=True)
    nums = sorted(sections)
    built = []
    for num in nums:
        data_file = cfg["data"] / f"{num:02d}.js"
        if not data_file.exists():
            print(f"  [{lang}] sin datos: {data_file.name}")
            continue
        prompts_file = cfg["prompts"] / f"{num:02d}.js"
        fw_file = cfg["frameworks"] / f"{num:02d}.js"
        sec, idx = sections[num], index[num]
        meta = {
            "num": num, "total": len(nums), "title": sec["title"], "short": idx["patron"],
            "escenario": idx["escenario"], "fuente": idx["fuente"], "intro": sec["intro"],
            "lectura": sec["lectura"], "refs": pick_refs(refs, idx["fuente"], sec), "trace": sec["trace"],
            "prev": fname(lang, num - 1) if num - 1 in sections else None,
            "next": fname(lang, num + 1) if num + 1 in sections else None,
        }
        meta_js = json.dumps(meta, ensure_ascii=False, indent=1).replace("</", "<\\/")
        ui_js = json.dumps(ui, ensure_ascii=False).replace("</", "<\\/")
        page = (tpl.replace("{{LANG}}", lang)
                   .replace("{{OTHER_URL}}", page_url(other(lang), num, lang))
                   .replace("{{OTHER_LANG}}", other(lang))
                   .replace("{{OTHER_LABEL}}", LANG_LABEL[other(lang)])
                   .replace("{{TITLE}}", html.escape(idx["patron"]))
                   .replace("{{CSS}}", css)
                   .replace("{{UI}}", ui_js)
                   .replace("{{META}}", meta_js)
                   .replace("{{DATA}}", data_file.read_text(encoding="utf-8"))
                   .replace("{{PROMPTS}}", prompts_file.read_text(encoding="utf-8") if prompts_file.exists() else "window.PROMPTS = {};")
                   .replace("{{FRAMEWORKS}}", fw_file.read_text(encoding="utf-8") if fw_file.exists() else "window.FRAMEWORKS = null;")
                   .replace("{{JS}}", js))
        (out / fname(lang, num)).write_text(page, encoding="utf-8")
        built.append(num)
    print(f"  [{lang}] {len(built)} patrones en {out.relative_to(BASE)}/")
    write_index(lang, index, refs, built)


def build():
    for lang in LANGS:
        build_lang(lang)


INDEX_TPL = """<!DOCTYPE html>
<html lang="{{LANG}}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{t:title}}</title>
<style>
:root { --bg:#f6f7f9; --panel:#fff; --panel2:#f1f3f6; --border:#d9dee5; --text:#1c2430; --muted:#5f6b7a;
  --a:#6d3fd1; --b:#c2700a; --c:#138a5e; --shadow:0 2px 10px rgba(20,30,50,.08); }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#11151c; --panel:#1a2029; --panel2:#212834;
  --border:#313a48; --text:#e6eaf0; --muted:#9aa5b4; --a:#a88bf5; --b:#f0a541; --c:#4cc995; --shadow:0 2px 12px rgba(0,0,0,.4); } }
:root[data-theme="dark"] { --bg:#11151c; --panel:#1a2029; --panel2:#212834; --border:#313a48; --text:#e6eaf0; --muted:#9aa5b4;
  --a:#a88bf5; --b:#f0a541; --c:#4cc995; --shadow:0 2px 12px rgba(0,0,0,.4); }
* { box-sizing:border-box; } html, body { margin:0; }
body { background:var(--bg); color:var(--text); line-height:1.5; font-size:15px;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
.wrap { max-width:1180px; margin:0 auto; padding:24px 16px 56px; }
header { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap; }
h1 { font-size:1.6rem; margin:0; letter-spacing:-.01em; }
header p { margin:4px 0 0; color:var(--muted); max-width:760px; }
.tbtn { background:var(--panel); border:1px solid var(--border); color:var(--text); border-radius:8px; padding:6px 10px; cursor:pointer; font-size:.85rem; }
h2 { font-size:1.15rem; margin:30px 0 4px; }
.lead { color:var(--muted); margin:0 0 12px; font-size:.92rem; max-width:860px; }
.grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:12px; }
.card { display:block; background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:12px 14px;
  text-decoration:none; color:var(--text); box-shadow:var(--shadow); border-top:4px solid var(--k); transition:transform .15s, border-color .15s; }
.card:hover { transform:translateY(-2px); border-color:var(--k); }
.card .n { font-size:.72rem; font-weight:800; color:var(--k); letter-spacing:.05em; text-transform:uppercase; }
.card .t { font-weight:700; font-size:1rem; margin:2px 0; }
.card .d { color:var(--muted); font-size:.84rem; }
.card .f { display:inline-block; margin-top:6px; font-size:.72rem; background:var(--panel2); border-radius:5px; padding:1px 7px; color:var(--muted); }
.card.off { opacity:.45; pointer-events:none; }
table { border-collapse:collapse; font-size:.84rem; margin-top:8px; background:var(--panel); }
th, td { border:1px solid var(--border); padding:6px 9px; text-align:left; vertical-align:top; }
th { background:var(--panel2); }
td code { font-size:.8rem; }
.refs { font-size:.84rem; color:var(--muted); }
.refs p { margin:0 0 6px; padding-left:22px; text-indent:-22px; }
a { color:var(--a); }
.hctl { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.lang { display:inline-flex; align-items:center; gap:6px; font-size:.85rem; color:var(--muted); }
.lang a { text-decoration:none; color:var(--text); border:1px solid var(--border); background:var(--panel); padding:5px 12px; border-radius:8px; font-weight:600; }
.lang a[aria-current="page"] { background:var(--text); color:var(--bg); border-color:var(--text); }

.autor { margin: 0 0 14px; padding: 0 0 10px; border-bottom: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 8px 18px; align-items: center; justify-content: space-between; font-size: .88rem; color: var(--muted); }
.autor b { color: var(--text); }
.autor nav { display: flex; gap: 14px; flex-wrap: wrap; }
.autor a { color: var(--muted); text-decoration: none; border-bottom: 1px solid var(--border); }
.autor a:hover { color: var(--text); border-bottom-color: var(--text); }
</style>
</head>
<body>
<div class="wrap">
<div class="autor">
  <span><b>Eduardo H. Ramirez, PhD</b></span>
  <nav aria-label="{{t:social}}">
    <a href="https://www.linkedin.com/in/ehramirez" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://x.com/eduhrami" target="_blank" rel="noopener">X</a>
    <a href="https://github.com/eduhrami" target="_blank" rel="noopener">GitHub</a>
  </nav>
</div>
<header>
  <div>
    <h1>{{t:title}}</h1>
    <p>{{t:lede}}</p>
  </div>
  <div class="hctl">
    <div class="lang" role="group" aria-label="{{t:langLabel}}">
      <span>{{t:langLabel}}</span>
      {{LANG_SWITCH}}
    </div>
    <button class="tbtn" id="themeBtn" type="button">{{t:theme}}</button>
  </div>
</header>

<h2>{{t:s1}}</h2>
<p class="lead">{{t:s1lead}}</p>
<div class="grid">
{{ANATOMY_CARDS}}
</div>

<h2>{{t:s2}}</h2>
<p class="lead">{{t:s2lead}}</p>
<div class="grid">
{{CARDS}}
</div>

<h2>{{t:convHead}}</h2>
{{CONV}}

<h2>{{t:refs}}</h2>
<div class="refs">
{{REFS}}
</div>
</div>
<script>
document.getElementById('themeBtn').onclick = function () {
  var root = document.documentElement;
  var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
};
</script>
</body>
</html>
"""


def write_index(lang, index, refs, built):
    cfg = LANGS[lang]
    ui = cfg["ui"]
    to_root = "../" * len(cfg["root"].relative_to(BASE).parts)
    switch = []
    for code, c in LANGS.items():
        href = to_root + "/".join([*c["root"].relative_to(BASE).parts, "index.html"])
        cur = ' aria-current="page"' if code == lang else ""
        switch.append(f'<a href="{href}" hreflang="{code}" lang="{code}"{cur}>{LANG_LABEL[code]}</a>')
    anatomy = []
    for k, ((title, desc), h) in enumerate(zip(ui["cases"], cfg["anatomy_hash"]), 1):
        anatomy.append(
            f'  <a class="card" style="--k:var(--b)" href="{cfg["anatomy"]}#{h}"><div class="n">{ui["case"]} {k}</div>'
            f'<div class="t">{html.escape(title)}</div><div class="d">{html.escape(desc)}</div></a>')
    cards = []
    for num in sorted(index):
        i = index[num]
        off = "" if num in built else " off"
        cards.append(
            f'  <a class="card{off}" style="--k:var(--a)" href="{cfg["pages"]}/{fname(lang, num)}">'
            f'<div class="n">{ui["pattern"]} {num}</div><div class="t">{html.escape(i["patron"])}</div>'
            f'<div class="d">{html.escape(i["escenario"])}</div><span class="f">{ui["sourceShort"]}: {html.escape(i["fuente"])}</span></a>')
    md = cfg["md"].read_text(encoding="utf-8").splitlines()
    conv_rows = [ln for ln in md if re.match(r"^\| `", ln)]
    conv = f"<table><thead><tr><th>{ui['convCols'][0]}</th><th>{ui['convCols'][1]}</th></tr></thead><tbody>" + "".join(
        "<tr>" + "".join(f"<td>{md_inline(c.strip())}</td>" for c in r.strip("|").split("|")) + "</tr>" for r in conv_rows
    ) + "</tbody></table>"
    page = (fill_ui(INDEX_TPL, ui)
            .replace("{{LANG}}", lang)
            .replace("{{LANG_SWITCH}}", "\n      ".join(switch))
            .replace("{{ANATOMY_CARDS}}", "\n".join(anatomy))
            .replace("{{CARDS}}", "\n".join(cards))
            .replace("{{CONV}}", conv)
            .replace("{{REFS}}", "\n".join(f"<p>{md_inline(r)}</p>" for r in refs)))
    (cfg["root"] / "index.html").write_text(page, encoding="utf-8")
    print(f"  [{lang}] {(cfg['root'] / 'index.html').relative_to(BASE)}")


if __name__ == "__main__":
    build()
