// Twin Tides scenes: five hand-drawn canvas scenes and their differences.
// Every scene is drawn twice: the left panel with no mods, the right panel
// with all 7 of its differences applied. A difference is a small, fair
// change: something missing, recolored, moved or added. Coordinates live in
// scene space, 600 wide by 440 tall; the engine scales them to the canvas.

export const SCENE_W = 600;
export const SCENE_H = 440;

// ---------- tiny drawing helpers ----------
export function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}
export function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
}
export function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color; ctx.fillRect(x, y, w, h);
}
export function poly(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath(); ctx.fill();
}
export function strokeLine(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
export function star5(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(ang) * rr, py = y + Math.sin(ang) * rr;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.fill();
}
export function cloud(ctx, x, y, s, color) {
  circle(ctx, x, y, 16 * s, color);
  circle(ctx, x + 18 * s, y - 6 * s, 20 * s, color);
  circle(ctx, x + 40 * s, y, 16 * s, color);
  ellipse(ctx, x + 20 * s, y + 8 * s, 34 * s, 12 * s, color);
}
export function gull(ctx, x, y, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y); ctx.quadraticCurveTo(x - 5, y - 8, x, y);
  ctx.quadraticCurveTo(x + 5, y - 8, x + 12, y);
  ctx.stroke();
}
export function vgrad(ctx, y0, y1, stops) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  for (const [at, c] of stops) g.addColorStop(at, c);
  return g;
}

// ---------- Scene 1: Harbor at Dusk ----------
function drawHarbor(ctx, mods) {
  ctx.fillStyle = vgrad(ctx, 0, 300, [[0, '#2b3a67'], [0.6, '#c65f6e'], [1, '#f7a55c']]);
  ctx.fillRect(0, 0, 600, 300);
  // early stars
  circle(ctx, 60, 40, 2.5, '#fff8e0');
  if (!mods.has('star')) circle(ctx, 180, 50, 3, '#fff8e0');
  circle(ctx, 300, 34, 2, '#fff8e0');
  circle(ctx, 520, 44, 2.5, '#fff8e0');
  circle(ctx, 250, 90, 2, '#fff8e0');
  // setting sun over the sea
  circle(ctx, 480, 268, 34, '#ffdf6b');
  circle(ctx, 480, 268, 26, '#ffb347');
  // distant hills
  poly(ctx, [[0, 300], [90, 240], [210, 300]], '#5d4a7a');
  poly(ctx, [[380, 300], [500, 228], [600, 300]], '#54446f');
  // sea
  ctx.fillStyle = vgrad(ctx, 290, 440, [[0, '#3d7ea6'], [1, '#1d4e6b']]);
  ctx.fillRect(0, 290, 600, 150);
  strokeLine(ctx, 40, 320, 150, 320, 'rgba(255,255,255,.45)', 2);
  strokeLine(ctx, 300, 350, 420, 350, 'rgba(255,255,255,.4)', 2);
  strokeLine(ctx, 90, 395, 230, 395, 'rgba(255,255,255,.35)', 2);
  strokeLine(ctx, 420, 410, 560, 410, 'rgba(255,255,255,.35)', 2);
  // sun glitter on the water
  for (let i = 0; i < 5; i++) strokeLine(ctx, 455 + i * 4, 305 + i * 18, 505 - i * 4, 305 + i * 18, 'rgba(255,223,107,.7)', 2);
  // gulls
  gull(ctx, 300, 70, '#2b2b3a');
  if (!mods.has('gull')) gull(ctx, 430, 80, '#2b2b3a');
  gull(ctx, 520, 60, '#2b2b3a');
  // lighthouse
  rect(ctx, 58, 130, 34, 160, '#f7efdc');
  rect(ctx, 58, 170, 34, 18, '#d94f4f');
  rect(ctx, 58, 225, 34, 18, '#d94f4f');
  rect(ctx, 52, 108, 46, 24, '#3a3a4d');
  circle(ctx, 75, 120, 9, '#ffe98a');
  poly(ctx, [[48, 108], [102, 108], [75, 88]], '#d94f4f');
  if (!mods.has('beam')) {
    ctx.fillStyle = 'rgba(255,233,138,.28)';
    poly(ctx, [[95, 118], [300, 84], [300, 152]], 'rgba(255,233,138,.28)');
  }
  // dock with crates and a lantern
  rect(ctx, 0, 386, 210, 14, '#8a6b48');
  rect(ctx, 0, 400, 210, 12, '#75593a');
  strokeLine(ctx, 30, 386, 30, 412, '#5d4630', 2);
  strokeLine(ctx, 90, 386, 90, 412, '#5d4630', 2);
  strokeLine(ctx, 150, 386, 150, 412, '#5d4630', 2);
  rect(ctx, 96, 352, 34, 34, '#b08954');
  strokeLine(ctx, 96, 369, 130, 369, '#8a6b48', 2);
  if (!mods.has('crate')) {
    rect(ctx, 136, 352, 34, 34, '#a87c46');
    strokeLine(ctx, 136, 369, 170, 369, '#8a6b48', 2);
  }
  // dock lantern (warm on the left, green on the right)
  strokeLine(ctx, 24, 386, 24, 336, '#3a3a4d', 4);
  circle(ctx, 24, 330, 10, mods.has('lantern') ? '#7ee2a0' : '#ffd76b');
  circle(ctx, 24, 330, 15, mods.has('lantern') ? 'rgba(126,226,160,.3)' : 'rgba(255,215,107,.35)');
  // boats
  drawBoat(ctx, 215, 330, 46, '#e4572e', true, mods);
  drawBoat(ctx, 360, 350, 58, mods.has('sail') ? '#2e9e8a' : '#d94f4f', false, mods);
  drawBoat(ctx, 492, 320, 50, '#f2b705', true, mods, !mods.has('flag'));
}

