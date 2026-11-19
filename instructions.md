# Des données au tableau de bord — Build plan

> Course 420-T83-OQ (ETL). Graded workshop, individual. **Due 28 Nov 2026, 8:00.** 7-minute talk, 4 slides.

## How to use this file

Do **one step at a time**. When a step's **Check** passes, tick its box in the Progress list, make a commit (`git commit`), then move to the next step. Never start a step while the previous one is broken. Each step ends with a project that still works.

## Progress

- [x] Step 1 — Project setup and raw data
- [x] Step 2 — Explore and check data quality
- [x] Step 3 — Clean and enrich (the ETL script)
- [x] Step 4 — Build the aggregated tables (JSON)
- [x] Step 5 — Web deck skeleton (4 slides)
- [x] Step 6 — Slide 1: the dataset and my choice
- [x] Step 7 — Slide 2: preprocessing
- [x] Step 8 — Slide 3: the dashboard (static charts)
- [x] Step 9 — Slide 3: filters and interactivity (bonus)
- [x] Step 10 — Slide 4: methods and AI
- [ ] Step 11 — Verify numbers, polish, rehearse (7 min)
- [ ] Step 12 — Publish on GitHub Pages and prepare the backup zip

## The final result

A web presentation of **4 slides** (one HTML page, navigated with arrows or buttons) about the **UCDP Georeferenced Event Dataset (GED) v26.1**: about 500,000 events of organized violence worldwide, with 49 columns (date, country, region, type of violence, actors, deaths, coordinates…).

The question that guides everything:

> **How has organized violence evolved since 1989: who dies, where, and in what kind of conflict?**

- **Slide 1** — the dataset (source, size, key columns) and why I chose it.
- **Slide 2** — the quality checks, the fixes, one before/after example, the remaining limits.
- **Slide 3** — a real BI dashboard: KPI row + 6 linked charts, with filters (year range, region, type of violence, click a country on the map). The filters are the **bonus** and are shown during the 7 minutes. Chart 2 is a **3D rotating globe**: wherever conflicts happened, a **tower** rises from the surface. The more events in that zone, the **taller** the tower; the more deaths, the **redder** it is. Hover a tower to see the number of events, the first and last dates, the deaths (total and civilians), the country/region, the main conflict and a small per-year mini-chart.
- **Slide 4** — tools, scripts, how AI was used and how its output was checked, what I learned.

Everything is in **French**, dark sober style, readable on a projector.

## How it works

```
GEDEvent_v26_1.csv (274 MB, NOT on GitHub)
        |
        v
  etl/clean.py        read -> check -> fix types/dates -> add columns
        |
        v
  etl/aggregate.py    group by year / region / country / type / conflict
        |
        v
  docs/data/*.json    small files (a few hundred KB)
        |
        v
  docs/index.html     4 slides + Plotly.js charts + filters
        |
        v
  GitHub Pages link   (+ zip backup of docs/)
```

Python does the heavy work once. The browser only loads small summaries, so the page is fast.

## Technical choices

| Topic | Choice | Why |
|---|---|---|
| Dataset | UCDP GED v26.1 (CSV) | Already in the project; ~500k rows × 49 columns, well above 100k × 10 and 700k values after cleaning |
| Scope | All years (1989 to latest), all events, no sampling | Full coverage; strongest story about evolution; nothing to justify |
| Question | Evolution of lethality + who dies (civilians vs combatants) + where (geography) | Covers time, victims and place in one story |
| ETL language | Python 3 + pandas | Already installed; simple for CSV work |
| Data to the page | Pre-aggregated JSON | Browser cannot handle 500k rows comfortably |
| Slides format | Web (HTML), 4 views | Allows interactivity and the bonus |
| Charts | Plotly.js (CDN, pinned version) | Maps, heatmaps, hover and zoom built in |
| 3D globe | globe.gl (CDN, pinned version), rotating globe with towers | Real 3D earth, mouse rotation and hover built in; no framework needed |
| Tower zone | Grid cells of about 100 km (lat/lon rounded to 1°) | Shows real hot zones, not just whole countries |
| Tower height / color | Height = number of events; color = deaths (yellow to dark red) | Two facts at a glance: "how many conflicts" and "how deadly" |
| Globe hover | Events, first/last date, deaths (total + civilians), country/region, main conflict, per-year mini-chart | What was asked: counts, dates, deaths |
| Globe and filters | Reacts to year range, region and violence type | Same filters as the other charts |
| Bonus | Filters built into slide 3 (year slider, region, violence type, click country) | Shown inside the 7 minutes, as the assignment requires |
| Cleaning level | Verify + light fixes | The Tabalyst report showed decent quality; fix only what the checks find |
| Language | French | Course language |
| Style | Dark, sober, one accent color | Readable on a projector, fits a serious topic |
| Raw CSV | In `.gitignore`; README links to the download page | File is 274 MB; GitHub limit is 100 MB |
| Delivery | GitHub Pages link + zip of `docs/` as backup | Link for peers, file in case of access problems |

