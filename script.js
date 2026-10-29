// Hardik Sharma — portfolio interactions. No dependencies; each feature is set up by one init function.
(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const scrollBehavior = reduceMotion ? 'auto' : 'smooth';

  // Contact details are assembled here so they never appear as plain text in the HTML for scrapers.
  const CONTACT = {
    email: ['sharmahdk', '74'].join('') + '@' + ['gmail', 'com'].join('.'),
    phoneHref: '+' + ['91', '70164', '74229'].join(''),
    phoneLabel: ['+91', '70164', '74229'].join(' '),
  };

  const GITHUB_USERS = ['sharmahardik59', 'sharmahdk13s'];

  // Headline skills come first in the hero's skills line, then everything from the tech strip (no repeats)
  const FEATURED_SKILLS = ['React Native', 'TypeScript', 'JavaScript', 'Swift', 'SwiftUI', 'Bluetooth BLE', 'IoT',
    'New Architecture', 'Claude Code', 'Cursor', 'GitHub Copilot', 'Generative AI'];

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- Theme ---------- */
  function initTheme() {
    const btn = $('#themeToggle');
    const system = window.matchMedia('(prefers-color-scheme: light)');
    let stored = null;
    try { stored = localStorage.getItem('theme'); } catch (e) {}

    btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      stored = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
    // Follow the OS setting until the visitor picks a theme themselves
    system.addEventListener('change', (e) => {
      if (!stored) root.dataset.theme = e.matches ? 'light' : 'dark';
    });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    const btn = $('#menuToggle');
    const links = $('#navLinks');
    const backdrop = $('#navBackdrop');
    const isOpen = () => links.classList.contains('open');

    const setMenu = (open) => {
      links.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      backdrop.hidden = !open;
      document.body.classList.toggle('menu-open', open);
    };

    btn.addEventListener('click', () => {
      const open = !isOpen();
      setMenu(open);
      if (open) { const first = $('a', links); if (first) first.focus({ preventScroll: true }); }
    });
    backdrop.addEventListener('click', () => setMenu(false));
    links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) { setMenu(false); btn.focus(); }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Scroll: nav state, progress bar, back to top ---------- */
  function initScroll() {
    const nav = $('.nav');
    const bar = $('#progressBar');
    const toTop = $('#toTop');

    const onScroll = () => {
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      nav.classList.toggle('scrolled', y > 8);
      bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      toTop.classList.toggle('show', y > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    // The nav is sticky, so "#top" links scroll the window explicitly
    const scrollToTop = (e) => {
      if (e) e.preventDefault();
      window.scrollTo({ top: 0, behavior: scrollBehavior });
      history.replaceState(null, '', location.pathname + location.search);
    };
    $$('a[href="#top"]').forEach((a) => a.addEventListener('click', scrollToTop));
    toTop.addEventListener('click', scrollToTop);
  }

  /* ---------- Reveal on scroll, skill bars, counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    if (reduceMotion || isNaN(target)) return;
    const start = performance.now();
    const duration = 1400;
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = (target * (1 - Math.pow(1 - t, 3))).toFixed(decimals);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // Frames pause in background tabs; make sure the real value always lands
    setTimeout(() => { el.textContent = target.toFixed(decimals); }, duration + 100);
  }

  function initReveal() {
    // Bar widths live in data-w (no inline styles, so the CSP can forbid them)
    $$('.bar[data-w]').forEach((bar) => {
      const w = Math.max(0, Math.min(100, parseInt(bar.dataset.w, 10) || 0));
      bar.firstElementChild.style.setProperty('--w', `${w}%`);
    });
    // Stagger cards inside grids so they cascade in
    $$('.skills-grid, .projects-grid, .repo-grid').forEach((grid) => {
      [...grid.children].forEach((el, i) => el.style.setProperty('--d', `${(i % 4) * 70}ms`));
    });

    const els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        $$('[data-target]', entry.target).forEach(animateCount);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Nav link for the section in view ---------- */
  function initActiveSection() {
    if (!('IntersectionObserver' in window)) return;
    const links = $$('.nav-links a');
    const setActive = (id) => links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    const margin = { rootMargin: '-45% 0px -50% 0px' };
    const so = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, margin);
    links.map((a) => $(a.getAttribute('href'))).filter(Boolean).forEach((s) => so.observe(s));
    new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActive(null); }, margin).observe($('.hero'));
  }

  /* ---------- Skills line: fades from one skill to the next ---------- */
  function initSkillRotator() {
    const el = $('#rotator');
    const words = [...new Set([...FEATURED_SKILLS, ...$$('.marquee-track:not([aria-hidden]) li').map((li) => li.textContent)])];
    if (!el || words.length < 2 || reduceMotion) return;
    let i = 0;
    setInterval(() => {
      el.classList.add('fade');
      setTimeout(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.classList.remove('fade');
      }, 350);
    }, 2200);
  }

  /* ---------- Skill tabs: counts, filtering, keyboard, overflow hint ---------- */
  function initSkillTabs() {
    const bar = $('.skill-tabs');
    const tabs = $$('button', bar);
    const skills = $$('#skillsGrid .skill');

    const select = (tab) => {
      const f = tab.dataset.filter;
      tabs.forEach((t) => {
        t.setAttribute('aria-selected', String(t === tab));
        t.tabIndex = t === tab ? 0 : -1;
      });
      tab.scrollIntoView({ behavior: scrollBehavior, block: 'nearest', inline: 'center' });
      skills.forEach((s) => {
        const show = f === 'all' || s.dataset.cat === f;
        s.classList.toggle('hidden', !show);
        s.classList.remove('pop');
        if (show) {
          s.classList.add('in');
          void s.offsetWidth; // restart the pop animation
          s.classList.add('pop');
        }
      });
    };

    tabs.forEach((tab) => {
      const f = tab.dataset.filter;
      const n = f === 'all' ? skills.length : skills.filter((s) => s.dataset.cat === f).length;
      const count = document.createElement('span');
      count.className = 'count';
      count.textContent = String(n);
      tab.appendChild(count);
      tab.addEventListener('click', () => select(tab));
    });

    // Arrow keys / Home / End move between tabs (WAI-ARIA tabs pattern)
    bar.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (i < 0 || next === undefined) return;
      e.preventDefault();
      const target = tabs[(next + tabs.length) % tabs.length];
      target.focus();
      select(target);
    });

    // Only show the scroll fade when the tabs actually overflow
    const checkOverflow = () => {
      bar.classList.remove('scrollable');
      bar.classList.toggle('scrollable', bar.scrollWidth > bar.clientWidth + 1);
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow, { passive: true });
    if (document.fonts) document.fonts.ready.then(checkOverflow);
  }

  /* ---------- Contact links + copy email ---------- */
  function initContact() {
    $$('[data-contact]').forEach((a) => {
      const isEmail = a.dataset.contact === 'email';
      a.href = isEmail ? `mailto:${CONTACT.email}` : `tel:${CONTACT.phoneHref}`;
      a.removeAttribute('target');
      a.removeAttribute('rel');
      const text = $('[data-contact-text]', a);
      if (text) text.textContent = isEmail ? CONTACT.email : CONTACT.phoneLabel;
      else a.setAttribute('aria-label', `${a.textContent.trim()}: ${isEmail ? CONTACT.email : CONTACT.phoneLabel}`);
    });

    const copyBtn = $('#copyEmail');
    if (!copyBtn) return;
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CONTACT.email);
        showToast('Email copied to clipboard');
      } catch (e) {
        showToast(CONTACT.email);
      }
    });
  }

  /* ---------- Content protection (deterrents; nothing shown in a browser can be fully locked) ---------- */
  function initProtection() {
    document.body.classList.add('protected');
    const notice = () => showToast('Content is protected');

    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());
    ['copy', 'cut'].forEach((type) => document.addEventListener(type, (e) => { e.preventDefault(); notice(); }));

    // Block save page (S), view source (U) and print (P) shortcuts
    document.addEventListener('keydown', (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      if (key === 's' || key === 'u' || key === 'p') { e.preventDefault(); notice(); }
    });
  }

  /* ---------- GitHub star counts (static values stay if the API is unavailable) ---------- */
  function initRepoStars() {
    Promise.all(GITHUB_USERS.map((u) =>
      fetch(`https://api.github.com/users/${encodeURIComponent(u)}/repos?per_page=100`, { referrerPolicy: 'no-referrer' })
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => [])
    )).then((lists) => {
      const byName = new Map();
      lists.flat().forEach((r) => {
        if (r && typeof r.full_name === 'string') byName.set(r.full_name.toLowerCase(), r);
      });
      $$('.repo[data-repo]').forEach((card) => {
        const repo = byName.get(card.dataset.repo.toLowerCase());
        const star = $('.stars b', card);
        if (repo && star && Number.isFinite(repo.stargazers_count)) star.textContent = String(repo.stargazers_count);
      });
    });
  }

  initTheme();
  initMenu();
  initScroll();
  initReveal();
  initActiveSection();
  initSkillRotator();
  initSkillTabs();
  initContact();
  initProtection();
  initRepoStars();
  $('#year').textContent = String(new Date().getFullYear());
})();
