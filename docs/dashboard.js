// ---------- Slide 3: dashboard (relies on D, loaded in app.js) ----------
const REG = { "Middle East": "Moyen-Orient", Asia: "Asie", Africa: "Afrique", Europe: "Europe", Americas: "Amériques" };
const REG_COLOR = { "Middle East": "#ff6b4a", Asia: "#4fa3e0", Africa: "#e8c547", Europe: "#b58cff", Americas: "#6fcf97" };
const TYPES = ["Conflit étatique", "Non étatique", "Violence unilatérale"];
const TYPE_COLOR = ["#ff6b4a", "#4fa3e0", "#e8c547"];
const state = { y0: 1989, y1: 2025, region: null, types: new Set(TYPES), country: null };
const fmt = n => Math.round(n).toLocaleString("fr-CA");
const sum = (a, k) => a.reduce((s, r) => s + r[k], 0);
const by = (a, k) => a.reduce((m, r) => ((m[r[k]] ||= []).push(r), m), {});
const keep = r => r.year >= state.y0 && r.year <= state.y1 && (!state.region || r.region === state.region) &&
  state.types.has(r.type_label) && (!state.country || r.country === state.country);
const decade = y => (y < 2000 ? "1989–99" : Math.floor(y / 10) * 10 + "s");
const GRID = "#2a313c";

function layout(extra = {}) {
  const fs = parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.8;
  return Object.assign({
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)", font: { color: "#e8eaed", size: fs },
    margin: { l: 50, r: 10, t: 6, b: 32 }, legend: { orientation: "h", y: -0.18, font: { size: fs } },
    xaxis: { gridcolor: GRID, zerolinecolor: GRID }, yaxis: { gridcolor: GRID, zerolinecolor: GRID },
  }, extra);
}
const plot = (id, data, lay) => Plotly.react(id, data, layout(lay), { responsive: true, displayModeBar: false });

function renderKpis(cy) {
  const ev = sum(cy, "events"), de = sum(cy, "deaths"), ci = sum(cy, "civilian_deaths");
  const yrs = Object.entries(by(cy, "year")).map(([y, r]) => [y, sum(r, "deaths")]).sort((a, b) => b[1] - a[1]);
  const k = [
    [fmt(ev), "événements"],
    [fmt(de), "morts (estimation best)"],
    [de ? (100 * ci / de).toFixed(1) + " %" : "–", "part de civils parmi les morts"],
    [new Set(cy.map(r => r.country)).size, "pays touchés"],
    [yrs[0] ? yrs[0][0] : "–", "année la plus meurtrière"],
  ];
  document.getElementById("kpis").innerHTML = k.map(([v, l]) => `<div class="kpi"><div class="v">${v}</div><div class="l">${l}</div></div>`).join("");
  document.getElementById("scope").textContent = `${state.y0}–${state.y1}` + (state.region ? ", " + REG[state.region] : ", monde entier") + (state.country ? ", " + state.country : "");
  return { de, ci, yrs };
}

function renderCharts(cy, sp, cf) {
  // 1: deaths per year by type
  const years = [...new Set(cy.map(r => r.year))].sort();
  plot("c1", TYPES.filter(t => state.types.has(t)).map(t => {
    const m = {};
    cy.filter(r => r.type_label === t).forEach(r => (m[r.year] = (m[r.year] || 0) + r.deaths));
    return { type: "bar", name: t, x: years, y: years.map(y => m[y] || 0), marker: { color: TYPE_COLOR[TYPES.indexOf(t)] } };
  }), { barmode: "stack" });

  // 3: heatmap region x decade
  const regs = Object.keys(REG), decs = [...new Set(cy.map(r => decade(r.year)))].sort();
  const z = regs.map(g => decs.map(d => sum(cy.filter(r => r.region === g && decade(r.year) === d), "deaths") / 1000));
  plot("c3", [{ type: "heatmap", x: decs, y: regs.map(g => REG[g]), z, colorscale: [[0, "#1d222b"], [1, "#ff6b4a"]], showscale: false,
    text: z.map(r => r.map(v => (v ? Math.round(v).toLocaleString("fr-CA") : ""))), texttemplate: "%{text}",
    hovertemplate: "%{y}, %{x}<br>%{z:,.0f} milliers de morts<extra></extra>" }], { margin: { l: 110, r: 10, t: 6, b: 28 } });

  // 4: top 10 conflicts
  const top = Object.entries(by(cf, "conflict_name")).map(([n, r]) => [n, sum(r, "deaths")]).sort((a, b) => b[1] - a[1]).slice(0, 10).reverse();
  plot("c4", [{ type: "bar", orientation: "h", x: top.map(t => t[1]), y: top.map(t => t[0]), marker: { color: "#ff6b4a" },
    hovertemplate: "%{y}<br>%{x:,.0f} morts<extra></extra>" }], { margin: { l: 10, r: 10, t: 6, b: 24 }, yaxis: { automargin: true, gridcolor: GRID } });

  // 5: who dies (share by type)
  const parts = [["Civils", "civilians", "#e8c547"], ["Côté A", "side_a", "#4fa3e0"], ["Côté B", "side_b", "#ff6b4a"], ["Inconnu", "unknown", "#8a94a3"]];
  const ts = TYPES.filter(t => state.types.has(t));
  plot("c5", parts.map(([n, k, c]) => ({ type: "bar", orientation: "h", name: n, y: ts, marker: { color: c },
    x: ts.map(t => sum(sp.filter(r => r.type_label === t), k)), hovertemplate: n + ": %{x:,.0f} morts<extra></extra>" })),
  { barmode: "stack", barnorm: "percent", margin: { l: 130, r: 10, t: 6, b: 40 } });

  // 6: frequency vs severity per country
  const cs = Object.entries(by(cy, "country")).map(([c, r]) => ({ c, g: r[0].region, e: sum(r, "events"), d: sum(r, "deaths") }));
  const maxD = Math.max(1, ...cs.map(z => z.d));
  plot("c6", Object.keys(REG).map(g => {
    const s = cs.filter(x => x.g === g && x.d > 0);
    return { type: "scatter", mode: "markers", name: REG[g], x: s.map(x => x.e), y: s.map(x => x.d / x.e), text: s.map(x => x.c),
      marker: { color: REG_COLOR[g], size: s.map(x => 6 + 22 * Math.sqrt(x.d / maxD)), opacity: 0.75 },
      hovertemplate: "%{text}<br>%{x:,.0f} événements<br>%{y:.1f} morts par événement<extra></extra>" };
  }), { xaxis: { type: "log", dtick: 1, gridcolor: GRID, title: { text: "événements", standoff: 4 } }, yaxis: { type: "log", dtick: 1, gridcolor: GRID, title: { text: "morts / événement", standoff: 4 } },
    margin: { l: 55, r: 10, t: 6, b: 45 }, legend: { orientation: "v", x: 1.0, y: 1 } });
}

