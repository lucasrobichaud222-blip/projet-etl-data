// ---------- Slide 3: dashboard (relies on D, loaded in app.js) ----------
const REG = { "Middle East": "Moyen-Orient", Asia: "Asie", Africa: "Afrique", Europe: "Europe", Americas: "Amériques" };
const TYPES = ["Conflit étatique", "Non étatique", "Violence unilatérale"];
const state = { y0: 1989, y1: 2025, region: null, types: new Set(TYPES), country: null, log: false };

// One theme: colors come from the CSS variables, so style.css is the single source.
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const THEME = () => ({
  ink: cssVar("--ink"), ivory: cssVar("--ivory"), emerald: cssVar("--emerald"), crimson: cssVar("--crimson"), gray: cssVar("--gray"),
  muted: cssVar("--muted"), grid: "rgba(169,172,165,.3)", font: cssVar("--sans"),
});
const TYPE_COLOR = () => [THEME().emerald, THEME().crimson, THEME().gray];
const REG_COLOR = () => ({ "Middle East": "#C8102E", Asia: "#1F7A4D", Africa: "#6E0817", Europe: "#4A4F4B", Americas: "#5FA883" });
const SEQ = [[251, 230, 233], [232, 121, 138], [200, 16, 46], [110, 8, 23]]; // pale rose -> crimson -> deep red
const seq = t => { // t in 0..1 -> rgb string
  const x = Math.min(1, Math.max(0, t)) * 3, i = Math.min(2, Math.floor(x)), f = x - i;
  return `rgb(${SEQ[i].map((v, k) => Math.round(v + (SEQ[i + 1][k] - v) * f))})`;
};

const fmt = n => Math.round(n).toLocaleString("fr-CA");
const sum = (a, k) => a.reduce((s, r) => s + r[k], 0);
const by = (a, k) => a.reduce((m, r) => ((m[r[k]] ||= []).push(r), m), {});
const keep = r => r.year >= state.y0 && r.year <= state.y1 && (!state.region || r.region === state.region) &&
  state.types.has(r.type_label) && (!state.country || r.country === state.country);
const decade = y => (y < 2000 ? "1989–99" : Math.floor(y / 10) * 10 + "s");
const pct = (a, b) => (b ? (100 * a / b).toFixed(0) : 0) + " %";
const say = (id, html) => (document.getElementById(id).innerHTML = html);
const rootPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

// Shared Plotly template
function layout(extra = {}) {
  const t = THEME(), fs = rootPx() * 0.78;
  const ax = { gridcolor: t.grid, zeroline: false, linecolor: "rgba(0,0,0,0)", tickfont: { size: fs } };
  return Object.assign({
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)", font: { color: t.ink, size: fs, family: t.font },
    margin: { l: 50, r: 10, t: 4, b: 30 }, legend: { orientation: "h", y: -0.22, font: { size: fs } },
    hoverlabel: { bgcolor: t.ink, bordercolor: t.ink, font: { color: t.ivory, family: t.font, size: fs + 1 } },
    xaxis: ax, yaxis: ax,
  }, extra);
}
const plot = (id, data, lay) => Plotly.react(id, data, layout(lay), { responsive: true, displayModeBar: false });
const axis = (o = {}) => Object.assign({ gridcolor: THEME().grid, zeroline: false, linecolor: "rgba(0,0,0,0)" }, o);

// 5-year centred moving average of total deaths: shows the real trend under the 1994 spike
function trend(cy, years) {
  const m = {};
  cy.forEach(r => (m[r.year] = (m[r.year] || 0) + r.deaths));
  const y = years.map((_, i) => { const w = years.slice(Math.max(0, i - 2), i + 3).map(v => m[v] || 0); return w.reduce((a, b) => a + b, 0) / w.length; });
  return [{ type: "scatter", mode: "lines", name: "Tendance (moy. 5 ans)", x: years, y, line: { color: THEME().ink, width: 2, dash: "dot" },
    hovertemplate: "%{x}<br>moyenne 5 ans : %{y:,.0f} morts<extra></extra>" }];
}

