/* 90-Day Back on Track tracker. Data saves in this browser (localStorage). */
const START = new Date(2026, 9, 1);
const dateOf = (n) => new Date(2026, 9, n); // n = day number; month overflow handled by Date
const fmtLong = (d) => d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
const fmtShort = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

const PHASES = [
  {
    id: 1, name: "Return", range: "Oct 1–30", from: 1, to: 30, color: "#464aa3",
    focus: "Spiritual restoration + personal realignment",
    items: [
      "Recover spiritual rhythm and sensitivity to God.",
      "Write a one-page life/season vision.",
      "Identify and reduce the 3 biggest sources of drift.",
      "Stabilize sleep, prayer, Scripture, exercise and deep work.",
      "Begin the primary 90-day skill and output.",
    ],
  },
  {
    id: 2, name: "Rebuild", range: "Oct 31–Nov 29", from: 31, to: 60, color: "#b9740c",
    focus: "Discipline + capacity + execution",
    items: [
      "Turn routines into systems.",
      "Complete about 10 focused skill-development hours each week.",
      "Increase deep-work consistency.",
      "Make visible progress on the 90-day output.",
      "Stop depending on motivation.",
    ],
  },
  {
    id: 3, name: "Rise", range: "Nov 30–Dec 29", from: 61, to: 90, color: "#0c8573",
    focus: "Execution + impact + momentum",
    items: [
      "Reduce unnecessary activity and focus.",
      "Produce tangible work.",
      "Finish the primary 90-day output.",
      "Document what changed and what worked.",
      "Prepare a clear next-season vision for 2027.",
    ],
  },
];

const WEEKS = [
  { n: 1, title: "Reset", from: 1, to: 7, items: ["Complete spiritual/personal inventory.", "Write your one-page life/season vision.", "Clean your physical/digital environment.", "Fix your sleep/wake target.", "Choose your 90-day skill and output."] },
  { n: 2, title: "Restore", from: 8, to: 14, items: ["Establish daily prayer + Scripture.", "Begin daily deep work.", "Begin exercise/movement rhythm.", "Reduce the 3 major distractions.", "Complete first meaningful skill/output session."] },
  { n: 3, title: "Rebuild", from: 15, to: 21, items: ["Strengthen routines.", "Work consistently on your primary skill.", "Move the main project forward.", "Review relationships and commitments.", "Finish at least one small thing."] },
  { n: 4, title: "Stabilize", from: 22, to: 30, items: ["Make the routine sustainable.", "Review October honestly.", "Identify recurring drift patterns.", "Increase consistency rather than intensity.", "Set November's measurable targets."] },
  { n: 5, title: "Capacity", from: 31, to: 37, items: ["Learn deliberately.", "Practice the primary skill.", "Protect deep work blocks.", "Create something tangible.", "Complete weekly review."] },
  { n: 6, title: "Discipline", from: 38, to: 44, items: ["Increase output.", "Reduce unnecessary screen time.", "Keep spiritual practices consistent.", "Maintain exercise/sleep.", "Push the main project forward."] },
  { n: 7, title: "Execution", from: 45, to: 51, items: ["Stop overthinking.", "Make visible progress every workday.", "Finish a defined project component.", "Seek accountability where useful.", "Review what is actually producing results."] },
  { n: 8, title: "Momentum", from: 52, to: 60, items: ["Keep systems running.", "Close unfinished October/November loops.", "Assess skill progress.", "Prepare the final-month push.", "Set December completion criteria."] },
  { n: 9, title: "Focus", from: 61, to: 67, items: ["Eliminate nonessential activity.", "Prioritize the main output.", "Protect spiritual depth.", "Use deep work consistently.", "Track tangible progress."] },
  { n: 10, title: "Production", from: 68, to: 74, items: ["Build/publish/complete.", "Push the main deliverable.", "Avoid starting unnecessary projects.", "Keep daily disciplines intact.", "Get feedback if needed."] },
  { n: 11, title: "Completion", from: 75, to: 81, items: ["Finish what you started.", "Resolve remaining blockers.", "Document results.", "Celebrate legitimate wins.", "Prepare final review."] },
  { n: 12, title: "Consolidation", from: 82, to: 88, items: ["Review the full 90-day journey.", "Document habits that worked.", "Identify lessons and recurring weaknesses.", "Complete remaining deliverables.", "Draft 2027 direction."] },
  { n: 13, title: "Reflection + next level", from: 89, to: 90, items: ["Compare October 1 with December 29.", "Record spiritual, personal and practical changes.", "Define what continues into 2027.", "Set the next season's priorities.", "Give thanks and recommit."] },
];

