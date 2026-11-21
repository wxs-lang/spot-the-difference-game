// Twin Tides engine: the game state machine.
// Owns the two panels, the timer, scoring, hints, markers and level flow.
// Scene art lives in scenes.js; sounds in audio.js; boot.js wires the DOM.

import { SCENES, SCENE_W, SCENE_H } from './scenes.js';
import { sounds } from './audio.js';

const SCALE = 2; // canvas backing is 2x the scene space, for crisp renders
const WRONG_COST_SECONDS = 3;
const HINT_COST = 50;
const HINTS_PER_LEVEL = 3;

function $(id) { return document.getElementById(id); }

export function createGame() {
  const canvasA = $('canvas-a');
  const canvasB = $('canvas-b');
  const ctxA = canvasA.getContext('2d');
  const ctxB = canvasB.getContext('2d');

  const state = {
    screen: 'menu', // menu | levels | playing | clear | over | win
    levelIndex: 0,
    found: new Set(), // diff ids found this level
    hintsLeft: HINTS_PER_LEVEL,
    score: 0,
    levelScore: 0,
    combo: 0,
    timeLeft: 0,
    timeTotal: 0,
    lastTick: 0,
    lastSecond: -1,
    hint: null, // {diff, until}
    wrongMarks: [], // {x, y, until}
    foundPulse: null, // {diff, until}
    stars: loadStars(),
    best: loadBest(),
  };

  function loadStars() {
    try { return JSON.parse(localStorage.getItem('twintides-stars') || '[0,0,0,0,0]'); }
    catch { return [0, 0, 0, 0, 0]; }
  }
  function loadBest() {
    try { return Number(localStorage.getItem('twintides-best') || 0); }
    catch { return 0; }
  }
  function saveProgress() {
    try {
      localStorage.setItem('twintides-stars', JSON.stringify(state.stars));
      localStorage.setItem('twintides-best', String(state.best));
    } catch { /* storage unavailable: progress just lives for the session */ }
  }

  function scene() { return SCENES[state.levelIndex]; }
  function allMods() { return new Set(scene().diffs.map(d => d.id)); }

  // ---------- rendering ----------
  function drawPanel(ctx, mods) {
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    ctx.clearRect(0, 0, SCENE_W, SCENE_H);
    scene().draw(ctx, mods);
    const now = performance.now();
    // found markers: a red ring on both panels, newest one pulsing
    for (const diff of scene().diffs) {
      if (!state.found.has(diff.id)) continue;
      ctx.strokeStyle = '#e0393e';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(diff.x, diff.y, diff.r + 6, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(224,57,62,.12)';
      ctx.beginPath(); ctx.arc(diff.x, diff.y, diff.r + 6, 0, Math.PI * 2); ctx.fill();
      if (state.foundPulse && state.foundPulse.diff === diff.id && now < state.foundPulse.until) {
        const t = 1 - (state.foundPulse.until - now) / 600;
        ctx.strokeStyle = `rgba(224,57,62,${0.9 - t * 0.9})`;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(diff.x, diff.y, diff.r + 6 + t * 18, 0, Math.PI * 2); ctx.stroke();
      }
    }
    // hint ring: a pulsing gold dashed ring around one hidden difference
    if (state.hint && now < state.hint.until) {
      const d = state.hint.diff;
      const pulse = 1 + Math.sin(now / 130) * 0.12;
      ctx.strokeStyle = '#ffcf5c';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 7]);
      ctx.beginPath(); ctx.arc(d.x, d.y, (d.r + 12) * pulse, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }
    // wrong-click crosses, fading out
    state.wrongMarks = state.wrongMarks.filter(m => now < m.until);
    for (const m of state.wrongMarks) {
      const a = (m.until - now) / 800;
      ctx.strokeStyle = `rgba(224,57,62,${a})`;
      ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x - 10, m.y - 10); ctx.lineTo(m.x + 10, m.y + 10);
      ctx.moveTo(m.x + 10, m.y - 10); ctx.lineTo(m.x - 10, m.y + 10);
      ctx.stroke();
    }
  }

  function render() {
    drawPanel(ctxA, new Set());
    drawPanel(ctxB, allMods());
  }

  // ---------- HUD ----------
  function fmtTime(s) {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, '0')}`;
  }
  function refreshHud() {
    const sc = scene();
    $('level-name').textContent = sc.name;
    $('level-pos').textContent = `Level ${state.levelIndex + 1} / ${SCENES.length}`;
    $('found-count').textContent = String(state.found.size);
    $('score').textContent = String(state.score);
    $('hints-left').textContent = String(state.hintsLeft);
    $('btn-hint').disabled = state.hintsLeft <= 0 || state.screen !== 'playing';
    const low = state.timeLeft <= 15 && state.screen === 'playing';
    $('timer-fill').classList.toggle('low', low);
    $('timer-text').classList.toggle('low', low);
  }
  function refreshTimer() {
    $('timer-text').textContent = fmtTime(Math.max(0, state.timeLeft));
    $('timer-fill').style.width = `${Math.max(0, (state.timeLeft / state.timeTotal) * 100)}%`;
  }
  function setStatus(text) { $('status-text').textContent = text; }
  function setCombo() {
    $('combo-text').textContent = state.combo >= 2 ? `🔥 Combo x${state.combo}` : '';
  }

  // ---------- screens ----------
  const SCREENS = ['screen-menu', 'screen-levels', 'screen-clear', 'screen-over', 'screen-win'];
  function showOnly(id) {
    for (const s of SCREENS) $(s).hidden = s !== id;
  }
  function showMenu() {
    state.screen = 'menu';
    $('best-score').textContent = String(state.best);
    showOnly('screen-menu');
    setStatus('Find all 7 differences before the clock runs out.');
  }
  function showLevels() {
    state.screen = 'levels';
    showOnly('screen-levels');
  }

  // ---------- level flow ----------
  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.hintsLeft = HINTS_PER_LEVEL;
    state.combo = 0;
    state.levelScore = 0;
    state.timeTotal = scene().time;
    state.timeLeft = scene().time;
    state.lastSecond = -1;
    state.hint = null;
    state.wrongMarks = [];
    state.foundPulse = null;
    state.screen = 'playing';
    showOnly('');
    render();
    refreshHud();
    refreshTimer();
    setStatus(`Find all 7 differences in “${scene().name}”.`);
    setCombo();
  }

  function levelClear() {
    state.screen = 'clear';
    const bonus = Math.ceil(state.timeLeft) * 10;
    state.score += bonus;
    state.levelScore += bonus;
    const frac = state.timeLeft / state.timeTotal;
    const stars = frac >= 0.4 ? 3 : frac >= 0.2 ? 2 : 1;
    state.stars[state.levelIndex] = Math.max(state.stars[state.levelIndex], stars);
    if (state.score > state.best) state.best = state.score;
    saveProgress();
    sounds.win();
    $('clear-title').textContent = `“${scene().name}” clear!`;
    $('clear-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    $('clear-bonus').textContent = `+${bonus}`;
    $('clear-score').textContent = String(state.levelScore);
    $('clear-total').textContent = String(state.score);
    $('btn-next').textContent = state.levelIndex + 1 < SCENES.length ? 'Next scene →' : 'See results →';
    showOnly('screen-clear');
    refreshHud();
  }

  function gameOver() {
    state.screen = 'over';
    if (state.score > state.best) state.best = state.score;
    saveProgress();
    sounds.lose();
    $('over-line').textContent = `You found ${state.found.size} of 7 differences in “${scene().name}”.`;
    showOnly('screen-over');
  }

  function victory() {
    state.screen = 'win';
    if (state.score > state.best) state.best = state.score;
    saveProgress();
    $('win-score').textContent = String(state.score);
    $('win-best').textContent = String(state.best);
    showOnly('screen-win');
  }

  function nextLevel() {
    if (state.levelIndex + 1 < SCENES.length) startLevel(state.levelIndex + 1);
    else victory();
  }

  // ---------- play ----------
  function toSceneCoords(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * SCENE_W,
      y: ((event.clientY - rect.top) / rect.height) * SCENE_H,
    };
  }

  function onPanelClick(event) {
    if (state.screen !== 'playing') return;
    const p = toSceneCoords(event, event.currentTarget);
    const diff = scene().diffs.find(d => !state.found.has(d.id) &&
      Math.hypot(p.x - d.x, p.y - d.y) <= d.r + 8);
    if (diff) {
      state.found.add(diff.id);
      state.combo += 1;
      const gained = 100 + (state.combo - 1) * 20;
      state.score += gained;
      state.levelScore += gained;
      state.foundPulse = { diff: diff.id, until: performance.now() + 600 };
      sounds.pop(state.combo);
      setStatus(`Found it — ${diff.hint}! (+${gained})`);
      setCombo();
      refreshHud();
      render();
      if (state.found.size === scene().diffs.length) levelClear();
    } else {
      state.combo = 0;
      state.timeLeft = Math.max(0, state.timeLeft - WRONG_COST_SECONDS);
      state.wrongMarks.push({ x: p.x, y: p.y, until: performance.now() + 800 });
      sounds.wrong();
      setStatus(`Not a difference — minus ${WRONG_COST_SECONDS} seconds.`);
      setCombo();
      refreshHud();
      refreshTimer();
      render();
    }
  }

  function useHint() {
    if (state.screen !== 'playing' || state.hintsLeft <= 0) return;
    const hidden = scene().diffs.filter(d => !state.found.has(d.id));
    if (!hidden.length) return;
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - HINT_COST);
    const diff = hidden[Math.floor(Math.random() * hidden.length)];
    state.hint = { diff, until: performance.now() + 2500 };
    sounds.hint();
    setStatus(`Hint: look near the ${diff.hint}. (−${HINT_COST} points)`);
    refreshHud();
    render();
  }

  // ---------- main loop ----------
  function tick(now) {
    if (state.screen === 'playing') {
      const dt = state.lastTick ? (now - state.lastTick) / 1000 : 0;
      state.lastTick = now;
      state.timeLeft = Math.max(0, state.timeLeft - dt);
      const sec = Math.ceil(state.timeLeft);
      if (sec !== state.lastSecond) {
        state.lastSecond = sec;
        refreshTimer();
        if (sec <= 5 && sec > 0) sounds.tick();
      }
      if (state.hint || state.wrongMarks.length || state.foundPulse) render();
      if (state.timeLeft <= 0) {
        refreshTimer();
        gameOver();
      }
    } else {
      state.lastTick = now;
    }
    requestAnimationFrame(tick);
  }

  // ---------- deterministic states for screenshots ----------
  // ?shot=cover | levels | hint | clear — the same states a player reaches,
  // set up directly so screenshots are reproducible.
  function setShot(kind) {
    if (kind === 'levels') { showLevels(); return; }
    if (kind === 'clear') {
      startLevel(0);
      state.found = new Set(scene().diffs.slice(0, 7).map(d => d.id));
      state.timeLeft = 54;
      state.levelScore = 760;
      state.score = 760;
      render(); refreshHud(); refreshTimer();
      state.screen = 'clear';
      $('clear-title').textContent = `“${scene().name}” clear!`;
      $('clear-stars').textContent = '★★★';
      $('clear-bonus').textContent = '+540';
      $('clear-score').textContent = '760';
      $('clear-total').textContent = '760';
      $('btn-next').textContent = 'Next scene →';
      showOnly('screen-clear');
      return;
    }
    if (kind === 'hint') {
      startLevel(1);
      state.found = new Set(scene().diffs.slice(0, 2).map(d => d.id));
      state.timeLeft = 61;
      state.hintsLeft = 2;
      state.score = 220;
      state.hint = { diff: scene().diffs[3], until: performance.now() + 60000 };
      render(); refreshHud(); refreshTimer();
      setStatus('Hint: look near the place where a mushroom vanished. (−50 points)');
      return;
    }
    // cover: level 1 mid-game, 3 of 7 found, several still unfound
    startLevel(0);
    state.found = new Set(scene().diffs.slice(0, 3).map(d => d.id));
    state.timeLeft = 62;
    state.score = 340;
    state.combo = 3;
    render(); refreshHud(); refreshTimer();
    setCombo();
    setStatus('Found it — a sail changed colour! (+140)');
  }

  canvasA.addEventListener('click', onPanelClick);
  canvasB.addEventListener('click', onPanelClick);
  requestAnimationFrame(tick);
  showMenu();

  return {
    state,
    startLevel,
    showMenu,
    showLevels,
    nextLevel,
    useHint,
    setShot,
    render,
    refreshHud,
    restart: () => startLevel(state.levelIndex),
  };
}
