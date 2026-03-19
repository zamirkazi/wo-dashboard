// add-narratives.js — Adds written summaries, takeaways, and action items to all new sections
const fs = require('fs');
let html = fs.readFileSync('/Users/zk/Desktop/wo-dashboard/index.html', 'utf-8');

// Helper: creates a styled insight card
function insightBox(items, style='info') {
  // style: 'crit' (red), 'warn' (yellow), 'good' (green), 'info' (blue)
  const colors = {
    crit: { bg:'#1c1010', border:'#3d1515', accent:'#f85149', tag:'ACTION REQUIRED' },
    warn: { bg:'#1c1a10', border:'#3d3515', accent:'#e3b341', tag:'MONITOR' },
    good: { bg:'#0d1310', border:'#1a3020', accent:'#3fb950', tag:'WHAT\'S WORKING' },
    info: { bg:'#0d1117', border:'#21262d', accent:'#58a6ff', tag:'KEY TAKEAWAY' },
    action: { bg:'#10101c', border:'#15153d', accent:'#a371f7', tag:'RECOMMENDED ACTIONS' },
  };
  const c = colors[style] || colors.info;
  const body = items.map(item => `<div style="margin-bottom:6px">${item}</div>`).join('');
  return `<div style="background:${c.bg};border:1px solid ${c.border};border-radius:8px;padding:14px 16px;margin-bottom:12px;border-left:3px solid ${c.accent}">
    <div style="font-size:9px;font-weight:800;color:${c.accent};text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">${c.tag}</div>
    <div style="font-size:11px;color:#c9d1d9;line-height:1.7">${body}</div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════════
// UNIT INTEL - HOTSPOTS TAB
// ═══════════════════════════════════════════════════════════════
const hotspotsNarrative = `
    ${insightBox([
      `<strong style="color:#f85149">Parks at Walnut, Unit 2074 has 48 work orders — 3x more than any other unit in the portfolio.</strong> 18 of those are Cook Top/Stove issues. This is almost certainly the same broken stove being "repaired" repeatedly instead of replaced. At an average of $150–$250 per service call, replacing this appliance would have saved $2,000+ by now.`,
      `<strong style="color:#e2e8f0">The Julia dominates the hotspot list</strong> with 12 of the top 30 units. This isn't a few bad units — it's a building-wide maintenance pattern, likely driven by aging systems and high density (3.5 WOs per unit).`,
      `<strong style="color:#e2e8f0">Skye Reserve's hotspot units mostly show "Other" as the top category</strong>, which means WOs aren't being properly categorized there. The data quality issue is masking what's actually failing.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. Replace the stove in Parks at Walnut Unit 2074.</strong> 18 cook top WOs over 6 months = the repair-vs-replace breakpoint was passed months ago.`,
      `<strong>2. Walk the top 10 Julia units this week.</strong> Units 1024, 2042, 2091, 1090 each have 13–23 WOs. A 30-minute walk-through per unit identifying all outstanding issues would consolidate multiple future WOs into single repair visits.`,
      `<strong>3. Fix WO categorization at Skye Reserve.</strong> "Other" as the #1 category in their hotspot units means you can't see what's actually breaking. Require subcategory selection before WO submission.`,
      `<strong>4. Flag any unit with 10+ WOs for a preventative maintenance visit.</strong> These units are generating 2+ WOs per month — faster to fix everything at once than to keep sending techs for individual tickets.`,
    ], 'action')}`;

html = html.replace(
  `<div id="ui-hotspots" class="panel active">
    <div class="kpi-row k4">`,
  `<div id="ui-hotspots" class="panel active">
    <div style="padding:12px 18px 0">${hotspotsNarrative}</div>
    <div class="kpi-row k4">`
);

// ═══════════════════════════════════════════════════════════════
// UNIT INTEL - FCR TAB
// ═══════════════════════════════════════════════════════════════
const fcrNarrative = `<div style="padding:12px 18px 0">
    ${insightBox([
      `<strong style="color:#e2e8f0">First-Call Resolution (FCR) measures whether repairs actually stick.</strong> A 90% FCR means that 1 in 10 work orders results in a callback for the same issue in the same unit within 30 days. Industry benchmark for multifamily maintenance is 92–95%.`,
      `<strong style="color:#f85149">Parks at Walnut has a 56.4% FCR — the worst in the portfolio by a wide margin.</strong> Nearly half of all repairs there fail and need to be redone. This is not a speed problem (their avg is only 1.2 days). It's a quality-of-repair problem: techs are closing tickets without actually resolving the issue.`,
      `<strong style="color:#e3b341">Cook Top (66.7%), Dishwasher (73.7%), and Pest Control (77.9%)</strong> are the three subcategories where repairs fail most often. For appliances, this often means parts are being jury-rigged instead of properly replaced. For pest control, it means the treatment isn't holding — the vendor or treatment method needs to change.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. Audit Parks at Walnut's repair quality.</strong> With 56% FCR, their maintenance team needs retraining or better parts access. Have a supervisor ride along on repairs for one week to identify the pattern.`,
      `<strong>2. Switch pest control vendors at The Julia.</strong> 130 repeat pest WOs (85.3% FCR) across 251 units. The current treatment approach isn't working. Get quotes for a different vendor using gel bait + barrier treatment instead of spray-only.`,
      `<strong>3. For any subcategory under 80% FCR, require a 48-hour follow-up call</strong> to the resident asking "is your [appliance/issue] still working?" before the WO is marked resolved. This catches failures early and shows residents you care.`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="ui-fcr" class="panel">
    <div class="g2" style="margin:0 18px 11px">`,
  `<div id="ui-fcr" class="panel">${fcrNarrative}
    <div class="g2" style="margin:0 18px 11px">`
);

// ═══════════════════════════════════════════════════════════════
// UNIT INTEL - DENSITY TAB
// ═══════════════════════════════════════════════════════════════
const densityNarrative = `<div style="padding:12px 18px 0">
    ${insightBox([
      `<strong style="color:#e2e8f0">WOs per unit tells you which buildings have the heaviest maintenance burden relative to their size.</strong> A ratio over 3.0 means the average unit generates a maintenance request every 2 months — that's very high.`,
      `<strong style="color:#f85149">Park at Peachtree Hills (3.6 WOs/unit) and The Julia (3.5 WOs/unit) lead the portfolio.</strong> But these mean different things: Peachtree has only 27 units, so a handful of chronic units can skew the number. The Julia has 251 units all generating high volume — that's a systemic building condition issue (aging pipes, aging appliances, older building).`,
      `<strong style="color:#3fb950">Skye Oaks (1.6 WOs/unit) manages 116 units with remarkably low density</strong> — proof that well-maintained buildings generate dramatically fewer requests. Their preventative maintenance program should be studied and replicated.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. Properties above 3.0 WOs/unit need a capital improvement assessment.</strong> High density typically means the building's systems are aging past their useful life. Band-aid repairs won't bring the ratio down — budgeting for appliance replacement cycles and plumbing upgrades will.`,
      `<strong>2. At The Boardwalk (3.0 WOs/unit across 204 units), consider a unit-by-unit inspection</strong> of the 30 highest-WO units. Replacing all failing appliances in those units at once is cheaper than 3–5 separate service calls per unit over the next 6 months.`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="ui-density" class="panel">
    <div class="g2" style="margin:0 18px 11px">`,
  `<div id="ui-density" class="panel">${densityNarrative}
    <div class="g2" style="margin:0 18px 11px">`
);

// ═══════════════════════════════════════════════════════════════
// UNIT INTEL - PEST TAB
// ═══════════════════════════════════════════════════════════════
const pestNarrative = `<div style="padding:12px 18px 0">
    ${insightBox([
      `<strong style="color:#f85149">The Julia has 44 pest WOs across 23 units — the worst pest problem in the portfolio.</strong> One unit (1022) required 7 separate treatments, with callbacks every 7–27 days. The treatment is clearly not working. This resident has submitted a pest WO almost every other week for 4 months.`,
      `<strong style="color:#e2e8f0">81% of pest units were resolved with a single treatment</strong> — that's actually a solid baseline. The problem is concentrated in 15 repeat units across 4 properties where the current treatment method is failing. These aren't "new pest issues" — they're the same infestation never fully eliminated.`,
      `<strong style="color:#e3b341">Park at Peachtree Hills Unit C02 has the most telling pattern:</strong> the descriptions read "ANTS", then "ANTs", then "ANTS AGAIN." When a resident writes "AGAIN" in all caps, you've already lost that review.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. Escalate the 15 repeat pest units to a different treatment protocol.</strong> Standard spray isn't working for these units. They need gel bait stations, barrier treatment at entry points, and a building envelope inspection for the specific units where pests keep returning.`,
      `<strong>2. At The Julia, request your pest vendor do a whole-building treatment</strong> rather than unit-by-unit. With 23 affected units, treating one at a time just pushes pests to neighboring units. This is likely why Unit 1022 keeps getting reinfested.`,
      `<strong>3. For any unit with 3+ pest WOs, have the vendor inspect for structural entry points</strong> (gaps in baseboards, pipe penetrations, exterior cracks). Until entry points are sealed, treatment is temporary.`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="ui-pest" class="panel">
    <div class="kpi-row k4"`,
  `<div id="ui-pest" class="panel">
    <div style="padding:12px 18px 0">${pestNarrative}</div>
    <div class="kpi-row k4"`
);

// ═══════════════════════════════════════════════════════════════
// UNIT INTEL - MAKE READY TAB
// ═══════════════════════════════════════════════════════════════
const makeReadyNarrative = `<div style="padding:12px 18px 0">
    ${insightBox([
      `<strong style="color:#f85149">47% of unit turns generated a maintenance callback within 30 days.</strong> That means nearly half of all new move-ins resulted in at least one work order for something that should have been caught during the make-ready process. This is a first-impression failure — the moment a new resident has to submit a WO, your chance at a good review is diminished.`,
      `<strong style="color:#e2e8f0">Doors/Locks is the #1 post-move-in issue across multiple properties</strong> — especially at The Julia (11 door/lock follow-ups after move-ins). This suggests the make-ready checklist either doesn't include testing all locks and doors, or it's being skipped.`,
      `<strong style="color:#3fb950">RAM Preserve has the best turn quality at 38%</strong> — still high, but meaningfully better than the rest. Their process should be the template.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. Add a mandatory 15-point inspection checklist before keys are handed to a new resident.</strong> Must include: test every door lock, run every faucet, flush every toilet, test every burner, run washer/dryer cycle, verify working light in every room, test all outlets in kitchen and bath, verify smoke detectors.`,
      `<strong>2. Require photos of completed make-ready before move-in approval.</strong> This creates accountability and makes it easy to verify the checklist was actually completed.`,
      `<strong>3. Target 25% callback rate as the goal.</strong> Getting from 47% to 25% would eliminate roughly 25 unnecessary WOs per period — saving tech time and dramatically improving first impressions.`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="ui-makeready" class="panel">
    <div class="kpi-row k3"`,
  `<div id="ui-makeready" class="panel">
    <div style="padding:12px 18px 0">${makeReadyNarrative}</div>
    <div class="kpi-row k3"`
);

// ═══════════════════════════════════════════════════════════════
// PATTERNS - SEASONAL TAB
// ═══════════════════════════════════════════════════════════════
const seasonalNarrative = `<div style="padding:12px 18px 0">
    ${insightBox([
      `<strong style="color:#e2e8f0">The portfolio generates roughly 800–1,000 WOs per month.</strong> September 2025 was the peak at 1,002 — driven by late-summer AC demand and back-to-school move-ins. Volume dipped in November (780) and has been steady at 830–900 since.`,
      `<strong style="color:#58a6ff">AC/Cooling is the most seasonal category:</strong> 150 WOs in September dropped to 69 in January, now trending back up (87 in February). By June/July, expect AC volume to double. <strong>Now is the time to service HVAC units proactively</strong> — every AC you tune up in April is one less emergency WO in July.`,
      `<strong style="color:#f85149">Mold/Mildew is trending up:</strong> 1 WO in September → 11 in December → steady 4–6 per month since. This tracks with winter moisture and poor ventilation. If this trend continues into spring, it indicates a building envelope issue at affected properties.`,
      `<strong style="color:#3fb950">Electrical WOs are rising (33 → 65)</strong> — investigate whether this is a seasonal pattern (heaters pulling more power in winter) or an aging infrastructure issue.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. Schedule preventative HVAC servicing across the portfolio in April.</strong> AC volume will start climbing by May. Proactive filter changes and compressor checks now will reduce summer emergency calls by 20–30%.`,
      `<strong>2. Staff up for 900+ WOs/month through summer.</strong> Based on seasonal patterns, expect volume to rise as AC demand increases and turnover season hits.`,
      `<strong>3. Investigate the mold trend.</strong> Properties with rising mold WOs (Boardwalk, Upland, Peachtree Hills) need HVAC condensate line inspections and bathroom exhaust fan testing. Catching this now prevents summer humidity from making it worse.`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="pt-seasonal" class="panel active">
    <div class="kpi-row k4">`,
  `<div id="pt-seasonal" class="panel active">
    <div style="padding:12px 18px 0">${seasonalNarrative}</div>
    <div class="kpi-row k4">`
);

// ═══════════════════════════════════════════════════════════════
// PATTERNS - DOW TAB
// ═══════════════════════════════════════════════════════════════
const dowNarrative = `<div style="padding:12px 18px 0">
    ${insightBox([
      `<strong style="color:#e2e8f0">Monday is the busiest day (21.8% of all WOs) — residents submit pent-up weekend issues first thing Monday morning.</strong> This creates a surge that can overwhelm maintenance teams if not expected. Volume drops steadily through the week, with Friday at 14.8%.`,
      `<strong style="color:#f85149">Skye at Love has a shocking 48.6% weekend submission rate</strong> — nearly half their WOs come in on Saturday and Sunday. Skye Ridge (33.3%) and Skye at Conway (32.8%) also run high. These properties either have active online portals driving weekend submissions, or they have building issues that residents notice when they're home all day.`,
      `<strong style="color:#e3b341">15.1% of all WOs come in on weekends (813 of 5,381).</strong> If your on-call coverage is lighter on weekends, these WOs are piling up for Monday — making the Monday surge even worse.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. Staff Monday mornings heavier than other days.</strong> With 21.8% of weekly volume arriving on Monday, consider scheduling an extra tech or vendor on Monday AM to clear the weekend backlog before it compounds.`,
      `<strong>2. At high-weekend-rate properties (Skye at Love, Skye Ridge), check if weekend submissions are real emergencies or routine requests.</strong> If routine, a simple auto-response ("received — scheduled for Monday") sets expectations and prevents frustration.`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="pt-dow" class="panel">
    <div class="kpi-row k3">`,
  `<div id="pt-dow" class="panel">
    <div style="padding:12px 18px 0">${dowNarrative}</div>
    <div class="kpi-row k3">`
);

// ═══════════════════════════════════════════════════════════════
// PATTERNS - HOUR TAB
// ═══════════════════════════════════════════════════════════════
const hourNarrative = `<div style="padding:12px 18px 0">
    ${insightBox([
      `<strong style="color:#e2e8f0">86.4% of WOs are submitted during business hours (8am–6pm)</strong>, peaking at 10am (424 WOs) when residents have had their morning coffee and are ready to report issues. This is your dispatch window — if techs aren't moving by 9am, you're already behind.`,
      `<strong style="color:#e3b341">13.6% of WOs come in after hours (549 of 4,047 RPM WOs).</strong> The evening hours of 6pm–10pm account for the majority of after-hours volume (351 WOs), as residents come home from work and notice problems.`,
      `<strong style="color:#e2e8f0">Late night submissions (10pm–6am) are rare (~130 total)</strong> but tend to be genuine emergencies — leaks, no heat, lock-outs. These are the ones that need immediate response and drive the most negative reviews if ignored.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. Have your maintenance team start dispatch by 8:30am.</strong> The first WO surge hits at 9am — if the team is still doing morning setup at 9:30, you've already lost 30 minutes of the peak window.`,
      `<strong>2. Set up an auto-triage for after-hours WOs.</strong> Anything submitted after 6pm should get an immediate auto-text acknowledging receipt, with true emergencies (water leak, no heat, lock-out) escalated to on-call and everything else queued for morning dispatch.`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="pt-hour" class="panel">
    <div class="kpi-row k3">`,
  `<div id="pt-hour" class="panel">
    <div style="padding:12px 18px 0">${hourNarrative}</div>
    <div class="kpi-row k3">`
);

// ═══════════════════════════════════════════════════════════════
// PATTERNS - WEEKEND TAB
// ═══════════════════════════════════════════════════════════════
const weekendNarrative = `<div style="padding:12px 18px 0">
    ${insightBox([
      `<strong style="color:#e2e8f0">Surprisingly, weekend-submitted WOs are actually resolved faster on average across the portfolio</strong> (2.21 days vs 3.26 days for weekday WOs). This is likely because weekend submissions skew toward simpler issues that get cleared quickly on Monday, while complex weekday WOs (requiring parts, vendors, or approvals) drag the weekday average up.`,
      `<strong style="color:#f85149">However, The Boardwalk (+1.2 days) and Hanley Place (+1.0 days) buck this trend</strong> — weekend WOs take significantly longer there. This suggests their weekend on-call coverage isn't triaging or pre-staging for Monday effectively, causing a real delay that residents feel.`,
      `<strong style="color:#3fb950">Upland Townhomes and Park at Peachtree Hills actually close weekend WOs faster than weekday ones</strong> — their teams are doing something right with weekend handling. Worth understanding what they do differently.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. At The Boardwalk and Hanley Place, review the weekend-to-Monday handoff process.</strong> A +1 day penalty means weekend WOs are sitting idle instead of being queued for first thing Monday. The on-call person should be triaging and pre-assigning WOs on Sunday evening.`,
      `<strong>2. Replicate whatever Upland and Peachtree Hills are doing for weekend handling</strong> — they've eliminated the weekend penalty entirely, which means residents get the same experience regardless of when they submit.`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="pt-weekend" class="panel">
    <div class="g2" style="margin:0 18px 11px">`,
  `<div id="pt-weekend" class="panel">
    <div style="padding:12px 18px 0">${weekendNarrative}</div>
    <div class="g2" style="margin:0 18px 11px">`
);

// ═══════════════════════════════════════════════════════════════
// OPERATIONS - STAFFING TAB
// ═══════════════════════════════════════════════════════════════
const staffingNarrative = `<div style="padding:12px 18px 0">
    ${insightBox([
      `<strong style="color:#f85149">Three properties are understaffed relative to their WO volume:</strong>`,
      `&nbsp;&nbsp;• <strong style="color:#e2e8f0">Hanley Place</strong> — 3.3 WOs/day, 5.6 avg days to complete, estimated 15-WO backlog at any given time. Their team is running behind every single day. They need at least one additional full-time tech.`,
      `&nbsp;&nbsp;• <strong style="color:#e2e8f0">Skye Reserve</strong> — 5.3 WOs/day, 5.2 avg days. This is the highest volume property in the portfolio with the most severe backlog (22 WOs). The Feb improvement to 1.7 days suggests recent staffing changes helped — keep it.`,
      `&nbsp;&nbsp;• <strong style="color:#e2e8f0">The Flats</strong> — Only 0.2 WOs/day but 5.4 avg days. This is NOT a staffing problem (they only get ~7 WOs/month). This is a process problem — WOs are sitting untouched. Likely no dedicated maintenance person.`,
      `<strong style="color:#3fb950">Skye Oaks processes 1.0 WOs/day and closes in 0.4 days average.</strong> Their staffing-to-volume ratio is the model — they're never behind.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. Add 1 full-time maintenance tech at Hanley Place.</strong> At 100 WOs/month with 5.6 avg days, the current team can't keep up. The math: if one tech handles 4 WOs/day and you're getting 3.3/day, you need almost a full person just for volume. With complexity and callbacks, you need more.`,
      `<strong>2. At The Flats, assign a specific person responsible for that property's WOs.</strong> The volume is tiny (7/month) but the response time is terrible (5.4 days). This is likely falling through the cracks because no one "owns" it.`,
      `<strong>3. Keep whatever staffing change was made at Skye Reserve.</strong> Their avg dropped from 5.0d in December to 1.7d in February — dramatic improvement. Don't pull that resource.`,
      `<strong>4. Budget for seasonal staff.</strong> With 800–1,000 WOs/month and AC season approaching, plan for temp maintenance help May through September at the 3 highest-volume properties (Skye Reserve, The Boardwalk, Hanley Place).`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="ops-staffing" class="panel active">
    <div class="card" style="margin:0 18px 11px">`,
  `<div id="ops-staffing" class="panel active">
    ${staffingNarrative}
    <div class="card" style="margin:0 18px 11px">`
);

// ═══════════════════════════════════════════════════════════════
// OPERATIONS - SCHEDULING TAB
// ═══════════════════════════════════════════════════════════════
const schedNarrative = `<div style="padding:12px 18px 0">
    ${insightBox([
      `<strong style="color:#e2e8f0">Scheduling delay is the hidden bottleneck.</strong> At some properties, more time is spent waiting to be scheduled than actually doing the repair.`,
      `<strong style="color:#f85149">The Flats averages 14.6 days from call to being scheduled</strong> — but only 5.4 days total to complete. This means WOs are sitting in a queue for nearly 10 days before anyone even looks at them. The repair itself isn't slow; the dispatcher is.`,
      `<strong style="color:#e3b341">Hanley Place: 3.5 days to schedule, 5.6 days total.</strong> 63% of the resident's wait time is just getting on the calendar. If you could schedule WOs same-day, their effective completion time would drop to ~2 days.`,
      `<strong style="color:#3fb950">Skye Reserve has 94% scheduling coverage</strong> — nearly every WO gets a scheduled date. This discipline in workflow tracking makes it possible to identify bottlenecks. Properties with 0% scheduling data (Hunters Creek, Peachtree Hills, etc.) are flying blind.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. Require same-day scheduling for all WOs.</strong> Even if the repair can't happen today, putting it on the calendar immediately sets expectations for the resident and prevents WOs from sitting in limbo.`,
      `<strong>2. At The Flats, the dispatching process is broken — not the maintenance.</strong> 14.6 days to schedule a 5-day repair means someone isn't reviewing incoming WOs. Assign a daily morning review of all unscheduled WOs.`,
      `<strong>3. Roll out scheduling tracking to all properties.</strong> Properties using scheduling (Skye Reserve at 94%, Upland at 82%) have much better visibility into bottlenecks than properties without it.`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="ops-scheduling" class="panel">
    <div class="card" style="margin:0 18px 11px">`,
  `<div id="ops-scheduling" class="panel">
    ${schedNarrative}
    <div class="card" style="margin:0 18px 11px">`
);

// ═══════════════════════════════════════════════════════════════
// OPERATIONS - CHRONIC SLOW TAB
// ═══════════════════════════════════════════════════════════════
const slowNarrative = `<div style="padding:12px 18px 0">
    ${insightBox([
      `<strong style="color:#f85149">Skye Reserve has 95 WOs that took 14+ days — 43% of all chronic slow WOs in the portfolio.</strong> Many of these are likely "zombie tickets" — WOs that were resolved in practice but never closed in the system, or WOs waiting on parts/vendors that were forgotten. The longest is 91 days for a smoke detector. No smoke detector repair takes 91 days.`,
      `<strong style="color:#e3b341">Hanley Place has 75 chronic slow WOs averaging 22 days.</strong> Unlike Skye Reserve, these look like real delays — washers (17 slow WOs) and plumbing (12 slow) suggest the team doesn't have the skills or parts inventory to handle these categories quickly. They're likely waiting on vendor scheduling or parts orders.`,
      `<strong style="color:#e2e8f0">The top 15 slowest WOs in the portfolio are almost all at Skye Reserve</strong>, ranging from 56 to 91 days. These need to be audited individually — many are probably already resolved and just need to be closed.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. Run a "zombie ticket sweep" at Skye Reserve this week.</strong> Pull up all WOs over 30 days, call each resident, ask "is this still an issue?" Close everything that's resolved. This alone could cut their slow WO count in half.`,
      `<strong>2. At Hanley Place, pre-stock washer parts and establish a plumbing vendor on retainer.</strong> 17 slow washer WOs and 12 slow plumbing WOs suggest the delay is sourcing parts and scheduling vendors. Keep common washer parts (belts, pumps, hoses) in inventory and have a plumber available within 48 hours.`,
      `<strong>3. Set a system alert for any WO open longer than 7 days.</strong> It should automatically escalate to a supervisor with a required explanation. No WO should silently sit open for weeks without someone knowing about it.`,
      `<strong>4. Establish a weekly "slow WO review" for property managers.</strong> Every Monday, review all WOs over 5 days — what's blocking them? Do they need parts, a vendor, approval, or just someone to close them?`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="ops-slow" class="panel">
    <div class="kpi-row k3">`,
  `<div id="ops-slow" class="panel">
    ${slowNarrative}
    <div class="kpi-row k3">`
);

// ═══════════════════════════════════════════════════════════════
// OPERATIONS - TEXT ANALYSIS TAB
// ═══════════════════════════════════════════════════════════════
const textNarrative = `<div style="padding:12px 18px 0">
    ${insightBox([
      `<strong style="color:#e2e8f0">The top keywords tell you what residents are actually experiencing — in their own words.</strong> "Kitchen sink" (100 mentions), "front door" (77), "garbage disposal" (66), "water heater" (64), and "pest control" (60) are the five most common phrases. These are the daily-life items that drive resident satisfaction.`,
      `<strong style="color:#f85149">"Stopped working" appears 26 times, "not working" appears in 422 WOs.</strong> This language means total failure, not partial issues. When residents say "not working," they mean the appliance is dead — and they're timing how long it takes you to fix it.`,
      `<strong style="color:#e3b341">Appliance failure is the #1 theme at 14% of all WOs</strong>, followed by water/leak issues (10.2%) and door/window problems (7.2%). Plumbing clogs (6.7%) and electrical issues (5.8%) round out the top 5. These five themes account for nearly half of all maintenance requests.`,
    ], 'info')}
    ${insightBox([
      `<strong>1. Prioritize "kitchen sink" and "garbage disposal" repairs.</strong> With 100 and 66 mentions respectively, these are the most common annoyances. Keep disposal units and sink repair kits stocked — these should be same-day fixes.`,
      `<strong>2. "Front door" (77 mentions) is a security concern.</strong> When residents report door issues, they feel unsafe. Treat every front door WO as high priority regardless of how it's categorized.`,
      `<strong>3. "Water heater" (64 mentions) = no hot water = angry resident.</strong> This should have a 24-hour SLA. No one writes a positive review while taking cold showers.`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="ops-text" class="panel">
    <div class="g2" style="margin:0 18px 11px">`,
  `<div id="ops-text" class="panel">
    ${textNarrative}
    <div class="g2" style="margin:0 18px 11px">`
);

// ═══════════════════════════════════════════════════════════════
// RISK SCORECARD PAGE
// ═══════════════════════════════════════════════════════════════
const riskNarrative = `<div style="padding:14px 18px 0">
    ${insightBox([
      `<strong style="color:#e2e8f0">The Risk Scorecard combines four metrics into a single 0–100 score</strong> so you can see at a glance which properties need the most attention. Each dimension is weighted equally (25 points max):`,
      `&nbsp;&nbsp;• <strong>Speed (25)</strong> — How fast WOs are completed. Higher avg days = higher risk.`,
      `&nbsp;&nbsp;• <strong>Slow% (25)</strong> — What % of WOs take 7+ days. Even if your average looks fine, a tail of very slow WOs creates terrible resident experiences.`,
      `&nbsp;&nbsp;• <strong>FCR (25)</strong> — First-call resolution. Low FCR means you're fixing the same things twice, wasting time and frustrating residents.`,
      `&nbsp;&nbsp;• <strong>Trend (25)</strong> — Are you getting better or worse? A property that's improving gets credit; one that's declining gets penalized.`,
    ], 'info')}
    ${insightBox([
      `<strong style="color:#f85149">Four properties scored Critical (60+):</strong>`,
      `&nbsp;&nbsp;• <strong style="color:#e2e8f0">The Flats (65)</strong> — Very slow (5.4d avg), very high slow WO%, but improving. Primary issue: no dedicated maintenance person and broken scheduling.`,
      `&nbsp;&nbsp;• <strong style="color:#e2e8f0">Skye Reserve (64)</strong> — High volume masking zombie tickets. The Feb improvement (1.7d) is promising — keep the current staffing level and audit old WOs.`,
      `&nbsp;&nbsp;• <strong style="color:#e2e8f0">The Boardwalk (64)</strong> — High FCR penalty (88.5%) and high slow WO% (11.4%). With 625 WOs, this is a large property with moderate problems across the board.`,
      `&nbsp;&nbsp;• <strong style="color:#e2e8f0">Hanley Place (60)</strong> — The most genuinely concerning: high speed, high slow%, and the highest volume of any underperforming property. Needs staffing help.`,
    ], 'crit')}
    ${insightBox([
      `<strong>1. Triage the four Critical properties differently:</strong>`,
      `&nbsp;&nbsp;• <strong>The Flats</strong> → Fix the scheduling/ownership problem (process fix, not money)`,
      `&nbsp;&nbsp;• <strong>Skye Reserve</strong> → Audit and close zombie tickets (data cleanup, not operational)`,
      `&nbsp;&nbsp;• <strong>The Boardwalk</strong> → Focus on FCR — repairs aren't sticking (training/parts issue)`,
      `&nbsp;&nbsp;• <strong>Hanley Place</strong> → Add a maintenance tech (staffing investment)`,
      `<strong>2. Set a goal of moving all properties below 40 (out of Elevated) by Q3 2026.</strong> Track this scorecard monthly.`,
      `<strong>3. Celebrate the low-risk properties.</strong> Skye Oaks (24), Skye at Love (13), Skye at Conway (9) — these teams are executing well. Recognize them publicly to set the standard.`,
    ], 'action')}
  </div>`;

html = html.replace(
  `<div id="page-risk" class="page">
  <div class="pg-header"><h2>🎯 Composite Risk Scorecard</h2><p>Weighted risk scoring combining speed, slow WO%, first-call resolution, and trend direction (0–100 scale)</p></div>
  <div class="card" style="margin:14px 18px">`,
  `<div id="page-risk" class="page">
  <div class="pg-header"><h2>🎯 Composite Risk Scorecard</h2><p>Weighted risk scoring combining speed, slow WO%, first-call resolution, and trend direction (0\u2013100 scale)</p></div>
  ${riskNarrative}
  <div class="card" style="margin:0 18px 14px">`
);

// ═══════════════════════════════════════════════════════════════
// WRITE BACK
// ═══════════════════════════════════════════════════════════════
fs.writeFileSync('/Users/zk/Desktop/wo-dashboard/index.html', html, 'utf-8');
console.log('Narratives added! File size:', (Buffer.byteLength(html) / 1024).toFixed(0), 'KB');