const DAILY = [
  "Prayer", "Scripture", "Journal / reflection", "Exercise / movement", "Apply one mind-shaping principle from Battlefield of the Mind", "Daily book reading",
  "90-minute deep work (or equivalent)", "Primary skill practice",
  "Important responsibility completed", "Distraction controlled", "Night Prayers", "Evening review & Learning applied?",
];
const MIN_DAY = ["1 hr prayer", "20 minutes Scripture", "20 minutes important work", "10 minutes exercise", "5 minutes evening review"];

const TARGETS = [
  ["Spirit", "Have a consistent prayer and Scripture rhythm and greater sensitivity to God."],
  ["Mind", "Develop deliberately through reading, learning and reflection."],
  ["Body", "Improve sleep, movement, fitness and physical discipline."],
  ["Vision", "Have a clear one-page life/season vision and priorities."],
  ["Work", "Execute consistently on meaningful responsibilities."],
  ["Skill", "Make measurable progress in ONE primary skill."],
  ["Relationships", "Cultivate intentional, healthy and accountable relationships."],
  ["Stewardship", "Manage time, attention, money and commitments more intentionally."],
  ["Output", "Finish one tangible 90-day project, product, milestone or body of work."],
];

const RULES = [
  ["Never miss twice.", "A bad day does not need to become a bad week."],
  ["Continue, don't restart.", "If you fall off on Tuesday, resume Wednesday."],
  ["Use minimum viable discipline.", "On difficult days, do the minimum rather than abandoning the rhythm."],
  ["Apply more than you consume.", "Information is not the same as transformation."],
  ["Finish.", "Build a culture of completion: less 'I'm planning to'; more 'it's done.'"],
];

const OS = [
  ["Morning", "Prayer, Scripture, journal, review priorities, begin important work before unnecessary scrolling."],
  ["Deep work", "At least 90 minutes focused on the day's most important task."],
  ["Skill", "Deliberate practice toward your one primary 90-day skill."],
  ["Body", "Exercise/movement, intentional food and hydration, protect sleep."],
  ["Evening", "Review the day: obedience, drift, lessons, unfinished priorities."],
];

const WEEK_REVIEW_Q = ["What went well?", "Where did I drift?", "What did God teach me?", "What must change next week?", "One thing I must finish"];
const PHASE_Q = ["What must be true by the end of this phase?", "What will I stop doing?", "What will I start doing?"];


/* ---------- helpers ---------- */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const phaseOf = (n) => PHASES.find((p) => n >= p.from && n <= p.to);
const weekOf = (n) => WEEKS.find((w) => n >= w.from && n <= w.to);
const emptyDay = () => ({ checks: Array(9).fill(false), win: "", won: "", drift: "", tomorrow: "" });
const emptyWeek = () => ({ checks: Array(5).fill(false), top: ["", "", ""], review: Array(5).fill("") });
const count = (d) => (d ? d.checks.filter(Boolean).length : 0);
const todayNumber = () => {
  const n = new Date();
  return Math.round((new Date(n.getFullYear(), n.getMonth(), n.getDate()) - START) / 86400000) + 1;
};

