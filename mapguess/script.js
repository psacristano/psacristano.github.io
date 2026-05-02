'use strict';

// ── Locations ────────────────────────────────────────────────────────────────
const LOCATIONS = [
  // Europe
  { lat: 48.8584, lng: 2.2945, label: 'Paris, France' },
  { lat: 51.5007, lng: -0.1246, label: 'London, UK' },
  { lat: 41.3851, lng: 2.1734, label: 'Barcelona, Spain' },
  { lat: 40.4168, lng: -3.7038, label: 'Madrid, Spain' },
  { lat: 37.3891, lng: -5.9845, label: 'Seville, Spain' },
  { lat: 48.2082, lng: 16.3738, label: 'Vienna, Austria' },
  { lat: 50.0755, lng: 14.4378, label: 'Prague, Czech Republic' },
  { lat: 52.2297, lng: 21.0122, label: 'Warsaw, Poland' },
  { lat: 50.0647, lng: 19.9450, label: 'Kraków, Poland' },
  { lat: 59.3293, lng: 18.0686, label: 'Stockholm, Sweden' },
  { lat: 59.9139, lng: 10.7522, label: 'Oslo, Norway' },
  { lat: 55.6761, lng: 12.5683, label: 'Copenhagen, Denmark' },
  { lat: 60.1699, lng: 24.9384, label: 'Helsinki, Finland' },
  { lat: 37.9838, lng: 23.7275, label: 'Athens, Greece' },
  { lat: 53.3498, lng: -6.2603, label: 'Dublin, Ireland' },
  { lat: 55.9533, lng: -3.1883, label: 'Edinburgh, Scotland' },
  { lat: 52.3676, lng: 4.9041, label: 'Amsterdam, Netherlands' },
  { lat: 50.8503, lng: 4.3517, label: 'Brussels, Belgium' },
  { lat: 51.2093, lng: 3.2247, label: 'Bruges, Belgium' },
  { lat: 41.9028, lng: 12.4964, label: 'Rome, Italy' },
  { lat: 43.7696, lng: 11.2558, label: 'Florence, Italy' },
  { lat: 45.4408, lng: 12.3155, label: 'Venice, Italy' },
  { lat: 45.4642, lng: 9.1900, label: 'Milan, Italy' },
  { lat: 52.5200, lng: 13.4050, label: 'Berlin, Germany' },
  { lat: 48.1351, lng: 11.5820, label: 'Munich, Germany' },
  { lat: 53.5753, lng: 10.0153, label: 'Hamburg, Germany' },
  { lat: 38.7169, lng: -9.1395, label: 'Lisbon, Portugal' },
  { lat: 41.1579, lng: -8.6291, label: 'Porto, Portugal' },
  { lat: 47.3769, lng: 8.5417, label: 'Zurich, Switzerland' },
  { lat: 46.2044, lng: 6.1432, label: 'Geneva, Switzerland' },
  { lat: 47.4979, lng: 19.0402, label: 'Budapest, Hungary' },
  { lat: 44.8176, lng: 20.4633, label: 'Belgrade, Serbia' },
  { lat: 42.6977, lng: 23.3219, label: 'Sofia, Bulgaria' },
  { lat: 44.4268, lng: 26.1025, label: 'Bucharest, Romania' },
  { lat: 46.0569, lng: 14.5058, label: 'Ljubljana, Slovenia' },
  { lat: 42.6507, lng: 18.0944, label: 'Dubrovnik, Croatia' },
  { lat: 59.4370, lng: 24.7536, label: 'Tallinn, Estonia' },
  { lat: 56.9460, lng: 24.1059, label: 'Riga, Latvia' },
  { lat: 54.6872, lng: 25.2797, label: 'Vilnius, Lithuania' },
  { lat: 64.1355, lng: -21.8954, label: 'Reykjavik, Iceland' },
  { lat: 43.2965, lng: 5.3698, label: 'Marseille, France' },
  { lat: 55.7558, lng: 37.6173, label: 'Moscow, Russia' },
  { lat: 59.9311, lng: 30.3609, label: 'St. Petersburg, Russia' },

  // Asia
  { lat: 35.6892, lng: 139.6920, label: 'Tokyo, Japan' },
  { lat: 35.0116, lng: 135.7681, label: 'Kyoto, Japan' },
  { lat: 34.6937, lng: 135.5023, label: 'Osaka, Japan' },
  { lat: 43.0618, lng: 141.3545, label: 'Sapporo, Japan' },
  { lat: 37.5665, lng: 126.9780, label: 'Seoul, South Korea' },
  { lat: 35.1796, lng: 129.0756, label: 'Busan, South Korea' },
  { lat: 1.3521, lng: 103.8198, label: 'Singapore' },
  { lat: 41.0082, lng: 28.9784, label: 'Istanbul, Turkey' },
  { lat: 39.9208, lng: 32.8541, label: 'Ankara, Turkey' },
  { lat: 25.2048, lng: 55.2708, label: 'Dubai, UAE' },
  { lat: 24.4539, lng: 54.3773, label: 'Abu Dhabi, UAE' },
  { lat: 28.6139, lng: 77.2090, label: 'New Delhi, India' },
  { lat: 19.0760, lng: 72.8777, label: 'Mumbai, India' },
  { lat: 12.9716, lng: 77.5946, label: 'Bengaluru, India' },
  { lat: 22.5726, lng: 88.3639, label: 'Kolkata, India' },
  { lat: 13.7563, lng: 100.5018, label: 'Bangkok, Thailand' },
  { lat: 18.7961, lng: 98.9922, label: 'Chiang Mai, Thailand' },
  { lat: 21.0278, lng: 105.8342, label: 'Hanoi, Vietnam' },
  { lat: 10.8231, lng: 106.6297, label: 'Ho Chi Minh City, Vietnam' },
  { lat: 11.5564, lng: 104.9282, label: 'Phnom Penh, Cambodia' },
  { lat: 3.1390, lng: 101.6869, label: 'Kuala Lumpur, Malaysia' },
  { lat: -8.3405, lng: 115.0920, label: 'Bali, Indonesia' },
  { lat: 22.3193, lng: 114.1694, label: 'Hong Kong' },
  { lat: 25.0330, lng: 121.5654, label: 'Taipei, Taiwan' },
  { lat: 41.2995, lng: 69.2401, label: 'Tashkent, Uzbekistan' },
  { lat: 39.9042, lng: 116.4074, label: 'Beijing, China' },
  { lat: 31.2304, lng: 121.4737, label: 'Shanghai, China' },
  { lat: 41.7151, lng: 44.8271, label: 'Tbilisi, Georgia' },
  { lat: 40.4093, lng: 49.8671, label: 'Baku, Azerbaijan' },

  // Americas
  { lat: 40.7484, lng: -73.9857, label: 'New York, USA' },
  { lat: 34.0522, lng: -118.2437, label: 'Los Angeles, USA' },
  { lat: 41.8781, lng: -87.6298, label: 'Chicago, USA' },
  { lat: 37.7749, lng: -122.4194, label: 'San Francisco, USA' },
  { lat: 25.7617, lng: -80.1918, label: 'Miami, USA' },
  { lat: 29.9511, lng: -90.0715, label: 'New Orleans, USA' },
  { lat: 36.1699, lng: -115.1398, label: 'Las Vegas, USA' },
  { lat: 47.6062, lng: -122.3321, label: 'Seattle, USA' },
  { lat: 42.3601, lng: -71.0589, label: 'Boston, USA' },
  { lat: 38.9072, lng: -77.0369, label: 'Washington D.C., USA' },
  { lat: 29.7604, lng: -95.3698, label: 'Houston, USA' },
  { lat: 19.4326, lng: -99.1332, label: 'Mexico City, Mexico' },
  { lat: 20.9674, lng: -89.6230, label: 'Mérida, Mexico' },
  { lat: 43.6532, lng: -79.3832, label: 'Toronto, Canada' },
  { lat: 45.5017, lng: -73.5673, label: 'Montreal, Canada' },
  { lat: 49.2827, lng: -123.1207, label: 'Vancouver, Canada' },
  { lat: 23.1136, lng: -82.3666, label: 'Havana, Cuba' },
  { lat: 18.4655, lng: -66.1057, label: 'San Juan, Puerto Rico' },
  { lat: 10.4806, lng: -66.9036, label: 'Caracas, Venezuela' },
  { lat: 4.7110, lng: -74.0721, label: 'Bogotá, Colombia' },
  { lat: 10.3910, lng: -75.4794, label: 'Cartagena, Colombia' },
  { lat: -0.2295, lng: -78.5243, label: 'Quito, Ecuador' },
  { lat: -12.0464, lng: -77.0428, label: 'Lima, Peru' },
  { lat: -13.5226, lng: -71.9674, label: 'Cusco, Peru' },
  { lat: -33.4489, lng: -70.6693, label: 'Santiago, Chile' },
  { lat: -34.6037, lng: -58.3816, label: 'Buenos Aires, Argentina' },
  { lat: -34.9011, lng: -56.1645, label: 'Montevideo, Uruguay' },
  { lat: -15.7942, lng: -47.8822, label: 'Brasília, Brazil' },
  { lat: -23.5505, lng: -46.6333, label: 'São Paulo, Brazil' },
  { lat: -22.9068, lng: -43.1729, label: 'Rio de Janeiro, Brazil' },
  { lat: -3.1190, lng: -60.0217, label: 'Manaus, Brazil' },

  // Africa
  { lat: 30.0444, lng: 31.2357, label: 'Cairo, Egypt' },
  { lat: 31.6295, lng: -7.9811, label: 'Marrakech, Morocco' },
  { lat: 33.5731, lng: -7.5898, label: 'Casablanca, Morocco' },
  { lat: 36.7372, lng: 3.0865, label: 'Algiers, Algeria' },
  { lat: 36.8065, lng: 10.1815, label: 'Tunis, Tunisia' },
  { lat: -26.2041, lng: 28.0473, label: 'Johannesburg, South Africa' },
  { lat: -33.9249, lng: 18.4241, label: 'Cape Town, South Africa' },
  { lat: -29.8587, lng: 31.0218, label: 'Durban, South Africa' },
  { lat: -1.2921, lng: 36.8219, label: 'Nairobi, Kenya' },
  { lat: 9.0320, lng: 38.7469, label: 'Addis Ababa, Ethiopia' },
  { lat: -6.7924, lng: 39.2083, label: 'Dar es Salaam, Tanzania' },
  { lat: 5.5600, lng: -0.1969, label: 'Accra, Ghana' },
  { lat: 14.7167, lng: -17.4677, label: 'Dakar, Senegal' },

  // Oceania
  { lat: -33.8568, lng: 151.2153, label: 'Sydney, Australia' },
  { lat: -37.8136, lng: 144.9631, label: 'Melbourne, Australia' },
  { lat: -27.4698, lng: 153.0251, label: 'Brisbane, Australia' },
  { lat: -31.9505, lng: 115.8605, label: 'Perth, Australia' },
  { lat: -36.8485, lng: 174.7633, label: 'Auckland, New Zealand' },
  { lat: -41.2865, lng: 174.7762, label: 'Wellington, New Zealand' },
  { lat: -45.0312, lng: 168.6626, label: 'Queenstown, New Zealand' },

  // Middle East
  { lat: 31.7683, lng: 35.2137, label: 'Jerusalem, Israel' },
  { lat: 32.0853, lng: 34.7818, label: 'Tel Aviv, Israel' },
  { lat: 31.9539, lng: 35.9106, label: 'Amman, Jordan' },
  { lat: 29.3759, lng: 47.9774, label: 'Kuwait City, Kuwait' },
  { lat: 23.5880, lng: 58.3829, label: 'Muscat, Oman' },
];

