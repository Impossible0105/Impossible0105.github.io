/**
 * Theme Picker — DaisyUI 5 palette selector for hexo-theme-morii.
 * Replaces the old light/dark toggle + cycling switcher.
 *
 * Behaviour:
 *   Click button  → open/close popup
 *   Click swatch  → set <html data-theme="name"> + save to localStorage
 *   Escape / click-outside → close
 * Keyboard     → ↑↓ navigate, Enter selects, Escape closes
 */
;(function () {
  'use strict';

  if (!window.MoriiThemes || !MoriiThemes.length) return; // guard: theme-list.js loaded first

  const STORAGE_KEY = 'morii-theme';

  function apply(name) {
    document.documentElement.setAttribute('data-theme', name);
    try { localStorage.setItem(STORAGE_KEY, name); } catch (_) {}
    syncAllPickers();
  }

  function curName() {
    return document.documentElement.getAttribute('data-theme') || '';
  }

  function initPicker(picker) {
    if (picker.getAttribute('data-inited')) return;
    picker.setAttribute('data-inited', '1');

    const btn      = picker.querySelector('.rc-themepicker-btn');
    const menu     = picker.querySelector('.rc-themepicker-menu');
    const items    = picker.querySelectorAll('[data-theme-value]');
    if (!btn || !menu || !items.length) return;

    let activeIdx = -1;
    function sync() {
      const cur = curName();
      items.forEach(function (it, i) {
        const on = it.getAttribute('data-theme-value') === cur;
        it.classList.toggle('is-active', on);
        it.setAttribute('aria-selected', on ? 'true' : 'false');
        if (on) activeIdx = i;
      });
      var label = picker.querySelector('.rc-themepicker-label');
      if (label && cur) label.textContent = cur.charAt(0).toUpperCase() + cur.slice(1);
      var swatch = picker.querySelector('.rc-themepicker-swatch');
      if (swatch) swatch.style.background = getPrimary(cur);
    }

    function open() {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      picker.classList.add('is-open');
      sync();
      requestAnimationFrame(function () {
        var act = menu.querySelector('.is-active');
        if (act) act.scrollIntoView({ block: 'nearest' });
      });
    }
    function close() {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      picker.classList.remove('is-open');
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.hidden) open(); else close();
    });

    items.forEach(function (it) {
      it.addEventListener('click', function () {
        apply(it.getAttribute('data-theme-value'));
        close();
      });
    });

    picker.addEventListener('keydown', function (e) {
      if (!menu.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        var arr = Array.from(items);
        activeIdx = Math.max(0, Math.min(arr.length - 1,
          activeIdx + (e.key === 'ArrowDown' ? 1 : -1)));
        arr[activeIdx].focus();
      }
      if (e.key === 'Enter' && !menu.hidden && activeIdx >= 0) {
        apply(items[activeIdx].getAttribute('data-theme-value'));
        close();
      }
      if (e.key === 'Escape') close();
    });

    document.addEventListener('click', function (ev) {
      if (!picker.contains(ev.target)) close();
    });
    sync();
  }

  // ---- Init all pickers ----
  document.querySelectorAll('[data-theme-picker]').forEach(initPicker);

  // Re-init on dynamic page loads (for Swup or similar routers)
  window.__mcInitThemePickers = function () {
    document.querySelectorAll('[data-theme-picker]').forEach(initPicker);
  };

  // ---- Public API ----
  window.__mcApplyTheme = apply;
  window.__mcCurTheme = curName;

  // Expose sync for other scripts that change data-theme externally
  window.syncAllPickers = syncAllPickers;

  function syncAllPickers() {
    document.querySelectorAll('[data-theme-picker]').forEach(function (p) {
      p.querySelector('.rc-themepicker-label').textContent =
        curName().charAt(0).toUpperCase() + curName().slice(1);
      p.querySelector('.rc-themepicker-swatch').style.background = getPrimary(curName());
      p.querySelectorAll('[data-theme-value]').forEach(function (it) {
        var on = it.getAttribute('data-theme-value') === curName();
        it.classList.toggle('is-active', on);
        it.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    });
  }

  // ---- Helper: read the computed primary from the current theme's CSS vars ----
  function getPrimary(themeName) {
    if (!themeName) return '';
    var el = document.createElement('div');
    el.setAttribute('data-theme', themeName);
    el.style.display = 'none';
    document.body.appendChild(el);
    var s = getComputedStyle(el).getPropertyValue('--brand-color').trim();
    document.body.removeChild(el);
    return s || '';
  }

})();
