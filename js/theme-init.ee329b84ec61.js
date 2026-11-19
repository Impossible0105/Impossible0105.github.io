(() => {
  "use strict";
  var STORAGE_KEY = "morii-theme";
  var LEGACY_KEY = "mingzhi-theme";
  var stored;
  try { stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY); } catch (_) {}
  // stored may be null / "dark" / "light" / any valid DaisyUI theme name
  var prefersDark = typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches;
  if (!stored || stored === "dark" || stored === "light") {
    document.documentElement.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));
  } else {
    // unknown legacy values are treated as the default (light)
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

// Diagnostics are opt-in and stay in the current browser.
(() => {
  var script = document.currentScript;
  if (script?.dataset.diagnostics !== "on" && new URLSearchParams(location.search).get("morii-debug") !== "1") return;
  if (!script?.dataset.diagnosticsSrc) return;
  var diagnostics = document.createElement("script");
  diagnostics.src = script.dataset.diagnosticsSrc;
  diagnostics.async = true;
  document.head.appendChild(diagnostics);
})();