const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; OpenStreetMap contributors &copy; CARTO';

// ── Audio ─────────────────────────────────────────────────────────────────────
let _audioCtx = null;
function ac() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  // Resume in case browser suspended it before a gesture
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function playTick(urgent) {
  const ctx = ac();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = urgent ? 960 : 480;
  gain.gain.setValueAtTime(urgent ? 0.12 : 0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.07);
}

function playClick() {
  const ctx = ac();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = 680;
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
}

function playConfirm() {
  const ctx = ac();
  // Two-tone "thunk": high → low
  [[600, 0], [320, 0.08]].forEach(([freq, delay]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = ctx.currentTime + delay;
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.start(t); osc.stop(t + 0.15);
  });
}

function playTimerEnd() {
  const ctx = ac();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(0.22, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
  osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
}

function playResult(score) {
  const ctx = ac();
  // Good (score > 50): ascending C-E-G arpeggio; bad: descending G-E-C
  const notes = score > 50 ? [261, 329, 392] : [392, 329, 261];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.13;
    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.start(t); osc.stop(t + 0.23);
  });
}

// ── State ─────────────────────────────────────────────────────────────────────
let guessMap, resultMap;
let guessMarker = null, resultLayers = [];
let roundLocations = [];
let currentRound = 0;
let scores = [];
let timerInterval = null;
let secondsLeft = 30;
let guessLatLng = null;
let mapExpanded = false;

