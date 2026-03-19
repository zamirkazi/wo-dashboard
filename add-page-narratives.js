// add-page-narratives.js — Adds narrative summaries to the original 8 dashboard pages
const fs = require('fs');
let html = fs.readFileSync('/Users/zk/Desktop/wo-dashboard/index.html', 'utf-8');

function ib(items, style) {
  const colors = {
    crit: { bg:'#1c1010', border:'#3d1515', accent:'#f85149', tag:'ACTION REQUIRED' },
    warn: { bg:'#1c1a10', border:'#3d3515', accent:'#e3b341', tag:'WATCH LIST' },
    good: { bg:'#0d1310', border:'#1a3020', accent:'#3fb950', tag:'STRONG PERFORMANCE' },
    info: { bg:'#0d1117', border:'#21262d', accent:'#58a6ff', tag:'KEY INSIGHT' },
    action: { bg:'#10101c', border:'#15153d', accent:'#a371f7', tag:'RECOMMENDED ACTIONS' },
    guide: { bg:'#0d1117', border:'#21262d', accent:'#56d4dd', tag:'HOW TO READ THIS PAGE' }
  };
  const c = colors[style] || colors.info;
  const body = items.map(i => `<div style="margin-bottom:6px">${i}</div>`).join('');
  return `<div style="background:${c.bg};border:1px solid ${c.border};border-radius:8px;padding:14px 16px;margin-bottom:12px;border-left:3px solid ${c.accent}">
    <div style="font-size:9px;font-weight:800;color:${c.accent};text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">${c.tag}</div>
    <div style="font-size:11px;color:#c9d1d9;line-height:1.7">${body}</div></div>`;
}

// ═══════════════════════════════════════════════════════════════
// 1. PORTFOLIO OVERVIEW — After header, before KPI row
// ═══════════════════════════════════════════════════════════════
const portfolioNarrative = `<div style="padding:0 18px 8px">
${ib([
  `<strong style="color:#e2e8f0">This page shows your entire 18-property portfolio at a glance.</strong> The KPIs above are the numbers your leadership team should track monthly. The three tabs below break the data down by time (Trends), repair type (Categories), and individual property (Properties).`,
  `<strong>How to use this page:</strong> Start with the KPIs — if the portfolio average is above 3.5 days or same-day close rate is below 50%, something systemic needs attention. Then check Trends to see if you're improving or declining. Categories shows where the portfolio is struggling. Properties shows who's pulling the average up or down.`
], 'guide')}
${ib([
  `<strong style="color:#3fb950">Portfolio speed improved 59% over 6 months</strong> — from 4.22d avg in September to 1.71d in February. This is a significant operational improvement. Whatever changes were made in Q4 2025 are working.`,
  `<strong style="color:#e3b341">53.5% same-day close rate means roughly half of residents wait more than a day.</strong> Industry top-performers close 65-70% same-day. Closing the gap from 53% to 65% would meaningfully improve resident satisfaction scores.`,
  `<strong style="color:#f85149">32 mold WOs across 5 properties is the biggest compliance risk in this portfolio.</strong> 9 of these are at The Julia with no completion date — they may be unresolved. Mold is a habitability issue with legal liability in most jurisdictions.`,
  `<strong style="color:#e2e8f0">The gap between best and worst is enormous:</strong> Skye Oaks (0.43d avg, 88% same-day, zero slow WOs) vs Hanley Place (5.55d avg, 32% same-day, 164 slow WOs). Same portfolio, very different execution. The best property proves the standard is achievable.`
], 'info')}
${ib([
  `<strong>1. Weekly ops review: use the Scorecard page.</strong> Sort by Slow WOs column to immediately identify which properties need intervention this week.`,
  `<strong>2. Monthly deep-dive: use the Asset Drill-Down.</strong> Pick the 3 worst-performing properties and review their Subcategories tab to find exactly which repair types are dragging them down.`,
  `<strong>3. Immediate action: The Julia mold WOs.</strong> Confirm whether those 9 mold WOs are actually resolved. If not, remediation needs to start this week.`,
  `<strong>4. Hanley Place needs a staffing intervention.</strong> 27% of their WOs take 7+ days. No amount of process improvement fixes this without adequate maintenance capacity.`
], 'action')}
</div>`;

