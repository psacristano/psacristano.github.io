// ─── Constants ────────────────────────────────────────────────
const GOAL = 1_000_000;
const START = 1_000;
const HOUSE = 0.03;
const MULT_K = 0.00055; // multiplier = e^(K * elapsedMs)
const COUNTDOWN_SEC = 8;

// ─── State ────────────────────────────────────────────────────
let balance = START;
let state = 'waiting'; // 'waiting' | 'flying' | 'crashed'
let crashPoint = 2;
let currentMult = 1;
let betPlaced = false;
let betAmt = 0;
let cashedOut = false;
let history = [];
let pathPts = [];
let flyStart = 0;
let raf = null;
let cdTimer = null;
let viewMaxMs = 10000;

// ─── Canvas ───────────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  const w = canvas.parentElement;
  canvas.width = w.clientWidth * devicePixelRatio;
  canvas.height = w.clientHeight * devicePixelRatio;
  canvas.style.width = w.clientWidth + 'px';
  canvas.style.height = w.clientHeight + 'px';
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
resize();
window.addEventListener('resize', () => { resize(); draw(); });

const W = () => canvas.parentElement.clientWidth;
const H = () => canvas.parentElement.clientHeight;

// ─── Crash Generation ─────────────────────────────────────────
function genCrash() {
  const r = Math.random();
  if (r < 0.01) return 1.00;
  return Math.min(Math.max((1 - HOUSE) / (1 - r), 1.00), 500);
}

// ─── Multiplier ───────────────────────────────────────────────
function multAtMs(ms) {
  return Math.exp(MULT_K * ms);
}

// ─── Canvas drawing ───────────────────────────────────────────
function multToXY(m, elapsed) {
  const w = W(), h = H();
  const ml = 8, mr = 24, mt = 16, mb = 18;
  const uw = w - ml - mr, uh = h - mt - mb;
  const x = ml + Math.min(elapsed / viewMaxMs, 1) * uw;
  const logM = Math.log(Math.max(m, 1)) / Math.log(Math.max(crashPoint * 1.2, 5));
  const y = (h - mb) - Math.min(logM, 1) * uh;
  return { x, y };
}

function draw() {
  const w = W(), h = H();
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = '#1a0d0e';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = w / 6; x < w; x += w / 6) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = h / 4; y < h; y += h / 4) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  if (pathPts.length < 2) {
    ctx.beginPath();
    ctx.arc(16, h - 18, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,120,64,0.5)';
    ctx.fill();
    return;
  }

  const crashed = state === 'crashed';
  const lineColor = crashed ? '#ff2d4a' : '#ff7840';
  const glowColor = crashed ? 'rgba(255,45,74,.5)' : 'rgba(255,120,64,.45)';

  const grad = ctx.createLinearGradient(0, h, 0, 0);
  grad.addColorStop(0, crashed ? 'rgba(255,45,74,0)' : 'rgba(255,120,64,0)');
  grad.addColorStop(1, crashed ? 'rgba(255,45,74,.14)' : 'rgba(255,120,64,.12)');
  ctx.beginPath();
  ctx.moveTo(pathPts[0].x, h);
  for (const p of pathPts) ctx.lineTo(p.x, p.y);
  const last = pathPts[pathPts.length - 1];
  ctx.lineTo(last.x, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.save();
  ctx.shadowBlur = 14;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(pathPts[0].x, pathPts[0].y);
  for (let i = 1; i < pathPts.length; i++) ctx.lineTo(pathPts[i].x, pathPts[i].y);
  ctx.stroke();
  ctx.restore();

  if (pathPts.length >= 2) {
    const tip = pathPts[pathPts.length - 1];
    const prev = pathPts[Math.max(0, pathPts.length - 3)];
    ctx.save();
    ctx.translate(tip.x, tip.y);
    if (state === 'flying') {
      const ang = Math.atan2(tip.y - prev.y, tip.x - prev.x);
      ctx.rotate(ang);
      ctx.font = '20px serif';
      ctx.fillText('✈', -10, 7);
    } else if (state === 'crashed') {
      ctx.font = '24px serif';
      ctx.fillText('💥', -12, 10);
    }
    ctx.restore();
  }
}