function renderKpis(cy) {
  const ev = sum(cy, "events"), de = sum(cy, "deaths"), ci = sum(cy, "civilian_deaths");
  const yrs = Object.entries(by(cy, "year")).map(([y, r]) => [y, sum(r, "deaths")]).sort((a, b) => b[1] - a[1]);
  const k = [
    [fmt(ev), "événements", ""],
    [fmt(de), "morts (estimation best)", "k-d"],
    [de ? (100 * ci / de).toFixed(1) + " %" : "–", "part de civils parmi les morts", ""],
    [new Set(cy.map(r => r.country)).size, "pays touchés", ""],
    [yrs[0] ? yrs[0][0] : "–", "année la plus meurtrière", ""],
  ];
  document.getElementById("kpis").innerHTML = k.map(([v, l, c]) => `<div class="kpi ${c}"><div class="v">${v}</div><div class="l">${l}</div></div>`).join("");
  document.getElementById("count").textContent = `${fmt(ev)} événements sélectionnés sur ${fmt(D.meta.events)}`;
  document.getElementById("scope").textContent = `${state.y0}–${state.y1}` + (state.region ? ", " + REG[state.region] : ", monde entier") + (state.country ? ", " + state.country : "");
  return { de, ci, yrs };
}

function renderCharts(cy, sp, cf) {
  const T = THEME(), tc = TYPE_COLOR(), fs = rootPx() * 0.78;
  // 1: deaths per year by type
  const years = [...new Set(cy.map(r => r.year))].sort();
  plot("c1", TYPES.filter(t => state.types.has(t)).map(t => {
    const m = {};
    cy.filter(r => r.type_label === t).forEach(r => (m[r.year] = (m[r.year] || 0) + r.deaths));
    return { type: "bar", name: t, x: years, y: years.map(y => m[y] || 0), marker: { color: tc[TYPES.indexOf(t)] },
      hovertemplate: "%{x}<br>" + t + " : %{y:,.0f} morts<extra></extra>" };
  }).concat(trend(cy, years)), { barmode: "stack", bargap: 0.15, yaxis: axis(state.log ? { type: "log", dtick: 1 } : { type: "linear" }) });

  // 3: heatmap region x decade (colour on a square-root scale so small cells stay visible)
  const regs = Object.keys(REG), decs = [...new Set(cy.map(r => decade(r.year)))].sort();
  const z = regs.map(g => decs.map(d => sum(cy.filter(r => r.region === g && decade(r.year) === d), "deaths") / 1000));
  const zmax = Math.max(1, ...z.flat());
  const ann = [];
  z.forEach((row, i) => row.forEach((v, j) => v && ann.push({ x: decs[j], y: REG[regs[i]], text: fmt(v), showarrow: false,
    font: { color: Math.sqrt(v / zmax) > 0.55 ? T.ivory : T.ink, size: fs } })));
  plot("c3", [{ type: "heatmap", x: decs, y: regs.map(g => REG[g]), z: z.map(r => r.map(v => Math.sqrt(v / zmax))), customdata: z,
    colorscale: [[0, "#FBE6E9"], [0.33, "#E8798A"], [0.66, "#C8102E"], [1, "#6E0817"]], zmin: 0, zmax: 1, showscale: false, xgap: 2, ygap: 2,
    hovertemplate: "%{y}, %{x}<br>%{customdata:,.0f} milliers de morts<extra></extra>" }],
  { margin: { l: 90, r: 6, t: 4, b: 26 }, annotations: ann, xaxis: axis({ showgrid: false }), yaxis: axis({ showgrid: false }) });

  // 4: top 10 conflicts
  const top = Object.entries(by(cf, "conflict_name")).map(([n, r]) => [n, sum(r, "deaths")]).sort((a, b) => b[1] - a[1]).slice(0, 10).reverse();
  plot("c4", [{ type: "bar", orientation: "h", x: top.map(t => t[1]), y: top.map(t => t[0]), marker: { color: T.crimson },
    hovertemplate: "%{y}<br>%{x:,.0f} morts<extra></extra>" }], { margin: { l: 10, r: 10, t: 4, b: 22 }, bargap: 0.25, yaxis: axis({ automargin: true, showgrid: false, dtick: 1 }) });

  // 5: who dies (share by type): civilians = emerald, side B = crimson
  const parts = [["Civils", "civilians", T.emerald], ["Côté A", "side_a", T.gray], ["Côté B", "side_b", T.crimson], ["Inconnu", "unknown", "#A9ACA5"]];
  const ts = TYPES.filter(t => state.types.has(t));
  plot("c5", parts.map(([n, k, c]) => ({ type: "bar", orientation: "h", name: n, y: ts, marker: { color: c },
    x: ts.map(t => sum(sp.filter(r => r.type_label === t), k)), hovertemplate: n + " : %{x:,.0f} morts<extra></extra>" })),
  { barmode: "stack", barnorm: "percent", bargap: 0.3, margin: { l: 120, r: 10, t: 4, b: 38 }, yaxis: axis({ showgrid: false }) });

  // 6: frequency vs severity per country
  const cs = Object.entries(by(cy, "country")).map(([c, r]) => ({ c, g: r[0].region, e: sum(r, "events"), d: sum(r, "deaths") }));
  const maxD = Math.max(1, ...cs.map(z => z.d)), rc = REG_COLOR();
  plot("c6", Object.keys(REG).map(g => {
    const s = cs.filter(x => x.g === g && x.d > 0);
    return { type: "scatter", mode: "markers", name: REG[g], x: s.map(x => x.e), y: s.map(x => x.d / x.e), text: s.map(x => x.c),
      marker: { color: rc[g], size: s.map(x => 6 + 22 * Math.sqrt(x.d / maxD)), opacity: 0.7, line: { color: "#fff", width: 0.5 } },
      hovertemplate: "%{text}<br>%{x:,.0f} événements<br>%{y:.1f} morts par événement<extra></extra>" };
  }), { xaxis: axis({ type: "log", dtick: 1, title: { text: "événements", standoff: 2 } }), yaxis: axis({ type: "log", dtick: 1, title: { text: "morts / événement", standoff: 2 } }),
    margin: { l: 52, r: 4, t: 4, b: 42 }, legend: { orientation: "v", x: 1.0, y: 1, font: { size: fs * 0.95 } } });

  // one-line insights, computed from the same filtered rows
  const topY = Object.entries(by(cy, "year")).map(([y, r]) => [y, sum(r, "deaths")]).sort((a, b) => b[1] - a[1])[0];
  say("i1", topY ? `Pic en ${topY[0]} : ${fmt(topY[1])} morts.` : "Aucune donnée pour ce filtre.");
  let best = [0, 0, 0];
  z.forEach((row, i) => row.forEach((v, j) => v > best[0] && (best = [v, i, j])));
  say("i3", best[0] ? `${REG[regs[best[1]]]}, ${decs[best[2]]} : ${fmt(best[0] * 1000)} morts, le plus fort croisement.` : "");
  const tot = sum(cf, "deaths"), tp = top[top.length - 1];
  say("i4", tp ? `${tp[0]} : ${pct(tp[1], tot)} de tous les morts du filtre.` : "");
  const sh = ts.map(t => { const r = sp.filter(x => x.type_label === t); return [t, sum(r, "civilians") / Math.max(1, sum(r, "side_a") + sum(r, "side_b") + sum(r, "civilians") + sum(r, "unknown"))]; }).sort((a, b) => b[1] - a[1])[0];
  say("i5", sh ? `${sh[0]} : ${(sh[1] * 100).toFixed(0)} % de civils parmi les morts.` : "");
  const sev = cs.filter(x => x.e >= 100).sort((a, b) => b.d / b.e - a.d / a.e)[0];
  say("i6", sev ? `${sev.c} : ${(sev.d / sev.e).toFixed(1)} morts par événement (≥ 100 événements).` : "");
}

