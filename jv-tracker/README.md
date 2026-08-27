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
| Coverage | 534 on list → 451 sent → 434 delivered → 49 replied → 18 still live |
| Priority queue | The 18 open conversations, grouped by what the partner asked for, each with a next action and a per-browser "handled" tick |
| Reply arrival | Replies per hour since the send |
| Response ledger | All 49 replies, filterable by stage and searchable |
| Why they passed | Stated objections tallied across the 25 declines |
| List hygiene | 394 silent, 17 undeliverable, and the contact corrections recipients asked for |

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

1. Search Gmail for `in:inbox subject:"Bay Area MF JV Equity 18% Lease Trade Out"`.
2. For any thread not already in `src/replies.json`, add an entry:
   `firm`, `person`, `email`, `stage`, `ts` (UTC ISO), `quote`, `action`, `tags`.
3. Regenerate `src/data_fragment.js` (recipients + campaign + deal are static;
   only `replies` changes), then run `build.py`.

`recipients.txt` holds all 451 primary send addresses and reconciles exactly:
49 replied + 8 dead + 394 silent = 451.

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
