/* Motor común de los demos de patrones de orquestación.
   Lee window.PATRON (diagrama y pasos) y window.META (textos extraídos del .md). */
(function () {
  const P = window.PATRON, M = window.META;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const TYPES = {
    input: 'Entrada', agent: 'Agente', code: 'Código', human: 'Persona',
    output: 'Salida', state: 'Estado', tool: 'Herramienta'
  };
  const FLOWS = {
    ctx: ['Contexto', 'var(--f-ctx)'], res: ['Resultado', 'var(--f-res)'], handoff: ['Handoff', 'var(--f-handoff)'],
    human: ['Persona', 'var(--f-human)'], ctrl: ['Control', 'var(--f-ctrl)'], fb: ['Retroalimentación', 'var(--f-fb)']
  };
  const PARTS = {
    input: 'Entrada original', instr: 'Instrucción', state: 'Del estado compartido', result: 'Resultado de otro agente',
    feedback: 'Retroalimentación', human: 'De una persona', desc: 'Descripciones de agentes', hist: 'Historial'
  };
  const TONES = { ok: 'var(--ok)', bad: 'var(--bad)', warn: 'var(--warn)', info: 'var(--info)', off: 'var(--muted)' };

  const steps = P.steps;
  const nodeById = {};
  P.nodes.forEach(n => nodeById[n.id] = n);
  let cur = 0, playing = false, timer = null;

  /* ---------- Encabezado y textos ---------- */
  document.title = M.short;
  $('hTitle').textContent = M.num + '. ' + M.title;
  $('hSub').textContent = 'Escenario: ' + M.escenario + ' · Fuente del ejemplo: ' + M.fuente;
  $('hCount').textContent = 'Patrón ' + M.num + ' de ' + M.total;
  const navPrev = $('navPrev'), navNext = $('navNext');
  if (M.prev) navPrev.href = M.prev; else navPrev.classList.add('disabled');
  if (M.next) navNext.href = M.next; else navNext.classList.add('disabled');
  $('intro').innerHTML = M.intro + (P.extra ? ' ' + P.extra : '');
  $('reading').innerHTML = '<h2>Lectura del trace</h2><ul>' + M.lectura.map(l => '<li>' + l + '</li>').join('') + '</ul>' +
    '<h2 style="margin-top:14px">Referencias</h2><div class="refs">' + M.refs.map(r => '<p>' + r + '</p>').join('') + '</div>';
  $('boardTab').textContent = P.boardTitle || 'Estado compartido';

  /* Leyenda con los tipos que aparecen en este patrón */
  const usedTypes = [...new Set(P.nodes.map(n => n.type))];
  const usedFlows = [...new Set(steps.flatMap(s => (s.flows || []).map(f => f.k || 'ctx')))];
  $('legend').innerHTML =
    usedTypes.map(t => `<span><i style="background:var(--t-${t})"></i>${TYPES[t]}</span>`).join('') +
    usedFlows.map(k => `<span><i class="ln" style="background:${FLOWS[k][1]}"></i>Flujo: ${FLOWS[k][0].toLowerCase()}</span>`).join('');

  /* ---------- Escenario ---------- */
  const stage = $('stage');
  stage.style.height = (P.h || 440) + 'px';
  stage.style.minWidth = (P.minW || 820) + 'px';
  let html = '<svg viewBox="0 0 100 100" preserveAspectRatio="none" id="svg"></svg>';
  (P.groups || []).forEach(g => {
    html += `<div class="grp" style="left:${g.x}%;top:${g.y}%;width:${g.w}%;height:${g.hh}%"><span>${esc(g.label)}</span></div>`;
  });
  P.nodes.forEach(n => {
    html += `<div class="nd t-${n.type}" id="n-${n.id}" style="left:${n.x}%;top:${n.y}%;width:${n.w || 150}px">` +
      `<div class="nd-type">${n.tag || TYPES[n.type]}</div><div class="nd-name${n.mono === false ? '' : ' mono'}">${esc(n.name).replace(/_/g, '_<wbr>')}</div>` +
      (n.desc ? `<div class="nd-desc">${esc(n.desc)}</div>` : '') + `<span class="nd-badge" id="b-${n.id}" hidden></span></div>`;
  });
  stage.innerHTML = html;
  const svg = $('svg');
  svg.innerHTML = (P.edges || []).map(([a, b]) => {
    const A = nodeById[a], B = nodeById[b];
    return `<line class="edge" data-e="${a}|${b}" x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"/>`;
  }).join('') + '<g id="flowLines"></g>';

  /* ---------- Trace: ubicar las líneas de cada paso ---------- */
  const lines = M.trace.split('\n');
  const errors = [];
  let from = 0;
  steps.forEach((s, i) => {
    if (!s.tr) { s._s = s._e = null; return; }
    const [a, b] = s.tr;
    let si = lines.findIndex((l, k) => k >= from && l.includes(a));
    if (si < 0) si = lines.findIndex(l => l.includes(a));
    let ei = b ? lines.findIndex((l, k) => k >= si && l.includes(b)) : si;
    if (si < 0 || ei < 0) { errors.push(`Paso ${i}: no se encontró "${si < 0 ? a : b}"`); s._s = s._e = null; return; }
    s._s = si; s._e = ei; from = si;
  });
  window.__traceErrors = errors;
  if (errors.length) console.warn(errors);

  /* ---------- Estado acumulado ---------- */
  function stateAt(i) {
    const st = { board: new Map(), badges: {}, shown: new Set(P.nodes.filter(n => !n.hidden).map(n => n.id)), off: new Set(), maxE: -1 };
    for (let k = 0; k <= i; k++) {
      const s = steps[k];
      if (s.boardReset) st.board.clear();
      Object.entries(s.board || {}).forEach(([key, v]) => {
        if (v === null) st.board.delete(key);
        else {
          const [val, by] = Array.isArray(v) ? v : [v, ''];
          st.board.set(key, { val, by, at: k });
        }
      });
      if (s.badgesReset) st.badges = {};
      Object.entries(s.badges || {}).forEach(([id, v]) => {
        if (v === null) { delete st.badges[id]; st.off.delete(id); }
        else { st.badges[id] = v; if (v[1] === 'off') st.off.add(id); else st.off.delete(id); }
      });
      (s.show || []).forEach(id => st.shown.add(id));
      if (s._e != null) st.maxE = Math.max(st.maxE, s._e);
    }
    return st;
  }

  /* ---------- Render de un paso ---------- */
  function speed() { return parseFloat($('speed').value) || 1; }

  function go(i, animate) {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    const s = steps[cur], st = stateAt(cur), prev = cur > 0 ? stateAt(cur - 1) : null;
    const dur = 1000 / speed();
    const flows = s.flows || [];

    /* Nodos */
    P.nodes.forEach(n => {
      const el = $('n-' + n.id);
      el.classList.remove('act', 'pulse');
      el.classList.toggle('off', st.off.has(n.id));
      const shown = st.shown.has(n.id);
      el.classList.toggle('hide', !shown);
      if (shown && prev && !prev.shown.has(n.id) && animate) { el.classList.remove('spawn'); void el.offsetWidth; el.classList.add('spawn'); }
      const b = $('b-' + n.id), bv = st.badges[n.id];
      if (bv) { b.hidden = false; b.textContent = bv[0]; b.style.setProperty('--bc', TONES[bv[1]] || TONES.info); }
      else b.hidden = true;
    });
    (s.active || []).forEach(id => $('n-' + id).classList.add('act'));

    /* Flujos: líneas punteadas y paquetes */
    document.querySelectorAll('.packet').forEach(p => p.remove());
    const fl = $('flowLines');
    fl.innerHTML = flows.map((f, k) => {
      const A = nodeById[f.from], B = nodeById[f.to], c = FLOWS[f.k || 'ctx'][1];
      return `<line class="flow" id="fl-${k}" x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" style="--c:${c}"/>`;
    }).join('');
    flows.forEach((f, k) => {
      const d = animate ? (f.ph || 0) * dur : 0;
      setTimeout(() => {
        if (steps[cur] !== s) return;
        const line = $('fl-' + k); if (line) line.classList.add('vis');
        if (animate) flyPacket(f, dur);
      }, d);
      setTimeout(() => {
        if (steps[cur] !== s) return;
        const t = $('n-' + f.to);
        t.classList.add('act');
        if (animate) { t.classList.remove('pulse'); void t.offsetWidth; t.classList.add('pulse'); }
      }, animate ? d + dur * .9 : 0);
    });

    /* Panel del paso */
    $('stepLbl').textContent = s.lbl;
    $('stepTitle').textContent = s.title;
    $('stepText').innerHTML = (s.text || '').split('\n\n').map(p => '<p>' + p + '</p>').join('');
    $('flowList').innerHTML = flows.length
      ? '<div class="sec-lbl">Flujos de información en este paso</div><ul class="flows">' + flows.map(f => {
          const [kl, c] = FLOWS[f.k || 'ctx'];
          return `<li><span class="fk" style="--c:${c}">${kl}</span><span><span class="ft mono">${esc(nodeById[f.from].name)} → ${esc(nodeById[f.to].name)}</span>${f.label ? ': ' + esc(f.label) : ''}</span></li>`;
        }).join('') + '</ul>'
      : '';
    const ctxs = s.ctx ? (Array.isArray(s.ctx) ? s.ctx : [s.ctx]) : [];
    $('ctxWrap').innerHTML = ctxs.length
      ? '<div class="sec-lbl">Contexto que recibe</div>' + ctxs.map(c =>
          `<div class="ctx"><h4>${c.title ? esc(c.title) : 'Recibe <span class="to">' + esc(nodeById[c.to] ? nodeById[c.to].name : c.to) + '</span>'}</h4>` +
          (c.parts || []).map(p => `<div class="part p-${p.k}"><div class="pl">${PARTS[p.k]}${p.src ? ' <span class="src">· ' + esc(p.src) + '</span>' : ''}</div><pre>${esc(p.text)}</pre></div>`).join('') +
          (c.miss || []).map(m => `<div class="part miss"><div class="pl">No recibe</div><pre>${esc(m)}</pre></div>`).join('') +
          '</div>').join('')
      : '';
    const outs = s.out ? (Array.isArray(s.out) ? s.out : [s.out]) : [];
    $('outWrap').innerHTML = outs.map(o =>
      `<div class="sec-lbl">${esc(o.label || 'Produce')}${o.by ? ' <span class="out-by">· ' + esc(nodeById[o.by] ? nodeById[o.by].name : o.by) + '</span>' : ''}</div><pre class="out">${esc(o.text)}</pre>`).join('');

    /* Tablero */
    $('board').innerHTML = st.board.size
      ? [...st.board.entries()].map(([key, e]) => {
          const isNew = e.at === cur;
          const wasThere = prev && prev.board.has(key);
          return `<div class="board-row${isNew ? ' new' : ''}">${isNew ? `<span class="tag">${wasThere ? 'ACTUALIZADO' : 'NUEVO'}</span>` : ''}` +
            `<span class="bk">${esc(key)}</span>${e.by ? `<span class="by">escribe: ${esc(e.by)}</span>` : ''}<pre>${esc(e.val)}</pre></div>`;
        }).join('')
      : `<p class="empty">${esc(P.boardEmpty || 'Todavía vacío.')}</p>`;

    /* Trace */
    renderTrace(s, st);

    /* Línea de tiempo y controles */
    document.querySelectorAll('.tl').forEach(b => {
      const k = +b.dataset.i;
      b.classList.toggle('cur', k === cur);
      b.classList.toggle('done', k < cur);
    });
    $('counter').textContent = `Paso ${cur + 1} de ${steps.length}`;
    $('btnPrev').disabled = cur === 0;
    $('btnNext').disabled = cur === steps.length - 1;
  }

  function renderTrace(s, st) {
    const full = $('fullTrace').checked;
    const tb = $('traceBox');
    tb.innerHTML = lines.map((l, k) => {
      let cls = 'past';
      if (s._s != null && k >= s._s && k <= s._e) cls = 'now';
      else if (k > st.maxE) cls = full ? 'fut' : 'gone';
      return `<span class="ln ${cls}">${esc(l) || ' '}</span>`;
    }).join('');
    const now = tb.querySelector('.now');
    if (now) tb.scrollTop = Math.max(0, now.offsetTop - tb.offsetTop - 60);
  }

  function flyPacket(f, dur) {
    const A = nodeById[f.from], B = nodeById[f.to];
    const p = document.createElement('div');
    p.className = 'packet';
    p.textContent = f.pk || f.label || '';
    p.style.setProperty('--c', FLOWS[f.k || 'ctx'][1]);
    stage.appendChild(p);
    const anim = p.animate([
      { left: A.x + '%', top: A.y + '%', opacity: 0 },
      { left: A.x + (B.x - A.x) * .15 + '%', top: A.y + (B.y - A.y) * .15 + '%', opacity: 1, offset: .15 },
      { left: A.x + (B.x - A.x) * .85 + '%', top: A.y + (B.y - A.y) * .85 + '%', opacity: 1, offset: .85 },
      { left: B.x + '%', top: B.y + '%', opacity: 0 }
    ], { duration: dur, easing: 'ease-in-out', fill: 'forwards' });
    anim.onfinish = () => p.remove();
  }

  /* ---------- Línea de tiempo ---------- */
  $('timeline').innerHTML = steps.map((s, i) => `<button class="tl" data-i="${i}" title="${esc(s.title)}" type="button">${esc(s.lbl)}</button>`).join('');
  document.querySelectorAll('.tl').forEach(b => b.onclick = () => { stop(); go(+b.dataset.i, true); });

  /* ---------- Reproducción ---------- */
  function readTime(s) {
    const txt = (s.text || '').replace(/<[^>]+>/g, '').length;
    const extra = JSON.stringify(s.ctx || '').length * .25 + JSON.stringify(s.out || '').length * .25;
    const phases = Math.max(0, ...(s.flows || []).map(f => f.ph || 0)) + 1;
    return Math.min(14000, Math.max(3500, (txt + extra) * 34)) + phases * 1000;
  }
  function schedule() {
    clearTimeout(timer);
    if (!playing) return;
    if (cur >= steps.length - 1) { stop(); return; }
    timer = setTimeout(() => { go(cur + 1, true); schedule(); }, readTime(steps[cur]) / speed());
  }
  function play() {
    if (cur >= steps.length - 1) go(0, false);
    playing = true; $('btnPlay').textContent = 'Pausa';
    clearTimeout(timer);
    timer = setTimeout(() => { go(cur + 1, true); schedule(); }, 400);
  }
  function stop() { playing = false; clearTimeout(timer); $('btnPlay').textContent = 'Reproducir'; }

  $('btnPlay').onclick = () => playing ? stop() : play();
  $('btnNext').onclick = () => { stop(); go(cur + 1, true); };
  $('btnPrev').onclick = () => { stop(); go(cur - 1, false); };
  $('btnReset').onclick = () => { stop(); go(0, false); };
  $('btnReplay').onclick = () => { stop(); go(cur, true); };
  $('speed').onchange = () => { if (playing) schedule(); };
  $('fullTrace').onchange = () => renderTrace(steps[cur], stateAt(cur));
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight') { e.preventDefault(); $('btnNext').click(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); $('btnPrev').click(); }
    else if (e.key === ' ') { e.preventDefault(); $('btnPlay').click(); }
  });
  document.querySelectorAll('.ptab').forEach(b => b.onclick = () => {
    document.querySelectorAll('.ptab').forEach(x => x.classList.toggle('active', x === b));
    document.querySelectorAll('.pview').forEach(v => v.classList.toggle('active', v.id === 'view-' + b.dataset.view));
    if (b.dataset.view === 'trace') renderTrace(steps[cur], stateAt(cur));
  });
  $('themeBtn').onclick = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
  };

  window.__go = go;
  window.__steps = steps;
  go(0, false);
})();
