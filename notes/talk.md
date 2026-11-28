# Plan de la présentation (7 min)

| Diapo | Temps | Message |
|---|---|---|
| 1. Jeu de données | 1 min | UCDP GED, 417 968 événements, 49 champs, la question |
| 2. Prétraitement | 1 min | Tout vérifié; un seul problème (low/high); avant/après |
| 3. Tableau de bord | 3 min 30 | KPI, globe, démo des filtres (Afrique + 2010–2020, clic sur un pays) |
| 4. Méthodes et IA | 1 min 30 | Ma méthode en 4 étapes, rôle de l'IA, 5 vérifications |

## Les limites (diapo 2, environ 25 s : dire les 3 premières, garder le reste pour les questions)

1. **Des estimations.** Chaque événement a trois chiffres : *low*, *best*, *high*. Additionnés : 3,5 M, 4,3 M, 6,4 M. La page utilise *best*. L'écart vers le haut est bien plus grand que vers le bas.
   *À dire :* « Je lis les tendances et les ordres de grandeur, pas le chiffre exact. »
2. **Ce qui n'est pas compté.** L'UCDP compte les morts directes de la violence organisée, pour les événements qu'elle peut sourcer. Les morts par famine ou maladie causées par la guerre sont absentes, et la couverture varie selon le pays et l'époque.
   *À dire :* « Le coût humain réel dépasse ce que montrent les morts directes. »
3. **Événements « peu clairs » (event_clarity = 2).** La source donnait déjà un total regroupé, impossible à séparer. 7,3 % des lignes, mais 43,9 % des morts. Une ligne peut aussi couvrir une longue période (ex. : événement 71542, Éthiopie, du 1er janvier au 31 décembre 1989).
   *À dire :* « Un événement n'est pas toujours une attaque; je compare le nombre d'événements avec prudence. »
4. **Lieu imprécis (where_prec ≥ 4).** 15 % des événements, 30,6 % des morts : on connaît seulement la province, le pays ou une zone large. Le globe regroupe en plus par zones d'environ 100 km.
5. **Statut inconnu.** 16,5 % des morts ne sont classées ni civiles ni combattantes. La part de civils (36,9 %) ne compte que les civils identifiés.
6. **Champs de texte vides.** Titre de source 23,3 %, district 17,6 %. Je ne les utilise pas.

Un problème **corrigé** n'est pas une **limite** : les 5 075 bornes incohérentes sont corrigées par une règle; une limite ne se corrige pas, on la dit.

## L'IA dans le projet (diapo 4, environ 45 s)

« J'ai utilisé Claude du début à la fin. Il m'a aidé à trouver un jeu de données selon mes intérêts, et j'ai choisi. Je lui ai donné les consignes et le fichier, il a préparé une feuille de route que j'ai vérifiée. Avec Claude Code, il a écrit les scripts Python et la page, une étape à la fois. J'ai ensuite retouché le style, le texte et l'information. Comme l'IA peut se tromper avec assurance, les chiffres sont contrôlés : `verify.py` les recalcule depuis le CSV brut. »

À ajouter si c'est arrivé : **un exemple précis** où tu as corrigé ou refusé une proposition de l'IA. C'est la meilleure preuve de recul critique.

## Questions probables sur les limites et l'IA
- **Comment sais-tu que le code est juste ?** Les scripts s'arrêtent si un total ne correspond pas (*assert*), et `verify.py` compare 6 chiffres avec le CSV brut. Limite : ces contrôles ont aussi été écrits avec l'IA, et ils prouvent que les calculs concordent, pas que les données de l'UCDP sont vraies.
- **Que fait chaque script ?** `explore.py` vérifie la qualité; `clean.py` corrige les bornes et ajoute des colonnes; `aggregate.py` résume en JSON; `verify.py` compare.
- **Pourquoi corriger low / high au lieu de supprimer les lignes ?** Supprimer enlèverait 5 075 événements réels; *best* ne change pas.
- **Pourquoi 1994 ressort autant ?** Le Rwanda : environ 772 000 morts cette année-là, 18 % du total depuis 1989.

## Questions probables « pourquoi ce graphique ? »
- Barres empilées par année : l'évolution et le pic de 1994 (Rwanda).
- Globe : où, et quelles zones concentrent les événements (hauteur) et les morts (couleur).
- Carte de chaleur région × décennie : croiser lieu et époque.
- Top 10 : comparer les conflits.
- Qui meurt : civils, côté A, côté B selon le type de violence.
- Nuage de points : fréquence vs gravité par pays.

## À faire par toi
- Répéter au moins 2 fois en chronométrant.
