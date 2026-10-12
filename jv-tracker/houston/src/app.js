'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const usd = n => '$' + (n/1e6).toFixed(2).replace(/\.?0+$/,'') + 'M';
const LIVE = new Set(D.live);
// Outcomes where the materials actually left the building, vs. where they did not.
const SENT = new Set(['replied','silent']);
const UNSENT = new Set(['proposed','offered','drafted','unconfirmed']);
const fmtDay = ts => new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric'});
const fmtFull = ts => new Date(ts).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});

let channel = 'all';

/* ---------- masthead ---------- */
const d = D.deal;
$('#eyebrow').textContent = 'JV EQUITY · ' + d.submarket.toUpperCase() + ' · AWARDED ' + d.vintage + ' BUILD';
$('#subtitle').textContent =
  d.units + ' units, built ' + d.vintage + ', at ' + d.perUnit.toLocaleString() +
  ' per door — roughly half of where comparable-vintage Houston product trades. ' +
  'Seller ' + d.seller + '; ' + d.manager + ' manages; brokered by ' + d.broker + '.';
$('#updated').textContent = 'Updated ' + fmtFull(D.generatedAt);
$('#eqneed').textContent = usd(d.equity);
$('#promote').textContent = d.promote;

$('#spec').innerHTML = [
  ['Purchase', '$' + (d.price/1e6).toFixed(1) + 'M'],
  ['Per unit', '$' + d.perUnit.toLocaleString()],
  ['Per SF', '$' + d.perSF],
  ['LP equity', usd(d.equity)],
  ['Levered IRR', d.irr],
  ['Equity multiple', d.em],
  ['Stab. CoC', d.coc],
  ['Cap in / out', d.capIn + ' / ' + d.capOut],
  ['Untrended YoC', d.yoc.replace(' untrended','')],
  ['Target close', d.close],
].map(([k,v]) => '<div><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join('');

/* ---------- channel switcher ---------- */
const chanKeys = Object.keys(D.channels);
const inChan = x => channel === 'all' || x.channel === channel;
const contactsIn = k => D.contacts.filter(c => c.channel === k);

function renderChanBtns(){
  const btn = (key,label,n,live) =>
    '<button class="cbtn" data-ch="'+key+'" aria-pressed="'+(channel===key)+'">'+
    esc(label)+' <b>'+n+'</b>'+(live?'<span class="live-dot"></span>':'')+'</button>';
  const liveBy = k => D.replies.filter(r => LIVE.has(r.stage) && (k==='all'||r.channel===k)).length;
  let h = btn('all','All channels', D.contacts.filter(c=>c.outcome!=='excluded').length, liveBy('all')>0);
  for (const k of chanKeys)
    h += btn(k, D.channels[k].label, contactsIn(k).filter(c=>c.outcome!=='excluded').length, liveBy(k)>0);
  $('#chanbtns').innerHTML = h;
  $('#chanbtns').querySelectorAll('.cbtn').forEach(b => b.onclick = () => {
    channel = b.dataset.ch; renderChanBtns(); renderFilters(); renderAll();
  });
}

/* ---------- KPIs ---------- */
function renderStatus(){
  const reps = D.replies.filter(inChan);
  const live = reps.filter(r => LIVE.has(r.stage));
  const pass = reps.filter(r => r.stage === 'pass');
  // "Sent" means the materials actually went out: replied or sitting silent.
  // Names merely proposed, or offered in conversation, are not coverage.
  const pool = D.contacts.filter(c => inChan(c) && SENT.has(c.outcome));
  const silent = pool.filter(c => c.outcome === 'silent');
  const untapped = D.contacts.filter(c => inChan(c) && UNSENT.has(c.outcome));
  const rate = pool.length ? Math.round(100 * reps.length / pool.length) : 0;

  const hot = D.replies.filter(r => LIVE.has(r.stage)).sort((a,b)=>b.heat-a.heat)[0];
  const dl = D.deadline
    ? '<div class="callout" style="border-left-color:var(--live);margin-bottom:14px">' +
      '<b>Under contract this week.</b> ' + esc(D.deadline) +
      ' The raise is now running against that clock, not against a January close.</div>'
    : '';
  $('#headline').innerHTML = dl +
    '<b>' + usd(d.equity) + ' to raise, and the deal has only actually been sent to ' +
      D.contacts.filter(c => SENT.has(c.outcome)).length + ' firms.</b> ' +
    'Of those, ' + D.replies.length + ' came back — ' +
    D.replies.filter(r => r.stage === 'pass').length + ' passes and ' +
    D.replies.filter(r => LIVE.has(r.stage)).length + ' still live. Almost every pass names Houston — ' +
    'exposure, sentiment or submarket — rather than this deal\'s basis, vintage, check size or returns, ' +
    'and three firms praised the basis on their way to no. ' +
    'The warmest name is <b>' + esc(hot.firm) + '</b>: ' + esc(hot.action.split('.')[0]) + '. ' +
    'On 12 Oct the names Kirsh had proposed but never mailed went out directly, each opening on that ' +
    'firm\'s own last answer to us, so the silent column is a waiting list rather than a gap. ' +
    '<b>' + D.contacts.filter(c => c.outcome === 'drafted').length +
    ' more are drafted and about to go out</b>, each opening on that firm\'s own last answer ' +
    'where there was one, the rest pulled from ZMR\'s equity list.';

  const k = (n,l,note,cls) =>
    '<div class="kpi'+(cls?' '+cls:'')+'"><div class="n">'+n+'</div><div class="lbl">'+esc(l)+'</div>'+
    (note?'<div class="note">'+note+'</div>':'')+'</div>';
  if (!pool.length){
    $('#kpis').innerHTML = '';
    $('#headline').innerHTML = '<b>Nothing has gone out on this channel yet.</b> ' +
      esc(D.channels[channel] ? D.channels[channel].note : '') +
      ' Switch back to <b>All channels</b> for the numbers that do exist.';
    return;
  }
  $('#kpis').innerHTML =
    k(live.length,'Live conversations','Reviewing or conditional — not yet a no','hot') +
    k(pass.length,'Passes', pass.length ? Math.round(100*pass.length/reps.length)+'% of replies' : '') +
    k(reps.length + ' / ' + pool.length,'Replied / sent', rate + '% reply rate — a hand-picked list answers') +
    k(silent.length,'Silent','Hold the deal, nothing back yet') +
    k(untapped.length,'Still unsent','Drafted, or deliberately held','hot');
}

/* ---------- channel blocks ---------- */
function renderChannels(){
  let h = '';
  for (const key of chanKeys){
    const c = D.channels[key];
    if (channel !== 'all' && channel !== key) continue;
    const cs = contactsIn(key);
    const sent = cs.filter(x => SENT.has(x.outcome));
    const reps = D.replies.filter(r => r.channel === key);
    const live = reps.filter(r => LIVE.has(r.stage));
    const silent = cs.filter(x => x.outcome === 'silent');
    const unsent = cs.filter(x => UNSENT.has(x.outcome));
    const excl = cs.filter(x => x.outcome === 'excluded');

    h += '<div class="fblock"><div class="fhead"><div><h3>' + esc(c.label) + '</h3>' +
         '<p class="sub">' + esc(c.owner) + (c.started ? ' · first send ' + fmtDay(c.started) : '') + '</p></div>' +
         (c.status === 'awaiting-send'
            ? '<span class="inflight">Awaiting send</span>'
            : (live.length ? '<span class="inflight">' + live.length + ' live</span>' : '')) +
         '</div>';

    if (c.status === 'awaiting-send'){
      h += '<div class="pending">' + esc(c.note) + ' Three names were carved out at Zamir\'s instruction — ' +
           'Grandview, Long Wharf and Mountain Pacific — because he knows them personally and is going direct. ' +
           'Nothing from this channel has landed yet, so none of the numbers above include it.</div>';
    } else {
      const named = sent.length + unsent.length;
      const rows = [
        ['Named', named, 'var(--seq-2)'],
        ['Actually sent', sent.length, 'var(--seq-4)'],
        ['Replied', reps.length, 'var(--seq-4)'],
        ['Still live', live.length, 'var(--live)'],
        ['Silent', silent.length, 'var(--dead)'],
        ['Lined up, unsent', unsent.length, 'var(--dead)'],
      ].filter(r => !(r[0] === 'Lined up, unsent' && !unsent.length));
      const max = named || 1;
      h += '<div class="funnel">' + rows.map(([l,n,col]) =>
        '<div class="frow"><div class="fl"><b>' + esc(l) + '</b></div>' +
        '<div class="ftrack"><div class="fbar" style="width:' + (100*n/max).toFixed(1) +
          '%;background:' + col + '"></div></div>' +
        '<div class="fval">' + n + ' <span>/ ' + named + '</span></div></div>').join('') + '</div>';
      h += '<p class="sub" style="margin-top:12px;font-family:inherit;font-size:13px;color:var(--ink-3)">' +
           esc(c.note) + (excl.length ? ' ' + excl.length + ' name' + (excl.length>1?'s':'') +
             ' pulled before sending.' : '') + '</p>';
    }
    h += '</div>';
  }
  $('#channels').innerHTML = h;
}

/* ---------- priority queue ---------- */
function renderQueue(){
  const live = D.replies.filter(r => inChan(r) && LIVE.has(r.stage)).sort((a,b)=>b.heat-a.heat);
  $('#livecount').textContent = live.length;
  if (!live.length){ $('#queue').innerHTML = '<div class="pending">No open conversations in this channel.</div>'; return; }
  const done = JSON.parse(localStorage.getItem('ag-done') || '{}');
  $('#queue').innerHTML = '<div class="qgroup"><h3>Open <em>' + live.length + ' of ' + D.replies.length + ' replies</em></h3>' +
    '<div class="cards">' + live.map(r => {
      const id = r.email;
      return '<div class="card s-' + r.stage + (done[id] ? ' done' : '') + '" data-id="' + esc(id) + '">' +
        '<div class="card-top"><div><div class="firm">' + esc(r.firm) + '</div>' +
        '<div class="who">' + esc(r.person) + (r.title ? ' · ' + esc(r.title) : '') + '</div></div>' +
        '<span class="chip c-' + r.stage + '">' + esc(D.stageLabel[r.stage]) + '</span></div>' +
        '<div class="quote">' + esc(r.quote) + '</div>' +
        '<div class="act">' + esc(r.action) + '</div>' +
        '<div class="card-foot"><span class="cmark' + (r.channel !== 'direct' ? ' fo' : '') + '">' +
          esc(D.channels[r.channel].label) + '</span>' +
        '<label class="tick"><input type="checkbox"' + (done[id] ? ' checked' : '') + '> handled</label></div>' +
        '</div>';
    }).join('') + '</div></div>';
  $('#queue').querySelectorAll('.card input').forEach(cb => cb.onchange = e => {
    const card = e.target.closest('.card'); const store = JSON.parse(localStorage.getItem('ag-done')||'{}');
    if (e.target.checked){ store[card.dataset.id] = 1; card.classList.add('done'); }
    else { delete store[card.dataset.id]; card.classList.remove('done'); }
    localStorage.setItem('ag-done', JSON.stringify(store));
  });
}

/* ---------- objections ---------- */
function renderObjections(){
  const reps = D.replies.filter(r => inChan(r) && r.stage === 'pass');
  const counts = {};
  reps.forEach(r => r.tags.forEach(t => counts[t] = (counts[t]||0) + 1));
  const rows = Object.entries(counts).sort((a,b) => b[1]-a[1]);
  const noReason = reps.filter(r => !r.tags.length).length;
  const max = Math.max(1, ...rows.map(r => r[1]));

  $('#objnote').innerHTML = 'Every stated reason across the ' + reps.length + ' pass' + (reps.length===1?'':'es') +
    ' in view. A reply can carry more than one.' + (noReason ? ' ' + noReason + ' gave no reason at all.' : '');

  $('#objections').innerHTML = rows.map(([t,n]) =>
    '<div class="orow"><div class="ol">' + esc(D.tagLabel[t]) + '</div>' +
    '<div class="obar-wrap"><div class="obar" style="width:' + (100*n/max*0.86).toFixed(1) + '%;background:' +
      (D.marketTags.includes(t) ? 'var(--seq-4)' : 'var(--routed)') + '"></div>' +
    '<span class="ocount">' + n + '</span></div></div>').join('')
    || '<div class="pending">No passes in this channel yet.</div>';

  const mkt = reps.filter(r => r.tags.some(t => D.marketTags.includes(t))).length;
  const dl  = reps.filter(r => r.tags.some(t => D.dealTags.includes(t))).length;
  $('#split').innerHTML =
    '<h3>Market, not deal</h3>' +
    '<p>The single most useful number on this page: how many passes are about Houston versus about this asset.</p>' +
    '<div class="slegend">' +
      '<span><span class="swatch" style="background:var(--seq-4)"></span>Houston itself</span>' +
      '<span><span class="swatch" style="background:var(--routed)"></span>This deal\'s economics</span></div>' +
    [['Houston itself', mkt, 'var(--seq-4)'], ['This deal\'s economics', dl, 'var(--routed)']].map(([l,n,c]) =>
      '<div class="srow"><div class="sl">' + esc(l) + '</div><div class="sbars">' +
      '<div class="sbar" style="width:' + (reps.length ? 100*n/reps.length*0.82 : 0).toFixed(1) + '%;background:' + c + '"></div>' +
      '<span class="scount">' + n + ' of ' + reps.length + '</span></div></div>').join('') +
    '<p style="margin-top:14px;margin-bottom:0;font-size:13.5px;color:var(--ink-2);line-height:1.6">' +
      'This is the inverse of the Canyon Woods pattern, where the blockers were geography, vintage, check size and ' +
      'return threshold — all of which this deal clears. Here the asset survives scrutiny and the market does not: ' +
      'Sabal called the asset quality &ldquo;there&rdquo;, Parse called the basis &ldquo;strong&rdquo;, Green Pine called it ' +
      '&ldquo;a good deal&rdquo;. All three passed on Houston. The implication for the next send is that screening for ' +
      'Houston appetite matters more than screening for check size or return profile.</p>';
}

/* ---------- ledger ---------- */
let filt = 'all';
function renderFilters(){
  const stages = [...new Set(D.replies.map(r => r.stage))];
  $('#filters').innerHTML =
    ['all','live',...stages].map(f =>
      '<button class="fbtn" data-f="' + f + '" aria-pressed="' + (filt===f) + '">' +
      esc(f === 'all' ? 'All' : f === 'live' ? 'Live only' : D.stageLabel[f]) + '</button>').join('') +
    '<input id="q" placeholder="search firm or text">';
  $('#filters').querySelectorAll('.fbtn').forEach(b => b.onclick = () => {
    filt = b.dataset.f;
    $('#filters').querySelectorAll('.fbtn').forEach(x => x.setAttribute('aria-pressed', x.dataset.f === filt));
    renderLedger();
  });
}
function renderLedger(){
  const all = D.replies.filter(inChan);
  $('#replycount').textContent = D.replies.length;
  const q = (($('#q') && $('#q').value) || '').toLowerCase();

  const rows = all.filter(r =>
    (filt === 'all' || (filt === 'live' ? LIVE.has(r.stage) : r.stage === filt)) &&
    (!q || (r.firm + r.person + r.quote).toLowerCase().includes(q)));

  $('#ledger').innerHTML = rows.map(r =>
    '<tr><td class="f">' + esc(r.firm) + '<small>' + esc(r.person) + '</small>' +
      (r.tags.length ? '<div class="tags">' + r.tags.map(t => '<span class="tag">' + esc(D.tagLabel[t]) + '</span>').join('') + '</div>' : '') +
    '</td>' +
    '<td><span class="cmark' + (r.channel !== 'direct' ? ' fo' : '') + '">' + esc(D.channels[r.channel].label) + '</span></td>' +
    '<td><span class="chip c-' + r.stage + '">' + esc(D.stageLabel[r.stage]) + '</span></td>' +
    '<td class="qt">' + esc(r.quote) + '</td>' +
    '<td class="tm">' + fmtDay(r.ts) + '</td></tr>').join('');
  $('#empty').style.display = rows.length ? 'none' : 'block';
}
document.addEventListener('input', e => { if (e.target.id === 'q') renderLedger(); });

/* ---------- gaps ---------- */
function renderGaps(){
  const pool = D.contacts.filter(c => inChan(c));
  const silent = pool.filter(c => c.outcome === 'silent');
  const unsent = pool.filter(c => UNSENT.has(c.outcome));
  const drafted = pool.filter(c => c.outcome === 'drafted');
  const excl = D.contacts.filter(c => c.outcome === 'excluded');
  const k = (n,l,note,cls) => '<div class="kpi' + (cls?' '+cls:'') + '"><div class="n">' + n + '</div>' +
    '<div class="lbl">' + esc(l) + '</div>' + (note ? '<div class="note">' + note + '</div>' : '') + '</div>';
  $('#gapkpis').innerHTML =
    k(drafted.length,'Drafted, not sent','Written and waiting on you','hot') +
    k(silent.length,'Sent, silent','Holds the deal, nothing back yet') +
    k(unsent.length - drafted.length,'Held back','Deliberately not re-sent') +
    k(excl.length,'Pulled pre-send','Known non-fits killed before going out');

  $('#silentsum').textContent = drafted.length + ' drafted and ready to send, ' +
    (unsent.length - drafted.length) + ' other' + (unsent.length - drafted.length === 1 ? '' : 's') +
    ' still unsent';
  // The drafted queue is the review surface: firm, who it goes to, and the line it opens on.
  const why = {proposed:'on Slocumb\'s list, no send confirmed',
               unconfirmed:'no contact on file', offered:'offered, not sent'};
  $('#silentlist').innerHTML = unsent.map(c => {
      const to = [c.email].concat(c.also || []).filter(Boolean).join(', ');
      return '<div style="white-space:normal;padding:9px 0">' +
        '<b>' + esc(c.firm) + '</b>' +
        (c.outcome !== 'drafted' ? ' <span style="color:var(--ink-3)">— ' +
           esc(why[c.outcome] || c.outcome) + '</span>' : '') +
        (to ? '<div class="mono" style="font-size:11px;color:var(--ink-3);margin-top:2px">' +
           esc(to) + '</div>' : '') +
        (c.note ? '<div style="font-size:13px;color:var(--ink-2);margin-top:4px;line-height:1.5">' +
           esc(c.note) + '</div>' : '') + '</div>';
    }).join('') || '<div>None — everything named has gone out.</div>';

  $('#suppressed').innerHTML = (D.suppressed && D.suppressed.length)
    ? '<div class="callout" style="border-left-color:var(--dead);margin:18px 0 0">' +
      '<b>Never contact again.</b> ' + D.suppressed.map(x =>
        esc(x.firm) + ' (' + esc(x.person) + ') \u2014 ' + esc(x.why)).join(' ') + '</div>'
    : '';

  const sl = silent.length
    ? silent.map(c => '<div style="white-space:normal"><b>' + esc(c.firm) + '</b>' +
        (c.note ? ' — ' + esc(c.note) : '') + '</div>').join('')
    : '<div>None — everything that went out came back.</div>';
  $('#silentdetail').innerHTML =
    '<details open style="margin-top:4px"><summary>' + silent.length +
    ' sent and still silent</summary><div class="silent-grid" style="grid-template-columns:1fr">' +
    sl + '</div></details>';


  $('#exclsum').textContent = excl.length + ' names pulled from the Kirsh list before it went out';
  $('#excllist').innerHTML = excl.map(c =>
    '<div style="white-space:normal"><b>' + esc(c.firm) + '</b> — ' + esc(c.note) + '</div>').join('');
}

/* ---------- broker read + footer ---------- */
$('#uw').innerHTML =
  '<b>Slocumb would underwrite a 6.25% exit, not 6.00%.</b> He flagged the rent trend as optically flattered ' +
  '(1% / 2% / 3%), argued for being more conservative still, and raised both affordability in the submarket and ' +
  'fees running at roughly 19% of rent. He agreed to circulate it anyway. ' +
  'His read lines up with Sabal\'s — the two most detailed looks we have both land on the same two issues: ' +
  'how much rent growth this tenant base can absorb, and what the exit cap really is. ' +
  'Those are the two numbers to tighten before the next send.';

$('#foot').innerHTML =
  'Allen Genoa Capital Desk · ' + D.replies.length + ' replies from the ' +
  D.contacts.filter(c => SENT.has(c.outcome)).length + ' firms the deal was actually sent to, out of ' +
  D.contacts.filter(c => c.outcome !== 'excluded').length + ' named across three channels · ' +
  'built from the Gmail thread record, not a CRM.<br>' +
  'A firm counts as sent only where a send or a reply appears in the thread. Names that were proposed, ' +
  'agreed or offered in conversation are counted as unsent, however warm they are.<br>' +
  'Sources: the ZMR direct thread (Sub-$135K/Door on a 2023 Houston Build), Andrew Kirsh\'s ' +
  '&ldquo;Equity Opp - 252 units, 2023 built - Houston&rdquo; forwards, the IPA &ldquo;Houston&rdquo; thread, ' +
  'and the Smart Living Allen Genoa debt thread.<br>' +
  'Generated ' + D.generatedAt + ' · figures restate Kirsh\'s 2 Oct version of the deal. ' + esc(D.deal.note);

/* ---------- boot ---------- */
function renderAll(){ renderStatus(); renderChannels(); renderQueue(); renderObjections(); renderLedger(); renderGaps(); }
renderChanBtns(); renderFilters(); renderAll();
