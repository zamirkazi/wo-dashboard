#!/usr/bin/env python3
"""Assemble the Smart Living Allen Genoa (Houston) JV equity dashboard.

Shares the Canyon Woods design system: the <style> block is lifted verbatim from
../head.html so both desks stay visually identical. Structure differs — Houston
has no GMass blast, so coverage is organised by referral channel, not campaign.
"""
import json, datetime, pathlib, re, html as H

here = pathlib.Path(__file__).parent
deal = json.loads((here/'deal.json').read_text())
out_ = json.loads((here/'outreach.json').read_text())
replies = json.loads((here/'replies.json').read_text())

# The Canyon Woods head.html owns the shared design system. Find it wherever this
# tree is checked out: alongside (../head.html) or in the sibling tracker (../../src/).
for cand in (here.parent/'head.html', here.parent.parent/'src'/'head.html'):
    if cand.exists():
        shared = cand
        break
else:
    raise SystemExit('cannot find Canyon Woods head.html for the shared stylesheet')
css = re.search(r'<style>.*?</style>', shared.read_text(), re.S).group(0)
# Houston-only: the drafted queue carries a note per row, so it needs wider columns.
css = css.replace('</style>',
  '.draft-grid{grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:0 26px}\n'
  '.draft-grid > div{border-bottom:1px solid var(--rule)}\n</style>')

LIVE = {'meeting','materials','question','conditional','reviewing'}
STAGE_LABEL = {'reviewing':'Reviewing','conditional':'Conditional','pass':'Pass',
               'meeting':'Meeting','materials':'Materials','question':'Question',
               'referred':'Referred','relationship':'Relationship','outofscope':'Out of scope'}
TAG_LABEL = {
    'houston-exposure':      'Houston exposure maxed',
    'houston-sentiment':     'Houston sentiment / burned',
    'submarket-demographics':'Submarket demographics',
    'strategy-mismatch':     'Mandate mismatch',
    'submarket-vacancy':     'Submarket vacancy vs the 5% stabilized assumption',
    'rent-spread':           'Underwritten rents vs the nearest comparable',
    'pref-only':             'Only writing pref, not JV or acquisition equity',
    'going-in-yield':        'Going-in yield too thin',
    'negative-leverage':     'Negative leverage at $34M',
    'exit-cap':              'Exit cap too tight at 6.00%',
    'exit-rent-multiple':    'Exit valued off the rent multiple, not the cap rate',
    'price-reduction':       'Asked whether there is more room on the purchase price',
    'fee-drag':              'Returns thin net of fees and waterfall',
    'occupancy-softness':    'Rent roll softer than the pitch',
    'unit-size':             'Unit size',
    'partner-conflict':      'Existing local partner',
    'check-too-small':       'Check too small for them',
    'capital-paused':        'Pausing on real estate',
    'non-local-sponsor':     'Sponsor is not local to the market',
    'profile-appetite':      'Broker reads thin market appetite for the profile',
    'check-too-large':       'Check larger than they write',
    'raise-progress':        'Wants to see how much of the raise is committed',
    'submarket-conviction':  'Cannot get comfortable with the submarket itself',
    'year-one-cash':         'Year-one cash-on-cash below their hurdle',
    'climate-risk':          'Flood / climate exposure near the Ship Channel',
    'competing-deal':        'Chose a competing Houston deal on relative value',
    'submarket-concessions': 'Concession levels across the Houston submarkets',
    'diligence-bandwidth':   'No capacity to underwrite right now',
    'feeder-platform':       'Only invests through an alternative-asset platform',
    'underbid-this-asset':   'Bid this asset themselves at a lower number',
    'exchange-capital':      'Has 1031 exchange money to place',
}
# Which objections are about Houston itself vs. about this deal's economics.
MARKET_TAGS = {'houston-exposure','houston-sentiment','submarket-demographics','strategy-mismatch','submarket-vacancy','submarket-conviction','climate-risk','submarket-concessions'}
DEAL_TAGS   = {'going-in-yield','negative-leverage','exit-cap','fee-drag','occupancy-softness','unit-size','rent-spread','pref-only','competing-deal',
               'partner-conflict','check-too-small','capital-paused','non-local-sponsor','profile-appetite','check-too-large','raise-progress','year-one-cash','exit-rent-multiple','price-reduction','diligence-bandwidth','feeder-platform','underbid-this-asset','exchange-capital'}

data = {
    'deal': deal,
    'channels': out_['channels'],
    'contacts': out_['contacts'],
    'carveouts': out_['carveouts'],
    'replies': sorted(replies, key=lambda r: r['ts'], reverse=True),
    'stageLabel': STAGE_LABEL,
    'tagLabel': TAG_LABEL,
    'live': sorted(LIVE),
    'marketTags': sorted(MARKET_TAGS),
    'dealTags': sorted(DEAL_TAGS),
    'generatedAt': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
}

# ---- reconciliation invariants -------------------------------------------
replied = {c['firm'] for c in out_['contacts'] if c['outcome'] == 'replied'}
assert replied == {r['firm'] for r in replies}, 'outreach/replies mismatch'
assert all(r['stage'] in STAGE_LABEL for r in replies), 'unknown stage'
assert all(t in TAG_LABEL for r in replies for t in r['tags']), 'unknown tag'
# A broker-relayed report may name a firm without an address; only real
# addresses are checked for duplicates.
seen = set()
for r in replies:
    if not r['email']:
        continue
    assert r['email'] not in seen, f"duplicate reply address {r['email']}"
    seen.add(r['email'])

body = (here/'body.html').read_text()
js   = (here/'app.js').read_text()

doc = (
  '<!doctype html><html lang="en"><head><meta charset="utf-8">'
  '<meta name="viewport" content="width=device-width,initial-scale=1">'
  '<title>Allen Genoa Capital Desk</title>'
  '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">'
  '<meta name="referrer" content="no-referrer">'
  '<link rel="preconnect" href="https://fonts.googleapis.com">'
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bitter:wght@500;600;700'
  '&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">'
  + css
  + '</head><body>' + body
  + '<script>const D=' + json.dumps(data, separators=(',', ':')) + ';\n' + js + '</script>'
  + '</body></html>'
)
assert doc.count('<script') == doc.count('</script>'), 'unbalanced script tags'
for anchor in ('id="channels"', 'id="queue"', 'id="ledger"', 'id="objections"', 'id="split"'):
    assert anchor in doc, f'missing anchor {anchor}'

# Ship next to the sources when flat, one level up when they live in src/.
dest = (here.parent if here.name == 'src' else here)/'index.html'
dest.write_text(doc)
print('wrote', dest, len(doc), 'bytes ·', len(replies), 'replies ·',
      len(out_['contacts']), 'contacts ·', data['generatedAt'])
