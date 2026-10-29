// Runs before first paint: resolves the colour theme and blocks framing.
(function () {
  'use strict';
  var root = document.documentElement;

  // Refuse to render inside another site's frame (clickjacking guard; GitHub Pages can't send X-Frame-Options)
  if (window.top !== window.self) {
    root.style.display = 'none';
    try { window.top.location.replace(window.location.href); } catch (e) {}
    return;
  }

  root.classList.replace('no-js', 'js');

  var stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  root.dataset.theme = stored === 'light' || stored === 'dark' ? stored : (prefersLight ? 'light' : 'dark');
})();
