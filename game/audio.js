// Twin Tides audio: every sound is synthesized with WebAudio.
// No audio files, no network: the context is created on the first user
// gesture and every effect is a short oscillator envelope.

let ctx = null;
let muted = false;

function ac() {
  if (!ctx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    } catch { return null; }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, dur, type, vol, when = 0, slideTo = null) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sounds = {
  // a bright pop that climbs with the combo
  pop(combo = 1) {
    const base = 520 + Math.min(combo, 8) * 40;
    tone(base, 0.12, 'sine', 0.25, 0, base * 1.6);
    tone(base * 2, 0.08, 'triangle', 0.12, 0.02);
  },
  // a dull buzz for a wrong click
  wrong() {
    tone(160, 0.22, 'square', 0.14, 0, 110);
  },
  // a two-note chime for a hint
  hint() {
    tone(880, 0.16, 'sine', 0.2);
    tone(1318, 0.22, 'sine', 0.18, 0.12);
  },
  // a little arpeggio for clearing a level
  win() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', 0.22, i * 0.09));
  },
  // a falling sigh for running out of time
  lose() {
    tone(392, 0.3, 'sine', 0.2, 0, 262);
    tone(262, 0.4, 'sine', 0.18, 0.22, 196);
  },
  // a soft tick in the last seconds
  tick() {
    tone(1200, 0.05, 'square', 0.06);
  },
  setMuted(m) { muted = m; },
  isMuted() { return muted; },
};
