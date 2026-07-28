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
1. **Chips** — spend on table upgrades (Auto Dealer, Multi Deal, Big Blind, Pin Tip, …). Auto Dealer is cheap through Lv 6 then pricier; **Multi Deal** (unlocks at run Lv 8) adds a chance for extra cards per auto tick (caps at 150%; above 100% can deal multiple). **Big Blind** goes to Lv 60; **Premium Cut** to Lv 25; **Felt Grease** to Lv 30 (late levels keep speeding falls with softer gains). **Cashier’s Cage** (unlocks at run Lv 200) is a steep chip sink — each buy banks a Cash Out comp for VIP instead of more chip income. **Short Fuse** speeds hand clears but is toggleable when you want more time to stack combos or Card Counting pairs. **Suit Purge** pays per card; the shop toggle or bar tap can hide the suit picker without stopping purges. **Suit Alliance** keeps all four suits on the table — diamonds count as hearts (Lv1) and clubs as spades (Lv2) for flushes and Suit Purge (buttons show both glyphs). The HUD shows your balance; VIP **Slide Rule** unlocks a live chips/s rate meter (Lv2 is log scale). The Comps tile also shows how many comps Cash Out will collect. Many upgrades stay hidden until unlocked.
2. **Run level** — rises automatically from chips *earned* this table. Levels unlock shop items and grant rewards (Cash Out comps, scaling chip bonuses at milestones, and late-game multiplier boosts). Active Blind / payout / combo / Card Counting multipliers show on the level pill; click it for unlock history. Resets when you Cash Out.
3. **Quests & achievements** — **Quests** stay locked until run Lv 2, then additional slots unlock at Lv 20, 45, 75, and 110 (max 5). Claiming a quest rolls a replacement. Cash Out clears the quest board (achievements stay). Achievement rewards often grant **instant comps** (VIP comps right away); some quests grant **Cash Out comps** instead. Rarity starts at Common; VIP **Quest Ink** unlocks Uncommon → Legendary and shifts roll odds toward higher tiers (Rare is most likely at max level).
4. **VIP / prestige** — from run level 8, **Cash Out** collects your Cash Out comps into the VIP balance for permanent perks. **Slide Rule** (toggleable) Lv1 shows a chips/s meter; Lv2 switches to log scale (1 comp, then ×10 for Lv2). **Table Tilt** steers peg falls from device motion (toggleable; motion permission only when you turn it on). **Quick Deal** / **Pin Privilege** / **Felt Wax** add bonus Auto Dealer / Pin Tip / Felt Grease levels (gold on the progress bar; still capped at the skill max). **Open Blind** extends Big Blind’s chip multiplier to more payout types each level. **Ace Up Your Sleeve** gives each hand an extra invisible Ace (up to five cards). **Connect 4** lets flushes score with only 4 suited cards. **Deal Me In** (toggleable) lets cards that settle during a hand flash still join that clear. **Card Counting** (eight levels) adds +8% hand payout per duplicate in play per level; Lv9 multiplies your level payout mult by paired-card products. **Percussive Mitosis** (toggleable) slows Auto Dealer ~10× but cards bifurcate on pins. **Storm the Beaches** (toggleable) speeds Auto Dealer ~3× and cards can randomly explode on pins; survivors that reach the columns earn chips. **I Cast Fireball** (toggleable) makes explosions light nearby cards on fire; burning cards drip chips and hands with lit cards pay a bonus. **Siege Weapons** (up to 3 levels, toggleable) gives spiked cards that smash bumpers and clear columns. **King Me** (toggleable) merges suited kings into crowned stacks that count extra in poker hands. Also: Seed Stack, Rack Discount, Comp Card, Quest Ink, **Quest Desk**, **Quick Claim**, Auto Purge, Pit Boss, **Control Booth**. Hard reset wipes VIP and achievements too.

Full-height layout: the table scales to fit, and the sidebar tabs scroll with the tab bar pinned at the bottom. On narrow screens the table is its own tab. First visit opens a **Welcome** tab (poker-chip logo + tap/click anywhere on the board to drop); it gives way to Upgrades after your first hand, and Reset brings it back. Achievements stay hidden until you earn one. Quests unlock from run Lv 2, VIP at run Lv 8 (or earlier once you earn comps). Badges show affordable upgrades / ready claims.

Saves in the browser — including your active chain heater, so a refresh or update doesn’t reset consecutive-clear multipliers. Scoring hands flash connector dashes between seats before they clear. A full board still triggers the automatic floor clear. **Settings** lists What’s new; a red badge appears when there are updates since your last save viewed that panel, and those entries are highlighted as New. If a new Poker build ships while a tab is still open, a **Refresh** banner can appear after checking `poker/version.json`.

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

`poker/version.json` holds Poker’s live release id (same number as the latest Settings changelog entry). Open Poker tabs poll it and prompt for a refresh when it advances.

If the site is not live yet, enable Pages once:

1. Repo **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `master` / `/` (root)
