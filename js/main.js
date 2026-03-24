/**
 * Emory Vision & Graphics Lab — main.js
 * Handles: hero mesh animation, nav, scroll reveal, smooth scroll, image fallback
 */

'use strict';

/* ============================================================
   1. NAVIGATION — scroll state + mobile toggle + active section
   ============================================================ */
(function initNav() {
  var header   = document.getElementById('site-header');
  var toggle   = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  var allLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section[id]');

  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  }

  function updateActiveLink() {
    var scrollMid = window.scrollY + window.innerHeight * 0.35;
    var current = 'home';
    sections.forEach(function(sec) {
      if (sec.offsetTop <= scrollMid) {
        current = sec.getAttribute('id');
      }
    });
    allLinks.forEach(function(link) {
      var sec = link.getAttribute('data-section');
      link.classList.toggle('active', sec === current);
    });
  }

  if (toggle) {
    toggle.addEventListener('click', function() {
      var isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (navLinks) {
    navLinks.addEventListener('click', function(e) {
      if (e.target.classList.contains('nav-link')) {
        navLinks.classList.remove('open');
        if (toggle) {
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  document.addEventListener('click', function(e) {
    if (!header.contains(e.target) && navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      if (toggle) {
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  /* ── Hero parallax + fade on scroll ── */
  var heroBg = document.querySelector('.hero-bg');
  var heroContent = document.querySelector('.hero-content');

  function updateHeroParallax() {
    var hero = document.getElementById('home');
    if (!hero) return;
    var heroH = hero.offsetHeight;
    var scrollY = window.scrollY;
    if (scrollY > heroH) return;
    var progress = scrollY / heroH;

    // Orbs drift up slower than scroll (parallax) + fade
    if (heroBg) {
      heroBg.style.transform = 'translateY(' + (scrollY * -0.3) + 'px)';
      heroBg.style.opacity = 1 - progress * 0.85;
    }

    // Text drifts up slightly faster + fade
    if (heroContent) {
      heroContent.style.transform = 'translateY(' + (scrollY * -0.15) + 'px)';
      heroContent.style.opacity = 1 - progress * 1.2;
    }
  }

  window.addEventListener('scroll', function() {
    requestAnimationFrame(updateHeroParallax);
  }, { passive: true });
  updateHeroParallax();

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ============================================================
   2. SCROLL REVEAL — Intersection Observer
   ============================================================ */
(function initReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // Stagger siblings in grids
  document.querySelectorAll('.team-grid, .research-grid').forEach(function(grid) {
    grid.querySelectorAll('.team-card, .research-card').forEach(function(el, i) {
      el.style.transitionDelay = i * 60 + 'ms';
    });
  });

  // Stagger pub cards
  document.querySelectorAll('.pub-list').forEach(function(list) {
    list.querySelectorAll('.pub-card').forEach(function(el, i) {
      el.style.transitionDelay = i * 35 + 'ms';
    });
  });

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '-50px 0px', threshold: 0.06 }
  );

  els.forEach(function(el) { observer.observe(el); });
})();


/* ============================================================
   2b. IMAGE FALLBACK — show placeholder if teaser fails to load
   ============================================================ */
(function initImageFallback() {
  document.querySelectorAll('.pub-thumb img').forEach(function(img) {
    img.addEventListener('error', function() {
      var placeholder = document.createElement('div');
      placeholder.className = 'pub-thumb-placeholder';
      placeholder.innerHTML = '<i class="fa-solid fa-image"></i>';
      img.parentNode.replaceChild(placeholder, img);
    });
  });
})();


/* ============================================================
   3. SMOOTH SCROLL — anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '68',
        10
      );
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
