import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmCkBwxbNpQVLmikHyf2s6XwRyKhs2WLU",
  authDomain: "typinggamecar.firebaseapp.com",
  projectId: "typinggamecar",
  storageBucket: "typinggamecar.firebasestorage.app",
  messagingSenderId: "135600518003",
  appId: "1:135600518003:web:8ac8ffdafc1e323d634b06"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const QUOTES = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "To be or not to be that is the question.",
    "All that glitters is not gold.",
    "A journey of a thousand miles begins with a single step.",
    "Keep it simple and do not overthink things."
  ],
  medium: [
    "The only way to do great work is to love what you do and never stop learning.",
    "In the middle of every difficulty lies opportunity worth pursuing.",
    "Success is not final and failure is not fatal it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It does not matter how slowly you go as long as you do not stop moving forward."
  ],
  hard: [
    "Entrepreneurship is living a few years of your life like most people won't so that you can spend the rest of your life like most people can't.",
    "The difference between ordinary and extraordinary is that little extra effort and dedication you put into everything you do every single day.",
    "Twenty years from now you will be more disappointed by the things you did not do than by the ones you did so throw off the bowlines.",
    "The mind is not a vessel to be filled but a fire to be kindled and it is through curiosity that we ignite that eternal flame of learning.",
    "Perfection is not attainable but if we chase perfection we can catch excellence and that pursuit shapes us into who we are meant to become."
  ]
};

let quote = '', typed = '', startTime = null, timerInterval = null, running = false, finished = false;
let lastWPM = 0, lastAcc = 0, lastTime = 0;

const qDisplay     = document.getElementById('quote-display');
const inp          = document.getElementById('typeinput');
const wpmEl        = document.getElementById('wpm');
const accEl        = document.getElementById('acc');
const timerEl      = document.getElementById('timer');
const carEl        = document.getElementById('car');
const banner       = document.getElementById('result-banner');
const resultTitle  = document.getElementById('result-title');
const resultDetail = document.getElementById('result-detail');
const saveStatus   = document.getElementById('save-status');
const btnStart     = document.getElementById('btn-start');
const btnReset     = document.getElementById('btn-reset');
const btnSave      = document.getElementById('btn-save');
const diffSel      = document.getElementById('diff');
const lbDiff       = document.getElementById('lb-diff');
const usernameInput= document.getElementById('username-input');
const leaderboardEl= document.getElementById('leaderboard');

function pickQuote() {
  const pool = QUOTES[diffSel.value];
  return pool[Math.floor(Math.random() * pool.length)];
}

function renderQuote() {
  let html = '';
  for (let i = 0; i < quote.length; i++) {
    if (i < typed.length) {
      const ok = typed[i] === quote[i];
      const ch = quote[i] === ' ' && !ok ? '_' : quote[i];
      html += `<span class="${ok ? 'correct' : 'wrong'}">${ch}</span>`;
    } else if (i === typed.length) {
      html += `<span class="cursor pending">${quote[i]}</span>`;
    } else {
      html += `<span class="pending">${quote[i]}</span>`;
    }
  }
  qDisplay.innerHTML = html;
}

function calcWPM() {
  if (!startTime) return 0;
  const mins = (Date.now() - startTime) / 60000;
  const words = typed.trim().split(/\s+/).filter(w => w).length;
  return mins > 0 ? Math.round(words / mins) : 0;
}

function calcAccNum() {
  if (!typed.length) return 0;
  let correct = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === quote[i]) correct++;
  return Math.round((correct / typed.length) * 100);
}

function moveCar() {
  const pct = Math.min(typed.length / quote.length, 1);
  const trackW = carEl.parentElement.clientWidth;
  carEl.style.left = Math.round(10 + pct * (trackW - 48 - 10)) + 'px';
}

function setStatus(msg, type) {
  saveStatus.textContent = msg;
  saveStatus.className = 'save-status ' + (type || '');
  saveStatus.style.display = msg ? 'block' : 'none';
}

function start() {
  quote = pickQuote();
  typed = '';
  startTime = null;
  finished = false;
  banner.classList.add('hidden');
  setStatus('');
  wpmEl.textContent = '0';
  accEl.textContent = '—';
  timerEl.textContent = '0s';
  carEl.style.left = '10px';
  inp.value = '';
  inp.disabled = false;
  inp.focus();
  running = true;
  btnStart.disabled = true;
  diffSel.disabled = true;
  clearInterval(timerInterval);
  renderQuote();
}