function renderNote(cy, k, cf) {
  const regs = Object.entries(by(cy, "region")).map(([g, r]) => [g, sum(r, "deaths")]).sort((a, b) => b[1] - a[1]);
  const top = Object.entries(by(cf, "conflict_name")).map(([n, r]) => [n, sum(r, "deaths")]).sort((a, b) => b[1] - a[1])[0];
  const cards = [];
  if (k.yrs[0]) cards.push(["d", fmt(k.yrs[0][1]), `morts en ${k.yrs[0][0]}, l'année la plus meurtrière`]);
  cards.push(["", pct(k.ci, k.de), "des morts sont des civils"]);
  if (regs[0]) cards.push(["", pct(regs[0][1], k.de), `des morts : ${REG[regs[0][0]]}, la région la plus touchée`]);
  if (top) cards.push(["d", fmt(top[1]), `morts : ${top[0]}, le conflit le plus meurtrier`]);
  document.getElementById("note").innerHTML = cards.map(([c, v, t]) => `<div class="tk ${c}"><b>${v}</b><span>${t}</span></div>`).join("");
}

// Globe: one tower per ~100 km cell
let globe;
function renderGlobe() {
  if (location.search.includes("noglobe")) return; // test hook: headless screenshots hang on the WebGL loop
  const el = document.getElementById("globe"), T = THEME();
  if (!globe) {
    globe = Globe()(el).backgroundColor(T.ink).showAtmosphere(true).atmosphereColor(T.emerald).atmosphereAltitude(0.16)
      .pointLat("lat").pointLng("lon").pointResolution(4).pointsMerge(false).pointRadius(0.45).pointLabel(tip)
      .onPointClick(p => setCountry(p.cell.country))
      .polygonsData(D.countries.features).polygonCapColor(() => "#1A231E").polygonSideColor(() => "rgba(0,0,0,0)")
      .polygonStrokeColor(() => T.emerald).polygonAltitude(0.004);
    try { globe.globeMaterial().color.set("#0E1411"); } catch (e) { /* material API changed: keep default */ }
    globe.pointOfView({ lat: 20, lng: 30, altitude: 2.3 });
    globe.controls().autoRotate = !REDUCED;
    globe.controls().autoRotateSpeed = 0.4;
    el.onmouseenter = () => (globe.controls().autoRotate = false);
    el.onmouseleave = () => (globe.controls().autoRotate = !REDUCED);
  }
  globe.width(el.clientWidth).height(el.clientHeight);
  const G = D.grid_cells, perCell = {};
  G.rows.forEach(([c, y, t, e, d, ci]) => {
    const cell = G.cells[c];
    if (y < state.y0 || y > state.y1 || !state.types.has(G.types[t]) || (state.region && cell.region !== state.region)) return;
    const o = (perCell[c] ||= { cell, events: 0, deaths: 0, civ: 0, years: {} });
    o.events += e; o.deaths += d; o.civ += ci; o.years[y] = (o.years[y] || 0) + e;
  });
  const pts = Object.values(perCell).map(o => ({ ...o, lat: o.cell.lat, lon: o.cell.lon }));
  const maxE = Math.max(1, ...pts.map(p => p.events)), maxD = Math.log1p(Math.max(1, ...pts.map(p => p.deaths)));
  globe.pointAltitude(p => 0.01 + 0.5 * Math.sqrt(p.events / maxE)) // sqrt so one huge cell does not flatten the rest
    .pointColor(p => seq(Math.log1p(p.deaths) / maxD))
    .pointsData(pts);
  const busiest = [...pts].sort((a, b) => b.events - a.events)[0];
  say("ig", busiest ? `Zone la plus active : ${busiest.cell.country}, ${fmt(busiest.events)} événements.` : "Aucune donnée pour ce filtre.");
}
function tip(p) {
  const ys = Object.keys(p.years).map(Number), c = p.cell, w = 190, h = 34, n = state.y1 - state.y0 + 1;
  const mx = Math.max(...Object.values(p.years));
  const bars = Object.entries(p.years).map(([y, e]) =>
    `<rect x="${(y - state.y0) / n * w}" y="${h - e / mx * h}" width="${Math.max(2, w / n - 1)}" height="${e / mx * h}" fill="#E8798A"/>`).join("");
  return `<div class="gtip"><b>${c.country}</b> · ${REG[c.region]}<br>Conflit principal : ${c.conflict}<br>
    ${fmt(p.events)} événements (années ${Math.min(...ys)}–${Math.max(...ys)})<br>Du ${c.first} au ${c.last}<br>
    ${fmt(p.deaths)} morts dont ${fmt(p.civ)} civils<br><svg width="${w}" height="${h}">${bars}</svg><br>
    <span style="color:#A9ACA5">événements par année</span></div>`;
}

