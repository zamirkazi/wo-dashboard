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

## The auto follow-ups are the root cause, not just the collision

Two campaigns were launched with auto follow-up Stages 1 and 2 enabled.
The stages fire days later, on their own, with no human in the loop:

| Original campaign | Sent | Stage 1 | Stage 2 |
|---|---|---|---|
| **54006506** Depreciation, fo_SEND (634 family offices), 27 Oct | 634 | 618 (30 Oct) | 604 (2 Nov) |
| **54069404** +LTO, houston_gmass_send_v5 (286 PE firms), 30 Oct | 286 | 245 (2 Nov) | 213 — **152 still queued** |

Three sends to the same 634 family offices removed **30 people in total**.
Every report says the same thing:

```
Unsubscribes removed: 0
Bounces removed: 2
Suppressed addresses manually entered: 0
```

**Zero unsubscribes honoured, on every stage, on every campaign.** The
follow-ups re-mail everyone: people who replied, people who passed,
people who asked to be removed, and 183 addresses known to be dead.

That is the reputation signal. Affinius passed, then got the 4 Nov
Stage 2 batch (sent 15:24-15:34) and objected a second time minutes
later with Craig Solomon and Jeff Fastov copied. Connelly filed a CASL
complaint on 27 Oct and was mailed again on 2 Nov by Stage 2. Neither
was a human mistake - both were auto follow-ups.

Supporting numbers from the Depreciation Stage 2 report: 3.31% open
rate, 2.32% hard blocks by receiving servers. That is what a throttled
sender looks like from the outside.

## What actually fixes it

1. Pause 54160326 before 07:16 PST tomorrow or it re-trips the block
   before any real email goes out. 152 queued.
2. **Turn auto follow-up OFF on 54006506, 54069404 and 54123079.**
   Pausing a scheduled batch does not disable the stage behind it.
3. **Check whether 54123079 has follow-ups configured.** It holds 1,983
   addresses. If Stages 1 and 2 are on, roughly 4,000 more sends are
   already queued to fire automatically.
4. Turn on "skip recipients who replied" and point GMass at the
   unsubscribe list, or every future stage repeats this.
5. Drop sending speed from 1,950/day.
4. Load DO_NOT_SEND.csv (242) and SUPPRESS_DOMAINS.txt (53) into GMass.
5. Structural: route the blast through external SMTP in GMass
   (gmass.co/g/unlimited-sending) so it stops consuming the Gmail
   reputation that personal email depends on.
6. Until then, urgent mail goes from kevin@, chip@ or mregan@, or by phone.
