/* =========================================================
   PORTFOLIO — script principal
   1. Contenu : projets, menu, liens, formulaire, showreel…
      (fonctionne même si les animations ne chargent pas)
   2. Animations : écran de chargement, défilement fluide (Lenis),
      animations au scroll (GSAP + ScrollTrigger + SplitText).
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  const projets = (window.PROJETS || []).slice(0, 8);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const motion = !!(window.gsap && window.ScrollTrigger && window.SplitText) && !reduceMotion;

  let lenis = null;
  let menuOpen = false;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // Assombrit une couleur (pour le fond de chaque diapositive projet)
  function darken(hex, keep = 0.22) {
    const n = parseInt(hex.replace('#', ''), 16);
    const mix = (c) => Math.round(c * keep + 10 * (1 - keep));
    return `rgb(${mix(n >> 16)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
  }


  /* =======================================================
     1. CONTENU
     ======================================================= */

  /* ---------- Diapositives des projets ---------- */
  const categories = { affiche: 'Affiche', print: 'Print & bannières', web: 'Concept web' };
  $('.projects__slides').innerHTML = projets.map((p, i) => `
    <article class="slide" style="--bg:${darken(p.couleur)};--c:${esc(p.couleur)}" aria-label="Projet ${i + 1} : ${esc(p.titre)}">
      <div class="slide__top"><span><b>${pad(i + 1)}</b> / Projet</span><span>${esc(categories[p.categorie] || p.categorie)}</span></div>
      <div class="slide__body">
        <div class="slide__text">
          <p class="slide__tags"><b>${esc(p.titre)}</b>${esc(p.type)} · ${esc(p.annee)}</p>
          <h3 class="slide__title">${esc(p.titre)}</h3>
          <p class="slide__desc">${esc(p.description)}</p>
          <button class="slide__link" type="button" data-index="${i}">Voir le projet <span class="round" aria-hidden="true">→</span></button>
        </div>
        <figure class="slide__media"><img src="${esc(p.image)}" alt="${esc(p.titre)}, ${esc(p.type)}" loading="lazy" width="640" height="960"></figure>
      </div>
      <span class="slide__num" aria-hidden="true">${pad(i + 1)}</span>
    </article>`).join('');
  $('.projects__index').innerHTML = projets.map((p, i) => `<li${i === 0 ? ' class="is-active"' : ''}>${pad(i + 1)}</li>`).join('');
  const slides = $$('.slide');
  const indexItems = $$('.projects__index li');

  /* ---------- Visionneuse ---------- */
  const viewer = $('#viewer');
  $('.projects__slides').addEventListener('click', (e) => {
    const btn = e.target.closest('.slide__link');
    if (!btn) return;
    const p = projets[Number(btn.dataset.index)];
    const img = $('.viewer__img', viewer);
    img.src = p.image;
    img.alt = `${p.titre}, ${p.type}`;
    if (typeof viewer.showModal === 'function') viewer.showModal(); else viewer.setAttribute('open', '');
    if (lenis) lenis.stop();
  });
  $('.viewer__close', viewer).addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', (e) => { if (e.target === viewer || e.target.classList.contains('viewer__inner')) viewer.close(); });
  viewer.addEventListener('close', () => { if (lenis && !menuOpen) lenis.start(); });

  /* ---------- Menu plein écran ---------- */
  const header = $('.header');
  const menu = $('#menu');
  const menuBtn = $('.menu-btn');
  const menuCols = $$('.menu__col');

  function openCol(col) { menuCols.forEach((c) => c.classList.toggle('is-open', c === col)); }
  menuCols.forEach((col) => {
    col.addEventListener('mouseenter', () => openCol(col));
    col.addEventListener('focusin', () => openCol(col));
  });

  function setMenu(open) {
    menuOpen = open;
    menuBtn.setAttribute('aria-expanded', String(open));
    $('.menu-btn__text').textContent = open ? 'Fermer' : 'Menu';
    header.classList.toggle('is-menu', open);
    if (open) {
      menu.hidden = false;
      openCol(menuCols[0]);
      if (lenis) lenis.stop();
      if (motion) {
        gsap.fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' });
        gsap.fromTo(menuCols, { yPercent: 100 }, { yPercent: 0, duration: 1.1, stagger: 0.06, ease: 'expo.out', delay: 0.25 });
        gsap.fromTo(['.menu__top > *', '.menu__bottom > *'], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay: 0.6 });
      }
      $('a', menuCols[0]).focus({ preventScroll: true });
    } else {
      const done = () => { menu.hidden = true; };
      if (motion) gsap.to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'expo.inOut', onComplete: done });
      else done();
      if (lenis) lenis.start();
    }
  }
  menuBtn.addEventListener('click', () => setMenu(!menuOpen));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- Liens internes : défilement doux ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('skip-link')) return;
    const id = a.getAttribute('href');
    const target = id.length > 1 ? $(id) : null;
    if (!target) return;
    e.preventDefault();
    if (menuOpen) setMenu(false);
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
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

  /* ---------- Showreel : diaporama, pause, plein écran ---------- */
  const reelImgs = $$('.reel__slides img');
  const playBtn = $('.reel__play');
  let reelIndex = 0;
  let reelTimer = null;
  function nextReel() {
    reelImgs[reelIndex].classList.remove('is-active');
    reelIndex = (reelIndex + 1) % reelImgs.length;
    reelImgs[reelIndex].classList.add('is-active');
  }
  function playReel(on) {
    clearInterval(reelTimer);
    if (on) reelTimer = setInterval(nextReel, 2800);
    playBtn.textContent = on ? '❚❚ Pause' : '▶ Lecture';
    playBtn.dataset.playing = on ? '1' : '0';
  }
  playReel(!reduceMotion);
  playBtn.addEventListener('click', () => playReel(playBtn.dataset.playing !== '1'));
  $('.reel__full').addEventListener('click', () => {
    const box = $('.reel__box');
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (box.requestFullscreen) box.requestFullscreen().catch(() => {});
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

  /* ---------- Listes qui défilent toutes seules (accueil + accroche) ---------- */
  function cycle(list, delay) {
    if (reduceMotion || !list) return;
    setInterval(() => {
      const first = list.firstElementChild;
      const h = first.offsetHeight;
      if (window.gsap) {
        gsap.to(list.children, {
          y: -h, duration: 0.8, ease: 'expo.inOut',
          onComplete: () => { list.appendChild(first); gsap.set(list.children, { y: 0 }); },
        });
      } else {
        list.appendChild(first);
      }
    }, delay);
  }
  cycle($('.hero__list'), 1800);
  cycle($('.rotator'), 2000);

  /* Pas d'animations : tout s'affiche directement */
  if (!motion) {
    root.classList.add('no-motion');
    root.classList.remove('is-loading');
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
  menu.setAttribute('data-lenis-prevent', '');
  viewer.setAttribute('data-lenis-prevent', '');

  // On attend les polices pour découper les textes au bon endroit
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(2500)]).then(() => {
    buildScrollAnimations();
    setupHeader();
    if (finePointer) setupCursor();
    playLoader();
  });

  /* ---------- Écran de chargement ---------- */
  function playLoader() {
    const tiles = $$('.loader__grid img');
    const logo = $('.loader__logo text');
    const hero = heroIntro();
    gsap.set(tiles, { filter: 'blur(0px)' });
    gsap.set(logo, { strokeDasharray: 3000, strokeDashoffset: 3000 });
    gsap.set('.loader__brand', { clipPath: 'inset(0% 0% 0% 0%)' });

    const tl = gsap.timeline({ onComplete: finishLoader });
    tl.to(tiles, { opacity: 1, duration: 0.2, stagger: { each: 0.045, from: 'random' } })
      .to(tiles, { opacity: 0, filter: 'blur(14px)', duration: 0.5, stagger: { each: 0.02, from: 'random' } }, '+=0.3')
      .to(logo, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, '-=0.3')
      .to(logo, { fill: '#f4f1ea', duration: 0.35 }, '-=0.2')
      .to('.loader__tag', { opacity: 1, duration: 0.4 }, '<')
      .to('.loader__brand', { clipPath: 'inset(0% 50% 0% 50%)', duration: 0.7, ease: 'expo.inOut' }, '+=0.45')
      .to('.loader__skip', { autoAlpha: 0, duration: 0.3 }, '<')
      .to('.loader__curtain--left', { xPercent: -1.5, duration: 0.3, ease: 'power2.out' }, '-=0.15')
      .to('.loader__curtain--right', { xPercent: 1.5, duration: 0.3, ease: 'power2.out' }, '<')
      .to('.loader__curtain--left', { xPercent: -101, duration: 1, ease: 'expo.inOut' })
      .to('.loader__curtain--right', { xPercent: 101, duration: 1, ease: 'expo.inOut' }, '<')
      .add(hero.play(), '-=0.55');

    $('.loader__skip').addEventListener('click', () => tl.progress(1));
  }

  function finishLoader() {
    root.classList.remove('is-loading');
    if (lenis && !menuOpen) lenis.start();
    ScrollTrigger.refresh();
  }

  // Apparition de l'accueil (lancée par l'écran de chargement)
  function heroIntro() {
    const chars = SplitText.create('.hero__logo', { type: 'chars', mask: 'chars' }).chars;
    return gsap.timeline({ paused: true })
      .from(chars, { yPercent: 110, duration: 1.2, stagger: 0.06, ease: 'expo.out' })
      .from('.hero__star', { scale: 0, rotation: -120, duration: 1.2, ease: 'expo.out', transformOrigin: '50% 50%' }, 0.2)
      .from('.hero__texts > *', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.35);
  }

  /* ---------- Animations au scroll ---------- */
  function buildScrollAnimations() {
    const vh = () => window.innerHeight;

    // 1. Accueil : le texte s'efface, l'étoile grossit jusqu'à remplir l'écran
    const starWrap = $('.hero__star-wrap');
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=140%', pin: true, scrub: 1, invalidateOnRefresh: true } })
      .to(['.hero__logo', '.hero__texts'], { y: -70, autoAlpha: 0, duration: 0.25, stagger: 0.03, ease: 'power2.in' }, 0)
      .to(starWrap, { y: () => vh() / 2 - (starWrap.offsetTop + starWrap.offsetHeight / 2), duration: 0.3, ease: 'power2.inOut' }, 0.05)
      .to(starWrap, { scale: 70, rotation: 140, duration: 0.65, ease: 'power3.in' }, 0.32)
      .to('.hero', { backgroundColor: '#8f8c86', duration: 0.25, ease: 'none' }, 0.5)
      .to('.hero', { backgroundColor: '#0a0a0b', duration: 0.2, ease: 'none' }, 0.78);

    // 2. Image + accroche
    gsap.fromTo('.intro__img', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.intro', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.intro__line', { yPercent: 60, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.intro', start: 'top 55%' } });
    gsap.from('.intro__rotator', { autoAlpha: 0, duration: 1, scrollTrigger: { trigger: '.intro', start: 'top 40%' } });

    // 3. Paragraphe : les lignes montent une à une
    revealLines('.lead__text', '.lead__text');
    gsap.from(['.lead .label', '.lead__sign'], { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.lead', start: 'top 70%' } });

    // 4. Showreel : la vidéo grandit, le fond passe du noir au crème puis la vidéo prend tout l'écran
    gsap.timeline({
      scrollTrigger: {
        trigger: '.reel', start: 'top top', end: '+=230%', pin: true, scrub: 1,
        onUpdate: (self) => setHeaderTheme(self.progress > 0.12 && self.progress < 0.62 ? 'dark' : 'light'),
      },
    })
      .to('.reel', { backgroundColor: '#8f8c86', duration: 0.12, ease: 'none' }, 0)
      .to('.reel', { backgroundColor: '#f4f1ea', duration: 0.12, ease: 'none' }, 0.12)
      .fromTo('.reel__box', { scale: 0.3 }, { scale: 0.72, duration: 0.45, ease: 'power1.inOut' }, 0)
      .fromTo('.reel__title', { yPercent: 0 }, { yPercent: -70, duration: 0.45, ease: 'power1.inOut' }, 0)
      .to('.reel__kicker', { autoAlpha: 0, y: -30, duration: 0.15 }, 0.3)
      .to('.reel__box', { scale: 1, boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.3, ease: 'power2.inOut' }, 0.55)
      .to('.reel__controls', { opacity: 1, duration: 0.08 }, 0.8)
      .to({}, { duration: 0.15 });

    // 5. Manifeste : trois phrases qui s'allument puis laissent la place
    const blocks = $$('.manifesto__block');
    const mTl = gsap.timeline({ scrollTrigger: { trigger: '.manifesto', start: 'top top', end: '+=430%', pin: true, scrub: 1 } });
    mTl.to('.manifesto__star', { rotation: 200, scale: 1.12, ease: 'none', duration: blocks.length }, 0);
    blocks.forEach((block, i) => {
      const title = SplitText.create($('.manifesto__title', block), { type: 'words' }).words;
      const accent = SplitText.create($('.manifesto__accent', block), { type: 'words' }).words;
      const sub = $('.manifesto__sub', block);
      if (i > 0) { gsap.set(block, { autoAlpha: 0 }); mTl.set(block, { autoAlpha: 1 }, i); }
      mTl.fromTo(title, { opacity: 0.16 }, { opacity: 1, stagger: 0.03, duration: 0.3, ease: 'none' }, i);
      if (sub) mTl.fromTo(sub, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.1 }, i + 0.28);
      mTl.fromTo(accent, { opacity: 0, yPercent: 35 }, { opacity: 1, yPercent: 0, stagger: 0.035, duration: 0.25, ease: 'power2.out' }, i + 0.36);
      if (i < blocks.length - 1) mTl.to(block, { autoAlpha: 0, y: -50, duration: 0.14 }, i + 0.86);
    });

    // 6. Définition
    const typed = SplitText.create('.typed', { type: 'chars' }).chars;
    gsap.timeline({ scrollTrigger: { trigger: '.authors', start: 'top 55%' } })
      .from('.authors__text', { autoAlpha: 0, duration: 0.6 })
      .from(typed, { autoAlpha: 0, duration: 0.01, stagger: 0.12 }, '+=0.2');
    gsap.set('.bracket', { yPercent: -50 });
    gsap.fromTo('.bracket--left', { xPercent: -70 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.definition__card', start: 'top bottom', end: 'center center', scrub: 1 } });
    gsap.fromTo('.bracket--right', { xPercent: 70 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.definition__card', start: 'top bottom', end: 'center center', scrub: 1 } });
    const defChars = SplitText.create('.definition__word', { type: 'chars', mask: 'chars' }).chars;
    gsap.from(defChars, { yPercent: 110, duration: 1.1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.definition__word', start: 'top 80%' } });
    gsap.from('.definition__star', { scale: 0, rotation: -180, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.definition__word', start: 'top 75%' } });
    const defWords = SplitText.create('.definition__text', { type: 'words' }).words;
    gsap.fromTo(defWords, { color: '#c9c6be' }, { color: '#0a0a0b', stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.definition__text', start: 'top 78%', end: 'bottom 45%', scrub: 1 } });
    gsap.from(['.definition__phon', '.definition__syn', '.definition__who'], { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.1, scrollTrigger: { trigger: '.definition__phon', start: 'top 85%' } });
    marquee($('.tools__track'), 36, 1);

    // 7. Nom géant rempli d'une photo, puis la question
    const q1 = SplitText.create('.bigword__question', { type: 'words' }).words;
    gsap.timeline({ scrollTrigger: { trigger: '.bigword', start: 'top top', end: '+=170%', pin: true, scrub: 1 } })
      .fromTo('.bigword__word', { scale: 1.9 }, { scale: 0.92, duration: 0.5, ease: 'power2.out' }, 0)
      .fromTo('.bigword__word', { backgroundPosition: '50% 20%' }, { backgroundPosition: '50% 80%', duration: 1, ease: 'none' }, 0)
      .to('.bigword__word', { opacity: 0.3, duration: 0.2 }, 0.55)
      .fromTo(q1, { opacity: 0, yPercent: 40, filter: 'blur(8px)' }, { opacity: 1, yPercent: 0, filter: 'blur(0px)', stagger: 0.04, duration: 0.25 }, 0.55);

    // 8. La promesse
    const promiseWords = SplitText.create('.promise__title', { type: 'words' }).words;
    gsap.from(promiseWords, { yPercent: 50, autoAlpha: 0, duration: 1, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.promise', start: 'top 60%' } });
    gsap.from(['.promise .label', '.promise__next'], { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: '.promise', start: 'top 60%' } });

    // 9. Projets : chaque diapositive recouvre la précédente
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

    // 10. Aperçu : noms qui défilent dans les deux sens
    const moreTitle = SplitText.create('.more__title', { type: 'words' }).words;
    gsap.from(moreTitle, { yPercent: 50, autoAlpha: 0, duration: 1, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.more', start: 'top 60%' } });
    $$('.more__row').forEach((row, i) => marquee(row, 30 + i * 6, i % 2 ? -1 : 1, true));
    gsap.to('.more__star', { rotation: 120, ease: 'none', scrollTrigger: { trigger: '.more', start: 'top bottom', end: 'bottom top', scrub: true } });

    // 11. Et concrètement ?
    const q2 = SplitText.create('.how__question', { type: 'words' }).words;
    gsap.timeline({ scrollTrigger: { trigger: '.how', start: 'top top', end: '+=150%', pin: true, scrub: 1 } })
      .fromTo('.how__word', { yPercent: 30, scale: 1.15 }, { yPercent: -8, scale: 1, duration: 0.5 }, 0)
      .fromTo('.how__img', { scale: 1.15 }, { scale: 1, duration: 1, ease: 'none' }, 0)
      .to('.how__word', { opacity: 0.22, duration: 0.2 }, 0.5)
      .to('.how__img', { filter: 'brightness(0.25) contrast(1.1)', duration: 0.3 }, 0.5)
      .fromTo(q2, { opacity: 0, yPercent: 40, filter: 'blur(8px)' }, { opacity: 1, yPercent: 0, filter: 'blur(0px)', stagger: 0.04, duration: 0.25 }, 0.55);

    // 12. Méthode
    const methodWords = SplitText.create('.method__title', { type: 'words' }).words;
    gsap.from(methodWords, { yPercent: 50, autoAlpha: 0, duration: 1, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.method', start: 'top 65%' } });
    gsap.from(['.method .label', '.method__hint'], { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.15, scrollTrigger: { trigger: '.method', start: 'top 65%' } });
    $$('.method__name').forEach((name) => {
      gsap.fromTo(name, { color: 'rgba(244, 241, 234, 0.14)', x: 40 }, { color: 'rgba(244, 241, 234, 1)', x: 0, ease: 'none', scrollTrigger: { trigger: name, start: 'top 88%', end: 'top 58%', scrub: 1 } });
    });
    gsap.from('.method__note', { autoAlpha: 0, y: 16, duration: 0.8, scrollTrigger: { trigger: '.method__note', start: 'top 90%' } });

    // 13. Encore un doute ?
    const q3 = SplitText.create('.doubt__title', { type: 'words' }).words;
    gsap.timeline({ scrollTrigger: { trigger: '.doubt', start: 'top top', end: '+=120%', pin: true, scrub: 1 } })
      .fromTo('.doubt__img', { scale: 1.2 }, { scale: 1, duration: 1, ease: 'none' }, 0)
      .fromTo('.doubt__stage', { '--dark': 0.08 }, { '--dark': 0.62, duration: 0.6 }, 0.2)
      .fromTo(q3, { opacity: 0, yPercent: 40, filter: 'blur(8px)' }, { opacity: 1, yPercent: 0, filter: 'blur(0px)', stagger: 0.05, duration: 0.3 }, 0.25);

    // 14. Confiance : la liste de noms défile
    const win = $('.clients__window');
    const list = $('.clients__list');
    gsap.fromTo(list, { y: () => win.offsetHeight * 0.5 }, {
      y: () => -(list.offsetHeight - win.offsetHeight * 0.5), ease: 'none',
      scrollTrigger: { trigger: '.clients', start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
    });
    gsap.fromTo('.clients__closer mark', { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', duration: 1.1, ease: 'expo.inOut', scrollTrigger: { trigger: '.clients__closer', start: 'top 82%' } });
    gsap.from('.clients__closer', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.clients__closer', start: 'top 88%' } });

    // 15. Journal
    gsap.set('.journal__list li', { y: 30, autoAlpha: 0 });
    ScrollTrigger.batch('.journal__list li', { start: 'top 90%', once: true, onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out' }) });

    // 16. Témoignage
    gsap.fromTo('.testimonial__img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.testimonial', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.testimonial__word', { yPercent: 25 }, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.testimonial', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from(['.testimonial__text > *', '.testimonial__cta'], { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.testimonial', start: 'top 55%' } });

    // 17. Pied de page
    revealLines('.footer__title', '.footer');
    const footChars = SplitText.create('.footer__logo', { type: 'chars', mask: 'chars' }).chars;
    gsap.from(footChars, { yPercent: 110, duration: 1.1, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.footer__logo', start: 'top 92%' } });
  }

  // Fait monter les lignes d'un texte depuis un masque
  function revealLines(selector, trigger) {
    const lines = SplitText.create(selector, { type: 'lines', mask: 'lines' }).lines;
    gsap.from(lines, { yPercent: 105, duration: 1.1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger, start: 'top 78%' } });
  }

  // Bandeau qui défile en continu (accélère avec la vitesse du scroll si "reactive")
  function marquee(track, duration, direction, reactive) {
    const tween = gsap.fromTo(track, { xPercent: direction > 0 ? 0 : -50 }, { xPercent: direction > 0 ? -50 : 0, duration, ease: 'none', repeat: -1 });
    if (!reactive) return;
    let slow;
    ScrollTrigger.create({
      trigger: track, start: 'top bottom', end: 'bottom top',
      onUpdate(self) {
        tween.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 400, 5));
        if (slow) slow.kill();
        slow = gsap.to(tween, { timeScale: 1, duration: 1.2, ease: 'power2.out' });
      },
    });
  }

  /* ---------- En-tête : visible après l'accueil, couleur selon la section ---------- */
  function setHeaderTheme(theme) {
    header.classList.toggle('is-hidden', theme === 'hidden');
    header.classList.toggle('is-dark', theme === 'dark');
  }

  function setupHeader() {
    setHeaderTheme('hidden');
    $$('[data-header]').forEach((section) => {
      if (section.dataset.header === 'auto') return;
      const trigger = section.parentElement.classList.contains('pin-spacer') ? section.parentElement : section;
      ScrollTrigger.create({
        trigger, start: 'top 40px', end: 'bottom 40px',
        onToggle: (self) => { if (self.isActive) setHeaderTheme(section.dataset.header); },
      });
    });
    const reelSpacer = $('.reel').parentElement;
    ScrollTrigger.create({ trigger: reelSpacer, start: 'top 40px', end: 'bottom 40px', onToggle: (self) => { if (self.isActive) setHeaderTheme('light'); } });
    ScrollTrigger.create({
      trigger: '.lead', start: 'top 60%',
      onEnter: () => header.classList.add('is-compact'),
      onLeaveBack: () => header.classList.remove('is-compact'),
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
      cursor.classList.toggle('is-link', !!e.target.closest('a, button, input, .menu__col'));
    });
  }
})();
