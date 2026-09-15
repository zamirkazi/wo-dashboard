# Canyon Woods Capital Desk — JV equity response tracker

Live response tracking for the institutional JV equity raise on **Canyon Woods**
(401 Canyon Woods Place, San Ramon, CA — 192 units, $71M, $30.96M equity need).

Tracks every reply to GMass campaign `53043162`, subject
*"Bay Area MF JV Equity 18% Lease Trade Out"*, sent 26 Aug 2026 to 451 recipients.

Served at `/jv-tracker` (the work-order dashboard keeps `/`).

## What it shows

| Section | Answers |
|---|---|
| Where the raise stands | Headline read + five KPIs against the $30.96M requirement |
| Coverage | 534 on list → 451 sent → 434 delivered → 68 replied → 22 still live |
| Priority queue | The open conversations, grouped by what the partner asked for, each with a next action and a per-browser "handled" tick |
| Reply arrival | Replies per hour since the send |
| Response ledger | Every reply, filterable by stage and searchable |
| Why they passed | Stated objections tallied across the declines |
| List hygiene | Silent addresses, undeliverables, and the contact corrections recipients asked for |

All counts on the page are computed from `replies.json` — nothing is hardcoded,
so an hourly refresh updates the prose along with the numbers.

## Reply stages

Assigned from the text of each reply, ordered hottest first:

- `meeting` — already talking
- `materials` — asked for the deck, model or OM
- `question` — asked something answerable; the thread continues
- `conditional` — interested at a different size or structure (co-GP, pref, partial check)
- `referred` — routed to the colleague who covers West Coast multifamily
- `relationship` — not about the deal, still worth a reply
- `pass` — declined
- `outofscope` — not an LP equity provider

The first four count as **live**.

## Rebuilding

```bash
cd jv-tracker/src
python3 build.py          # -> ../index.html
```

`build.py` stitches `head.html` + the data blob + `tail.html` into a single
self-contained file and stamps `generatedAt`. No dependencies, no build step,
no CDN scripts — fonts come from Google Fonts, everything else is inline.

## Refreshing the data

The send list is fixed (the campaign is complete: 451 sent, 0 remaining), so an
hourly refresh only needs to re-read replies:

```bash
cd jv-tracker/src
# 1. add any new replies to replies.json (see below)
python3 gen_data.py       # rebuilds data_fragment.js and asserts the reconciliation
python3 build.py          # -> ../index.html
```

1. Search Gmail for `in:inbox subject:"Bay Area MF JV Equity 18% Lease Trade Out"`.
2. For any thread not already in `src/replies.json`, add an entry:
   `firm`, `person`, `email`, `stage`, `ts` (UTC ISO), `quote`, `action`, `tags`.
3. If the reply came from a CC'd colleague rather than the person mailed, add
   `mailedTo` with the address that was actually sent to — `gen_data.py` uses it
   to reconcile against the send list, and 12 of the current replies need it.

`recipients.txt` holds all 451 primary send addresses. `gen_data.py` asserts the
reconciliation on every run, so a mis-keyed address fails loudly instead of
quietly inflating the silent count. Current split: **68 replied + 7 dead + 376
silent = 451**.

## Data notes

- **Delivery counts** (sent, bounces, blocks, opens) come from the GMass campaign
  report generated 27 Aug 02:13 UTC.
- **Reply counts** are read straight from the mailbox, so they run ahead of the
  GMass figure — GMass recorded 43 replies at report time; the mailbox now holds 49.
- **Opens are understated.** Institutional gateways strip the tracking pixel;
  49 firms replied against 43 recorded opens.
- Firms that replied from a different address than the one mailed (CC'd
  colleagues, alternate domains) are aliased back to the send address in
  `build.py`'s reconciliation so the totals stay exact.
