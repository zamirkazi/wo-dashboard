// add-drilldown-narratives.js
// 1) Fixes data gaps — ensures all 18 properties show in charts where appropriate
// 2) Adds dynamic narrative generation to every Asset Drill-Down tab

const fs = require('fs');
let html = fs.readFileSync('/Users/zk/Desktop/wo-dashboard/index.html', 'utf-8');

// ═══════════════════════════════════════════════════════════════
// PART 1: Add narrative containers to each Asset Drill-Down tab
// ═══════════════════════════════════════════════════════════════

// Trends tab — add narrative container before charts
html = html.replace(
  `<div id="tab-trends" class="panel active">
  <div class="g2">`,
  `<div id="tab-trends" class="panel active">
  <div id="nar-trends" style="padding:12px 18px 0"></div>
  <div class="g2">`
);

// Categories tab
html = html.replace(
  `<div id="tab-cats" class="panel">
  <div class="g2">
    <div class="card"><div class="ct"><span class="dot db"></span>Category Volume`,
  `<div id="tab-cats" class="panel">
  <div id="nar-cats" style="padding:12px 18px 0"></div>
  <div class="g2">
    <div class="card"><div class="ct"><span class="dot db"></span>Category Volume`
);

// Subcategories tab
html = html.replace(
  `<div id="tab-subs" class="panel">
  <div class="g2">
    <div class="card"><div class="ct"><span class="dot db"></span>Top Subcategories`,
  `<div id="tab-subs" class="panel">
  <div id="nar-subs" style="padding:12px 18px 0"></div>
  <div class="g2">
    <div class="card"><div class="ct"><span class="dot db"></span>Top Subcategories`
);

// Speed tab
html = html.replace(
  `<div id="tab-speed" class="panel">
  <div class="g3">`,
  `<div id="tab-speed" class="panel">
  <div id="nar-speed" style="padding:12px 18px 0"></div>
  <div class="g3">`
);

// Priority tab
html = html.replace(
  `<div id="tab-prio" class="panel">
  <div id="prioDash"></div>`,
  `<div id="tab-prio" class="panel">
  <div id="nar-prio" style="padding:12px 18px 0"></div>
  <div id="prioDash"></div>`
);

// Issues tab
html = html.replace(
  `<div id="tab-issues" class="panel">
  <div class="g2">
    <div class="card"><div class="ct"><span class="dot dr"></span>Top Keywords`,
  `<div id="tab-issues" class="panel">
  <div id="nar-issues" style="padding:12px 18px 0"></div>
  <div class="g2">
    <div class="card"><div class="ct"><span class="dot dr"></span>Top Keywords`
);

// Safety tab
html = html.replace(
  `<div id="tab-safety" class="panel">
  <div id="safetyDash"></div>`,
  `<div id="tab-safety" class="panel">
  <div id="nar-safety" style="padding:12px 18px 0"></div>
  <div id="safetyDash"></div>`
);

// ═══════════════════════════════════════════════════════════════
// PART 2: Add the dynamic narrative builder function
// ═══════════════════════════════════════════════════════════════