html = html.replace(
  `</div>\n  <div class="kpi-row k5">\n    <div class="kpi kb"><div class="kl">Total Work Orders</div><div class="kv">5,381`,
  `</div>\n${portfolioNarrative}  <div class="kpi-row k5">\n    <div class="kpi kb"><div class="kl">Total Work Orders</div><div class="kv">5,381`
);

// Add narratives to each Portfolio sub-tab
// Trends tab
html = html.replace(
  `<div id="ov-trends" class="panel active">\n    <div class="g2">`,
  `<div id="ov-trends" class="panel active">
    <div style="padding:12px 18px 4px">
    ${ib([
      '<strong style="color:#e2e8f0">These charts show the portfolio-wide trend over 6 months.</strong> The top-left chart (Avg Completion Days) is the most important — it should be going down over time. The top-right (% in 24h) should be going up.',
      '<strong style="color:#3fb950">September started rough at 4.22 days average, but February closed at 1.71 days.</strong> The improvement was steady, not a one-time jump. This suggests process improvements are taking hold.',
      '<strong style="color:#e3b341">Volume peaked in September (1,002 WOs) and has been lower since.</strong> If the lower volume is driving the speed improvement (fewer WOs = faster response), the speed gains may not hold if volume returns to September levels. Watch whether speed holds as spring volume picks up.'
    ], 'info')}
    </div>
    <div class="g2">`
);

// Categories tab
html = html.replace(
  `<div id="ov-cats" class="panel">\n    <div class="g2">\n      <div class="card"><div class="ct"><span class="dot db"></span>Category Volume`,
  `<div id="ov-cats" class="panel">
    <div style="padding:12px 18px 4px">
    ${ib([
      '<strong style="color:#e2e8f0">Category charts show which repair types dominate the portfolio.</strong> The "Risk Matrix" bubble chart (bottom-right) is the most actionable — categories in the upper-right (high volume AND slow speed) are your biggest problems.',
      '<strong style="color:#f85149">Appliances are the biggest pain point:</strong> highest volume AND one of the slowest categories. Washers (5.25d avg), dishwashers (6.41d), and dryers (5.66d) are the worst offenders. These are all mechanical items where parts availability often drives the delay.',
      '<strong style="color:#3fb950">HVAC is the success story:</strong> high volume (353 WOs) but fast resolution (1.71d avg, 65% same-day). This proves that high-volume categories CAN be handled quickly with the right parts and vendor relationships.'
    ], 'info')}
    </div>
    <div class="g2">
      <div class="card"><div class="ct"><span class="dot db"></span>Category Volume`
);

// Properties tab
html = html.replace(
  `<div id="ov-props" class="panel">\n    <div class="gfull">`,
  `<div id="ov-props" class="panel">
    <div style="padding:12px 18px 4px">
    ${ib([
      '<strong style="color:#e2e8f0">This tab ranks all 18 properties side by side.</strong> The bar charts below the table make it easy to spot the outliers. Properties on the far right of "Avg Days" are your problem children.',
      '<strong style="color:#f85149">Three properties need immediate intervention:</strong> Hanley Place (5.55d, 164 slow WOs), The Flats (5.43d, 20% of WOs over 7 days), and Skye Reserve (5.18d, 120 slow WOs). Together these three properties account for 73% of all slow WOs in the portfolio.',
      '<strong style="color:#3fb950">Six properties are performing at or above standard:</strong> Skye Oaks, Skye at Love, Skye at Conway, Parks at Walnut, Ninety-Nine44 on Walnut, and RAM Riverwalk. These should be studied as models for the underperformers.'
    ], 'info')}
    </div>
    <div class="gfull">`
);

