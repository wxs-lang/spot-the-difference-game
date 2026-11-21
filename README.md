# Twin Tides — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/wxs-lang/spot-the-difference-game/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/wxs-lang/spot-the-difference-game/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

A complete, original spot-the-difference game that plays offline in a desktop
browser from its own static files. Two near-identical hand-drawn scenes sit
side by side; find every hidden difference before the clock runs out.

## How to play

- Click a difference on either panel to circle it. Find all 7 to clear the level.
- A wrong click costs 3 seconds and resets your combo.
- **H** or the Hint button rings a hidden difference for a moment (3 per level, −50 points).
- **R** restarts the level, **M** toggles sound, **Esc** goes back to the menu.
- Five scenes grow harder as you go: Harbor at Dusk, Forest Picnic, Night
  Market, Snowy Cabin, and Coral Reef. Clear a level fast for a time bonus and
  up to 3 stars.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network request: every script, style and sound is a file
under `game/` (sounds are synthesized with WebAudio).

## Layout

- `game/index.html` — page, HUD and screens
- `game/styles.css` — all styling
- `game/scenes.js` — the five hand-drawn scenes and their 35 differences
- `game/engine.js` — state machine: timer, scoring, hints, levels, markers
- `game/audio.js` — synthesized sound effects
- `game/boot.js` — wiring, keyboard, screenshot states
- `main.ts` — hands the game in: copies `game/` and `screenshots/` to
  `/output` and writes `dossier.json`
- `screenshots/` — real renders of the game in a browser

## License

MIT — see [LICENSE](LICENSE).
