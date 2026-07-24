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

Same plinko physics, but pucks are spinning playing cards. Line up a poker hand (flush, straight, three of a kind, …) and it explodes for **chips**.

Progression layers:
1. **Chips** — spend on table upgrades (Auto Dealer, Hold Deal, Big Blind, …). Many upgrades stay hidden until unlocked.
2. **Run level** — rises automatically from chips *earned* this table. Levels unlock shop items and grant rewards (comp credit, free upgrade bumps, even VIP perk levels). Resets when you Cash Out.
3. **Quests & achievements** — **Quests** stay locked until run Lv 2, then each level-up opens another slot (max 5). Claiming a quest rolls a replacement. Cash Out clears the quest board (achievements stay). Rarity starts at Common; VIP **Quest Ink** unlocks Uncommon → Legendary.
4. **VIP / prestige** — from run level 8, **Cash Out** banks your level comps for permanent perks (House Edge, Seed Stack, Rack Discount, Comp Card, Quick Deal, Pin Privilege, Quest Ink, and the expensive **Pit Boss** auto-buyer). Hard reset wipes VIP and achievements too.

The right rail is tabbed (**Upgrades · Quests · Achieves · VIP**). The Quests tab appears once you unlock your first slot. Badges show affordable upgrades / ready claims.

Saves in the browser. Near-miss guides show when you’re close; a full board still triggers the automatic floor clear.

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