// ─── Flight loop ──────────────────────────────────────────────
function startFlight() {
  state = 'flying';
  pathPts = [];
  flyStart = performance.now();
  viewMaxMs = Math.max(Math.log(crashPoint) / MULT_K * 1.25, 8000);
  updateUI();
  let lastRiseTime = 0;

  function frame(now) {
    const elapsed = now - flyStart;
    currentMult = multAtMs(elapsed);

    if (document.getElementById('autoToggle').checked && betPlaced && !cashedOut) {
      const at = parseFloat(document.getElementById('autoCashVal').value) || 2;
      if (currentMult >= at) doCashOut();
    }

    if (currentMult >= crashPoint) {
      currentMult = crashPoint;
      pathPts.push(multToXY(currentMult, elapsed));
      state = 'crashed';
      draw();
      SFX.crash();
      onCrash();
      return;
    }

    // Throttle rise sound every 250ms
    if (elapsed - lastRiseTime > 250) {
      SFX.rise(currentMult);
      lastRiseTime = elapsed;
    }

    pathPts.push(multToXY(currentMult, elapsed));
    draw();
    updateMultDisplay();
    if (state === 'flying') raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);
}

function onCrash() {
  history.unshift(+crashPoint.toFixed(2));
  if (history.length > 20) history.pop();
  updateHistoryUI();
  updateMultDisplay();
  updateUI();

  betPlaced = false;
  cashedOut = false;
  setTimeout(startCountdown, 1400);
}

// ─── Countdown ────────────────────────────────────────────────
function startCountdown() {
  // Check if game is over
  if (balance <= 0) {
    setTimeout(() => {
      SFX.gameOver();
      show('gameOverOverlay');
    }, 600);
    return;
  }
  
  state = 'waiting';
  pathPts = [];
  let n = COUNTDOWN_SEC;
  document.getElementById('cdNum').textContent = n;
  document.getElementById('cdOverlay').classList.add('show');
  document.getElementById('multOverlay').style.visibility = 'hidden';
  updateUI();
  draw();

  cdTimer = setInterval(() => {
    n--;
    if (n <= 0) {
      clearInterval(cdTimer);
      
      // If no bet was placed, auto-place default bet and start flight
      if (!betPlaced) {
        const amt = parseInt(document.getElementById('betAmount').value, 10);
        if (amt && amt >= 1 && amt <= balance) {
          betAmt = amt;
          balance -= betAmt;
          betPlaced = true;
          cashedOut = false;
          updateBalanceUI();
        }
      }
      
      document.getElementById('cdOverlay').classList.remove('show');
      document.getElementById('multOverlay').style.visibility = '';
      crashPoint = genCrash();
      currentMult = 1;
      viewMaxMs = Math.max(Math.log(crashPoint) / MULT_K * 1.25, 8000);
      startFlight();
    } else {
      SFX.tick();
      document.getElementById('cdNum').textContent = n;
    }
  }, 1000);
}

// ─── Actions ──────────────────────────────────────────────────
function toggleMute() {
  const muted = SFX.toggleMute();
  const btn = document.getElementById('muteBtn');
  btn.textContent = muted ? '🔇' : '🔊';
  btn.classList.toggle('muted', muted);
}

function startGame() {
  document.getElementById('introOverlay').classList.remove('show');
  updateBalanceUI();
  draw();
  startCountdown();
}

function handleAction() {
  if (state === 'flying' && betPlaced && !cashedOut) {
    doCashOut();
  } else if (state === 'waiting' && !betPlaced) {
    doPlaceBet();
  }
}

function doPlaceBet() {
  const amt = parseInt(document.getElementById('betAmount').value, 10);
  if (!amt || amt < 1 || amt > balance) {
    shakeBet(); return;
  }
  betAmt = amt;
  balance -= betAmt;
  betPlaced = true;
  cashedOut = false;
  SFX.bet();
  updateBalanceUI();
  updateUI();
  
  // Start flight immediately (don't wait for countdown)
  clearInterval(cdTimer);
  document.getElementById('cdOverlay').classList.remove('show');
  document.getElementById('multOverlay').style.visibility = '';
  crashPoint = genCrash();
  currentMult = 1;
  viewMaxMs = Math.max(Math.log(crashPoint) / MULT_K * 1.25, 8000);
  startFlight();
}

