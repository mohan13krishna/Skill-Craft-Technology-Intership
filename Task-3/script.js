const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const clearBtn = document.getElementById("clear");
const backspaceBtn = document.getElementById("backspace");
const equalsBtn = document.getElementById("equals");
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const historyList = document.getElementById("historyList");
const historyPanel = document.getElementById("historyPanel");
const historyToggle = document.getElementById("historyToggle");
const clearHistoryBtn = document.getElementById("clearHistory");
const exportHistoryBtn = document.getElementById("exportHistory");
const recallBtn = document.getElementById("recall");

let expr = "";
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

renderHistory();
applySavedTheme();

buttons.forEach(btn => {
  const v = btn.dataset.value;
  if (v !== undefined) {
    btn.addEventListener("click", () => {
      appendToExpr(v);
    });
  }
});

function appendToExpr(val) {
  if (val === "." && /(?:\.\d*)$/.test(expr)) return;
  expr += val;
  updateDisplay(expr);
}

function updateDisplay(text) {
  display.value = text;
}


clearBtn.addEventListener("click", () => {
  expr = "";
  updateDisplay("");
});

backspaceBtn.addEventListener("click", () => {
  expr = expr.slice(0, -1);
  updateDisplay(expr);
});

equalsBtn.addEventListener("click", () => {
  if (!expr) return;
  try {
    const safeExpr = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
    if (/[a-zA-Z]/.test(safeExpr)) throw new Error("Invalid");
    
    const result = Function(`"use strict"; return (${safeExpr})`)();
    if (result === undefined || Number.isNaN(result)) throw new Error("Invalid");
    addToHistory(expr, result);
    expr = String(result);
    updateDisplay(expr);
  } catch (e) {
    updateDisplay("Error");
    expr = "";
  }
});

themeToggle.addEventListener("click", () => {
  const isDark = body.classList.toggle("dark-theme");
  body.classList.toggle("light-theme", !isDark);
  themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function applySavedTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    body.classList.add("dark-theme");
    body.classList.remove("light-theme");
    themeToggle.textContent = "☀️ Light";
    themeToggle.setAttribute("aria-pressed", "true");
  } else {
    body.classList.add("light-theme");
    body.classList.remove("dark-theme");
    themeToggle.textContent = "🌙 Dark";
    themeToggle.setAttribute("aria-pressed", "false");
  }
}

function addToHistory(expression, result) {
  const entry = { expression, result, time: new Date().toISOString() };
  history.unshift(entry);
  if (history.length > 100) history.length = 100;
  localStorage.setItem("calcHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  if (!history.length) {
    const li = document.createElement("li");
    li.textContent = "No history yet";
    li.style.opacity = "0.6";
    historyList.appendChild(li);
    return;
  }
  history.forEach((h, i) => {
    const li = document.createElement("li");
    const left = document.createElement("div");
    left.innerHTML = `<strong>${h.expression}</strong> <small>= ${h.result}</small>`;
    const right = document.createElement("div");
    const time = new Date(h.time).toLocaleString();
    right.innerHTML = `<small style="opacity:.65">${time}</small>`;
    li.appendChild(left);
    li.appendChild(right);
    li.addEventListener("click", () => {
      expr = String(h.result);
      updateDisplay(expr);
    });

    historyList.appendChild(li);
  });
}
clearHistoryBtn && clearHistoryBtn.addEventListener("click", () => {
  if (!confirm("Clear all history?")) return;
  history = [];
  localStorage.removeItem("calcHistory");
  renderHistory();
});

exportHistoryBtn && exportHistoryBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "calculator-history.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

historyToggle && historyToggle.addEventListener("click", () => {
  const open = historyPanel.getAttribute("aria-hidden") === "false";
  historyPanel.setAttribute("aria-hidden", open ? "true" : "false");
  historyPanel.style.display = open ? "none" : "block";
});

recallBtn && recallBtn.addEventListener("click", () => {
  if (history.length) {
    expr = String(history[0].result);
    updateDisplay(expr);
  }
});

document.addEventListener("keydown", (e) => {
  const key = e.key;
  if ((key >= "0" && key <= "9") || key === "." || "+-*/".includes(key)) {
    appendToExpr(key);
  } else if (key === "Enter") {
    equalsBtn.click();
  } else if (key === "Backspace") {
    backspaceBtn.click();
  } else if (key.toLowerCase() === "c") {
    clearBtn.click();
  }
});
