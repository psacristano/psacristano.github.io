const AudioCtx = window.AudioContext || window.webkitAudioContext;
let _ctx = null;
let _muted = false;

function ac() {
  if (!_ctx) _ctx = new AudioCtx();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

const SFX = {
  toggleMute() {
    _muted = !_muted;
    return _muted;
  },

  isMuted() { return _muted; },

  // Short chip click on bet placed
  bet() {
    if (_muted) return;
    const ctx = ac(), t = ctx.currentTime;
    const len = ctx.sampleRate * 0.08;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 5) * 0.6;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    src.connect(f); f.connect(g); g.connect(ctx.destination);
    src.start(t);
  },

  // Countdown tick each second
  tick() {
    if (_muted) return;
    const ctx = ac(), t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = 880;
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.06);
  },

  // Subtle rising tone during flight — throttle externally (every ~250ms)
  rise(mult) {
    if (_muted) return;
    const ctx = ac(), t = ctx.currentTime;
    const freq = Math.min(180 + mult * 35, 1600);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    g.gain.setValueAtTime(0.035, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.09);
  },

  // Coin cascade on cashout
  cashout() {
    if (_muted) return;
    const ctx = ac(), t = ctx.currentTime;
    [523, 659, 784, 1047, 1319].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle'; osc.frequency.value = freq;
      const s = t + i * 0.07;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.22, s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.2);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(s); osc.stop(s + 0.22);
    });
    // shimmer
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.5) * 0.12;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 4000;
    src.connect(f); f.connect(ctx.destination);
    src.start(t + 0.3);
  },

  // Descending boom on crash
  crash() {
    if (_muted) return;
    const ctx = ac(), t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.55);
    g.gain.setValueAtTime(0.10, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.7);
    // rumble noise
    const len = ctx.sampleRate * 0.4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.2) * 0.35;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 400;
    src.connect(f); f.connect(ctx.destination);
    src.start(t);
  },

  // Sad descending melody on game over
  gameOver() {
    if (_muted) return;
    const ctx = ac(), t = ctx.currentTime;
    [392, 349, 294, 220].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle'; osc.frequency.value = freq;
      const s = t + i * 0.2;
      g.gain.setValueAtTime(0.18, s);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.28);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(s); osc.stop(s + 0.32);
    });
  },

  // Fanfare on 1M win
  bigWin() {
    if (_muted) return;
    const ctx = ac(), t = ctx.currentTime;
    const melody = [523, 659, 784, 1047, 784, 1047, 1319, 1047, 1319, 1568];
    const durs   = [0.1, 0.1, 0.1, 0.15, 0.08, 0.08, 0.2, 0.08, 0.08, 0.5];
    let time = t;
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle'; osc.frequency.value = freq;
      g.gain.setValueAtTime(0.22, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + durs[i]);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(time); osc.stop(time + durs[i] + 0.05);
      time += durs[i] * 0.85;
    });
    // coin shower
    for (let i = 0; i < 10; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 700 + Math.random() * 1400;
      const s = t + 0.7 + i * 0.065;
      g.gain.setValueAtTime(0.1, s);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.13);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(s); osc.stop(s + 0.15);
    }
  }
};
