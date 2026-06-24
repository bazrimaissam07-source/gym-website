"use strict";

const CART_KEY = "gg_selected_plan";

// Plan data (mirrors the HTML cards)
const plans = {
  bronze: { name: "Bronze", price: "2,900 DZD / month",   value: "bronze" },
  silver: { name: "Silver", price: "7,500 DZD / quarter", value: "silver" },
  gold:   { name: "Gold",   price: "24,000 DZD / year",   value: "gold"   },
};

function createCartBar() {
  const bar = document.createElement("div");
  bar.id = "plan-cart-bar";
  bar.style.cssText = `
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 500;
    background: #0c2c55; border-top: 2px solid #629fad;
    display: none; align-items: center; justify-content: space-between;
    padding: 0.85rem 2rem; gap: 1rem; flex-wrap: wrap;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.4);
  `;
  bar.innerHTML = `
    <div style="display:flex;align-items:center;gap:1rem;">
      <span style="font-size:0.65rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#629fad;">Selected Plan</span>
      <span id="cart-plan-name" style="font-family:'Barlow Condensed',sans-serif;font-size:1.4rem;font-weight:800;color:#fff;text-transform:uppercase;"></span>
      <span id="cart-plan-price" style="font-size:0.85rem;color:rgba(255,255,255,0.5);"></span>
    </div>
    <div style="display:flex;gap:0.75rem;align-items:center;">
      <a id="cart-proceed-btn" href="#register"
        style="background:#629fad;color:#0c2c55;font-family:'Barlow',sans-serif;font-size:0.78rem;font-weight:700;
               letter-spacing:0.1em;text-transform:uppercase;padding:0.65rem 1.6rem;border-radius:6px;text-decoration:none;">
        Proceed to Register →
      </a>
      <button id="cart-clear-btn" type="button"
        style="background:transparent;border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.4);
               font-size:0.72rem;padding:0.55rem 0.9rem;border-radius:6px;cursor:pointer;letter-spacing:0.06em;">
        Clear ✕
      </button>
    </div>
  `;
  document.body.appendChild(bar);

  document.getElementById("cart-clear-btn").addEventListener("click", clearCart);

  // When "Proceed" is clicked, pre-fill the plan radio in the form
  document.getElementById("cart-proceed-btn").addEventListener("click", () => {
    const stored = sessionStorage.getItem(CART_KEY);
    if (stored) prefillPlanInForm(stored);
  });
}

function selectPlan(planKey) {
  sessionStorage.setItem(CART_KEY, planKey);
  updateCartUI(planKey);
}

function clearCart() {
  sessionStorage.removeItem(CART_KEY);
  updateCartUI(null);
}

function updateCartUI(planKey) {
  const bar = document.getElementById("plan-cart-bar");
  if (!bar) return;

  if (planKey && plans[planKey]) {
    const plan = plans[planKey];
    document.getElementById("cart-plan-name").textContent  = plan.name;
    document.getElementById("cart-plan-price").textContent = plan.price;
    bar.style.display = "flex";
  } else {
    bar.style.display = "none";
  }

  document.querySelectorAll(".plan-card").forEach(card => {
    const id = card.id; // "bronze" | "silver" | "gold"
    if (id === planKey) {
      card.style.outline = "3px solid #629fad";
    } else {
      card.style.outline = "";
    }
  });
}

function prefillPlanInForm(planKey) {
  const radio = document.querySelector(`input[name='plan'][value='${planKey}']`);
  if (radio) {
    radio.checked = true;
    radio.dispatchEvent(new Event("change"));
  }
}

function attachPlanButtons() {
  document.querySelectorAll(".plan-card").forEach(card => {
    const planKey = card.id; // matches "bronze" | "silver" | "gold"
    if (!plans[planKey]) return;

    // Create "Select Plan" button before the existing CTA link
    const existingCta = card.querySelector(".plan-cta");
    if (!existingCta) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Select Plan";
    btn.style.cssText = `
      display: block; width: 100%; text-align: center;
      padding: 0.72rem; margin-bottom: 0.5rem;
      background: #629fad; color: #0c2c55;
      font-family: 'Barlow', sans-serif; font-size: 0.75rem;
      font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
      border: 2px solid #629fad; border-radius: 6px; cursor: pointer;
      transition: background 0.2s;
    `;
    btn.addEventListener("mouseenter", () => btn.style.background = "#7bbcc9");
    btn.addEventListener("mouseleave", () => btn.style.background = "#629fad");
    btn.addEventListener("click", () => selectPlan(planKey));

    existingCta.insertAdjacentElement("beforebegin", btn);
  });
}

createCartBar();
attachPlanButtons();

const storedPlan = sessionStorage.getItem(CART_KEY);
if (storedPlan) updateCartUI(storedPlan);