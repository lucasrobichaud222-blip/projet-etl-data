const FILES = ["meta", "by_country_year", "top_conflicts", "deaths_split", "grid_cells"];
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
  .then(() => console.log("données chargées", Object.keys(D)))
  .catch(e => console.error("erreur de chargement", e));
