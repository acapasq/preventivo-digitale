/* ═══════════════════════════════════════════════════════════════
   Serendip Studio — Presentation Navigation
   ─────────────────────────────────────────
   Controls slide transitions, keyboard navigation,
   touch/swipe, scroll wheel, dot nav and menu overlay.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────────────── */
  var TRANSITION_MS = 580;  // match CSS transition duration
  var WHEEL_LOCK_MS = 700;  // debounce scroll wheel
  var WHEEL_MIN     = 20;   // min deltaY to trigger a slide change
  var SWIPE_MIN     = 40;   // min px for a swipe to register

  /* ── DOM refs ───────────────────────────────────────────────── */
  var slides      = Array.from(document.querySelectorAll('.slide'));
  var TOTAL       = slides.length;
  var btnPrev     = document.getElementById('btn-prev');
  var btnNext     = document.getElementById('btn-next');
  var menuBtn     = document.getElementById('menu-btn');
  var menuOverlay = document.getElementById('menu-overlay');
  var menuClose   = document.getElementById('menu-close-btn');
  var menuList    = document.getElementById('menu-list');
  var slideLabel  = document.getElementById('slide-label');
  var currN       = document.getElementById('curr-n');
  var totalN      = document.getElementById('total-n');
  var dotNav      = document.getElementById('dot-nav');

  /* ── State ──────────────────────────────────────────────────── */
  var current     = 0;
  var isAnimating = false;

  /* ─────────────────────────────────────────────────────────────
     BUILD DOTS + MENU ITEMS
     ───────────────────────────────────────────────────────────── */
  totalN.textContent = TOTAL;

  slides.forEach(function (slide, i) {
    var label = slide.dataset.label || ('Slide ' + (i + 1));

    /* Dot nav */
    var dot = document.createElement('button');
    dot.className = 'topbar-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', label);
    dot.addEventListener('click', function () { goTo(i); });
    dotNav.appendChild(dot);

    /* Menu overlay item */
    var item = document.createElement('button');
    item.className = 'menu-item';
    item.innerHTML =
      '<span class="menu-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="menu-name">' + label + '</span>';
    item.addEventListener('click', function () { goTo(i); closeMenu(); });
    menuList.appendChild(item);
  });

  /* ─────────────────────────────────────────────────────────────
     NAVIGATION
     ───────────────────────────────────────────────────────────── */

  /**
   * goTo(idx, dir)
   * @param {number} idx       Target slide index (0-based)
   * @param {number} [dir]     +1 = forward, -1 = backward (auto-detected if omitted)
   */
  function goTo(idx, dir) {
    if (idx === current || isAnimating) return;
    if (idx < 0 || idx >= TOTAL) return;

    isAnimating = true;
    var fwd = dir !== undefined ? dir > 0 : idx > current;

    /* Animate out current slide */
    var leaving = slides[current];
    leaving.classList.remove('active');
    leaving.classList.add(fwd ? 'exit-left' : 'exit-right');

    /* Reset scroll position of target slide */
    var scrollArea = slides[idx].querySelector('.slide-scroll');
    if (scrollArea) scrollArea.scrollTop = 0;

    /* Animate in next slide */
    var entering = slides[idx];
    entering.style.transform = fwd ? 'translateX(20px)' : 'translateX(-20px)';
    entering.style.opacity   = '0';
    entering.classList.add('active');

    /* Double rAF ensures the initial transform is rendered before removing it */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        entering.style.transform = '';
        entering.style.opacity   = '';
      });
    });

    /* Cleanup after transition */
    setTimeout(function () {
      leaving.classList.remove('exit-left', 'exit-right');
      isAnimating = false;
    }, TRANSITION_MS);

    current = idx;
    updateUI();
  }

  function next() { if (current < TOTAL - 1) goTo(current + 1,  1); }
  function prev() { if (current > 0)          goTo(current - 1, -1); }

  /* ─────────────────────────────────────────────────────────────
     UI SYNC
     ───────────────────────────────────────────────────────────── */
  function updateUI() {
    var dots  = dotNav.querySelectorAll('.topbar-dot');
    var items = menuList.querySelectorAll('.menu-item');

    dots.forEach(function  (d, i) { d.classList.toggle('active',  i === current); });
    items.forEach(function (m, i) { m.classList.toggle('current', i === current); });

    currN.textContent      = current + 1;
    slideLabel.textContent = slides[current].dataset.label || '';
    btnPrev.disabled       = current === 0;
    btnNext.disabled       = current === TOTAL - 1;
  }

  /* ─────────────────────────────────────────────────────────────
     MENU OVERLAY
     ───────────────────────────────────────────────────────────── */
  function openMenu() {
    menuOverlay.classList.add('open');
    menuOverlay.setAttribute('aria-hidden', 'false');
    menuClose.focus();
  }

  function closeMenu() {
    menuOverlay.classList.remove('open');
    menuOverlay.setAttribute('aria-hidden', 'true');
  }

  menuBtn.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', function (e) {
    if (e.target === menuOverlay) closeMenu();
  });

  /* ─────────────────────────────────────────────────────────────
     BUTTON CLICKS
     ───────────────────────────────────────────────────────────── */
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  /* ─────────────────────────────────────────────────────────────
     KEYBOARD
     ───────────────────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (menuOverlay.classList.contains('open')) {
      if (e.key === 'Escape') closeMenu();
      return;
    }
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        e.preventDefault(); next(); break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault(); prev(); break;
      case 'Home':
        e.preventDefault(); goTo(0); break;
      case 'End':
        e.preventDefault(); goTo(TOTAL - 1); break;
    }
  });

  /* ─────────────────────────────────────────────────────────────
     TOUCH / SWIPE (horizontal swipe = next/prev)
     ───────────────────────────────────────────────────────────── */
  var touchStartX = 0;
  var touchStartY = 0;

  document.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_MIN) {
      if (dx < 0) next(); else prev();
    }
  }, { passive: true });

  /* ─────────────────────────────────────────────────────────────
     SCROLL WHEEL (debounced)
     ───────────────────────────────────────────────────────────── */
  var wheelLocked = false;

  document.addEventListener('wheel', function (e) {
    if (wheelLocked || Math.abs(e.deltaY) < WHEEL_MIN) return;
    wheelLocked = true;
    if (e.deltaY > 0) next(); else prev();
    setTimeout(function () { wheelLocked = false; }, WHEEL_LOCK_MS);
  }, { passive: true });

  /* ─────────────────────────────────────────────────────────────
     INIT
     ───────────────────────────────────────────────────────────── */
  slides[0].classList.add('active');
  updateUI();

  /* ─────────────────────────────────────────────────────────────
     SERVICE PILLS NAVIGATION
     ───────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var pill = e.target.closest('[data-go-to]');
    if (pill) {
      var target = parseInt(pill.getAttribute('data-go-to'), 10);
      if (!isNaN(target)) goTo(target);
    }
  });

}());