// ── Helpers ───────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function calcScore(distKm) {
  return Math.max(0, Math.round(100 * Math.exp(-distKm / 2000)));
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function svURL(lat, lng) {
  return `https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=11,0,0,0,0&output=svembed`;
}

// ── Timer ─────────────────────────────────────────────────────────────────────
function startTimer() {
  secondsLeft = 30;
  updateTimerDisplay();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsLeft--;
    updateTimerDisplay();
    playTick(secondsLeft <= 10);
    if (secondsLeft <= 0) endRound(true);
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('timer-val');
  el.textContent = secondsLeft;
  el.parentElement.classList.toggle('urgent', secondsLeft <= 10);
}

function stopTimer() { clearInterval(timerInterval); }

// ── Game flow ─────────────────────────────────────────────────────────────────
function startGame() {
  scores = [];
  currentRound = 0;
  roundLocations = shuffle(LOCATIONS).slice(0, 5);
  showScreen('screen-game');
  startRound();
}

function startRound() {
  guessLatLng = null;
  setMapExpanded(false);

  document.getElementById('round-num').textContent = currentRound + 1;
  document.getElementById('btn-confirm').disabled = true;

  const { lat, lng } = roundLocations[currentRound];
  document.getElementById('street-view-frame').src = svURL(lat, lng);

  if (guessMarker) { guessMap.removeLayer(guessMarker); guessMarker = null; }

  startTimer();
}