function drawBoat(ctx, x, y, s, sailColor, hasFlag, mods, showFlag = true) {
  poly(ctx, [[x - s, y], [x + s, y], [x + s * 0.7, y + 22], [x - s * 0.7, y + 22]], '#6b4a2f');
  strokeLine(ctx, x, y, x, y - 62, '#4a3220', 4);
  poly(ctx, [[x + 3, y - 58], [x + 3, y - 6], [x + s * 0.85, y - 6]], sailColor);
  if (hasFlag && showFlag) {
    poly(ctx, [[x, y - 62], [x + 20, y - 56], [x, y - 50]], '#d94f4f');
  }
}

const HARBOR_DIFFS = [
  { id: 'gull', x: 430, y: 80, r: 20, hint: 'a gull vanished from the sky' },
  { id: 'beam', x: 170, y: 118, r: 26, hint: 'the lighthouse beam went dark' },
  { id: 'sail', x: 386, y: 322, r: 24, hint: 'a sail changed colour' },
  { id: 'crate', x: 153, y: 369, r: 22, hint: 'a crate is missing from the dock' },
  { id: 'star', x: 180, y: 50, r: 16, hint: 'a star blinked out' },
  { id: 'flag', x: 502, y: 264, r: 18, hint: 'a little flag is gone' },
  { id: 'lantern', x: 24, y: 330, r: 20, hint: 'the dock lantern changed colour' },
];

