# Agent guide — Connect Plinko

Quick orientation for cloud agents and other automated contributors. Read this before exploring the tree.

## Keeping this file current

When you touch an area documented here — progression, saves, rail UI, pulse feedback, physics, etc. — **update `AGENTS.md` in the same PR** if your change adds symbols, moves line ranges, or changes behavior future agents need to know. Do not leave the guide stale; a one-line table row or a short bullet is enough. Player-facing copy still belongs in `README.md` when behavior is user-visible.

## What this repo is

Static browser games — no build step, no package manager, no test suite. GitHub Pages deploys **`master`** from the repo root (`/`).

| Game | Path | Live URL |
|------|------|----------|
| **Plinko Four** (classic Connect Four + plinko) | `index.html` | https://gsbernstein.github.io/connect-plinko/ |
| **Plinko Poker** (idle / progression poker plinko) | `poker/index.html` | https://gsbernstein.github.io/connect-plinko/poker/ |

Each page links to the other via a Classic / Poker toggle.

## Repo layout

```
/
├── index.html          # Plinko Four (~1,740 lines) — HTML + CSS + JS in one file
├── poker/
│   ├── index.html      # Plinko Poker (~8,880 lines) — same pattern
│   ├── version.json    # Poker release id (`v`) polled for refresh prompts
│   └── welcome-chip.png
├── .cursor/
│   ├── environment.json  # Cloud Agent VM: install + static server terminal
│   └── rules/            # always-on agent conventions
├── .nojekyll           # required for GitHub Pages
├── README.md           # player-facing overview
└── AGENTS.md           # this file
```

There are no other source directories. Almost all work lands in one of the two `index.html` files (plus `poker/version.json` when shipping a Poker refresh-worthy deploy).

## Local dev

```bash
python3 -m http.server 8080
```

- Classic: http://localhost:8080/
- Poker: http://localhost:8080/poker/

Refresh after edits. No compile or lint step in CI.

## Cursor Cloud specific instructions

Cloud Agents resolve env config from `.cursor/environment.json` first (then personal/team dashboard envs). This repo is zero-build — no npm, no Dockerfile.

| Piece | Value |
|-------|--------|
| Update / `install` | `python3 --version` (idempotent; confirms the static server toolchain) |
| Terminal | `static-server` → `python3 -m http.server 8080` (shared tmux) |
| Ports | `8080` |

**Validate UI/gameplay changes**

1. Confirm the static server is up (or start it yourself with the same command).
2. Classic: http://localhost:8080/ — Poker: http://localhost:8080/poker/
3. Hard-refresh after edits. Use browser/computer use to click through affected flows (drops, shop, VIP, Settings What’s New, etc.).
4. There is no automated test suite; screenshots or a short playthrough are the verification.

**Secrets / network** — none required for local play. Do not add API keys for this static site. If team egress is allowlisted, keep `cloud-agent-artifacts.s3.us-east-1.amazonaws.com` for demo artifacts.