function render() {
  if (!document.querySelector("#filters input")) return initFilters()(); // first call builds the controls, then renders
  const cy = D.by_country_year.filter(keep), sp = D.deaths_split.filter(keep), cf = D.top_conflicts.filter(keep);
  const k = renderKpis(cy);
  renderCharts(cy, sp, cf);
  renderNote(cy, k, cf);
  renderGlobe();
  const sc = document.getElementById("c6");
  if (!sc.dataset.click) { sc.dataset.click = 1; sc.on("plotly_click", e => setCountry(e.points[0].text)); }
}

// ---------- Filters ----------
function initFilters() {
  const f = document.getElementById("filters");
  const tc = TYPE_COLOR();
  f.innerHTML = `
    <label>Années <b id="yl"></b>
      <input type="range" id="y0" min="1989" max="2025" value="1989" aria-label="Année de début"><input type="range" id="y1" min="1989" max="2025" value="2025" aria-label="Année de fin"></label>
    <label>Région <select id="reg"><option value="">Monde</option>${Object.entries(REG).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select></label>
    <span class="types">${TYPES.map((t, i) => `<label class="tg"><input type="checkbox" checked data-t="${t}"><span style="--c:${tc[i]}">${t}</span></label>`).join("")}</span>
    <label class="tg"><input type="checkbox" id="log"><span style="--c:${THEME().ink}">Échelle log (graph. 1)</span></label>
    <button id="cty" hidden></button>
    <button id="reset">Réinitialiser</button>`;
  const $ = id => document.getElementById(id);
  const sync = () => {
    state.y0 = +Math.min($("y0").value, $("y1").value); state.y1 = +Math.max($("y0").value, $("y1").value);
    state.region = $("reg").value || null;
    state.log = $("log").checked;
    state.types = new Set([...f.querySelectorAll("[data-t]")].filter(c => c.checked).map(c => c.dataset.t));
    $("yl").textContent = `${state.y0}–${state.y1}`;
    $("cty").hidden = !state.country;
    $("cty").textContent = state.country ? `Pays : ${state.country} ✕` : "";
    saveUrl();
    render();
  };
  const q = new URLSearchParams(location.search); // restore a shared view
  if (q.has("y0")) $("y0").value = q.get("y0");
  if (q.has("y1")) $("y1").value = q.get("y1");
  if (q.has("region") && REG[q.get("region")]) $("reg").value = q.get("region");
  if (q.has("t")) { const on = q.get("t").split(",").map(i => TYPES[i]); f.querySelectorAll("[data-t]").forEach(c => (c.checked = on.includes(c.dataset.t))); }
  if (q.get("log") === "1") $("log").checked = true;
  if (q.has("country")) state.country = q.get("country");
  f.oninput = sync;
  $("cty").onclick = () => { state.country = null; sync(); };
  $("reset").onclick = () => {
    $("y0").value = 1989; $("y1").value = 2025; $("reg").value = "";
    f.querySelectorAll("[data-t]").forEach(c => (c.checked = true));
    state.country = null; sync();
    globe && globe.pointOfView({ lat: 20, lng: 30, altitude: 2.3 }, 800);
  };
  $("reg").addEventListener("change", () => { // turn the globe towards the chosen region
    const pts = globe && globe.pointsData();
    const r = pts && pts.filter(p => !state.region || p.cell.region === state.region);
    if (state.region && r.length) globe.pointOfView({ lat: r.reduce((s, p) => s + p.lat, 0) / r.length, lng: r.reduce((s, p) => s + p.lon, 0) / r.length, altitude: 1.8 }, 800);
  });
  window.setCountry = c => { state.country = state.country === c ? null : c; sync(); };
  return sync;
}

// Keep the filters in the address bar so the exact view can be shared or reloaded.
function saveUrl() {
  const q = new URLSearchParams(location.search);
  ["y0", "y1", "region", "t", "log", "country"].forEach(k => q.delete(k));
  if (state.y0 !== 1989) q.set("y0", state.y0);
  if (state.y1 !== 2025) q.set("y1", state.y1);
  if (state.region) q.set("region", state.region);
  if (state.types.size !== TYPES.length) q.set("t", TYPES.map((t, i) => (state.types.has(t) ? i : "")).filter(i => i !== "").join(","));
  if (state.log) q.set("log", 1);
  if (state.country) q.set("country", state.country);
  const qs = q.toString();
  history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
}
