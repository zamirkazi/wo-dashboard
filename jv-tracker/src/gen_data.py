#!/usr/bin/env python3
"""Build data_fragment.js from replies.json + per-campaign recipient lists.

One deal, several outreach campaigns. Each reply carries a `campaign` id; each
campaign carries its own send list and delivery counts, so response rates stay
per-cohort while the priority queue pools across all of them.
"""
import json, pathlib
here = pathlib.Path(__file__).parent

R = json.loads((here/'replies.json').read_text())
# Auto-replies are not answers about the deal, so they never enter `replies` and
# never move a response rate. They are kept separately because they still carry
# two useful things: when a contact is actually back, and who has left the firm.
A = json.loads((here/'autoreplies.json').read_text()) if (here/'autoreplies.json').exists() else []

# ---- campaign definitions -------------------------------------------------
# recipients: file of primary send addresses, or None while a send is in flight.
# bad: undeliverable addresses seen in-thread -> the primary address on that thread.
CAMPAIGNS = [
    {
        "id": "institutional",
        "label": "Institutional LPs",
        "short": "Institutional",
        "subject": "Bay Area MF JV Equity 18% Lease Trade Out",
        "gmassId": "53043162",
        "sentStart": "2026-08-26T21:58:24Z",
        "sentEnd": "2026-08-26T23:04:44Z",
        "listSize": 534, "removedPreSend": 83, "sent": 451,
        "bounces": 19, "blocks": 3, "opens": 181, "clicks": 0, "unsubs": 0,
        "reportAt": "2026-08-31T20:48:07Z",
        "followUps": [
            # Both paused on Gmail's 24h limit and resumed on 31 Aug, about five hours
            # later than the 08:18 PDT the reports predicted — the 07:08 PDT reports
            # still showed 260 and 270, and by 09:12 PDT they were at 348 and 350.
            # Both variants went out together, roughly a minute apart, so the people
            # in the resumed batch did receive two follow-ups back to back.
            {"gmassId": "53073365", "sentStart": "2026-08-28T15:18:49Z",
             "sentSoFar": 348, "target": 354, "remaining": 6,
             "resumedAt": "2026-08-31T15:23:00Z", "pausedBy": "Gmail sending limit",
             "note": "just wanted to follow up on my email below"},
            # Six sends were rejected outright by Gmail on 28 Aug for being over the
            # limit. The 31 Aug resume re-sent to them — the Ranch Harbor thread shows
            # the follow-up landing at 08:37 PDT — so they are reached, not skipped,
            # and the rejection count is history rather than an outstanding gap.
            {"gmassId": "53073398", "sentStart": "2026-08-28T15:20:13Z",
             "sentSoFar": 350, "target": 354, "remaining": 4,
             "rejected": 6, "rejectedResolved": True,
             "rejectedAddrs": ["colton.creber@quadreal.com", "nietfeldt@quartzlakecap.com",
                               "jmeek@ranchharbor.com", "jim@randallcapitalgroup.com",
                               "ron@ratelinvestments.com", "jas.birk@raymondjames.com"],
             "resumedAt": "2026-08-31T15:23:00Z", "pausedBy": "Gmail sending limit",
             "note": "the same, plus an explicit out if it is not of interest"},
            # A third wave with new copy, sent the morning of 31 Aug to the 216 who were
            # still silent. It asks for a call rather than restating the deal — and it
            # went out on the mailed $71.5M basis, not the $73.5M the bidding is at.
            {"gmassId": "53111531", "stage": 2, "sentStart": "2026-08-31T15:58:38Z",
             "sentSoFar": 216, "target": 216, "remaining": 0,
             "note": "just wanted to see if we can get a call on the books to discuss this deal"},
        ],
        "inFlight": False,
        "recipientsFile": "recipients.txt",
        "bad": {
            "gsimon@virtusre.com": "jcolter@virtusre.com",
            "bdonahue@virtusre.com": "jcolter@virtusre.com",
            "rkaropoulos@yieldstreet.com": "ahasan@yieldstreet.com",
            "zshields@yieldstreet.com": "ahasan@yieldstreet.com",
            "acquisitions@lremanagementllc.com": "pat@lremanagementllc.com",
            "pat@lremanagementllc.com": "pat@lremanagementllc.com",
            "matthew.coleman@fairwayamerica.com": "matthew.coleman@fairwayamerica.com",
            "fbruni@blazepartners.com": "fbruni@blazepartners.com",
            "kraft@batteryalexander.com": "kraft@batteryalexander.com",
            "hrajeshwar@pwpartners.com": "hrajeshwar@pwpartners.com",
            "gmcganty@tryperion.com": "jkarsh@tryperion.com",
            "kevin.neys@corebridgefinancial.com": "matthew.kordsmeier@corebridgefinancial.com",
            "gabriel.finger@corebridgefinancial.com": "matthew.kordsmeier@corebridgefinancial.com",
            # tbanks@baupost.com bounced on a CC but Taylor Banks replied himself,
            # so that address is live and counts as a reply, not a dead address.
        },
    },
    {
        "id": "family-office",
        "label": "Family offices",
        "short": "Family office",
        "subject": "Bay Area Multifamily Equity - 18% Lease Trade Outs",
        "gmassId": "53063683",
        "sentStart": "2026-08-27T22:33:29Z",
        "sentEnd": "2026-08-28T00:15:14Z",
        # The 23:40 report showed 431 sent and was read as a completed campaign; it
        # was a mid-send snapshot. GMass kept sending until 00:15 and the 01:55
        # report closes it at the full 674, so nothing was suppressed before send.
        "listSize": 674, "removedPreSend": 0, "sent": 674,
        "bounces": 23, "blocks": 4, "opens": 10, "clicks": 0, "unsubs": 0,
        "reportAt": "2026-08-31T15:07:35Z",
        "inFlight": False,
        "recipientsFile": "recipients_fo.txt",
        # The 11 addresses marked BOUNCED on the source sheet. GMass counts 16, so
        # five more are not yet identified by address.
        "bad": {e: e for e in [
            "rob.bellenfant@615ventures.com", "dayana@aventurapw.com",
            "bill.meckert@brown.com", "tdavidoff@davidoff-family-office.ch",
            "kelvin@tdcapitalhk.com", "leos.jirman@emun.cz",
            "clebron@fahrllc.com", "stephen@teamkse.com",
            "paul.mcavoy@ocorian.com", "vhorst@stars.cl",
            "eduardo.pelaez@wellmeaning.com",
        ]},
    },
]

