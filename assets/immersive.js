/* Priority Care MD — immersive flagship interactions (index.html).
   Nav behaviors always run; GSAP scroll-storytelling runs only when GSAP is
   present and the user hasn't requested reduced motion. Everything degrades to
   a fully readable static page (html.no-anim). */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ─────── Navigation (always) ─────── */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
  document.querySelectorAll(".nav-trigger").forEach(function (trigger) {
    var menu = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!menu) return;
    var close = function () { trigger.setAttribute("aria-expanded", "false"); menu.classList.remove("open"); };
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      trigger.getAttribute("aria-expanded") === "true" ? close() : (trigger.setAttribute("aria-expanded", "true"), menu.classList.add("open"));
    });
    document.addEventListener("click", function (e) { if (!menu.contains(e.target) && e.target !== trigger) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { close(); } });
  });
  var header = document.querySelector(".site-header");
  var onScroll = function () { if (header) header.classList.toggle("scrolled", window.scrollY > 24); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* FAQ accordion (faq-01) — always */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      var ans = document.getElementById(btn.getAttribute("aria-controls"));
      if (ans) ans.classList.toggle("open", !expanded);
    });
  });

  /* Contact audience form tabs (+ hash deep-link) — always */
  var tabs = document.querySelectorAll(".form-tab");
  if (tabs.length) {
    var activateTab = function (tab) {
      if (!tab) return;
      tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
      tab.setAttribute("aria-selected", "true");
      document.querySelectorAll(".form-panel").forEach(function (p) { p.classList.remove("active"); });
      var panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (panel) panel.classList.add("active");
    };
    tabs.forEach(function (tab) { tab.addEventListener("click", function () { activateTab(tab); }); });
    var hash = (window.location.hash || "").replace("#", "");
    if (hash) {
      var match = document.querySelector('.form-tab[aria-controls="panel-' + hash + '"]');
      if (match) activateTab(match);
    }
  }

  /* ─────── Animation gate ─────── */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.gsap || reduce) { root.classList.add("no-anim"); return; }

  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  var ST = window.ScrollTrigger;

  /* Smooth scroll (Lenis) if available, else native */
  if (window.Lenis) {
    var lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* Scroll progress bar */
  var bar = document.querySelector(".scroll-progress");
  if (bar) {
    ST.create({ start: 0, end: "max", onUpdate: function (self) { gsap.set(bar, { scaleX: self.progress }); } });
  }

  /* ════ STANDARD (audience / child) PAGES — hero entrance + generic reveals.
     Uses gsap.from (no CSS pre-hide) so content is never left hidden. Gated to
     pages without the immersive home hero (.xhero). ════ */
  if (!document.querySelector(".xhero")) {
    /* Hero entrance */
    var heroBits = gsap.utils.toArray(".hero .eyebrow, .hero h1, .hero .lead, .hero .btn-row");
    if (heroBits.length) gsap.from(heroBits, { y: 26, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, delay: 0.1 });
    var heroFig = document.querySelector(".hero .hero-media .media");
    if (heroFig) gsap.from(heroFig, { opacity: 0, scale: 0.96, duration: 1.0, ease: "power2.out", delay: 0.25 });

    /* Per-section reveals */
    gsap.utils.toArray("main > section:not(.hero)").forEach(function (sec) {
      var head = sec.querySelectorAll(
        ".container > .center > .eyebrow, .container > .center > h2, .container > .center > .lead, .container > .center > .btn-row, " +
        ".container > .eyebrow, .container > h2, .container > .lead");
      if (head.length) gsap.from(head, {
        y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: sec, start: "top 80%" }
      });

      sec.querySelectorAll(".grid, .stat-row, .process, .plans, .aud-strip, .split").forEach(function (g) {
        gsap.from(g.children, {
          y: 30, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: g, start: "top 84%" }
        });
      });

      var blocks = sec.querySelectorAll(".cta-standard, .trust, .quote, .form-card");
      if (blocks.length) gsap.from(blocks, {
        y: 30, opacity: 0, duration: 0.75, ease: "power3.out",
        scrollTrigger: { trigger: sec, start: "top 80%" }
      });
    });
  }

  /* ── Hero entrance ── */
  gsap.set(".xhero h1 .ln > span", { yPercent: 115 });
  var hero = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
  hero.from(".xhero .eyebrow", { y: 18, opacity: 0, duration: 0.7 }, 0)
      .to(".xhero h1 .ln > span", { yPercent: 0, duration: 1.0, stagger: 0.1 }, 0.1)
      .from(".xhero .lead", { y: 20, opacity: 0, duration: 0.8 }, "-=0.55")
      .from(".xhero-cta", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
      .from(".hero-clock", { scale: 0.82, opacity: 0, duration: 1.1, ease: "power2.out" }, "-=1.0")
      .from(".scroll-cue", { opacity: 0, duration: 0.8 }, "-=0.3");

  /* Clock hands sweep + gentle float */
  gsap.to(".hero-clock .hand", { rotation: 360, svgOrigin: "100 100", duration: 6, repeat: -1, ease: "none" });
  gsap.to(".hero-clock .hand-gold", { rotation: 360, svgOrigin: "100 100", duration: 36, repeat: -1, ease: "none" });
  gsap.to(".hero-clock", { y: 14, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });

  /* Hero orb parallax */
  gsap.to(".xhero .orb-gold", { yPercent: 22, ease: "none", scrollTrigger: { trigger: ".xhero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".xhero .orb-azure", { yPercent: -16, ease: "none", scrollTrigger: { trigger: ".xhero", start: "top top", end: "bottom top", scrub: true } });

  /* ── Generic reveals ── */
  gsap.utils.toArray(".fx").forEach(function (el) {
    var d = parseFloat(el.getAttribute("data-fx-delay") || 0);
    gsap.fromTo(el, { opacity: 0, y: 34 }, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: d,
      scrollTrigger: { trigger: el, start: "top 84%" }
    });
  });
  /* Staggered groups (plans handled separately, below) */
  gsap.utils.toArray("[data-fx-group]").forEach(function (group) {
    if (group.classList.contains("plans")) return;
    gsap.fromTo(group.children, { opacity: 0, y: 34 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: group, start: "top 82%" }
    });
  });

  /* ── Scene: THE WAIT (pinned scrub — one beat fully resolves before the next) ── */
  var beats = gsap.utils.toArray(".x-wait .beat");
  if (beats.length) {
    gsap.set(beats, { opacity: 0, scale: 0.94, yPercent: 6 });
    var SEG = 2; /* scroll units per beat */
    var wt = gsap.timeline({
      scrollTrigger: { trigger: ".x-wait", start: "top top", end: "bottom bottom", scrub: true }
    });
    beats.forEach(function (b, i) {
      var t = i * SEG;
      wt.fromTo(b, { opacity: 0, scale: 0.94, yPercent: 6 },
        { opacity: 1, scale: 1, yPercent: 0, duration: 0.5, ease: "power2.out" }, t);
      if (i < beats.length - 1) {
        /* fully fade THIS beat out before the next begins (no overlap) */
        wt.to(b, { opacity: 0, scale: 1.04, yPercent: -6, duration: 0.45, ease: "power2.in" }, t + SEG - 0.5);
      }
    });
    wt.to({}, { duration: 0.6 }); /* hold the final beat */
  }

  /* ── Scene: HOW IT WORKS (guided stepper — activate one-by-one) ── */
  (function () {
    var steps = gsap.utils.toArray(".x-step");
    var navlis = gsap.utils.toArray(".x-how-nav li");
    if (!steps.length) return;
    function setActive(i) {
      steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
      navlis.forEach(function (n, k) { n.classList.toggle("is-active", k === i); });
    }
    steps.forEach(function (step, i) {
      ST.create({
        trigger: step, start: "top 62%", end: "bottom 42%",
        onToggle: function (self) { if (self.isActive) setActive(i); }
      });
    });
    setActive(0);
  })();

  /* ── Scene: PLANS (slow, step-by-step reveal: card, then its features, then next card) ── */
  (function () {
    var plans = gsap.utils.toArray(".x-plans .plan");
    if (!plans.length) return;
    var allFeatures = gsap.utils.toArray(".x-plans .plan-features li");
    gsap.set(allFeatures, { opacity: 0, y: 16 });
    var pt = gsap.timeline({ scrollTrigger: { trigger: ".x-plans .plans", start: "top 74%" } });
    plans.forEach(function (plan, i) {
      var head = plan.querySelectorAll("h3, .plan-price, .plan-badge");
      var feats = plan.querySelectorAll(".plan-features li");
      var cta = plan.querySelectorAll(".magnetic, .btn");
      pt.fromTo(plan, { opacity: 0, y: 56 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, i * 0.9)
        .from(head, { opacity: 0, y: 16, duration: 0.5, stagger: 0.08, ease: "power2.out" }, "<0.1")
        .to(feats, { opacity: 1, y: 0, duration: 0.5, stagger: 0.14, ease: "power2.out" }, "<0.15")
        .from(cta, { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" }, "<0.2");
    });
  })();

  /* ── Plan 3D tilt ── */
  document.querySelectorAll(".x-tilt").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotationY: px * 7, rotationX: -py * 7, transformPerspective: 1000, duration: 0.4, ease: "power2.out" });
    });
    card.addEventListener("mouseleave", function () {
      gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "power3.out" });
    });
  });

  /* ── Magnetic buttons (.magnetic wrappers on home + all large CTAs site-wide) ── */
  var magnets = [];
  document.querySelectorAll(".magnetic").forEach(function (m) { magnets.push(m); });
  document.querySelectorAll(".btn-lg").forEach(function (b) { if (!b.closest(".magnetic")) magnets.push(b); });
  if (window.matchMedia("(pointer: fine)").matches) {
    magnets.forEach(function (m) {
      m.addEventListener("mousemove", function (e) {
        var r = m.getBoundingClientRect();
        gsap.to(m, { x: (e.clientX - (r.left + r.width / 2)) * 0.28, y: (e.clientY - (r.top + r.height / 2)) * 0.4, duration: 0.4 });
      });
      m.addEventListener("mouseleave", function () {
        gsap.to(m, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  window.addEventListener("load", function () { ST.refresh(); });
})();