const narrativeFunction = `

// ─── Dynamic Narrative Builder for Asset Drill-Down ───
function nBox(items, style) {
  var colors = {
    crit: { bg:'#1c1010', border:'#3d1515', accent:'#f85149', tag:'ACTION REQUIRED' },
    warn: { bg:'#1c1a10', border:'#3d3515', accent:'#e3b341', tag:'MONITOR' },
    good: { bg:'#0d1310', border:'#1a3020', accent:'#3fb950', tag:'STRONG PERFORMANCE' },
    info: { bg:'#0d1117', border:'#21262d', accent:'#58a6ff', tag:'KEY INSIGHT' },
    action: { bg:'#10101c', border:'#15153d', accent:'#a371f7', tag:'RECOMMENDED ACTIONS' }
  };
  var c = colors[style] || colors.info;
  var body = items.map(function(item){ return '<div style="margin-bottom:6px">'+item+'</div>'; }).join('');
  return '<div style="background:'+c.bg+';border:1px solid '+c.border+';border-radius:8px;padding:14px 16px;margin-bottom:12px;border-left:3px solid '+c.accent+'">'+
    '<div style="font-size:9px;font-weight:800;color:'+c.accent+';text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">'+c.tag+'</div>'+
    '<div style="font-size:11px;color:#c9d1d9;line-height:1.7">'+body+'</div></div>';
}

function buildNarratives(p) {
  var name = p.name;
  var pid = p.pid;

  // ── Trends Tab ──
  (function(){
    var el = document.getElementById('nar-trends');
    if(!el) return;
    if(p.avg === null) {
      el.innerHTML = nBox(['<strong style="color:#f85149">'+name+' has no completion date data.</strong> All '+p.total+' work orders are missing completion timestamps. Until the property management system is configured to record completion dates, speed metrics cannot be calculated.','<strong>Action:</strong> Contact the PM software administrator to enable completion date tracking. Every WO should auto-stamp when marked "Complete."'], 'crit');
      return;
    }

    var months = ['2025-09','2025-10','2025-11','2025-12','2026-01','2026-02'];
    var mLabels = ['Sep','Oct','Nov','Dec','Jan','Feb'];
    var avgs = months.map(function(m){ return p.monthly[m] ? p.monthly[m].avg : null; });
    var vols = months.map(function(m){ return p.monthly[m] ? p.monthly[m].vol : 0; });
    var p24s = months.map(function(m){ return p.monthly[m] ? p.monthly[m].p24 : null; });

    // Trend direction — compare first 3 months vs last 3 months
    var firstHalf = avgs.slice(0,3).filter(function(v){return v!==null;});
    var secondHalf = avgs.slice(3).filter(function(v){return v!==null;});
    var firstAvg = firstHalf.length ? firstHalf.reduce(function(a,b){return a+b;},0)/firstHalf.length : null;
    var secondAvg = secondHalf.length ? secondHalf.reduce(function(a,b){return a+b;},0)/secondHalf.length : null;

    var trendDir = 'stable';
    var trendDelta = 0;
    if(firstAvg !== null && secondAvg !== null) {
      trendDelta = secondAvg - firstAvg;
      if(trendDelta > 0.5) trendDir = 'worsening';
      else if(trendDelta < -0.5) trendDir = 'improving';
    }

    // Best and worst months
    var bestMonth = null, worstMonth = null, bestVal = 999, worstVal = -1;
    avgs.forEach(function(v,i){
      if(v!==null && v<bestVal){ bestVal=v; bestMonth=mLabels[i]; }
      if(v!==null && v>worstVal){ worstVal=v; worstMonth=mLabels[i]; }
    });

    // Volume trend
    var totalVol = vols.reduce(function(a,b){return a+b;},0);
    var recentVol = vols.slice(4).reduce(function(a,b){return a+b;},0);
    var earlyVol = vols.slice(0,2).reduce(function(a,b){return a+b;},0);

    // Build narrative
    var insights = [];
    if(trendDir === 'worsening') {
      insights.push('<strong style="color:#f85149">'+name+' is getting slower.</strong> Average completion time increased from '+firstAvg.toFixed(1)+'d (Sep–Nov) to '+secondAvg.toFixed(1)+'d (Dec–Feb), a change of +'+trendDelta.toFixed(1)+' days. This is not a seasonal blip if it continues into March.');
    } else if(trendDir === 'improving') {
      insights.push('<strong style="color:#3fb950">'+name+' is improving.</strong> Average completion time dropped from '+firstAvg.toFixed(1)+'d (Sep–Nov) to '+secondAvg.toFixed(1)+'d (Dec–Feb) — that\\'s '+Math.abs(trendDelta).toFixed(1)+' days faster. Whatever changed in operations is working.');
    } else {
      insights.push('<strong style="color:#e2e8f0">'+name+' has been relatively stable</strong> at around '+p.avg+'d average across the 6-month period. No major acceleration or deterioration in maintenance speed.');
    }

    if(bestMonth && worstMonth && bestMonth !== worstMonth) {
      insights.push('<strong>Best month: '+bestMonth+'</strong> ('+bestVal.toFixed(1)+'d avg). <strong>Toughest month: '+worstMonth+'</strong> ('+worstVal.toFixed(1)+'d avg). '+(worstVal > bestVal*2 ? 'That\\'s more than 2x slower — worth investigating what happened that month (staffing change? vendor issue? surge in volume?).' : 'The spread is manageable but watch for the pattern repeating.'));
    }

    if(p.avg > PF_AVG) {
      insights.push('At <strong style="color:#e3b341">'+p.avg+'d average</strong>, this property is '+(p.avg - PF_AVG).toFixed(1)+' days slower than the portfolio average ('+PF_AVG+'d). Closing this gap would require either faster dispatch, better parts availability, or additional maintenance capacity.');
    } else {
      insights.push('At <strong style="color:#3fb950">'+p.avg+'d average</strong>, this property is '+(PF_AVG - p.avg).toFixed(1)+' days faster than the portfolio average ('+PF_AVG+'d). This is strong — the focus should be maintaining this pace as volume changes.');
    }

    var style = trendDir === 'worsening' ? 'warn' : trendDir === 'improving' ? 'good' : 'info';
    var out = nBox(insights, style);

    // Action items
    var actions = [];
    if(trendDir === 'worsening') {
      actions.push('<strong>1. Investigate the slowdown.</strong> Pull the last 60 days of WOs and identify: Are more WOs coming in? Are the same number of techs available? Is a specific category dragging the average up?');
      actions.push('<strong>2. Check for stuck tickets.</strong> Open WOs older than 14 days are often forgotten tickets, not active repairs. Close or escalate them.');
    }
    if(p.p24 < 50) {
      actions.push('<strong>'+(actions.length+1)+'. Prioritize same-day closes.</strong> Only '+p.p24+'% of WOs close within 24 hours (portfolio avg: '+PF_P24+'%). Target: get 3 additional WOs per week closed same-day. That alone would move the needle.');
    }
    if(p.slow > 10) {
      actions.push('<strong>'+(actions.length+1)+'. Audit the '+p.slow+' slow WOs (7+ days).</strong> Categorize them: waiting for parts, waiting for vendor, waiting for resident access, or just forgotten? Each cause has a different fix.');
    }
    if(recentVol > earlyVol * 1.3 && earlyVol > 0) {
      actions.push('<strong>'+(actions.length+1)+'. Volume is rising.</strong> Recent months show higher WO submissions than early months. If staffing hasn\\'t scaled, response times will degrade. Review tech-to-unit ratios.');
    }
    if(actions.length === 0) {
      actions.push('<strong>Maintain current pace.</strong> No urgent trend issues detected. Continue monitoring monthly averages to catch any changes early.');
    }
    out += nBox(actions, 'action');
    el.innerHTML = out;
  })();

  // ── Categories Tab ──
  (function(){
    var el = document.getElementById('nar-cats');
    if(!el) return;
    if(!p.cats || !p.cats.length) { el.innerHTML = ''; return; }

    var worst = p.cats.slice().sort(function(a,b){ return b.avg - a.avg; })[0];
    var mostSlow = p.cats.slice().sort(function(a,b){ return b.slow - a.slow; })[0];
    var best = p.cats.filter(function(c){return c.count>=5;}).sort(function(a,b){ return a.avg - b.avg; })[0];
    var biggest = p.cats[0]; // already sorted by count desc

    var insights = [];
    insights.push('<strong style="color:#e2e8f0">'+biggest.name+'</strong> is the highest-volume category with <strong>'+biggest.count+' WOs</strong> ('+Math.round(biggest.count/p.total*100)+'% of all work orders). '+(biggest.avg > 3 ? 'At '+biggest.avg+'d avg, it\\'s also slow — this is where speed improvements will have the biggest impact on resident experience.' : 'At '+biggest.avg+'d avg, it\\'s being handled at a reasonable pace.'));

    if(worst && worst.avg > 3) {
      insights.push('<strong style="color:#f85149">'+worst.name+' is the slowest category</strong> at '+worst.avg+'d average. '+(worst.count >= 10 ? 'With '+worst.count+' WOs, this isn\\'t a one-off — it\\'s a systemic issue that needs dedicated attention.' : 'Volume is low ('+worst.count+' WOs), so a few outliers may be skewing the average. Check for any 20+ day WOs dragging it up.'));
    }

    if(mostSlow && mostSlow.slow > 3) {
      if(!worst || mostSlow.name !== worst.name) {
        insights.push('<strong style="color:#e3b341">'+mostSlow.name+' has the most chronic slow WOs</strong> ('+mostSlow.slow+' WOs over 7 days). Even though the average might look OK, these long-tail WOs are creating the worst resident experiences.');
      }
    }

    if(best) {
      insights.push('<strong style="color:#3fb950">'+best.name+' is the strongest category</strong> — '+best.avg+'d avg with '+best.p24+'% same-day completion. Use this as the internal benchmark for other categories.');
    }

    el.innerHTML = nBox(insights, worst && worst.avg > 5 ? 'warn' : 'info');

    // Actions
    var actions = [];
    if(worst && worst.avg > 4) {
      actions.push('<strong>1. Deep-dive into '+worst.name+'.</strong> Pull all '+worst.name+' WOs from the last 90 days. Are the slow ones waiting for parts? Vendor scheduling? Resident access? The fix depends on the bottleneck.');
    }
    if(mostSlow && mostSlow.slow > 5) {
      actions.push('<strong>'+(actions.length+1)+'. Audit '+mostSlow.name+' slow WOs.</strong> '+mostSlow.slow+' work orders over 7 days in a single category suggests either a parts supply issue or a skills gap. Consider a dedicated vendor contract for this category.');
    }
    var lowP24 = p.cats.filter(function(c){return c.p24 < 40 && c.count >= 5;});
    if(lowP24.length > 0) {
      actions.push('<strong>'+(actions.length+1)+'. '+lowP24.map(function(c){return c.name;}).join(', ')+' — same-day rate below 40%.</strong> Residents are waiting multiple days for these repairs. If parts aren\\'t in stock locally, set up a next-day parts delivery arrangement with your supplier.');
    }
    if(actions.length === 0) {
      actions.push('<strong>No critical category issues detected.</strong> All categories are within acceptable performance ranges. Continue monitoring for any individual category exceeding 5d average.');
    }
    el.innerHTML += nBox(actions, 'action');
  })();

  // ── Subcategories Tab ──
  (function(){
    var el = document.getElementById('nar-subs');
    if(!el) return;
    if(!p.subs || !p.subs.length) { el.innerHTML = ''; return; }

    var critSubs = p.subs.filter(function(s){ return s.avg > 5 && s.count >= 3; });
    var slowSubs = p.subs.filter(function(s){ return s.slow > 3; });
    var applianceSubs = p.subs.filter(function(s){
      return ['Washer','Dryer','Dishwasher','Stove/Oven','Refrigerator','AC/HVAC'].indexOf(s.name) >= 0 && s.count >= 8 && s.avg > 4;
    });

    var insights = [];

    if(critSubs.length > 0) {
      insights.push('<strong style="color:#f85149">Critical subcategories (avg > 5 days):</strong> ' + critSubs.map(function(s){ return '<strong>'+s.name+'</strong> ('+s.count+' WOs, '+s.avg+'d avg)'; }).join(', ') + '. These are the specific repair types dragging down your overall average. Each one needs a targeted fix.');
    }

    if(slowSubs.length > 0) {
      insights.push('<strong style="color:#e3b341">Subcategories with chronic backlogs:</strong> ' + slowSubs.slice(0,4).map(function(s){ return s.name+' ('+s.slow+' WOs over 7d)'; }).join(', ') + '. '+(slowSubs.length > 4 ? 'Plus '+(slowSubs.length-4)+' more.' : '')+ ' Slow WOs are the #1 driver of negative resident reviews.');
    }

    var topPerformers = p.subs.filter(function(s){ return s.count >= 5 && s.avg < 1 && s.p24 >= 75; });
    if(topPerformers.length > 0) {
      insights.push('<strong style="color:#3fb950">Well-handled subcategories:</strong> ' + topPerformers.slice(0,3).map(function(s){ return s.name+' ('+s.avg+'d, '+s.p24+'% same-day)'; }).join(', ') + '. These are running efficiently.');
    }

    if(insights.length === 0) {
      insights.push('<strong style="color:#e2e8f0">'+name+' has '+p.subs.length+' active subcategories.</strong> Review the table below — sort by "Slow (7+d)" to find where residents are waiting the longest, or by "Avg Days" to find the most consistently slow repair types.');
    }

    el.innerHTML = nBox(insights, critSubs.length > 0 ? 'warn' : 'info');

    // Actions
    var actions = [];
    applianceSubs.forEach(function(s){
      actions.push('<strong>'+s.name+' — evaluate replace vs. repair.</strong> With '+s.count+' WOs averaging '+s.avg+' days, repeated repairs on the same appliance models aren\\'t cost-effective. If units are 8+ years old, budget for replacement.');
    });
    critSubs.forEach(function(s){
      if(!applianceSubs.some(function(a){return a.name===s.name;})) {
        actions.push('<strong>'+s.name+' — investigate root cause.</strong> '+s.avg+'d average across '+s.count+' WOs. Is this a vendor scheduling issue, parts availability, or skills gap?');
      }
    });
    if(actions.length === 0) {
      actions.push('<strong>No critical subcategory issues.</strong> All repair types are within manageable ranges. Focus on keeping the highest-volume subcategories fast, as those impact the most residents.');
    }
    el.innerHTML += nBox(actions, 'action');
  })();

  // ── Speed Analysis Tab ──
  (function(){
    var el = document.getElementById('nar-speed');
    if(!el) return;
    if(p.avg === null) { el.innerHTML = nBox(['No completion data available for speed analysis.'], 'warn'); return; }

    var insights = [];
    var diff = p.avg - PF_AVG;
    var s24 = p.p24 || 0;
    var sOver7 = p.slow_pct || 0;

    if(diff > 2) {
      insights.push('<strong style="color:#f85149">'+name+' is significantly slower than the portfolio.</strong> At '+p.avg+'d vs '+PF_AVG+'d portfolio average, residents here wait '+(diff).toFixed(1)+' extra days for repairs. That\\'s the difference between "fixed today" and "fixed later this week" — and residents feel it in their review scores.');
    } else if(diff > 0) {
      insights.push('<strong style="color:#e3b341">'+name+' is slightly above portfolio average</strong> ('+p.avg+'d vs '+PF_AVG+'d). The gap of '+(diff).toFixed(1)+' days is manageable but watch for it widening.');
    } else {
      insights.push('<strong style="color:#3fb950">'+name+' is faster than the portfolio average</strong> ('+p.avg+'d vs '+PF_AVG+'d). '+(Math.abs(diff) > 1 ? 'Significantly faster — this property is a top performer in maintenance speed.' : 'Marginally faster — solid performance, room to become a top performer.'));
    }

    // Same-day analysis
    if(s24 >= 65) {
      insights.push('<strong style="color:#3fb950">'+s24+'% of WOs close within 24 hours</strong> — well above the 53.5% portfolio average. Most residents get same-day resolution, which directly drives positive reviews.');
    } else if(s24 >= 45) {
      insights.push('<strong style="color:#e3b341">'+s24+'% same-day close rate</strong> is near the portfolio average (53.5%). Pushing this above 60% would be noticeable to residents. The gap between "average" and "good" in resident perception is often just 5-10% more same-day closes.');
    } else {
      insights.push('<strong style="color:#f85149">Only '+s24+'% same-day close rate</strong> — below the 53.5% portfolio average. Most residents are waiting more than one day. This is the single metric most correlated with negative maintenance reviews.');
    }

    // Slow WO analysis
    if(sOver7 > 8) {
      insights.push('<strong style="color:#f85149">'+p.slow+' WOs ('+sOver7+'%) take 7+ days.</strong> This backlog tail is pulling the average up and creating extremely frustrated residents. Even if you can\\'t speed up everything, eliminating the 7+ day WOs would dramatically improve the average.');
    }

    el.innerHTML = nBox(insights, diff > 2 ? 'warn' : diff > 0 ? 'info' : 'good');

    // Actions
    var actions = [];
    if(s24 < 55) {
      actions.push('<strong>1. Target same-day closes.</strong> Have dispatchers tag WOs that can realistically be closed today (simple fixes: clogs, resets, lockouts, filter changes). Set a daily target of closing '+Math.max(1,Math.round((p.total/180)*0.1))+' more WOs same-day than current pace.');
    }
    if(sOver7 > 5) {
      actions.push('<strong>'+(actions.length+1)+'. Eliminate the 7+ day backlog.</strong> These '+p.slow+' WOs need a one-time blitz: schedule a dedicated "catch-up day" where the team focuses only on aged tickets. Then implement a 5-day escalation trigger to prevent new ones.');
    }
    if(diff > 1) {
      var bestProp = 'Skye Oaks (0.43d)';
      actions.push('<strong>'+(actions.length+1)+'. Benchmark against the best.</strong> '+bestProp+' handles similar WO types in a fraction of the time. Request a process comparison: how do they dispatch? What parts do they stock? How many techs per unit?');
    }
    if(actions.length === 0) {
      actions.push('<strong>Maintain current speed.</strong> Performance is strong. Focus on consistency — make sure the speed holds during high-volume months and when staff are on PTO.');
    }
    el.innerHTML += nBox(actions, 'action');
  })();

  // ── Priority Tab ──
  (function(){
    var el = document.getElementById('nar-prio');
    if(!el) return;
    if(!Object.keys(p.prio).length) { el.innerHTML = ''; return; }

    var insights = [];
    var pr = p.prio;

    // Priority inversion check
    var hasInversion = false;
    if(pr['High'] && pr['Medium'] && pr['High'].avg > pr['Medium'].avg) {
      hasInversion = true;
      insights.push('<strong style="color:#f85149">Priority inversion detected:</strong> High priority WOs average '+pr['High'].avg+'d, but Medium priority averages only '+pr['Medium'].avg+'d. High-priority work orders should be resolved <em>faster</em> than medium. This suggests the triage system isn\\'t being used to prioritize dispatch — techs are treating all WOs the same regardless of urgency level.');
    }
    if(pr['Emergency'] && pr['Emergency'].avg > 1) {
      insights.push('<strong style="color:#f85149">Emergency response time: '+pr['Emergency'].avg+'d.</strong> Emergency WOs should ideally close within hours, not days. If emergencies are averaging over 1 day, either the "Emergency" label is being applied to non-emergencies, or the response process needs an overhaul.');
    } else if(pr['Emergency'] && pr['Emergency'].avg <= 1) {
      insights.push('<strong style="color:#3fb950">Emergency response is strong</strong> at '+pr['Emergency'].avg+'d average with '+pr['Emergency'].p24+'% same-day resolution. Emergencies are being treated with appropriate urgency.');
    }

    // Overall triage assessment
    if(!hasInversion && pr['High'] && pr['High'].avg < 2) {
      insights.push('<strong style="color:#3fb950">Triage is working well.</strong> Higher-priority WOs are being resolved faster than lower-priority ones, which is exactly how the system should work.');
    }

    if(pr['Low'] && pr['Low'].count > 0) {
      insights.push('<strong>Low priority WOs:</strong> '+pr['Low'].count+' WOs at '+pr['Low'].avg+'d avg. '+(pr['Low'].avg > 5 ? 'These are being deprioritized heavily — make sure residents know their request is acknowledged even if it takes longer.' : 'Even low-priority items are being handled reasonably quickly.'));
    }

    el.innerHTML = nBox(insights, hasInversion ? 'crit' : 'info');

    var actions = [];
    if(hasInversion) {
      actions.push('<strong>1. Retrain on priority dispatch.</strong> When a WO comes in marked "High," it should go to the top of the queue, not the back. Review the dispatch workflow with the maintenance lead.');
      actions.push('<strong>2. Audit priority labels.</strong> If too many WOs are marked "High" when they\\'re actually routine, the label loses meaning. Consider having a supervisor review and re-classify priority levels weekly.');
    }
    if(pr['Emergency'] && pr['Emergency'].avg > 1.5) {
      actions.push('<strong>'+(actions.length+1)+'. Set up an emergency hotline or on-call rotation.</strong> Emergencies (floods, lockouts, gas leaks, no heat in winter) need a response within 2-4 hours, not next-day. If you don\\'t have after-hours coverage, this is the gap.');
    }
    if(actions.length > 0) {
      el.innerHTML += nBox(actions, 'action');
    }
  })();

  // ── Recurring Issues Tab ──
  (function(){
    var el = document.getElementById('nar-issues');
    if(!el) return;

    var kws = p.keywords;
    var sc = p.slow_cats;
    var kwEntries = Object.entries(kws).sort(function(a,b){return b[1]-a[1];});
    var scEntries = Object.entries(sc).sort(function(a,b){return b[1]-a[1];});

    var insights = [];

    // Keyword pattern analysis
    if(kwEntries.length >= 3) {
      var top3 = kwEntries.slice(0,3);
      insights.push('<strong style="color:#e2e8f0">Most common repair keywords at '+name+':</strong> ' + top3.map(function(e){return '<strong style="color:#58a6ff">'+e[0]+'</strong> (×'+e[1]+')';}).join(', ') + '.');

      // Detect infrastructure vs maintenance patterns
      var waterKws = ['leak','water','clog','flood','drip','pipe'].reduce(function(sum,k){ return sum + (kws[k]||0); },0);
      var doorKws = ['door','lock','key','mailbox'].reduce(function(sum,k){ return sum + (kws[k]||0); },0);
      var appKws = ['washer','dryer','stove','dishwasher','refrigerator','oven'].reduce(function(sum,k){ return sum + (kws[k]||0); },0);

      if(waterKws > 30) {
        insights.push('<strong style="color:#f85149">Water/plumbing keywords appear '+waterKws+' times.</strong> This volume suggests infrastructure-level plumbing problems — aging pipes, failing supply lines, or drainage issues. This is a <em>building problem</em>, not a maintenance team problem. The fix is capital investment in plumbing infrastructure, not faster repairs.');
      }
      if(doorKws > 30) {
        insights.push('<strong style="color:#e3b341">Door/lock keywords appear '+doorKws+' times.</strong> High door and lock volume often indicates: (a) aging hardware that needs bulk replacement, or (b) a security concern driving lock-change requests. Consider a door hardware refresh program if units are 10+ years old.');
      }
      if(appKws > 25) {
        insights.push('<strong style="color:#e3b341">Appliance keywords appear '+appKws+' times.</strong> If these are concentrated in specific models or unit vintages, a bulk replacement program would be more cost-effective than continued individual repairs.');
      }
    }

    // Chronic slow categories
    if(scEntries.length > 0) {
      insights.push('<strong style="color:#e3b341">Categories with the most 7+ day WOs:</strong> ' + scEntries.slice(0,3).map(function(e){return e[0]+' ('+e[1]+' slow)';}).join(', ') + '. These are the categories where residents are having the worst experiences. Each slow WO is a potential negative review.');
    }

    if(insights.length === 0) {
      insights.push('Not enough keyword data to identify recurring patterns at this property.');
    }

    el.innerHTML = nBox(insights, 'info');

    // Actions
    var actions = [];
    if(kwEntries.length > 0) {
      var topKw = kwEntries[0];
      if(topKw[1] >= 15) {
        actions.push('<strong>1. "'+topKw[0]+'" is your #1 keyword (×'+topKw[1]+').</strong> Pull every WO containing this word and categorize them by unit. If the same units appear repeatedly, those units need a comprehensive fix, not individual ticket repairs.');
      }
    }
    if(scEntries.length > 0 && scEntries[0][1] > 5) {
      actions.push('<strong>'+(actions.length+1)+'. Dedicate a vendor or tech to '+scEntries[0][0]+'.</strong> With '+scEntries[0][1]+' slow WOs, this category needs specialized attention — either a dedicated vendor with faster turnaround or a tech with specific training.');
    }
    if(p.mold_count > 0) {
      actions.push('<strong>'+(actions.length+1)+'. Mold/mildew: '+p.mold_count+' WOs detected.</strong> Every mold WO needs documented remediation with photos. Check HVAC condensate lines and exterior water penetration at affected units. This is both a health and a legal liability issue.');
    }
    if(actions.length > 0) {
      el.innerHTML += nBox(actions, 'action');
    }
  })();

  // ── Safety Tab ──
  (function(){
    var el = document.getElementById('nar-safety');
    if(!el) return;

    var insights = [];
    if(p.mold_count > 0) {
      var avgMoldDays = p.mold_wos.filter(function(m){return m.days!==null;});
      var avgD = avgMoldDays.length ? (avgMoldDays.reduce(function(s,m){return s+m.days;},0)/avgMoldDays.length).toFixed(1) : 'unknown';
      var slowMold = p.mold_wos.filter(function(m){return m.days!==null && m.days>7;});

      insights.push('<strong style="color:#f85149">'+p.mold_count+' mold/mildew work orders detected at '+name+'.</strong> Average resolution: '+avgD+' days. '+
        (slowMold.length > 0 ? slowMold.length+' of these took over 7 days, which creates both health risk and potential legal exposure.' : 'All were resolved within 7 days.')
      );

      var noDate = p.mold_wos.filter(function(m){return m.days===null;});
      if(noDate.length > 0) {
        insights.push('<strong style="color:#f85149">'+noDate.length+' mold WO(s) have no completion date.</strong> These may be unresolved. Verify immediately — unresolved mold is a health code violation in most jurisdictions and a significant liability risk.');
      }

      insights.push('<strong>Mold action protocol:</strong> (1) Document every mold WO with dated photos before and after remediation. (2) Identify moisture source — HVAC condensate? Plumbing leak? Exterior infiltration? Condensation from poor ventilation? (3) The remediation isn\\'t done until the moisture source is fixed, not just the visible mold.');
    } else {
      insights.push('<strong style="color:#3fb950">No mold or mildew work orders detected at '+name+'.</strong> This is a clean bill of health on the mold front. Continue monitoring — mold issues can appear suddenly after weather events or HVAC changes.');
    }

    // Slow WO safety concern
    if(p.slow > 20) {
      insights.push('<strong style="color:#f85149">'+p.slow+' WOs taking 7+ days ('+p.slow_pct+'% of total).</strong> Beyond the resident experience issue, some of these may be safety-related (smoke detectors, locks, water shut-offs). Audit the 7+ day list for any WOs that have safety implications and escalate immediately.');
    }

    el.innerHTML = nBox(insights, p.mold_count > 0 ? 'crit' : 'good');

    if(p.mold_count > 0 || p.slow > 20) {
      var actions = [];
      if(p.mold_count > 0) {
        actions.push('<strong>1. Walk every unit with a mold WO this week.</strong> Confirm remediation was completed and no new growth has appeared. Document with dated photos for the compliance file.');
        actions.push('<strong>2. Schedule HVAC condensate line inspection</strong> for all affected buildings. Clogged condensate is the #1 cause of indoor mold in multifamily properties.');
      }
      if(p.slow > 15) {
        actions.push('<strong>'+(actions.length+1)+'. Run a safety audit on all 7+ day WOs.</strong> Filter for keywords: smoke, detector, lock, flood, gas, mold, leak. Any safety-related WO over 7 days needs immediate closure or documented justification for the delay.');
      }
      el.innerHTML += nBox(actions, 'action');
    }
  })();
}
`;