// ---------- Scene 2: Forest Picnic ----------
function drawPicnic(ctx, mods) {
  ctx.fillStyle = vgrad(ctx, 0, 440, [[0, '#8ec9ee'], [0.6, '#cfeeda'], [1, '#a8dba0']]);
  ctx.fillRect(0, 0, 600, 440);
  // sun with a face (sunglasses on the right)
  circle(ctx, 510, 62, 34, '#ffd94d');
  circle(ctx, 500, 56, 4, '#3a2a00');
  circle(ctx, 520, 56, 4, '#3a2a00');
  ctx.strokeStyle = '#3a2a00'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(510, 66, 10, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  if (mods.has('shades')) {
    rect(ctx, 492, 48, 16, 10, '#222');
    rect(ctx, 512, 48, 16, 10, '#222');
    strokeLine(ctx, 508, 53, 512, 53, '#222', 2);
  }
  cloud(ctx, 90, 60, 1, 'rgba(255,255,255,.9)');
  cloud(ctx, 300, 44, 0.8, 'rgba(255,255,255,.85)');
  // rolling hills
  ellipse(ctx, 120, 470, 260, 90, '#79c47f');
  ellipse(ctx, 480, 480, 280, 100, '#6ab874');
  // big oak
  rect(ctx, 96, 200, 26, 150, '#7a5230');
  circle(ctx, 70, 190, 42, '#4e9b47');
  circle(ctx, 150, 180, 48, '#57a84f');
  circle(ctx, 110, 140, 50, '#62b25a');
  circle(ctx, 110, 205, 34, '#4e9b47');
  // bird on a branch (gone on the right)
  strokeLine(ctx, 150, 210, 196, 196, '#7a5230', 4);
  if (!mods.has('bird')) {
    ellipse(ctx, 184, 188, 12, 8, '#3f6fb5');
    circle(ctx, 194, 182, 6, '#3f6fb5');
    poly(ctx, [[199, 182], [206, 184], [199, 185]], '#f2a541');
  }
  // tent
  poly(ctx, [[380, 340], [440, 210], [500, 340]], '#e8734a');
  poly(ctx, [[410, 340], [440, 268], [470, 340]], '#5d3a2e');
  strokeLine(ctx, 440, 210, 440, 178, '#4a3220', 3);
  if (!mods.has('tentflag')) poly(ctx, [[440, 178], [462, 184], [440, 190]], '#ffd94d');
  // picnic blanket
  poly(ctx, [[230, 360], [370, 360], [390, 420], [210, 420]], '#e4572e');
  poly(ctx, [[265, 360], [300, 360], [310, 420], [275, 420]], '#f7efdc');
  poly(ctx, [[330, 360], [365, 360], [385, 420], [355, 420]], '#f7efdc');
  // apple (red on the left, orange on the right) and sandwich
  circle(ctx, 292, 388, 11, mods.has('apple') ? '#f28c28' : '#d93838');
  strokeLine(ctx, 292, 378, 296, 370, '#4e9b47', 2);
  poly(ctx, [[318, 392], [342, 392], [330, 378]], '#f2d8a0');
  strokeLine(ctx, 318, 392, 342, 392, '#c98f2e', 2);
  // bottle
  rect(ctx, 352, 372, 10, 22, '#3f6fb5');
  rect(ctx, 354, 364, 6, 8, '#2c4f80');
  // mushrooms at the tree base
  drawMushroom(ctx, 60, 386, 1);
  if (!mods.has('shroom')) drawMushroom(ctx, 88, 392, 0.7);
  // butterfly (gone on the right)
  if (!mods.has('butterfly')) drawButterfly(ctx, 420, 96);
  // flowers
  drawFlower(ctx, 520, 368, mods.has('flower') ? '#ffd94d' : '#9b59d0');
  drawFlower(ctx, 40, 420, '#ff7eb6');
  drawFlower(ctx, 560, 420, '#ff7eb6');
  // backpack
  rect(ctx, 540, 300, 34, 40, '#3f6fb5');
  ellipse(ctx, 557, 300, 17, 8, '#2c4f80');
}

function drawMushroom(ctx, x, y, s) {
  rect(ctx, x - 4 * s, y - 12 * s, 8 * s, 12 * s, '#f7efdc');
  ctx.fillStyle = '#d93838';
  ctx.beginPath(); ctx.arc(x, y - 12 * s, 14 * s, Math.PI, 0); ctx.fill();
  circle(ctx, x - 6 * s, y - 18 * s, 2.5, '#fff');
  circle(ctx, x + 5 * s, y - 22 * s, 2, '#fff');
}
function drawButterfly(ctx, x, y) {
  ellipse(ctx, x - 9, y - 6, 9, 12, '#ff7eb6');
  ellipse(ctx, x + 9, y - 6, 9, 12, '#ff9ec7');
  ellipse(ctx, x - 7, y + 8, 7, 9, '#c77dff');
  ellipse(ctx, x + 7, y + 8, 7, 9, '#c77dff');
  strokeLine(ctx, x, y - 12, x, y + 12, '#3a2a00', 2);
}
function drawFlower(ctx, x, y, color) {
  strokeLine(ctx, x, y, x, y + 16, '#4e9b47', 3);
  for (let i = 0; i < 5; i++) {
    const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 5, color);
  }
  circle(ctx, x, y, 5, '#ffd94d');
}

