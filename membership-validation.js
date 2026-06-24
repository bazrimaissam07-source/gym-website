"use strict";

function showError(input, message) {
  clearError(input);
  input.style.borderColor = "#e05c5c";
  const span = document.createElement("span");
  span.className = "field-error";
  span.style.cssText = "color:#e05c5c;font-size:0.78rem;font-weight:600;display:block;margin-top:0.3rem;";
  span.textContent = message;
  input.insertAdjacentElement("afterend", span);
}

function showSuccess(input) {
  clearError(input);
  input.style.borderColor = "#4ade80";
}

function clearError(input) {
  input.style.borderColor = "";
  const existing = input.parentElement.querySelector(".field-error");
  if (existing) existing.remove();
}

function validateFullName(value) {
  const trimmed = value.trim();
  if (!trimmed) return "Full name is required.";
  if (trimmed.length < 3) return "Name must be at least 3 characters.";
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) return "Name must contain letters only.";
  return "";
}

function validateEmail(value) {
  if (!value.trim()) return "Email address is required.";
  // Basic but solid email regex
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Please enter a valid email address.";
  return "";
}

function validatePhone(value) {
  const digits = value.replace(/[\s\-().+]/g, "");
  if (!digits) return "Phone number is required.";
  if (!/^\d{8,15}$/.test(digits)) return "Phone must be 8–15 digits.";
  return "";
}

function validateDob(value) {
  if (!value) return "Date of birth is required.";
  const dob = new Date(value);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
  if (age < 16) return "You must be at least 16 years old to register.";
  if (age > 100) return "Please enter a valid date of birth.";
  return "";
}

const form = document.querySelector("form[action='#']");
if (form) {
  const fullname = form.querySelector("#fullname");
  const email    = form.querySelector("#email");
  const phone    = form.querySelector("#phone");
  const dob      = form.querySelector("#dob");

  if (fullname) {
    fullname.addEventListener("blur", () => {
      const err = validateFullName(fullname.value);
      err ? showError(fullname, err) : showSuccess(fullname);
    });
  }

  if (email) {
    email.addEventListener("blur", () => {
      const err = validateEmail(email.value);
      err ? showError(email, err) : showSuccess(email);
    });
  }

  if (phone) {
    phone.addEventListener("blur", () => {
      const err = validatePhone(phone.value);
      err ? showError(phone, err) : showSuccess(phone);
    });
  }

  if (dob) {
    dob.addEventListener("blur", () => {
      const err = validateDob(dob.value);
      err ? showError(dob, err) : showSuccess(dob);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // stop page reload (Best Practices slide)

    let isValid = true;

    if (fullname) {
      const err = validateFullName(fullname.value);
      if (err) { showError(fullname, err); isValid = false; }
      else showSuccess(fullname);
    }

    if (email) {
      const err = validateEmail(email.value);
      if (err) { showError(email, err); isValid = false; }
      else showSuccess(email);
    }

    if (phone) {
      const err = validatePhone(phone.value);
      if (err) { showError(phone, err); isValid = false; }
      else showSuccess(phone);
    }

    if (dob) {
      const err = validateDob(dob.value);
      if (err) { showError(dob, err); isValid = false; }
      else showSuccess(dob);
    }

    const planChosen = form.querySelector("input[name='plan']:checked");
    if (!planChosen) {
      const planField = form.querySelector("input[name='plan']");
      if (planField) showError(planField, "Please select a membership plan.");
      isValid = false;
    }

    const terms = form.querySelector("input[name='terms']");
    if (terms && !terms.checked) {
      showError(terms, "You must accept the terms and conditions.");
      isValid = false;
    }

    if (!isValid) return;

    showSuccessModal();
    form.reset();

    // Clear all green borders after reset
    form.querySelectorAll("input, select, textarea").forEach(el => {
      el.style.borderColor = "";
    });
  });
}

function showSuccessModal() {
  // Build modal via DOM (not innerHTML with user data — Best Practices)
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9000;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(4px);";

  const box = document.createElement("div");
  box.style.cssText = "background:#f5f0e8;border-radius:12px;padding:2.5rem;max-width:400px;width:100%;text-align:center;";

  const icon = document.createElement("div");
  icon.textContent = "✅";
  icon.style.fontSize = "3rem";

  const title = document.createElement("h3");
  title.textContent = "Registration Submitted!";
  title.style.cssText = "font-family:'Barlow Condensed',sans-serif;font-size:1.8rem;font-weight:800;text-transform:uppercase;color:#0c2c55;margin:1rem 0 0.5rem;";

  const msg = document.createElement("p");
  msg.textContent = "Thank you for joining Gorilla Gym. We will contact you within 24 hours to confirm your membership.";
  msg.style.cssText = "color:#555;font-size:0.9rem;margin-bottom:1.5rem;";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.style.cssText = "background:#629fad;color:#0c2c55;border:none;border-radius:8px;padding:0.8rem 2rem;font-weight:700;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;";
  closeBtn.addEventListener("click", () => overlay.remove());

  box.append(icon, title, msg, closeBtn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.addEventListener("keydown", function handler(e) {
    if (e.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", handler); }
  });
}