/* ---------- state + saving ---------- */
const KEY = "plan90-v1";
let data = {};
try { data = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
data.days = data.days || {};
data.weeks = data.weeks || {};
data.plan = Object.assign({ targets: {}, skill: "", output: "", drift: ["", "", ""], phases: {}, phaseChecks: {} }, data.plan);

const todayN = todayNumber();
let sel = Math.min(90, Math.max(1, todayN));
let view = "day";
let saveTimer;

function setBadge(state) {
  const b = $("#save");
  b.dataset.state = state;
  b.textContent = { saving: "Saving…", saved: "Saved", fail: "Not saving", idle: "Ready" }[state];
}
function save() {
  setBadge("saving");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); setBadge("saved"); } catch (e) { setBadge("fail"); }
  }, 400);
}
const ensureDay = (n) => (data.days[n] = data.days[n] || emptyDay());
const ensureWeek = (n) => (data.weeks[n] = data.weeks[n] || emptyWeek());
const getDay = (n) => data.days[n] || emptyDay();
const getWeek = (n) => data.weeks[n] || emptyWeek();

/* ---------- building blocks ---------- */
const field = (label, val, attrs, rows = 2, ph = "Write here") =>
  `<label class="field"><span class="field-label">${label}</span><textarea rows="${rows}" placeholder="${esc(ph)}" ${attrs}>${esc(val)}</textarea></label>`;
const checkRow = (label, on, color, attrs) =>
  `<button type="button" class="check${on ? " on" : ""}" style="--c:${color}" role="checkbox" aria-checked="${on}" ${attrs}><span class="box" aria-hidden="true">${on ? "✓" : ""}</span><span class="check-text">${label}</span></button>`;
const top3 = (vals, color, attrs) =>
  vals.map((v, i) => `<label class="top3"><span style="background:${color}">${i + 1}</span><input value="${esc(v)}" placeholder="Write here" ${attrs} data-i="${i}"></label>`).join("");

/* ---------- top: stats + overall grid ---------- */
function renderTop() {
  let full = 0, part = 0, streak = 0;
  for (let n = 1; n <= 90; n++) { const c = count(data.days[n]); if (c === 9) full++; else if (c > 0) part++; }
  let n = Math.min(90, Math.max(0, todayN));
  if (n >= 1 && count(data.days[n]) < 9) n--;
  while (n >= 1 && count(data.days[n]) === 9) { streak++; n--; }

  $("#stats").innerHTML =
    `<div><b>${todayN < 1 ? "Starts Oct 1" : todayN > 90 ? "Finished" : "Day " + todayN}</b><span>of 90</span></div>` +
    `<div><b>${full}</b><span>full days</span></div><div><b>${streak}</b><span>day streak</span></div><div><b>${part}</b><span>partial days</span></div>`;

  $("#grid").innerHTML = PHASES.map((p) => {
    let cells = "";
    for (let d = p.from; d <= p.to; d++) {
      const c = count(data.days[d]);
      const st = c === 12 ? "full" : c > 0 ? "part" : d < todayN ? "miss" : "future";
      const op = st === "part" ? 0.22 + 0.55 * (c / 9) : 1;
      cells += `<button type="button" class="cell ${st}${d === todayN ? " today" : ""}${d === sel ? " sel" : ""}" style="--c:${p.color};--o:${op}" data-a="day" data-n="${d}" aria-label="Day ${d}, ${fmtShort(dateOf(d))}, ${c} of 12 done"><i></i><em>${st === "full" ? "✓" : d}</em></button>`;
    }
    return `<div class="phase-row"><div class="phase-tag" style="color:${p.color}"><b>${p.name}</b><span>${p.range}</span></div><div class="cells">${cells}</div></div>`;
  }).join("") +
    `<div class="legend"><span><i class="lg full"></i>All 12 done</span><span><i class="lg part"></i>Some done</span><span><i class="lg miss"></i>Missed</span><span><i class="lg future"></i>Ahead</span></div>`;

  document.querySelectorAll(".tabs button").forEach((b) => {
    b.classList.toggle("active", b.dataset.v === view);
    b.setAttribute("aria-selected", b.dataset.v === view);
  });
}

