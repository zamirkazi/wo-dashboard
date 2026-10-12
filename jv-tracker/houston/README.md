# Allen Genoa Capital Desk

JV equity response tracker for **Smart Living Allen Genoa** — 252 units, 2023 build,
1514 Allen Genoa Rd, Southeast Houston. $34.0M / $134,921 per door, $11.65M LP equity
at 90/10, targeting a January 2027 close.

Open `index.html`. No build step to view it, no server, no dependencies.

## How it differs from the Canyon Woods tracker

Canyon Woods ran as two GMass campaigns against bought lists, so that dashboard is
organised by campaign and reconciles sends, opens and bounces. Allen Genoa has no
blast at all — every name came through one of three people — so this one is organised
by **channel**:

| Channel | Owner | State |
|---|---|---|
| ZMR direct | Zamir / Kevin / Chip | 9 firms, 7 replies |
| Andrew Kirsh | Sklar Kirsh LLP | 15 firms, 4 replies relayed |
| Jeremy Slocumb | IPA Capital Markets | cleared to send 7 Oct, no send confirmed |

The headline finding the page is built around: of the passes received, almost all cite
**Houston** — exposure, sentiment or submarket — rather than the basis, vintage, check
size or returns. That is the mirror image of Canyon Woods, where geography, vintage,
check size and return threshold were the blockers. Sabal called the asset quality
"there", Parse called the basis "strong", Green Pine called it "a good deal"; all three
passed on the market.

## Rebuilding after new replies land

```
cd src
python3 build_houston.py     # writes ../index.html
node shot.js                 # screenshots light + dark, reports JS errors
node shot2.js                # exercises channel switcher, filters, search, persistence
```

`build_houston.py` lifts the `<style>` block verbatim from the Canyon Woods
`jv-tracker/src/head.html`, so both desks share one design system — change the theme
there and both pick it up.

## Sources of record

| File | Holds |
|---|---|
| `src/deal.json` | Deal spec as marketed |
| `src/outreach.json` | Every firm contacted, by channel, plus carve-outs and pre-send exclusions |
| `src/replies.json` | Every reply: stage, verbatim quote, objection tags, next action |
| `src/body.html` | Page structure |
| `src/app.js` | Rendering and interaction |

`build_houston.py` asserts that `outreach.json` and `replies.json` agree — every firm
marked `replied` must have a reply record and vice versa — and that no address appears
twice. It will not emit a page that does not reconcile.

### Stages

`reviewing`, `conditional`, `meeting`, `materials`, `question` are live.
`pass`, `referred`, `relationship`, `outofscope` are closed.

### Objection tags

Split into two families, which is what the "Market, not deal" panel measures:

- **Houston itself** — `houston-exposure`, `houston-sentiment`, `submarket-demographics`, `strategy-mismatch`
- **This deal's economics** — `going-in-yield`, `negative-leverage`, `unit-size`, `partner-conflict`

All data came from the Gmail thread record, not a CRM: the ZMR direct thread
("Sub-$135K/Door on a 2023 Houston Build"), Kirsh's "Equity Opp - 252 units, 2023 built
- Houston" forwards, the IPA "Houston" thread, and the Allen Genoa debt thread.
