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

| Channel | Owner | Named | Actually sent | Replied | Drafted |
|---|---|---|---|---|---|
| ZMR direct | Zamir / Kevin / Chip | 53 | 20 | 8 | 33 |
| Andrew Kirsh | Sklar Kirsh LLP | 15 | 4 | 4 | — |
| Jeremy Slocumb | IPA Capital Markets | 7 | 0 | — | — |

On 12 Oct every name Kirsh had proposed but never mailed went out directly from Zamir,
each email opening on that firm's own last answer to us — Mountain Pacific's "$15M max"
against an $11.65M check, Machine's "20%+ IRR" against 20.3%, Mavik's "not without you
under contract" against an awarded deal. The subject line on all of them is
**"Houston 2023 Vintage $135K/door $13M Check 20%+ IRR"**, not Kirsh's original.

**Named is not sent, and the page refuses to conflate them.** Kirsh proposed sixteen
groups on 2 Oct; Zamir annotated which ones he already knew; Kirsh then sent to the four
he had no relationship with — Tramview, Mile Rock, Green Pine, Range Equity — and
stopped. All four replied. The other eleven were never mailed. Cushman & Wakefield was
offered the deal in conversation but never sent it. A firm counts as `sent` only where a
send or a reply appears in the thread record.

That makes the real coverage twelve firms, not twenty-four, and the real reply rate 92%
rather than 48% — and it makes the largest number on the page the twelve warm names
that were lined up and never received it.

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

### Where the names come from

Three sources, in order of how much they are worth:

1. **The Canyon Woods reply record** (`../src/replies.json`, 253 replies). A firm
   that passed there with a stated reason — California, 1980s vintage, a $30M
   check, a 20% IRR floor — is a firm whose single objection this deal reverses.
   Those emails open by quoting the firm back to itself.
2. **ZMR's own equity list**, `Equity_List_CLEANED (MR).xlsx` on Drive — 1,087
   contacts across 28 tabs with firm, people, titles, locations, send roles
   (PRIMARY / CC) and check-size bands. The authority for addresses, and it also
   carries `Not A Fit` and `Departures - Verify` tabs worth honouring.
3. **The mailbox**, for relationships the lists miss — a call on Fireflies, a
   question never answered, an intro someone made.

### Outcomes

| Value | Means |
|---|---|
| `replied` | Sent, and came back |
| `silent` | Sent, nothing back |
| `proposed` | Named on a channel's list, no send anywhere in the thread |
| `offered` | Mentioned to them in conversation, materials never sent |
| `excluded` | Killed before it went out |

Only `replied` and `silent` count as coverage. `proposed` and `offered` are the gap.
Kirsh-channel rows also carry `knows`, Zamir's own 3 Oct annotation of whether he has
the relationship — which is the reason each unsent name is still an intro he can make.

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
