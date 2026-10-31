#!/usr/bin/env python3
"""Print reply messages in a saved search result that aren't yet in replies.json."""
import json, html, sys
d = json.load(open(sys.argv[1]))
R = json.load(open('replies.json'))
seen = set()
for r in R:
    seen.add(r['email'].lower())
    if r.get('mailedTo'): seen.add(r['mailedTo'].lower())
    for a in r.get('otherAddrs', []): seen.add(a.lower())
new = []
for t in d['threads']:
    ms = sorted(t['messages'], key=lambda m: m['date'])
    sent = [m for m in ms if 'SENT' in m.get('labelIds', [])]
    to = sent[0]['toRecipients'][0] if sent and sent[0].get('toRecipients') else '?'
    for m in ms:
        if 'SENT' in m.get('labelIds', []): continue
        if m['sender'].lower() in seen or to.lower() in seen: continue
        new.append({'to': to, 'from': m['sender'], 'ts': m['date'],
                    'snip': html.unescape(m.get('snippet','')).replace('\n',' ')})
new.sort(key=lambda x: x['ts'])
print(f"{len(d['threads'])} threads scanned · {len(R)} firms on file · {len(new)} new\n")
for i, r in enumerate(new, 1):
    print(f"{i}. [{r['ts'][5:16]}] {r['from']}\n   -> mailed: {r['to']}\n   {r['snip'][:260]}\n")
