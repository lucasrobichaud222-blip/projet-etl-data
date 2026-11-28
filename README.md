# Des données au tableau de bord (projet ETL)

Cours 420-T83-OQ. Web presentation (4 slides) about the UCDP Georeferenced Event Dataset (GED) v26.1.

**Question:** how has organized violence evolved since 1989: who dies, where, and in what kind of conflict?

## Get the raw data

The CSV is 274 MB and is **not** in this repo.
1. Go to https://ucdp.uu.se/downloads/
2. Download "GED" version 26.1 (CSV).
3. Put `GEDEvent_v26_1.csv` in the project root.

## Rebuild

```
pip install pandas
python etl/explore.py
python etl/clean.py
python etl/aggregate.py
```

Then double-click `docs/index.html` (internet needed for the chart libraries).

## Live link

https://lucasrobichaud222-blip.github.io/projet-etl-data/
