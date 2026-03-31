// ═══════════════════════════════════════════
//  SUNNY STEPS — App Logic
// ═══════════════════════════════════════════

// ── State ──────────────────────────────────
let currentWorld   = null;
let currentQ       = 0;
let score          = 0;
let mode           = 'child';
let answered       = false;
let questionOrder  = [];
let bestScores     = JSON.parse(localStorage.getItem('sunnyStepsBest') || '{}');

// ── Helpers ────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Mode ────────────────────────────────────
function setMode(m) {
  mode = m;
  document.getElementById('mode-child').classList.toggle('active', m === 'child');
  document.getElementById('mode-guide').classList.toggle('active', m === 'guide');
}

// ── Home ────────────────────────────────────
function goHome() {
  showScreen('home');
  updateHomeStars();
}

function updateHomeStars() {
  Object.keys(WORLDS).forEach(wId => {
    const el = document.getElementById('stars-' + wId);
    if (!el) return;
    const best = bestScores[wId] || 0;
    const total = WORLDS[wId].questions.length;
    const pct = best / total;
    if (best === 0) { el.textContent = '☆☆☆'; return; }
    if (pct === 1)  { el.textContent = '⭐⭐⭐'; return; }
    if (pct >= 0.6) { el.textContent = '⭐⭐☆'; return; }
    el.textContent = '⭐☆☆';
  });
}

// ── Start world ─────────────────────────────
function startWorld(wId) {
  currentWorld  = wId;
  currentQ      = 0;
  score         = 0;
  answered      = false;
  questionOrder = shuffle([...Array(WORLDS[wId].questions.length).keys()]);
  showScreen('game');
  loadQuestion();
}

// ── Load question ───────────────────────────
function loadQuestion() {
  const world = WORLDS[currentWorld];
  const qIdx  = questionOrder[currentQ];
  const q     = world.questions[qIdx];
  const total = world.questions.length;

  // Header
  document.getElementById('game-title').textContent = world.title;
  const pct = (currentQ / total) * 100;
  const fill = document.getElementById('progress-fill');
  fill.style.width = pct + '%';
  fill.style.background = world.progressColor;
  document.getElementById('q-counter').textContent = (currentQ + 1) + ' / ' + total;
  document.getElementById('score-display').textContent = '⭐ ' + score;

  // Guide tip
  const tipBox = document.getElementById('guide-tip-box');
  if (mode === 'guide') {
    tipBox.innerHTML = '👩‍🏫 <strong>Guide tip:</strong> ' + q.tip;
    tipBox.classList.add('visible');
  } else {
    tipBox.classList.remove('visible');
  }

  // Question
  const qIcon = document.getElementById('q-icon');
  qIcon.textContent = q.icon;
  qIcon.style.animation = 'none';
  void qIcon.offsetWidth; // reflow to restart animation
  qIcon.style.animation = 'pop 0.42s cubic-bezier(.34,1.56,.64,1)';

  document.getElementById('q-text').textContent = q.text;
  document.getElementById('q-sub').textContent  = q.sub;

  // Clear feedback
  const fb = document.getElementById('feedback-bar');
  fb.textContent = '';
  fb.className   = 'feedback-bar';

  // Choices — shuffled order
  answered = false;
  const grid = document.getElementById('choices');
  grid.innerHTML = '';
  const shuffledChoices = shuffle(q.choices);
  shuffledChoices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.setAttribute('aria-label', c.label);
    btn.innerHTML = '<span class="ci" aria-hidden="true">' + c.emoji + '</span><span>' + c.label + '</span>';
    btn.onclick = () => handleAnswer(c.emoji, btn, q);
    grid.appendChild(btn);
  });
}

// ── Handle answer ───────────────────────────
function handleAnswer(chosen, btn, q) {
  if (answered) return;
  answered = true;
  const correct = chosen === q.answer;

  // Disable all buttons
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    const emoji = b.querySelector('.ci').textContent;
    if (emoji === q.answer) b.classList.add('correct');
    else b.classList.add('wrong');
  });

  // Feedback bar
  const fb = document.getElementById('feedback-bar');
  if (correct) {
    score++;
    document.getElementById('score-display').textContent = '⭐ ' + score;
    fb.textContent  = q.praise || '🎉 Correct!';
    fb.className    = 'feedback-bar correct-fb';
    confetti();
  } else {
    fb.textContent  = '💪 Almost! The right answer is highlighted!';
    fb.className    = 'feedback-bar wrong-fb';
  }

  // Advance
  setTimeout(() => {
    currentQ++;
    if (currentQ < WORLDS[currentWorld].questions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }, 1600);
}

// ── Result screen ───────────────────────────
function showResult() {
  const world = WORLDS[currentWorld];
  const total = world.questions.length;
  const pct   = score / total;

  // Save best
  const prev = bestScores[currentWorld] || 0;
  if (score > prev) {
    bestScores[currentWorld] = score;
    try { localStorage.setItem('sunnyStepsBest', JSON.stringify(bestScores)); } catch(e) {}
  }

  let icon, msg, sub, stars;
  if (pct === 1) {
    icon  = '🏆';
    msg   = 'Amazing! Perfect score!';
    sub   = 'You got every single one right — you are a superstar!';
    stars = '⭐⭐⭐';
  } else if (pct >= 0.75) {
    icon  = '🎉';
    msg   = 'Fantastic job!';
    sub   = 'You got ' + score + ' out of ' + total + ' — brilliant work!';
    stars = '⭐⭐⭐';
  } else if (pct >= 0.5) {
    icon  = '😊';
    msg   = 'Great effort!';
    sub   = 'You got ' + score + ' out of ' + total + ' — keep it up!';
    stars = '⭐⭐';
  } else {
    icon  = '💪';
    msg   = 'Good try!';
    sub   = 'You got ' + score + ' out of ' + total + '. Practice makes perfect!';
    stars = '⭐';
  }

  const best = bestScores[currentWorld] || score;
  const detailText = 'Your best score in this world: ' + best + ' / ' + total;

  document.getElementById('result-icon').textContent   = icon;
  document.getElementById('result-msg').textContent    = msg;
  document.getElementById('result-sub').textContent    = sub;
  document.getElementById('result-stars').textContent  = stars;
  document.getElementById('result-detail').textContent = detailText;

  showScreen('result');
  setTimeout(confetti, 200);
}

function replayWorld() { startWorld(currentWorld); }

// ── Confetti ─────────────────────────────────
function confetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#FFD166','#e17fff','#55efc4','#74b9ff','#fd79a8','#e07b39','#00cec9','#ffeaa7'];
  const count  = 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = [
      'left:' + (Math.random() * 100) + '%',
      'top:-14px',
      'background:' + colors[Math.floor(Math.random() * colors.length)],
      'animation-delay:' + (Math.random() * 0.7) + 's',
      'animation-duration:' + (1.2 + Math.random() * 0.6) + 's',
      'transform:rotate(' + (Math.random() * 360) + 'deg)',
      'border-radius:' + (Math.random() > 0.5 ? '50%' : '3px'),
      'width:' + (8 + Math.floor(Math.random() * 6)) + 'px',
      'height:' + (8 + Math.floor(Math.random() * 6)) + 'px',
    ].join(';');
    container.appendChild(p);
    setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p); }, 2500);
  }
}

// ── Keyboard nav for world cards ─────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.classList.contains('world-card')) {
    e.target.click();
  }
  if (e.key === 'Escape') {
    const gameScreen = document.getElementById('screen-game');
    if (gameScreen.classList.contains('active')) goHome();
  }
});

// ── Init ──────────────────────────────────────
updateHomeStars();
