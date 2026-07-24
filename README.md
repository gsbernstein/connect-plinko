# Connect Plinko

Browser Plinko games published from this repo.

## Play

| Game | URL |
|------|-----|
| **Plinko Four** (classic) | https://gsbernstein.github.io/connect-plinko/ |
| **Plinko Poker** | https://gsbernstein.github.io/connect-plinko/poker/ |

Each page has a Classic / Poker switch to jump between them.

### Plinko Four

Drop colored pucks through pegs into a Connect Four–style grid. Get 4+ in a row to score and explode — cascades chain for more points. If the board packs solid, the bottom row blows out automatically and everything above gets flung back into the pegs.

### Plinko Poker

Same plinko physics, but pucks are spinning playing cards. Line up a poker hand (flush, straight, three of a kind, …) and it explodes for **chips**. Spend chips on idle upgrades — Auto Dealer drops cards for you, Multi Deal piles on extras, Big Blind multiplies payouts, Pin Tip / Rail Tax / Sweep Stakes pay out on peg hits, bumper hits, and floor clears, High Cut / Suit Exile thin the shoe toward stronger hands, and Suit Purge / Auto Purge blow up a whole suit on a recharge timer. Progress saves in the browser. Near-miss guides show when you’re close; a full board still triggers the automatic floor clear.

## Local

Serve the repo root:

```bash
python3 -m http.server 8080
```

Then visit:

- Classic: `http://localhost:8080/`
- Poker: `http://localhost:8080/poker/`

## Hosting

Published with GitHub Pages **Deploy from a branch**: `master` / `/` (repo root).

If the site is not live yet, enable Pages once:

1. Repo **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `master` / `/` (root)
