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
| `UPGRADE_DEFS` | Table shop upgrades (Auto Dealer, Big Blind, …) — order = shop order |
| `PRESTIGE_DEFS` | VIP perks bought with comps after Cash Out |
| `upgradeCost` / `upgradeLevel` | Shop cost uses **effective** level (purchased + VIP bonus levels) |
| `upgradeEffectText` / `payoutMultLabels` | Shop effect line; Blind / payout / combo mults on Pin Tip, Rail Tax, Sweep Stakes, Hot Streak, Big Blind |
| `ACHIEVEMENT_DEFS` | Permanent achievements (`CONTRACT_DEFS` is a legacy alias) |
| `achievementProgress` / `achievementProgShown` | Floored progress numerator; last-painted value for increment pulse |
| `QUEST_SLOT_UNLOCKS` | Run levels that add quest slots |
| `HAND_STAT` / `RUN_HAND_STAT` | Lifetime vs per-run hand counters |
| `HAND_STAT_ALSO` / `RUN_HAND_STAT_ALSO` | Higher hands counting toward lower stats |
| `SAVE_KEY` / `SETTINGS_KEY` | `localStorage` keys |
| `SAVE_VERSION` | Bump when save shape changes; handle migration in `loadSave` |
| `APP_RELEASE` | Alias of `CHANGELOG_LATEST_ID`; must match `poker/version.json` `v` |
| `RELEASE_URL` / `startReleasePolling` | Polls `poker/version.json` (cache-bust); shows `#updateBanner` when remote `v` is newer |
| `CHANGELOG` / `CHANGELOG_LATEST_ID` | Player-facing What’s New entries in Settings (newest-first; monotonic `id`); also the release poll version |
| `seenChangelogId` | Highest changelog `id` the player has opened in Settings (persisted in save) |

### Progression model (high level)

1. **Chips** — earn from scored poker hands; spend on table upgrades.
2. **Run level** — rises from chips *earned* this run (`lifetime`); unlocks shop rows and milestone rewards. Resets on Cash Out.
3. **Quests** — per-run slots (unlock from run Lv 2); Cash Out clears the board. Achievements persist.
4. **VIP / prestige** — Cash Out (run Lv 8+) banks comps for permanent `PRESTIGE_DEFS` perks.

Game design detail for players lives in `README.md`.

### Code areas (approximate line ranges)

| Lines (approx.) | Topic |
|-----------------|--------|
| 2211–2610 | Canvas setup, pegs, bumpers, card/chip rendering |
| 2610–3190 | State, upgrades, quests, achievements, prestige defs |
| 3300–4200 | Level math, shop UI helpers, VIP bonus levels |
| 4970–5200 | `persistSave`, `loadSave`, migrations, Cash Out / reset |
| 5800–6100 | Ball physics (`tick`, `stepBall`, collisions) |
| 6160–6500 | Hand detection, near-miss guides, scoring payouts |
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

**Achievement numerator rules**

- Canonical value: `achievementProgress(def)` — `Math.floor(stat)` capped at the active tier target.
- Display: `formatNum(progress)` inside `.quest-prog b` (also floors at render time for large numbers).
- Completion still uses raw `achievementStatValue(def) >= tier.target` so claims are not delayed by flooring.
- UI refresh is debounced via `scheduleContractsUI` (120 ms) → `updateContractsUI`.

**Increment pulse (achievements only)**

When the floored numerator rises, `pulseAchievementNumerator` adds `.prog-pulse` to `.quest.achievement .quest-prog b`. `achievementProgShown` (per achievement id) stores the last painted numerator so the first paint and tier resets do not pulse. Reset `achievementProgShown` in `buildContracts` when cards are rebuilt.

### UI feedback (pulse animations)

Reuse the existing land-pulse pattern instead of inventing new motion:

| Target | Class | Helper | Keyframes |
|--------|-------|--------|-----------|
| Chip score box | `.score.chip-pulse` | `pulseScoreBox` | `chipLandPulse` |
| VIP comps pill | `.comps-pill.comp-pulse` | `pulseCompsBox` | `compLandPulse` |
| Achievement prog numerator | `.quest-prog b.prog-pulse` | `pulseAchievementNumerator` | `achievementProgPulse` |

All helpers restart CSS animation with `el.classList.remove(...); void el.offsetWidth; el.classList.add(...)` and clear via `setTimeout` (~340 ms). Inline numerators that scale need `display: inline-block` on the `<b>` (see `.quest.achievement .quest-prog b`).

### Physics & board