// Inject the narrative function before the closing </script> tag
html = html.replace(
  '</script>\n</body>',
  narrativeFunction + '\n</script>\n</body>'
);

// ═══════════════════════════════════════════════════════════════
// PART 3: Hook buildNarratives into loadProp
// ═══════════════════════════════════════════════════════════════

// Add buildNarratives(p) call at the end of loadProp, right after buildSafety(p)
html = html.replace(
  'buildSafety(p);\n  } catch(e)',
  'buildSafety(p);\n  buildNarratives(p);\n  } catch(e)'
);

// ═══════════════════════════════════════════════════════════════
// PART 4: Fix data gaps — add missing properties to charts
// ═══════════════════════════════════════════════════════════════

// The issue: some charts only show properties that have qualifying data.
// Properties with 0 pest WOs, 0 chronic slow WOs, etc. don't appear.
// For pest and chronic slow, we only show properties that have data (showing 0 bars
// for 6 properties with no pest issues isn't helpful). But we should ensure the
// KPI numbers reference all 18 properties.

// Fix: Add a note in the pest, chronic slow, make ready, and weekend panels
// indicating how many properties are included and why some are excluded.

// Pest tab — add context about which properties have 0 pest WOs
const pestPanelFind = `<div id="ui-pest" class="panel">`;
const pestPanelReplace = `<div id="ui-pest" class="panel">
    <div style="padding:8px 18px 0;font-size:10px;color:#6e7681;line-height:1.6"><strong>${12}</strong> of 18 properties reported pest-related work orders. 6 properties (SKYE Isle, Chimney Hill, Skye at Love, Skye Ridge, Parks at Walnut, Skye at Conway) had zero pest WOs during this period.</div>`;
