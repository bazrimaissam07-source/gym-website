"use strict";

const classData = [
  { id: 1, name: "HIIT Burn",       trainer: "Karim Boudiaf",  day: "Saturday",  time: "08:00", duration: 60,  difficulty: "Advanced"    },
  { id: 2, name: "Morning Yoga",    trainer: "Samira Haddad",  day: "Sunday",    time: "07:00", duration: 50,  difficulty: "Beginner"    },
  { id: 3, name: "Powerlifting 101",trainer: "Yacine Rais",    day: "Monday",    time: "10:00", duration: 75,  difficulty: "Intermediate"},
  { id: 4, name: "Boxing Basics",   trainer: "Khamzat Chimaev",day: "Monday",    time: "18:00", duration: 60,  difficulty: "Beginner"    },
  { id: 5, name: "Spin Cycle",      trainer: "Karim Boudiaf",  day: "Tuesday",   time: "07:30", duration: 45,  difficulty: "Intermediate"},
  { id: 6, name: "Pilates Flow",    trainer: "Samira Haddad",  day: "Tuesday",   time: "09:00", duration: 55,  difficulty: "Beginner"    },
  { id: 7, name: "Strength & Size", trainer: "Yacine Rais",    day: "Wednesday", time: "11:00", duration: 90,  difficulty: "Advanced"    },
  { id: 8, name: "MMA Sparring",    trainer: "Khamzat Chimaev",day: "Wednesday", time: "19:00", duration: 60,  difficulty: "Advanced"    },
  { id: 9, name: "Cardio Blast",    trainer: "Karim Boudiaf",  day: "Thursday",  time: "08:00", duration: 50,  difficulty: "Intermediate"},
  { id: 10,name: "Yoga & Stretch",  trainer: "Samira Haddad",  day: "Thursday",  time: "17:00", duration: 60,  difficulty: "Beginner"    },
  { id: 11,name: "Deadlift Club",   trainer: "Yacine Rais",    day: "Saturday",  time: "09:00", duration: 75,  difficulty: "Advanced"    },
  { id: 12,name: "Combat Fitness",  trainer: "Khamzat Chimaev",day: "Sunday",    time: "10:00", duration: 60,  difficulty: "Intermediate"},
];
const DAY_ORDER = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"];

let activeTrainer    = "All";
let activeDays       = [];          // multi-select
let activeDifficulty = "All";
let sortKey          = null;        // which column is being sorted
let sortDir          = "asc";       // "asc" | "desc"

function difficultyBadge(level) {
  const classes = { Beginner: "badge-beginner", Intermediate: "badge-intermediate", Advanced: "badge-advanced" };
  return `<span class="badge ${classes[level] || ''}">${level}</span>`;
}

function renderTable(data) {
  const tbody = document.getElementById("classes-tbody");
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:rgba(255,255,255,0.3);">No classes match the selected filters.</td></tr>`;
    return;
  }

 tbody.innerHTML = data.map(c => `
    <tr>
      <td style="color:#fff;font-weight:600;">${c.name}</td>
      <td>${c.trainer}</td>
      <td>${c.day}</td>
      <td>${c.time}</td>
      <td>${c.duration} min</td>
      <td>${difficultyBadge(c.difficulty)}</td>
      <td><a href="#" style="color:var(--cyan);font-size:0.8rem;">Details →</a></td>
    </tr>
  `).join("");
}

