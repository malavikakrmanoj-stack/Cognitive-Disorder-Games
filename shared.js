// ── COGNITIVE TRAINING GAMES · Shared Theme + Zoom ──
(function () {
  'use strict';
  var THEME_KEY = 'ctg-theme';
  var ZOOM_KEY  = 'ctg-zoom';
  var MIN_ZOOM  = 0.7;
  var MAX_ZOOM  = 1.4;
  var STEP      = 0.1;

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
    document.querySelectorAll('[data-theme-btn]').forEach(function(b) {
      b.classList.toggle('setting-active', b.dataset.themeBtn === t);
    });
  }
  function getTheme() { return localStorage.getItem(THEME_KEY) || 'light'; }

  function clamp(v) { return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, parseFloat(v) || 1)); }

  function isGamePage() {
    return getComputedStyle(document.body).overflow === 'hidden';
  }

  function applyZoom(z) {
    z = clamp(z);
    localStorage.setItem(ZOOM_KEY, z);
    var w = document.getElementById('ctg-zoom-wrap');
    if (w) {
      if (Math.abs(z - 1) < 0.001) {
        // No zoom — reset everything cleanly
        w.style.transform = '';
        w.style.transformOrigin = '';
        w.style.width = '';
        w.style.marginLeft = '';
        w.style.marginBottom = '';
      } else {
        // Scale from top-left, then shift right by 50% of the difference
        // so content stays horizontally centred at any zoom level
        var offset = Math.round((1 - z) * 50 * 100) / 100;
        w.style.transformOrigin = 'top left';
        w.style.transform = 'scale(' + z + ') translateX(0)';
        w.style.width = Math.round(10000 / z) / 100 + '%';
        w.style.marginLeft = offset + 'vw';
        if (isGamePage()) {
          w.style.marginBottom = '';
        } else {
          w.style.marginBottom = Math.round((z - 1) * 100) + 'px';
        }
      }
    }
    updateZoomUI(z);
    return z;
  }
  function getZoom() { return clamp(localStorage.getItem(ZOOM_KEY) || 1); }

  function updateZoomUI(z) {
    var d = document.getElementById('ctg-zoom-display');
    if (d) d.textContent = Math.round(z * 100) + '%';
    var out = document.getElementById('ctg-zoom-out');
    var inp = document.getElementById('ctg-zoom-in');
    if (out) out.disabled = z <= MIN_ZOOM;
    if (inp) inp.disabled = z >= MAX_ZOOM;
  }

  function toast(msg) {
    var t = document.getElementById('ctg-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(function() { t.classList.remove('show'); }, 1800);
  }

  function init() {
    applyTheme(getTheme());
    applyZoom(getZoom());
    document.querySelectorAll('[data-theme-btn]').forEach(function(b) {
      b.addEventListener('click', function() {
        applyTheme(b.dataset.themeBtn);
        toast(b.dataset.themeBtn === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on');
      });
    });
    var zin  = document.getElementById('ctg-zoom-in');
    var zout = document.getElementById('ctg-zoom-out');
    var zrst = document.getElementById('ctg-zoom-reset');
    if (zin)  zin.addEventListener('click',  function() { applyZoom(getZoom() + STEP); toast('🔍 Zoomed in'); });
    if (zout) zout.addEventListener('click', function() { applyZoom(getZoom() - STEP); toast('🔍 Zoomed out'); });
    if (zrst) zrst.addEventListener('click', function() { applyZoom(1); toast('↩️ Zoom reset'); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.CTG = { applyTheme: applyTheme, applyZoom: applyZoom, getTheme: getTheme, getZoom: getZoom };
})();
