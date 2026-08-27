#!/usr/bin/env python3
"""Build data_fragment.js from replies.json + per-campaign recipient lists.

One deal, several outreach campaigns. Each reply carries a `campaign` id; each
campaign carries its own send list and delivery counts, so response rates stay
per-cohort while the priority queue pools across all of them.
"""
import json, pathlib
here = pathlib.Path(__file__).parent

R = json.loads((here/'replies.json').read_text())

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
        "bounces": 14, "blocks": 3, "opens": 43, "clicks": 0, "unsubs": 0,
        "reportAt": "2026-08-27T21:34:43Z",
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
            # tbanks@baupost.com bounced on a CC but Taylor Banks replied himself,
            # so that address is live and counts as a reply, not a dead address.
        },
    },
    {
        "id": "family-office",
        "label": "Family offices",
        "short": "Family office",
        "subject": "Bay Area Multifamily Equity - 18% Lease Trade Outs",
        "gmassId": None,
        "sentStart": "2026-08-27T22:39:04Z",
        "sentEnd": None,
        "listSize": None, "removedPreSend": None, "sent": None,
        "bounces": None, "blocks": None, "opens": None, "clicks": None, "unsubs": None,
        "reportAt": None,
        "inFlight": True,          # still sending; counts land when GMass reports
        "recipientsFile": None,
        "bad": {},
    },
]

CORRECTIONS = [
    "Suppress psinger@elliottmgmt.com — Elliott asked by name",
    "Suppress john.rogers@gs.com — Goldman Sachs asked by name",
    "Suppress michel.schram@pggm.nl — second decline, no allocation since July",
    "Knickpoint: nick@knickpt.com is stale — use jamie@, zain@, matt@knickpt.com",
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

    if c["recipientsFile"]:
        recips = [l.strip() for l in (here/c["recipientsFile"]).read_text().splitlines() if l.strip()]
        dead = set(c["bad"].values()) - mailed      # a firm that replied is never dead
        silent = [e for e in recips if e.lower() not in mailed and e.lower() not in dead]
        assert len(mailed) + len(dead) + len(silent) == len(recips), (
            f'{c["id"]}: {len(mailed)}+{len(dead)}+{len(silent)} != {len(recips)}')
        # deadAddresses: every undeliverable address seen in-thread (for hygiene).
        # deadCount: how many *send-list* addresses those knock out (for the maths).
        c["recipients"], c["silent"] = recips, silent
        c["deadAddresses"], c["deadCount"] = sorted(c["bad"]), len(dead)
    else:
        # send still in flight — no roster to reconcile against yet
        c["recipients"], c["silent"] = [], []
        c["deadAddresses"], c["deadCount"] = [], 0
    c.pop("bad"); c.pop("recipientsFile")

# a contact reached by both campaigns is worth knowing about
byfirm = {}
for r in R:
    byfirm.setdefault(r["firm"], set()).add(r.get("campaign"))
overlap = sorted(f for f, cs in byfirm.items() if len(cs) > 1)

data = {
    "replies": R,
    "campaigns": CAMPAIGNS,
    "corrections": CORRECTIONS,
    "overlap": overlap,
    "deal": {
        "name": "Canyon Woods", "address": "401 Canyon Woods Place, San Ramon, CA",
        "units": 192, "year": 1986, "price": "$71.5M", "perDoor": "$372K",
        "equity": "$30.96M", "loan": "$45.06M", "ltc": "59%", "ltpp": "63%",
        "hold": "5 years", "irr": "17.1%", "multiple": "2.0x", "avgSF": 773,
        "occupancy": "95%", "tradeOut": "18%", "mtm": "7.75%",
    },
}
(here/'data_fragment.js').write_text("const D=" + json.dumps(data, separators=(',', ':')) + ";")

for c in CAMPAIGNS:
    if c["inFlight"]:
        print(f'{c["short"]:>14}: {c["replyCount"]:>3} replies · send in flight')
    else:
        print(f'{c["short"]:>14}: {c["replyCount"]:>3} replies + {c["deadCount"]:>2} dead '
              f'+ {len(c["silent"]):>3} silent = {len(c["recipients"])}'
              f'  ({len(c["deadAddresses"])} undeliverable addresses seen)')
print(f'{"overlap":>14}: {overlap or "none"}')
