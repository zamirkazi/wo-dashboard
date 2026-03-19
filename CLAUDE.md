# CLAUDE.md — Work Order Analytics Dashboard
## Implementation Guide for Claude Code

> This file tells you everything you need to build, deploy, and maintain the portfolio work order analytics dashboard on GitHub + Vercel. Read this entire file before writing a single line of code.

---

## Project Overview

A single-file, fully interactive HTML dashboard that analyzes **5,381 work orders** across **18 multifamily residential properties** (Sep 2025–Feb 2026). No backend, no database, no build step. All data is embedded directly in the HTML as JavaScript objects.

**Stack:** Pure HTML + CSS + JavaScript + Chart.js (CDN). Zero dependencies to install.

**Live URL target:** Deployed via Vercel, auto-deploys from GitHub on every push.

---

## What You Are Building

```
wo-dashboard/
├── index.html          ← The entire dashboard (163KB, all-in-one)
├── vercel.json         ← Vercel static deployment config
├── README.md           ← Team user guide (auto-renders on GitHub)
└── CLAUDE.md           ← This file (Claude Code reads this)
```

The `index.html` file IS the application. Everything — data, charts, styles, interactivity — lives in that one file.

---

## Step 1: Create the GitHub Repository

```bash
# 1. Create a new directory
mkdir wo-dashboard && cd wo-dashboard

# 2. Initialize git
git init

# 3. Create .gitignore
echo ".DS_Store\nnode_modules/\n.vercel/" > .gitignore

# 4. Add all project files (index.html, vercel.json, README.md, CLAUDE.md)
git add .
git commit -m "Initial commit: WO Analytics Dashboard"

# 5. Create GitHub repo (requires GitHub CLI - gh auth login first)
gh repo create wo-dashboard --public --push --source=.

# OR manually: go to github.com/new, create repo, then:
# git remote add origin https://github.com/YOUR_USERNAME/wo-dashboard.git
# git branch -M main
# git push -u origin main
```

---

## Step 2: Configure Vercel Deployment

### vercel.json (already provided — do not modify)
```json
{
  "version": 2,
  "builds": [
    { "src": "index.html", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=3600" }
      ]
    }
  ]
}
```