const PICNIC_DIFFS = [
  { id: 'butterfly', x: 420, y: 96, r: 22, hint: 'a butterfly flew away' },
  { id: 'apple', x: 292, y: 388, r: 20, hint: 'an apple changed colour' },
  { id: 'tentflag', x: 450, y: 184, r: 18, hint: 'the tent lost its little flag' },
  { id: 'shroom', x: 88, y: 386, r: 18, hint: 'a mushroom vanished' },
  { id: 'bird', x: 186, y: 186, r: 20, hint: 'the bird left its branch' },
  { id: 'shades', x: 510, y: 56, r: 26, hint: 'the sun put on sunglasses' },
  { id: 'flower', x: 520, y: 368, r: 18, hint: 'a flower changed colour' },
];

// ---------- Scene 3: Night Market ----------
function drawMarket(ctx, mods) {
  ctx.fillStyle = vgrad(ctx, 0, 440, [[0, '#131c3a'], [0.55, '#27355e'], [1, '#3a2a52']]);
  ctx.fillRect(0, 0, 600, 440);
  // stars
  for (const [x, y] of [[40, 40], [150, 30], [260, 52], [360, 30], [470, 42], [560, 28], [210, 90], [420, 88]]) {
    circle(ctx, x, y, 2, '#fff8e0');
  }
  // moon: full on the left, crescent on the right
  circle(ctx, 90, 76, 30, '#f7efdc');
  circle(ctx, 82, 70, 5, '#d8cbb0');
  circle(ctx, 100, 86, 4, '#d8cbb0');
  if (mods.has('moon')) circle(ctx, 104, 66, 26, '#27355e');
  // string of red lanterns
  strokeLine(ctx, 0, 108, 600, 96, '#1a1a26', 2);
  const lanternXs = [60, 140, 220, 300, 380, 460, 540];
  lanternXs.forEach((x, i) => {
    if (mods.has('lantern') && i === 3) return;
    const y = 108 - (x / 600) * 12 + 16;
    strokeLine(ctx, x, y - 12, x, y, '#1a1a26', 2);
    ellipse(ctx, x, y + 8, 13, 16, '#e0393e');
    rect(ctx, x - 6, y - 10, 12, 5, '#f2b705');
    rect(ctx, x - 6, y + 22, 12, 5, '#f2b705');
    circle(ctx, x, y + 8, 4, '#ffd94d');
  });
  // ground
  rect(ctx, 0, 360, 600, 80, '#241d33');
  strokeLine(ctx, 0, 360, 600, 360, '#4a3a5e', 3);
  // stall 1: noodles, steamer with steam
  drawStall(ctx, 60, 300, '#e8734a', 'noodle');
  ellipse(ctx, 120, 296, 26, 8, '#8a8f98');
  rect(ctx, 96, 280, 48, 16, '#b9bec8');
  if (!mods.has('steam')) {
    ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(112, 276); ctx.quadraticCurveTo(106, 258, 114, 244); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(128, 276); ctx.quadraticCurveTo(134, 258, 126, 242); ctx.stroke();
  }
  // noodle sign glyph: two strokes on the left, one on the right
  strokeLine(ctx, 96, 208, 104, 196, '#fff', 3);
  strokeLine(ctx, 104, 208, 96, 196, '#fff', 3);
  if (!mods.has('sign')) strokeLine(ctx, 112, 208, 120, 196, '#fff', 3);
  // stall 2: fruit — watermelon slice (orange on the right)
  drawStall(ctx, 250, 300, '#57a84f', 'fruit');
  poly(ctx, [[300, 296], [344, 296], [322, 322]], mods.has('melon') ? '#f28c28' : '#e0393e');
  strokeLine(ctx, 300, 296, 344, 296, mods.has('melon') ? '#f7b267' : '#57a84f', 5);
  circle(ctx, 366, 288, 11, '#f28c28');
  circle(ctx, 388, 292, 9, '#ffd94d');
  // stall 3: toys — pinwheels
  drawStall(ctx, 440, 300, '#3f6fb5', 'toys');
  drawPinwheel(ctx, 480, 270);
  drawPinwheel(ctx, 520, 278);
  // vertical banner (gone on the right)
  if (!mods.has('banner')) {
    rect(ctx, 556, 170, 26, 110, '#f2b705');
    circle(ctx, 569, 200, 8, '#e0393e');
    circle(ctx, 569, 230, 8, '#e0393e');
    circle(ctx, 569, 260, 8, '#e0393e');
  }
  // cat on a crate (gone on the right)
  rect(ctx, 492, 392, 44, 28, '#8a6b48');
  if (!mods.has('cat')) {
    ellipse(ctx, 514, 384, 16, 12, '#2b2b3a');
    circle(ctx, 526, 372, 9, '#2b2b3a');
    poly(ctx, [[520, 364], [523, 356], [526, 364]], '#2b2b3a');
    poly(ctx, [[528, 364], [531, 356], [534, 364]], '#2b2b3a');
    strokeLine(ctx, 500, 388, 486, 380, '#2b2b3a', 4);
  }
}

