# Refonte visuelle

Statique (HTML + CSS + JS), sans étape de build. Les couleurs sont des variables CSS (`--ink`, `--ivory`, `--emerald`, `--crimson`…) dans `docs/style.css`; Plotly et le globe lisent ces variables dans `docs/dashboard.js` (une seule fonction `layout()` pour tous les graphiques).

Je n'ai pas navigué sur 21st.dev (pas d'accès navigateur ici) : les composants sont recréés à la main, d'après les motifs connus de Magic UI / Aceternity.

| Section | Motif recréé |
|---|---|
| Hero | Dot Pattern (grille de points animée, 6 %) + Number Ticker (compteurs animés en mono) |
| Navigation | Barre de progression + stepper en pilule (dots avec étiquettes) |
| Données, Préparation, Méthodes | Bento Grid + Spotlight Card (halo émeraude qui suit le pointeur) |
| Avant → après | Carte de comparaison avec flèche; stepper vertical numéroté; callouts à bordure cramoisie |
| Tableau de bord | Bento : globe en grande tuile sombre, cartes papier avec une phrase d'analyse en serif italique, 4 cartes « À retenir » |
| Pipeline | Animated Beam (point lumineux qui parcourt la ligne) + badges d'outils + carte citation |

Écart au brief : le tableau de bord utilise une largeur plus grande (jusqu'à 1800 px) pour tenir sur un écran 1920×1080 sans défilement; les autres diapositives font 1200 px max.

Captures : `notes/screens/before-N.png` et `after-N.png`.
