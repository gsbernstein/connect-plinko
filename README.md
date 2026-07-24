# Plinko Poker

A browser Plinko game where spinning playing-card pucks drop into a Connect Four–style grid. Line up a poker hand (flush, straight, three of a kind, …) and it explodes — cascades can chain for bigger scores.

## Play

**https://gsbernstein.github.io/connect-plinko/**

## How to play

1. Press and drag on the board to aim, release to drop the next card.
2. Cards tumble and spin through the pegs into columns.
3. Contiguous lines that form a poker hand flash and explode.
4. Pieces above a blast get flung back into the pegs.
5. If the board packs solid, click any card to detonate it (no points) and open space.

**Scoring hands:** two pair · three of a kind · straight · flush · full house · four of a kind · straight flush · royal flush. Combos and chain reactions multiply your score.

## Local

Open `index.html` in a browser, or serve the repo root:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Hosting

Published with GitHub Pages **Deploy from a branch**: `master` / `/` (repo root).

If the site is not live yet, enable Pages once:

1. Repo **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `master` / `/` (root)