function drawStall(ctx, x, y, color, kind) {
  poly(ctx, [[x - 10, y - 96], [x + 90, y - 96], [x + 80, y - 76], [x, y - 76]], color);
  rect(ctx, x, y - 76, 80, 76, '#6b4a2f');
  rect(ctx, x - 6, y - 8, 92, 10, '#8a6b48');
  rect(ctx, x, y - 76, 80, 12, '#f7efdc');
}
function drawPinwheel(ctx, x, y) {
  strokeLine(ctx, x, y, x, y + 26, '#f7efdc', 2);
  poly(ctx, [[x, y], [x + 12, y - 10], [x, y - 4]], '#ff7eb6');
  poly(ctx, [[x, y], [x - 12, y - 10], [x, y - 4]], '#ffd94d');
  poly(ctx, [[x, y], [x + 12, y + 10], [x, y + 4]], '#7ec8ff');
  poly(ctx, [[x, y], [x - 12, y + 10], [x, y + 4]], '#7ee2a0');
  circle(ctx, x, y, 3, '#fff');
}

const MARKET_DIFFS = [
  { id: 'cat', x: 514, y: 380, r: 22, hint: 'the market cat slipped away' },
  { id: 'lantern', x: 300, y: 116, r: 20, hint: 'a lantern went missing' },
  { id: 'moon', x: 90, y: 76, r: 26, hint: 'the moon changed its phase' },
  { id: 'sign', x: 108, y: 202, r: 18, hint: 'a stroke vanished from the sign' },
  { id: 'steam', x: 120, y: 258, r: 20, hint: 'the steamer stopped steaming' },
  { id: 'melon', x: 322, y: 304, r: 20, hint: 'a melon slice changed colour' },
  { id: 'banner', x: 569, y: 225, r: 24, hint: 'a golden banner is gone' },
];

