"use strict";
const trainersData = [
  {
    id:         "karim-boudiaf",
    name:       "Karim Boudiaf",
    specialty:  "HIIT & Cardio",
    experience: "8 years",
    email:      "karim@gorillagym.dz",
    bio:        "Karim is passionate about high-intensity training and has helped hundreds of members shed weight and build endurance. His sessions are tough but always rewarding.",
    schedule:   ["Saturday 08:00 – HIIT Burn", "Tuesday 07:30 – Spin Cycle", "Thursday 08:00 – Cardio Blast"],
    photo:      "images/trainer.1.jpg",
  },
  {
    id:         "yacine-rais",
    name:       "Yacine Rais",
    specialty:  "Powerlifting & Strength",
    experience: "12 years",
    email:      "yacine@gorillagym.dz",
    bio:        "A former national powerlifting competitor, Yacine brings elite-level knowledge to every session. He specialises in helping athletes and beginners alike build real, functional strength.",
    schedule:   ["Monday 10:00 – Powerlifting 101", "Wednesday 11:00 – Strength & Size", "Saturday 09:00 – Deadlift Club"],
    photo:      "images/trainer02.jpg",
  },
  {
    id:         "samira-haddad",
    name:       "Samira Haddad",
    specialty:  "Yoga & Pilates",
    experience: "6 years",
    email:      "samira@gorillagym.dz",
    bio:        "Samira creates a calm, focused environment where members improve flexibility, posture, and mental wellbeing. Her classes are open to all levels and always leave you feeling restored.",
    schedule:   ["Sunday 07:00 – Morning Yoga", "Tuesday 09:00 – Pilates Flow", "Thursday 17:00 – Yoga & Stretch"],
    photo:      "images/trainer03.jpg",
  },
  {
    id:         "khamzat-chimaev",
    name:       "Khamzat Chimaev",
    specialty:  "Boxing & MMA",
    experience: "10 years",
    email:      "khamzat@gorillagym.dz",
    bio:        "Khamzat brings the discipline and technique of combat sports into every session. Whether you're a complete beginner or a seasoned fighter, his coaching will sharpen your skills and build confidence.",
    schedule:   ["Monday 18:00 – Boxing Basics", "Wednesday 19:00 – MMA Sparring", "Sunday 10:00 – Combat Fitness"],
    photo:      "images/trainer04.png",
  },
];

function buildSearchBar() {
  const grid = document.querySelector(".grid-4");
  if (!grid) return;

  const wrapper = document.createElement("div");
  wrapper.style.cssText = "margin-bottom:2rem;";

  const input = document.createElement("input");
  input.type        = "text";
  input.id          = "trainer-search";
  input.placeholder = "Search by name or specialty…";
  input.style.cssText = `
    width: 100%; max-width: 420px;
    padding: 0.72rem 1rem;
    background: #0e2847; color: #fff;
    border: 1px solid rgba(255,255,255,0.15); border-radius: 6px;
    font-family: 'Barlow', sans-serif; font-size: 0.92rem;
    outline: none; transition: border-color 0.2s;
  `;
  input.addEventListener("focus", () => input.style.borderColor = "#629fad");
  input.addEventListener("blur",  () => input.style.borderColor = "rgba(255,255,255,0.15)");

  // Live search — fires on every keystroke
  input.addEventListener("input", () => filterTrainers(input.value));

  wrapper.appendChild(input);
  grid.insertAdjacentElement("beforebegin", wrapper);
}

function filterTrainers(query) {
  const q = query.toLowerCase().trim(); // case-insensitive
  const cards = document.querySelectorAll(".trainer-card");
  let visibleCount = 0;

  cards.forEach(card => {
    const id      = card.dataset.trainerId;
    const trainer = trainersData.find(t => t.id === id);
    if (!trainer) return;

    const matches = q === "" ||
      trainer.name.toLowerCase().includes(q) ||
      trainer.specialty.toLowerCase().includes(q);

    card.style.display = matches ? "" : "none";
    if (matches) visibleCount++;
  });

  let noMsg = document.getElementById("trainers-no-results");
  if (visibleCount === 0) {
    if (!noMsg) {
      noMsg = document.createElement("p");
      noMsg.id = "trainers-no-results";
      noMsg.textContent = "No trainers found. Try a different name or specialty.";
      noMsg.style.cssText = "color:rgba(255,255,255,0.4);text-align:center;padding:2rem;width:100%;grid-column:1/-1;";
      document.querySelector(".grid-4").appendChild(noMsg);
    }
    noMsg.style.display = "block";
  } else {
    if (noMsg) noMsg.style.display = "none";
  }
}

