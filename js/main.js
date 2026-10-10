/* =========================================================
   PORTFOLIO — script principal
   1. Contenu : anneau d'affiches, liste des projets, filtres,
      visionneuse, menu, copie de l'e-mail, essai de couleur.
      Tout ça fonctionne même si les animations ne chargent pas.
   2. Animations : écran de chargement, défilement fluide (Lenis),
      animations au scroll (GSAP + ScrollTrigger + SplitText),
      curseur et aperçu des projets.
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  const projets = window.PROJETS || [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const motion = !!(window.gsap && window.ScrollTrigger && window.SplitText) && !reduceMotion;

  let lenis = null;      // défilement fluide (créé plus bas si les animations sont actives)
  let menuOpen = false;
  let hidePreview = () => {}; // remplacé par la vraie fonction quand le curseur est actif

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const pad = (n, len = 2) => String(n).padStart(len, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));


  /* =======================================================
     1. CONTENU
     ======================================================= */

  /* ---------- Anneau 3D d'affiches ---------- */
  const ringScene = $('.ring-scene');
  const ring = $('.ring');
  const ringProjets = projets.slice(0, 12);
  ring.style.setProperty('--n', ringProjets.length);
  ring.insertAdjacentHTML('afterbegin', ringProjets.map((p, i) =>
    `<figure class="ring__item" style="--i:${i}" aria-hidden="true"><img src="${esc(p.image)}" alt="" width="640" height="960" decoding="async"></figure>`
  ).join(''));
  const ringItems = $$('.ring__item', ring);

  /* ---------- Liste des projets ---------- */
  const list = $('.list');
  list.innerHTML = projets.map((p, i) => `
    <li class="row" data-cat="${esc(p.categorie)}">
      <button class="row__btn" type="button" data-index="${i}" style="--c:${esc(p.couleur)};--ci:${esc(p.encre)}">
        <span class="row__num mono">${pad(i + 1)}</span>
        <span class="row__title">${esc(p.titre)}</span>
        <span class="row__cat mono">${esc(p.type)}</span>
        <span class="row__year mono">${esc(p.annee)}</span>
        <img class="row__thumb" src="${esc(p.image)}" alt="" loading="lazy" width="640" height="960">
      </button>
    </li>`).join('');
  const rows = $$('.row', list);
  $('.projets__count').textContent = `(${pad(projets.length)})`;

  /* ---------- Filtres ---------- */
  const filters = $$('.filter');
  filters.forEach((btn) => {
    const f = btn.dataset.filter;
    const n = f === 'tout' ? projets.length : projets.filter((p) => p.categorie === f).length;
    $('.filter__n', btn).textContent = n;
    if (f !== 'tout' && n === 0) btn.hidden = true;

    btn.addEventListener('click', () => {
      filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      rows.forEach((row) => { row.hidden = !(f === 'tout' || row.dataset.cat === f); });
      if (motion) {
        gsap.fromTo(rows.filter((r) => !r.hidden),
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.04, ease: 'power3.out', overwrite: true });
        ScrollTrigger.refresh();
      }
    });
  });

  /* ---------- Visionneuse plein écran ---------- */
  const viewer = $('#viewer');
  const viewerImg = $('.viewer__img', viewer);
  let current = 0;

  function fillViewer(i) {
    const p = projets[i];
    current = i;
    viewerImg.src = p.image;
    viewerImg.alt = `${p.titre}, ${p.type}`;
    $('.viewer__meta', viewer).textContent = `${pad(i + 1)} · ${p.type} · ${p.annee}`;
    $('.viewer__title', viewer).textContent = p.titre;
    $('.viewer__desc', viewer).textContent = p.description;
  }

  function animateViewer() {
    if (!motion) return;
    gsap.fromTo('.viewer__media', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out' });
    gsap.fromTo('.viewer__info > *', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05, ease: 'power3.out', delay: 0.1 });
  }

  function openViewer(i) {
    fillViewer(i);
    hidePreview();
    if (typeof viewer.showModal === 'function') viewer.showModal();
    else viewer.setAttribute('open', '');
    if (lenis) lenis.stop();
    animateViewer();
  }

  function stepViewer(dir) {
    const visibles = rows.filter((r) => !r.hidden).map((r) => Number($('.row__btn', r).dataset.index));
    const pos = visibles.indexOf(current);
    fillViewer(visibles[(pos + dir + visibles.length) % visibles.length]);
    animateViewer();
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.row__btn');
    if (btn) openViewer(Number(btn.dataset.index));
  });
  $('.viewer__close', viewer).addEventListener('click', () => viewer.close());
  $$('.viewer__btn', viewer).forEach((b) => b.addEventListener('click', () => stepViewer(Number(b.dataset.step))));
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer || e.target.classList.contains('viewer__inner')) viewer.close();
  });
  document.addEventListener('keydown', (e) => {
    if (!viewer.open) return;
    if (e.key === 'ArrowRight') stepViewer(1);
    if (e.key === 'ArrowLeft') stepViewer(-1);
  });
  viewer.addEventListener('close', () => { if (lenis && !menuOpen) lenis.start(); });

  /* ---------- Menu plein écran ---------- */
  const menu = $('#menu');
  const menuBtn = $('.menu-btn');
  const menuText = $('.menu-btn__text');

  function setMenu(open) {
    menuOpen = open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuText.textContent = open ? 'Fermer' : 'Menu';

    if (open) {
      menu.hidden = false;
      if (lenis) lenis.stop();
      if (motion) {
        gsap.fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' });
        gsap.fromTo('.menu__big', { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, ease: 'expo.out', delay: 0.3 });
        gsap.fromTo(['.menu__sub', '.menu__foot'], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay: 0.6 });
      }
      $('.menu__link', menu).focus({ preventScroll: true });
    } else {
      const done = () => { menu.hidden = true; };
      if (motion) gsap.to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'expo.inOut', onComplete: done });
      else done();
      if (lenis) lenis.start();
    }
  }

  menuBtn.addEventListener('click', () => setMenu(!menuOpen));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- Liens internes (#section) : défilement doux ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('skip-link')) return;
    const target = a.getAttribute('href').length > 1 ? $(a.getAttribute('href')) : null;
    if (!target) return;
    e.preventDefault();
    if (menuOpen) setMenu(false);
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Copier l'adresse e-mail ---------- */
  $$('.copy-btn').forEach((btn) => {
    const label = btn.textContent;
    btn.addEventListener('click', () => {
      const done = (ok) => {
        btn.textContent = ok ? 'Adresse copiée' : 'Adresse sélectionnée';
        btn.classList.add('is-done');
        setTimeout(() => { btn.textContent = label; btn.classList.remove('is-done'); }, 2200);
      };
      const selectText = () => {
        const range = document.createRange();
        range.selectNodeContents($('#email'));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        done(false);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(btn.dataset.copy).then(() => done(true), selectText);
      } else {
        selectText();
      }
    });
  });

  /* ---------- Essai de couleur d'accent (temporaire) ---------- */
  const swatches = $$('.swatch');
  function setAccent(name) {
    if (name === 'nb') root.removeAttribute('data-accent');
    else root.setAttribute('data-accent', name);
    swatches.forEach((s) => s.setAttribute('aria-pressed', String(s.dataset.accent === name)));
    try { localStorage.setItem('portfolio-accent', name); } catch (err) { /* stockage indisponible */ }
  }
  let savedAccent = 'nb';
  try { savedAccent = localStorage.getItem('portfolio-accent') || 'nb'; } catch (err) { /* stockage indisponible */ }
  setAccent(swatches.some((s) => s.dataset.accent === savedAccent) ? savedAccent : 'nb');
  swatches.forEach((s) => s.addEventListener('click', () => setAccent(s.dataset.accent)));

  /* ---------- Gros textes ajustés à la largeur de l'écran ---------- */
  const heroStage = $('.hero__stage');
  const heroTitle = $('.hero__title');
  const heroName = $('.hero__name');
  const footerName = $('.footer__name');

  // Donne au texte la taille qui remplit exactement la largeur disponible
  function fit(el, available, maxSize) {
    el.style.fontSize = '100px';
    let size = (100 * available) / el.offsetWidth;
    if (maxSize) size = Math.min(size, maxSize);
    el.style.fontSize = `${size.toFixed(2)}px`;
  }
  function fitAll() {
    const gutter = parseFloat(getComputedStyle($('.section')).paddingLeft) || 16;
    fit(heroName, heroStage.clientWidth - gutter * 2, window.innerHeight * 0.62);
    fit(footerName, footerName.parentElement.clientWidth);
  }
  fitAll();

  let lastWidth = window.innerWidth;
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return; // ignore la barre d'adresse mobile
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      fitAll();
      if (motion) ScrollTrigger.refresh();
    }, 150);
  });

  /* Pas d'animations : on affiche tout directement */
  if (!motion) {
    root.classList.remove('is-loading');
    if (document.fonts) document.fonts.ready.then(fitAll);
    return;
  }


  /* =======================================================
     2. ANIMATIONS
     ======================================================= */

  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
  root.classList.add('has-motion');

  /* ---------- Défilement fluide ---------- */
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop(); // bloqué pendant l'écran de chargement
  }
  menu.setAttribute('data-lenis-prevent', '');
  viewer.setAttribute('data-lenis-prevent', '');

  /* ---------- Anneau 3D : rotation, souris, scroll ---------- */
  const ringState = { idle: 0, scroll: 0, zoom: 0, intro: 0, mx: 0, my: 0, tmx: 0, tmy: 0 };
  const step = 360 / Math.max(ringItems.length, 1);
  let heroTrigger = null;

  ringScene.style.opacity = 0;
  gsap.ticker.add((time, deltaTime) => {
    const scrolled = lenis ? lenis.scroll : window.scrollY;
    if (heroTrigger && scrolled > heroTrigger.end + window.innerHeight) return; // hors écran : on économise

    ringState.idle += deltaTime * 0.005;                     // ~5° par seconde
    ringState.mx += (ringState.tmx - ringState.mx) * 0.05;   // suivi doux de la souris
    ringState.my += (ringState.tmy - ringState.my) * 0.05;

    const ry = ringState.idle + ringState.scroll + ringState.mx * 16;
    const rx = -8 - ringState.zoom * 10 - ringState.my * 6;
    const scale = (0.65 + 0.35 * ringState.intro) * (1 + ringState.zoom * 0.35);

    ring.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    // Le nom tourne en sens inverse pour toujours rester face à nous
    heroTitle.style.transform = `rotateY(${(-ry).toFixed(2)}deg) rotateX(${(-rx).toFixed(2)}deg)`;
    ringScene.style.opacity = ringState.intro.toFixed(3);

    // Les affiches de l'arrière de l'anneau sont plus sombres
    ringItems.forEach((item, i) => {
      const facing = (Math.cos(((i * step + ry) * Math.PI) / 180) + 1) / 2;
      item.style.opacity = (0.18 + 0.82 * facing * facing).toFixed(3);
    });
  });

  window.addEventListener('pointermove', (e) => {
    ringState.tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    ringState.tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ---------- Écran de chargement ---------- */
  const loaderNum = $('.loader__num');
  const counter = { v: 0 };
  const showCount = () => { loaderNum.textContent = pad(Math.round(counter.v), 3); };

  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const imagesReady = Promise.all($$('img', ring).map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve())));
  const assetsReady = Promise.race([Promise.all([fontsReady, imagesReady]), new Promise((r) => setTimeout(r, 3500))]);
  const countUp = gsap.to(counter, { v: 90, duration: 1.4, ease: 'power2.inOut', onUpdate: showCount });

  Promise.all([assetsReady, countUp.then()]).then(() => {
    gsap.to(counter, { v: 100, duration: 0.35, ease: 'power1.out', onUpdate: showCount, onComplete: start });
  });

  function start() {
    fitAll();
    const heroSplit = buildScrollAnimations();
    if (finePointer) setupCursor();

    gsap.timeline({ onComplete: () => { if (lenis && !menuOpen) lenis.start(); } })
      .to('.loader__num', { yPercent: -105, duration: 0.6, ease: 'power3.in' })
      .to('.loader__label', { autoAlpha: 0, duration: 0.3 }, '<')
      .to('.loader', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '-=0.1')
      .add(() => root.classList.remove('is-loading'))
      .from(heroSplit.chars, { yPercent: 105, duration: 1.2, stagger: 0.07, ease: 'expo.out' }, '-=0.55')
      .to(ringState, { intro: 1, duration: 1.8, ease: 'expo.out' }, '<')
      .from(['.header', '.hero__bottom > *', '.scroll-badge svg', '.scroll-badge__arrow'],
        { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=1.2');
  }

  /* ---------- Animations au scroll ---------- */
  function buildScrollAnimations() {
    // Nom : lettres découpées pour l'apparition
    const heroSplit = SplitText.create(heroName, { type: 'chars', mask: 'chars' });

    // Accueil épinglé : l'anneau tourne et se rapproche, le nom s'efface
    const heroTl = gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=100%', pin: true, scrub: true },
    });
    heroTl
      .to(ringState, { scroll: 150, zoom: 1, ease: 'none', duration: 1 }, 0)
      .to('.hero__fade', { yPercent: -14, scale: 0.88, autoAlpha: 0, ease: 'power1.in', duration: 0.75 }, 0.25)
      .to(['.hero__bottom', '.scroll-badge'], { y: -40, autoAlpha: 0, ease: 'none', duration: 0.35 }, 0);
    heroTrigger = heroTl.scrollTrigger;

    // Manifeste : les mots s'allument au fil du scroll
    const manifesto = SplitText.create('.manifeste__text', { type: 'words' });
    gsap.fromTo(manifesto.words, { opacity: 0.14 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: '.manifeste__text', start: 'top 80%', end: 'bottom 50%', scrub: true },
    });
    gsap.from('.manifeste__cols p', {
      y: 30, autoAlpha: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.manifeste__cols', start: 'top 85%' },
    });

    // Bandeau : défile en continu, accélère et change de sens avec le scroll
    const track = $('.marquee__track');
    const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 32, repeat: -1 });
    loop.totalTime(loop.duration() * 100); // permet de repartir en arrière
    const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' });
    let speedTween;
    let skewReset;
    ScrollTrigger.create({
      trigger: '.marquee', start: 'top bottom', end: 'bottom top',
      onUpdate(self) {
        const v = self.getVelocity();
        loop.timeScale(self.direction * (1 + Math.min(Math.abs(v) / 300, 6)));
        if (speedTween) speedTween.kill();
        speedTween = gsap.to(loop, { timeScale: self.direction, duration: 1.2, ease: 'power2.out' });
        skewTo(gsap.utils.clamp(-10, 10, -v / 300));
        clearTimeout(skewReset);
        skewReset = setTimeout(() => skewTo(0), 120);
      },
    });

    // Projets : la section s'ouvre comme un écran qui s'agrandit
    gsap.fromTo('.projets', { '--it': '14vh', '--is': '5vw', '--ir': '40px' }, {
      '--it': '0vh', '--is': '0vw', '--ir': '0px', ease: 'none',
      scrollTrigger: { trigger: '.projets', start: 'top bottom', end: 'top 10%', scrub: true },
    });
    revealLines('.projets__title');
    gsap.from('.projets__side > *', {
      y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.projets__head', start: 'top 75%' },
    });
    gsap.set(rows, { y: 40, autoAlpha: 0 });
    ScrollTrigger.batch(rows, {
      start: 'top 94%', once: true,
      onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.06, ease: 'power3.out', overwrite: true }),
    });

    // À propos
    revealLines('.apropos__title');
    gsap.from(['.apropos__text p', '.apropos__cols .col'], {
      y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.apropos__intro', start: 'top 70%' },
    });

    // Contact
    revealLines('.contact__title');
    gsap.from(['.contact__mail', '.contact__links li'], {
      y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact__mail', start: 'top 85%' },
    });

    // Pied de page : le nom remonte lettre par lettre
    const footerSplit = SplitText.create(footerName, { type: 'chars', mask: 'chars' });
    gsap.from(footerSplit.chars, {
      yPercent: 105, duration: 1.2, stagger: 0.06, ease: 'expo.out',
      scrollTrigger: { trigger: '.footer', start: 'top 70%' },
    });

    // En-tête : se cache quand on descend, revient quand on remonte
    const header = $('.header');
    ScrollTrigger.create({
      start: 120, end: 'max',
      onUpdate: (self) => {
        if (menuOpen) return;
        gsap.to(header, { yPercent: self.direction === 1 ? -120 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      },
      onLeaveBack: () => gsap.to(header, { yPercent: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }),
    });

    return heroSplit;
  }

  // Fait monter les lignes d'un titre depuis un masque
  function revealLines(selector) {
    const split = SplitText.create(selector, { type: 'lines', mask: 'lines' });
    gsap.from(split.lines, {
      yPercent: 105, duration: 1.1, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: selector, start: 'top 82%' },
    });
  }

  /* ---------- Curseur + aperçu des projets ---------- */
  function setupCursor() {
    root.classList.add('has-cursor');
    const cursor = $('.cursor');
    const preview = $('.preview');
    const previewImg = $('.preview__img');

    gsap.set(cursor, { x: -100, y: -100 });
    gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.85 });
    const cx = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3' });
    const cy = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3' });
    const px = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3' });
    const py = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3' });
    const pr = gsap.quickTo(preview, 'rotation', { duration: 0.8, ease: 'power3' });
    let lastX = 0;
    let tiltReset;

    window.addEventListener('pointermove', (e) => {
      cx(e.clientX); cy(e.clientY);
      px(e.clientX); py(e.clientY);
      pr(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.5));
      lastX = e.clientX;
      clearTimeout(tiltReset);
      tiltReset = setTimeout(() => pr(0), 100);
    }, { passive: true });

    // Le curseur grossit sur les liens et boutons
    document.addEventListener('pointerover', (e) => {
      const hit = e.target.closest('a, button');
      cursor.classList.toggle('is-link', !!hit && !hit.classList.contains('row__btn'));
    });

    // Aperçu de l'affiche au survol d'une ligne
    rows.forEach((row) => {
      const btn = $('.row__btn', row);
      btn.addEventListener('pointerenter', () => {
        const p = projets[Number(btn.dataset.index)];
        if (previewImg.getAttribute('src') !== p.image) previewImg.src = p.image;
        cursor.style.setProperty('--c', p.encre);
        cursor.style.setProperty('--ci', p.couleur);
        cursor.classList.add('is-view');
        gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      });
    });

    hidePreview = () => {
      cursor.classList.remove('is-view');
      gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    };
    list.addEventListener('pointerleave', hidePreview);
  }
})();