// ---------- Scene 4: Snowy Cabin ----------
function drawCabin(ctx, mods) {
  ctx.fillStyle = vgrad(ctx, 0, 440, [[0, '#0e1a33'], [0.6, '#27355e'], [1, '#4a5a80']]);
  ctx.fillRect(0, 0, 600, 440);
  // stars (one missing on the right)
  for (const [x, y] of [[60, 60], [200, 40], [330, 56], [470, 36], [560, 70], [140, 110], [400, 110]]) {
    circle(ctx, x, y, 2.2, '#fff8e0');
  }
  if (!mods.has('star')) circle(ctx, 120, 50, 2.6, '#fff8e0');
  // moon
  circle(ctx, 520, 64, 26, '#f7efdc');
  circle(ctx, 512, 58, 4, '#d8cbb0');
  // snowy ground
  ellipse(ctx, 300, 480, 420, 90, '#eef4fb');
  // pine trees (one missing on the right)
  drawPine(ctx, 60, 330, 1);
  drawPine(ctx, 170, 350, 0.8);
  if (!mods.has('pine')) drawPine(ctx, 530, 320, 1.1);
  // cabin
  rect(ctx, 240, 220, 180, 120, '#7a5230');
  for (let i = 0; i < 4; i++) strokeLine(ctx, 240, 248 + i * 28, 420, 248 + i * 28, '#5d3d22', 2);
  poly(ctx, [[224, 224], [330, 150], [436, 224]], '#eef4fb');
  rect(ctx, 306, 276, 28, 64, '#4a3220');
  circle(ctx, 340, 308, 3, '#f2b705');
  // windows: right one dark on the right panel
  rect(ctx, 258, 246, 30, 30, '#ffd94d');
  strokeLine(ctx, 273, 246, 273, 276, '#4a3220', 2);
  strokeLine(ctx, 258, 261, 288, 261, '#4a3220', 2);
  rect(ctx, 372, 246, 30, 30, mods.has('window') ? '#27355e' : '#ffd94d');
  strokeLine(ctx, 387, 246, 387, 276, '#4a3220', 2);
  strokeLine(ctx, 372, 261, 402, 261, '#4a3220', 2);
  // chimney and smoke (gone on the right)
  rect(ctx, 386, 168, 22, 46, '#8a8f98');
  if (!mods.has('smoke')) {
    circle(ctx, 400, 150, 10, 'rgba(255,255,255,.8)');
    circle(ctx, 412, 132, 13, 'rgba(255,255,255,.65)');
    circle(ctx, 426, 112, 16, 'rgba(255,255,255,.45)');
  }
  // snowman
  circle(ctx, 470, 372, 26, '#fff');
  circle(ctx, 470, 322, 20, '#fff');
  circle(ctx, 470, 286, 15, '#fff');
  circle(ctx, 464, 282, 2.5, '#222');
  circle(ctx, 476, 282, 2.5, '#222');
  if (!mods.has('carrot')) poly(ctx, [[470, 288], [496, 292], [470, 296]], '#e8734a');
  // scarf: red on the left, blue on the right
  rect(ctx, 452, 302, 36, 9, mods.has('scarf') ? '#3f6fb5' : '#d93838');
  rect(ctx, 480, 302, 8, 22, mods.has('scarf') ? '#3f6fb5' : '#d93838');
  circle(ctx, 470, 330, 2.5, '#222');
  circle(ctx, 470, 344, 2.5, '#222');
  circle(ctx, 470, 360, 2.5, '#222');
  strokeLine(ctx, 452, 322, 436, 310, '#7a5230', 3);
  strokeLine(ctx, 488, 322, 504, 310, '#7a5230', 3);
  // sled (gone on the right)
  if (!mods.has('sled')) {
    strokeLine(ctx, 96, 400, 170, 400, '#a33c3c', 5);
    strokeLine(ctx, 100, 400, 100, 388, '#a33c3c', 4);
    strokeLine(ctx, 166, 400, 166, 388, '#a33c3c', 4);
    strokeLine(ctx, 100, 388, 166, 388, '#c65f6e', 4);
  }
  // footprints
  for (let i = 0; i < 4; i++) ellipse(ctx, 210 + i * 22, 396 + (i % 2) * 8, 7, 4, '#cfdce9');
}

