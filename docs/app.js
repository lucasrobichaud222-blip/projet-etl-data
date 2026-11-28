const FILES = ["meta", "quality", "by_country_year", "top_conflicts", "deaths_split", "grid_cells", "countries"];
const D = {};
const LABELS = ["Données", "Préparation", "Tableau de bord", "Méthodes"];
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
let cur = 0;

// Lucide-style line icons (inline, no network)
const ICONS = {
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  calendar: '<path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
  chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  left: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
};
const icons = root => root.querySelectorAll("i[data-i]").forEach(el => {
  el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[el.dataset.i] || ""}</svg>`;
});
icons(document);

const slides = [...document.querySelectorAll(".slide")];
const stepsEl = document.getElementById("steps");
stepsEl.innerHTML = LABELS.map((l, i) => `<li><button data-go="${i}"><span class="dot"></span><span>${l}</span></button></li>`).join("");
stepsEl.onclick = e => { const b = e.target.closest("[data-go]"); if (b) go(+b.dataset.go); };

slides.forEach(s => s.querySelectorAll("[data-reveal]").forEach((el, i) => el.style.setProperty("--i", i)));

function go(i) {
  cur = Math.max(0, Math.min(slides.length - 1, i));
  slides.forEach((s, k) => { s.classList.toggle("active", k === cur); s.inert = k !== cur; });
  stepsEl.querySelectorAll("button").forEach((b, k) => k === cur ? b.setAttribute("aria-current", "step") : b.removeAttribute("aria-current"));
  document.querySelector("#progress i").style.width = ((cur + 1) / slides.length * 100) + "%";
  history.replaceState(null, "", "#" + (cur + 1));
  if (cur === 0) countUp();
  setTimeout(() => window.dispatchEvent(new Event("resize")), 300); // let Plotly/globe fit their slide
}
document.getElementById("prev").onclick = () => go(cur - 1);
document.getElementById("next").onclick = () => go(cur + 1);
document.addEventListener("keydown", e => {
  if (e.target.matches("input, select")) return;
  if (["ArrowRight", "PageDown"].includes(e.key)) go(cur + 1);
  if (["ArrowLeft", "PageUp"].includes(e.key)) go(cur - 1);
});
// spotlight glow follows the pointer on cards
document.addEventListener("pointermove", e => {
  const c = e.target.closest(".card"); if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px");
});

const fmtN = n => (typeof n === "number" ? Math.round(n).toLocaleString("fr-CA") : n);
function countUp() {
  if (!D.meta) return; // data not loaded yet: called again once it is
  document.querySelectorAll("[data-count]").forEach(el => {
    const to = el.dataset.count === "years" ? D.meta.year_max - D.meta.year_min + 1 : D.meta[el.dataset.count];
    if (to === undefined) return;
    if (REDUCED) return (el.textContent = fmtN(to));
    const t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / 1400);
      el.textContent = fmtN(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}

function fillQuality() {
  const q = D.quality, set = (id, v) => (document.getElementById(id).textContent = v);
  document.querySelector('[data-q="rows"]').textContent = fmtN(q.rows);
  document.getElementById("checks").innerHTML = q.checks
    .map(c => `<li class="${c.count ? "nonzero" : "zero"}"><span>${c.label}</span><b>${fmtN(c.count)}</b></li>`).join("");
  const e = q.example, L = q.limits;
  set("q-bad", fmtN(q.checks.at(-1).count));
  set("q-id", e.id); set("q-where", `${e.country}, ${e.year}`);
  set("q-b1", e.best); set("q-l1", e.low_before); set("q-h1", e.high_before);
  set("q-b2", e.best); set("q-l2", e.low_after); set("q-h2", e.high_after);
  document.querySelectorAll("[data-lim]").forEach(el => (el.textContent = L[el.dataset.lim].toLocaleString("fr-CA")));
}

// Fetch every file; a failed file is reported on the page instead of leaving blanks.
Promise.all(FILES.map(f => fetch(`data/${f}.json`).then(r => { if (!r.ok) throw new Error(f + " " + r.status); return r.json(); }).then(j => (D[f] = j))))
  .then(() => {
    document.querySelectorAll("[data-meta]").forEach(el => (el.textContent = fmtN(D.meta[el.dataset.meta])));
    fillQuality();
    render();
    if (cur === 0) countUp();
  })
  .catch(e => {
    console.error("erreur de chargement", e);
    document.body.insertAdjacentHTML("afterbegin", `<p style="position:fixed;z-index:20;top:1rem;left:1rem;background:#FBE6E9;color:#8A0A1F;padding:.6rem 1rem;border-radius:.6rem">Données non chargées (${e.message}). Ouvrir la page via un serveur web, pas en double-cliquant le fichier.</p>`);
  });

go((parseInt(location.hash.slice(1)) || 1) - 1);