// ═══════════════════════════════════════════════════════════════
// 2. SUBCATEGORIES PAGE — After header, before KPI row
// ═══════════════════════════════════════════════════════════════
const subcatsNarrative = `<div style="padding:0 18px 8px">
${ib([
  `<strong style="color:#e2e8f0">This page drills into specific repair types across the entire portfolio.</strong> While the Portfolio page shows categories (Plumbing, Appliances, HVAC), this page shows <em>subcategories</em> — the exact repair: Toilet vs Sink vs Water Heater, Washer vs Dryer vs Dishwasher.`,
  `<strong>Why this matters:</strong> "Plumbing is slow" isn't actionable. "Tub/Shower repairs take 4.23 days and have 31 slow WOs" is. Each tab below covers one major category. The "All Subcategories" tab shows everything ranked together.`
], 'guide')}
${ib([
  `<strong style="color:#f85149">Dishwasher is the slowest subcategory</strong> at 6.41 avg days with 24 slow WOs. This is almost certainly a parts issue — dishwasher repairs frequently require ordering specific components. Consider stocking common dishwasher parts (pumps, door latches, spray arms) locally.`,
  `<strong style="color:#f85149">Washer has the most slow WOs: 34.</strong> At 5.25 avg days, washers are consistently problematic. For units with 3+ washer WOs, the appliance has reached end-of-life and should be replaced rather than repaired.`,
  `<strong style="color:#3fb950">Pest Control is the fastest at 1.13 days</strong> (81% same-day). AC/HVAC is fast too at 1.71 days. These categories show what's possible when vendors and parts are available.`
], 'info')}
${ib([
  `<strong>1. Stock common appliance parts locally.</strong> Dishwasher, washer, and dryer parts delays are the #1 driver of slow WOs. A $2,000 parts inventory would eliminate most of the waiting.`,
  `<strong>2. Set a 3-repair trigger for appliance replacement.</strong> Any appliance with 3+ WOs in 6 months should be flagged for replacement — continued repair is more expensive.`,
  `<strong>3. Use the tables in each tab to identify exact subcategories where same-day rate is below 40%.</strong> Those are the repair types where residents are consistently waiting multiple days.`
], 'action')}
</div>`;

html = html.replace(
  `<p>Specific repair types ranked by volume, speed, and slow-WO count across all properties</p>\n  </div>\n  <div class="kpi-row k4">`,
  `<p>Specific repair types ranked by volume, speed, and slow-WO count across all properties</p>\n  </div>\n${subcatsNarrative}  <div class="kpi-row k4">`
);

// Add tab-specific narratives for subcategory tabs
// Plumbing tab
html = html.replace(
  `<div id="sc-plumbing" class="panel active">\n    <div class="g2">\n      <div class="card"><div class="ct"><span class="dot db"></span>Plumbing Subcategory Volume`,
  `<div id="sc-plumbing" class="panel active">
    <div style="padding:12px 18px 4px">
    ${ib([
      '<strong style="color:#f85149">Tub/Shower is the plumbing emergency:</strong> 181 WOs at 4.23 days average with 31 slow WOs. That is 31 residents who could not use their shower for a week or more. This drives more negative reviews than any other plumbing subcategory.',
      '<strong style="color:#e3b341">Plumbing General (196 WOs, 3.49d) has 31 slow WOs too.</strong> "General" plumbing means the WO was not categorized specifically — it could be anything. Better categorization at the time of WO creation would help target the actual issue.',
      '<strong style="color:#3fb950">Leak/Water Damage is handled fast (0.88d, 82% same-day).</strong> When leaks are treated as emergencies, they get fixed fast. Apply that same urgency to tub/shower and toilet issues.'
    ], 'info')}
    </div>
    <div class="g2">
      <div class="card"><div class="ct"><span class="dot db"></span>Plumbing Subcategory Volume`
);

// Appliances tab
html = html.replace(
  `<div id="sc-appliances" class="panel">\n    <div class="g2">\n      <div class="card"><div class="ct"><span class="dot db"></span>Appliance Subcategory Volume`,
  `<div id="sc-appliances" class="panel">
    <div style="padding:12px 18px 4px">
    ${ib([
      '<strong style="color:#f85149">Appliances are the single biggest category driving slow WOs.</strong> Dishwasher (6.41d), Dryer (5.66d), and Washer (5.25d) are all above 5 days average. Residents without a working washer or dishwasher for 5+ days are extremely frustrated.',
      '<strong style="color:#e3b341">The pattern across all appliance types is the same:</strong> initial dispatch is fast, but the repair stalls waiting for parts or a specialized vendor. The fix is upstream — parts stocking and vendor SLAs, not faster dispatch.',
      '<strong style="color:#e2e8f0">Stove/Oven is the highest-volume appliance (237 WOs)</strong> at 2.42d avg — not great but manageable. AC/HVAC (353 WOs at 1.71d) proves appliances CAN be resolved fast when the right parts are available.'
    ], 'info')}
    </div>
    <div class="g2">
      <div class="card"><div class="ct"><span class="dot db"></span>Appliance Subcategory Volume`
);

// ═══════════════════════════════════════════════════════════════
// 3. COMPARE PAGE — After header
// ═══════════════════════════════════════════════════════════════
const compareNarrative = `<div style="padding:0 18px 8px">
${ib([
  `<strong style="color:#e2e8f0">This page lets you compare all properties on a single repair type.</strong> Pick a subcategory (e.g., "AC/HVAC" or "Toilet") from the buttons below, then switch between 4 view modes to analyze performance.`,
  `<strong>Which view to use:</strong> <strong style="color:#58a6ff">Bar Charts</strong> for a quick visual. <strong style="color:#58a6ff">Data Table</strong> for exact numbers and letter grades (best for reports). <strong style="color:#58a6ff">Radar</strong> to see which properties are well-rounded vs lopsided. <strong style="color:#58a6ff">Heat Map</strong> to see ALL subcategories × ALL properties at once — green=fast, red=slow. If an entire column is red, that subcategory has a portfolio-wide problem.`,
  `<strong style="color:#e3b341">Look for patterns, not just outliers.</strong> If one property is slow on Toilets, that's a property issue. If ALL properties are slow on Toilets, that's a vendor, parts, or skills issue that needs a portfolio-wide solution.`
], 'guide')}
</div>`;

html = html.replace(
  `<p>Pick a subcategory and a view style — compare all properties on that single repair type</p>\n  </div>\n  <div style="padding:12px 18px 0;display:flex`,
  `<p>Pick a subcategory and a view style — compare all properties on that single repair type</p>\n  </div>\n${compareNarrative}  <div style="padding:12px 18px 0;display:flex`
);