function drawPine(ctx, x, y, s) {
  rect(ctx, x - 6 * s, y, 12 * s, 18 * s, '#5d3d22');
  poly(ctx, [[x - 34 * s, y], [x + 34 * s, y], [x, y - 46 * s]], '#2e7d46');
  poly(ctx, [[x - 28 * s, y - 30 * s], [x + 28 * s, y - 30 * s], [x, y - 70 * s]], '#358a4e');
  poly(ctx, [[x - 20 * s, y - 56 * s], [x + 20 * s, y - 56 * s], [x, y - 88 * s]], '#3f9c58');
  circle(ctx, x - 14 * s, y - 34 * s, 3, '#ffd94d');
  circle(ctx, x + 12 * s, y - 52 * s, 3, '#ff7eb6');
  circle(ctx, x, y - 14 * s, 3, '#7ec8ff');
}

const CABIN_DIFFS = [
  { id: 'carrot', x: 482, y: 292, r: 18, hint: 'the snowman lost its carrot nose' },
  { id: 'scarf', x: 470, y: 308, r: 20, hint: 'the snowman changed its scarf' },
  { id: 'window', x: 387, y: 261, r: 20, hint: 'a cabin window went dark' },
  { id: 'smoke', x: 412, y: 132, r: 24, hint: 'the chimney stopped smoking' },
  { id: 'star', x: 120, y: 50, r: 16, hint: 'a star blinked out' },
  { id: 'sled', x: 133, y: 394, r: 22, hint: 'the little sled is gone' },
  { id: 'pine', x: 530, y: 280, r: 26, hint: 'a pine tree vanished' },
];

// ---------- Scene 5: Coral Reef ----------
function drawReef(ctx, mods) {
  ctx.fillStyle = vgrad(ctx, 0, 440, [[0, '#4fb3d9'], [0.55, '#2a7fb5'], [1, '#155a8a']]);
  ctx.fillRect(0, 0, 600, 440);
  // light rays
  ctx.fillStyle = 'rgba(255,255,255,.09)';
  poly(ctx, [[120, 0], [170, 0], [90, 440], [30, 440]], 'rgba(255,255,255,.09)');
  poly(ctx, [[330, 0], [360, 0], [330, 440], [280, 440]], 'rgba(255,255,255,.09)');
  poly(ctx, [[480, 0], [500, 0], [540, 440], [500, 440]], 'rgba(255,255,255,.09)');
  // sandy floor
  ellipse(ctx, 300, 470, 420, 80, '#e8d49a');
  // seaweed (one stalk gone on the right)
  drawSeaweed(ctx, 60, 400, '#2e8b57');
  if (!mods.has('weed')) drawSeaweed(ctx, 96, 410, '#37a367');
  drawSeaweed(ctx, 540, 405, '#2e8b57');
  // corals
  drawCoral(ctx, 150, 400, '#ff7eb6', 1);
  drawCoral(ctx, 420, 405, mods.has('coral') ? '#9b59d0' : '#ff8c42', 1.15);
  drawCoral(ctx, 320, 415, '#ffd94d', 0.8);
  // clam with a pearl (gone on the right)
  ellipse(ctx, 190, 408, 34, 14, '#b08954');
  ellipse(ctx, 190, 400, 30, 12, '#d8b98a');
  if (!mods.has('pearl')) circle(ctx, 190, 392, 8, '#fff');
  // bubbles from the clam (gone on the right)
  if (!mods.has('bubbles')) {
    circle(ctx, 210, 360, 5, 'rgba(255,255,255,.7)');
    circle(ctx, 218, 330, 6, 'rgba(255,255,255,.6)');
    circle(ctx, 208, 300, 4, 'rgba(255,255,255,.55)');
  }
  // starfish (gone on the right)
  if (!mods.has('starfish')) star5(ctx, 520, 412, 16, '#ff9e5e');
  // fish
  drawFish(ctx, 300, 150, 34, mods.has('fish') ? '#ff7eb6' : '#ffd94d', -1);
  drawFish(ctx, 120, 200, 26, '#7ec8ff', 1);
  drawFish(ctx, 470, 120, 24, '#ff9e5e', -1);
  drawFish(ctx, 250, 260, 22, '#7ee2a0', 1);
  drawFish(ctx, 380, 240, 28, '#c77dff', -1);
  // turtle (gone on the right)
  if (!mods.has('turtle')) drawTurtle(ctx, 450, 200);
}