### Connect to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import from GitHub → select the `wo-dashboard` repository
3. Framework Preset: **Other** (it's a static site)
4. Root Directory: `/` (default)
5. Click **Deploy**
6. Your URL will be: `https://wo-dashboard.vercel.app` (or similar)

**Auto-deploy is automatic:** Every `git push` to `main` triggers a new Vercel deployment. No manual steps needed after initial setup.

---

## Step 3: Custom Domain (Optional)

If you want a custom domain like `maintenance.yourcompany.com`:
1. Vercel Dashboard → your project → Settings → Domains
2. Add your domain
3. Follow the DNS instructions (add a CNAME record pointing to `cname.vercel-dns.com`)

---

## Dashboard Architecture

### Navigation Structure (9 sections, single-page)
```
📊 Portfolio     → Overview KPIs, monthly trends, category/property charts
🔧 Subcategories → Granular breakdown by repair type (Toilet, Washer, AC, etc.)
↔ Compare        → Side-by-side cross-property comparison (4 view modes)
🏠 Make Ready    → Unit turn tracking and vacancy cost analysis
⚠️ Mold & Safety → Full mold/mildew log, smoke detector compliance
🚨 Priority      → Emergency vs High vs Medium vs Low response analysis
🏢 Scorecard     → All 18 properties ranked across all metrics
🏘 Asset Drill-Down → Per-property deep dive with dropdown selector
📣 Reviews       → Review improvement action plan
```

### Key JavaScript Objects (embedded in index.html)

**`PROP_DATA`** — Per-property analytics for all 18 assets. Structure:
```javascript
{
  "45728": {
    name: "Skye Oaks",
    pid: "45728",
    total: 186,           // total work orders
    completed: 186,       // WOs with completion dates
    avg: 0.43,            // average completion days
    median: 0.25,
    p24: 88.2,            // % completed within 24 hours
    p48: 98.9,
    p72: 99.5,
    slow: 0,              // WOs taking 7+ days
    slow_pct: 0.0,
    mold_count: 0,
    mold_wos: [],         // array of mold WO objects
    monthly: {            // monthly breakdown
      "2025-09": { avg: 0.84, p24: 50.0, vol: 10 },
      // ... through 2026-02
    },
    cats: [               // category breakdown (sorted by count desc)
      { name: "Appliances", count: 53, avg: 0.6, p24: 79.2, slow: 0 },
      // ...
    ],
    subs: [               // subcategory breakdown (top 20, sorted by count)
      { name: "AC/HVAC", count: 18, avg: 0.23, p24: 100.0, slow: 0 },
      // ...
    ],
    prio: {               // priority level breakdown
      "High": { count: 70, avg: 1.35, p24: 71.4 },
      // ...
    },
    slow_cats: {          // categories with 7+ day WOs
      "Appliances": 7,
      // ...
    },
    keywords: {           // recurring words in WO descriptions
      "door": 47, "ac": 35
    }
  }
}
```

**`compareData`** — Side-by-side subcategory comparison data. Structure:
```javascript
{
  "AC/HVAC": {
    props: ["RAM","45726","45729",...],    // property IDs (ordered by volume)
    ct: [83, 74, 48, ...],                // WO count per property
    avg: [0.95, 1.29, 2.20, ...],         // avg days per property
    p24: [78.3, 60.8, 50.0, ...]          // % in 24h per property
  },
  "Toilet": { ... },
  "Washer": { ... },
  // 10 subcategories total
}
```

**`PLABELS`** — Property ID to display name mapping:
```javascript
{
  "RAM": "RAM Preserve at Riverwalk",
  "JULIA": "The Julia",
  "45703": "SKYE at Hunters Creek",
  "45708": "SKYE Isle",
  "45709": "Chimney Hill",
  "45710": "Skye at Love",
  "45711": "Skye Ridge",
  "45713": "Nightingale on 25th",
  "45715": "Ninety-Nine44 on Walnut",
  "45716": "Parks at Walnut",
  "45718": "Skye at Conway",
  "45720": "Skye Reserve",
  "45724": "Upland Townhomes",
  "45725": "The Park at Peachtree Hills",
  "45726": "The Boardwalk",
  "45727": "The Flats",
  "45728": "Skye Oaks",
  "45729": "Hanley Place"
}
```

---

## Data Sources

### Source Files (original Excel data)
| File | Properties | WOs | Date Range |
|---|---|---|---|
| `RAM_Preserve_at_Riverwalk_Work_Orders_Categorized.xlsx` | RAM Preserve | 446 | Sep 25–Feb 26 |
| `The_Julia_Work_Order_History_Categorized.xlsx` | The Julia | 888 | Sep 25–Feb 26 |
| `RPM_Work_Orders_By_Property.xlsx` | 16 RPM properties | 4,047 | Sep 25–Feb 26 |

### Data Notes
- **The Julia** has no completion dates in the source file — only submission dates. All `avg`, `p24`, `p48`, `p72` metrics are `null` for this property.
- **SKYE Isle (45708)** has only 1 WO. Stats shown but flagged as low-volume.
- **Chimney Hill (45709)** has only 4 WOs (2 with completion dates). Low volume.
- **Mold data** is derived from subcategory field values AND keyword matching in brief descriptions.

### How Data Was Extracted
All analytics were computed with Python/pandas from the source Excel files. The pipeline:
1. Parse all three Excel files into a unified pandas DataFrame
2. Normalize subcategory names across different property management systems
3. Compute per-property stats: avg days, % thresholds, slow WO counts
4. Compute monthly breakdowns
5. Identify mold/mildew/safety WOs via keyword matching
6. Serialize to JavaScript object literals embedded in `index.html`

To update the data when new Excel exports are available, re-run the Python analysis and replace the `PROP_DATA` and `compareData` objects in `index.html`.

---

## Chart Library

All charts use **Chart.js 4.4.1** loaded from Cloudflare CDN:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
```

No other JavaScript dependencies. No npm. No build step.

---

## Asset Drill-Down — How It Works

The asset drill-down (`page-asset`) is driven entirely by `PROP_DATA`. When a user selects a property from the dropdown:

1. `loadProp(pid)` is called
2. KPI strip updates (total WOs, avg days, % in 24h, slow WOs, mold count, vs portfolio)
3. All 7 tabs are rebuilt: Trends, Categories, Subcategories, Speed Analysis, Priority, Recurring Issues, Safety
4. Charts are rendered using Chart.js into `<canvas>` elements
5. Tables are built via DOM innerHTML injection

Each tab has its own builder function:
- `buildTrends(p)` — line/bar charts from `p.monthly`
- `buildCats(p)` — 4 charts + table from `p.cats`
- `buildSubs(p)` — 4 charts + table from `p.subs`
- `buildSpeed(p)` — speed distribution vs portfolio comparison
- `buildPrio(p)` — priority breakdown charts + table from `p.prio`
- `buildIssues(p)` — keyword viz + slow category chart from `p.keywords` + `p.slow_cats`
- `buildSafety(p)` — mold log + safety checklist from `p.mold_wos`

---

## Compare Page — 4 View Modes

The compare page (`page-compare`) lets users pick a subcategory and switch between views:

| Mode | Function | Best For |
|---|---|---|
| Bar Charts | `renderCompare(cat)` | Quick visual comparison of speed + 24h rate |
| Data Table | `renderTableView(cat)` | Precise numbers + letter grades |
| Radar | `renderRadar(cat)` | Multi-dimension view of top 7 properties |
| Heat Map | `renderHeatmap()` | All properties × all subcategories at once |

---

## Key Metrics Explained

| Metric | Definition | Good | Warning | Critical |
|---|---|---|---|---|
| Avg Days | Mean (call date → completion date) for completed WOs | < 2.0 | 2–4 | > 4 |
| % in 24h | % of WOs completed within 1 calendar day | ≥ 65% | 45–65% | < 45% |
| Slow WOs | WOs taking > 7 days | 0–2% | 3–8% | > 8% |
| Median Days | Middle value (less skewed by outliers) | < 1.5 | 1.5–3 | > 3 |
| Mold WOs | WOs mentioning mold/mildew/growth in subcategory or description | 0 | 1–2 | ≥ 3 |

---

## Color System

The dashboard uses a consistent 3-tier color coding throughout:

```css
/* Performance tiers */
--green:  rgba(63,185,80,0.7)   /* Good — avg < 1.5d or p24 ≥ 65% */
--yellow: rgba(227,179,65,0.7)  /* Monitor — avg 1.5–3.5d or p24 45–65% */
--orange: rgba(230,126,34,0.7)  /* Warning — avg 3.5–5d */
--red:    rgba(248,81,73,0.8)   /* Critical — avg > 5d or p24 < 45% */
--blue:   rgba(88,166,255,0.65) /* Neutral / informational */

/* Background palette */
--bg-primary:   #0d1117
--bg-card:      #161b22
--border:       #21262d
--text-primary: #e2e8f0
--text-muted:   #6e7681
--accent-blue:  #58a6ff
```

---

## How to Update the Dashboard

### Updating data (new month of work orders)
1. Export new Excel files from property management system
2. Run the Python analysis script (or provide files to Claude and ask it to re-run the analysis)
3. Replace `PROP_DATA`, `compareData`, and portfolio-level chart data arrays in `index.html`
4. Update the date range string in the header (`pg-header p` elements)
5. `git add index.html && git commit -m "Data update: Mar 2026" && git push`
6. Vercel auto-deploys — live in ~30 seconds

### Adding a new property
1. Add the property's `pid` → name mapping to `PLABELS`
2. Add the property's data object to `PROP_DATA`
3. Add the property to the dropdown `<option>` list in `page-asset`
4. Add the property to the scorecard table in `page-scorecard`
5. Add the property to all chart data arrays (`pL`, `pA`, `p24h`, `pV`, `pSlow`, `scL`, `scA`, `scSlow`)

### Adding a new subcategory to the Compare page
1. Add a new entry to `compareData` with the subcategory name as the key
2. The `catBtns` loop in the init code auto-generates buttons from `Object.keys(compareData)`
3. No other changes needed

---

## Troubleshooting

### Charts not rendering
- Check browser console for JS errors
- Chart.js CDN may be blocked — try loading the page with network access
- Verify `<canvas>` element IDs match the `mk()` / `new Chart()` calls

### Property not showing in dropdown
- Check `PLABELS` has the property's pid
- Check `PROP_DATA` has a data object for that pid
- Verify the `<option>` value matches the pid key exactly

### Data looks wrong after update
- Confirm `avg` values are in days (decimal), not hours
- Confirm `p24`, `p48`, `p72` are percentages (0–100), not decimals (0–1)
- Check `monthly` keys are in `YYYY-MM` format

### Vercel deployment not updating
- Check Vercel dashboard for build errors
- Verify the GitHub push actually went through (`git log --oneline`)
- Manually trigger a redeploy from Vercel dashboard → Deployments → Redeploy

---

## Portfolio Summary (as of last data refresh: Feb 2026)

| Metric | Value |
|---|---|
| Total Work Orders | 5,381 |
| Date Range | Sep 2025 – Feb 2026 |
| Properties | 18 |
| Portfolio Avg Days | 3.12 |
| % Completed ≤ 24h | 53.5% |
| Best Property | Skye Oaks — 0.43 avg days, 88.2% in 24h |
| Worst Property | Hanley Place — 5.55 avg days, 164 slow WOs |
| Total Mold WOs | 32 (5 properties) |
| Critical Flag | The Julia — 9 mold WOs with no completion dates |

---

## Files Checklist

Before pushing to GitHub, confirm these files exist in your repo root:

- [ ] `index.html` — the dashboard (163KB)
- [ ] `vercel.json` — Vercel config
- [ ] `README.md` — team user guide
- [ ] `CLAUDE.md` — this file
- [ ] `.gitignore` — excludes `.DS_Store`, `node_modules/`, `.vercel/`

That's all you need. No `package.json`. No `node_modules`. No build pipeline.

---

*Built with Python/pandas (data analysis) + Chart.js 4.4.1 (visualization) + pure HTML/CSS/JS (dashboard). Data sourced from property management work order exports.*