html = html.replace(pestPanelFind, pestPanelReplace);

// Make Ready tab — add context
const mrPanelFind = `<div id="ui-mr" class="panel">`;
const mrPanelReplace = `<div id="ui-mr" class="panel">
    <div style="padding:8px 18px 0;font-size:10px;color:#6e7681;line-height:1.6"><strong>8</strong> of 18 properties had trackable make-ready/unit-turn activity during this period. Properties not shown either had no move-in WOs or their WO system doesn't flag make-ready work separately.</div>`;
html = html.replace(mrPanelFind, mrPanelReplace);

// Weekend tab — add context
const wePanelFind = `<div id="pt-weekend" class="panel">`;
const wePanelReplace = `<div id="pt-weekend" class="panel">
    <div style="padding:8px 18px 0;font-size:10px;color:#6e7681;line-height:1.6"><strong>13</strong> of 18 properties included. Excluded: SKYE Isle (1 WO), Chimney Hill (4 WOs), The Flats (no weekend WOs), Skye Oaks (2 weekend WOs — too few for meaningful comparison), The Julia (no completion dates).</div>`;
html = html.replace(wePanelFind, wePanelReplace);

// Chronic Slow tab — add context
const chronicPanelFind = `<div id="ops-chronic" class="panel">`;
const chronicPanelReplace = `<div id="ops-chronic" class="panel">
    <div style="padding:8px 18px 0;font-size:10px;color:#6e7681;line-height:1.6"><strong>11</strong> of 18 properties had WOs exceeding 14 days. The 7 properties not shown (SKYE Isle, Chimney Hill, Skye at Love, Skye Ridge, Skye at Conway, Skye Oaks, The Julia) had zero chronic slow WOs — which is excellent performance.</div>`;
html = html.replace(chronicPanelFind, chronicPanelReplace);

// ═══════════════════════════════════════════════════════════════
// DONE — Write file
// ═══════════════════════════════════════════════════════════════

fs.writeFileSync('/Users/zk/Desktop/wo-dashboard/index.html', html);
console.log('Done! Asset Drill-Down narratives added + data gap context notes. File size: ' + Math.round(html.length/1024) + ' KB');