function endRound(timedOut = false) {
  stopTimer();
  if (timedOut) playTimerEnd();

  const loc = roundLocations[currentRound];
  const actual = { lat: loc.lat, lng: loc.lng };
  let distKm = Infinity, score = 0;
  if (guessLatLng) {
    distKm = haversineKm(actual, guessLatLng);
    score = calcScore(distKm);
  }
  scores.push(score);
  showResult(actual, guessLatLng, distKm, score, loc.label);
}

function showResult(actual, guess, distKm, score, label) {
  showScreen('screen-result');
  playResult(score);

  resultLayers.forEach(l => resultMap.removeLayer(l));
  resultLayers = [];

  const actualMarker = L.circleMarker([actual.lat, actual.lng], {
    radius: 9, color: '#fff', weight: 2, fillColor: '#4ade80', fillOpacity: 1,
  }).addTo(resultMap);
  resultLayers.push(actualMarker);

  if (guess) {
    const guessM = L.circleMarker([guess.lat, guess.lng], {
      radius: 8, color: '#fff', weight: 2, fillColor: '#f87171', fillOpacity: 1,
    }).addTo(resultMap);
    const line = L.polyline([[actual.lat, actual.lng], [guess.lat, guess.lng]], {
      color: '#facc15', weight: 2, opacity: .7,
    }).addTo(resultMap);
    resultLayers.push(guessM, line);
  }

  // invalidateSize first so fitBounds uses the real dimensions
  setTimeout(() => {
    resultMap.invalidateSize();
    if (guess) {
      const bounds = L.latLngBounds([[actual.lat, actual.lng], [guess.lat, guess.lng]]);
      resultMap.fitBounds(bounds, { padding: [50, 50] });
    } else {
      resultMap.setView([actual.lat, actual.lng], 5);
    }
  }, 60);

  document.getElementById('result-label').textContent = label;
  document.getElementById('result-distance').textContent =
    guess ? `${Math.round(distKm).toLocaleString()} km away` : 'No guess — 0 points';
  document.getElementById('result-score-display').textContent = `${score} pts`;
  document.getElementById('btn-next').textContent =
    currentRound === 4 ? 'See Final Score' : 'Next Round';
}

