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
    "Keep it simple and do not overthink things.",
    "Actions speak louder than words.",
    "Every day is a new beginning.",
    "Believe you can and you are halfway there.",
    "Practice makes perfect.",
    "Slow and steady wins the race.",
    "Better late than never.",
    "Where there is a will there is a way.",
    "Time flies when you are having fun.",
    "Every cloud has a silver lining.",
    "Honesty is the best policy.",
    "Look before you leap.",
    "Two heads are better than one.",
    "The early bird catches the worm.",
    "A picture is worth a thousand words.",
    "No pain no gain.",
    "You only live once so make it count.",
    "Dream big and dare to fail.",
    "Kind words cost nothing but mean everything.",
    "Learn from yesterday and live for today.",
    "A smile is the best makeup anyone can wear.",
    "Hard work beats talent when talent does not work hard.",
    "Do what you love and love what you do.",
    "Be the change you wish to see in the world.",
    "Life is short so make every moment count.",
    "You are never too old to learn something new.",
    "The best time to plant a tree was twenty years ago.",
    "Happiness is not something ready made it comes from your actions.",
    "The only limit is your imagination.",
    "Stars cannot shine without darkness.",
    "Every expert was once a beginner.",
    "Focus on the journey not the destination.",
    "Small steps lead to big changes.",
    "Courage is not the absence of fear but action despite it.",
    "Success starts with a single decision.",
    "Wake up with purpose and go to bed with pride.",
    "You miss every shot you do not take.",
    "The harder you work the luckier you get.",
    "Great things never come from comfort zones.",
    "Push yourself because no one else will do it for you.",
    "Your attitude determines your direction.",
    "Do something today that your future self will thank you for.",
    "It always seems impossible until it is done.",
    "Strive for progress not perfection.",
    "The secret to getting ahead is getting started.",
    "Work hard in silence and let your success be the noise."
  ],
  medium: [
    "The only way to do great work is to love what you do and never stop learning.",
    "In the middle of every difficulty lies opportunity worth pursuing.",
    "Success is not final and failure is not fatal it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It does not matter how slowly you go as long as you do not stop moving forward.",
    "You have to be odd to be number one in whatever you choose to pursue.",
    "Believe in yourself and all that you are and know that there is something inside you greater than any obstacle.",
    "The only person you are destined to become is the person you decide to be today.",
    "Life is not measured by the number of breaths we take but by the moments that take our breath away.",
    "In order to succeed we must first believe that we can accomplish what we set out to do.",
    "Do not wait for the perfect moment take the moment and make it perfect.",
    "The most common way people give up their power is by thinking they do not have any.",
    "You become what you believe not what you think or what you want but what you truly believe.",
    "The question is not who is going to let me but who is going to stop me from reaching my goals.",
    "Everything you have ever wanted is on the other side of fear and hesitation.",
    "It is not the mountain we conquer but ourselves and our own self-imposed limitations.",
    "Success usually comes to those who are too busy to be looking for it in the wrong places.",
    "The only source of knowledge is experience gained through hard work and dedication.",
    "I find that the harder I work the more luck I seem to have in life and business.",
    "Success is walking from failure to failure with no loss of enthusiasm or passion.",
    "If you are not willing to risk the usual you will have to settle for the ordinary life.",
    "The way to get started is to quit talking and begin doing what you know must be done.",
    "Opportunities do not happen you create them through consistent effort and determination.",
    "The pessimist sees difficulty in every opportunity while the optimist sees opportunity in every difficulty.",
    "Do not judge each day by the harvest you reap but by the seeds that you plant throughout it.",
    "Once you choose hope anything and everything is possible if you put your mind to it.",
    "You do not have to be great to start but you have to start to be great in your field.",
    "The secret of success is to do the common thing uncommonly well in all situations.",
    "Try not to become a person of success but rather try to become a person of great value.",
    "The road to success and the road to failure are almost exactly the same path taken differently.",
    "Character consists of what you do on the third and fourth tries when things get tough.",
    "If you can dream it you can achieve it through hard work and consistent daily effort.",
    "Success is not in what you have but who you are and how you treat the people around you.",
    "The mind is everything and what you think you become over time through your daily actions.",
    "Either write something worth reading or do something worth writing and sharing with others.",
    "Innovation distinguishes between a leader and a follower in any competitive environment.",
    "Your time is limited so do not waste it living someone else's life on their terms.",
    "The people who are crazy enough to think they can change the world are the ones who do.",
    "I have not failed I have just found ten thousand ways that do not work and keep going.",
    "Whether you think you can or you think you cannot you are absolutely right in both cases.",
    "A person who never made a mistake never tried anything new or challenging in their life.",
    "Everything should be made as simple as possible but not simpler than it needs to be.",
    "Two things are infinite the universe and human stupidity and I am not sure about the universe.",
    "Life is like riding a bicycle to keep your balance you must keep moving forward every day.",
    "The value of a man should be seen in what he gives and not in what he is able to receive.",
    "Anyone who has never made a mistake has never tried anything new worth doing in life.",
    "Imagination is more important than knowledge for knowledge is limited but imagination encircles the world.",
    "We cannot solve our problems with the same thinking we used when we created those problems.",
    "Logic will get you from A to B but imagination will take you everywhere you want to go.",
    "The world as we have created it is a process of our thinking and it cannot be changed without changing our thinking."
  ],
  hard: [
    "Entrepreneurship is living a few years of your life like most people won't so that you can spend the rest of your life like most people can't.",
    "The difference between ordinary and extraordinary is that little extra effort and dedication you put into everything you do every single day.",
    "Twenty years from now you will be more disappointed by the things you did not do than by the ones you did so throw off the bowlines.",
    "The mind is not a vessel to be filled but a fire to be kindled and it is through curiosity that we ignite that eternal flame of learning.",
    "Perfection is not attainable but if we chase perfection we can catch excellence and that pursuit shapes us into who we are meant to become.",
    "The greatest discovery of all time is that a person can change their future by merely changing their attitude and their daily habits.",
    "Success is not just about making money it is about making a difference in the lives of the people around you and in society as a whole.",
    "We are what we repeatedly do therefore excellence is not an act it is a habit that we cultivate through consistent and intentional practice over time.",
    "The brick walls are there for a reason they are not there to keep us out they are there to give us a chance to show how badly we want something.",
    "You cannot connect the dots looking forward you can only connect them looking backwards so you have to trust that the dots will somehow connect in your future.",
    "It is not the critic who counts not the man who points out how the strong man stumbles or where the doer of deeds could have done them better.",
    "The most difficult thing is the decision to act the rest is merely tenacity and the fears are paper tigers that dissolve when you face them with courage.",
    "There is only one way to avoid criticism do nothing say nothing and be nothing which is the worst possible outcome for a life full of potential.",
    "The successful warrior is the average man with laser-like focus who maintains his discipline even when motivation fades and circumstances become difficult.",
    "Definiteness of purpose is the starting point of all achievement and without a burning desire backed by faith nothing of importance was ever accomplished.",
    "Do not go where the path may lead instead go where there is no path and leave a trail for others to follow into the future with courage.",
    "Few things can help an individual more than to place responsibility on them and to let them know that you trust and believe in their abilities completely.",
    "Thousands of candles can be lighted from a single candle and the life of the candle will not be shortened because happiness never decreases by being shared.",
    "I alone cannot change the world but I can cast a stone across the waters to create many ripples that will eventually reach every shore and inspire others.",
    "Life is not about finding yourself it is about creating yourself through the choices you make the actions you take and the values you choose to live by.",
    "The two most important days in your life are the day you are born and the day you find out why you were put on this earth to do something meaningful.",
    "Security is mostly a superstition it does not exist in nature nor do the children of men as a whole experience it and avoiding danger is no safer in the long run.",
    "In twenty years time you are going to regret the things that you did not do far more than the things that you did so take risks and seize every opportunity.",
    "It is hard to fail but it is worse never to have tried to succeed because those who never try never know what they are truly capable of achieving in this life.",
    "The most beautiful people we have known are those who have known defeat known suffering known struggle known loss and have found their way out of the depths.",
    "Nothing in the world can take the place of persistence because talent will not unrecognized talent is almost a cliché and education will not as the world is full of educated derelicts.",
    "Many of life's failures are people who did not realize how close they were to success when they gave up and walked away from their dreams and goals.",
    "You have enemies Good that means you stood up for something sometime in your life and refused to back down when the pressure to conform became overwhelming.",
    "If you look at what you have in life you will always have more but if you look at what you do not have in life you will never have enough to be happy.",
    "Remember that not getting what you want is sometimes a wonderful stroke of luck because the universe may have something far greater in store for you.",
    "You can have everything in life you want if you will just help enough other people get what they want and need in their own lives and pursuits.",
    "Our greatest weakness lies in giving up and the most certain way to succeed is always to try just one more time before walking away from our dreams.",
    "It does not matter what you are thinking it only matters what you are doing consistently every day because action is the foundational key to all success.",
    "Start where you are use what you have and do what you can because greatness is not determined by the resources you have but by the resourcefulness you show.",
    "Life is ten percent what happens to you and ninety percent how you respond to what happens because attitude determines the altitude you reach in life.",
    "Successful people do what unsuccessful people are not willing to do and that is why we should not wish it were easier but that we were better and stronger.",
    "The secret of getting ahead is getting started and the secret of getting started is breaking your complex overwhelming tasks into small manageable tasks.",
    "People often say that motivation does not last and well neither does bathing which is precisely why it is recommended and expected on a daily basis.",
    "There is no elevator to success you have to take the stairs one step at a time and embrace the process because the climb is where growth happens.",
    "The difference between a successful person and others is not a lack of strength not a lack of knowledge but rather a lack of will and determination.",
    "I am not a product of my circumstances I am a product of my decisions and the choices I make every single day determine the trajectory of my entire life.",
    "You cannot plow a field by turning it over in your mind and thinking about it for too long at some point you must pick up the plow and start working.",
    "Motivation is what gets you started but habit and discipline are what keep you going long after the initial excitement and enthusiasm have faded away.",
    "Education is the most powerful weapon which you can use to change the world and transform your circumstances regardless of where you started in life.",
    "Real integrity is doing the right thing knowing that nobody is going to know whether you did it or not because character is revealed in private moments.",
    "The journey of a thousand miles begins with one step and every great accomplishment in history started with a single act of courage and determination.",
    "Excellence is not a singular act but a habit you are what you do repeatedly and it is the daily practice that separates the good from the truly great.",
    "In the confrontation between the stream and the rock the stream always wins not through strength but through persistence and unwavering commitment to its path.",
    "Knowing is not enough we must apply and willing is not enough we must do because knowledge without action is just wasted potential sitting on a shelf.",
    "The harder the conflict the more glorious the triumph and what we obtain too cheaply we esteem too lightly for it is dearness only that gives everything its proper value."
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
      <colgroup>
        <col/><col/><col/><col/><col/><col/>
      </colgroup>
      <thead><tr>
        <th>#</th><th>Name</th><th>Difficulty</th><th>Accuracy</th><th>Time</th><th>WPM</th>
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
