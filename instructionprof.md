
Prévisualisation de TP - Des données au tableau de bord.md
Atelier noté - Des données au tableau de bord
Cours : 420-T83-OQ - Intégration de données et ETL : collecte et transformation de données

Modalité	Consigne
Mode de travail	Individuel
Présentation du sujet de l’atelier	7 novembre 2026
Remise pour la séance de présentation	28 novembre 2026, au plus tard à 8 h 00
Présentation orale	Présentation éclair de 7 minutes
Livrable	4 diapositives, au format PowerPoint ou web, au choix
Mise en contexte
En entreprise, un fichier volumineux ne permet pas, à lui seul, de comprendre une situation ou de prendre une décision. Il faut comprendre les données, vérifier leur qualité, les préparer et choisir comment présenter les informations importantes.

Dans cet atelier, vous réaliserez cette démarche à partir d’un jeu de données de votre choix. Votre objectif est de transformer ces données en un portrait visuel clair, compréhensible par une personne qui ne connaît pas le sujet.

Vous présenterez vos résultats en 4 diapositives et 7 minutes. Vous devrez sélectionner les informations essentielles, expliquer ce qu’elles révèlent et justifier vos choix.

1. Choisir votre jeu de données
Choisissez un sujet qui vous intéresse et qui permet une véritable analyse : comparer des catégories, observer une évolution, explorer des différences géographiques ou étudier des relations entre variables, par exemple.

Votre jeu de données doit respecter les contraintes suivantes :

Contrainte	Minimum attendu
Nombre de lignes ou d’enregistrements	100 000
Nombre de colonnes ou de champs	10
Volume de données	1 000 000 de valeurs, soit 100 000 enregistrements × 10 champs
Format	CSV recommandé. JSON, API ou autre format de données accepté,
avec les mêmes seuils de volume et de structure.
Après nettoyage	Au moins 700 000 valeurs.
Pour un format non tabulaire, expliquez ce qui correspond à un enregistrement et à un champ. Pour une API, indiquez le volume réellement récupéré pour votre travail.

Identifiez la source et choisissez une question qui guidera votre analyse. Vérifiez que les variables disponibles permettent de l’explorer. Signalez tout filtrage ou échantillonnage et justifiez son utilisation.

2. Préparer et analyser les données
Explorez votre jeu de données avant de construire votre présentation : types de variables, valeurs manquantes, doublons, formats incohérents ou autres problèmes de qualité.

Réalisez les préparations utiles à votre analyse : nettoyage, normalisation, conversion de types, filtrage, regroupement, calcul de nouvelles variables ou agrégation. Conservez des exemples concrets pour expliquer vos interventions. Si aucune correction n’est nécessaire, appuyez cette conclusion sur vos vérifications.

Choisissez ensuite les indicateurs et les graphiques qui répondent à votre question. Vérifiez vos calculs et formulez les constats que les données permettent réellement de soutenir. Précisez les limites qui peuvent influencer leur interprétation.

3. Construire vos 4 diapositives
Diapositive 1 - Le jeu de données et votre choix
Présentez le sujet, la source et le contenu des données.
Indiquez le nombre d’enregistrements, le nombre de champs et les principales variables utiles.
Expliquez votre choix et la question que vous souhaitez explorer.
Diapositive 2 - Le prétraitement
Présentez les vérifications effectuées et les principaux problèmes repérés.
Montrez les préparations réalisées et expliquez leur utilité.
Illustrez une intervention significative, par exemple avec un avant/après, et signalez les limites restantes.
Diapositive 3 - L’analyse et le tableau de bord
C’est le cœur de votre présentation. Cette diapositive doit constituer un véritable tableau de bord BI (Business Intelligence) : une synthèse visuelle qui permet de comprendre votre sujet sous plusieurs angles.

Votre analyse doit exploiter une part substantielle du volume et de la diversité de votre jeu de données. Les agrégations, les regroupements et les croisements entre variables doivent permettre de transformer le million de valeurs en informations utiles.

Ce qui est attendu :

