#!/usr/bin/env python3
"""Build data_fragment.js from replies.json + recipients.txt, reconciling to 451 sends."""
import json, pathlib
here = pathlib.Path(__file__).parent

R = json.loads((here/'replies.json').read_text())
recips = [l.strip() for l in (here/'recipients.txt').read_text().splitlines() if l.strip()]

# Undeliverable addresses seen in-thread -> the primary send address on that thread.
BAD = {
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
    # tbanks@baupost.com bounced on a CC but Taylor Banks himself replied 27 Aug,
    # so the address is live and is counted as a reply, not a dead address.
}

mailed = {r.get("mailedTo", r["email"]).lower() for r in R}
dead = set(BAD.values()) - mailed          # a firm that replied is never a dead address
silent = [e for e in recips if e.lower() not in mailed and e.lower() not in dead]

assert len(mailed) + len(dead) + len(silent) == len(recips), \
    f"reconciliation off: {len(mailed)}+{len(dead)}+{len(silent)} != {len(recips)}"

data = {
    "replies": R,
    "recipients": recips,
    "silent": silent,
    "bounced": sorted(BAD),
    "corrections": [
        "Suppress psinger@elliottmgmt.com — Elliott asked by name",
        "Suppress john.rogers@gs.com — Goldman Sachs asked by name",
        "Suppress michel.schram@pggm.nl — second decline, no allocation since July",
        "Knickpoint: nick@knickpt.com is stale — use jamie@, zain@, matt@knickpt.com",
        "abaraghoush@pacificurbaninvestors.com — Ash has left the firm",
        "njanney@redcovecap.com — Nicholas has left Red Cove; use atishkoff@redcovecap.com",
        "jsharf@3650reit.com — Jeremiah has left 3650; use bthurn@3650capital.com",
        "jritter@seminolefinancialservices.com — replies from jritter@seminolefs.com; update the domain",
        "Reclassify as debt, not JV equity: Electra Capital, Twin Spruce, Bedrock Land Finance",
        "Not LP equity providers: UDR, Stanton Road, Stoneweg, Pacific Urban, Acuity, H Equities",
    ],
    "campaign": {
        "subject": "Bay Area MF JV Equity 18% Lease Trade Out", "id": "53043162",
        "sentStart": "2026-08-26T21:58:24Z", "sentEnd": "2026-08-26T23:04:44Z",
        "listSize": 534, "removedPreSend": 83, "sent": 451,
        "bounces": 14, "blocks": 3, "opens": 43, "clicks": 0, "unsubs": 0,
        "gmassReplyCount": 43, "gmassReportAt": "2026-08-27T02:13:56Z",
    },
    "deal": {
        "name": "Canyon Woods", "address": "401 Canyon Woods Place, San Ramon, CA",
        "units": 192, "year": 1986, "price": "$71M", "equity": "$30.96M",
        "loan": "$45.06M", "ltc": "59%", "ltpp": "63%", "hold": "5 years",
        "irr": "17.1%", "multiple": "2.0x", "avgSF": 773, "occupancy": "95%",
        "tradeOut": "18%", "mtm": "7.75%",
    },
}
(here/'data_fragment.js').write_text("const D=" + json.dumps(data, separators=(',', ':')) + ";")
print(f"{len(mailed)} replied · {len(dead)} dead · {len(silent)} silent = {len(recips)}")