### Folder layout (target)

```
projet-etl-data/
├── instructions.md          <- this file
├── instructionprof.md       <- the professor's assignment
├── README.md                <- how to rebuild, where to download the CSV
├── .gitignore               <- ignores *.csv
├── GEDEvent_v26_1.csv       <- raw data (local only)
├── reports/                 <- Tabalyst report (already there)
├── etl/
│   ├── explore.py           <- Step 2 quality checks
│   ├── clean.py             <- Step 3
│   └── aggregate.py         <- Step 4
├── notes/
│   └── quality_log.md       <- numbers + examples for slide 2
└── docs/                    <- the website (GitHub Pages serves this)
    ├── index.html
    ├── style.css
    ├── app.js
    └── data/*.json
```

## Rules for building

1. **One step = one commit.** Small, clear message. Push after each step.
2. **Never commit the raw CSV.** Check `git status` before every commit.
3. **Privacy and security:** the data is public and contains no personal information about private people (event descriptions and news headlines only). No passwords, tokens or personal data in the repo. Load libraries only from a trusted CDN with a **pinned version**.
4. **Keep it simple.** No framework, no build tool. Plain HTML, CSS, JavaScript and one Python library (pandas).
5. **Every number on a slide must come from the script**, never typed by hand. If a number changes, rerun the script.
6. **Understand everything you show.** You must be able to explain each chart, each calculation and each AI-assisted part.
7. **Be honest about limits** (see Step 11): the data only counts events UCDP could verify, deaths are estimates, and so on.
8. **Readability over quantity.** Each chart must answer a different question. Minimum text size must be readable from the back of a room.

## Steps

### Step 1 — Project setup and raw data

**Goal:** a clean repo where the raw file stays local and the scripts can find it.

**Build:**
- Create the folders from the layout above (empty ones can hold a `.gitkeep`).
- Create `.gitignore` containing `*.csv` and `__pycache__/`.
- Write `README.md`: project name, the question, how to download UCDP GED v26.1 (from ucdp.uu.se/downloads), and how to rebuild (`python etl/clean.py`, then `python etl/aggregate.py`).
- Confirm pandas works: `python -c "import pandas; print(pandas.__version__)"`.

**Check:** `git status` no longer lists `GEDEvent_v26_1.csv`. `git push` works. README explains where the CSV comes from.

### Step 2 — Explore and check data quality

**Goal:** know the data and collect concrete evidence for slide 2.

**Build:** `etl/explore.py` that prints, and saves to `notes/quality_log.md`:
- Row count, column count, total number of values (rows × columns).
- Column types and the share of missing values per column.
- Duplicates on `id`.
- Date checks: `date_start` ≤ `date_end`, year in `year` matches `date_start`.
- Coordinate checks: latitude in [-90, 90], longitude in [-180, 180]; how many are missing.
- Death checks: `best` equals `deaths_a + deaths_b + deaths_civilians + deaths_unknown`; `low ≤ best ≤ high`; no negative values.
- Category values: `type_of_violence` (1 state-based, 2 non-state, 3 one-sided), `region`, `where_prec`, `event_clarity`.
- Save **2 or 3 real example rows** that show a problem (for the before/after).

**Check:** `notes/quality_log.md` exists with real counts and example rows. If nothing needs fixing in some area, the log says so with the number that proves it.

### Step 3 — Clean and enrich (the ETL script)

**Goal:** one reproducible script that produces a clean table.

**Build:** `etl/clean.py`:
- Read the CSV (keep only the columns the analysis uses, plus `id`).
- Convert `date_start` and `date_end` to real dates; make sure numeric columns are numbers.
- Fix only what Step 2 found (for example: unparseable dates, invalid coordinates, inconsistent death totals).
- Add useful columns: `decade`, `month`, `total_deaths` (= `best`), `civilian_share`, readable French labels for `type_of_violence` (Conflit étatique / Non étatique / Violence unilatérale).
- Save the result to a local file (for example `data_clean.parquet` or `.csv`, in `.gitignore`).
- Print a summary: rows before, rows after, rows changed per rule.

**Check:** the script runs from start to finish; rows after ≥ 100,000; values after cleaning ≥ 700,000 (rows × kept columns, count it and print it). Rerunning gives the same result.

### Step 4 — Build the aggregated tables (JSON)

**Goal:** small files with everything the dashboard needs.

