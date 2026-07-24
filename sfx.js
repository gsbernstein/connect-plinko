/* Shared casino / arcade SFX via Web Audio (no asset files).
   Exposes window.PlinkoSfx — call unlock() on first gesture. */
(function (global) {
  'use strict';

  const MUTE_KEY = 'plinkoSfxMuted';

  let ctx = null;
  let master = null;
  let muted = false;
  let unlocked = false;

  // Throttle noisy physics hits so a cascade doesn't become white noise.
  const lastPlayed = Object.create(null);
  const THROTTLE_MS = {
    peg: 42,
    bumper: 70,
    land: 55,
    click: 80,
    drop: 90
  };

  try {
    muted = localStorage.getItem(MUTE_KEY) === '1';
  } catch (_) { /* private mode */ }

  function ensureCtx() {
    if (ctx) return ctx;
    const AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.55;
    master.connect(ctx.destination);
    return ctx;
  }

  function unlock() {
    const c = ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') {
      c.resume().catch(function () { /* ignore */ });
    }
    unlocked = true;
  }

  function setMuted(on) {
    muted = !!on;
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch (_) { /* private mode */ }
    if (master) master.gain.value = muted ? 0 : 0.55;
  }

  function isMuted() {
    return muted;
  }

  function toggleMute() {
    setMuted(!muted);
    return muted;
  }

  function now() {
    const c = ensureCtx();
    return c ? c.currentTime : 0;
  }

  function canPlay(id) {
    if (muted || !unlocked) return false;
    const c = ensureCtx();
    if (!c || c.state !== 'running') return false;
    const gap = THROTTLE_MS[id];
    if (gap) {
      const t = performance.now();
      if (lastPlayed[id] != null && t - lastPlayed[id] < gap) return false;
      lastPlayed[id] = t;
    }
    return true;
  }

  function envGain(t0, attack, decay, peak, sustain) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + attack);
    if (sustain != null && sustain > 0) {
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, sustain), t0 + attack + decay * 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
    } else {
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
    }
    g.connect(master);
    return g;
  }

  function tone(type, freq, t0, dur, peak, opts) {
    opts = opts || {};
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (opts.slideTo != null) {
      o.frequency.exponentialRampToValueAtTime(Math.max(20, opts.slideTo), t0 + dur);
    }
    if (opts.detune != null) o.detune.setValueAtTime(opts.detune, t0);
    const g = envGain(t0, opts.attack != null ? opts.attack : 0.008, dur, peak, opts.sustain);
    if (opts.filterFreq) {
      const f = ctx.createBiquadFilter();
      f.type = opts.filterType || 'lowpass';
      f.frequency.setValueAtTime(opts.filterFreq, t0);
      if (opts.filterQ != null) f.Q.value = opts.filterQ;
      o.connect(f);
      f.connect(g);
    } else {
      o.connect(g);
    }
    o.start(t0);
    o.stop(t0 + dur + 0.05);
    return o;
  }

  function noiseBurst(t0, dur, peak, opts) {
    opts = opts || {};
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = opts.filterType || 'bandpass';
    f.frequency.setValueAtTime(opts.filterFreq || 1800, t0);
    f.Q.value = opts.filterQ != null ? opts.filterQ : 0.8;
    const g = envGain(t0, opts.attack != null ? opts.attack : 0.002, dur, peak);
    src.connect(f);
    f.connect(g);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  function playArp(freqs, t0, step, type, peak, dur) {
    for (let i = 0; i < freqs.length; i++) {
      tone(type || 'square', freqs[i], t0 + i * step, dur || 0.12, peak * (1 - i * 0.08), {
        attack: 0.004,
        filterFreq: 4200
      });
    }
  }

  function sfxDrop() {
    if (!canPlay('drop')) return;
    const t0 = now();
    // Soft chip toss + bright arcade blip.
    noiseBurst(t0, 0.045, 0.18, { filterType: 'lowpass', filterFreq: 900, attack: 0.001 });
    tone('triangle', 520, t0, 0.09, 0.22, { slideTo: 280, filterFreq: 2400 });
    tone('square', 880, t0 + 0.02, 0.05, 0.08, { slideTo: 660, filterFreq: 3200 });
  }

  function sfxPeg() {
    if (!canPlay('peg')) return;
    const t0 = now();
    const f = 1400 + Math.random() * 900;
    tone('sine', f, t0, 0.028, 0.07 + Math.random() * 0.04, {
      slideTo: f * 0.7,
      filterFreq: 5000
    });
    noiseBurst(t0, 0.012, 0.04, { filterType: 'highpass', filterFreq: 2500, filterQ: 0.6 });
  }

  function sfxBumper() {
    if (!canPlay('bumper')) return;
    const t0 = now();
    tone('square', 220, t0, 0.09, 0.16, { slideTo: 110, filterFreq: 1600 });
    tone('triangle', 660, t0, 0.07, 0.14, { slideTo: 420, filterFreq: 3000 });
    noiseBurst(t0, 0.03, 0.1, { filterType: 'bandpass', filterFreq: 1200, filterQ: 1.2 });
  }

  function sfxLand() {
    if (!canPlay('land')) return;
    const t0 = now();
    noiseBurst(t0, 0.04, 0.16, { filterType: 'lowpass', filterFreq: 700 });
    tone('triangle', 180, t0, 0.08, 0.18, { slideTo: 90, filterFreq: 900 });
    tone('sine', 540, t0 + 0.01, 0.05, 0.08, { slideTo: 360 });
  }

  function sfxFlash() {
    if (!canPlay('flash')) return;
    const t0 = now();
    tone('sine', 880, t0, 0.08, 0.12, { slideTo: 1320, filterFreq: 5000 });
    tone('square', 1320, t0 + 0.04, 0.07, 0.08, { slideTo: 1760, filterFreq: 4500 });
  }

  function sfxWin(tier) {
    if (!canPlay('win')) return;
    const t0 = now();
    const level = tier === 'huge' ? 3 : tier === 'big' ? 2 : tier === 'medium' ? 1 : 0;
    if (level === 0) {
      // Pair / two pair — short coin ding.
      tone('sine', 880, t0, 0.1, 0.2, { filterFreq: 5000 });
      tone('triangle', 1175, t0 + 0.05, 0.12, 0.16, { filterFreq: 5000 });
      noiseBurst(t0, 0.03, 0.06, { filterType: 'highpass', filterFreq: 3000 });
      return;
    }
    if (level === 1) {
      playArp([659, 880, 1175], t0, 0.07, 'triangle', 0.2, 0.14);
      tone('sine', 1319, t0 + 0.22, 0.18, 0.14, { filterFreq: 4500 });
      return;
    }
    if (level === 2) {
      playArp([523, 659, 784, 1047, 1319], t0, 0.065, 'square', 0.18, 0.13);
      tone('triangle', 1568, t0 + 0.34, 0.22, 0.16, { filterFreq: 5000 });
      noiseBurst(t0 + 0.1, 0.08, 0.08, { filterType: 'bandpass', filterFreq: 2400 });
      return;
    }
    // Jackpot — cascading chime + sparkle.
    playArp([523, 659, 784, 1047, 1319, 1568, 2093], t0, 0.055, 'square', 0.2, 0.12);
    tone('sine', 2093, t0 + 0.4, 0.35, 0.18, { slideTo: 2637, filterFreq: 6000 });
    tone('triangle', 1047, t0 + 0.45, 0.4, 0.12, { filterFreq: 4000 });
    noiseBurst(t0 + 0.15, 0.12, 0.1, { filterType: 'highpass', filterFreq: 2800 });
    noiseBurst(t0 + 0.35, 0.15, 0.08, { filterType: 'bandpass', filterFreq: 3500, filterQ: 1.4 });
  }

  function sfxExplode() {
    if (!canPlay('explode')) return;
    const t0 = now();
    noiseBurst(t0, 0.12, 0.22, { filterType: 'bandpass', filterFreq: 900, filterQ: 0.7 });
    tone('square', 160, t0, 0.14, 0.16, { slideTo: 60, filterFreq: 800 });
    tone('triangle', 420, t0, 0.08, 0.1, { slideTo: 180, filterFreq: 2000 });
  }

  function sfxChain() {
    if (!canPlay('chain')) return;
    const t0 = now();
    tone('sawtooth', 300, t0, 0.16, 0.12, { slideTo: 900, filterFreq: 2200, attack: 0.01 });
    tone('square', 600, t0 + 0.05, 0.12, 0.1, { slideTo: 1200, filterFreq: 3000 });
  }

  function sfxCombo() {
    if (!canPlay('combo')) return;
    const t0 = now();
    tone('triangle', 740, t0, 0.08, 0.14, { filterFreq: 4000 });
    tone('triangle', 988, t0 + 0.07, 0.1, 0.14, { filterFreq: 4000 });
    tone('sine', 1319, t0 + 0.14, 0.12, 0.12, { filterFreq: 5000 });
  }

  function sfxFloor() {
    if (!canPlay('floor')) return;
    const t0 = now();
    noiseBurst(t0, 0.22, 0.28, { filterType: 'lowpass', filterFreq: 500, attack: 0.005 });
    tone('square', 90, t0, 0.25, 0.2, { slideTo: 40, filterFreq: 400 });
    tone('triangle', 180, t0 + 0.04, 0.18, 0.12, { slideTo: 70, filterFreq: 700 });
  }

  function sfxLevelUp() {
    if (!canPlay('levelup')) return;
    const t0 = now();
    playArp([392, 523, 659, 784, 1047], t0, 0.08, 'square', 0.2, 0.15);
    tone('triangle', 1319, t0 + 0.42, 0.28, 0.18, { filterFreq: 5000 });
    tone('sine', 1568, t0 + 0.5, 0.32, 0.12, { filterFreq: 6000 });
    noiseBurst(t0 + 0.2, 0.1, 0.08, { filterType: 'highpass', filterFreq: 3200 });
  }

  function sfxBuy() {
    if (!canPlay('buy')) return;
    const t0 = now();
    // Cash-register ka-ching.
    tone('square', 980, t0, 0.05, 0.14, { filterFreq: 4000 });
    tone('square', 1310, t0 + 0.05, 0.06, 0.14, { filterFreq: 4500 });
    tone('triangle', 1760, t0 + 0.1, 0.16, 0.18, { filterFreq: 5500 });
    noiseBurst(t0 + 0.08, 0.05, 0.07, { filterType: 'highpass', filterFreq: 4000 });
  }

  function sfxClaim() {
    if (!canPlay('claim')) return;
    const t0 = now();
    playArp([784, 988, 1175], t0, 0.06, 'triangle', 0.18, 0.12);
    tone('sine', 1568, t0 + 0.18, 0.2, 0.12, { filterFreq: 5000 });
  }

  function sfxCashOut() {
    if (!canPlay('cashout')) return;
    const t0 = now();
    playArp([262, 330, 392, 523, 659, 784, 1047], t0, 0.07, 'square', 0.2, 0.14);
    tone('triangle', 1319, t0 + 0.5, 0.4, 0.18, { filterFreq: 5000 });
    tone('sine', 2093, t0 + 0.55, 0.45, 0.14, { filterFreq: 6500 });
    noiseBurst(t0 + 0.25, 0.15, 0.1, { filterType: 'bandpass', filterFreq: 2800, filterQ: 1.1 });
    // Coin shower sparkle.
    for (let i = 0; i < 6; i++) {
      const f = 1200 + Math.random() * 1600;
      tone('sine', f, t0 + 0.35 + i * 0.045, 0.08, 0.07, {
        slideTo: f * 1.3,
        filterFreq: 7000
      });
    }
  }

  function sfxSuitBomb() {
    if (!canPlay('suitbomb')) return;
    const t0 = now();
    tone('sawtooth', 180, t0, 0.22, 0.16, { slideTo: 60, filterFreq: 900, attack: 0.01 });
    tone('square', 720, t0, 0.12, 0.12, { slideTo: 240, filterFreq: 2200 });
    noiseBurst(t0, 0.18, 0.2, { filterType: 'bandpass', filterFreq: 1100, filterQ: 0.9 });
    tone('triangle', 1400, t0 + 0.08, 0.1, 0.1, { slideTo: 400, filterFreq: 3500 });
  }

  function sfxClick() {
    if (!canPlay('click')) return;
    const t0 = now();
    tone('square', 640, t0, 0.03, 0.08, { filterFreq: 2800 });
    noiseBurst(t0, 0.015, 0.04, { filterType: 'highpass', filterFreq: 2000 });
  }

  const HANDLERS = {
    drop: sfxDrop,
    peg: sfxPeg,
    bumper: sfxBumper,
    land: sfxLand,
    flash: sfxFlash,
    win: function () { sfxWin('normal'); },
    winMedium: function () { sfxWin('medium'); },
    winBig: function () { sfxWin('big'); },
    winHuge: function () { sfxWin('huge'); },
    explode: sfxExplode,
    chain: sfxChain,
    combo: sfxCombo,
    floor: sfxFloor,
    levelup: sfxLevelUp,
    buy: sfxBuy,
    claim: sfxClaim,
    cashout: sfxCashOut,
    suitbomb: sfxSuitBomb,
    click: sfxClick
  };

  function play(id) {
    const fn = HANDLERS[id];
    if (fn) fn();
  }

  function playWinTier(tier) {
    if (tier === 'huge') sfxWin('huge');
    else if (tier === 'big') sfxWin('big');
    else if (tier === 'medium') sfxWin('medium');
    else sfxWin('normal');
  }

  // Unlock on first pointer/key — autoplay policy.
  function bindUnlock() {
    const once = function () {
      unlock();
      global.removeEventListener('pointerdown', once, true);
      global.removeEventListener('keydown', once, true);
    };
    global.addEventListener('pointerdown', once, true);
    global.addEventListener('keydown', once, true);
  }
  bindUnlock();

  global.PlinkoSfx = {
    play: play,
    playWinTier: playWinTier,
    unlock: unlock,
    setMuted: setMuted,
    isMuted: isMuted,
    toggleMute: toggleMute,
    MUTE_KEY: MUTE_KEY
  };
})(typeof window !== 'undefined' ? window : globalThis);
