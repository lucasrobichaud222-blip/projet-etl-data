"""Step 11: recompute headline numbers straight from the RAW csv and compare with the page's JSON."""
import json

import pandas as pd

raw = pd.read_csv("GEDEvent_v26_1.csv", usecols=["year", "country", "best", "deaths_civilians"])
meta = json.load(open("docs/data/meta.json", encoding="utf-8"))
cy = pd.DataFrame(json.load(open("docs/data/by_country_year.json", encoding="utf-8")))

checks = [
    ("événements", len(raw), meta["events"]),
    ("morts (best)", int(raw["best"].sum()), meta["total_deaths"]),
    ("part de civils (%)", round(raw["deaths_civilians"].sum() / raw["best"].sum() * 100, 1), round(meta["civilian_share"] * 100, 1)),
    ("pays", raw["country"].nunique(), meta["countries"]),
    ("année la plus meurtrière", int(raw.groupby("year")["best"].sum().idxmax()), meta["deadliest_year"]),
    ("morts en 2014", int(raw[raw["year"] == 2014]["best"].sum()), int(cy[cy["year"] == 2014]["deaths"].sum())),
]
lines = ["# Vérification des chiffres (raw CSV vs JSON de la page)\n", "| indicateur | pandas (CSV brut) | page (JSON) | ok |", "|---|---|---|---|"]
for name, a, b in checks:
    lines.append(f"| {name} | {a} | {b} | {'oui' if a == b else 'NON'} |")
    assert a == b, name
open("notes/verification.md", "w", encoding="utf-8").write("\n".join(lines) + "\n")
print("\n".join(lines))