function renderNote(cy, k, cf) {
  const regs = Object.entries(by(cy, "region")).map(([g, r]) => [g, sum(r, "deaths")]).sort((a, b) => b[1] - a[1]);
  const top = Object.entries(by(cf, "conflict_name")).map(([n, r]) => [n, sum(r, "deaths")]).sort((a, b) => b[1] - a[1])[0];
  const pct = (a, b) => (b ? (100 * a / b).toFixed(0) : 0) + " %";
  const items = [];
  if (k.yrs[0]) items.push(`Année la plus meurtrière : <b>${k.yrs[0][0]}</b> (${fmt(k.yrs[0][1])} morts).`);
  items.push(`Les civils forment <b>${pct(k.ci, k.de)}</b> des morts.`);
  if (regs[0] && top) items.push(`<b>${REG[regs[0][0]]}</b> : ${pct(regs[0][1], k.de)} des morts. Pire conflit : ${top[0]} (${fmt(top[1])}).`);
  document.getElementById("note").innerHTML = items.map(i => `<li>${i}</li>`).join("");
}

// Globe: one tower per ~100 km cell
let globe;
const lerp = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
function renderGlobe() {
  if (location.search.includes("noglobe")) return; // test hook: headless screenshots hang on the WebGL loop
  const el = document.getElementById("globe");
  if (!globe) {
    globe = Globe()(el).globeImageUrl("https://cdn.jsdelivr.net/npm/three-globe@2.31.0/example/img/earth-dark.jpg")
      .backgroundColor("rgba(0,0,0,0)").pointLat("lat").pointLng("lon").pointResolution(4).pointsMerge(false)
      .pointRadius(0.45).pointLabel(tip);
    globe.pointOfView({ lat: 20, lng: 30, altitude: 2.3 });
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.4;
    el.onmouseenter = () => (globe.controls().autoRotate = false);
    el.onmouseleave = () => (globe.controls().autoRotate = true);
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
    .pointColor(p => `rgb(${lerp([255, 214, 110], [190, 0, 30], Math.log1p(p.deaths) / maxD)})`)
    .pointsData(pts);
}
function tip(p) {
  const ys = Object.keys(p.years).map(Number), c = p.cell, w = 190, h = 34, n = state.y1 - state.y0 + 1;
  const mx = Math.max(...Object.values(p.years));
  const bars = Object.entries(p.years).map(([y, e]) =>
    `<rect x="${(y - state.y0) / n * w}" y="${h - e / mx * h}" width="${Math.max(2, w / n - 1)}" height="${e / mx * h}" fill="#ff6b4a"/>`).join("");
  return `<div class="gtip"><b>${c.country}</b> · ${REG[c.region]}<br>Conflit principal : ${c.conflict}<br>
    ${fmt(p.events)} événements (années ${Math.min(...ys)}–${Math.max(...ys)})<br>Du ${c.first} au ${c.last}<br>
    ${fmt(p.deaths)} morts dont ${fmt(p.civ)} civils<br><svg width="${w}" height="${h}">${bars}</svg><br>
    <span style="color:#9aa4b2">événements par année</span></div>`;
}

function render() {
  const cy = D.by_country_year.filter(keep), sp = D.deaths_split.filter(keep), cf = D.top_conflicts.filter(keep);
  const k = renderKpis(cy);
  renderCharts(cy, sp, cf);
  renderNote(cy, k, cf);
  renderGlobe();
}