CORRECTIONS = [
    "Suppress psinger@elliottmgmt.com — Elliott asked by name",
    "Suppress john.rogers@gs.com — Goldman Sachs asked by name",
    "Toeller Family Office: use sbrimmers@devario.eu, not tt@fressnapf.de — he asked to be the sole contact",
    "Caliber: send deals to acquisitions@caliberco.com — Lisa Pudewell asked for it",
    "Suppress russell.deakin@aceanagroup.com — Aceana asked to be removed",
    "Suppress michel.schram@pggm.nl — second decline, no allocation since July",
    "abaraghoush@pacificurbaninvestors.com — Ash has left the firm",
    "njanney@redcovecap.com — Nicholas has left Red Cove; use atishkoff@redcovecap.com",
    "jsharf@3650reit.com — Jeremiah has left 3650; use bthurn@3650capital.com",
    "jritter@seminolefinancialservices.com — replies from jritter@seminolefs.com",
    "dietmar.exler@ambse.com — retired 15 Aug; contact Alex Graham at AMBSE",
    "Reclassify as debt, not JV equity: Electra Capital, Twin Spruce, Bedrock, Torchlight",
    "Not LP equity providers: UDR, Stanton Road, Stoneweg, Pacific Urban, Acuity, H Equities",
]

# ---- per-campaign reconciliation -----------------------------------------
for c in CAMPAIGNS:
    reps = [r for r in R if r.get("campaign") == c["id"]]
    mailed = {r.get("mailedTo", r["email"]).lower() for r in reps}
    c["replyCount"] = len(reps)
    autos = [a for a in A if a.get("campaign") == c["id"]]
    c["autoReplies"] = sorted(autos, key=lambda a: (a["kind"], a.get("returns") or "9999", a["firm"]))
    c["autoCounts"] = {k: sum(1 for a in autos if a["kind"] == k) for k in ("ooo","left","bounce")}

    if c["recipientsFile"]:
        recips = [l.strip() for l in (here/c["recipientsFile"]).read_text().splitlines() if l.strip()]
        dead = set(c["bad"].values()) - mailed      # a firm that replied is never dead
        autoAddrs = {a["email"].lower() for a in autos}
        onSet = {e.lower() for e in recips}
        # dead first, then replies, then auto-replies, then the rest: an address
        # that bounced and also fired an autoresponder is counted once, as dead.
        autoOn = {a["email"].lower() for a in autos} & onSet - mailed - dead
        silent = [e for e in recips if e.lower() not in mailed and e.lower() not in dead
                  and e.lower() not in autoOn]
        onList = len(autoOn)
        assert not (autoAddrs & mailed), (
            f'{c["id"]}: counted twice, as auto-reply and as reply: {autoAddrs & mailed}')
        assert len(mailed) + len(dead) + onList + len(silent) == len(recips), (
            f'{c["id"]}: {len(mailed)}+{len(dead)}+{onList}+{len(silent)} != {len(recips)}')
        # deadAddresses: every undeliverable address seen in-thread (for hygiene).
        # deadCount: how many *send-list* addresses those knock out (for the maths).
        c["recipients"], c["silent"], c["autoOnList"] = recips, silent, onList
        c["deadAddresses"], c["deadCount"] = sorted(c["bad"]), len(dead)
        c["reconciled"] = True
    else:
        # no enumerated roster yet, so there is nothing to reconcile against
        c["recipients"], c["silent"], c["autoOnList"] = [], [], 0
        c["deadAddresses"], c["deadCount"] = [], 0
        c["reconciled"] = False
    c.pop("bad"); c.pop("recipientsFile")