**Build:** `etl/aggregate.py` writing to `docs/data/`:
- `by_year_region_type.json` — events, deaths, civilian deaths per year × region × violence type (this single table feeds almost every chart and every filter).
- `by_country_year.json` — events and deaths per country × year (for the map and click filter).
- `top_conflicts.json` — deaths and events per conflict, with region and type.
- `deaths_split.json` — deaths side A / side B / civilians / unknown per type × year.
- `grid_cells.json` — for the globe: one row per grid cell (lat/lon rounded to 1°) × year × violence type, with events, deaths, civilian deaths, plus per cell: country, region, main conflict (most deaths), first and last event date. Compact format (arrays, short keys). Must stay under about 3 MB; if bigger, drop cells with fewer than 2 events overall or round deaths.
- `meta.json` — totals, date range, row counts, generation date.

**Check:** total deaths in the JSON equals the total in the clean table (script asserts it), and the sum of events and deaths over all globe cells equals the same totals. Each file is under about 2 MB (`grid_cells.json` under about 3 MB). Open one JSON and read it: the keys are understandable.

### Step 5 — Web deck skeleton (4 slides)

**Goal:** an empty but working 4-slide page.

**Build:** `docs/index.html`, `style.css`, `app.js`: 4 full-screen sections, arrow-key and button navigation, slide counter, dark theme with a color palette defined once in CSS variables, Plotly.js and globe.gl loaded from a CDN with pinned versions, JSON loaded with `fetch`.

**Check:** open the page through a local server (`python -m http.server` inside `docs/`); you can move through 4 slides; the console shows no error and the JSON files load.

### Step 6 — Slide 1: the dataset and my choice

**Goal:** the audience understands the data and the question in 30 seconds.

**Build:** title, **my name** and project title, source (UCDP, Uppsala University, GED v26.1, link), number of records, number of fields, 5–6 key variables (date, country, region, type of violence, actors, deaths best/low/high, coordinates), why this dataset, and the guiding question. Numbers come from `meta.json`.

**Check:** every number on the slide matches `meta.json`; name and title are visible; text is readable on a projector.

### Step 7 — Slide 2: preprocessing

**Goal:** show checks, fixes, one before/after, and limits.

**Build:** a checklist of the verifications done (with counts), the main problems found, the fixes and why, one **before/after** example using a real row from `quality_log.md`, and the remaining limits (for example: coordinates are approximate for some events, deaths are estimates, `side_b` or other text fields are sometimes empty).

**Check:** each number comes from `quality_log.md`; the before/after is a real row; if a check found nothing, the slide says so with the evidence.

### Step 8 — Slide 3: the dashboard (static charts)

**Goal:** the core of the grade (40 points). A rich, readable, multi-angle dashboard.

**Build:** one screen with:
- **KPI row:** events, total deaths (best estimate), civilian share (%), countries affected, deadliest year. Each with unit and perimeter ("1989–latest, worldwide").
- **Chart 1:** deaths per year, stacked by type of violence (evolution).
- **Chart 2:** 3D rotating globe with conflict towers (geography). One tower per ~100 km grid cell; height = number of events, color = deaths. Hover shows: number of events, first and last date, deaths (total and civilians), country/region, main conflict, and a small per-year mini-chart. Drag to rotate, scroll to zoom. In this step the globe shows all data (filters come in Step 9).
- **Chart 3:** heatmap region × decade (crossing place and time).
- **Chart 4:** top 10 deadliest conflicts (comparison).
- **Chart 5:** who dies — civilians vs side A vs side B vs unknown, by type of violence (distribution).
- **Chart 6:** relationship view — events vs average deaths per event by region (intensity vs frequency).
- A short **"À retenir"** box with 3 findings that the data truly supports.

Every chart has a title, units, a legend when needed and readable axes.

**Check:** charts render with no console error; the sum shown in the KPI matches `meta.json`; the whole dashboard fits one screen at 1920×1080 without scrolling and each text stays readable; each chart answers a different question.

### Step 9 — Slide 3: filters and interactivity (bonus)

**Goal:** all charts react to the filters.

**Build:** a year range slider, a region dropdown, violence-type toggles, and click-on-tower (country) to cross-filter; the globe redraws its towers from `grid_cells.json` with the same filters; a "Réinitialiser" button. One function recomputes the KPIs and redraws the charts from the aggregated JSON.

**Check:** choose "Afrique" + 2010–2020: the KPIs and all 6 charts change, and the globe towers shrink, grow or disappear to match (the globe also turns to face the chosen region); click a tower: other charts focus on its country; the violence-type toggles also change the towers; reset restores the full view. A known case matches the clean table (for example, the 2014 total computed in pandas equals what the page shows).

### Step 10 — Slide 4: methods and AI

**Goal:** show the way of working and critical thinking (20 points).

