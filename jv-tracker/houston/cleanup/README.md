# List cleanup — 4 Nov 2026

What was read: every bounce, block and auto-reply Gmail holds for the three Allen Genoa
waves (family office 26 Oct, PE 29–30 Oct, Rest of SFO 3 Nov), 107 bounce threads and
~40 auto-replies opened one at a time. Six "delivery delay" notices were GMass warm-up
traffic on throwaway domains (zmrcapitalget.com, startzmrcapital.com, gozmrcapital.com,
kitzmrcapital.com, zmrcapitalkit.com, zmrcapitalmy.com, zmrcapitaltry.com) and are not
campaign traffic — ignore them.

## Files

- `BOUNCE_MASTER.csv` — 118 addresses that failed, with verdict, reason, how many times
  we sent to them anyway, which wave and which firm.
    - DEAD (108): hard failures. Never send again.
    - TOOLARGE (8): the 35MB attachment was rejected, the address is fine. Re-send with
      a link instead of the attachment.
    - SOFT (1): bill@erillc.com, mailbox full. Retry is fine.
    - TYPO (1): mitchellvoss@windmasscapital.com — the real address is
      mitchell.voss@windmasscapital.com. Already corrected and re-sent.
- `REDIRECTS.csv` — 43 people who are gone or away, with the named successor where one
  was given. 23 have left their firm outright.
- `never_sent.csv` — 10 firms whose 3 Nov email never left the outbox because Gmail hit
  its send limit. These were never contacted.
- `scan_log.csv` — raw per-address scan output.
- `familyoffice_list_CLEANED.csv`, `equity_list_CLEANED.csv` — local copies with
  CLEAN_STATUS / CLEAN_NEWCONTACT appended.

## Applied to

- Google Sheet "Rest of SFO not sent previously 600 contacts" — columns O/P/Q.
- Google Sheet "Equity List CLEANED - Master", CONTACTS tab — columns M/N.
- Google Sheet "Updated FO List 10/26/26", fo_SEND tab — columns M/N.
- `../DO_NOT_SEND.csv` 34 → 168 rows.
- `../SUPPRESS_ALL.csv` 2,370 → 2,538 addresses.
- `../SUPPRESS_DOMAINS.txt` 13 → 34 domains.

## The thing that matters most

The 3 Nov SFO wave sent 513 of 1,983 rows and stopped. It got alphabetically as far as
"Cr" before Gmail cut it off. 1,470 rows — three quarters of the list — were never
mailed. They are marked NOT_YET_SENT in the sheet.