// ═══════════════════════════════════════════════════════════════
// 4. MAKE READY PAGE — After header, before KPI row
// ═══════════════════════════════════════════════════════════════
const makereadyNarrative = `<div style="padding:0 18px 8px">
${ib([
  `<strong style="color:#e2e8f0">Make-ready speed directly translates to revenue.</strong> Every day a unit sits vacant during a turn is a day of lost rent. At an average rent of $1,500/month ($50/day), even small improvements in turn speed add up across dozens of annual turns.`,
  `<strong style="color:#3fb950">Skye Oaks sets the standard: 0.28 day average, 100% same-day.</strong> Their make-ready process gets units market-ready within hours, not days. RAM Riverwalk is close behind at 0.81 days. These two prove that same-day make-ready is achievable.`,
  `<strong style="color:#f85149">Nightingale on 25th at 9.6 days average costs ~$480/unit in vacancy.</strong> With an estimated 14 turns in 6 months, that's roughly $6,700 in lost revenue from slow make-ready alone. Fixing this is one of the highest-ROI actions available.`,
  `<strong style="color:#e3b341">Skye Reserve's 30.9 day average is almost certainly a stuck/zombie WO</strong> — one forgotten ticket dragging the number up. Audit and close it, and their real average will likely be much better.`
], 'info')}
${ib([
  `<strong>1. Create a make-ready checklist and timeline.</strong> Define what "make-ready" means (clean, paint, fix, inspect) and set a standard timeline: 1 day for express turns, 3 days for full turns. Track against the standard.`,
  `<strong>2. Pre-stage make-ready supplies.</strong> Paints, cleaning supplies, common replacement items (light bulbs, outlet covers, door stops) should be ready before the resident moves out, not ordered after.`,
  `<strong>3. Nightingale on 25th: audit the 3 make-ready WOs.</strong> At 9.6 days avg with 0% same-day, there's likely a process bottleneck — waiting for move-out inspection? Waiting for vendor scheduling? Identify and fix.`
], 'action')}
</div>`;

html = html.replace(
  `<p>Unit turn speed directly impacts vacancy days and lost revenue. Every extra day is a day of rent not collected.</p>\n  </div>\n  <div class="kpi-row k4">`,
  `<p>Unit turn speed directly impacts vacancy days and lost revenue. Every extra day is a day of rent not collected.</p>\n  </div>\n${makereadyNarrative}  <div class="kpi-row k4">`
);

// ═══════════════════════════════════════════════════════════════
// 5. MOLD & SAFETY PAGE — After header, before KPI row
// ═══════════════════════════════════════════════════════════════
const moldNarrative = `<div style="padding:0 18px 8px">
${ib([
  `<strong style="color:#f85149">This page tracks your highest-liability maintenance items.</strong> Mold and mildew are habitability issues with legal consequences. Smoke/CO detector delays are life-safety compliance gaps. Every item on this page should be reviewed monthly by a property manager or regional director.`,
  `<strong style="color:#f85149">The Julia's 9 mold WOs with no completion date are the single biggest risk in this portfolio.</strong> If these are actually unresolved, you have 9 units with potentially active mold growth and no documentation of remediation. This needs to be confirmed this week — not next month.`,
  `<strong style="color:#e3b341">The Boardwalk has 9 mold WOs — the most of any property with completion data.</strong> Two separate bedrooms reported "growth growing" — this isn't random. It's a building moisture problem (likely HVAC condensate or exterior water penetration) that will keep generating WOs until the root cause is fixed.`,
  `<strong style="color:#e3b341">Upland Townhomes' 13-day mold WO (Feb 13–26) is a compliance concern.</strong> Mold should be remediated within 48-72 hours of report. 13 days means either the scope was larger than expected (requiring professional remediation) or it was deprioritized. Either way, documentation is critical.`
], 'crit')}
${ib([
  `<strong>1. The Julia: Confirm status of all 9 mold WOs by end of this week.</strong> If unresolved, engage a licensed mold remediation vendor immediately. Document everything — photos, air quality tests, remediation reports.`,
  `<strong>2. The Boardwalk: Schedule a building moisture assessment.</strong> 9 mold WOs in 5 months = systemic issue. Check: HVAC condensate drain lines, bathroom exhaust fan function, exterior wall/window seals, roof/gutter drainage near affected units.`,
  `<strong>3. All properties: Implement a mold response protocol.</strong> (a) Initial response within 24 hours. (b) Professional assessment within 48 hours. (c) Remediation within 72 hours. (d) Post-remediation moisture check at 30 days.`,
  `<strong>4. Smoke detector WOs: Any taking 7+ days should trigger an incident report.</strong> Non-functional smoke detectors are a fire code violation. The 3 slow responses at Skye Reserve (avg 26 days) need immediate audit.`
], 'action')}
</div>`;

html = html.replace(
  `<p class="alert">32 mold/mildew WOs detected across 5 properties · 3 smoke detector WOs taking 7+ days · This is a legal liability and habitability issue</p>\n  </div>\n  <div class="kpi-row k4">`,
  `<p class="alert">32 mold/mildew WOs detected across 5 properties · 3 smoke detector WOs taking 7+ days · This is a legal liability and habitability issue</p>\n  </div>\n${moldNarrative}  <div class="kpi-row k4">`
);

// ═══════════════════════════════════════════════════════════════
// 6. PRIORITY PAGE — After header, before KPI row
// ═══════════════════════════════════════════════════════════════
const priorityNarrative = `<div style="padding:0 18px 8px">
${ib([
  `<strong style="color:#e2e8f0">This page shows whether your triage system is actually working.</strong> If higher-priority WOs are resolved faster than lower-priority ones, your dispatch team is doing their job. If not, priority labels are just labels — they're not changing behavior.`,
  `<strong>How to read the KPIs above:</strong> Emergency (0.93d) is fast — good. High (2.54d) is acceptable but could be faster. Medium (2.43d) is slightly faster than High — that means triage isn't differentiated at these levels. Low (5.03d, only 38.8% same-day) is where residents feel forgotten.`
], 'guide')}
${ib([
  `<strong style="color:#e3b341">High Priority (2.54d) is almost identical to Medium (2.43d).</strong> This means priority classification isn't influencing dispatch speed at these levels. High-priority WOs should be noticeably faster — ideally under 1.5 days.`,
  `<strong style="color:#f85149">Hanley Place: High priority WOs average 6.65 days.</strong> That's not a prioritization problem — it's a capacity crisis. When even "urgent" requests take a week, the maintenance team is overwhelmed.`,
  `<strong style="color:#f85149">Skye Reserve: Low priority WOs average 8.21 days.</strong> While deprioritizing low-urgency items is normal, 8+ days means residents are waiting over a week for cosmetic or minor repairs. They don't know it's "low priority" — they just see nothing happening.`,
  `<strong style="color:#3fb950">Parks at Walnut shows what's possible:</strong> 1.23d for High and 1.04d for Low — fast across ALL priority levels. Their team isn't just triaging well, they're fast enough that triage barely matters.`
], 'info')}
${ib([
  `<strong>1. Set time targets by priority level.</strong> Emergency: 4 hours. High: 24 hours. Medium: 48 hours. Low: 5 business days. Track compliance weekly.`,
  `<strong>2. Hanley Place: immediate staffing review.</strong> 6.65d on High priority = the team cannot keep up. Either add a maintenance tech, add a reliable vendor, or both.`,
  `<strong>3. Automate resident communication for Low priority.</strong> If a Low WO will take 3+ days, send an automatic text: "We've received your request and it's scheduled for [date]." This manages expectations and prevents negative reviews.`,
  `<strong>4. Review the table below for priority inversions.</strong> Any property where Low is faster than High has a misclassification problem — WOs are being labeled incorrectly.`
], 'action')}
</div>`;

html = html.replace(
  `<p>How fast is the portfolio responding based on urgency? Low-priority WOs taking 5+ days are a hidden review risk.</p>\n  </div>\n  <div class="kpi-row k4">\n    <div class="kpi kr"><div class="kl">Emergency Avg Days`,
  `<p>How fast is the portfolio responding based on urgency? Low-priority WOs taking 5+ days are a hidden review risk.</p>\n  </div>\n${priorityNarrative}  <div class="kpi-row k4">\n    <div class="kpi kr"><div class="kl">Emergency Avg Days`
);

// ═══════════════════════════════════════════════════════════════
// 7. SCORECARD PAGE — After header, before table
// ═══════════════════════════════════════════════════════════════
const scorecardNarrative = `<div style="padding:0 0 8px">
${ib([
  `<strong style="color:#e2e8f0">This is your weekly ops review page.</strong> Every property ranked on every metric. Sort by the column that matters most to your current priority. For most teams, <strong>"Slow WOs (7+d)"</strong> is the most actionable — it tells you where residents are having the worst experiences right now.`,
  `<strong>How to read the "Overall" column:</strong> ⭐ Best = benchmark the rest against. Strong/Good = on track, maintain. Monitor/Watch = trending in the wrong direction or has a specific concern (mold, slow make-ready). 🚨 Critical = needs intervention this week.`
], 'guide')}
${ib([
  `<strong style="color:#f85149">Bottom 3 properties account for 73% of all slow WOs:</strong> Hanley Place (164), Skye Reserve (120), and The Boardwalk (71). The remaining 15 properties combined have only 133 slow WOs. This is a concentrated problem, not a portfolio-wide one.`,
  `<strong style="color:#e3b341">The Julia (888 WOs) has NO completion data</strong> — we can't calculate speed metrics. This is the second-highest volume property and we're flying blind on performance. Fixing their PM system to track completion dates is a prerequisite for managing this property.`,
  `<strong style="color:#3fb950">Top 6 properties average under 1.5 days.</strong> Skye Oaks (0.43d), Skye at Love (0.99d), Skye at Conway (1.00d), Parks at Walnut (1.23d), Ninety-Nine44 (1.46d), and RAM Riverwalk (1.61d). These properties resolve most WOs the same day they're submitted.`
], 'info')}
${ib([
  `<strong>1. Focus resources on Hanley Place, Skye Reserve, and The Flats.</strong> These three properties need different interventions: Hanley needs staffing, Skye Reserve needs a WO audit (many are likely stuck/zombie tickets), and The Flats needs process improvement (low volume but very slow).`,
  `<strong>2. Get completion date tracking working at The Julia.</strong> 888 WOs with no speed data means you can't manage what you can't measure. This should be a top IT/operations priority.`,
  `<strong>3. Properties in "Monitor" status should get a check-in every 2 weeks.</strong> They're not failing yet but could slide without attention.`
], 'action')}
</div>`;

html = html.replace(
  `<p>All properties ranked across 5 key metrics · Click property tabs in the nav for individual drill-downs</p>\n  </div>\n  <div style="padding:14px 18px">\n    <div class="gfull"><div class="card">`,
  `<p>All properties ranked across 5 key metrics · Click property tabs in the nav for individual drill-downs</p>\n  </div>\n  <div style="padding:14px 18px">\n${scorecardNarrative}    <div class="gfull"><div class="card">`
);

// ═══════════════════════════════════════════════════════════════
// 8. REVIEWS PAGE — After header, before content
// ═══════════════════════════════════════════════════════════════
const reviewsNarrative = `<div style="padding:0 0 8px">
${ib([
  `<strong style="color:#e2e8f0">This page connects work order performance directly to resident reviews.</strong> The research is clear: maintenance response time is the #1 factor in apartment review scores, ahead of amenities, location, and price. A 1-star review typically follows a 7+ day WO, not a 1-day WO.`,
  `<strong>The math:</strong> A single 1-star review requires 8-10 five-star reviews to offset. Preventing one bad maintenance experience is worth more than earning several good ones. That's why eliminating slow WOs matters more than speeding up already-fast ones.`
], 'guide')}
${ib([
  `<strong style="color:#f85149">Appliance downtime is the #1 review killer.</strong> Washers (5.25d), dishwashers (6.41d), and dryers (5.66d) leave residents without essential daily-use items. A resident without a working washer for a week WILL mention it in their next review.`,
  `<strong style="color:#f85149">Unresolved mold creates the most damaging reviews.</strong> Mold reviews mention health concerns and frequently trigger prospective resident anxiety. The Julia's 9 potentially-unresolved mold WOs could generate reviews that damage leasing for months.`,
  `<strong style="color:#3fb950">Properties with 65%+ same-day close rates rarely get negative maintenance reviews.</strong> Skye Oaks (88%), Parks at Walnut (67%), and RAM Riverwalk (67%) are delivering the kind of speed that generates positive mentions.`
], 'info')}
${ib([
  `<strong>1. Appliance loaner program.</strong> If a washer/dryer repair will take 3+ days, offer a temporary portable unit or laundry credit. This turns a negative experience into a "they really took care of me" story.`,
  `<strong>2. Proactive communication on every WO over 48 hours.</strong> A simple text: "We're still working on your [issue]. Here's the current status: [waiting for part / scheduled for Thursday]." Residents don't mind waiting if they know you haven't forgotten.`,
  `<strong>3. After every slow WO (7+ days), have the property manager call the resident.</strong> Apologize, explain what happened, and ask if everything is working. This personal touch often prevents the review entirely.`,
  `<strong>4. Review response strategy:</strong> When a negative maintenance review appears, respond publicly with specifics: "We've since [fixed the issue / hired additional staff / changed our process]. Average maintenance response is now [X] days." This shows prospective residents you take it seriously.`
], 'action')}
</div>`;

html = html.replace(
  `<p>Based on actual WO data — ranked by resident impact and review likelihood</p>\n  </div>\n  <div style="padding:14px 18px">\n    <div class="g2" style="margin-bottom:12px">`,
  `<p>Based on actual WO data — ranked by resident impact and review likelihood</p>\n  </div>\n  <div style="padding:14px 18px">\n${reviewsNarrative}    <div class="g2" style="margin-bottom:12px">`
);

// ═══════════════════════════════════════════════════════════════
// DONE — Write file
// ═══════════════════════════════════════════════════════════════

fs.writeFileSync('/Users/zk/Desktop/wo-dashboard/index.html', html);
console.log('Done! Narratives added to all 8 original pages. File size: ' + Math.round(html.length/1024) + ' KB');