function finish() {
  running = false;
  finished = true;
  inp.disabled = true;
  clearInterval(timerInterval);
  lastTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));
  lastWPM = calcWPM();
  lastAcc = calcAccNum();
  wpmEl.textContent = lastWPM;
  accEl.textContent = lastAcc + '%';
  timerEl.textContent = lastTime + 's';
  carEl.style.left = (carEl.parentElement.clientWidth - 38) + 'px';
  resultTitle.textContent = 'Race complete! 🏁';
  resultDetail.textContent = `You typed ${lastWPM} WPM with ${lastAcc}% accuracy in ${lastTime}s.`;
  banner.classList.remove('hidden');
  btnSave.disabled = false;
  btnStart.disabled = false;
  diffSel.disabled = false;
}

function reset() {
  clearInterval(timerInterval);
  running = false; finished = false;
  quote = ''; typed = ''; startTime = null;
  inp.value = ''; inp.disabled = true;
  wpmEl.textContent = '0'; accEl.textContent = '—'; timerEl.textContent = '0s';
  carEl.style.left = '10px';
  banner.classList.add('hidden');
  setStatus('');
  btnStart.disabled = false; diffSel.disabled = false;
  qDisplay.innerHTML = '<span class="hint">Press Start to load a quote...</span>';
}

async function saveScore() {
  const name = usernameInput.value.trim();
  if (!name) {
    setStatus('⚠ Please enter your name before saving.', 'status-warn');
    usernameInput.focus();
    return;
  }
  btnSave.disabled = true;
  setStatus('Saving your score...', 'status-info');
  try {
    await addDoc(collection(db, 'scores'), {
      username: name,
      wpm: lastWPM,
      accuracy: lastAcc,
      time: lastTime,
      difficulty: diffSel.value,
      createdAt: serverTimestamp()
    });
    setStatus('✓ Score saved! Check the leaderboard below.', 'status-ok');
    usernameInput.value = '';
    loadLeaderboard();
  } catch (e) {
    setStatus('✗ Failed to save: ' + (e.message || 'Unknown error. Check your Firestore rules.'), 'status-err');
    btnSave.disabled = false;
    console.error(e);
  }
}

async function loadLeaderboard() {
  leaderboardEl.innerHTML = '<p class="lb-state">Loading scores...</p>';
  try {
    const snap = await getDocs(query(collection(db, 'scores'), orderBy('wpm', 'desc'), limit(50)));
    if (snap.empty) {
      leaderboardEl.innerHTML = '<p class="lb-state">No scores yet — be the first!</p>';
      return;
    }

    let rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    const filter = lbDiff.value;
    if (filter !== 'all') rows = rows.filter(r => r.difficulty === filter);
    rows = rows.slice(0, 10);

    if (rows.length === 0) {
      leaderboardEl.innerHTML = '<p class="lb-state">No scores for this difficulty yet.</p>';
      return;
    }

    const medals = ['🥇', '🥈', '🥉'];
    const rankClass = ['gold', 'silver', 'bronze'];
    let html = `<table class="lb-table">
      <thead><tr>
        <th>#</th><th>Name</th><th>Mode</th><th>Acc</th><th>Time</th><th>WPM</th>
      </tr></thead><tbody>`;
    rows.forEach((d, i) => {
      const rank = i < 3 ? medals[i] : (i + 1);
      const rc = i < 3 ? rankClass[i] : '';
      html += `<tr>
        <td class="rank ${rc}">${rank}</td>
        <td class="name">${escapeHtml(d.username)}</td>
        <td><span class="diff-badge diff-${d.difficulty}">${d.difficulty}</span></td>
        <td>${d.accuracy}%</td>
        <td>${d.time}s</td>
        <td class="wpm-cell">${d.wpm}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    leaderboardEl.innerHTML = html;
  } catch (e) {
    leaderboardEl.innerHTML = `<p class="lb-state lb-err">⚠ Could not load scores: ${e.message}</p>`;
    console.error(e);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

inp.addEventListener('input', () => {
  if (!running || finished) return;
  if (!startTime) {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      timerEl.textContent = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
      wpmEl.textContent = calcWPM();
      accEl.textContent = calcAccNum() + '%';
    }, 200);
  }
  typed = inp.value;
  if (typed.length > quote.length) typed = typed.slice(0, quote.length);
  inp.value = typed;
  renderQuote();
  moveCar();
  if (typed === quote) finish();
});

inp.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
btnStart.addEventListener('click', start);
btnReset.addEventListener('click', reset);
btnSave.addEventListener('click', saveScore);
lbDiff.addEventListener('change', loadLeaderboard);

loadLeaderboard();