function getFilteredSorted() {
  let result = classData.filter(c => {
    const trainerOk    = activeTrainer === "All" || c.trainer === activeTrainer;  //Trainer matches (or "All" is selected)
    const dayOk        = activeDays.length === 0 || activeDays.includes(c.day);
    const difficultyOk = activeDifficulty === "All" || c.difficulty === activeDifficulty;
    return trainerOk && dayOk && difficultyOk;
  });

  if (sortKey) {
    result = [...result].sort((a, b) => {     //copy of the resukt
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (sortKey === "day") {
        valA = DAY_ORDER.indexOf(valA);   //using DAY_ORDER so days sort in week order
        valB = DAY_ORDER.indexOf(valB);
      }
      if (sortKey === "duration") {
        valA = Number(valA); valB = Number(valB);  // Number so it sorts numerically
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1  : -1;
      return 0;
    });
  }
  return result;
}

function refresh() {   //called every time anything changes
  renderTable(getFilteredSorted());
  updateSortIndicators();
}

function updateSortIndicators() {
  ["sort-name","sort-day","sort-time","sort-duration"].forEach(id => {
    const th = document.getElementById(id);
    if (!th) return;
    th.textContent = th.dataset.label;
    if (sortKey === th.dataset.key) {
      th.textContent += sortDir === "asc" ? " ▲" : " ▼";
    }
  });
}

function buildFilterControls() {
  const container = document.getElementById("filter-controls");
  if (!container) return;

  const trainers = ["All", ...new Set(classData.map(c => c.trainer))];

  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;align-items:flex-end;">

      <div>
        <label style="display:block;font-size:0.65rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--cyan);margin-bottom:0.4rem;">Trainer</label>
        <select id="filter-trainer" style="background:#0e2847;color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:4px;padding:0.5rem 0.8rem;font-size:0.85rem;cursor:pointer;">
          ${trainers.map(t => `<option value="${t}">${t}</option>`).join("")}
        </select>
      </div>

      <div>
        <label style="display:block;font-size:0.65rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--cyan);margin-bottom:0.4rem;">Difficulty</label>
        <div style="display:flex;gap:0.4rem;" id="difficulty-btns">
          ${["All","Beginner","Intermediate","Advanced"].map(d =>
            `<button type="button" class="btn btn-sm diff-btn ${d === "All" ? "btn-cyan-outline" : "btn-outline"}" data-diff="${d}"
              style="padding:0.4rem 0.9rem;">${d}</button>`
          ).join("")}
        </div>
      </div>

      <div>
        <label style="display:block;font-size:0.65rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--cyan);margin-bottom:0.4rem;">Day</label>
        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;" id="day-btns">
          ${["Sat","Sun","Mon","Tue","Wed","Thu","Fri"].map((short, i) => {
            const full = DAY_ORDER[i];
            return `<button type="button" class="btn btn-sm btn-outline day-btn" data-day="${full}"
              style="padding:0.4rem 0.7rem;">${short}</button>`;
          }).join("")}
        </div>
      </div>

      <button type="button" id="clear-filters" class="btn btn-sm btn-outline" style="padding:0.4rem 1rem;margin-top:auto;">Clear</button>
    </div>
  `;

  document.getElementById("filter-trainer").addEventListener("change", function () {
    activeTrainer = this.value;
    refresh();
  });

  document.getElementById("difficulty-btns").addEventListener("click", function (e) {
    const btn = e.target.closest(".diff-btn");
    if (!btn) return;
    activeDifficulty = btn.dataset.diff;
    // Update button styles (event delegation)
    this.querySelectorAll(".diff-btn").forEach(b => {
      b.className = b.className.replace("btn-cyan-outline", "btn-outline");
    });
    btn.className = btn.className.replace("btn-outline", "btn-cyan-outline");
    refresh();
  });

  document.getElementById("day-btns").addEventListener("click", function (e) {
    const btn = e.target.closest(".day-btn");
    if (!btn) return;
    const day = btn.dataset.day;
    const idx = activeDays.indexOf(day);
    if (idx === -1) {
      activeDays.push(day);
      btn.className = btn.className.replace("btn-outline", "btn-cyan-outline");
    } else {
      activeDays.splice(idx, 1);
      btn.className = btn.className.replace("btn-cyan-outline", "btn-outline");
    }
    refresh();
  });

  document.getElementById("clear-filters").addEventListener("click", function () {
    activeTrainer = "All";
    activeDays = [];
    activeDifficulty = "All";
    document.getElementById("filter-trainer").value = "All";
    document.querySelectorAll(".diff-btn").forEach(b => {
      b.className = b.className.replace("btn-cyan-outline", "btn-outline");
      if (b.dataset.diff === "All") b.className = b.className.replace("btn-outline", "btn-cyan-outline");
    });
    document.querySelectorAll(".day-btn").forEach(b => {
      b.className = b.className.replace("btn-cyan-outline", "btn-outline");
    });
    refresh();
  });
}

function setupSortHeaders() {
  const headers = {
    "sort-name":     "name",
    "sort-day":      "day",
    "sort-time":     "time",
    "sort-duration": "duration",
  };

  Object.entries(headers).forEach(([id, key]) => {
    const th = document.getElementById(id);
    if (!th) return;
    th.dataset.key   = key;
    th.dataset.label = th.textContent.trim();
    th.style.cursor  = "pointer";
    th.title         = `Sort by ${key}`;
    th.addEventListener("click", () => {
      if (sortKey === key) {
        sortDir = sortDir === "asc" ? "desc" : "asc";
      } else {
        sortKey = key;
        sortDir = "asc";
      }
      refresh();
    });
  });
}

buildFilterControls();
setupSortHeaders();
refresh();