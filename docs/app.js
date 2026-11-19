const FILES = ["meta", "quality", "by_country_year", "top_conflicts", "deaths_split", "grid_cells"];
const D = {};
let cur = 0;

const slides = [...document.querySelectorAll(".slide")];
function go(i) {
  cur = Math.max(0, Math.min(slides.length - 1, i));
  slides.forEach((s, k) => s.classList.toggle("active", k === cur));
  document.getElementById("counter").textContent = `${cur + 1} / ${slides.length}`;
  history.replaceState(null, "", "#" + (cur + 1));
  window.dispatchEvent(new Event("resize")); // let Plotly/globe fit their slide
}
document.getElementById("prev").onclick = () => go(cur - 1);
document.getElementById("next").onclick = () => go(cur + 1);
document.addEventListener("keydown", e => {
  if (e.target.matches("input, select")) return;
  if (["ArrowRight", "PageDown", " "].includes(e.key)) go(cur + 1);
  if (["ArrowLeft", "PageUp"].includes(e.key)) go(cur - 1);
});
go((parseInt(location.hash.slice(1)) || 1) - 1);

Promise.all(FILES.map(f => fetch(`data/${f}.json`).then(r => r.json()).then(j => (D[f] = j))))
  .then(() => {
    const fmt = n => typeof n === "number" ? n.toLocaleString("fr-CA") : n;
    D.meta.values_raw = D.meta.events * D.meta.columns_raw;
    fillQuality();
    document.querySelectorAll("[data-meta]").forEach(el => (el.textContent = fmt(D.meta[el.dataset.meta])));
  })
  .catch(e => console.error("erreur de chargement", e));

function fillQuality() {
  const q = D.quality, f = n => n.toLocaleString("fr-CA"), set = (id, v) => (document.getElementById(id).textContent = v);
  document.querySelector('[data-q="rows"]').textContent = f(q.rows);
  document.getElementById("checks").innerHTML = q.checks
    .map(c => `<li class="${c.count ? "nonzero" : "zero"}"><span>${c.label}</span><b>${f(c.count)}</b></li>`).join("");
  const e = q.example, L = q.limits;
  set("q-bad", f(q.checks.at(-1).count));
  set("q-id", e.id); set("q-where", `${e.country}, ${e.year}`);
  set("q-b1", e.best); set("q-l1", e.low_before); set("q-h1", e.high_before);
  set("q-b2", e.best); set("q-l2", e.low_after); set("q-h2", e.high_after);
  set("q-imp", f(L.imprecise_location)); set("q-unc", f(L.unclear_events));
  set("q-hl", L.missing_headline_pct); set("q-a2", L.missing_adm2_pct);
}
