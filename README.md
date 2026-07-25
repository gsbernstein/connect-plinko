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
1. **Chips** — spend on table upgrades (Auto Dealer, Big Blind, Pin Tip, …). Many upgrades stay hidden until unlocked.
2. **Run level** — rises automatically from chips *earned* this table. Levels unlock shop items and grant rewards (Cash Out comps, scaling chip bonuses at milestones, and late-game multiplier boosts). Click the level pill to see what you’ve earned and what’s next. Resets when you Cash Out.
3. **Quests & achievements** — **Quests** stay locked until run Lv 2, then additional slots unlock at Lv 20, 45, 75, and 110 (max 5). Claiming a quest rolls a replacement. Cash Out clears the quest board (achievements stay). Rarity starts at Common; VIP **Quest Ink** unlocks Uncommon → Legendary.
4. **VIP / prestige** — from run level 8, **Cash Out** banks your level comps for permanent perks. **Table Tilt** steers peg falls from device motion (toggleable; motion permission only when you turn it on). **Quick Deal** / **Pin Privilege** / **Felt Wax** add bonus Auto Dealer / Pin Tip / Felt Grease levels (gold on the progress bar; still capped at the skill max) and raise those upgrades’ buy costs like normal levels. **House Edge** adds permanent Hot Streak levels the same way. **Open Blind** extends Big Blind’s chip multiplier to more payout types each level (pin tips → rail tax → sweep stakes → quests & achievements → level bonuses). Also: Seed Stack, Rack Discount, Comp Card, Quest Ink, Card Sense, Auto Purge, Pit Boss. Hard reset wipes VIP and achievements too.

Full-height layout: the table scales to fit, and the sidebar tabs scroll with the tab bar pinned at the bottom. On narrow screens the table is its own tab. First visit opens a **Welcome** tab (poker-chip logo + tap/click anywhere on the board to drop); it gives way to Upgrades after your first hand, and Reset brings it back. Achievements stay hidden until you earn one. Quests unlock from run Lv 2, VIP at run Lv 8 (or earlier once you earn permanent comps). Badges show affordable upgrades / ready claims.

Saves in the browser. Near-miss guides show when you’re close; a full board still triggers the automatic floor clear. **Settings** lists What’s new; a red badge appears when there are updates since your last save viewed that panel.

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