Poker shares the same 7×6 grid and peg zone as classic. The `stack` array holds per-column occupants (settled cards + in-flight balls); gravity/clear passes update ball target rows in place.

### Saves

- `persistSave` / `scheduleSave` — debounced writes to `localStorage`.
- When adding fields, bump `SAVE_VERSION` and add migration logic in `loadSave`.
- `ACHIEVEMENT_LEGACY_CLAIMS` maps retired achievement ids for old saves.
- `seenChangelogId` — missing/invalid loads as `0` so existing saves get the Settings red badge once for seeded entries.

### Settings changelog (What’s New)

Settings shows a **What’s new** list (`CHANGELOG` near `SAVE_VERSION`) and a red-dot badge on the Settings rail tab (`#badgeSettings`, `.rail-tab-badge.is-new`) when `seenChangelogId < CHANGELOG_LATEST_ID`. Opening Settings calls `openSettingsChangelog()`: it sets `changelogHighlightFloor` from the save’s prior `seenChangelogId`, re-renders so entries with `id > floor` get `.changelog-entry.is-new` + a **New** tag, then `markChangelogSeen()` (sets `seenChangelogId` to `CHANGELOG_LATEST_ID` and saves). Hard reset keeps the changelog marked seen (reset is launched from Settings).

**Agents: keep this updated.** When you ship a player-visible Poker change (new upgrade/perk, progression tweak, notable UX), prepend a new object to `CHANGELOG` with:

1. `id` — strictly greater than the current max (`CHANGELOG_LATEST_ID` is derived).
2. `date` — calendar label with day (e.g. `'Jul 25, 2026'`), not month-only.
3. `title` — one short headline.
4. `items` — 1–4 concise player-facing bullets (skip pure docs/agent/internal fixes).
5. Set `poker/version.json` `"v"` to that same new `id` (release poll uses it; `APP_RELEASE` is `CHANGELOG_LATEST_ID`).

That new `id` lights the Settings badge and highlights only that entry (and any other unseen ids) for returning saves. Do not reuse or renumber old ids. Render path: `openSettingsChangelog` / `renderChangelog` → `#changelogList`; badge: `updateSettingsChangelogBadge`.

### Release poll (refresh banner)

Poker-only. Polls **`poker/version.json`** (`{ "v": <int> }`) every 5 minutes and when the tab becomes visible. The page’s `APP_RELEASE` is **`CHANGELOG_LATEST_ID`**; if the hosted `v` is greater, `#updateBanner` offers **Refresh** (cache-busted reload after `persistSave`). Dismiss stores that remote `v` in `localStorage` (`plinkoPokerReleaseDismissed`) so the same release is not re-prompted.

No separate release counter — bumping a changelog `id` and setting `poker/version.json` `"v"` to match is enough. Missed `version.json` bumps only delay the refresh prompt.

## Common agent tasks

| Task | Where to edit |
|------|----------------|
| New table upgrade | `UPGRADE_DEFS`, buy UI, any skill-specific logic |
| New VIP perk | `PRESTIGE_DEFS`, comp shop, bonus helpers (`vipBonusLevel`, etc.) |
| New achievement | `ACHIEVEMENT_DEFS`, `achievementProgress` / claim checks, `updateAchievementsUI` |
| Achievement progress pulse / numerator | `achievementProgress`, `achievementProgShown`, `pulseAchievementNumerator`, CSS near `.quest-progress-row` |
| New quest template | quest template array near `QUEST_SLOT_UNLOCKS` |
| Hand scoring / stats | hand detection block ~6160+, `HAND_STAT` wiring |
| Suit Purge UI | `#suitBombBar`, `suitBombUiVisible` / `autoEnabled.suitBomb`, `updateSuitBombUI`; first Auto Purge buy collapses picker; tap bar chrome toggles Hide/Show |
| UI tab / modal | HTML above script + rail refresh functions ~7500+ |
| Settings changelog / What’s New badge | Prepend to `CHANGELOG` (new monotonic `id`); see **Settings changelog** above |
| Prompt open Poker tabs to refresh after deploy | Same as changelog: new `CHANGELOG` `id` + set `poker/version.json` `v` to that id |
| Classic gameplay | `index.html` only |

## Git & PR workflow

- **Base branch:** `master` (also the Pages deploy branch).
- **Feature branches:** `cursor/<short-description>-<suffix>` (cloud agents use suffix `65f3`).
- **Before you commit:** see `.cursor/rules/agent-workflow.mdc` — especially the merged-branch check.
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