Une vue d’ensemble : des indicateurs clés (KPI) pertinents, avec leur unité et le périmètre couvert.
Plusieurs vues complémentaires : des graphiques qui apportent chacun une information différente, comme une évolution, une répartition, une comparaison ou une relation entre variables.
Une exploitation de plusieurs dimensions du dataset : mobilisez plusieurs colonnes pertinentes et croisez-les pour enrichir l’analyse. Par exemple, comparez un montant selon une catégorie et une période, ou une fréquence selon une région et un profil.
Des constats à retenir : faites ressortir les tendances, les écarts ou les particularités significatives et expliquez brièvement leur sens.
Une organisation visuelle cohérente : hiérarchisez les informations et soignez les titres, les unités, les légendes, les échelles et la lisibilité.
Attention : une analyse trop limitée ne répond pas aux attentes.

Cinq indicateurs accompagnés d’un seul diagramme simple, calculés à partir de deux ou trois colonnes, ne suffisent pas à démontrer une exploration approfondie d’un dataset de cette taille. Vous devez montrer comment plusieurs aspects du jeu de données se complètent pour répondre à votre question d’analyse.

Recherchez un équilibre entre densité d’information et clarté. Votre tableau de bord doit présenter suffisamment d’informations pour donner un portrait riche du sujet, tout en restant lisible à l’écran pendant la présentation. Chaque élément doit apporter une information utile. Évitez les graphiques redondants, les textes trop petits et l’accumulation de visuels sans lien entre eux.

La profondeur de l’analyse, la complémentarité des vues et la pertinence des variables exploitées comptent davantage que le nombre de graphiques. Sélectionnez les dimensions utiles à votre question et justifiez les limites du périmètre analysé.

Diapositive 4 - Les méthodes de travail et l’IA
Présentez vos outils, votre démarche et le rôle des scripts ou automatisations utilisés.
Précisez si vous avez utilisé l’IA, pour quelles tâches et avec quelles vérifications.
Expliquez les décisions que vous avez prises et ce que vous retenez de votre démarche.
L’IA est autorisée. Vous devez comprendre et pouvoir expliquer les données, les traitements et les résultats que vous présentez.

4. Présenter et remettre votre travail
Préparez une présentation éclair individuelle de 7 minutes. Consacrez la plus grande part de votre temps aux résultats et à leur interprétation.

Remettez vos 4 diapositives au plus tard le 28 novembre 2026 à 8 h 00, prêtes pour la présentation :

PowerPoint : un fichier .pptx.
Web : un fichier ou un lien donnant accès à une présentation organisée en 4 diapositives ou vues distinctes.
Intégrez votre nom et le titre du projet à la première diapositive. Vérifiez l’ouverture du fichier, l’affichage des graphiques et, si nécessaire, les droits d’accès au lien remis.

Vos diapositives doivent être lisibles rapidement. Des éléments dynamiques sont possibles, mais les informations essentielles doivent rester accessibles sans longue navigation.

Bonus possible - Une vue web dynamique
Vous pouvez également présenter une page web permettant d’explorer les données : filtres, graphiques interactifs, sélection d’une période ou exploration de catégories, par exemple.

Cette vue est facultative et s’ajoute aux 4 diapositives obligatoires. Elle peut donner lieu à un bonus si l’interactivité apporte une réelle valeur à la compréhension des données. Si vous la présentez, intégrez sa démonstration aux 7 minutes prévues.

Évaluation
L’évaluation portera sur la compréhension du jeu de données, la pertinence du prétraitement, la fiabilité de l’analyse, la qualité des visualisations, la démarche de travail et la clarté de la présentation.

Critère	Ce qui est évalué	Points
Diapo 1 - Choix et compréhension des données	Source identifiée, contenu compris, choix justifié et question d’analyse pertinente.	10
Diapo 2 - Prétraitement et qualité des données	Vérifications pertinentes, transformations justifiées et limites identifiées.	10
Diapo 3 - L’analyse et le tableau de bord	KPI pertinents, calculs cohérents, plusieurs dimensions exploitées,
vues complémentaires, constats appuyés par les données et équilibre entre densité et lisibilité.	40
Diapo 4 - Méthodes de travail et recul critique	Démarche expliquée, rôle des outils et de l’IA précisé, résultats vérifiés et choix assumés.	20
Évaluation par les pairs - Travail	Pertinence des résultats et qualité du tableau de bord.	10
Évaluation par les pairs - Présentation	Clarté, synthèse et respect des 7 minutes.	10
Total général		100
La pertinence de vos choix et la fiabilité de vos résultats comptent davantage que la complexité technique ou le nombre d’outils utilisés. L’évaluation par les pairs compte pour 20 % de la note de l’atelier.