# a contact reached by both campaigns is worth knowing about
byfirm = {}
for r in R:
    byfirm.setdefault(r["firm"], set()).add(r.get("campaign"))
overlap = sorted(f for f, cs in byfirm.items() if len(cs) > 1)

for a in A:
    if a["kind"] == "left" and a.get("note"):
        line = f'{a["email"]} — {a["note"]}'
        if line not in CORRECTIONS: CORRECTIONS.append(line)

roster = json.loads((here/'fo_roster.json').read_text()) if (here/'fo_roster.json').exists() else {}

data = {
    "replies": R,
    "roster": roster,
    "autoReplies": A,
    "campaigns": CAMPAIGNS,
    "corrections": CORRECTIONS,
    "overlap": overlap,
    "deal": {
        "name": "Canyon Woods", "address": "401 Canyon Woods Place, San Ramon, CA",
        "units": 192, "year": 1986, "price": "$71.5M", "perDoor": "$372K",
        "equity": "$30.96M", "loan": "$45.06M", "ltc": "59%", "ltpp": "63%",
        "hold": "5 years", "irr": "17.1%", "multiple": "2.0x", "avgSF": 773,
        "occupancy": "95%", "tradeOut": "18%", "mtm": "7.75%",
        # Michael Regan told Two Sigma on 31 Aug that the initial best-and-final
        # cutoff was $71M and second-round bids are landing near $73.5M, with
        # buyer interviews expected to be decided this week. Every metric above
        # is the $71.5M basis that went out to both lists, so the equity ask and
        # the 17.1% are stale against where the bidding actually is.
        "bidUpdate": {
            "asOf": "2026-08-31T12:56:56Z",
            "cutoff": "$71M",
            "round2": "~$73.5M",
            "note": ("Second-round bids are coming in around $73.5M against a $71M "
                     "best-and-final cutoff, and buyer interviews should be decided "
                     "this week. The metrics on this page are the $71.5M basis that "
                     "was mailed out, so the equity requirement and the 17.1% IRR "
                     "both need restating before the next partner conversation."),
        },
    },
}
(here/'data_fragment.js').write_text("const D=" + json.dumps(data, separators=(',', ':')) + ";")

for c in CAMPAIGNS:
    ac = c["autoCounts"]
    if not c["reconciled"]:
        print(f'{c["short"]:>14}: {c["replyCount"]:>3} replies of {c["sent"] or "?"} sent '
              f'(list {c["listSize"]}) · '
              f'roster not enumerated · {ac["ooo"]} out of office, {ac["left"]} left the firm, '
              f'{ac["bounce"]} bounced')
    else:
        print(f'{c["short"]:>14}: {c["replyCount"]:>3} replies + {c["deadCount"]:>2} dead '
              f'+ {c["autoOnList"]:>2} auto + {len(c["silent"]):>3} silent = {len(c["recipients"])}'
              f'  ({ac["ooo"]} out of office, {ac["left"]} left the firm; '
              f'{len(c["deadAddresses"])} undeliverable addresses seen)')
print(f'{"overlap":>14}: {overlap or "none"}')