function doCashOut() {
  if (!betPlaced || cashedOut) return;
  cashedOut = true;
  const win = Math.floor(betAmt * currentMult);
  balance += win;
  SFX.cashout();
  updateBalanceUI();
  showToast(`+${fmt(win)} CR  @  ${currentMult.toFixed(2)}×`);
  updateUI();
  if (balance >= GOAL) {
    setTimeout(() => {
      SFX.bigWin();
      show('winOverlay');
    }, 600);
  }
}

function shakeBet() {
  const el = document.getElementById('betAmount');
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 400);
}

function quickBet(frac) {
  const amt = Math.max(1, Math.floor(balance * frac));
  document.getElementById('betAmount').value = amt;
}

// ─── UI ───────────────────────────────────────────────────────
function updateUI() {
  const btn = document.getElementById('actionBtn');
  const betInput = document.getElementById('betAmount');

  if (state === 'flying') {
    betInput.disabled = true;
    if (betPlaced && !cashedOut) {
      btn.className = 'state-cashout';
      btn.textContent = 'INCASSA';
    } else {
      btn.className = 'state-wait';
      btn.textContent = cashedOut ? 'INCASSATO ✓' : 'IN VOLO...';
    }
  } else if (state === 'waiting') {
    betInput.disabled = false;
    if (betPlaced) {
      btn.className = 'state-wait';
      btn.textContent = 'PUNTATA PIAZZATA ✓';
    } else {
      btn.className = 'state-bet';
      btn.textContent = 'SCOMMETTI';
    }
  } else if (state === 'crashed') {
    betInput.disabled = true;
    btn.className = 'state-wait';
    btn.textContent = 'VOLO TERMINATO';
  }
}

function updateMultDisplay() {
  const val = document.getElementById('multValue');
  const sub = document.getElementById('multSub');
  val.textContent = currentMult.toFixed(2) + '×';

  if (state === 'flying') {
    val.className = 'mult-value flying';
    if (betPlaced && !cashedOut) {
      sub.textContent = `${fmt(betAmt)} → ${fmt(Math.floor(betAmt * currentMult))} CR`;
    } else if (cashedOut) {
      sub.textContent = 'Incassato ✓';
    } else {
      sub.textContent = 'Volo in corso...';
    }
  } else if (state === 'crashed') {
    val.className = 'mult-value crashed';
    sub.textContent = '💥 Crashed!';
  } else {
    val.className = 'mult-value waiting';
    sub.textContent = 'In attesa...';
  }
}

function updateBalanceUI() {
  document.getElementById('balanceDisplay').textContent = fmt(balance);
  const pct = Math.min(balance / GOAL * 100, 100);
  document.getElementById('progressFill').style.width = Math.max(pct, 0.05) + '%';
  const pctStr = pct < 0.01 ? '<0,01%' : (pct < 1
    ? pct.toFixed(2).replace('.', ',') + '%'
    : pct.toFixed(1).replace('.', ',') + '%');
  document.getElementById('progressPct').textContent = pctStr;
}

function updateHistoryUI() {
  document.getElementById('historyPills').innerHTML = history.map(cp => {
    const cls = cp < 1.5 ? 'low' : cp < 5 ? 'mid' : 'high';
    return `<span class="pill ${cls}">${cp.toFixed(2)}×</span>`;
  }).join('');
}

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

function show(id) {
  document.getElementById(id).classList.add('show');
}

function fmt(n) {
  return Math.floor(n).toLocaleString('it-IT');
}

// ─── Reset ────────────────────────────────────────────────────
function resetGame() {
  clearInterval(cdTimer);
  cancelAnimationFrame(raf);

  balance = START;
  state = 'waiting';
  betPlaced = false;
  cashedOut = false;
  currentMult = 1;
  pathPts = [];
  history = [];

  document.getElementById('gameOverOverlay').classList.remove('show');
  document.getElementById('winOverlay').classList.remove('show');
  document.getElementById('cdOverlay').classList.remove('show');
  document.getElementById('multOverlay').style.visibility = '';
  document.getElementById('betAmount').value = 50;
  document.getElementById('betAmount').disabled = false;
  document.getElementById('toast').classList.remove('show');

  updateBalanceUI();
  updateHistoryUI();
  updateMultDisplay();
  draw();
  startCountdown();
}

// ─── Init ─────────────────────────────────────────────────────
draw();
