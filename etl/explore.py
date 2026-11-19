"""Step 2: quality checks on the raw GED CSV. Prints and writes notes/quality_log.md."""
import pandas as pd

df = pd.read_csv("GEDEvent_v26_1.csv", low_memory=False)
out = []


def log(s=""):
    print(s)
    out.append(s)


n, c = df.shape
log("# Quality log — UCDP GED v26.1\n")
log(f"- Rows: {n:,}  Columns: {c}  Values (rows x columns): {n * c:,}")

log("\n## Types and missing values (columns with missing > 0)\n")
miss = df.isna().sum()
log("| column | dtype | missing | % |\n|---|---|---|---|")
for col in df.columns:
    if miss[col]:
        log(f"| {col} | {df[col].dtype} | {miss[col]:,} | {miss[col] / n:.1%} |")
log(f"\nColumns with no missing values: {(miss == 0).sum()} of {c}")

dups = int(df["id"].duplicated().sum())
log(f"\n## Duplicates\n\n- Duplicate `id`: {dups}")

log("\n## Dates\n")
ds = pd.to_datetime(df["date_start"], errors="coerce")
de = pd.to_datetime(df["date_end"], errors="coerce")
bad_ds, bad_de = int(ds.isna().sum()), int(de.isna().sum())
order = int((ds > de).sum())
yr = int((ds.dt.year != df["year"]).sum())
log(f"- Unparseable date_start: {bad_ds}; date_end: {bad_de}")
log(f"- date_start > date_end: {order}")
log(f"- year != year of date_start: {yr}")
log(f"- Range: {ds.min().date()} to {de.max().date()}")

log("\n## Coordinates\n")
lat, lon = df["latitude"], df["longitude"]
bad_coord = ~lat.between(-90, 90) | ~lon.between(-180, 180)
log(f"- Missing lat: {int(lat.isna().sum())}, lon: {int(lon.isna().sum())}")
log(f"- Out of range (incl. missing): {int(bad_coord.sum())}")

log("\n## Deaths\n")
total = df[["deaths_a", "deaths_b", "deaths_civilians", "deaths_unknown"]].sum(axis=1)
mismatch = df[total != df["best"]]
order_bad = df[~((df["low"] <= df["best"]) & (df["best"] <= df["high"]))]
neg = int((df[["deaths_a", "deaths_b", "deaths_civilians", "deaths_unknown", "best", "low", "high"]] < 0).any(axis=1).sum())
log(f"- best != sum of 4 death columns: {len(mismatch)}")
log(f"- Not low <= best <= high: {len(order_bad)}")
log(f"- Negative values: {neg}")
log(f"- Total deaths (best): {int(df['best'].sum()):,}")

log("\n## Categories\n")
for col in ["type_of_violence", "region", "where_prec", "event_clarity"]:
    log(f"**{col}**\n")
    for k, v in df[col].value_counts(dropna=False).items():
        log(f"- {k}: {v:,}")
    log()

log("## Example rows\n")
cols = ["id", "year", "country", "date_start", "date_end", "best", "deaths_a", "deaths_b", "deaths_civilians", "deaths_unknown", "low", "high", "latitude", "longitude", "where_prec"]
examples = [("best differs from sum of death columns", mismatch), ("low <= best <= high violated", order_bad),
            ("invalid/missing coordinates", df[bad_coord]), ("year != start date year", df[ds.dt.year != df["year"]]),
            ("date_start > date_end", df[ds > de])]
for title, sub in examples:
    log(f"**{title}** — {len(sub)} rows")
    if len(sub):
        log("\n```\n" + sub.head(3)[cols].to_string(index=False) + "\n```")
    else:
        log("\nNothing found (0 rows).")
    log()

open("notes/quality_log.md", "w", encoding="utf-8").write("\n".join(out))

# Numbers for slide 2 (so nothing on the slide is typed by hand)
import json

ex = order_bad.iloc[0]
quality = {
    "rows": n, "columns": c, "values": n * c,
    "checks": [
        {"label": "Identifiants (id) en double", "count": dups},
        {"label": "Dates illisibles (début ou fin)", "count": bad_ds + bad_de},
        {"label": "Date de début après la date de fin", "count": order},
        {"label": "Année ≠ année de la date de début", "count": yr},
        {"label": "Coordonnées manquantes ou hors limites", "count": int(bad_coord.sum())},
        {"label": "Morts négatifs", "count": neg},
        {"label": "best ≠ somme des 4 colonnes de morts", "count": len(mismatch)},
        {"label": "Bornes incohérentes (low ≤ best ≤ high faux)", "count": len(order_bad)},
    ],
    "example": {"id": int(ex["id"]), "country": ex["country"], "year": int(ex["year"]), "best": int(ex["best"]),
                "low_before": int(ex["low"]), "high_before": int(ex["high"]),
                "low_after": int(min(ex["low"], ex["best"])), "high_after": int(max(ex["high"], ex["best"]))},
    "limits": {
        "imprecise_location": int((df["where_prec"] >= 4).sum()),
        "unclear_events": int((df["event_clarity"] == 2).sum()),
        "missing_headline_pct": round(float(miss["source_headline"] / n * 100), 1),
        "missing_adm2_pct": round(float(miss["adm_2"] / n * 100), 1),
    },
}
json.dump(quality, open("docs/data/quality.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