function openModal(trainerId) {
  const trainer = trainersData.find(t => t.id === trainerId);
  if (!trainer) return;

  const existing = document.getElementById("trainer-modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "trainer-modal-overlay";
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 1rem;
  `;

  const modal = document.createElement("div");
  modal.id = "trainer-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", `${trainer.name} profile`);
  modal.style.cssText = `
    background: #0e2847; border: 1px solid rgba(98,159,173,0.4);
    border-radius: 12px; padding: 2rem; max-width: 520px; width: 100%;
    position: relative; max-height: 90vh; overflow-y: auto;
  `;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.setAttribute("aria-label", "Close modal");
  closeBtn.style.cssText = `
    position: absolute; top: 1rem; right: 1rem;
    background: transparent; border: none; color: rgba(255,255,255,0.5);
    font-size: 1.8rem; cursor: pointer; line-height: 1; padding: 0.2rem 0.5rem;
    border-radius: 4px; transition: color 0.2s;
  `;
  closeBtn.addEventListener("mouseenter", () => closeBtn.style.color = "#fff");
  closeBtn.addEventListener("mouseleave", () => closeBtn.style.color = "rgba(255,255,255,0.5)");
  closeBtn.addEventListener("click", closeModal);

  // Build schedule list HTML
  const scheduleItems = trainer.schedule
    .map(s => `<li style="color:rgba(255,255,255,0.6);font-size:0.85rem;margin-bottom:0.3rem;">• ${s}</li>`)
    .join("");

  modal.innerHTML = `
    <div style="display:flex;align-items:center;gap:1.5rem;margin-bottom:1.5rem;">
      <img src="${trainer.photo}" alt="${trainer.name}"
        style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #629fad;background:#1a3d5c;"
        onerror="this.style.display='none'">
      <div>
        <div style="font-size:0.6rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#629fad;margin-bottom:0.3rem;">
          ${trainer.specialty}
        </div>
        <h3 style="font-family:'Barlow Condensed',sans-serif;font-size:1.8rem;font-weight:800;
                   text-transform:uppercase;color:#fff;line-height:1;margin-bottom:0.3rem;">
          ${trainer.name}
        </h3>
        <div style="font-size:0.78rem;color:rgba(255,255,255,0.4);">${trainer.experience} experience</div>
      </div>
    </div>

    <p style="font-size:0.9rem;color:rgba(255,255,255,0.65);line-height:1.75;margin-bottom:1.5rem;">${trainer.bio}</p>

    <div style="margin-bottom:1.5rem;">
      <div style="font-size:0.62rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;
                  color:#629fad;margin-bottom:0.7rem;">Weekly Classes</div>
      <ul style="list-style:none;padding:0;">${scheduleItems}</ul>
    </div>

    <a href="mailto:${trainer.email}"
      style="display:inline-block;color:#629fad;font-size:0.85rem;text-decoration:none;">
      ✉ ${trainer.email}
    </a>
  `;

  modal.insertBefore(closeBtn, modal.firstChild);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Focus close button for accessibility
  closeBtn.focus();

  // Close on backdrop click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
}

function closeModal() {
  const overlay = document.getElementById("trainer-modal-overlay");
  if (overlay) overlay.remove();
}

// Close on Escape key — attached to document
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});


function attachCardListeners() {
  // Event delegation on the grid — one listener handles all cards
  const grid = document.querySelector(".grid-4");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    // "View Profile" button
    const viewBtn = e.target.closest(".btn-outline");
    if (viewBtn) {
      const card = viewBtn.closest(".trainer-card");
      if (card) openModal(card.dataset.trainerId);
    }
  });
}

buildSearchBar();
attachCardListeners();