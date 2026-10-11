/* =========================================================
   PORTFOLIO ADEM MARINE — script principal
   1. Contenu : projets, menu, galerie à explorer, sélection,
      liens, formulaire… (fonctionne même sans les animations)
   2. Animations : écran de chargement, nom qui s'écrit, sphère,
      frise horizontale, animations au scroll (GSAP + ScrollTrigger
      + SplitText) et défilement fluide (Lenis).
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  const allProjets = window.PROJETS || [];
  const projets = allProjets.slice(0, 8);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const motion = !!(window.gsap && window.ScrollTrigger && window.SplitText) && !reduceMotion;

  let lenis = null;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));


  /* =======================================================
     1. CONTENU
     ======================================================= */

  /* ---------- Visionneuse (projets + galerie) ---------- */
  const viewer = $('#viewer');
  function openViewer(p) {
    const img = $('.viewer__img', viewer);
    img.src = p.image;
    img.alt = `${p.titre}, ${p.type}`;
    if (typeof viewer.showModal === 'function') viewer.showModal(); else viewer.setAttribute('open', '');
    if (lenis) lenis.stop();
  }
  $('.viewer__close', viewer).addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', (e) => { if (e.target === viewer || e.target.classList.contains('viewer__inner')) viewer.close(); });
  viewer.addEventListener('close', () => { if (lenis) lenis.start(); });

  /* ---------- Diapositives des projets ---------- */
  const categories = { affiche: 'Affiche', print: 'Print & bannières', web: 'Concept web' };
  const slideBgs = ['#f4f2ec', '#e6e2d8']; // crème et gris pierre en alternance
  $('.projects__slides').innerHTML = projets.map((p, i) => `
    <article class="slide" style="--bg:${slideBgs[i % 2]};--c:${esc(p.couleur)}" aria-label="Projet ${i + 1} : ${esc(p.titre)}">
      <div class="slide__top"><span><b>${pad(i + 1)}</b> / Projets</span><span>${esc(categories[p.categorie] || p.categorie)}</span></div>
      <div class="slide__body">
        <div class="slide__text">
          <p class="slide__tags">${esc(p.type)} · ${esc(p.annee)}</p>
          <h3 class="slide__title">${esc(p.titre)}</h3>
          <p class="slide__desc">${esc(p.description)}</p>
          <button class="pill pill--dark slide__link" type="button" data-index="${i}">Voir le projet <span class="round round--light" aria-hidden="true">→</span></button>
          ${i === 0 ? '<p class="note slide__note">Clique pour l\'agrandir</p>' : ''}
        </div>
        <figure class="slide__media"><img src="${esc(p.image)}" alt="${esc(p.titre)}, ${esc(p.type)}" loading="lazy" width="640" height="960"></figure>
      </div>
      <span class="slide__num" aria-hidden="true">${pad(i + 1)}</span>
    </article>`).join('');
  $('.projects__index').innerHTML = projets.map((p, i) => `<li${i === 0 ? ' class="is-active"' : ''}>${pad(i + 1)}</li>`).join('');
  const slides = $$('.slide');
  const indexItems = $$('.projects__index li');
  $('.projects__slides').addEventListener('click', (e) => {
    const btn = e.target.closest('.slide__link');
    if (btn) openViewer(projets[Number(btn.dataset.index)]);
  });

  /* ---------- Sélection : les affiches défilent dans le cadre ---------- */
  const reelBox = $('.reel__slides');
  reelBox.innerHTML = allProjets.map((p, i) => `<div class="reel-slide${i === 0 ? ' is-active' : ''}" style="--c:${esc(p.couleur)}"><img src="${esc(p.image)}" alt="" loading="lazy" width="640" height="960"></div>`).join('');
  const reelSlides = $$('.reel-slide', reelBox);
  let reelIndex = 0;
  if (!reduceMotion && reelSlides.length > 1) {
    setInterval(() => {
      reelSlides[reelIndex].classList.remove('is-active');
      reelIndex = (reelIndex + 1) % reelSlides.length;
      reelSlides[reelIndex].classList.add('is-active');
    }, 850);
  }

  /* ---------- Menu façon lookbook ---------- */
  const header = $('.header');
  const qmenu = $('.qmenu');
  const qToggle = $('.qmenu__toggle', qmenu);
  const qBg = $('.qmenu__bg', qmenu);
  const qList = $('.qmenu__list', qmenu);
  const qItems = $$('.qmenu__item', qmenu);
  const qRoll = $('.qmenu__roll', qmenu);
  let menuOpen = false;
  let closedSize = null;
  let closeTimer;

  function setCurrent(i) {
    qRoll.style.transform = `translateY(${-1.2 * i}em)`;
    qItems.forEach((item, k) => item.classList.toggle('is-current', k === i));
  }
  setCurrent(0);

  function openMenu() {
    clearTimeout(closeTimer);
    if (menuOpen) return;
    menuOpen = true;
    closedSize = { w: qToggle.offsetWidth, h: qToggle.offsetHeight };
    qmenu.classList.add('is-open');
    qToggle.setAttribute('aria-expanded', 'true');
    const W = qList.offsetWidth;
    const H = closedSize.h + qList.offsetHeight;
    if (window.gsap) {
      gsap.killTweensOf([qBg, qToggle, qItems]);
      gsap.fromTo(qToggle, { width: closedSize.w }, { width: W, duration: 0.5, ease: 'expo.out' });
      gsap.fromTo(qBg, { width: closedSize.w, height: closedSize.h }, { width: W, height: H, duration: 0.55, ease: 'expo.out' });
      gsap.fromTo(qItems, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.035, ease: 'expo.out', delay: 0.06 });
      gsap.fromTo($$('.qmenu__thumb', qmenu), { scale: 0.7 }, { scale: 1, duration: 0.6, stagger: 0.035, ease: 'expo.out', delay: 0.06 });
    } else {
      qToggle.style.width = `${W}px`;
      qBg.style.width = `${W}px`;
      qBg.style.height = `${H}px`;
    }
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    qToggle.setAttribute('aria-expanded', 'false');
    const done = () => {
      qmenu.classList.remove('is-open');
      if (window.gsap) gsap.set([qBg, qToggle], { clearProps: 'width,height' });
      else { qToggle.style.width = ''; qBg.style.width = ''; qBg.style.height = ''; }
    };
    if (window.gsap) {
      gsap.killTweensOf([qBg, qToggle, qItems]);
      gsap.to(qItems, { autoAlpha: 0, y: -6, duration: 0.2, stagger: { each: 0.02, from: 'end' }, ease: 'power2.in' });
      gsap.to(qToggle, { width: closedSize.w, duration: 0.45, ease: 'expo.inOut', delay: 0.1 });
      gsap.to(qBg, { width: closedSize.w, height: closedSize.h, duration: 0.45, ease: 'expo.inOut', delay: 0.1, onComplete: done });
    } else {
      done();
    }
  }

  qToggle.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  if (finePointer) {
    qmenu.addEventListener('mouseenter', openMenu);
    qmenu.addEventListener('mouseleave', () => { closeTimer = setTimeout(closeMenu, 160); });
  }
  document.addEventListener('click', (e) => { if (menuOpen && !qmenu.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) { closeMenu(); qToggle.focus(); }
  });
  qItems.forEach((item) => item.addEventListener('click', () => closeMenu()));

  /* ---------- Liens internes : défilement doux ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('skip-link')) return;
    const id = a.getAttribute('href');
    const target = id.length > 1 ? $(id) : null;
    if (!target) return;
    e.preventDefault();
    const spacer = target.parentElement.classList.contains('pin-spacer') ? target.parentElement : target;
    if (lenis) lenis.scrollTo(spacer, { duration: 1.6 });
    else spacer.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Formulaire de contact (démonstration) ---------- */
  $('.footer__form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#email-contact');
    const msg = $('.footer__msg');
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    msg.textContent = ok
      ? "Merci ! (Formulaire de démonstration : rien n'a été envoyé pour l'instant.)"
      : 'Entre une adresse e-mail valide, par exemple prenom@email.fr.';
  });

  /* ---------- Méthode : bandeau au survol ---------- */
  $$('.method__item').forEach((item) => {
    const name = $('.method__name', item).textContent;
    $('.method__marquee', item).innerHTML = Array.from({ length: 6 }, () => `<span>${esc(name)}</span>`).join('');
    if (finePointer) {
      item.addEventListener('mouseenter', () => item.classList.add('is-hover'));
      item.addEventListener('mouseleave', () => item.classList.remove('is-hover'));
    }
  });

  /* ---------- Liste de l'accueil qui défile toute seule ---------- */
  const heroList = $('.hero__list');
  if (!reduceMotion && heroList) {
    setInterval(() => {
      const first = heroList.firstElementChild;
      const h = first.offsetHeight;
      if (window.gsap) {
        gsap.to(heroList.children, { y: -h, duration: 0.8, ease: 'expo.inOut', onComplete: () => { heroList.appendChild(first); gsap.set(heroList.children, { y: 0 }); } });
      } else {
        heroList.appendChild(first);
      }
    }, 1800);
  }

  /* ---------- Nom de l'accueil : le cadre SVG épouse le texte ---------- */
  const heroSvg = $('.hero__svg');
  function fitHeroName() {
    try {
      const bb = heroSvg.getBBox();
      if (bb.width) heroSvg.setAttribute('viewBox', `${(bb.x - 4).toFixed(1)} ${(bb.y - 4).toFixed(1)} ${(bb.width + 8).toFixed(1)} ${(bb.height + 8).toFixed(1)}`);
    } catch (err) { /* SVG pas encore affiché */ }
  }

  /* ---------- Grand mot (IMPACT) ajusté à la largeur de l'écran ---------- */
  function fitWords() {
    const el = $('.bigword__word');
    el.style.fontSize = '100px';
    const size = (100 * window.innerWidth * 0.88) / el.scrollWidth;
    el.style.fontSize = `${Math.min(size, window.innerHeight * 0.9).toFixed(1)}px`;
  }
  fitWords();
  fitHeroName();
  if (document.fonts) document.fonts.ready.then(() => { fitWords(); fitHeroName(); });

  /* ---------- Galerie à explorer (façon duda.works) ---------- */
  const explore = $('.explore');
  const canvas = $('.explore__canvas');
  const plane = $('.explore__plane');
  const gallery = { cards: [], cols: 0, rows: 0, cellW: 0, cellH: 0, x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, visible: false };

  function buildGallery() {
    const W = canvas.clientWidth || window.innerWidth;
    const H = canvas.clientHeight || window.innerHeight;
    const cw = Math.max(118, Math.min(210, W * 0.13));
    gallery.cellW = cw * 1.55;
    gallery.cellH = cw * 1.5 * 1.28;
    gallery.cols = Math.ceil(W / gallery.cellW) + 2;
    gallery.rows = Math.ceil(H / gallery.cellH) + 2;
    plane.style.setProperty('--cw', `${cw}px`);
    const n = allProjets.length;
    let html = '';
    gallery.cards = [];
    for (let r = 0; r < gallery.rows; r++) {
      for (let c = 0; c < gallery.cols; c++) {
        const idx = (c * 3 + r * 7) % n;
        const p = allProjets[idx];
        html += `<button class="explore__card" type="button" tabindex="-1" data-index="${idx}" aria-label="${esc(p.titre)}"><img src="${esc(p.image)}" alt="" loading="lazy" width="640" height="960" draggable="false"></button>`;
        gallery.cards.push({ c, r, rot: ((c * 37 + r * 53) % 11) - 5 });
      }
    }
    plane.innerHTML = html;
    $$('.explore__card', plane).forEach((el, i) => { gallery.cards[i].el = el; });
    renderGallery(true);
  }

  function renderGallery(force) {
    if (!gallery.visible && !force) return;
    gallery.x += (gallery.tx - gallery.x) * 0.09;
    gallery.y += (gallery.ty - gallery.y) * 0.09;
    const vx = gallery.tx - gallery.x;
    const vy = gallery.ty - gallery.y;
    const totalW = gallery.cols * gallery.cellW;
    const totalH = gallery.rows * gallery.cellH;
    for (const card of gallery.cards) {
      let x = card.c * gallery.cellW + gallery.x;
      let y = card.r * gallery.cellH + gallery.y + (card.c % 2 ? gallery.cellH * 0.45 : 0);
      x = (((x % totalW) + totalW) % totalW) - gallery.cellW;
      y = (((y % totalH) + totalH) % totalH) - gallery.cellH;
      card.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${card.rot}deg)`;
    }
    const tiltX = Math.max(-12, Math.min(12, vy * 0.05));
    const tiltY = Math.max(-12, Math.min(12, -vx * 0.05));
    plane.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
  }

  (function loop() {
    if (gallery.visible && !drag.active && !reduceMotion) gallery.tx -= 0.35; // lente dérive quand on ne touche à rien
    renderGallery(false);
    requestAnimationFrame(loop);
  })();

  const drag = { active: false, moved: 0, lastX: 0, lastY: 0, vx: 0, vy: 0, id: null };
  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    drag.active = true; drag.moved = 0; drag.id = e.pointerId;
    drag.lastX = e.clientX; drag.lastY = e.clientY; drag.vx = 0; drag.vy = 0;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag.active || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.lastX;
    const dy = e.pointerType === 'touch' ? 0 : e.clientY - drag.lastY;
    drag.lastX = e.clientX; drag.lastY = e.clientY;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    drag.vx = dx; drag.vy = dy;
    gallery.tx += dx * 1.15;
    gallery.ty += dy * 1.15;
    if (drag.moved > 6) explore.classList.add('has-dragged');
  });
  function endDrag(e) {
    if (!drag.active) return;
    drag.active = false;
    canvas.classList.remove('is-dragging');
    gallery.tx += drag.vx * 14;
    gallery.ty += drag.vy * 14;
    if (drag.moved < 6 && e.type === 'pointerup') {
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const card = hit && hit.closest('.explore__card');
      if (card) openViewer(allProjets[Number(card.dataset.index)]);
    }
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('keydown', (e) => {
    const step = 160;
    if (e.key === 'ArrowLeft') gallery.tx += step;
    else if (e.key === 'ArrowRight') gallery.tx -= step;
    else if (e.key === 'ArrowUp') gallery.ty += step;
    else if (e.key === 'ArrowDown') gallery.ty -= step;
    else return;
    e.preventDefault();
    explore.classList.add('has-dragged');
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { gallery.visible = entries[0].isIntersecting; }).observe(explore);
  } else {
    gallery.visible = true;
  }
  buildGallery();

  /* ---------- Redimensionnement ---------- */
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return; // ignore la barre d'adresse mobile
    lastWidth = window.innerWidth;
    fitWords();
    buildGallery();
    if (motion) ScrollTrigger.refresh();
  });

  /* Pas d'animations : tout s'affiche directement */
  if (!motion) {
    root.classList.add('no-motion');
    root.classList.remove('is-loading');
    $$('.level').forEach((l) => l.classList.add('is-unlocked'));
    return;
  }


  /* =======================================================
     2. ANIMATIONS
     ======================================================= */

  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  viewer.setAttribute('data-lenis-prevent', '');

  // Le nom est caché dès le départ : chaque contour est prêt à être tracé, les lettres sont vides
  $$('.hl__line, .tl__line, .hero__rule', heroSvg).forEach((path) => {
    const len = Math.ceil(path.getTotalLength()) + 1;
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, strokeOpacity: 1 });
  });
  gsap.set($$('.hl__fill, .tl__fill', heroSvg), { fillOpacity: 0 });

  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(2500)]).then(() => {
    fitWords();
    fitHeroName();
    buildWorld();
    buildScrollAnimations();
    setupHeader();
    if (finePointer) setupCursor();
    playLoader();
  });

  /* ---------- Écran de chargement : pile de photos + compteur ---------- */
  function playLoader() {
    const photos = $$('.loader__stack img');
    const num = $('.loader__num');
    const counter = { v: 0 };
    const hero = heroIntro();
    photos.forEach((img) => gsap.set(img, { rotation: gsap.utils.random(-9, 9), scale: 0.9, y: 20 }));

    const tl = gsap.timeline({ onComplete: finishLoader });
    tl.from('.loader__note', { autoAlpha: 0, y: 10, duration: 0.6, stagger: 0.15 }, 0.1)
      .to(photos, { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.12, ease: 'back.out(1.6)' }, 0)
      .to(counter, { v: 100, duration: 0.12 * photos.length + 0.25, ease: 'none', onUpdate: () => { num.textContent = Math.round(counter.v); } }, 0)
      .to(['.loader__note', '.loader__count', '.loader__skip'], { autoAlpha: 0, duration: 0.3 }, '+=0.25')
      .to(photos, { yPercent: -40, opacity: 0, rotation: '+=8', duration: 0.6, stagger: { each: 0.025, from: 'end' }, ease: 'power3.in' }, '<')
      .to('.loader', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '-=0.25')
      .add(hero.play(), '-=0.45');

    $('.loader__skip').addEventListener('click', () => tl.progress(1));
  }

  function finishLoader() {
    root.classList.remove('is-loading');
    if (lenis) lenis.start();
    ScrollTrigger.refresh();
  }

  // Accueil, comme ownitt.fr : le contour de chaque lettre se dessine l'une après l'autre,
  // les lettres se remplissent (gris puis plein), puis « Étudiant en communication »
  // s'écrit de la même façon et un trait se tire en dessous
  function heroIntro() {
    const letters = $$('.hl', heroSvg);
    const step = 0.17;
    const tl = gsap.timeline({ paused: true });
    letters.forEach((g, i) => {
      tl.to($$('.hl__line', g), { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, i * step);
    });
    const fillAt = letters.length * step + 1.05;
    const fills = $$('.hl__fill', heroSvg);
    tl.to(fills, { fillOpacity: 0.3, duration: 0.5, stagger: 0.04, ease: 'power1.out' }, fillAt)
      .to(fills, { fillOpacity: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out' }, fillAt + 0.6)
      .to($$('.hl__line', heroSvg), { strokeOpacity: 0, duration: 0.5 }, fillAt + 1.2);
    const tagAt = fillAt + 0.9;
    tl.to($$('.tl__line', heroSvg), { strokeDashoffset: 0, duration: 1, stagger: 0.03, ease: 'power2.inOut' }, tagAt)
      .to($$('.tl__fill', heroSvg), { fillOpacity: 1, duration: 0.45, stagger: 0.03, ease: 'power1.out' }, tagAt + 0.8)
      .to($$('.tl__line', heroSvg), { strokeOpacity: 0, duration: 0.4 }, tagAt + 1.6)
      .to('.hero__rule', { strokeDashoffset: 0, duration: 1.1, ease: 'expo.inOut' }, tagAt + 1.1);
    const restAt = tagAt + 1.5;
    tl.from('.hero__badge', { scale: 0, rotation: -120, duration: 1.2, ease: 'expo.out', transformOrigin: '50% 50%' }, restAt)
      .from('.hero__texts > *', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, restAt + 0.2)
      .from('.hero__note', { autoAlpha: 0, y: -10, rotation: 14, duration: 0.8, ease: 'back.out(2)' }, restAt + 0.6)
      .from('.hero__sound-note', { autoAlpha: 0, y: 10, duration: 0.8, ease: 'back.out(2)' }, restAt + 1);
    return tl;
  }

  /* ---------- Sphère d'affiches (CSS 3D) ---------- */
  const world = { idle: 0, scroll: 0, mx: 0, my: 0, tmx: 0, tmy: 0, active: false };
  function buildWorld() {
    const sphere = $('.world__sphere');
    const count = window.innerWidth < 600 ? 26 : 34;
    const golden = Math.PI * (3 - Math.sqrt(5));
    let html = '';
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;           // de 1 à -1
      const lat = Math.asin(y) * 180 / Math.PI;
      const lon = ((i * golden) * 180 / Math.PI) % 360;
      const p = allProjets[i % allProjets.length];
      html += `<figure class="world__tile" style="--lat:${lat.toFixed(2)}deg;--lon:${lon.toFixed(2)}deg"><img src="${esc(p.image)}" alt="" loading="lazy" width="640" height="960"></figure>`;
    }
    sphere.innerHTML = html;
    window.addEventListener('pointermove', (e) => {
      world.tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      world.tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    gsap.ticker.add((time, deltaTime) => {
      if (!world.active) return;
      world.idle += deltaTime * 0.006;
      world.mx += (world.tmx - world.mx) * 0.05;
      world.my += (world.tmy - world.my) * 0.05;
      sphere.style.transform = `rotateX(${(-10 - world.my * 14).toFixed(2)}deg) rotateY(${(world.idle + world.scroll + world.mx * 25).toFixed(2)}deg)`;
    });
  }

  /* ---------- Animations au scroll ---------- */
  function buildScrollAnimations() {
    const vh = () => window.innerHeight;

    // 1. Accueil : le macaron grossit et remplit l'écran de vert, puis la sphère d'affiches apparaît
    const badgeWrap = $('.hero__badge-wrap');
    const worldTitle = SplitText.create('.world__title', { type: 'words' }).words;
    gsap.timeline({
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: '+=320%', pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: (self) => { world.active = self.progress > 0.3 && self.progress < 0.995; },
        onLeave: () => { world.active = false; },
      },
    })
      .to(['.hero__name', '.hero__note', '.hero__sound-note', '.hero__texts'], { y: -70, autoAlpha: 0, duration: 0.25, stagger: 0.03, ease: 'power2.in' }, 0)
      .to(badgeWrap, { y: () => vh() / 2 - (badgeWrap.offsetTop + badgeWrap.offsetHeight / 2), duration: 0.3, ease: 'power2.inOut' }, 0.05)
      .to(badgeWrap, { scale: 70, rotation: 160, duration: 0.65, ease: 'power3.in' }, 0.32)
      .to('.hero', { backgroundColor: '#546a55', duration: 0.2, ease: 'none' }, 0.78)
      .set(badgeWrap, { autoAlpha: 0 }, 1)
      .set('.world', { autoAlpha: 1 }, 0.98)
      .fromTo('.world__scene', { scale: 0.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }, 1)
      .fromTo(world, { scroll: 0 }, { scroll: 300, duration: 2.1, ease: 'none' }, 1)
      .fromTo(worldTitle, { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }, 1.25)
      .fromTo('.world__note', { opacity: 0, rotation: 16 }, { opacity: 1, rotation: 7, duration: 0.3, ease: 'back.out(2)' }, 1.5)
      .to('.world__scene', { scale: 1.7, opacity: 0, duration: 0.45, ease: 'power2.in' }, 2.65)
      .to(['.world__title', '.world__note'], { y: -50, opacity: 0, duration: 0.35, ease: 'power2.in' }, 2.7);

    // 2. Parcours : défilement horizontal, les niveaux se débloquent un à un
    const track = $('.journey__track');
    const progress = $('.journey__progress');
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const hTween = gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: '.journey', start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: (self) => { progress.style.transform = `scaleX(${self.progress.toFixed(4)})`; },
      },
    });
    $$('.level').forEach((level, i, all) => {
      const state = $('.level__state', level);
      const on = state.textContent;
      const off = i === all.length - 1 ? 'À débloquer' : `Niveau ${i + 1}`;
      state.textContent = off;
      ScrollTrigger.create({
        trigger: level, containerAnimation: hTween, start: 'left 72%',
        onEnter: () => { level.classList.add('is-unlocked'); state.textContent = on; },
        onLeaveBack: () => { level.classList.remove('is-unlocked'); state.textContent = off; },
      });
    });
    revealLines('.journey__title', '.journey');
    gsap.from(['.journey__intro .label', '.journey__sign', '.journey__hint'], { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.journey', start: 'top 60%' } });

    // 3. Sélection : le cadre grandit, le fond passe du crème au gris pierre, puis les affiches prennent tout l'écran
    gsap.timeline({
      scrollTrigger: {
        trigger: '.reel', start: 'top top', end: '+=230%', pin: true, scrub: 1,
        onUpdate: (self) => setHeaderTheme(self.progress < 0.62 ? 'dark' : 'light'),
      },
    })
      .to('.reel', { backgroundColor: '#dad6cd', duration: 0.24, ease: 'none' }, 0)
      .fromTo('.reel__box', { scale: 0.3 }, { scale: 0.72, duration: 0.45, ease: 'power1.inOut' }, 0)
      .fromTo('.reel__title', { yPercent: 0 }, { yPercent: -70, duration: 0.45, ease: 'power1.inOut' }, 0)
      .to('.reel__kicker', { autoAlpha: 0, y: -30, duration: 0.15 }, 0.3)
      .to('.reel__box', { scale: 1, borderRadius: 0, boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.3, ease: 'power2.inOut' }, 0.55)
      .to({}, { duration: 0.2 });

    // 4. Manifeste : trois phrases qui s'allument puis laissent la place, le macaron tourne
    const blocks = $$('.manifesto__block');
    const mTl = gsap.timeline({ scrollTrigger: { trigger: '.manifesto', start: 'top top', end: '+=430%', pin: true, scrub: 1 } });
    mTl.to('.manifesto__badge', { rotation: 200, scale: 1.12, ease: 'none', duration: blocks.length }, 0);
    blocks.forEach((block, i) => {
      const title = SplitText.create($('.manifesto__title', block), { type: 'words' }).words;
      const accent = SplitText.create($('.manifesto__accent', block), { type: 'words' }).words;
      const sub = $('.manifesto__sub', block);
      if (i > 0) { gsap.set(block, { autoAlpha: 0 }); mTl.set(block, { autoAlpha: 1 }, i); }
      mTl.fromTo(title, { opacity: 0.2 }, { opacity: 1, stagger: 0.03, duration: 0.3, ease: 'none' }, i);
      if (sub) mTl.fromTo(sub, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.1 }, i + 0.28);
      mTl.fromTo(accent, { opacity: 0, yPercent: 35 }, { opacity: 1, yPercent: 0, stagger: 0.035, duration: 0.25, ease: 'power2.out' }, i + 0.36);
      if (i < blocks.length - 1) mTl.to(block, { autoAlpha: 0, y: -50, duration: 0.14 }, i + 0.86);
    });

    // 5. Définition
    const typed = SplitText.create('.typed', { type: 'chars' }).chars;
    gsap.timeline({ scrollTrigger: { trigger: '.authors', start: 'top 55%' } })
      .from('.authors__text', { autoAlpha: 0, duration: 0.6 })
      .from(typed, { autoAlpha: 0, duration: 0.01, stagger: 0.12 }, '+=0.2');
    gsap.set('.bracket', { yPercent: -50 });
    gsap.fromTo('.bracket--left', { xPercent: -70 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.definition__card', start: 'top bottom', end: 'center center', scrub: 1 } });
    gsap.fromTo('.bracket--right', { xPercent: 70 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.definition__card', start: 'top bottom', end: 'center center', scrub: 1 } });
    const defChars = SplitText.create('.definition__word', { type: 'chars', mask: 'chars' }).chars;
    gsap.from(defChars, { yPercent: 110, duration: 1.1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.definition__word', start: 'top 80%' } });
    gsap.from('.definition__badge', { scale: 0, rotation: -180, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.definition__word', start: 'top 75%' } });
    gsap.from('.definition__note', { autoAlpha: 0, rotation: 6, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: '.definition__word', start: 'top 70%' } });
    const defWords = SplitText.create('.definition__text', { type: 'words' }).words;
    gsap.fromTo(defWords, { color: '#cfcac0' }, { color: '#252422', stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.definition__text', start: 'top 78%', end: 'bottom 45%', scrub: 1 } });
    gsap.from(['.definition__phon', '.definition__syn', '.definition__who'], { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.1, scrollTrigger: { trigger: '.definition__phon', start: 'top 85%' } });
    gsap.fromTo('.tools__track', { xPercent: 0 }, { xPercent: -50, duration: 36, ease: 'none', repeat: -1 });

    // 6. Grand mot rempli d'une photo, puis la question
    const q1 = SplitText.create('.bigword__question', { type: 'words' }).words;
    gsap.timeline({ scrollTrigger: { trigger: '.bigword', start: 'top top', end: '+=170%', pin: true, scrub: 1 } })
      .fromTo('.bigword__word', { scale: 1.9 }, { scale: 0.92, duration: 0.5, ease: 'power2.out' }, 0)
      .fromTo('.bigword__word', { backgroundPosition: '50% 20%' }, { backgroundPosition: '50% 80%', duration: 1, ease: 'none' }, 0)
      .to('.bigword__word', { opacity: 0.3, duration: 0.2 }, 0.55)
      .fromTo(q1, { opacity: 0, yPercent: 40, filter: 'blur(8px)' }, { opacity: 1, yPercent: 0, filter: 'blur(0px)', stagger: 0.04, duration: 0.25 }, 0.55);

    // 7. La promesse
    const promiseWords = SplitText.create('.promise__title', { type: 'words' }).words;
    gsap.from(promiseWords, { yPercent: 50, autoAlpha: 0, duration: 1, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.promise', start: 'top 60%' } });
    gsap.from(['.promise .label', '.promise__next'], { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: '.promise', start: 'top 60%' } });

    // 8. Projets : chaque diapositive recouvre la précédente
    if (slides.length > 1) {
      gsap.set(slides.slice(1), { yPercent: 100 });
      const pTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.projects', start: 'top top', end: () => `+=${(slides.length - 1) * vh() * 1.1}`, pin: true, scrub: 1, invalidateOnRefresh: true,
          onUpdate: (self) => {
            const active = Math.min(slides.length - 1, Math.round(self.progress * (slides.length - 1 + 0.3) - 0.15));
            indexItems.forEach((li, i) => li.classList.toggle('is-active', i === Math.max(0, active)));
          },
        },
      });
      slides.forEach((slide, i) => {
        if (!i) return;
        pTl.to(slide, { yPercent: 0, ease: 'none', duration: 1 }, i - 1)
          .to($('.slide__body', slides[i - 1]), { yPercent: -10, opacity: 0.25, ease: 'none', duration: 1 }, i - 1)
          .fromTo($('.slide__body', slide), { yPercent: 14 }, { yPercent: 0, ease: 'none', duration: 1 }, i - 1);
      });
      pTl.to({}, { duration: 0.3 });
    }

    // 9. Galerie à explorer : le titre apparaît, les affiches arrivent de loin
    const exploreTitle = SplitText.create('.explore__title', { type: 'words' }).words;
    gsap.from(exploreTitle, { yPercent: 50, autoAlpha: 0, duration: 1, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.explore', start: 'top 60%' } });
    gsap.from('.explore__plane', { scale: 0.8, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.explore', start: 'top 70%' } });
    gsap.from(['.explore__hint', '.explore__note'], { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.2, delay: 0.5, scrollTrigger: { trigger: '.explore', start: 'top 50%' } });

    // 10. Méthode
    const methodWords = SplitText.create('.method__title', { type: 'words' }).words;
    gsap.from(methodWords, { yPercent: 50, autoAlpha: 0, duration: 1, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.method', start: 'top 65%' } });
    gsap.from(['.method .label', '.method__hint'], { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.15, scrollTrigger: { trigger: '.method', start: 'top 65%' } });
    $$('.method__name').forEach((name) => {
      gsap.fromTo(name, { color: 'rgba(37, 36, 34, 0.14)', x: 40 }, { color: 'rgba(37, 36, 34, 1)', x: 0, ease: 'none', scrollTrigger: { trigger: name, start: 'top 88%', end: 'top 58%', scrub: 1 } });
    });
    gsap.from('.method__note', { autoAlpha: 0, y: 16, duration: 0.8, scrollTrigger: { trigger: '.method__note', start: 'top 90%' } });

    // 11. Encore un doute ?
    const q3 = SplitText.create('.doubt__title', { type: 'words' }).words;
    gsap.timeline({ scrollTrigger: { trigger: '.doubt', start: 'top top', end: '+=120%', pin: true, scrub: 1 } })
      .fromTo('.doubt__img', { scale: 1.2 }, { scale: 1, duration: 1, ease: 'none' }, 0)
      .fromTo('.doubt__stage', { '--dark': 0.08 }, { '--dark': 0.58, duration: 0.6 }, 0.2)
      .fromTo(q3, { opacity: 0, yPercent: 40, filter: 'blur(8px)' }, { opacity: 1, yPercent: 0, filter: 'blur(0px)', stagger: 0.05, duration: 0.3 }, 0.25);

    // 12. Contact
    revealLines('.footer__title', '.footer');
    const footChars = SplitText.create('.footer__logo', { type: 'chars', mask: 'chars' }).chars;
    gsap.from(footChars, { yPercent: 110, duration: 1.1, stagger: 0.04, ease: 'expo.out', scrollTrigger: { trigger: '.footer__logo', start: 'top 92%' } });
    gsap.from('.footer__sticker', { scale: 0, rotation: -90, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.footer', start: 'top 70%' } });
  }

  // Fait monter les lignes d'un texte depuis un masque
  function revealLines(selector, trigger) {
    const lines = SplitText.create(selector, { type: 'lines', mask: 'lines' }).lines;
    gsap.from(lines, { yPercent: 105, duration: 1.1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger, start: 'top 72%' } });
  }

  /* ---------- En-tête : couleur du logo et section en cours dans le menu ---------- */
  function setHeaderTheme(theme) {
    header.classList.toggle('is-hidden', theme === 'hidden');
    header.classList.toggle('is-dark', theme === 'dark');
  }

  function setupHeader() {
    setHeaderTheme('hidden');
    $$('[data-header]').forEach((section) => {
      const trigger = section.parentElement.classList.contains('pin-spacer') ? section.parentElement : section;
      ScrollTrigger.create({
        trigger, start: 'top 40px', end: 'bottom 40px',
        onToggle: (self) => {
          if (!self.isActive) return;
          if (section.dataset.header !== 'auto') setHeaderTheme(section.dataset.header);
          setCurrent(Number(section.dataset.menu || 0));
        },
      });
    });
  }

  /* ---------- Curseur personnalisé ---------- */
  function setupCursor() {
    root.classList.add('has-cursor');
    const cursor = $('.cursor');
    gsap.set(cursor, { x: window.innerWidth / 2, y: window.innerHeight - 80 });
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      const onCanvas = !!e.target.closest('.explore__canvas');
      cursor.classList.toggle('is-drag', onCanvas);
      cursor.classList.toggle('is-link', !onCanvas && !!e.target.closest('a, button, input'));
    });
  }
})();
