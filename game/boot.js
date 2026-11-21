// Twin Tides boot: wires the DOM to the engine, the keyboard shortcuts,
// the level-select thumbnails, and the deterministic ?shot= states the
// screenshots are taken from.

import { SCENES, SCENE_W, SCENE_H } from './scenes.js';
import { createGame } from './engine.js';
import { sounds } from './audio.js';

function $(id) { return document.getElementById(id); }

const game = createGame();

// ---------- level select: a live miniature of every scene ----------
function buildLevelGrid() {
  const grid = $('level-grid');
  grid.innerHTML = '';
  SCENES.forEach((scene, i) => {
    const card = document.createElement('button');
    card.className = 'level-card';
    card.type = 'button';
    const thumb = document.createElement('canvas');
    thumb.width = 300;
    thumb.height = 220;
    const tctx = thumb.getContext('2d');
    tctx.setTransform(0.5, 0, 0, 0.5, 0, 0);
    scene.draw(tctx, new Set());
    card.appendChild(thumb);
    const name = document.createElement('span');
    name.className = 'lc-name';
    name.textContent = `${i + 1}. ${scene.name}`;
    card.appendChild(name);
    const meta = document.createElement('span');
    meta.className = 'lc-meta';
    meta.textContent = `7 differences · ${scene.time}s`;
    card.appendChild(meta);
    const stars = document.createElement('span');
    stars.className = 'lc-stars';
    const got = game.state.stars[i] || 0;
    stars.textContent = '★'.repeat(got) + '☆'.repeat(3 - got);
    card.appendChild(stars);
    card.addEventListener('click', () => {
      sounds.pop(1);
      game.startLevel(i);
    });
    grid.appendChild(card);
  });
}

// ---------- buttons ----------
$('btn-play').addEventListener('click', () => { sounds.pop(1); game.startLevel(0); });
$('btn-levels').addEventListener('click', () => { buildLevelGrid(); game.showLevels(); });
$('btn-levels-back').addEventListener('click', () => game.showMenu());
$('btn-how').addEventListener('click', () => {
  const how = $('howto');
  how.hidden = !how.hidden;
});
$('btn-hint').addEventListener('click', () => game.useHint());
$('btn-menu').addEventListener('click', () => game.showMenu());
$('btn-sound').addEventListener('click', (e) => {
  sounds.setMuted(!sounds.isMuted());
  e.currentTarget.textContent = sounds.isMuted() ? '🔇' : '🔊';
});
$('btn-next').addEventListener('click', () => game.nextLevel());
$('btn-replay').addEventListener('click', () => game.restart());
$('btn-clear-menu').addEventListener('click', () => game.showMenu());
$('btn-retry').addEventListener('click', () => game.restart());
$('btn-over-menu').addEventListener('click', () => game.showMenu());
$('btn-again').addEventListener('click', () => { game.state.score = 0; game.startLevel(0); });
$('btn-win-menu').addEventListener('click', () => game.showMenu());

// ---------- keyboard: H hint, R restart, M sound, Esc menu ----------
document.addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') game.useHint();
  else if (e.key === 'r' || e.key === 'R') {
    if (game.state.screen === 'playing' || game.state.screen === 'over') game.restart();
  } else if (e.key === 'm' || e.key === 'M') {
    sounds.setMuted(!sounds.isMuted());
    $('btn-sound').textContent = sounds.isMuted() ? '🔇' : '🔊';
  } else if (e.key === 'Escape') {
    game.showMenu();
  }
});

// ---------- deterministic screenshot states: ?shot=cover|levels|hint|clear ----------
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot) {
  if (shot === 'levels') buildLevelGrid();
  game.setShot(shot);
}
