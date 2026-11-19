"""Step 4: build small JSON summaries from data_clean.csv into docs/data/."""
import json
import os
from datetime import date

import pandas as pd

df = pd.read_csv("data_clean.csv", parse_dates=["date_start", "date_end"])
OUT = "docs/data"
TOT = int(df["best"].sum())
EV = len(df)
sizes = {}


def save(name, obj):
    path = f"{OUT}/{name}"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
    sizes[name] = os.path.getsize(path)


def table(keys):
    g = df.groupby(keys).agg(events=("id", "size"), deaths=("best", "sum"), civilian_deaths=("deaths_civilians", "sum"))
    return g.reset_index()


def check(t, name):
    assert t["events"].sum() == EV and t["deaths"].sum() == TOT, name


t = table(["year", "region", "type_label"])
check(t, "year_region_type")
save("by_year_region_type.json", t.to_dict("records"))

t = table(["country", "region", "year", "type_label"])
check(t, "country_year")
save("by_country_year.json", t.to_dict("records"))

t = table(["conflict_name", "region", "type_label", "country", "year"])
check(t, "conflicts")
save("top_conflicts.json", t.to_dict("records"))

t = df.groupby(["country", "region", "year", "type_label"]).agg(
    side_a=("deaths_a", "sum"), side_b=("deaths_b", "sum"),
    civilians=("deaths_civilians", "sum"), unknown=("deaths_unknown", "sum")).reset_index()
assert t[["side_a", "side_b", "civilians", "unknown"]].sum().sum() == TOT
save("deaths_split.json", t.to_dict("records"))

# Globe: one cell per 1 degree (~100 km). Per-cell info is computed on all data (not filtered).
df["cell"] = list(zip(df["latitude"].round(), df["longitude"].round()))
cid = {c: i for i, c in enumerate(sorted(df["cell"].unique()))}
df["cid"] = df["cell"].map(cid)
mode = lambda s: s.value_counts().index[0]
info = df.groupby("cid").agg(country=("country", mode), region=("region", mode),
                             first=("date_start", "min"), last=("date_end", "max"))
info["conflict"] = df.groupby(["cid", "conflict_name"])["best"].sum().reset_index().sort_values(
    "best", ascending=False).drop_duplicates("cid").set_index("cid")["conflict_name"]
cells = [{"id": int(i), "lat": lat, "lon": lon, "country": info.country[i], "region": info.region[i],
          "conflict": info.conflict[i], "first": str(info["first"][i].date()), "last": str(info["last"][i].date())}
         for (lat, lon), i in cid.items()]
types = ["Conflit étatique", "Non étatique", "Violence unilatérale"]
g = df.assign(t=df["type_label"].map(types.index)).groupby(["cid", "year", "t"]).agg(
    e=("id", "size"), d=("best", "sum"), c=("deaths_civilians", "sum")).reset_index()
assert g["e"].sum() == EV and g["d"].sum() == TOT
save("grid_cells.json", {"types": types, "row_keys": ["cell", "year", "type", "events", "deaths", "civilian_deaths"],
                         "cells": cells, "rows": g.values.tolist()})

save("meta.json", {
    "events": EV, "columns_raw": 49, "columns_clean": int(pd.read_csv("data_clean.csv", nrows=1).shape[1]),
    "values_clean": EV * 29, "total_deaths": TOT, "civilian_deaths": int(df["deaths_civilians"].sum()),
    "civilian_share": round(df["deaths_civilians"].sum() / TOT, 4), "countries": int(df["country"].nunique()),
    "year_min": int(df["year"].min()), "year_max": int(df["year"].max()),
    "date_min": str(df["date_start"].min().date()), "date_max": str(df["date_end"].max().date()),
    "deadliest_year": int(df.groupby("year")["best"].sum().idxmax()), "grid_cells": len(cells),
    "generated": str(date.today())})

for n, s in sizes.items():
    print(f"{n}: {s / 1e6:.2f} MB")
assert all(s < 2e6 for n, s in sizes.items() if n != "grid_cells.json") and sizes["grid_cells.json"] < 3e6
