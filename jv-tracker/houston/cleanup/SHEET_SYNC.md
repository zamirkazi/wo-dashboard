# Sheet sync — how the three Google Sheets stay clean

## What is NOT automatic
The hourly tracker sweep updates the dashboard only (replies.json / outreach.json).
It does NOT write to the Google Sheets. Sheet sync is a separate step and must be
run explicitly, or the sheets drift from reality within hours.

Proof of drift: the first full pass ran 4 Nov ~09:30. By 16:30 the same day there
were 65 new bounces, 3 new opt-out firms and ~100 replies that the sheets did not
know about, and 462 rows still marked NOT_YET_SENT that had since been mailed.

## The three sheets

| Sheet | id | tab | status col |
|---|---|---|---|
| Rest of SFO not sent previously 600 contacts | 1wSRtycPNoAea9LKutsYAF72LqqapjvYZ_S98S4rHziI | ZMR_SFO_GMass_Grouped | O / P / Q |
| Equity List CLEANED - Master | 1jnZudxvLX0EUmsyLNFo8YQtnp2AKzNSK2mjkZKeTMBQ | CONTACTS (read this one) | M / N |
| Updated FO List 10/26/26 | 1iItGOFSTjGXISQWBonAfFLvwjS35NWbiBrWt-M-yKjg | fo_SEND | M / N |

## Status values, in precedence order
1. `OPT-OUT`  — asked to be removed. Never mail again. Also in ../DO_NOT_SEND.csv.
2. `REPLIED`  — this firm answered. Outranks a bounced colleague on the same row.
3. `DEAD`     — hard bounce. Never mail again.
4. `DEPARTED` — person has left; CLEAN_NEWCONTACT carries the successor.
5. `OOO`      — away; CLEAN_NEWCONTACT carries the cover.
6. `TOOLARGE` — address is fine, the 35MB attachment was rejected. Re-send with a link.
7. (blank)    — open.

## Running the sync
1. Sweep Gmail for new bounces and opt-outs since the last run and append to
   cleanup/BOUNCE_MASTER.csv and ../DO_NOT_SEND.csv.
2. Rebuild cleanup/classify.json from BOUNCE_MASTER.csv, REDIRECTS.csv,
   DO_NOT_SEND.csv (opt-out rows) and ../replies.json (the REPLIED set).
3. Export each sheet to CSV, recompute the whole status column, and write it back
   with one update_values call per sheet. Recomputing the full column rather than a
   delta keeps it idempotent — rerunning changes nothing.
4. For the SFO sheet only, clear any stale NOT_YET_SENT below the row the wave has
   actually reached. Count sends with:
   `in:sent subject:"Houston Multifamily LP Equity" after:<date>`

## Known gap
The sends screen against fo_SUPPRESSED.csv, which has never carried the campaign
opt-outs. Until it does, every wave re-mails everyone who asked to be removed from
the last one. Connelly Capital and Affinius Capital have each now objected twice
for exactly this reason. Loading ../DO_NOT_SEND.csv into GMass closes it.
