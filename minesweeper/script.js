/* ════════════════════════════════════════════════════════
   Constants
════════════════════════════════════════════════════════ */
const CELLS      = 25;
const HOUSE_EDGE = 0.99;
const GOAL       = 1_000_000;

/* ════════════════════════════════════════════════════════
   State
════════════════════════════════════════════════════════ */
let balance   = 1000;
let bet       = 50;
let numMines  = 3;
let gameState = 'idle';   // 'idle' | 'playing'
let bombs     = new Set();
let revealed  = new Set();
let safeCount = 0;

/* ════════════════════════════════════════════════════════
   Sound Engine  (Web Audio API — no external files)
════════════════════════════════════════════════════════ */
let audioCtx = null;
let muted    = false;

function getAC() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function play(fn) {
  if (muted) return;
  try { fn(getAC()); } catch (_) {}
}

const sounds = {

  tick() {
    play(ac => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.frequency.value = 900;
      g.gain.setValueAtTime(0.08, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
      o.start(); o.stop(ac.currentTime + 0.06);
    });
  },

  start() {
    play(ac => {
      [220, 330, 440].forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.type = 'sine'; o.frequency.value = f;
        const t = ac.currentTime + i * 0.07;
        g.gain.setValueAtTime(0.07, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        o.start(t); o.stop(t + 0.18);
      });
    });
  },

  // Pitch rises with each safe pick
  gem(step) {
    const scale = [523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319];
    const f = scale[Math.min(step, scale.length - 1)];
    play(ac => {
      [[f, 0], [f * 1.5, 0.05]].forEach(([freq, delay]) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.type = 'sine'; o.frequency.value = freq;
        const t = ac.currentTime + delay;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.13, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.start(t); o.stop(t + 0.3);
      });
    });
  },

  boom() {
    play(ac => {
      // White noise burst filtered to low rumble
      const len = Math.floor(ac.sampleRate * 0.55);
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const d   = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.25));
      const src = ac.createBufferSource(); src.buffer = buf;
      const lp  = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 200;
      const g   = ac.createGain(); g.gain.value = 0.6;
      src.connect(lp); lp.connect(g); g.connect(ac.destination);
      src.start();

      // Sub thump
      const o = ac.createOscillator(), g2 = ac.createGain();
      o.frequency.setValueAtTime(80, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(18, ac.currentTime + 0.4);
      g2.gain.setValueAtTime(0.7, ac.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);
      o.connect(g2); g2.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + 0.4);
    });
  },

  cashout() {
    play(ac => {
      [523, 659, 784, 1047, 1319].forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.type = 'sine'; o.frequency.value = f;
        const t = ac.currentTime + i * 0.09;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.16, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
        o.start(t); o.stop(t + 0.38);
      });
    });
  },

  fanfare() {
    play(ac => {
      const chords = [[523, 659, 784], [587, 740, 880], [659, 784, 988]];
      chords.forEach((chord, ci) => {
        chord.forEach(f => {
          const o = ac.createOscillator(), g = ac.createGain();
          o.connect(g); g.connect(ac.destination);
          o.type = 'sine'; o.frequency.value = f;
          const t = ac.currentTime + ci * 0.26;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.09, t + 0.03);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          o.start(t); o.stop(t + 0.3);
        });
      });
    });
  },
};

function toggleMute() {
  muted = !muted;
  const btn = document.getElementById('muteBtn');
  btn.textContent = muted ? '🔇' : '🔊';
  btn.classList.toggle('muted', muted);
}

/* ════════════════════════════════════════════════════════
   Visual Effects
════════════════════════════════════════════════════════ */

function spawnParticles(el, color, count) {
  const rect = el.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i / count) + (Math.random() - 0.5) * 0.9;
    const dist  = 22 + Math.random() * 38;
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = [
      `left:${cx}px`, `top:${cy}px`,
      `width:${3 + Math.random() * 5}px`,
      `height:${3 + Math.random() * 5}px`,
      `background:${color}`,
      `--dx:${Math.cos(angle) * dist}px`,
      `--dy:${Math.sin(angle) * dist}px`,
      `animation-duration:${0.38 + Math.random() * 0.3}s`,
      `animation-delay:${Math.random() * 0.08}s`,
    ].join(';');
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove(), { once: true });
  }
}

function spawnConfetti(count = 55) {
  const colors = ['#f0c040','#22c55e','#60a5fa','#a78bfa','#ef4444','#fff','#ff9500'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      const w = 5 + Math.random() * 9;
      p.style.cssText = [
        `left:${Math.random() * 100}vw`,
        `width:${w}px`,
        `height:${w * (0.35 + Math.random() * 0.5)}px`,
        `background:${colors[Math.floor(Math.random() * colors.length)]}`,
        `--rot:${Math.random() * 720 - 360}deg`,
        `animation-duration:${1.4 + Math.random() * 1.2}s`,
        `animation-delay:${Math.random() * 0.4}s`,
      ].join(';');
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove(), { once: true });
    }, i * 18);
  }
}

