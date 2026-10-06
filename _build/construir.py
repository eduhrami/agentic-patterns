#!/usr/bin/env python3
"""Construye los demos de patrones de orquestación y la página de índice.

Uso:  python3 _build/construir.py   (desde demos_agentes/ o desde cualquier ruta)

Toma de traces_patrones_orquestacion.md el título, la introducción, el trace,
la lectura y las referencias de cada patrón; toma de _build/patrones/NN.js el
diagrama y los pasos, y de _build/prompts/NN.js los system prompts
hipotéticos de cada agente. Genera patrones/NN_slug.html (autocontenidos) e index.html.
"""
import html
import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
BUILD = BASE / "_build"
MD = BASE / "traces_patrones_orquestacion.md"
OUT = BASE / "patrones"

SLUGS = {
    1: "secuencial", 2: "routing", 3: "coordinator_dispatcher", 4: "handoff",
    5: "fan_out_gather", 6: "voting", 7: "seleccion_dinamica", 8: "orchestrator_workers",
    9: "hierarchical", 10: "magentic", 11: "evaluator_optimizer", 12: "generator_critic",
    13: "iterative_refinement", 14: "group_chat", 15: "human_in_the_loop", 16: "compuestos",
}


def md_inline(text):
    t = html.escape(text, quote=False)
    t = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" target="_blank" rel="noopener">\1</a>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?!\w)", r"<i>\1</i>", t)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    return t


def parse_md():
    lines = MD.read_text(encoding="utf-8").splitlines()
    index = {}
    for ln in lines:
        m = re.match(r"^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$", ln)
        if m:
            index[int(m.group(1))] = {"patron": m.group(2), "escenario": m.group(3), "fuente": m.group(4)}

    sections, refs = {}, []
    heads = [(i, re.match(r"^## (\d+)\. (.+)$", ln)) for i, ln in enumerate(lines)]
    heads = [(i, m) for i, m in heads if m]
    ref_start = next(i for i, ln in enumerate(lines) if ln.strip() == "## Referencias")
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
        lect_i = next(x for x, ln in enumerate(body) if ln.strip() == "**Lectura del trace**")
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


def fname(num):
    return f"{num:02d}_{SLUGS[num]}.html"


def build():
    index, sections, refs = parse_md()
    css = (BUILD / "motor.css").read_text(encoding="utf-8")
    js = (BUILD / "motor.js").read_text(encoding="utf-8")
    tpl = (BUILD / "plantilla.html").read_text(encoding="utf-8")
    OUT.mkdir(exist_ok=True)
    nums = sorted(sections)
    built = []
    for num in nums:
        data_file = BUILD / "patrones" / f"{num:02d}.js"
        if not data_file.exists():
            print(f"  sin datos: {data_file.name}")
            continue
        prompts_file = BUILD / "prompts" / f"{num:02d}.js"
        sec, idx = sections[num], index[num]
        meta = {
            "num": num, "total": len(nums), "title": sec["title"], "short": idx["patron"],
            "escenario": idx["escenario"], "fuente": idx["fuente"], "intro": sec["intro"],
            "lectura": sec["lectura"], "refs": pick_refs(refs, idx["fuente"], sec), "trace": sec["trace"],
            "prev": fname(num - 1) if num - 1 in sections else None,
            "next": fname(num + 1) if num + 1 in sections else None,
        }
        meta_js = json.dumps(meta, ensure_ascii=False, indent=1).replace("</", "<\\/")
        page = (tpl.replace("{{TITLE}}", html.escape(idx["patron"]))
                   .replace("{{CSS}}", css)
                   .replace("{{META}}", meta_js)
                   .replace("{{DATA}}", data_file.read_text(encoding="utf-8"))
                   .replace("{{PROMPTS}}", prompts_file.read_text(encoding="utf-8") if prompts_file.exists() else "window.PROMPTS = {};")
                   .replace("{{JS}}", js))
        (OUT / fname(num)).write_text(page, encoding="utf-8")
        built.append(num)
        print(f"  {fname(num)}")
    write_index(index, sections, refs, built)


INDEX_TPL = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Demos de agentes</title>
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