/* ---------- views ---------- */
function dayView() {
  const p = phaseOf(sel), w = weekOf(sel), d = getDay(sel), c = count(d);
  const missedYesterday = sel === todayN && sel > 1 && count(data.days[sel - 1]) === 0;
  const tc = Math.min(90, Math.max(1, todayN));
  return `
  <div class="nav-row">
    <button class="step" ${sel <= 1 ? "disabled" : ""} data-a="step" data-d="-1" aria-label="Previous day">‹</button>
    <div class="nav-mid"><div class="kicker" style="color:${p.color}">${p.name}, Week ${w.n}</div><h2>Day ${sel}</h2><div class="date">${fmtLong(dateOf(sel))}</div></div>
    <button class="step" ${sel >= 90 ? "disabled" : ""} data-a="step" data-d="1" aria-label="Next day">›</button>
  </div>
  ${sel !== tc ? `<button class="link" data-a="day" data-n="${tc}">Jump to today</button>` : ""}
  ${missedYesterday ? `<div class="nudge">Yesterday was missed. Never miss twice: even the minimum day counts today.</div>` : ""}
  ${field("Today's one most important win (set it this morning)", d.win, 'data-s="day" data-k="win"')}
  <div class="card">
    <div class="card-head"><h3>Daily checklist</h3><span class="frac" style="color:${p.color}">${c}/12</span></div>
    <div class="bar"><div style="width:${(c / 12) * 100}%;background:${p.color}"></div></div>
    ${DAILY.map((l, i) => checkRow(l, d.checks[i], p.color, `data-a="tday" data-i="${i}"`)).join("")}
    <details class="min"><summary>Minimum viable day</summary><ul>${MIN_DAY.map((m) => `<li>${m}</li>`).join("")}</ul><p>A minimum day is not the goal. It is the safety net that prevents one difficult day from becoming a lost week.</p></details>
  </div>
  <div class="card"><h3>Evening review</h3>
    ${field("Today's most important win", d.won, 'data-s="day" data-k="won"')}
    ${field("Where did I drift?", d.drift, 'data-s="day" data-k="drift"')}
    ${field("What will I do differently tomorrow?", d.tomorrow, 'data-s="day" data-k="tomorrow"')}
  </div>
  <div class="pager">
    <button class="step wide" ${sel <= 1 ? "disabled" : ""} data-a="step" data-d="-1">‹ Day ${sel - 1}</button>
    <button class="step wide" ${sel >= 90 ? "disabled" : ""} data-a="step" data-d="1">Day ${sel + 1} ›</button>
  </div>`;
}

function weekView() {
  const w = weekOf(sel), wd = getWeek(w.n), wp = phaseOf(w.from);
  const days = [];
  for (let n = w.from; n <= w.to; n++) days.push(n);
  const done = days.filter((n) => count(data.days[n]) === 9).length;
  return `
  <div class="nav-row">
    <button class="step" ${w.n <= 1 ? "disabled" : ""} data-a="wstep" data-d="-1" aria-label="Previous week">‹</button>
    <div class="nav-mid"><div class="kicker" style="color:${wp.color}">${wp.name}</div><h2>Week ${w.n}: ${w.title}</h2><div class="date">${fmtShort(dateOf(w.from))} to ${fmtShort(dateOf(w.to))}, ${done} of ${days.length} days complete</div></div>
    <button class="step" ${w.n >= 13 ? "disabled" : ""} data-a="wstep" data-d="1" aria-label="Next week">›</button>
  </div>
  <div class="week-days">${days.map((n) => `<button class="wd${n === sel ? " sel" : ""}" style="--c:${wp.color}" data-a="day" data-n="${n}"><span>${dateOf(n).toLocaleDateString(undefined, { weekday: "short" })}</span><b>${dateOf(n).getDate()}</b><small>${count(data.days[n])}/12</small></button>`).join("")}</div>
  <div class="card"><h3>This week's focus</h3>${w.items.map((l, i) => checkRow(l, wd.checks[i], wp.color, `data-a="twk" data-i="${i}"`)).join("")}</div>
  <div class="card"><h3>This week's top 3</h3>${top3(wd.top, wp.color, 'data-s="wtop"')}</div>
  <div class="card"><h3>Weekly review</h3>${WEEK_REVIEW_Q.map((q, i) => field(q, wd.review[i], `data-s="wrev" data-i="${i}"`)).join("")}</div>`;
}

