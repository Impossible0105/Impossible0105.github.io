/**
 * Theme Switcher — 35 DaisyUI 5 palettes + light/dark sub-mode.
 * Hotkeys: T = next theme, Ctrl/Cmd+T = prev theme, Shift+Click swatch = cycle dark mode.
 */
(function () {
  "use strict";

  var THEMES = [
    "light","dark","cupcake","bumblebee","emerald","corporate",
    "synthwave","retro","cyberpunk","valentine","halloween","garden",
    "forest","aqua","lofi","pastel","fantasy","wireframe",
    "black","luxury","dracula","cmyk","autumn","business",
    "acid","lemonade","night","coffee","winter","dim","nord","sunset",
    "caramellatte","abyss","silk"
  ];

  function getStored(){
    try{ return JSON.parse(localStorage.getItem("morii-tc")||"null"); }catch(e){return null;}
  }
  function setStored(v){
    try{ localStorage.setItem("morii-tc", JSON.stringify(v)); }catch(e){}
  }

  function apply(theme, mode){
    var html = document.documentElement;
    if (theme) html.setAttribute("data-theme", theme);
    else html.removeAttribute("data-theme");
    if (mode === "dark") html.setAttribute("data-mode", "dark");
    else html.removeAttribute("data-mode");
    setStored({ t: theme || "", m: mode || "" });
    updateSwatch();
  }

  function cur(){
    var h = document.documentElement;
    return { theme: h.getAttribute("data-theme")||"", mode: h.getAttribute("data-mode")||"" };
  }

  function idxOf(name){ return THEMES.indexOf(name); }

  function cycle(dir){
    dir = dir || 1;
    var c = idxOf(cur().theme), n = c + dir;
    if (n < 0) n = THEMES.length - 1;
    if (n >= THEMES.length) n = 0;
    apply(THEMES[n], "");
  }

  function toggleMode(){
    var c = cur();
    apply(c.theme, c.mode === "dark" ? "" : "dark");
  }

  function updateSwatch(){
    var el = document.querySelector(".theme-picker-swatch");
    var nameEl = document.querySelector(".theme-picker-name");
    if (!el) return;
    var c = cur();
    if (c.theme && THEMES.indexOf(c.theme) !== -1){
      el.style.background = "linear-gradient(135deg," + c.theme + ")";
      el.title = c.theme.charAt(0).toUpperCase() + c.theme.slice(1) + (c.mode==="dark"?" · Dark":"");
    } else {
      el.style.background = "";
      el.title = "默认配色";
    }
    if (nameEl) nameEl.textContent = c.theme ? c.theme.charAt(0).toUpperCase()+c.theme.slice(1) : "默认";
  }

  // Init on DOM ready
  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){
      var stored = getStored();
      if (stored && stored.t && THEMES.indexOf(stored.t) !== -1){
        apply(stored.t, stored.m||"");
      } else {
        // Respect OS preference for initial dark mode
        var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme:dark)").matches;
        apply("", prefersDark ? "dark" : "");
      }
      // Bind buttons
      var btn = document.querySelector("#theme-picker-btn");
      if (btn){
        btn.addEventListener("click", function(e){
          if (e.shiftKey) toggleMode();
          else cycle(1);
        });
        btn.addEventListener("contextmenu", function(e){ e.preventDefault(); cycle(-1); });
      }
      updateSwatch();
    });
  } else {
    var stored = getStored();
    if (stored && stored.t && THEMES.indexOf(stored.t) !== -1){
      apply(stored.t, stored.m||"");
    }
    setTimeout(updateSwatch, 0);
  }

  // Keyboard shortcut
  document.addEventListener("keydown", function(e){
    if ((e.metaKey||e.ctrlKey) && (e.key==="t"||e.key==="T")){
      e.preventDefault(); cycle(e.shiftKey?-1:1);
    }
    if (e.key==="t"&&!e.metaKey&&!e.ctrlKey){
      if (e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA") return;
      cycle(1);
    }
  });

  window.ThemeSwitcher={apply:function(t,m){apply(t,m||"");},cycle:cycle,toggleMode:toggleMode};
})();
