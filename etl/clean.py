"""Step 3: clean the raw GED CSV and add columns. Writes data_clean.csv (ignored by git)."""
import pandas as pd

KEEP = ["id", "year", "type_of_violence", "conflict_new_id", "conflict_name", "dyad_name", "side_a", "side_b",
        "country", "region", "adm_1", "latitude", "longitude", "where_prec", "event_clarity",
        "date_start", "date_end", "deaths_a", "deaths_b", "deaths_civilians", "deaths_unknown", "best", "low", "high"]
LABELS = {1: "Conflit étatique", 2: "Non étatique", 3: "Violence unilatérale"}

df = pd.read_csv("GEDEvent_v26_1.csv", usecols=KEEP, low_memory=False)
before = len(df)

for c in ["date_start", "date_end"]:
    df[c] = pd.to_datetime(df[c], errors="coerce")
bad_dates = int(df[["date_start", "date_end"]].isna().any(axis=1).sum())
df = df.dropna(subset=["date_start", "date_end"])

# Step 2 found only one problem: low/high on the wrong side of best (5,075 rows).
bad = ~((df["low"] <= df["best"]) & (df["best"] <= df["high"]))
fixed_bounds = int(bad.sum())
df["low"] = df[["low", "best"]].min(axis=1)
df["high"] = df[["high", "best"]].max(axis=1)

df["decade"] = (df["year"] // 10) * 10
df["month"] = df["date_start"].dt.month
df["total_deaths"] = df["best"]
df["civilian_share"] = (df["deaths_civilians"] / df["best"]).where(df["best"] > 0)
df["type_label"] = df["type_of_violence"].map(LABELS)

assert df["id"].is_unique and df["type_label"].notna().all()
assert ((df["low"] <= df["best"]) & (df["best"] <= df["high"])).all()

df.to_csv("data_clean.csv", index=False)
print(f"rows before: {before:,}  rows after: {len(df):,}")
print(f"unparseable dates dropped: {bad_dates}")
print(f"low/high bounds corrected: {fixed_bounds:,}")
print(f"columns: {df.shape[1]}  values: {df.size:,}")
assert len(df) >= 100_000 and df.size >= 700_000
