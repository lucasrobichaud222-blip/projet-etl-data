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

## Ajouts « 40 points » (tableau de bord)
- Légende du globe : « 1 tour = 1 zone d'environ 100 km ».
- Graphique 1 : courbe de tendance (moyenne mobile 5 ans) et bouton « Échelle log » pour voir l'évolution malgré le pic de 1994.
- Compteur « N événements sélectionnés sur 417 968 » près des filtres.
- Les filtres sont dans l'adresse (`?region=Africa&y0=2010&y1=2020&t=0,1&log=1&country=…`) : on peut recharger ou partager exactement la même vue.
