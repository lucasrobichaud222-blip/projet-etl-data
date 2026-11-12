# Quality log — UCDP GED v26.1

- Rows: 417,968  Columns: 49  Values (rows x columns): 20,480,432

## Types and missing values (columns with missing > 0)

| column | dtype | missing | % |
|---|---|---|---|
| conflict_dset_id | float64 | 1,511 | 0.4% |
| dyad_dset_id | float64 | 2 | 0.0% |
| side_a_dset_id | float64 | 67 | 0.0% |
| side_b_dset_id | float64 | 109 | 0.0% |
| source_article | object | 2 | 0.0% |
| source_office | object | 97,496 | 23.3% |
| source_date | object | 97,496 | 23.3% |
| source_headline | object | 97,501 | 23.3% |
| source_original | object | 45,751 | 10.9% |
| where_description | object | 11,362 | 2.7% |
| adm_1 | object | 20,297 | 4.9% |
| adm_2 | object | 73,495 | 17.6% |
| gwnoa | object | 103,110 | 24.7% |
| gwnob | float64 | 378,036 | 90.4% |

Columns with no missing values: 35 of 49

## Duplicates

- Duplicate `id`: 0

## Dates

- Unparseable date_start: 0; date_end: 0
- date_start > date_end: 0
- year != year of date_start: 0
- Range: 1989-01-01 to 2025-12-31

## Coordinates

- Missing lat: 0, lon: 0
- Out of range (incl. missing): 0

## Deaths

- best != sum of 4 death columns: 0
- Not low <= best <= high: 5075
- Negative values: 0
- Total deaths (best): 4,257,891

## Categories

**type_of_violence**

- 1: 292,121
- 3: 64,396
- 2: 61,451

**region**

- Middle East: 128,033
- Asia: 100,564
- Africa: 74,836
- Europe: 58,016
- Americas: 56,519

**where_prec**

- 1: 194,544
- 2: 101,236
- 3: 59,437
- 4: 38,531
- 5: 18,645
- 6: 5,309
- 7: 266

**event_clarity**

- 1: 387,407
- 2: 30,561

## Example rows

**best differs from sum of death columns** — 0 rows

Nothing found (0 rows).

**low <= best <= high violated** — 5075 rows

```
   id  year             country              date_start                date_end  best  deaths_a  deaths_b  deaths_civilians  deaths_unknown  low  high  latitude  longitude  where_prec
69047  1991 Serbia (Yugoslavia) 1991-08-01 00:00:00.000 1991-08-02 00:00:00.000    24         0         0                 0              24   25    24   44.0000       21.0           6
69123  1992             Croatia 1992-06-01 00:00:00.000 1992-07-31 00:00:00.000    24         0         0                 0              24   25    24   45.1667       15.5           6
71542  1989            Ethiopia 1989-01-01 00:00:00.000 1989-12-31 00:00:00.000    25         0         0                 0              25   25     0    8.0000       38.0           6
```

**invalid/missing coordinates** — 0 rows

Nothing found (0 rows).

**year != start date year** — 0 rows

Nothing found (0 rows).

**date_start > date_end** — 0 rows

Nothing found (0 rows).