function drawSeaweed(ctx, x, y, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x - 14, y - 30, x + 4, y - 60);
  ctx.quadraticCurveTo(x + 16, y - 84, x + 2, y - 104);
  ctx.stroke();
}
function drawCoral(ctx, x, y, color, s) {
  ctx.strokeStyle = color; ctx.lineWidth = 9 * s; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x - 8, y - 30, x - 22, y - 52); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + 6, y - 34, x + 4, y - 62); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + 16, y - 26, x + 30, y - 44); ctx.stroke();
  circle(ctx, x - 22, y - 52, 6 * s, color);
  circle(ctx, x + 4, y - 62, 6 * s, color);
  circle(ctx, x + 30, y - 44, 6 * s, color);
}
function drawFish(ctx, x, y, s, color, dir) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(dir, 1);
  ellipse(ctx, 0, 0, s, s * 0.55, color);
  poly(ctx, [[-s * 0.85, 0], [-s * 1.35, -s * 0.5], [-s * 1.35, s * 0.5]], color);
  circle(ctx, s * 0.55, -s * 0.1, 3.5, '#222');
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, s * 0.6, 0.3, 1.4); ctx.stroke();
  ctx.restore();
}
function drawTurtle(ctx, x, y) {
  ellipse(ctx, x, y, 34, 24, '#3f9c58');
  ellipse(ctx, x, y - 4, 26, 16, '#57b06e');
  circle(ctx, x + 36, y - 6, 10, '#7ec850');
  circle(ctx, x + 40, y - 9, 2, '#222');
  ellipse(ctx, x - 30, y + 8, 14, 6, '#57b06e');
  ellipse(ctx, x - 30, y - 12, 14, 6, '#57b06e');
  ellipse(ctx, x + 24, y + 14, 12, 5, '#57b06e');
  ellipse(ctx, x + 24, y - 16, 12, 5, '#57b06e');
}

const REEF_DIFFS = [
  { id: 'turtle', x: 450, y: 200, r: 26, hint: 'a turtle swam away' },
  { id: 'pearl', x: 190, y: 392, r: 18, hint: 'the pearl left its clam' },
  { id: 'fish', x: 300, y: 150, r: 24, hint: 'a fish changed colour' },
  { id: 'starfish', x: 520, y: 412, r: 20, hint: 'a starfish is gone' },
  { id: 'bubbles', x: 212, y: 330, r: 20, hint: 'the bubbles stopped rising' },
  { id: 'coral', x: 424, y: 372, r: 24, hint: 'a coral changed colour' },
  { id: 'weed', x: 96, y: 372, r: 20, hint: 'a strand of seaweed is missing' },
];

// ---------- catalogue ----------
export const SCENES = [
  { id: 'harbor', name: 'Harbor at Dusk', time: 90, draw: drawHarbor, diffs: HARBOR_DIFFS },
  { id: 'picnic', name: 'Forest Picnic', time: 80, draw: drawPicnic, diffs: PICNIC_DIFFS },
  { id: 'market', name: 'Night Market', time: 75, draw: drawMarket, diffs: MARKET_DIFFS },
  { id: 'cabin', name: 'Snowy Cabin', time: 70, draw: drawCabin, diffs: CABIN_DIFFS },
  { id: 'reef', name: 'Coral Reef', time: 65, draw: drawReef, diffs: REEF_DIFFS },
];
