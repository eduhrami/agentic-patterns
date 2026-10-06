#!/usr/bin/env python3
"""Verifica las páginas generadas de los demos.

Uso:  python3 _build/verificar.py   (requiere: pip install playwright && playwright install chromium)

Comprueba en cada patrón: sin errores de JavaScript, todas las marcas del trace
encontradas, cada agente con system prompt y cada prompt asociado a un nodo,
popovers visibles al pasar el cursor sin tapar su chip. Revisa además que no
haya em-dashes ni en-dashes, que no exista desborde horizontal en 390 px y que
los enlaces relativos entre páginas (incluido el cambio de idioma) existan.
"""
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = Path(__file__).resolve().parent.parent
PAGES = sorted((BASE / "patrones").glob("*.html")) + sorted((BASE / "en" / "patterns").glob("*.html"))
OTHER = [p for p in [BASE / "index.html", BASE / "anatomia_agentes.html",
                     BASE / "en" / "index.html", BASE / "en" / "agent_anatomy.html"] if p.exists()]


def overlap(a, b):
    return not (a["x"] + a["width"] <= b["x"] or a["x"] >= b["x"] + b["width"]
                or a["y"] + a["height"] <= b["y"] or a["y"] >= b["y"] + b["height"])


def main():
    problems = []
    for f in [*PAGES, *OTHER, *sorted((BASE / "_build").rglob("*.*"))]:
        if f.suffix in {".html", ".js", ".css", ".py"} and re.search("[\u2014\u2013]", f.read_text(encoding="utf-8")):
            problems.append(f"{f.relative_to(BASE)}: contiene em-dash o en-dash")

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1300, "height": 900})
        for f in PAGES:
            errs = []
            page.on("pageerror", lambda e: errs.append(str(e)))
            page.goto(f.as_uri())
            page.wait_for_timeout(100)
            info = page.evaluate("""() => {
              const nodes = PATRON.nodes, sp = window.PROMPTS || {};
              PATRON.steps.forEach((s, i) => window.__go(i, false));
              window.__go(0, false);
              return {
                trace: window.__traceErrors,
                missing: nodes.filter(n => n.type === 'agent' && !sp[n.id]).map(n => n.id),
                orphan: Object.keys(sp).filter(k => !nodes.find(n => n.id === k)),
                steps: PATRON.steps.length
              };
            }""")
            name = str(f.relative_to(BASE))
            for e in info["trace"]:
                problems.append(f"{name}: {e}")
            if info["missing"]:
                problems.append(f"{name}: agentes sin system prompt {info['missing']}")
            if info["orphan"]:
                problems.append(f"{name}: prompts sin nodo {info['orphan']}")
            for chip in page.query_selector_all(".nd .sp-chip"):
                if chip.evaluate("e => !!e.closest('.hide')"):
                    continue
                chip.scroll_into_view_if_needed()
                chip.hover(timeout=3000)
                page.wait_for_timeout(60)
                pop = page.locator("#spPop")
                if not pop.is_visible():
                    problems.append(f"{name}: el popover de {chip.get_attribute('data-sp')} no aparece")
                elif overlap(chip.bounding_box(), pop.bounding_box()):
                    problems.append(f"{name}: el popover tapa el chip de {chip.get_attribute('data-sp')}")
                page.mouse.move(2, 2)
                page.wait_for_timeout(250)
            problems += [f"{name}: {e}" for e in errs]
            print(f"  {name}: {info['steps']} pasos")

        for f in [*OTHER, *PAGES]:
            for href in re.findall(r'href="([^"#:]+\.html)', f.read_text(encoding="utf-8")):
                if not (f.parent / href).resolve().exists():
                    problems.append(f"{f.relative_to(BASE)}: enlace roto a {href}")

        mobile = browser.new_page(viewport={"width": 390, "height": 800})
        for f in [*OTHER, *PAGES]:
            mobile.goto(f.as_uri())
            if mobile.evaluate("document.documentElement.scrollWidth") > 390:
                problems.append(f"{f.name}: desborde horizontal en 390 px")
        browser.close()

    if problems:
        print("\nProblemas encontrados:")
        for pr in problems:
            print("  - " + pr)
        sys.exit(1)
    print("\nSin problemas.")


if __name__ == "__main__":
    main()
