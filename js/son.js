/* =========================================================
   MUSIQUE D'AMBIANCE — générée en direct (Web Audio API)
   Pas de fichier audio : nappes douces, basse ronde et petites
   notes avec écho, sur une suite d'accords « chill » :
   Fa maj9 → Mi m7 → Ré m9 → La m9 (72 BPM, 2 mesures par accord).
   Elle démarre avec l'animation du nom, au clic sur « Entrer »
   (les navigateurs interdisent le son sans un clic du visiteur).
   Le bouton « Son » permet ensuite de la couper ou la relancer.
   ========================================================= */
(function () {
  'use strict';

  const BPM = 72;
  const BEAT = 60 / BPM;
  const CHORD_LEN = BEAT * 8;          // 2 mesures de 4 temps
  const VOLUME = 0.95;

  // Notes en numéros MIDI (60 = do central)
  const CHORDS = [
    { bass: 41, pad: [53, 57, 60, 64, 67] }, // Fa maj9
    { bass: 40, pad: [52, 55, 59, 62, 67] }, // Mi m7
    { bass: 38, pad: [50, 53, 57, 60, 64] }, // Ré m9
    { bass: 45, pad: [57, 60, 64, 67, 71] }, // La m9
  ];
  // Positions des petites notes (en croches, 16 par accord) et quelle note de l'accord jouer
  const ARP = [[0, 2], [3, 3], [5, 4], [8, 3], [10, 2], [11, 4], [13, 3], [14, 1]];

  const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // Construit le circuit audio sur un contexte (temps réel ou hors ligne pour les tests)
  function createEngine(ctx) {
    const master = ctx.createGain();
    master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 3;
    master.connect(comp).connect(ctx.destination);

    // Réverbération : réponse impulsionnelle générée (bruit qui décroît)
    const reverb = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 3.2);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    reverb.buffer = ir;
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.55;
    reverb.connect(reverbGain).connect(master);

    // Écho pour les petites notes
    const delay = ctx.createDelay(2);
    delay.delayTime.value = BEAT * 0.75;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.38;
    const delayTone = ctx.createBiquadFilter();
    delayTone.type = 'lowpass';
    delayTone.frequency.value = 1800;
    delay.connect(delayTone).connect(feedback).connect(delay);
    const delayOut = ctx.createGain();
    delayOut.gain.value = 0.45;
    delayTone.connect(delayOut).connect(master);
    delayOut.connect(reverb);

    // Bus des nappes : filtre doux qui « respire » lentement
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 820;
    padFilter.Q.value = 0.4;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 260;
    lfo.connect(lfoDepth).connect(padFilter.frequency);
    lfo.start();
    const padBus = ctx.createGain();
    padBus.gain.value = 1;
    padBus.connect(padFilter);
    padFilter.connect(master);
    padFilter.connect(reverb);

    // Souffle léger, comme un vinyle
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < nd.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; nd[i] = last * 3.5; }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.02;
    noise.connect(noiseGain).connect(master);
    noise.start();

    function padNote(m, t, dur) {
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.03, t + 1.8);
      env.gain.setValueAtTime(0.03, t + dur - 0.2);
      env.gain.linearRampToValueAtTime(0, t + dur + 2.4);
      env.connect(padBus);
      [-7, 7].forEach((cents) => {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = freq(m);
        o.detune.value = cents;
        o.connect(env);
        o.start(t);
        o.stop(t + dur + 2.6);
      });
    }

    function bassNote(m, t, dur) {
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.16, t + 0.25);
      env.gain.exponentialRampToValueAtTime(0.09, t + 2);
      env.gain.setValueAtTime(0.09, t + dur - 0.3);
      env.gain.linearRampToValueAtTime(0, t + dur + 0.6);
      env.connect(master);
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq(m);
      o.connect(env);
      o.start(t);
      o.stop(t + dur + 0.7);
    }

    function pluck(m, t) {
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.06, t + 0.006);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
      const tone = ctx.createBiquadFilter();
      tone.type = 'lowpass';
      tone.frequency.value = 2400;
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = freq(m);
      o.connect(tone).connect(env);
      env.connect(master);
      env.connect(delay);
      env.connect(reverb);
      o.start(t);
      o.stop(t + 1.4);
    }

    let index = 0;
    function scheduleChord(t) {
      const chord = CHORDS[index % CHORDS.length];
      chord.pad.forEach((m) => padNote(m, t, CHORD_LEN));
      bassNote(chord.bass, t, CHORD_LEN);
      ARP.forEach(([step, note], k) => {
        if (index % 2 === 1 && k % 3 === 2) return; // varie un peu d'un accord à l'autre
        const swing = step % 2 ? BEAT * 0.06 : 0;
        pluck(chord.pad[note] + 12, t + step * (BEAT / 2) + swing);
      });
      index++;
    }

    return { master, scheduleChord };
  }

  window.AmbientSound = { createEngine, CHORD_LEN, VOLUME };

  /* ---------- Bouton « Son » ---------- */
  const btn = document.querySelector('.sound');
  if (!btn) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) { btn.hidden = true; return; }

  let ctx = null;
  let engine = null;
  let on = false;
  let timer = null;
  let nextTime = 0;

  function tick() {
    while (nextTime < ctx.currentTime + 0.6) {
      engine.scheduleChord(nextTime);
      nextTime += CHORD_LEN;
    }
  }

  function start(fade = 2.5) {
    if (!ctx) { ctx = new AudioCtx(); engine = createEngine(ctx); }
    ctx.resume();
    nextTime = ctx.currentTime + 0.1;
    clearInterval(timer);
    tick();
    timer = setInterval(tick, 150);
    const g = engine.master.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(VOLUME, ctx.currentTime + fade);
  }

  function stop() {
    if (!ctx) return;
    const g = engine.master.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    clearInterval(timer);
    setTimeout(() => { if (!on) ctx.suspend(); }, 900);
  }

  function setOn(value, fade) {
    on = value;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? "Couper la musique d'ambiance" : "Activer la musique d'ambiance");
    document.documentElement.classList.add('sound-touched');
    if (on) start(fade); else stop();
  }

  // Utilisé par l'écran d'entrée (js/main.js) : lance la musique en même temps que le nom
  window.AmbientSound.enable = (fade = 1.6) => { if (!on) setOn(true, fade); };

  btn.addEventListener('click', () => setOn(!on));
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !on) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });
})();