function flashScreen(type) {
  const el = document.getElementById('screenFlash');
  el.className = 'screen-flash';
  void el.offsetWidth;
  el.classList.add(type === 'red' ? 'flash-red' : 'flash-gold');
  el.addEventListener('animationend', () => { el.className = 'screen-flash'; }, { once: true });
}

function shakeGrid() {
  const el = document.getElementById('grid');
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
}

function flashBalance(type) {
  const el = document.getElementById('balAmt');
  el.classList.remove('pop-win', 'pop-lose');
  void el.offsetWidth;
  el.classList.add(type === 'win' ? 'pop-win' : 'pop-lose');
  el.addEventListener('animationend', () => el.classList.remove('pop-win', 'pop-lose'), { once: true });
}

function flashMult() {
  const el = document.getElementById('sMult');
  el.classList.remove('mult-flash');
  void el.offsetWidth;
  el.classList.add('mult-flash');
  el.addEventListener('animationend', () => el.classList.remove('mult-flash'), { once: true });
}

// Staggered cell entrance when grid is built
function animateGridIn() {
  document.querySelectorAll('.cell').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.022}s`;
    el.classList.add('cell-enter');
    el.addEventListener('animationend', () => {
      el.classList.remove('cell-enter');
      el.style.animationDelay = '';
    }, { once: true });
  });
}

/* ════════════════════════════════════════════════════════
   Math
════════════════════════════════════════════════════════ */
function calcMult(picks) {
  if (picks <= 0) return 1;
  const safe = CELLS - numMines;
  let p = 1;
  for (let i = 0; i < picks; i++) p *= (safe - i) / (CELLS - i);
  return HOUSE_EDGE / p;
}

function maxMult() { return calcMult(CELLS - numMines); }

/* ════════════════════════════════════════════════════════
   Grid
════════════════════════════════════════════════════════ */
function buildGrid(playing) {
  const g = document.getElementById('grid');
  g.innerHTML = '';
  g.className = 'grid' + (playing ? ' is-playing' : '');
  for (let i = 0; i < CELLS; i++) {
    const el = document.createElement('div');
    el.className = 'cell' + (playing ? '' : ' idle-anim');
    el.dataset.i = i;
    el.addEventListener('click', () => pick(i));
    g.appendChild(el);
  }
}

function cellEl(i) {
  return document.querySelector(`.cell[data-i="${i}"]`);
}

/* ════════════════════════════════════════════════════════
   Picking
════════════════════════════════════════════════════════ */
function pick(i) {
  if (gameState !== 'playing') return;
  if (revealed.has(i)) return;
  revealed.add(i);

  if (bombs.has(i)) {
    const el = cellEl(i);
    el.classList.add('bomb', 'locked');
    el.textContent = '💥';

    sounds.boom();
    flashScreen('red');
    spawnParticles(el, '#ef4444', 18);
    setTimeout(shakeGrid, 80);
    setTimeout(() => revealBombs(i), 250);
    setTimeout(() => endRound('lose'), 750);
  } else {
    safeCount++;
    const el = cellEl(i);
    el.classList.add('safe', 'locked');
    el.textContent = '💎';

    sounds.gem(safeCount - 1);
    // Particles turn gold as player gets deeper in
    const color = safeCount > 6 ? '#f0c040' : '#22c55e';
    spawnParticles(el, color, 6 + Math.min(safeCount, 10));
    setTimeout(flashMult, 60);

    if (safeCount >= CELLS - numMines) {
      setTimeout(cashout, 400);
      return;
    }
    updateUI();
  }
}

function revealBombs(hitIdx) {
  bombs.forEach(b => {
    const el = cellEl(b);
    if (!el || b === hitIdx) return;
    el.classList.add('ghost-bomb', 'locked');
    el.textContent = '💣';
  });
  for (let i = 0; i < CELLS; i++) {
    if (!revealed.has(i)) cellEl(i)?.classList.add('locked');
  }
}

function revealBombsWin() {
  bombs.forEach(b => {
    const el = cellEl(b);
    if (!el) return;
    el.classList.add('ghost-bomb', 'locked');
    el.textContent = '💣';
  });
}

/* ════════════════════════════════════════════════════════
   Game Flow
════════════════════════════════════════════════════════ */
function startGame() {
  const betVal = parseInt(document.getElementById('betInput').value, 10) || 0;
  if (betVal < 1 || betVal > balance) return;
  bet = betVal;

  balance -= bet;
  bombs = new Set();
  while (bombs.size < numMines) bombs.add(Math.floor(Math.random() * CELLS));
  revealed  = new Set();
  safeCount = 0;
  gameState = 'playing';

  sounds.start();
  buildGrid(true);
  animateGridIn();
  updateUI();
}

function cashout() {
  if (gameState !== 'playing' || safeCount === 0) return;
  const mult   = calcMult(safeCount);
  const total  = Math.floor(bet * mult);
  const profit = total - bet;
  balance += total;

  sounds.cashout();
  spawnConfetti();
  flashScreen('gold');
  flashBalance('win');
  revealBombsWin();
  endRound('win', { total, profit, mult, picks: safeCount });
}

function endRound(result, data) {
  gameState = 'idle';
  if (result === 'lose') flashBalance('lose');
  updateUI();

  if (result === 'win') setTimeout(() => showDialog('win', data), 550);
  else                  setTimeout(() => showDialog('lose'), 700);
}

function handleAction() {
  if (gameState === 'idle')                           startGame();
  else if (gameState === 'playing' && safeCount > 0)  cashout();
}

/* ════════════════════════════════════════════════════════
   UI Update
════════════════════════════════════════════════════════ */
function updateUI() {
  document.getElementById('balAmt').textContent = fmt(balance);

  if (gameState === 'playing') {
    const m = calcMult(safeCount);
    const v = Math.floor(bet * m);
    document.getElementById('sMult').textContent = m.toFixed(2) + '×';
    document.getElementById('sMult').className   = 'stat-val c-gold';
    document.getElementById('sWin').textContent  = safeCount ? fmt(v) + ' 🪙' : '—';
    document.getElementById('sSafe').textContent = safeCount + ' / ' + (CELLS - numMines);

    document.getElementById('multStrip').classList.remove('hidden');
    document.getElementById('nextMultVal').textContent =
      safeCount < CELLS - numMines ? calcMult(safeCount + 1).toFixed(2) + '×' : '—';
    document.getElementById('maxMultVal').textContent = maxMult().toFixed(2) + '×';
  } else {
    document.getElementById('sMult').textContent = '—';
    document.getElementById('sMult').className   = 'stat-val c-muted';
    document.getElementById('sWin').textContent  = '—';
    document.getElementById('sSafe').textContent = '0 / ' + (CELLS - numMines);
    document.getElementById('multStrip').classList.add('hidden');
  }

  const pct = Math.min(100, (balance / GOAL) * 100);
  document.getElementById('goalFill').style.width = pct.toFixed(3) + '%';
  document.getElementById('goalPct').textContent  = fmtPct(pct);

  updateBtn();
  updateControls();
}

function updateBtn() {
  const btn = document.getElementById('actionBtn');
  if (gameState === 'idle') {
    btn.className   = 'action-btn play';
    btn.textContent = '🚀  GIOCA';
    btn.disabled    = bet < 1 || bet > balance || balance < 1;
    btn.onclick     = handleAction;
  } else if (safeCount === 0) {
    btn.className   = 'action-btn wait';
    btn.textContent = '🎯  Scegli una casella…';
    btn.disabled    = true;
    btn.onclick     = null;
  } else {
    const val = Math.floor(bet * calcMult(safeCount));
    btn.className = 'action-btn cashout';
    btn.innerHTML = '💰  CASHOUT &nbsp;·&nbsp; ' + fmt(val) + ' 🪙';
    btn.disabled  = false;
    btn.onclick   = cashout;
  }
}

function updateControls() {
  const playing = gameState === 'playing';
  document.getElementById('betInput').disabled  = playing;
  document.getElementById('btnHalf').disabled   = playing;
  document.getElementById('btnDouble').disabled = playing;
  document.getElementById('btnMax').disabled    = playing;
  document.querySelectorAll('.mine-chip').forEach(c => { c.disabled = playing; });
}

/* ════════════════════════════════════════════════════════
   Bet Helpers
════════════════════════════════════════════════════════ */
function adjustBet(factor) {
  sounds.tick();
  const input = document.getElementById('betInput');
  let v = Math.round((parseInt(input.value, 10) || bet) * factor);
  v = Math.max(1, Math.min(balance, v));
  bet = v;
  input.value = v;
  updateBtn();
}

function betMax() {
  sounds.tick();
  bet = balance;
  document.getElementById('betInput').value = bet;
  updateBtn();
}

document.getElementById('betInput').addEventListener('input', function () {
  let v = parseInt(this.value, 10);
  if (isNaN(v) || v < 1) v = 1;
  if (v > balance) v = balance;
  bet = v;
  updateBtn();
});

/* ════════════════════════════════════════════════════════
   Mine Selector
════════════════════════════════════════════════════════ */
function buildMineSelector() {
  const g = document.getElementById('mineGrid');
  g.innerHTML = '';
  for (let n = 1; n <= 10; n++) {
    const btn = document.createElement('button');
    btn.className   = 'mine-chip' + (n === numMines ? ' active' : '');
    btn.textContent = n;
    btn.onclick = () => selectMines(n, btn);
    g.appendChild(btn);
  }
}

function selectMines(n, btn) {
  if (gameState === 'playing') return;
  sounds.tick();
  numMines = n;
  document.getElementById('mineLabel').textContent = n;
  document.querySelectorAll('.mine-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('sSafe').textContent = '0 / ' + (CELLS - n);
  updateBtn();
}

/* ════════════════════════════════════════════════════════
   Dialog
════════════════════════════════════════════════════════ */
function showDialog(type, data) {
  const icon  = document.getElementById('dlgIcon');
  const title = document.getElementById('dlgTitle');
  const amt   = document.getElementById('dlgAmt');
  const picks = document.getElementById('dlgPicks');
  const sub   = document.getElementById('dlgSub');
  const btn   = document.getElementById('dlgBtn');
  picks.innerHTML = '';

  if (type === 'win') {
    icon.textContent  = '💎';
    title.textContent = 'HAI VINTO!';
    title.className   = 'dlg-title win';
    amt.textContent   = '+' + fmt(data.profit) + ' 🪙';
    amt.className     = 'dlg-amount win';
    for (let k = 1; k <= data.picks; k++) {
      const chip = document.createElement('span');
      chip.className   = 'dlg-pick';
      chip.textContent = calcMult(k).toFixed(2) + '×';
      picks.appendChild(chip);
    }
    sub.textContent = 'Moltiplicatore finale: ' + data.mult.toFixed(2) + '×  •  Totale: ' + fmt(data.total) + ' 🪙';
    btn.textContent = 'Continua →';
    btn.onclick     = () => { closeOverlay(); checkPostRound(); };

  } else if (type === 'lose') {
    icon.textContent  = '💥';
    title.textContent = 'BOOM!';
    title.className   = 'dlg-title lose';
    amt.textContent   = '−' + fmt(bet) + ' 🪙';
    amt.className     = 'dlg-amount lose';
    sub.textContent   = safeCount > 0
      ? 'Eri arrivato a ' + calcMult(safeCount).toFixed(2) + '×. Quasi!'
      : 'Nessuna fortuna. Ritenta!';
    btn.textContent = 'Riprova →';
    btn.onclick     = () => { closeOverlay(); checkPostRound(); };

  } else if (type === 'goal') {
    sounds.fanfare();
    spawnConfetti(80);
    icon.textContent  = '🏆';
    title.textContent = 'OBIETTIVO!';
    title.className   = 'dlg-title goal';
    amt.textContent   = '1.000.000 🪙';
    amt.className     = 'dlg-amount goal';
    sub.innerHTML     = 'Incredibile!<br>Hai raggiunto il <strong>milione</strong>.<br>Sei un vero campione! 🎉';
    btn.textContent   = 'Celebra! 🎉';
    btn.onclick       = closeOverlay;

  } else if (type === 'bankrupt') {
    icon.textContent  = '💸';
    title.textContent = 'FALLITO!';
    title.className   = 'dlg-title lose';
    amt.textContent   = '0 🪙';
    amt.className     = 'dlg-amount lose';
    sub.textContent   = 'Hai perso tutto. Riparti con 1.000 crediti.';
    btn.textContent   = 'Ricomincia →';
    btn.onclick       = () => {
      balance = 1000; bet = 50;
      document.getElementById('betInput').value = 50;
      closeOverlay(); updateUI();
    };
  }

  document.getElementById('overlay').classList.remove('hidden');
}

function closeOverlay() {
  document.getElementById('overlay').classList.add('hidden');
  updateUI();
}

function checkPostRound() {
  if (balance >= GOAL) { setTimeout(() => showDialog('goal'),    300); return; }
  if (balance < 1)     { setTimeout(() => showDialog('bankrupt'), 300); }
}

/* ════════════════════════════════════════════════════════
   Formatters
════════════════════════════════════════════════════════ */
function fmt(n) { return Math.floor(n).toLocaleString('it-IT'); }

function fmtPct(p) {
  if (p < 0.01) return '< 0,01%';
  return p.toFixed(p < 1 ? 2 : 1).replace('.', ',') + '%';
}

/* ════════════════════════════════════════════════════════
   Boot
════════════════════════════════════════════════════════ */
buildGrid(false);
animateGridIn();
buildMineSelector();
updateUI();