**Build:** the tools (Python, pandas, Plotly, GitHub), what each script does (the pipeline from the "How it works" diagram), where AI (Claude) was used (planning, code, wording) and **how its results were checked** (counts compared with pandas, assertions in the scripts, manual look at example rows), the key decisions (keep all years, light cleaning, aggregate before the browser), and what I learned.

**Check:** every claim about AI use is true and can be explained orally; the slide lists at least 3 concrete verifications.

### Step 11 — Verify numbers, polish, rehearse (7 min)

**Goal:** reliable results and a talk that fits the time.

**Build:**
- Recompute 5 headline numbers independently in pandas and compare with the page.
- Write the limits to state out loud: UCDP only records events it can source; deaths are best estimates (low/high exist); reporting varies by country and era; the dataset covers organized violence, not all deaths in war (for example, indirect deaths are not counted).
- Time yourself: roughly 1 min slide 1, 1 min slide 2, 3.5 min slide 3 (include the filter demo), 1.5 min slide 4. Rehearse at least twice.

**Check:** the 5 numbers match; the talk lasts 7 min or less; you can answer "why this chart?" for each one.

### Step 12 — Publish on GitHub Pages and prepare the backup zip

**Goal:** a working link and a backup file, well before the deadline.

**Build:** push to GitHub; in the repo settings, turn on Pages from the `main` branch, folder `/docs`; open the public link in a private window; create `deck_backup.zip` from `docs/` and test that it opens locally.

**Check:** the link opens on another device, charts display, filters work. The zip works offline except for the CDN (note this, or download Plotly into `docs/` to make the zip fully offline). Link and file are ready for submission **before 28 Nov 2026, 8:00**.

## Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| `git push` rejected, file too large | The CSV was added to a commit | Add `*.csv` to `.gitignore`, `git rm --cached GEDEvent_v26_1.csv`, amend or recommit |
| pandas runs out of memory | Reading all 49 columns | Use `usecols=` to read only needed columns and set `dtype` |
| Dates become text or `NaT` | Format `YYYY-MM-DD 00:00:00.000` not parsed | `pd.to_datetime(..., errors="coerce")`, then count the `NaT` |
| Page is blank locally | `fetch` blocked on `file://` | Use `python -m http.server` in `docs/` |
| Charts empty on GitHub Pages | Wrong relative path or case-sensitive file name | Use relative paths like `data/meta.json`, check capitalisation |
| Globe is slow or laggy | Too many towers | Use bigger cells or hide cells with very few events |
| One tower dwarfs all others | Linear height scale | Use a square-root scale for the height and cap the maximum |
| Globe blank | WebGL off or CDN blocked | Test in another browser; keep a flat Plotly map as fallback |
| Wrong tower positions | Latitude and longitude swapped | Latitude first, longitude second; check one known city |
| Dashboard too crowded | Too many elements | Remove or merge charts; keep only those with a distinct message |
| Talk longer than 7 min | Too much on slides 1, 2 | Cut text; spend time on slide 3 |
| Totals differ between page and pandas | Filter logic or double counting | Compare per year; add assertions in `aggregate.py` |

## Glossary

- **ETL** — Extract, Transform, Load: read data, clean and reshape it, then store or use it.
- **UCDP GED** — Uppsala Conflict Data Program, Georeferenced Event Dataset: one row per event of organized violence.
- **Event / record** — one row of the table (one violent event with date, place and deaths).
- **Field / column** — one property of an event (country, date, deaths…).
- **State-based conflict** — a government fights an organized armed group (type 1).
- **Non-state conflict** — two armed groups fight each other, none is the government (type 2).
- **One-sided violence** — an armed group deliberately kills civilians (type 3).
- **Best / low / high** — best estimate of deaths, and the lower and upper bounds.
- **Aggregation** — summing or counting many rows into a smaller summary (for example, deaths per year).
- **KPI** — Key Performance Indicator: a headline number (total deaths, share of civilians…).
- **BI dashboard** — one screen that combines KPIs and charts to understand a topic from several angles.
- **Globe / tower** — a 3D rotating Earth; each tower stands on a zone where conflicts happened, taller = more events.
- **Grid cell** — a square zone of about 100 km (coordinates rounded to 1°) that groups nearby events into one tower.
- **WebGL** — the browser technology that draws 3D graphics; globe.gl uses it.
- **Heatmap** — a grid where color shows the size of a value (here region × decade).
- **JSON** — a simple text format for structured data that the browser reads easily.
- **Plotly.js** — a JavaScript library that draws interactive charts.
- **CDN** — a public server that hosts libraries so a page can load them by link.
- **GitHub Pages** — free hosting of a website from a GitHub repository.
- **Before/after** — a real example showing a row before and after a cleaning step.