function nextRound() {
  currentRound++;
  if (currentRound >= 5) {
    showFinal();
  } else {
    showScreen('screen-game');
    startRound();
  }
}

function showFinal() {
  showScreen('screen-final');
  const list = document.getElementById('final-scores-list');
  list.innerHTML = '';
  scores.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'score-row';
    row.innerHTML = `<span>Round ${i + 1} — ${roundLocations[i].label}</span><span>${s}</span>`;
    list.appendChild(row);
  });
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  document.getElementById('final-avg').innerHTML = `${avg}<small>/ 100 average</small>`;
}

// ── Map expand/collapse ───────────────────────────────────────────────────────
function setMapExpanded(expand) {
  mapExpanded = expand;
  document.getElementById('guess-panel').classList.toggle('collapsed', !expand);
  document.getElementById('toggle-icon').textContent = expand ? '✕' : '🗺';
  if (expand) setTimeout(() => guessMap.invalidateSize(), 260);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Guess map
  guessMap = L.map('guess-map', { center: [20, 0], zoom: 2, zoomControl: true });
  L.tileLayer(LIGHT_TILES, { attribution: TILE_ATTR, maxZoom: 18 }).addTo(guessMap);
  guessMap.on('click', e => {
    if (guessMarker) guessMap.removeLayer(guessMarker);
    guessMarker = L.circleMarker(e.latlng, {
      radius: 8, color: '#fff', weight: 2, fillColor: '#f87171', fillOpacity: 1,
    }).addTo(guessMap);
    guessLatLng = { lat: e.latlng.lat, lng: e.latlng.lng };
    document.getElementById('btn-confirm').disabled = false;
    playClick();
  });

  // Result map
  resultMap = L.map('result-map', { center: [20, 0], zoom: 2, zoomControl: false });
  L.tileLayer(LIGHT_TILES, { attribution: TILE_ATTR, maxZoom: 18 }).addTo(resultMap);

  // Buttons — each initialises the AudioContext on first gesture and plays a click
  document.getElementById('btn-start').addEventListener('click', () => {
    playClick(); startGame();
  });
  document.getElementById('btn-toggle-map').addEventListener('click', () => {
    playClick(); setMapExpanded(!mapExpanded);
  });
  document.getElementById('btn-confirm').addEventListener('click', () => {
    stopTimer();
    playConfirm();
    setMapExpanded(false);
    endRound(false);
  });
  document.getElementById('btn-next').addEventListener('click', () => {
    playClick(); nextRound();
  });
  document.getElementById('btn-play-again').addEventListener('click', () => {
    playClick(); startGame();
  });
});
