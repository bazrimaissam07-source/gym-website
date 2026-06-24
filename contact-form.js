"use strict";

const MESSAGES_KEY = "gg_contact_messages";

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

function validateName(value) {
  if (!value.trim()) return "Name is required.";
  if (value.trim().length < 2) return "Name must be at least 2 characters.";
  return "";
}

function validateEmail(value) {
  if (!value.trim()) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Please enter a valid email address.";
  return "";
}

function validateSubject(value) {
  if (!value.trim()) return "Subject is required.";
  if (value.trim().length < 5) return "Subject must be at least 5 characters.";
  return "";
}

function validateMessage(value) {
  if (!value.trim()) return "Message is required.";
  if (value.trim().length < 20) return `Message must be at least 20 characters (${value.trim().length} so far).`;
  return "";
}

function addCharCounter(textarea) {
  const counter = document.createElement("div");
  counter.id = "message-char-count";
  counter.style.cssText = "font-size:0.72rem;color:rgba(0,0,0,0.4);text-align:right;margin-top:0.25rem;";
  counter.textContent = `0 / 5000`;
  textarea.insertAdjacentElement("afterend", counter);

  textarea.addEventListener("input", () => {
    const len = textarea.value.length;
    counter.textContent = `${len} / 5000`;
    // Colour hint: red if under 20, amber if under 50, muted green when fine
    if (len < 20)       counter.style.color = "#e05c5c";
    else if (len < 50)  counter.style.color = "#f59e0b";
    else                counter.style.color = "#4ade80";
  });
}

function showToast(message, type) {
  const old = document.getElementById("contact-toast");
  if (old) old.remove();

  const toast = document.createElement("div");
  toast.id = "contact-toast";
  const isSuccess = type === "success";
  toast.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
    background: ${isSuccess ? "#0c2c55" : "#3b1010"};
    border: 1px solid ${isSuccess ? "#629fad" : "#e05c5c"};
    border-left: 4px solid ${isSuccess ? "#629fad" : "#e05c5c"};
    color: #fff; padding: 1rem 1.4rem;
    border-radius: 8px; font-size: 0.88rem; font-weight: 600;
    max-width: 320px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    animation: slideInToast 0.3s ease;
  `;
  toast.textContent = message;

  if (!document.getElementById("toast-style")) {
    const style = document.createElement("style");
    style.id = "toast-style";
    style.textContent = `@keyframes slideInToast { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.4s";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}



function saveMessage(data) {
  let messages = [];
  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    if (stored) messages = JSON.parse(stored);
  } catch (e) {
    console.error("localStorage read error:", e);
  }

  messages.push({
    ...data,
    id:          Date.now(),
    submittedAt: new Date().toISOString(),
    read:        false,
  });

  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("localStorage write error:", e);
  }
}

const form = document.querySelector("form[action='#']");
if (form) {
  const nameField    = form.querySelector("#name");
  const emailField   = form.querySelector("#email");
  const subjectField = form.querySelector("#subject");
  const messageField = form.querySelector("#message");

  if (messageField) addCharCounter(messageField);

  const blurRules = [
    { field: nameField,    fn: validateName    },
    { field: emailField,   fn: validateEmail   },
    { field: subjectField, fn: validateSubject },
    { field: messageField, fn: validateMessage },
  ];

  blurRules.forEach(({ field, fn }) => {
    if (!field) return;
    field.addEventListener("blur", () => {
      const err = fn(field.value);
      err ? showError(field, err) : showSuccess(field);
    });
    field.addEventListener("input", () => {
      if (field.style.borderColor === "rgb(224, 92, 92)") {
        const err = fn(field.value);
        if (!err) showSuccess(field);
      }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    blurRules.forEach(({ field, fn }) => {
      if (!field) return;
      const err = fn(field.value);
      if (err) { showError(field, err); isValid = false; }
      else showSuccess(field);
    });

    if (!isValid) {
      showToast("Please fix the errors above before sending.", "error");
      return;
    }

    // Save to localStorage
    saveMessage({
      name:    nameField    ? nameField.value.trim()    : "",
      email:   emailField   ? emailField.value.trim()   : "",
      subject: subjectField ? subjectField.value.trim() : "",
      message: messageField ? messageField.value.trim() : "",
    });

    // Success toast (auto-dismisses after 4 s)
    showToast("✅ Message sent! We'll respond within 24 hours.", "success");

    // Reset form
    form.reset();
    form.querySelectorAll("input, textarea").forEach(el => el.style.borderColor = "");
    const counter = document.getElementById("message-char-count");
    if (counter) { counter.textContent = "0 / 5000"; counter.style.color = "rgba(0,0,0,0.4)"; }
  });
}