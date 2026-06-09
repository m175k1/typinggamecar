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

let quote = '';
let typed = '';
let startTime = null;
let timerInterval = null;
let running = false;
let finished = false;

const qDisplay = document.getElementById('quote-display');
const inp = document.getElementById('typeinput');
const wpmEl = document.getElementById('wpm');
const accEl = document.getElementById('acc');
const timerEl = document.getElementById('timer');
const carEl = document.getElementById('car');
const banner = document.getElementById('result-banner');
const resultTitle = document.getElementById('result-title');
const resultDetail = document.getElementById('result-detail');
const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');
const diffSel = document.getElementById('diff');

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

function calcAcc() {
  if (!typed.length) return '—';
  let correct = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === quote[i]) correct++;
  }
  return Math.round((correct / typed.length) * 100) + '%';
}

function moveCar() {
  const pct = Math.min(typed.length / quote.length, 1);
  const trackW = carEl.parentElement.clientWidth;
  const maxLeft = trackW - 48;
  carEl.style.left = Math.round(10 + pct * (maxLeft - 10)) + 'px';
}

function start() {
  quote = pickQuote();
  typed = '';
  startTime = null;
  finished = false;
  banner.classList.add('hidden');
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
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const wpm = calcWPM();
  const acc = calcAcc();
  wpmEl.textContent = wpm;
  accEl.textContent = acc;
  timerEl.textContent = elapsed + 's';
  carEl.style.left = (carEl.parentElement.clientWidth - 38) + 'px';
  resultTitle.textContent = 'Race complete!';
  resultDetail.textContent = `You typed ${wpm} WPM with ${acc} accuracy in ${elapsed}s.`;
  banner.classList.remove('hidden');
  btnStart.disabled = false;
  diffSel.disabled = false;
}

function reset() {
  clearInterval(timerInterval);
  running = false;
  finished = false;
  quote = '';
  typed = '';
  startTime = null;
  inp.value = '';
  inp.disabled = true;
  wpmEl.textContent = '0';
  accEl.textContent = '—';
  timerEl.textContent = '0s';
  carEl.style.left = '10px';
  banner.classList.add('hidden');
  btnStart.disabled = false;
  diffSel.disabled = false;
  qDisplay.innerHTML = '<span class="hint">Press Start to load a quote...</span>';
}

inp.addEventListener('input', () => {
  if (!running || finished) return;
  if (!startTime) {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      const s = ((Date.now() - startTime) / 1000).toFixed(1);
      timerEl.textContent = s + 's';
      wpmEl.textContent = calcWPM();
      accEl.textContent = calcAcc();
    }, 200);
  }
  typed = inp.value;
  if (typed.length > quote.length) typed = typed.slice(0, quote.length);
  inp.value = typed;
  renderQuote();
  moveCar();
  if (typed === quote) finish();
});

inp.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') e.preventDefault();
});

btnStart.addEventListener('click', start);
btnReset.addEventListener('click', reset);

reset();