footer.autor { margin-top: 28px; padding: 14px 0 0; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 8px 18px; align-items: center; justify-content: space-between; font-size: .88rem; color: var(--muted); }
footer.autor b { color: var(--text); }
footer.autor nav { display: flex; gap: 14px; flex-wrap: wrap; }
footer.autor a { color: var(--muted); text-decoration: none; border-bottom: 1px solid var(--border); }
footer.autor a:hover { color: var(--text); border-bottom-color: var(--text); }
</style>
</head>
<body>
<div class="wrap">
<header>
  <div>
    <h1>Demos de agentes y orquestación</h1>
    <p>Animaciones paso a paso, construidas a partir de los traces del curso. Primero, la anatomía de un agente individual; después, cómo fluye el contexto entre agentes en cada patrón de orquestación.</p>
  </div>
  <button class="tbtn" id="themeBtn" type="button">Tema claro / oscuro</button>
</header>

<h2>1. Anatomía de un agente</h2>
<p class="lead">Un solo agente por dentro: qué responde el modelo, qué ejecuta el harness, cómo regresan las observaciones y cómo crece el prompt en cada iteración.</p>
<div class="grid">
  <a class="card" style="--k:var(--b)" href="anatomia_agentes.html#precios"><div class="n">Anatomía · caso 1</div><div class="t">Agente de precios</div><div class="d">Ciclo básico de acción y observación con un motor de búsqueda y una calculadora.</div></a>
  <a class="card" style="--k:var(--b)" href="anatomia_agentes.html#fc"><div class="n">Anatomía · caso 2</div><div class="t">Function Calling</div><div class="d">Estado de un pedido: el modelo devuelve una llamada en JSON y el programa la ejecuta.</div></a>
  <a class="card" style="--k:var(--b)" href="anatomia_agentes.html#react"><div class="n">Anatomía · caso 3</div><div class="t">ReAct</div><div class="d">Queja por cobro duplicado: pensamiento, acción y observación en cinco iteraciones.</div></a>
</div>

<h2>2. Patrones de orquestación multi-agente</h2>
<p class="lead">Cada demo muestra el flujo a nivel workflow: qué agente recibe qué contexto, qué escribe en el estado compartido, quién decide el siguiente paso y dónde intervienen el código y las personas. Cada agente tiene un chip <b>system prompt</b>: al pasar el cursor o hacer clic se muestran sus instrucciones y herramientas hipotéticas. Los nombres de personas, empresas, folios y cifras son ficticios.</p>
<div class="grid">
{{CARDS}}
</div>

<h2>Convenciones de notación de los traces</h2>
{{CONV}}

<h2>Referencias</h2>
<div class="refs">
{{REFS}}
</div>
<footer class="autor">
  <div><b>Eduardo H. Ramirez, PhD</b></div>
  <nav aria-label="Redes sociales">
    <a href="https://www.linkedin.com/in/ehramirez" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://x.com/eduhrami" target="_blank" rel="noopener">X</a>
    <a href="https://github.com/eduhrami" target="_blank" rel="noopener">GitHub</a>
  </nav>
</footer>
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


def write_index(index, sections, refs, built):
    cards = []
    for num in sorted(index):
        i = index[num]
        off = "" if num in built else " off"
        cards.append(
            f'  <a class="card{off}" style="--k:var(--a)" href="patrones/{fname(num)}">'
            f'<div class="n">Patrón {num}</div><div class="t">{html.escape(i["patron"])}</div>'
            f'<div class="d">{html.escape(i["escenario"])}</div><span class="f">Fuente: {html.escape(i["fuente"])}</span></a>')
    md = MD.read_text(encoding="utf-8").splitlines()
    conv_rows = [ln for ln in md if re.match(r"^\| `", ln)]
    conv = "<table><thead><tr><th>Etiqueta</th><th>Significado</th></tr></thead><tbody>" + "".join(
        "<tr>" + "".join(f"<td>{md_inline(c.strip())}</td>" for c in r.strip("|").split("|")) + "</tr>" for r in conv_rows
    ) + "</tbody></table>"
    page = (INDEX_TPL.replace("{{CARDS}}", "\n".join(cards))
                     .replace("{{CONV}}", conv)
                     .replace("{{REFS}}", "\n".join(f"<p>{md_inline(r)}</p>" for r in refs)))
    (BASE / "index.html").write_text(page, encoding="utf-8")
    print("  index.html")


if __name__ == "__main__":
    build()