function planView() {
  const pl = data.plan;
  return `
  <blockquote class="verse">“Remember therefore from where you have fallen; repent and do the first works.”<cite>Revelation 2:5</cite></blockquote>
  <div class="card"><h3>Five rules</h3><ol class="rules">${RULES.map(([a, b]) => `<li><b>${a}</b> ${b}</li>`).join("")}</ol></div>
  <div class="card"><h3>My 90-day targets</h3><p class="hint">By December 29, I want to…</p>
    ${TARGETS.map(([a, def]) => field(a, pl.targets[a], `data-s="target" data-k="${a}"`, 2, def)).join("")}
    ${field("My primary 90-day skill", pl.skill, 'data-s="skill"', 1)}
    ${field("My 90-day output / project", pl.output, 'data-s="output"')}
    <div class="sub-label">My three biggest sources of drift to reduce</div>${top3(pl.drift, "#464aa3", 'data-s="pdrift"')}
  </div>
  ${PHASES.map((p) => {
    const pc = pl.phaseChecks[p.id] || Array(5).fill(false), pr = pl.phases[p.id] || ["", "", ""];
    return `<div class="card" style="border-top:4px solid ${p.color}"><h3 style="color:${p.color}">Phase ${p.id}: ${p.name}</h3><p class="hint">${p.range}, ${p.focus}</p>
      ${p.items.map((l, i) => checkRow(l, pc[i], p.color, `data-a="tph" data-p="${p.id}" data-i="${i}"`)).join("")}
      <div class="sub-label">Phase review</div>${PHASE_Q.map((q, i) => field(q, pr[i], `data-s="phrev" data-p="${p.id}" data-i="${i}"`)).join("")}</div>`;
  }).join("")}
  <div class="card"><h3>Daily operating system</h3><p class="hint">Adjust the clock times to your real schedule; keep the order and priorities.</p>
    <dl class="os">${OS.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl></div>`;
}

function render(scroll) {
  renderTop();
  $("#main").innerHTML = view === "day" ? dayView() : view === "week" ? weekView() : planView();
  if (scroll) window.scrollTo(0, 0);
}

/* ---------- events ---------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-a]");
  if (!t || t.disabled) return;
  const a = t.dataset.a, i = +t.dataset.i;
  if (a === "day") { sel = +t.dataset.n; view = "day"; return render(true); }
  if (a === "step") { sel = Math.min(90, Math.max(1, sel + +t.dataset.d)); return render(true); }
  if (a === "wstep") { sel = WEEKS[weekOf(sel).n - 1 + +t.dataset.d].from; return render(true); }
  if (a === "tday") { const d = ensureDay(sel); d.checks[i] = !d.checks[i]; }
  if (a === "twk") { const w = ensureWeek(weekOf(sel).n); w.checks[i] = !w.checks[i]; }
  if (a === "tph") {
    const id = t.dataset.p, c = data.plan.phaseChecks[id] || Array(5).fill(false);
    c[i] = !c[i]; data.plan.phaseChecks[id] = c;
  }
  save(); render();
});

document.querySelectorAll(".tabs button").forEach((b) => b.addEventListener("click", () => { view = b.dataset.v; render(true); }));

document.addEventListener("input", (e) => {
  const t = e.target, s = t.dataset.s;
  if (!s) return;
  const v = t.value, i = +t.dataset.i, p = t.dataset.p, pl = data.plan;
  if (s === "day") ensureDay(sel)[t.dataset.k] = v;
  else if (s === "wtop") ensureWeek(weekOf(sel).n).top[i] = v;
  else if (s === "wrev") ensureWeek(weekOf(sel).n).review[i] = v;
  else if (s === "target") pl.targets[t.dataset.k] = v;
  else if (s === "skill") pl.skill = v;
  else if (s === "output") pl.output = v;
  else if (s === "pdrift") pl.drift[i] = v;
  else if (s === "phrev") { const r = pl.phases[p] || ["", "", ""]; r[i] = v; pl.phases[p] = r; }
  save();
});

setBadge("idle");
render();