**Optional dashboard follow-up** — after a successful Cloud run, save a VM snapshot from [Cloud Agents → Environments](https://cursor.com/dashboard/cloud-agents#environments) and add its `snapshot` id to `.cursor/environment.json` so future agents boot faster. Set default base branch to `master` in Cloud Agent settings if it is not already.

## Plinko Four (`index.html`)

Single IIFE at the bottom of the file. Key pieces:

| Area | What to search for |
|------|-------------------|
| Board geometry | `COLS`, `ROWS`, `CELL`, `PEG_ZONE`, `buildPegs` |
| Bumpers / rails | `addBumperRun`, `recomputeBumpers`, `collideBallWithBumpers` |
| Physics loop | `tick`, `stepBall`, `stepGridBall`, `resolveBallCollisions` |
| Grid / stacking | `stack`, `enterGridColumn`, `rebuildColumnFromStack` |
| Match-4 scoring | `findMatches`, `scoreGroups`, cascades in resolve path |
| Floor clear | board-full bottom-row wipe (search `floor` / bottom row) |
| Input | pointer handlers on `canvas` near end of file |

No `localStorage` save in classic — state is session-only.

## Plinko Poker (`poker/index.html`)

Also one IIFE. HTML shell (tabs, modals, rail) is above the `<script>` tag; game logic is below ~line 2211.

### Constants & data tables (search these names)

| Symbol | Purpose |
|--------|---------|
| `UPGRADE_DEFS` | Table shop upgrades (Auto Dealer, Big Blind, Cashier’s Cage / `compCage`, …) — order = shop order |
| `compCage` / `runCompCredit` | Cashier’s Cage (`unlockAt` 200): each chip buy banks +1 Cash Out comp (`runCompCredit`); steep costs (500k×2.2, late curve after Lv 20); high maxLevel sink that does not raise chip income; Pit Boss will buy it when cheapest |
| `PRESTIGE_DEFS` | VIP perks bought with comps after Cash Out (`aceSleeve`, `connect4`, `cardCounting`, `pinSplit`, `stormBeaches`, `siegeWeapons`, `kingMe`, `bigRoom`, …). Skill-bonus perks (`houseEdge` → Hot Streak, `quickDeal` → Auto Dealer, `pinPrivilege` → Pin Tip, `feltWax` → Felt Grease) use `prestigeBonusLevels`; `houseEdge.maxLevel` must match Hot Streak’s cap (10). |
| `flushMinLength` / `connect4` | Connect 4 VIP: `evaluateCards` treats flushes as valid at 4 suited cards when owned (straights stay 5) |
| `drawResolveHandLines` / `cellsFormLine` / `handGroupColor` | Paint-only flash connectors on `plateCtx` before seat holes are punched (plastic gaps only; no labels; skips Suit Purge). `handGroupColor`: flush family → suit via `flushHintColor`; straight → `PEG`; rank/pattern → ivory→gold by strength (also feeds score-popup color) |
| `pinSplitActive` / `spawnSplitTwin` / `PIN_SPLIT_*` | Percussive Mitosis (`pinSplit`): Auto Dealer ~10× slower via `dropSpawnMult` (manual taps unaffected); bifurcate on fresh peg hits (max gen 4); shrink in flight, full size in columns |
| `stormBeachesActive` / `detonateFallingBall` / `applyStormBlast` / `STORM_BEACHES_*` | Storm the Beaches: ~3× faster Auto Dealer; 22% chance to explode on fresh peg hits; blast knocks nearby in-flight chips |
| `siegeWeapons` / `siegeWeaponsActive` / `queueSiegeClear` / `beginSiegeClear` / `beginSiegeResolve` / `tryBeginSiegeColumnSlam` / `finishSiegeLand` / `pendingSiegeLand` / `siegeCardPayout` / `SIEGE_*` | Siege Weapons (toggleable): Lv1 bumper smash clears one column; Lv2 all columns on that bumper; Lv3 landing column slam with combo payout. Lv3 parks the spiked chip in `pendingSiegeLand` (no mid-flash re-entry); `applyExplosionClear` re-expands siege columns at explode time; `finishSiegeLand` re-queues the chip into `balls` before `commitBallToColumn`. |
| `kingMeActive` / `kingStackLevel` / `kingKindWeight` / `resolveKingMerges` / `tryKingMergeOnce` / `tryMergeKingBalls` / `tryMergeKingBallWithSettled` / `kingMergeLabel` / `KING_ME_*` / `KING_CROWN_SLAM_*` / `hasActiveCrownSlam` | King Me: same-suit equal-stack kings merge on contact anywhere — settled 4-dir (`tryKingMergeOnce`), falling↔falling (`tryMergeKingBalls` in `collideBalls`), or falling↔settled (`tryMergeKingBallWithSettled`); payout `KING_ME_MERGE_BASE * 2^tier`; popups `KING ME!` / `DOUBLE KING!` / `TRIPLE KING!` / …; `kingKindWeight` for of-a-kind; high-contrast crowns on the K via `drawKingCrowns` + `crownSlamAt` slam (`hasActiveCrownSlam` keeps the loop on grid/stack/balls); victim fallers flagged `kingMerged` then swept |
| `handTextTier` / `handPopupPunctuation` / `handPopupDuration` / `popupDurationForValue` / `TEXT_JUICE` | Score popup size/slam tier; of-a-kind punctuation (five `!?!`, six+ `‽`×(n−5)); duration scales with payout + extra linger for 6+ of a kind |
| `pushPopup` / `bakePopupSprite` / `separatePopupFromOthers` / `relaxPopupPositions` / `popupHalfExtents` / `trimPopups` / `popupFamily` / `popupWorth` / `MAX_POPUPS` / `expiresAt` | Score labels: baked offscreen sprite at spawn (`bakePopupSprite`; optional `subtext` second row for hand/King Me totals); spawn-time AABB nudge via `separatePopupFromOthers` (drift from `spawnX`/`spawnY`); multi-hand bursts call `relaxPopupPositions` so low-worth yields; per-frame `drawImage` + transform; draw order low→high `popupWorth`; value-scaled duration + `expiresAt` spacing (~160 ms); cap 120; over-cap drops by worth − duplicate index |
| `bigRoomActive` / `igniteNearbyFromBlast` / `markBallLit` / `handBurnMultiplier` / `stepBurning` / `BIG_ROOM_*` | Big Room: explosions instantly ignite settled cards (`BIG_ROOM_BLAST_IGNITE_R` 145) and in-flight chips (`BIG_ROOM_FLIGHT_IGNITE_R` 110 — tighter than Storm shove 280); `pendingBurn` transfers to the seat in `finalizeDrop`; `drawBurningOverlay(..., scale)` shrinks with Pin Split draw radius; burn ticks drip chips then ash out; hands with burning cards get +50%/card via `handBurnMultiplier`; King Me merges can spark a blast ignite |
| `stormBeachLandingPayout` | Storm the Beaches: chips when a card survives pegs and enters the grid (`enterGridColumn`) |
| `shortFuseActive` / `resolveSpeed` | Short Fuse (toggleable): speeds hand-clear flash/explode when On; Off keeps normal timing for combo/Card Counting setup |
| `purgeCardPayout` / `suitBombPickerMinimized` / `suitBombUiVisible` / `suitPurgePairPenalty` / `pickAutoSuitBombTarget` | Suit Purge: shop Hide/Show and bar tap minimize picker only (purges keep running); purge pays per card; auto-target ranks by pair-safe effective count but gates on raw cards in play (≥2) so Pin Split duplicate floods still cast |
| `maybeAutoBuy` / `PIT_BOSS_BUY_BATCH` / `PIT_BOSS_BUY_INTERVAL_MS` | Pit Boss (toggleable): up to 5 cheapest affordable shop buys per tick; `140` ms throttle |
| `dropSpawnMult` | Product of active spawn-rate perk multipliers for `autoDropIntervalMs` |
| `evaluateHandSlice` | Hand eval with Ace Up Your Sleeve ghost Ace; sets `sleeveUsed` when the ghost Ace strictly improves the hand; use instead of `evaluateCards` for board scoring |
| `forEachInPlayCard` / `cardCountingGroups` / `cardCountingFactor` / `cardCountingHandMultiplier` / `boardDuplicateExtras` / `effectiveMetaMultiplier` / `handPayoutMultiplier` | Card Counting: counts settled board + falling balls; Lv1–8 +8% per duplicate extra on hands; Lv9 product of paired rank+suit counts multiplies `runMetaMultiplier` |
| `upgradeCost` / `upgradeLevel` | Shop cost uses **effective** level (purchased + VIP bonus levels); `costLateAt` / `costLateBase` / `costLateScale` on a def switch to a pricier curve after that level (Auto Dealer Lv 7+, Felt Grease Lv 13+, Cashier’s Cage Lv 41+). VIP comp buys use `prestigeUpgradeCost` (perk level only). |
| `physicsSpeed` | Felt Grease: linear `1 + 0.22*lvl` through Lv 12, then `+0.08` per late level (sink without exploding collision speed) |
| `multiDealChance` / `rollMultiDealExtras` / `MULTI_DEAL_CHANCE_PER_LEVEL` | Multi Deal (unlockAt 8): +25% extra-card chance per level on each auto tick (max Lv 6 = 150%); above 100% rolls multiple extras |
| `upgradeEffectText` / `prestigeEffectText` / `shopMetaMultiplier` | Shop/VIP effect lines (stable; omit live Card Counting product via `*Display` helpers) |
| `levelMultParts` / `levelMultDetailTitle` / `#runLevelMult` | Live Blind / payout / combo / Card Counting mults on the Level HUD tile; `scheduleCountingUiRefresh` updates this only (not shop/VIP rows) |
| `ACHIEVEMENT_DEFS` | Permanent achievements (`CONTRACT_DEFS` is a legacy alias); `secret: true` stays hidden until `stat > 0`; infinite `scale.targetStep` = linear +N targets (`a_max_combo` uses step 1); Big Pot / Combo Payday use `targetGrowth: 10` after seed tiers |
| `achievementProgress` / `achievementProgShown` / `achievementProgTargetShown` | Floored progress numerator + last-painted tier target; skip identical prog HTML rewrites; pulse only when numerator rises |
| `achievementTiersReachedByStat` | Highest infinite/seed tier whose `target` a peak stat already clears (used to remap Big Pot / Combo Payday claims when `targetGrowth` changes) |
| `achievementName` | `a_max_combo` tier title: C-Combo, C-C-Combo… from active tier target |
| `QUEST_SLOT_UNLOCKS` | Run levels that add quest slots |
| `QUEST_RARITY_WEIGHTS_BY_INK` / `pickQuestRarity` | Quest Ink level (0–4) indexes per-rarity roll weights; max Ink favors Rare |
| `HAND_STAT` / `HAND_STAT_ALSO` / `sixKinds` / `fullerHouses` / `quadsFull` | Hand → lifetime/run counters; King Me adds `SIX OF A KIND`→`sixKinds` (7+ folds in), `FULLER HOUSE` (3+3), `QUADS FULL` (4+2); ALSO chains bump lower cats (six→five→four→trips; quads full→four/boat/fuller; fuller→boat/trips) |
| `a_six_kind` / `a_fuller_house` / `a_quads_full` | Secret infinite achievements: Clone Wars (`sixKinds`), Reboot (`fullerHouses`), Quads Full (`quadsFull`) |
| `sleeveHands` / `prestigeBought` / `settingsOpened` / `versionUpgrades` / `maxCombo` / `maxHandPayout` / `maxComboPayout` / `achievementClaims` | Achievement stats: sleeve Ace hands, VIP perk buys, first Settings open, app version upgrades, peak simultaneous COMBO ×N (`a_max_combo`, infinite), best single-hand chip payout (`a_hand_payout`), best COMBO resolve total (`a_combo_payout`), achievement tier claims (`a_claims`) |
| `SAVE_KEY` / `SETTINGS_KEY` | `localStorage` keys |
| `SAVE_VERSION` | Bump when save shape changes; handle migration in `loadSave` |
| `heaterChain` / `heaterChainForSave` / `resumeHeaterChain` / `heaterHoldUntilUse` | Persisted Hot Streak steps; restore into `pendingChain` after boot `freshState`; hold skips empty-board expire until next hand |
| `APP_RELEASE` | Alias of `CHANGELOG_LATEST_ID`; must match `poker/version.json` `v` |
| `appRelease` | Last stamped `APP_RELEASE` in the save; `loadSave` bumps `versionUpgrades` when newer |
| `RELEASE_URL` / `startReleasePolling` | Polls `poker/version.json` (cache-bust); shows `#updateBanner` when remote `v` is newer |
| `CHANGELOG` / `CHANGELOG_LATEST_ID` | Player-facing What’s New entries in Settings (newest-first; monotonic `id`); also the release poll version |
| `seenChangelogId` | Highest changelog `id` the player has opened in Settings (persisted in save) |
| `noteSettingsOpened` | First Settings visit → `settingsOpened` achievement stat |
| `noteChipEarn` / `updateChipRateUI` / `#chipRateVal` | Rolling chips/s under the Chips HUD (5s window from `awardChips`; clears on Cash Out / reset) |
| `formatNum` / `formatCompactSuffix` | HUD + score-pop chip/mult abbreviations: k → M B T Q; ≥1e18 → scientific (`1.2e18`) — skips Qi/Sx so Q stays uniquely quadrillion |

### Progression model (high level)

1. **Chips** — earn from scored poker hands; spend on table upgrades. HUD shows balance plus a live chips/s rate.
2. **Run level** — rises from chips *earned* this run (`lifetime`); unlocks shop rows and milestone rewards. Resets on Cash Out.
3. **Quests** — per-run slots (unlock from run Lv 2); Cash Out clears the board. Achievements persist.
4. **VIP / prestige** — Cash Out (run Lv 8+) collects Cash Out comps into the VIP balance for permanent `PRESTIGE_DEFS` perks. Achievement/quest `reward.comps` are **instant comps** (VIP balance immediately); `reward.runComps` / level `comps` are **Cash Out comps** (bank until Cash Out). Player-facing labels: `contractRewardText` (“instant comps” vs “Cash Out comps”).

Game design detail for players lives in `README.md`.

### Code areas (approximate line ranges)

| Lines (approx.) | Topic |
|-----------------|--------|
| 2211–2610 | Canvas setup, pegs, bumpers, card/chip rendering |
| 2610–3190 | State, upgrades, quests, achievements, prestige defs |
| 3300–4200 | Level math, shop UI helpers, VIP bonus levels |
| 4970–5200 | `persistSave`, `loadSave`, migrations, Cash Out / reset |
| 5800–6100 | Ball physics (`tick`, `stepBall`, collisions) |
| 6160–6500 | Hand detection, resolve hand lines (`drawResolveHandLines`), scoring payouts |
| ~6830 | `pushPopup` / `bakePopupSprite` / `clampPopupToBoard` / `separatePopupFromOthers` / `#popupLayer` — score labels bake once, hang up to `POPUP_OVERHANG` past the felt, nudge off neighbors at spawn |
| 6700–7100 | Floor clear, board-full escape, drawing cards on canvas |
| 7500–8900 | Rail tabs, quest UI, modals, init, keeper loop |

### Quest & achievement board UI

Quests and achievements share one card shell (`makeQuestCardShell`):

| Piece | Selector / function | Notes |
|-------|---------------------|--------|
| Quest list | `#quests`, `updateQuestsUI` | Per-run slots; progress via `activeQuestProgress` |
| Achievement list | `#achievements`, `updateAchievementsUI` | Permanent; panel `#panelAchievements` |
| Progress row | `.quest-progress-row` → `.quest-prog` | HTML: `<b>{numerator}</b> / {denominator}` |
| Progress bar | `.quest-bar > span` | Width from `progress / target` |
| Card styling | `.quest.achievement` | Gold accent (`#F0D78C`) on kind label + bar |
| List order | `compareAchievementButtons` / `achievementOrderBucketSig` | Progress-ratio sort when the tab is closed or reopened; while open, only reshuffle on claim-bucket changes (`achievementOrderBucketSignature`) so hover/click stay stable |

**Achievement numerator rules**

- Canonical value: `achievementProgress(def)` — `Math.floor(stat)` capped at the active tier target.
- Display: `formatNum(progress)` inside `.quest-prog b` (also floors at render time for large numbers).
- Completion still uses raw `achievementStatValue(def) >= tier.target` so claims are not delayed by flooring.
- UI refresh is debounced via `scheduleContractsUI` (120 ms) → `updateContractsUI`.

**Increment pulse (achievements only)**

When the floored numerator rises, `pulseAchievementNumerator` adds `.prog-pulse` to `.quest.achievement .quest-prog b`. `achievementProgShown` / `achievementProgTargetShown` store the last painted numerator and tier target so identical refreshes do not rewrite prog HTML, and the first paint and tier resets do not pulse. Reset both maps in `buildContracts` when cards are rebuilt.

### UI feedback (pulse animations)

Reuse the existing land-pulse pattern instead of inventing new motion:

| Target | Class | Helper | Keyframes |
|--------|-------|--------|-----------|
| Chip score box | `.score.chip-pulse` | `pulseScoreBox` | `chipLandPulse` |
| VIP comps pill | `.comps-pill.comp-pulse` | `pulseCompsBox` | `compLandPulse` |
| Achievement prog numerator | `.quest-prog b.prog-pulse` | `pulseAchievementNumerator` | `achievementProgPulse` |

All helpers restart CSS animation with `el.classList.remove(...); void el.offsetWidth; el.classList.add(...)` and clear via `setTimeout` (~340 ms). Inline numerators that scale need `display: inline-block` on the `<b>` (see `.quest.achievement .quest-prog b`).

### Rail tab badges

`setTabBadge(panel, count, opts)` paints `#badgeUpgrades` / `#badgeQuests` / `#badgeAchievements` / `#badgeVip` (Settings uses its own path). Count badges show a number; `hasNewUnlockBadge` wins with a red `.is-new` empty dot. Optional `opts.empty` shows a numberless `.is-dot` badge when count is 0 (VIP: Cash Out ready with no affordable perks — Cash Out never increments the VIP count).

### Physics & board

Poker shares the same 7×6 grid and peg zone as classic. The `stack` array holds per-column occupants (settled cards + in-flight balls); gravity/clear passes update ball target rows in place.

**Chain carryover:** `chainStep` / `pendingChain` keep the heater alive while blast pucks are still in flight (`finishResolveOrChain` → `beginResolveChain`). `enterFlash` advances `chainStep` by `groups.length` (COMBO ×N steps the heater N times). Suit Purge preserves `pendingChain` and scores with chain mult `1` (no CHAIN banner) so Hot Streak alone does not flash a fake low ×N; the next real hand restores the carryover via `finishResolveOrChain`.

**Persisted heater:** `heaterChainForSave()` writes `heaterChain` into the save (active `chainStep` during a hand resolve, else `pendingChain`; Suit Purge keeps `pendingChain`; floor clear → 0). `loadSave` stashes it in `resumeHeaterChain`; after boot `freshState()` that value is copied into `pendingChain` so refresh/update does not reset the streak. `heaterHoldUntilUse` skips the empty-board idle expire until `beginResolveChain` advances the heater once (board is empty on load). Cash Out / hard reset clear it before `persistSave`.

**Combo popups:** `comboPopupJuice(n)` / `spawnPopups` — COMBO ×N banner size/slam/glow scale with simultaneous hands; multi-hand clears fan per-hand labels (`CELL * 0.4`) and park COMBO lower (`CELL * 1.2`). Multi-hand clears call `spawnStaggeredChainPopups` (`CHAIN_POP_STAGGER_MS`, `CHAIN_POP_STACK_GAP` 52) so each heater step gets its own delayed CHAIN slam (`t0` in the future; draw skips `age < 0`), then `relaxPopupPositions` so low-worth yields. `trimPopups` uses `popupFamily` / `popupWorth` / `handPopupWorth`: duplicate labels in a family (PAIR, COMBO, CHAIN, …) drop after the best copy; lower hands and smaller COMBO/CHAIN × yield before rarer ones. Labels bake via `bakePopupSprite` at spawn (`subtext` = smaller chip total under hand / King Me titles); `separatePopupFromOthers` nudges labels off active ones (drift capped from `spawnX`/`spawnY`); the draw loop `drawImage`s sprites in low→high `popupWorth` order so stronger hands/combos land on top.

### Saves

- `persistSave` / `scheduleSave` — debounced writes to `localStorage`.
- When adding fields, bump `SAVE_VERSION` and add migration logic in `loadSave`.
- `ACHIEVEMENT_LEGACY_CLAIMS` maps retired achievement ids for old saves.
- `seenChangelogId` — missing/invalid loads as `0` so existing saves get the Settings red badge once for seeded entries.
- `heaterChain` — Hot Streak steps surviving refresh (see **Persisted heater** above); missing → 0.
- v26 — retired Card Sense / near-hand hints; `loadSave` refunds 4 comps once if the old VIP or shop row was owned.

### Settings changelog (What’s New)

Settings shows a **What’s new** list (`CHANGELOG` near `SAVE_VERSION`) and a red-dot badge on the Settings rail tab (`#badgeSettings`, `.rail-tab-badge.is-new`) when `seenChangelogId < CHANGELOG_LATEST_ID`. Opening Settings calls `openSettingsChangelog()`: it sets `changelogHighlightFloor` from the save’s prior `seenChangelogId`, re-renders so entries with `id > floor` get `.changelog-entry.is-new` + a **New** tag, then `markChangelogSeen()` (sets `seenChangelogId` to `CHANGELOG_LATEST_ID` and saves). Hard reset keeps the changelog marked seen (reset is launched from Settings).

**Agents: keep this updated.** When you ship a player-visible Poker change (new upgrade/perk, progression tweak, notable UX), prepend a new object to `CHANGELOG` with:

1. `id` — strictly greater than the current max (`CHANGELOG_LATEST_ID` is derived).
2. `date` — calendar label with day (e.g. `'Jul 25, 2026'`), not month-only.
3. `title` — one short headline.
4. `items` — 1–4 concise player-facing bullets (skip pure docs/agent/internal fixes).
5. Set `poker/version.json` `"v"` to that same new `id` (release poll uses it; `APP_RELEASE` is `CHANGELOG_LATEST_ID`).

That new `id` lights the Settings badge and highlights only that entry (and any other unseen ids) for returning saves. Do not reuse or renumber old ids. Render path: `openSettingsChangelog` / `renderChangelog` → `#changelogList`; badge: `updateSettingsChangelogBadge`.

### Changelog merge conflicts (fast path)

Most rebase/merge conflicts against `master` are only the top of `CHANGELOG` plus `poker/version.json`. Treat them as an id-assignment problem, not a content merge:

1. **Prefer master’s list.** Take `origin/master`’s `CHANGELOG` array as the base (keep every existing entry and its `id` untouched).
2. **Keep your new entry’s copy.** From the conflict, salvage only *your* new object(s) — title/items/date — not the `id` you assigned while the branch was open.
3. **Renumber yours to `max + 1`.** Read the highest `id` now on master (or `poker/version.json` `"v"` on master — same number). Set your entry’s `id` to that + 1. If you added multiple entries, assign consecutive ids above master’s max. Never renumber or rewrite master’s entries; never reuse an id that already shipped.
4. **Prepend, newest-first.** Place your renumbered object(s) at the top of the array, then the untouched master list.
5. **Sync `poker/version.json`.** Set `"v"` to the new max id (same as your newest entry). `CHANGELOG_LATEST_ID` / `APP_RELEASE` derive from the array — no separate constant to edit.
6. **Finish the rebase/merge** and continue. If non-changelog hunks also conflict, resolve those normally; do not let a version.json “ours/theirs” pick overwrite the max-id rule above.

**Prevention (cheap):** rebase onto latest `master` *before* writing the changelog entry and bumping `version.json`, or add the changelog last (right before opening/updating the PR). Parallel agent PRs almost always collide on the same next id.

**Sanity check after resolve:**

```bash
# top CHANGELOG id must equal version.json v and be unique / monotonic
python3 - <<'PY'
import json,re
html=open('poker/index.html').read()
ids=[int(x) for x in re.findall(r"id:\s*(\d+)", html.split("const CHANGELOG")[1].split("const CHANGELOG_LATEST_ID")[0])]
v=json.load(open('poker/version.json'))["v"]
assert ids==sorted(ids, reverse=True), ids
assert len(ids)==len(set(ids)), ids
assert ids[0]==v, (ids[0], v)
print("ok", v, "entries", len(ids))
PY
```

### Release poll (refresh banner)

Poker-only. Polls **`poker/version.json`** (`{ "v": <int> }`) every 5 minutes (wall-clock via `releaseCheckDue` / `lastReleaseCheckAt`) and when the tab resumes (`visibilitychange`, `pageshow`, `window` `focus` → `resumeReleaseCheck`). The page’s `APP_RELEASE` is **`CHANGELOG_LATEST_ID`**; if the hosted `v` is greater, `#updateBanner` offers **Refresh** (cache-busted reload after `persistSave`). Dismiss stores that remote `v` in `localStorage` (`plinkoPokerReleaseDismissed`) so the same release is not re-prompted.

No separate release counter — bumping a changelog `id` and setting `poker/version.json` `"v"` to match is enough. Missed `version.json` bumps only delay the refresh prompt.

## Common agent tasks

| Task | Where to edit |
|------|----------------|
| Multi Deal extras | `multiDealChance` / `rollMultiDealExtras` in `tryAutoDrop` via `autoDropOnce` |
| Cashier’s Cage (chip→comp sink) | `compCage` in `UPGRADE_DEFS`; `purchaseUpgrade` adds `runCompCredit`; effect via `upgradeEffectText` |
| Auto Dealer two-tier costs | `costLateAt` / `costLateBase` / `costLateScale` on `autoDealer` def; `upgradeCost` |
| New VIP perk | `PRESTIGE_DEFS`, `prestigeEffectText`, buy UI; skill bonuses via `prestigeBonusLevels`; hand cheats via `evaluateHandSlice` / `handPayoutMultiplier` / `flushMinLength` (Connect 4); Pin Split via `pinSplitActive` / peg hit in `stepBall` |
| Pin Split spawn / split | `autoDropIntervalMs` × `dropSpawnMult` only (no manual cooldown), `canSplitBall` / `spawnSplitTwin` on fresh peg hits, size reset in `enterGridColumn` / `drawBall` (Percussive Mitosis) |
| Storm the Beaches | `stormBeachesActive` / `STORM_BEACHES_EXPLODE_CHANCE` on fresh peg hits → `detonateFallingBall` / `applyStormBlast` + `sweepExplodedBalls`; spawn via `stormBeachesSpawnMult` in `dropSpawnMult` |
| Siege Weapons | `dealCard` spike roll when `siegeWeaponsActive`; bumper smash → column(s) clear; Lv3 `tryBeginSiegeColumnSlam` → `pendingSiegeLand` / `finishSiegeLand`; siege clears re-scanned in `applyExplosionClear`; toggle via `AUTO_TOGGLE_IDS` |
| King Me | `kingMeActive` / `resolveKingMerges` on `finalizeDrop` / post-clear; flight merges via `tryMergeKingBalls` / `tryMergeKingBallWithSettled` in collide paths; `kingMergeLabel` / `kingKindWeight` / `drawKingCrowns` / `crownSlamAt`; Big Room merge sparks `spawnExplosion` |
| Big Room blast ignite | `bigRoomActive` / `spawnExplosion` → `igniteNearbyFromBlast` (settled + `markBallLit` fallers); `finalizeDrop` applies `pendingBurn`; `handBurnMultiplier` / `countBurningInCells` in `findPokerHands`; `stepBurning` / `ashOutStackEntry` (`noIgnite`); King Me merge spark via `spawnExplosion` in `tryKingMergeOnce` |
| Storm the Beaches landing | `stormBeachLandingPayout` in `enterGridColumn` when peg → grid |
| Short Fuse toggle | `shortFuseActive` / `resolveSpeed` / `flashPulseCount`; `toggleable` on `shortFuse` def + `AUTO_TOGGLE_IDS` |
| Suit Purge UI | `#suitBombBar`, `suitBombUiVisible` / `suitBombPickerMinimized`, `updateSuitBombUI`; shop Hide/Show and bar tap minimize picker only |
| New achievement | `ACHIEVEMENT_DEFS`, `achievementProgress` / claim checks, `updateAchievementsUI` |
| Achievement progress pulse / numerator | `achievementProgress`, `achievementProgShown`, `pulseAchievementNumerator`, CSS near `.quest-progress-row` |
| New quest template | quest template array near `QUEST_SLOT_UNLOCKS` |
| Hand scoring / stats | hand detection block ~6160+, `HAND_STAT` wiring |
| UI tab / modal | HTML above script + rail refresh functions ~7500+ |
| Settings changelog / What’s New badge | Prepend to `CHANGELOG` (new monotonic `id`); see **Settings changelog** above |
| Prompt open Poker tabs to refresh after deploy | Same as changelog: new `CHANGELOG` `id` + set `poker/version.json` `v` to that id |
| Classic gameplay | `index.html` only |

## Git & PR workflow

- **Base branch:** `master` (also the Pages deploy branch).
- **Feature branches:** `cursor/<short-description>-<suffix>` (cloud agents use suffix `65f3`).
- **Before you commit:** see `.cursor/rules/agent-workflow.mdc` — especially the merged-branch check.
- **Changelog conflicts on rebase:** see **Changelog merge conflicts (fast path)** above — almost always “keep master list, renumber your entry to max+1, sync `version.json`”.
- Open PRs against `master`. Merged PRs deploy automatically via Pages.

### Check if a branch is already merged

Before continuing work on an existing `cursor/*` branch:

```bash
git fetch origin master
git merge-base --is-ancestor origin/<branch> origin/master && echo "MERGED — create a new branch" || echo "NOT merged — OK to continue"
```

Or list merged cursor branches:

```bash
git branch -r --merged origin/master | grep cursor/
```

If the branch is merged, **do not** push new commits on it — check out `master`, pull, and create a fresh `cursor/...` branch.

## What not to do

- Do not add npm/webpack unless explicitly requested — the site is intentionally zero-build.
- Do not split into modules without a clear request; the monolith pattern is deliberate.
- Do not change `SAVE_KEY` or wipe saves without migration.
- Do not edit unrelated game (classic vs poker) when the task targets one mode.
- When you change documented behavior or add new symbols/helpers, update **`AGENTS.md`** (and `README.md` when players would notice).

## Player docs

`README.md` is the human-facing feature list and hosting notes. Update it when player-visible behavior changes materially.
