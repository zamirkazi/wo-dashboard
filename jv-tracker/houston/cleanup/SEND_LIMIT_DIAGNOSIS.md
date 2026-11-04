# Why zamir@zmrcapital.com cannot send — 4 Nov 2026

## It is not the 2,000/day quota

GMass reports the rolling 24-hour count at each moment it hit the wall:

| When (UTC) | GMass batch | 24h total at that moment | Result |
|---|---|---|---|
| 3 Nov 14:24 | 160 | **1,060** | limit hit |
| 4 Nov 15:34 | 60 | **950** | limit hit |
| 4 Nov 19:38 | 10 | **620** | limit hit |

Volume is *falling* and Gmail is still refusing. GMass says it outright:

> "You may be below your Gmail account's official sending limits, even
> though Gmail has started bouncing your emails."

This is a reputation throttle. Gmail has lowered the effective ceiling
to somewhere under 620/day because of the bounce and complaint profile.
Waiting for old sends to age out does not raise it.

## GMass is tripping it, and personal email is collateral

Every manual block is in the same minute as a GMass batch:

| GMass batch | Zamir's blocked sends |
|---|---|
| 3 Nov 14:23–14:24, 160 emails | 10 first-touch sends, 14:23:11–14:24:36 |
| 4 Nov 15:24–15:34, 60 emails | 9 Houston chases, 15:33:20–15:34:41 |
| 4 Nov ~19:36–19:38, 10 emails | 8 retries, 19:38 |

Three for three.

## Campaigns still live

- **54123079** — "Houston Multifamily LP Equity", Rest of SFO sheet.
  1,983 addresses, ~983 still unsent. Speed 500/day.
- **54160326** — auto follow-up Stage 2 on campaign 54069404.
  214 addresses, **152 remaining**, paused twice for limits already,
  **auto-resumes 2026-11-05 07:16 PST / 15:16 UTC**. Speed **1,950/day**.
- Stage 1 auto follow-ups on both families (618 and 245 recipients
  reported 4 Nov).

Auto follow-ups fire on their own schedule. Stopping new campaigns is
not enough; the stages have to be paused too.

## Suppression was never loaded

Every campaign report reads:

```
Suppressed addresses manually entered: 0
Unsubscribes removed: 0
Bounces removed: 1
```

One bounce removed, against 183 catalogued dead addresses and 53 dead
domains in `DO_NOT_SEND.csv` / `SUPPRESS_DOMAINS.txt`. That bounce rate
is what is driving the throttle.

## What actually fixes it

1. Pause 54160326 before 07:16 PST tomorrow or it re-trips the block
   before any real email goes out.
2. Pause 54123079 and both Stage 1 follow-ups.
3. Drop sending speed from 1,950/day.
4. Load DO_NOT_SEND.csv (242) and SUPPRESS_DOMAINS.txt (53) into GMass.
5. Structural: route the blast through external SMTP in GMass
   (gmass.co/g/unlimited-sending) so it stops consuming the Gmail
   reputation that personal email depends on.
6. Until then, urgent mail goes from kevin@, chip@ or mregan@, or by phone.
