// add-playbook.js — Adds Action Playbook page with 5 tabs
const fs = require('fs');
let html = fs.readFileSync('/Users/zk/Desktop/wo-dashboard/index.html', 'utf-8');

// ═══════════════════════════════════════════════════════════════
// 1. NAV BUTTON — after Risk
// ═══════════════════════════════════════════════════════════════
html = html.replace(
  `<div class="navbtn" onclick="showPage('risk')">🎯 Risk</div>`,
  `<div class="navbtn" onclick="showPage('risk')">🎯 Risk</div>
    <div class="navbtn" onclick="showPage('playbook')" style="border-left:1px solid #21262d;margin-left:4px;background:#10101c;border-color:#15153d">📋 Playbook</div>`
);

// ═══════════════════════════════════════════════════════════════
// 2. PAGE HTML — inject before </main> or before page-asset
// ═══════════════════════════════════════════════════════════════

const playbookHTML = `
<!-- ==================== ACTION PLAYBOOK ==================== -->
<div id="page-playbook" class="page">
  <div class="pg-header">
    <h2>Action Playbook</h2>
    <p>Prioritized actions, management questions, property-specific fix plans, vendor guidance, and ready-to-use templates — all in one place</p>
  </div>
  <div class="tabs">
    <div class="tab active" onclick="switchTab('pb','week',this)">🔥 This Week</div>
    <div class="tab" onclick="switchTab('pb','questions',this)">💬 Questions for Leadership</div>
    <div class="tab" onclick="switchTab('pb','props',this)">🏢 Property Playbooks</div>
    <div class="tab" onclick="switchTab('pb','vendor',this)">💰 Vendor & Budget</div>
    <div class="tab" onclick="switchTab('pb','templates',this)">📝 Templates</div>
  </div>

  <!-- ═══════════ TAB 1: THIS WEEK ═══════════ -->
  <div id="pb-week" class="panel active">
    <div style="padding:14px 18px">
      <div style="background:#10101c;border:1px solid #15153d;border-radius:8px;padding:14px 16px;margin-bottom:16px;border-left:3px solid #a371f7">
        <div style="font-size:9px;font-weight:800;color:#a371f7;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">TOP 10 ACTIONS — RANKED BY URGENCY</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.7">
          <div style="margin-bottom:6px">These are the highest-impact actions you can take right now, ranked by a combination of risk severity, resident impact, and potential liability. Each includes what to do, who should own it, and what "done" looks like.</div>
        </div>
      </div>

      <table class="tbl">
        <thead><tr><th style="width:30px">#</th><th style="width:50px">Urgency</th><th>Action</th><th>Property</th><th>Owner</th><th>Definition of Done</th></tr></thead>
        <tbody>
          <tr style="background:#1c1010">
            <td style="font-weight:800;color:#f85149">1</td>
            <td><span class="fl flr">NOW</span></td>
            <td style="color:#e2e8f0"><strong>Confirm status of 9 mold WOs at The Julia.</strong> These have no completion date. If unresolved, you have active mold in 9 units with zero documentation. This is a habitability violation and legal liability.</td>
            <td>The Julia</td>
            <td>Property Manager + Regional</td>
            <td style="font-size:10px;color:#8b949e">Each of the 9 WOs has: (a) photo documentation of current unit condition, (b) remediation report if completed, (c) if not completed: remediation vendor scheduled within 48h</td>
          </tr>
          <tr style="background:#1c1010">
            <td style="font-weight:800;color:#f85149">2</td>
            <td><span class="fl flr">NOW</span></td>
            <td style="color:#e2e8f0"><strong>Audit Skye Reserve smoke detector WOs.</strong> 3 smoke/CO detector WOs averaged 26 days to resolve. Non-functional smoke detectors are a fire code violation and an immediate life-safety issue.</td>
            <td>Skye Reserve</td>
            <td>Maintenance Lead</td>
            <td style="font-size:10px;color:#8b949e">All 3 units confirmed to have functional, tested smoke detectors. If any units still have issues, replace detectors same-day.</td>
          </tr>
          <tr style="background:#1c1010">
            <td style="font-weight:800;color:#f85149">3</td>
            <td><span class="fl flr">NOW</span></td>
            <td style="color:#e2e8f0"><strong>Verify Upland Townhomes mold remediation.</strong> Feb 13 mold WO under kitchen took 13 days to close. Confirm full remediation was completed — not just surface cleaning.</td>
            <td>Upland Townhomes</td>
            <td>Property Manager</td>
            <td style="font-size:10px;color:#8b949e">Unit inspected. Before/after photos on file. Moisture source identified and fixed. 30-day follow-up inspection scheduled.</td>
          </tr>
          <tr>
            <td style="font-weight:800;color:#e3b341">4</td>
            <td><span class="fl fly">THIS WEEK</span></td>
            <td style="color:#e2e8f0"><strong>Run a "blitz day" on Hanley Place backlog.</strong> 164 slow WOs (27% of total). Schedule a full day where all available techs focus only on WOs older than 7 days. Target: close or properly escalate at least 40.</td>
            <td>Hanley Place</td>
            <td>Maintenance Supervisor</td>
            <td style="font-size:10px;color:#8b949e">Slow WO count drops from 164 to under 125. Each remaining slow WO has a documented reason (waiting for parts, vendor scheduled, resident access).</td>
          </tr>
          <tr>
            <td style="font-weight:800;color:#e3b341">5</td>
            <td><span class="fl fly">THIS WEEK</span></td>
            <td style="color:#e2e8f0"><strong>Audit Skye Reserve zombie WOs.</strong> Common Area (30d avg) and Flooring (31d avg) are almost certainly tickets that were opened and never closed — not active 30-day repairs. Close them or escalate.</td>
            <td>Skye Reserve</td>
            <td>Maintenance Lead</td>
            <td style="font-size:10px;color:#8b949e">Every WO over 30 days reviewed. Zombies closed with a note. Active WOs given a completion target date. Portfolio avg for Skye Reserve drops by 1+ day.</td>
          </tr>
          <tr>
            <td style="font-weight:800;color:#e3b341">6</td>
            <td><span class="fl fly">THIS WEEK</span></td>
            <td style="color:#e2e8f0"><strong>Replace the stove in Parks at Walnut Unit 2074.</strong> 18 cook top WOs in 6 months. At $150-250/service call, you have spent $2,700-4,500 repairing a stove that costs $600-800 to replace.</td>
            <td>Parks at Walnut</td>
            <td>Maintenance Tech</td>
            <td style="font-size:10px;color:#8b949e">New stove installed. No further cook top WOs from this unit.</td>
          </tr>
          <tr>
            <td style="font-weight:800;color:#e3b341">7</td>
            <td><span class="fl fly">THIS WEEK</span></td>
            <td style="color:#e2e8f0"><strong>Walk the top 5 Julia hotspot units.</strong> Units 1024, 2042, 2091, 1090, 1055 have 13-23 WOs each. A 30-minute walk-through per unit, fixing everything in one visit, consolidates future WOs.</td>
            <td>The Julia</td>
            <td>Maintenance Team</td>
            <td style="font-size:10px;color:#8b949e">5 units inspected. All visible issues documented. Single comprehensive WO created per unit with all items listed. Scheduled for repair within 5 days.</td>
          </tr>
          <tr>
            <td style="font-weight:800;color:#58a6ff">8</td>
            <td><span class="fl flb">10 DAYS</span></td>
            <td style="color:#e2e8f0"><strong>The Boardwalk: Schedule building moisture assessment.</strong> 9 mold WOs in 5 months, recurring in bedrooms. This is a building envelope or HVAC condensate issue, not random tenant behavior.</td>
            <td>The Boardwalk</td>
            <td>Regional Manager</td>
            <td style="font-size:10px;color:#8b949e">Licensed contractor inspects: HVAC condensate lines, bathroom exhaust fans, exterior walls near affected units, roof drainage. Written report with recommendations.</td>
          </tr>
          <tr>
            <td style="font-weight:800;color:#58a6ff">9</td>
            <td><span class="fl flb">10 DAYS</span></td>
            <td style="color:#e2e8f0"><strong>Set up proactive resident texts for WOs over 48h.</strong> Automated message: "We are still working on your [issue]. Current status: [waiting for part / scheduled for Thursday]." Prevents negative reviews.</td>
            <td>All properties</td>
            <td>Operations / PM Software Admin</td>
            <td style="font-size:10px;color:#8b949e">Auto-text triggers at 48h for any open WO. Template approved by regional. Message includes estimated completion date.</td>
          </tr>
          <tr>
            <td style="font-weight:800;color:#58a6ff">10</td>
            <td><span class="fl flb">10 DAYS</span></td>
            <td style="color:#e2e8f0"><strong>Request staffing review for Hanley Place.</strong> 100 WOs/month, 5.6d avg, 15-WO daily backlog. The data shows this property needs at least 1 additional full-time maintenance tech.</td>
            <td>Hanley Place</td>
            <td>Regional Director</td>
            <td style="font-size:10px;color:#8b949e">Staffing proposal submitted with data: current volume (100 WOs/mo), current avg days (5.6), target avg days (2.0), cost of additional tech vs. cost of continued slow response (turnover, reviews, vacancy).</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ═══════════ TAB 2: QUESTIONS FOR LEADERSHIP ═══════════ -->
  <div id="pb-questions" class="panel">
    <div style="padding:14px 18px">
      <div style="background:#0d1117;border:1px solid #21262d;border-radius:8px;padding:14px 16px;margin-bottom:16px;border-left:3px solid #56d4dd">
        <div style="font-size:9px;font-weight:800;color:#56d4dd;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">HOW TO USE THIS PAGE</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.7">
          <div style="margin-bottom:6px">These questions are designed for your next ops meeting, regional review, or leadership check-in. Each includes the data backing it, why it matters, and what a good answer looks like. Copy the ones relevant to your meeting.</div>
        </div>
      </div>

      <!-- STAFFING QUESTIONS -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot dr"></span>Staffing Questions</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.8">
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #f85149">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "Hanley Place processes 100 WOs/month with a 5.6-day average. Their backlog is 15 WOs deep every morning. What is the plan to add maintenance capacity?"</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> 599 WOs, 164 over 7 days (27%), 5.55d avg. Worst in portfolio by every metric.<br><strong>Why it matters:</strong> This is not a process problem. The team is overwhelmed. Speed will not improve without adding a person.<br><strong>Good answer:</strong> Budget approval for 1 additional tech, or a dedicated vendor contract for overflow, with a start date.</div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #e3b341">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "The Flats averages 5.4 days on only 7 WOs/month. Is there a dedicated maintenance person assigned to this property?"</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> 40 WOs, 5.43d avg, 20.5% slow. Very low volume but very slow — suggests no ownership.<br><strong>Why it matters:</strong> This is a process problem, not a capacity problem. 7 WOs/month should be easy. Someone needs to own it.<br><strong>Good answer:</strong> A named person is assigned to The Flats WOs with a 48h response SLA.</div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #58a6ff">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "What is our tech-to-unit ratio at each property? How does it compare to our top performer (Skye Oaks: 0.43d avg)?"</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> Skye Oaks handles 31 WOs/month across 116 units at 0.43d avg. Hanley Place handles 100/month across 255 units at 5.55d.<br><strong>Why it matters:</strong> Tech-to-unit ratio is the #1 predictor of maintenance speed. If Skye Oaks has 1 tech per 58 units and Hanley has 1 per 128, the answer is obvious.<br><strong>Good answer:</strong> Actual staffing numbers per property, with a plan to equalize ratios at underperformers.</div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #58a6ff">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "Should we budget for seasonal temp maintenance staff from May through September? Our data shows 800-1,000 WOs/month during peak."</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> September had 1,002 WOs. AC/HVAC alone had 133 WOs in October. Volume drops ~20% in winter.<br><strong>Why it matters:</strong> If the team is sized for 800 WOs/month and September hits 1,000, response times degrade for everyone.<br><strong>Good answer:</strong> Budget for 2-3 seasonal techs at the 3 highest-volume properties (Skye Reserve, Boardwalk, Hanley Place) May-Sep.</div>
          </div>
        </div>
      </div>

      <!-- BUDGET / CAPEX QUESTIONS -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot do"></span>Budget & Capital Expenditure Questions</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.8">
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #f85149">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "Washers, dryers, and dishwashers account for 34+24+17 = 75 slow WOs. Have we evaluated a bulk appliance replacement program for units with 3+ repeat WOs?"</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> Washer: 5.25d avg, 34 slow. Dishwasher: 6.41d, 24 slow. Dryer: 5.66d, 17 slow.<br><strong>Why it matters:</strong> Each repeat repair costs $150-250 in labor + parts. A washer with 3 repairs ($450-750) has exceeded the cost of a new unit ($500-700).<br><strong>Good answer:</strong> Identify all units with 3+ appliance WOs. Get replacement quotes. Present ROI to ownership.</div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #e3b341">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "Can we allocate $2,000-3,000 per property for a local parts inventory? Our data shows appliance repairs stall waiting for parts."</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> Appliance subcategories avg 5-6 days. AC/HVAC (where parts are typically stocked) avgs 1.71 days. The gap is parts availability.<br><strong>Why it matters:</strong> A $2K parts stock (washer pumps, dryer belts, dishwasher spray arms, stove ignitors, fridge thermostats) would cut appliance avg days by 50%+.<br><strong>Good answer:</strong> Approved budget per property for a starter parts inventory. Maintenance lead identifies top 20 most-used parts.</div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #58a6ff">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "The Boardwalk and Hanley Place have 79 and 58 leak/water WOs respectively. Should we budget for a plumbing infrastructure assessment?"</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> 547 water/leak-related WOs portfolio-wide. Concentrated at older/larger properties.<br><strong>Why it matters:</strong> Recurring leaks = aging supply lines or failing fixtures. A $5-10K plumbing assessment could identify capital replacements that prevent hundreds of future WOs.<br><strong>Good answer:</strong> Plumbing scope assessment scheduled. Budget set aside for findings.</div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #58a6ff">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "Nightingale on 25th make-ready averages 9.6 days. At $50/day lost rent across 14 estimated turns, that is roughly $6,700 in vacancy cost. What would it take to get this under 3 days?"</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> 3 make-ready WOs at 9.64d avg, 0% same-day.<br><strong>Why it matters:</strong> Make-ready speed is one of the highest-ROI metrics. Getting from 9.6 to 3 days saves ~$330/turn = $4,600/year.<br><strong>Good answer:</strong> Identify the bottleneck (vendor scheduling? inspection delays? cleaning crew?). Assign a dedicated turn coordinator.</div>
          </div>
        </div>
      </div>

      <!-- VENDOR QUESTIONS -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot dp"></span>Vendor & Contract Questions</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.8">
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #f85149">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "Our pest control first-call resolution is 77.9%. 15 units across 4 properties needed 3+ treatments. Should we rebid the pest control contract?"</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> 95 pest WOs, 19 repeat callbacks. The Julia alone: 44 pest WOs, unit 1022 needed 7 treatments.<br><strong>Why it matters:</strong> Repeat treatments cost money and frustrate residents. A vendor with a guarantee (retreat free within 30 days) would be more cost-effective.<br><strong>Good answer:</strong> Get 3 bids from pest vendors offering: gel bait + barrier treatment, 30-day guarantee, quarterly preventative visits.</div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #e3b341">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "Do our appliance repair vendors have SLAs? Our dishwasher and washer repair times (5-6 days) suggest they do not."</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> Dishwasher 6.41d, Washer 5.25d, Dryer 5.66d — all well above the 3.12d portfolio average.<br><strong>Why it matters:</strong> Without a contractual response time, vendors schedule at their convenience, not yours.<br><strong>Good answer:</strong> Current vendor contracts reviewed. New contracts include: 24h response, 48h repair target, parts sourcing SLA, penalty for misses.</div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #58a6ff">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "Do we have a licensed mold remediation vendor on retainer? Our data shows 32 mold WOs across 5 properties."</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> 32 mold WOs. Hanley Place had one take 19 days. Proper mold remediation should complete in 3-5 days.<br><strong>Why it matters:</strong> Mold remediation requires specialized equipment and IICRC certification. Using general maintenance staff for mold creates liability.<br><strong>Good answer:</strong> Licensed mold vendor identified or on retainer. Response time: 48h for assessment, 5 days for remediation.</div>
          </div>
        </div>
      </div>

      <!-- COMPLIANCE QUESTIONS -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot dr"></span>Compliance & Data Quality Questions</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.8">
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #f85149">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "The Julia has 888 work orders with zero completion dates. Are they not closing WOs in the system, or is the PM software not configured to track it?"</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> 888 WOs, all missing completion timestamps. Second-highest volume property — flying blind on performance.<br><strong>Why it matters:</strong> You cannot manage maintenance speed if you cannot measure it. This is the #2 property by volume and you have no speed data.<br><strong>Good answer:</strong> Root cause identified (software config or user training). Fix implemented. Completion dates appearing within 1 week.</div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #e3b341">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "Skye Reserve's top WO category in hotspot units is 'Other.' Are WOs being properly categorized there?"</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> Multiple Skye Reserve hotspot units show "Other (10)", "Other (8)" as top category.<br><strong>Why it matters:</strong> If you cannot see what is breaking, you cannot fix the root cause. "Other" hides the real problem.<br><strong>Good answer:</strong> PM software updated to require specific subcategory before WO submission. No more "Other" as a valid primary category.</div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:10px;border-left:2px solid #58a6ff">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Q: "Are we documenting mold remediation with before/after photos, air quality tests, and signed completion reports? What is our documentation protocol?"</div>
            <div style="color:#8b949e;font-size:10px"><strong>Data:</strong> 32 mold WOs, some with multi-day resolution, some with no completion date.<br><strong>Why it matters:</strong> In a lawsuit, "we fixed it" without documentation is the same as "we did nothing." Mold cases require proof of remediation.<br><strong>Good answer:</strong> Documentation checklist implemented: dated photos, remediation report, moisture readings, 30-day follow-up.</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════ TAB 3: PROPERTY PLAYBOOKS ═══════════ -->
  <div id="pb-props" class="panel">
    <div style="padding:14px 18px">
      <div style="background:#0d1117;border:1px solid #21262d;border-radius:8px;padding:14px 16px;margin-bottom:16px;border-left:3px solid #56d4dd">
        <div style="font-size:9px;font-weight:800;color:#56d4dd;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">PROPERTY-SPECIFIC FIX PLANS</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.7">
          <div>Each property below gets a targeted diagnosis: what is wrong, why, and exactly how to fix it. These are the 6 properties that need the most attention.</div>
        </div>
      </div>

      <!-- HANLEY PLACE -->
      <div class="card" style="margin-bottom:16px;border-left:3px solid #f85149">
        <div class="ct"><span class="dot dr"></span>Hanley Place — 🚨 Critical: Staffing Crisis</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.8">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Avg Days</div><div style="font-size:16px;font-weight:800;color:#f85149">5.55</div></div>
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Slow WOs</div><div style="font-size:16px;font-weight:800;color:#f85149">164</div></div>
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Same-Day</div><div style="font-size:16px;font-weight:800;color:#f85149">31.9%</div></div>
          </div>
          <div style="margin-bottom:8px"><strong style="color:#f85149">Diagnosis:</strong> This is a capacity problem, not a process problem. 100 WOs/month with a 15-WO morning backlog means the team starts every day behind. Top problem areas: Washer (49 WOs, 8.2d avg), Plumbing (61 slow WOs), High priority at 6.65d avg.</div>
          <div style="margin-bottom:8px"><strong style="color:#a371f7">Fix Plan:</strong></div>
          <div style="padding-left:12px">
            <div style="margin-bottom:4px"><strong>Week 1:</strong> Blitz day — close/escalate 40+ aged WOs. Audit all WOs &gt;30 days.</div>
            <div style="margin-bottom:4px"><strong>Week 2:</strong> Submit staffing request for 1 additional full-time maintenance tech. Include data: 100 WOs/mo, 5.55d avg, comparison to Skye Oaks (31 WOs/mo, 0.43d).</div>
            <div style="margin-bottom:4px"><strong>Week 3:</strong> Set up dedicated appliance vendor with 48h SLA. Current washer avg (8.2d) is unacceptable.</div>
            <div style="margin-bottom:4px"><strong>Week 4:</strong> Implement 5-day escalation trigger — any WO open 5+ days auto-escalates to supervisor.</div>
          </div>
          <div style="margin-top:8px"><strong style="color:#e3b341">Estimated cost:</strong> 1 FT tech (~$45-55K/yr) + vendor contract (~$500-1,000/mo). <strong style="color:#3fb950">Expected impact:</strong> Avg days from 5.55 to under 3.0 within 60 days.</div>
        </div>
      </div>

      <!-- SKYE RESERVE -->
      <div class="card" style="margin-bottom:16px;border-left:3px solid #f85149">
        <div class="ct"><span class="dot dr"></span>Skye Reserve — 🚨 Critical: Data Quality + Zombie WOs</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.8">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Avg Days</div><div style="font-size:16px;font-weight:800;color:#f85149">5.18</div></div>
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Slow WOs</div><div style="font-size:16px;font-weight:800;color:#f85149">120</div></div>
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Feb Avg</div><div style="font-size:16px;font-weight:800;color:#3fb950">1.7d</div></div>
          </div>
          <div style="margin-bottom:8px"><strong style="color:#f85149">Diagnosis:</strong> Two problems. (1) Many WOs are zombie tickets — opened months ago, never closed, inflating the average. Common Area (30d avg) and Flooring (31d avg) are the worst offenders. (2) The good news: February showed dramatic improvement to 1.7d avg, suggesting a recent staffing or process change is working.</div>
          <div style="margin-bottom:8px"><strong style="color:#a371f7">Fix Plan:</strong></div>
          <div style="padding-left:12px">
            <div style="margin-bottom:4px"><strong>Week 1:</strong> Pull every WO open &gt;30 days. Categorize: zombie (close it), waiting for vendor (escalate), waiting for parts (order), waiting for access (reschedule).</div>
            <div style="margin-bottom:4px"><strong>Week 2:</strong> Fix the "Other" categorization problem — require specific subcategories. No more "Other" as a primary category.</div>
            <div style="margin-bottom:4px"><strong>Week 3:</strong> Keep whatever staffing/process change drove Feb improvement. Do NOT reduce it.</div>
            <div style="margin-bottom:4px"><strong>Ongoing:</strong> Weekly review of any WO open &gt;7 days. Assign reason codes to prevent future zombies.</div>
          </div>
          <div style="margin-top:8px"><strong style="color:#e3b341">Estimated cost:</strong> Minimal — mostly process changes. <strong style="color:#3fb950">Expected impact:</strong> True avg (excluding zombies) is likely already 2-3d. Cleaning up the backlog should bring reported avg under 2.5d.</div>
        </div>
      </div>

      <!-- THE FLATS -->
      <div class="card" style="margin-bottom:16px;border-left:3px solid #f85149">
        <div class="ct"><span class="dot dr"></span>The Flats — 🚨 Critical: No Ownership</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.8">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Avg Days</div><div style="font-size:16px;font-weight:800;color:#f85149">5.43</div></div>
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">WOs/Month</div><div style="font-size:16px;font-weight:800;color:#58a6ff">7</div></div>
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Slow %</div><div style="font-size:16px;font-weight:800;color:#f85149">20.5%</div></div>
          </div>
          <div style="margin-bottom:8px"><strong style="color:#f85149">Diagnosis:</strong> Only 7 WOs/month — this is NOT a volume or staffing problem. It is an ownership problem. WOs are falling through cracks because no one person is responsible. January 2026 hit 11.2 avg days — worst single month in the entire portfolio.</div>
          <div style="margin-bottom:8px"><strong style="color:#a371f7">Fix Plan:</strong></div>
          <div style="padding-left:12px">
            <div style="margin-bottom:4px"><strong>Immediate:</strong> Assign a named maintenance person to The Flats. This person checks for new WOs every morning.</div>
            <div style="margin-bottom:4px"><strong>Week 1:</strong> Close all WOs currently open &gt;7 days (likely only 2-3 tickets).</div>
            <div style="margin-bottom:4px"><strong>Week 2:</strong> Set up daily WO check — takes 5 minutes at a 30-unit property with 7 WOs/month.</div>
            <div style="margin-bottom:4px"><strong>Ongoing:</strong> Weekly accountability check — are WOs being addressed within 48h?</div>
          </div>
          <div style="margin-top:8px"><strong style="color:#e3b341">Estimated cost:</strong> Zero — just process. This property shares a maintenance team. <strong style="color:#3fb950">Expected impact:</strong> Avg days from 5.43 to under 2.0 within 30 days.</div>
        </div>
      </div>

      <!-- THE BOARDWALK -->
      <div class="card" style="margin-bottom:16px;border-left:3px solid #e3b341">
        <div class="ct"><span class="dot do"></span>The Boardwalk — ⚠ Watch: Repair Quality + Mold</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.8">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Avg Days</div><div style="font-size:16px;font-weight:800;color:#e3b341">2.64</div></div>
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Mold WOs</div><div style="font-size:16px;font-weight:800;color:#f85149">9</div></div>
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">FCR</div><div style="font-size:16px;font-weight:800;color:#e3b341">88.5%</div></div>
          </div>
          <div style="margin-bottom:8px"><strong style="color:#e3b341">Diagnosis:</strong> Speed is moderate (2.64d), but two issues: (1) 9 mold WOs indicate a building moisture problem — recurring in bedrooms and washer/dryer areas. (2) FCR of 88.5% means 11.5% of repairs fail and need callbacks. With 625 WOs, that is 72 repeat visits that should not be happening.</div>
          <div style="margin-bottom:8px"><strong style="color:#a371f7">Fix Plan:</strong></div>
          <div style="padding-left:12px">
            <div style="margin-bottom:4px"><strong>Week 1:</strong> Schedule moisture assessment for buildings with mold WOs. Check HVAC condensate, bathroom exhaust fans, exterior seals.</div>
            <div style="margin-bottom:4px"><strong>Week 2:</strong> Supervisor ride-along on 10 repair calls to identify why repairs are failing (wrong parts? incomplete fix? misdiagnosis?).</div>
            <div style="margin-bottom:4px"><strong>Week 3:</strong> Address top callback subcategories. If washer repairs are failing, evaluate appliance age and replace if &gt;8 years.</div>
            <div style="margin-bottom:4px"><strong>Ongoing:</strong> 48h follow-up call after every repair in categories with &lt;85% FCR.</div>
          </div>
          <div style="margin-top:8px"><strong style="color:#e3b341">Estimated cost:</strong> Moisture assessment ($2-5K) + potential HVAC repairs ($5-15K). <strong style="color:#3fb950">Expected impact:</strong> Mold WOs reduced by 70%+, FCR improved to 92%+.</div>
        </div>
      </div>

      <!-- NIGHTINGALE -->
      <div class="card" style="margin-bottom:16px;border-left:3px solid #e3b341">
        <div class="ct"><span class="dot do"></span>Nightingale on 25th — ⚠ Watch: Slow Make-Ready + Backlog</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.8">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Avg Days</div><div style="font-size:16px;font-weight:800;color:#e3b341">3.50</div></div>
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Make-Ready</div><div style="font-size:16px;font-weight:800;color:#f85149">9.6d</div></div>
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Slow %</div><div style="font-size:16px;font-weight:800;color:#e3b341">13%</div></div>
          </div>
          <div style="margin-bottom:8px"><strong style="color:#e3b341">Diagnosis:</strong> Overall speed (3.5d) is borderline but the make-ready time (9.6d) is the real problem — costing ~$480/unit in vacancy. 20 slow WOs suggest a moderate backlog. The median (0.90d) is much lower than the average (3.50d), meaning a few very slow WOs are dragging the number up.</div>
          <div style="margin-bottom:8px"><strong style="color:#a371f7">Fix Plan:</strong></div>
          <div style="padding-left:12px">
            <div style="margin-bottom:4px"><strong>Week 1:</strong> Audit the 20 slow WOs. Identify and close any zombies.</div>
            <div style="margin-bottom:4px"><strong>Week 2:</strong> Fix the make-ready process. What is the bottleneck? Cleaning? Painting? Vendor scheduling? Inspection delays? Address the specific bottleneck.</div>
            <div style="margin-bottom:4px"><strong>Week 3:</strong> Implement make-ready checklist with 3-day target. Pre-stage supplies before move-out.</div>
            <div style="margin-bottom:4px"><strong>Ongoing:</strong> Track every unit turn against the 3-day target. Report weekly.</div>
          </div>
          <div style="margin-top:8px"><strong style="color:#e3b341">Estimated cost:</strong> Minimal — process improvement. <strong style="color:#3fb950">Expected impact:</strong> Make-ready from 9.6d to 3d saves ~$330/turn. Overall avg from 3.5d to under 2.5d.</div>
        </div>
      </div>

      <!-- THE JULIA -->
      <div class="card" style="margin-bottom:16px;border-left:3px solid #f85149">
        <div class="ct"><span class="dot dr"></span>The Julia — 🚨 Critical: Data Blind Spot + Mold Risk</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.8">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Total WOs</div><div style="font-size:16px;font-weight:800;color:#58a6ff">888</div></div>
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Completion Data</div><div style="font-size:16px;font-weight:800;color:#f85149">NONE</div></div>
            <div style="background:#161b22;border-radius:6px;padding:8px;text-align:center"><div style="font-size:9px;color:#6e7681">Open Mold WOs</div><div style="font-size:16px;font-weight:800;color:#f85149">9</div></div>
          </div>
          <div style="margin-bottom:8px"><strong style="color:#f85149">Diagnosis:</strong> Two critical issues. (1) Zero completion dates on 888 WOs — you have no speed data for your second-highest volume property. (2) 9 mold WOs with no completion date — potentially unresolved, creating legal liability. Also: 44 pest WOs (worst in portfolio), 3.5 WOs/unit density (2nd highest).</div>
          <div style="margin-bottom:8px"><strong style="color:#a371f7">Fix Plan:</strong></div>
          <div style="padding-left:12px">
            <div style="margin-bottom:4px"><strong>Immediate:</strong> Walk all 9 mold-affected units. Confirm remediation or engage licensed mold vendor.</div>
            <div style="margin-bottom:4px"><strong>Week 1:</strong> Fix PM software to record completion dates. This is the #1 data priority in the portfolio.</div>
            <div style="margin-bottom:4px"><strong>Week 2:</strong> Whole-building pest treatment — 44 pest WOs across 23 units means unit-by-unit treatment is not working.</div>
            <div style="margin-bottom:4px"><strong>Week 3:</strong> Walk top 10 hotspot units. Consolidated fix visits instead of individual WOs.</div>
            <div style="margin-bottom:4px"><strong>Ongoing:</strong> Once completion dates are tracked, set a 2.5d average target. With 888 WOs in 6 months, this is a high-volume property that needs tight ops.</div>
          </div>
          <div style="margin-top:8px"><strong style="color:#e3b341">Estimated cost:</strong> Mold remediation ($2-5K per unit if needed) + building pest treatment ($2-3K) + PM software config (IT time). <strong style="color:#3fb950">Expected impact:</strong> Mold liability eliminated. Data visibility restored. Pest callbacks reduced 50%+.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════ TAB 4: VENDOR & BUDGET ═══════════ -->
  <div id="pb-vendor" class="panel">
    <div style="padding:14px 18px">

      <!-- REPLACE vs REPAIR MATRIX -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot dr"></span>Replace vs. Repair Decision Matrix</div>
        <table class="tbl">
          <thead><tr><th>Appliance</th><th>Replace When</th><th>Replacement Cost</th><th>Repair Cost (per visit)</th><th>Break-Even</th></tr></thead>
          <tbody>
            <tr><td style="font-weight:700;color:#e2e8f0">Washer</td><td>3+ WOs in 6 months OR unit &gt;8 years old</td><td>$500–700</td><td>$150–250</td><td>3 repairs</td></tr>
            <tr><td style="font-weight:700;color:#e2e8f0">Dryer</td><td>3+ WOs in 6 months OR unit &gt;10 years old</td><td>$400–600</td><td>$125–200</td><td>3 repairs</td></tr>
            <tr><td style="font-weight:700;color:#e2e8f0">Dishwasher</td><td>2+ WOs in 6 months OR unit &gt;8 years old</td><td>$350–550</td><td>$150–250</td><td>2 repairs</td></tr>
            <tr><td style="font-weight:700;color:#e2e8f0">Stove/Oven</td><td>3+ WOs in 6 months (same component) OR safety issue</td><td>$500–800</td><td>$100–200</td><td>4 repairs</td></tr>
            <tr><td style="font-weight:700;color:#e2e8f0">Refrigerator</td><td>Compressor failure OR unit &gt;12 years old</td><td>$600–1,000</td><td>$150–300</td><td>3 repairs</td></tr>
            <tr><td style="font-weight:700;color:#e2e8f0">Water Heater</td><td>Any leak OR unit &gt;10 years old</td><td>$800–1,200 (installed)</td><td>$200–400</td><td>3 repairs</td></tr>
            <tr><td style="font-weight:700;color:#e2e8f0">HVAC System</td><td>Refrigerant leak OR unit &gt;15 years old</td><td>$3,000–5,000</td><td>$200–500</td><td>8 repairs</td></tr>
            <tr><td style="font-weight:700;color:#e2e8f0">Garbage Disposal</td><td>Any jam after 2nd repair OR unit &gt;8 years old</td><td>$150–250 (installed)</td><td>$75–125</td><td>2 repairs</td></tr>
          </tbody>
        </table>
      </div>

      <!-- VENDOR SLA TEMPLATE -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot dp"></span>Vendor SLA Template — What to Put in Contracts</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.8">
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:8px">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Response Time SLAs</div>
            <div style="color:#8b949e;font-size:10px">
              Emergency (flood, gas, fire, lockout): <strong style="color:#f85149">2 hours</strong><br>
              High priority (no hot water, no heat, broken lock): <strong style="color:#e3b341">24 hours</strong><br>
              Standard (appliance repair, plumbing, electrical): <strong style="color:#58a6ff">48 hours</strong><br>
              Low priority (cosmetic, minor): <strong style="color:#6e7681">5 business days</strong>
            </div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:8px">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Completion Time SLAs</div>
            <div style="color:#8b949e;font-size:10px">
              Standard repair: <strong>Completed within 48 hours</strong> of initial visit<br>
              Parts-required repair: <strong>Parts ordered within 24 hours</strong>, repair completed within 24 hours of parts arrival<br>
              Mold remediation: <strong>Assessment within 48 hours</strong>, remediation complete within 5 business days
            </div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px;margin-bottom:8px">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Warranty / Guarantee Clauses</div>
            <div style="color:#8b949e;font-size:10px">
              All repairs warranted for <strong>30 days</strong>. If the same issue recurs within 30 days, vendor returns at no charge.<br>
              Pest control: <strong>Re-treatment free</strong> if pests return within 30 days of treatment.<br>
              Appliance repair: If same component fails within 60 days, <strong>labor is free</strong> (parts at cost).
            </div>
          </div>
          <div style="background:#161b22;border-radius:6px;padding:12px">
            <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">Penalty / Escalation Clauses</div>
            <div style="color:#8b949e;font-size:10px">
              Missed SLA: <strong>10% discount</strong> on that service call<br>
              3 missed SLAs in a month: <strong>Service review meeting</strong> with property management<br>
              5 missed SLAs in a quarter: <strong>Contract rebid trigger</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- PARTS STOCKING LIST -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot dg"></span>Recommended Parts Inventory — Stock Locally ($2,000-3,000)</div>
        <table class="tbl">
          <thead><tr><th>Category</th><th>Item</th><th>Qty</th><th>Est. Cost</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td rowspan="3" style="font-weight:700;color:#e2e8f0">Washer</td><td>Drain pump (universal)</td><td>3</td><td>$75</td><td>Most common washer failure</td></tr>
            <tr><td>Door latch/lock</td><td>3</td><td>$45</td><td>Prevents "washer not starting" WOs</td></tr>
            <tr><td>Inlet valve</td><td>2</td><td>$40</td><td>Causes "no water" and leaking issues</td></tr>
            <tr><td rowspan="2" style="font-weight:700;color:#e2e8f0">Dryer</td><td>Belt (universal)</td><td>4</td><td>$40</td><td>Most common dryer failure</td></tr>
            <tr><td>Thermal fuse</td><td>4</td><td>$30</td><td>"Dryer not heating" fix</td></tr>
            <tr><td rowspan="2" style="font-weight:700;color:#e2e8f0">Dishwasher</td><td>Spray arm</td><td>3</td><td>$50</td><td>"Not cleaning" complaints</td></tr>
            <tr><td>Door latch</td><td>2</td><td>$30</td><td>"Not starting" complaints</td></tr>
            <tr><td rowspan="2" style="font-weight:700;color:#e2e8f0">Stove</td><td>Ignitor (gas)</td><td>4</td><td>$60</td><td>"Burner not lighting" — most common stove WO</td></tr>
            <tr><td>Burner element (electric)</td><td>3</td><td>$60</td><td>"Burner not heating"</td></tr>
            <tr><td rowspan="2" style="font-weight:700;color:#e2e8f0">Plumbing</td><td>Wax ring + bolts (toilet)</td><td>6</td><td>$30</td><td>Toilet leak/wobble fix</td></tr>
            <tr><td>Faucet cartridge (universal)</td><td>4</td><td>$60</td><td>Drip/leak fix for sinks</td></tr>
            <tr><td rowspan="2" style="font-weight:700;color:#e2e8f0">Electrical</td><td>GFCI outlet</td><td>6</td><td>$50</td><td>Bathroom/kitchen outlet trips</td></tr>
            <tr><td>Smoke detector (battery)</td><td>10</td><td>$50</td><td>Life safety — always in stock</td></tr>
            <tr><td rowspan="2" style="font-weight:700;color:#e2e8f0">Doors</td><td>Deadbolt (keyed alike)</td><td>4</td><td>$100</td><td>Lock changes and failures</td></tr>
            <tr><td>Door closer (screen/storm)</td><td>3</td><td>$45</td><td>Frequently broken</td></tr>
            <tr><td style="font-weight:700;color:#e2e8f0">HVAC</td><td>Air filter (common sizes)</td><td>20</td><td>$100</td><td>Preventative — reduces AC WOs</td></tr>
            <tr><td style="font-weight:700;color:#e2e8f0">General</td><td>Caulk, P-traps, supply lines, outlet covers, light bulbs</td><td>Assorted</td><td>$200</td><td>High-frequency consumables</td></tr>
            <tr style="background:#161b22"><td colspan="3" style="font-weight:700;color:#e2e8f0;text-align:right">Total Estimated Inventory Cost:</td><td colspan="2" style="font-weight:800;color:#3fb950;font-size:14px">$1,065 - $1,500</td></tr>
          </tbody>
        </table>
        <div style="margin-top:8px;font-size:10px;color:#8b949e">Note: Prices are estimates for standard residential units. Actual costs vary by brand and supplier. A single washer pump repair visit saved ($150-250) pays for the entire pump inventory.</div>
      </div>

      <!-- CAPITAL PRIORITIES -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot do"></span>Capital Improvement Priorities — Ranked by ROI</div>
        <table class="tbl">
          <thead><tr><th>#</th><th>Investment</th><th>Property</th><th>Est. Cost</th><th>Expected Savings</th><th>ROI Timeline</th></tr></thead>
          <tbody>
            <tr><td style="font-weight:800;color:#3fb950">1</td><td>Parts inventory per property</td><td>All</td><td>$1,500 x 18</td><td>50% reduction in appliance avg days</td><td>1-2 months</td></tr>
            <tr><td style="font-weight:800;color:#3fb950">2</td><td>Bulk washer/dryer replacement (units with 3+ WOs)</td><td>Hanley, Boardwalk, Reserve</td><td>$15-25K</td><td>75 fewer slow WOs/year</td><td>3-4 months</td></tr>
            <tr><td style="font-weight:800;color:#3fb950">3</td><td>1 additional maintenance tech</td><td>Hanley Place</td><td>$45-55K/yr</td><td>Avg days from 5.55 to 2.0</td><td>2 months</td></tr>
            <tr><td style="font-weight:800;color:#e3b341">4</td><td>Boardwalk moisture/mold assessment + remediation</td><td>The Boardwalk</td><td>$5-20K</td><td>Eliminate recurring mold WOs</td><td>3-6 months</td></tr>
            <tr><td style="font-weight:800;color:#e3b341">5</td><td>Plumbing infrastructure assessment</td><td>Boardwalk, Hanley, Upland</td><td>$5-10K per property</td><td>Reduce 547 water/leak WOs</td><td>6-12 months</td></tr>
            <tr><td style="font-weight:800;color:#58a6ff">6</td><td>Building pest treatment (whole-building)</td><td>The Julia</td><td>$2-3K</td><td>Reduce 44 pest WOs by 50%+</td><td>1-2 months</td></tr>
            <tr><td style="font-weight:800;color:#58a6ff">7</td><td>Seasonal temp maintenance staff (May-Sep)</td><td>Reserve, Boardwalk, Hanley</td><td>$30-45K total</td><td>Maintain speed during peak volume</td><td>Immediate</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ═══════════ TAB 5: TEMPLATES ═══════════ -->
  <div id="pb-templates" class="panel">
    <div style="padding:14px 18px">
      <div style="background:#0d1117;border:1px solid #21262d;border-radius:8px;padding:14px 16px;margin-bottom:16px;border-left:3px solid #56d4dd">
        <div style="font-size:9px;font-weight:800;color:#56d4dd;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">COPY-PASTE READY</div>
        <div style="font-size:11px;color:#c9d1d9;line-height:1.7">
          <div>These templates are ready to use. Copy, customize the [bracketed items], and send. Each is designed for a specific scenario identified in the data.</div>
        </div>
      </div>

      <!-- TEMPLATE 1: WO OVER 48H -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot db"></span>Resident Text: Work Order Open Over 48 Hours</div>
        <div style="background:#161b22;border-radius:6px;padding:14px;font-size:11px;color:#c9d1d9;line-height:1.7;font-family:monospace;white-space:pre-wrap">Hi [Resident Name],

This is [Property Name] maintenance. We wanted to update you on your recent work order for [issue description].

Current status: [Waiting for a replacement part / Scheduled with our vendor for [date] / Our technician will be there [day]]

We know this is taking longer than we would like and we appreciate your patience. If you have any questions, reply to this message or call the office at [phone].

Thank you,
[Property Name] Maintenance Team</div>
        <div style="font-size:10px;color:#8b949e;margin-top:6px"><strong>When to use:</strong> Auto-trigger at 48 hours for any open WO. 53.5% of WOs close in 24h — this catches the ones that do not. Prevents the "they forgot about me" feeling that leads to negative reviews.</div>
      </div>

      <!-- TEMPLATE 2: WO OVER 7 DAYS -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot dr"></span>Resident Call Script: Work Order Open Over 7 Days</div>
        <div style="background:#161b22;border-radius:6px;padding:14px;font-size:11px;color:#c9d1d9;line-height:1.7;font-family:monospace;white-space:pre-wrap">Hi [Resident Name], this is [Your Name] from [Property Name].

I am calling about your maintenance request for [issue] that was submitted on [date]. I want to apologize that this has taken longer than our standard — that is not the experience we want you to have.

Here is where we are: [explain status — parts on order, vendor scheduled, etc.]

We expect this to be completed by [specific date]. I am going to personally follow up with you on [date] to make sure everything is resolved.

Is there anything else in your apartment that needs attention while I have you?

Thank you for your patience, [Resident Name]. We appreciate you.</div>
        <div style="font-size:10px;color:#8b949e;margin-top:6px"><strong>When to use:</strong> Property manager calls every resident with a WO open 7+ days. There are currently ~350 slow WOs portfolio-wide. This personal touch often prevents the negative review entirely. The "anything else?" question catches issues before they become separate WOs.</div>
      </div>

      <!-- TEMPLATE 3: POST-REPAIR FOLLOWUP -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot dg"></span>Resident Text: Post-Repair Follow-Up (Same Day)</div>
        <div style="background:#161b22;border-radius:6px;padding:14px;font-size:11px;color:#c9d1d9;line-height:1.7;font-family:monospace;white-space:pre-wrap">Hi [Resident Name]! Your maintenance request for [issue] has been completed.

Is everything working properly? If anything is not right, just reply to this message and we will send someone back out.

We appreciate you letting us know about the issue. If you have a moment, we would love a quick review: [review link]

Thank you!
[Property Name]</div>
        <div style="font-size:10px;color:#8b949e;margin-top:6px"><strong>When to use:</strong> Send within 2 hours of closing a WO. Best for same-day closes — catching residents while they are happy with the fast service. This is how you convert fast maintenance into 5-star reviews.</div>
      </div>

      <!-- TEMPLATE 4: NEGATIVE REVIEW RESPONSE -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot do"></span>Public Review Response: Negative Maintenance Review</div>
        <div style="background:#161b22;border-radius:6px;padding:14px;font-size:11px;color:#c9d1d9;line-height:1.7;font-family:monospace;white-space:pre-wrap">[Resident Name], thank you for sharing your experience. We take maintenance response times seriously and I apologize that your [issue type] took longer than our standard.

Since your experience, we have [made specific improvements — examples: added a maintenance team member / implemented same-day response for [category] / partnered with a new vendor for faster [repair type]].

Our current average maintenance completion time is [X] days, with [Y]% of requests completed the same day.

I would like to discuss your experience further and make sure everything in your home is working properly. Please contact me directly at [email/phone].

[Your Name]
[Title], [Property Name]</div>
        <div style="font-size:10px;color:#8b949e;margin-top:6px"><strong>When to use:</strong> Respond to every negative maintenance review within 24 hours. The response is for prospective residents reading reviews, not just the reviewer. Specific numbers (avg days, same-day %) show you track and care about performance.</div>
      </div>

      <!-- TEMPLATE 5: MOLD COMMUNICATION -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot dr"></span>Resident Letter: Mold Remediation Notice</div>
        <div style="background:#161b22;border-radius:6px;padding:14px;font-size:11px;color:#c9d1d9;line-height:1.7;font-family:monospace;white-space:pre-wrap">Dear [Resident Name],

We are writing to inform you about the maintenance work scheduled for your unit regarding the [mold/mildew/moisture] concern you reported on [date].

What we are doing:
- A licensed remediation specialist will [assess/treat] the affected area on [date]
- The work is expected to take [X hours/days]
- [If relocation needed: We will provide temporary accommodations during the work]

What you can expect:
1. Before work begins: Our team will photograph the current condition
2. During remediation: [describe process — containment, treatment, drying]
3. After completion: We will take follow-up photos and conduct a moisture reading
4. 30-day check: We will reinspect to confirm no recurrence

Your health and safety are our top priority. If you have any questions or concerns, please contact [Name] at [phone/email] immediately.

Sincerely,
[Property Manager Name]
[Property Name]</div>
        <div style="font-size:10px;color:#8b949e;margin-top:6px"><strong>When to use:</strong> Send to every resident with a mold WO. Documentation of communication is critical for legal protection. Keep a copy in the unit file. Currently needed at: The Julia (9 units), The Boardwalk (9 WOs), Upland Townhomes, Park at Peachtree Hills, Hanley Place.</div>
      </div>

      <!-- TEMPLATE 6: MAKE-READY CHECKLIST -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot dg"></span>Make-Ready Inspection Checklist (15-Point)</div>
        <table class="tbl">
          <thead><tr><th style="width:30px">#</th><th>Item</th><th style="width:60px">Pass?</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><strong>Front door</strong> — lock, deadbolt, weatherstrip, peephole</td><td>☐</td><td></td></tr>
            <tr><td>2</td><td><strong>All interior doors</strong> — open/close/latch properly</td><td>☐</td><td></td></tr>
            <tr><td>3</td><td><strong>All windows</strong> — open, close, lock, screens intact</td><td>☐</td><td></td></tr>
            <tr><td>4</td><td><strong>Stove/oven</strong> — all burners ignite, oven heats, timer works</td><td>☐</td><td></td></tr>
            <tr><td>5</td><td><strong>Refrigerator</strong> — cooling, freezing, no leaks, shelves clean</td><td>☐</td><td></td></tr>
            <tr><td>6</td><td><strong>Dishwasher</strong> — runs full cycle, drains completely, no leaks</td><td>☐</td><td></td></tr>
            <tr><td>7</td><td><strong>Washer/Dryer</strong> — both run, drain, no leaks, lint trap clean</td><td>☐</td><td></td></tr>
            <tr><td>8</td><td><strong>All faucets</strong> — hot and cold water, no drips, good pressure</td><td>☐</td><td></td></tr>
            <tr><td>9</td><td><strong>All toilets</strong> — flush, fill, no running water, no wobble</td><td>☐</td><td></td></tr>
            <tr><td>10</td><td><strong>Tub/Shower</strong> — drain, faucet, showerhead, caulking intact</td><td>☐</td><td></td></tr>
            <tr><td>11</td><td><strong>HVAC</strong> — AC cools, heat heats, filter replaced, thermostat works</td><td>☐</td><td></td></tr>
            <tr><td>12</td><td><strong>All lights and fans</strong> — switches work, bulbs present, ceiling fans spin</td><td>☐</td><td></td></tr>
            <tr><td>13</td><td><strong>All outlets</strong> — power, GFCI test in kitchen/bath</td><td>☐</td><td></td></tr>
            <tr><td>14</td><td><strong>Smoke/CO detectors</strong> — test button, battery, proper placement</td><td>☐</td><td></td></tr>
            <tr><td>15</td><td><strong>Paint/Walls/Floors</strong> — touch-up complete, no stains, carpet clean</td><td>☐</td><td></td></tr>
          </tbody>
        </table>
        <div style="margin-top:8px;font-size:10px;color:#8b949e">Current data shows 47% of unit turns generate a maintenance callback within 30 days. Using this checklist before handing keys would cut that to under 25%. Top callback issues: Doors/Locks, Appliances, Plumbing — all covered above.</div>
      </div>

      <!-- TEMPLATE 7: ESCALATION WORKFLOW -->
      <div class="card" style="margin-bottom:16px">
        <div class="ct"><span class="dot do"></span>Escalation Workflow — When to Escalate and To Whom</div>
        <table class="tbl">
          <thead><tr><th>Trigger</th><th>Escalate To</th><th>Action Required</th><th>Timeline</th></tr></thead>
          <tbody>
            <tr style="background:#1c1010"><td style="color:#f85149;font-weight:700">Mold reported</td><td>Property Manager + Regional</td><td>Document, assess within 48h, remediate within 5 days</td><td>Immediate</td></tr>
            <tr style="background:#1c1010"><td style="color:#f85149;font-weight:700">Smoke detector non-functional</td><td>Maintenance Lead</td><td>Replace same day — fire code compliance</td><td>Same day</td></tr>
            <tr style="background:#1c1010"><td style="color:#f85149;font-weight:700">Flood / Major Leak</td><td>Emergency On-Call + Property Manager</td><td>Water shutoff, extraction, document damage</td><td>Within 2 hours</td></tr>
            <tr><td style="color:#e3b341;font-weight:700">WO open 5 days</td><td>Maintenance Supervisor</td><td>Review status, identify blocker, set completion date</td><td>Next business day</td></tr>
            <tr><td style="color:#e3b341;font-weight:700">WO open 7 days</td><td>Property Manager</td><td>Call resident, document reason for delay, set deadline</td><td>Within 24 hours</td></tr>
            <tr><td style="color:#e3b341;font-weight:700">WO open 14 days</td><td>Regional Director</td><td>Executive review. Is this a stuck ticket or a real 14-day issue?</td><td>Within 24 hours</td></tr>
            <tr><td style="color:#58a6ff;font-weight:700">3rd WO same unit, same issue</td><td>Maintenance Supervisor</td><td>Root cause analysis. Consider replacement vs. repair.</td><td>Before 3rd dispatch</td></tr>
            <tr><td style="color:#58a6ff;font-weight:700">Vendor misses SLA</td><td>Property Manager</td><td>Document. 3rd miss in a month = vendor review meeting.</td><td>Log same day</td></tr>
            <tr><td style="color:#58a6ff;font-weight:700">Negative maintenance review posted</td><td>Property Manager</td><td>Respond publicly within 24h. Call resident to resolve.</td><td>Within 24 hours</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</div>
`;

// Inject page before page-asset
html = html.replace(
  `<div id="page-asset" class="page">`,
  playbookHTML + `\n<div id="page-asset" class="page">`
);

// ═══════════════════════════════════════════════════════════════
// DONE
// ═══════════════════════════════════════════════════════════════
fs.writeFileSync('/Users/zk/Desktop/wo-dashboard/index.html', html);
console.log('Done! Action Playbook page added. File size: ' + Math.round(html.length/1024) + ' KB');
