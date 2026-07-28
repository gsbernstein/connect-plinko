// Permanent achievements (quests use QUEST_TEMPLATES). Loaded by poker/index.html.
window.ACHIEVEMENT_DEFS = [
    {
      id: 'a_first_hand', kind: 'achievement', name: 'First Pot',
      desc: 'Score your first poker hand.',
      stat: 'hands', unlockAt: 1,
      tiers: [{ target: 1, reward: { chips: 25 } }]
    },
    {
      id: 'a_hands', kind: 'achievement', name: 'Table Regular',
      desc: 'Score {n} hands lifetime.',
      stat: 'hands', unlockAt: 1, infinite: true,
      scale: { targetGrowth: 2.5, compPerLevel: 1, compCap: 30 },
      tiers: [
        { target: 50, reward: { comps: 1 } },
        { target: 250, reward: { comps: 3 } },
        { target: 1000, reward: { comps: 5 } },
        { target: 5000, reward: { comps: 10 } }
      ]
    },
    {
      id: 'a_flush', kind: 'achievement', name: 'Suited Up',
      desc: 'Score {n} Flushes.',
      stat: 'flushes', unlockAt: 1, infinite: true,
      scale: { targetGrowth: 2.2, compPerLevel: 1, chipBase: 80, chipGrowth: 1.35, compCap: 25 },
      tiers: [
        { target: 1, reward: { chips: 120, runComps: 1 } },
        { target: 10, reward: { comps: 1 } },
        { target: 50, reward: { comps: 2 } },
        { target: 200, reward: { comps: 4 } }
      ]
    },
    {
      id: 'a_straight', kind: 'achievement', name: 'All In Order',
      desc: 'Score {n} Straights.',
      stat: 'straights', unlockAt: 1, infinite: true,
      scale: { targetGrowth: 2.2, compPerLevel: 1, chipBase: 80, chipGrowth: 1.35, compCap: 25 },
      tiers: [
        { target: 1, reward: { chips: 120 } },
        { target: 10, reward: { comps: 1 } },
        { target: 50, reward: { comps: 2 } },
        { target: 200, reward: { comps: 4 } }
      ]
    },
    {
      id: 'a_fullhouse', kind: 'achievement', name: 'Full Boat',
      desc: 'Score {n} Full Houses.',
      stat: 'fullHouses', unlockAt: 1, infinite: true,
      scale: { targetGrowth: 2.1, compPerLevel: 1, chipBase: 100, chipGrowth: 1.3, compCap: 25 },
      tiers: [
        { target: 1, reward: { chips: 200, comps: 1 } },
        { target: 5, reward: { comps: 2 } },
        { target: 25, reward: { comps: 3 } },
        { target: 100, reward: { comps: 5 } }
      ]
    },
    {
      id: 'a_fuller_house', kind: 'achievement', name: 'Reboot',
      desc: 'Score {n} Fuller Houses (two trips, via King Me stacks).',
      stat: 'fullerHouses', secret: true, infinite: true,
      scale: { targetGrowth: 2.0, compPerLevel: 1, compCap: 30 },
      tiers: [
        { target: 1, reward: { comps: 2 } },
        { target: 3, reward: { comps: 3 } },
        { target: 10, reward: { comps: 5 } },
        { target: 40, reward: { comps: 7 } }
      ]
    },
    {
      id: 'a_quads_full', kind: 'achievement', name: 'Quads Full',
      desc: 'Score {n} Quads Full hands (four + a pair, via King Me stacks).',
      stat: 'quadsFull', secret: true, infinite: true,
      scale: { targetGrowth: 1.9, compPerLevel: 1, compCap: 30 },
      tiers: [
        { target: 1, reward: { comps: 3 } },
        { target: 3, reward: { comps: 4 } },
        { target: 10, reward: { comps: 6 } },
        { target: 30, reward: { comps: 8 } }
      ]
    },
    {
      id: 'a_quads', kind: 'achievement', name: 'Quad Squad',
      desc: 'Score {n} Four of a Kinds.',
      stat: 'fourKinds', unlockAt: 1, infinite: true,
      scale: { targetGrowth: 2.0, compPerLevel: 1, compCap: 30 },
      tiers: [
        { target: 1, reward: { comps: 2 } },
        { target: 3, reward: { comps: 3 } },
        { target: 15, reward: { comps: 4 } },
        { target: 50, reward: { comps: 6 } }
      ]
    },
    {
      id: 'a_six_kind', kind: 'achievement', name: 'Clone Wars',
      desc: 'Score {n} Six of a Kinds (or better).',
      stat: 'sixKinds', secret: true, infinite: true,
      scale: { targetGrowth: 1.85, compPerLevel: 2, compCap: 40 },
      tiers: [
        { target: 1, reward: { comps: 4 } },
        { target: 3, reward: { comps: 6 } },
        { target: 10, reward: { comps: 8 } },
        { target: 25, reward: { comps: 12 } }
      ]
    },
    {
      id: 'a_sf', kind: 'achievement', name: 'Painted Straight',
      desc: 'Score {n} Straight Flushes.',
      stat: 'straightFlushes', secret: true, infinite: true,
      scale: { targetGrowth: 1.85, compPerLevel: 1, compCap: 35 },
      tiers: [
        { target: 1, reward: { comps: 3 } },
        { target: 3, reward: { comps: 5 } },
        { target: 10, reward: { comps: 8 } }
      ]
    },
    {
      id: 'a_royal', kind: 'achievement', name: 'Crown Jewel',
      desc: 'Score {n} Royal Flushes.',
      stat: 'royalFlushes', secret: true, infinite: true,
      scale: { targetGrowth: 1.75, compPerLevel: 2, compCap: 40 },
      tiers: [
        { target: 1, reward: { comps: 5 } },
        { target: 2, reward: { comps: 8 } },
        { target: 5, reward: { comps: 12, prestige: 'compCard' } }
      ]
    },
    {
      id: 'a_combo', kind: 'achievement', name: 'Double Down',
      desc: 'Score {n} multi-hand clears.',
      stat: 'multiHandClears', unlockAt: 1, infinite: true,
      scale: { targetGrowth: 2.3, compPerLevel: 1, chipBase: 100, chipGrowth: 1.35, compCap: 25 },
      tiers: [
        { target: 10, reward: { comps: 1 } },
        { target: 50, reward: { comps: 3 } },
        { target: 200, reward: { comps: 5 } }
      ]
    },
    {
      id: 'a_max_combo', kind: 'achievement', name: 'C-Combo',
      desc: 'Get a COMBO ×{n}.',
      stat: 'maxCombo', unlockAt: 1, infinite: true,
      scale: { targetStep: 1, compPerLevel: 2, compCap: 40 },
      tiers: [
        { target: 2, reward: { chips: 200 } },
        { target: 3, reward: { comps: 2 } },
        { target: 4, reward: { comps: 4 } },
        { target: 5, reward: { comps: 8 } }
      ]
    },
    {
      id: 'a_hand_payout', kind: 'achievement', name: 'Big Pot',
      desc: 'Score a single hand worth {n} chips or more.',
      stat: 'maxHandPayout', unlockAt: 1, infinite: true,
      // ~10× per infinite tier — chip multipliers outrun the old 2.2× curve quickly.
      scale: { targetGrowth: 10, compPerLevel: 1, chipBase: 80, chipGrowth: 1.35, compCap: 30 },
      tiers: [
        { target: 50, reward: { chips: 100 } },
        { target: 200, reward: { comps: 1 } },
        { target: 1000, reward: { comps: 2 } },
        { target: 5000, reward: { comps: 4 } }
      ]
    },
    {
      id: 'a_combo_payout', kind: 'achievement', name: 'Combo Payday',
      desc: 'Score a COMBO resolve worth {n} chips or more.',
      stat: 'maxComboPayout', unlockAt: 1, infinite: true,
      scale: { targetGrowth: 10, compPerLevel: 1, chipBase: 120, chipGrowth: 1.35, compCap: 30 },
      tiers: [
        { target: 100, reward: { chips: 150 } },
        { target: 500, reward: { comps: 1 } },
        { target: 2500, reward: { comps: 2 } },
        { target: 10000, reward: { comps: 4 } }
      ]
    },
    {
      id: 'a_chip_rate', kind: 'achievement', name: 'Chip Flood',
      desc: 'Reach {n} chips/s.',
      stat: 'maxChipRate', unlockAt: 1, infinite: true,
      // Same ~10× infinite curve as Big Pot / Combo Payday — income scales with mults.
      scale: { targetGrowth: 10, compPerLevel: 1, chipBase: 80, chipGrowth: 1.35, compCap: 30 },
      tiers: [
        { target: 10, reward: { chips: 100 } },
        { target: 50, reward: { comps: 1 } },
        { target: 250, reward: { comps: 2 } },
        { target: 1000, reward: { comps: 4 } }
      ]
    },
    {
      id: 'a_floor', kind: 'achievement', name: 'Janitor',
      desc: 'Trigger {n} floor clears.',
      stat: 'floorClears', unlockAt: 1, infinite: true,
      scale: { targetGrowth: 2.4, compPerLevel: 1, compCap: 30 },
      tiers: [
        { target: 10, reward: { comps: 2 } },
        { target: 50, reward: { comps: 3 } },
        { target: 200, reward: { comps: 5 } },
        { target: 1000, reward: { comps: 8 } }
      ]
    },
    {
      id: 'a_cashout', kind: 'achievement', name: 'Buy-In Club',
      desc: 'Cash Out {n} times.',
      stat: 'cashOuts', unlockAt: 1, infinite: true,
      scale: { targetGrowth: 1.9, compPerLevel: 1, compCap: 35 },
      tiers: [
        { target: 1, reward: { comps: 1 } },
        { target: 5, reward: { comps: 3, prestige: 'compCard' } },
        { target: 15, reward: { comps: 5 } },
        { target: 30, reward: { comps: 8 } }
      ]
    },
    {
      id: 'a_level', kind: 'achievement', name: 'Deep Stack',
      desc: 'Reach run level {n} in a single table.',
      stat: 'maxRunLevel', unlockAt: 1,
      tiers: [
        { target: 20, reward: { comps: 3 } },
        { target: 50, reward: { comps: 4 } },
        { target: 100, reward: { comps: 6 } },
        { target: 150, reward: { comps: 8 } },
        { target: 200, reward: { comps: 12 } }
      ]
    },
    {
      id: 'a_upgrades', kind: 'achievement', name: 'Rack Builder',
      desc: 'Buy {n} table upgrades.',
      stat: 'upgradesBought', unlockAt: 1, infinite: true,
      scale: { targetGrowth: 2.1, compPerLevel: 1, compCap: 30 },
      tiers: [
        { target: 20, reward: { comps: 2 } },
        { target: 50, reward: { comps: 3 } },
        { target: 100, reward: { comps: 5 } },
        { target: 250, reward: { comps: 8 } }
      ]
    },
    {
      id: 'a_purges', kind: 'achievement', name: 'Suit Sanitizer',
      desc: 'Cast Suit Purge {n} times.',
      stat: 'suitPurges', unlockAt: 11, infinite: true,
      scale: { targetGrowth: 2.3, compPerLevel: 1, compCap: 25 },
      tiers: [
        { target: 10, reward: { comps: 2 } },
        { target: 50, reward: { comps: 3 } },
        { target: 200, reward: { comps: 5 } }
      ]
    },
    {
      id: 'a_sleeve', kind: 'achievement', name: 'Ace in the Hole',
      desc: 'Score {n} hands that used the sleeve Ace.',
      stat: 'sleeveHands', unlockAt: 1, infinite: true,
      scale: { targetGrowth: 2.2, compPerLevel: 1, chipBase: 150, chipGrowth: 1.3, compCap: 30 },
      tiers: [
        { target: 1, reward: { chips: 250, comps: 1 } },
        { target: 10, reward: { comps: 2 } },
        { target: 50, reward: { comps: 4 } },
        { target: 200, reward: { comps: 6 } }
      ]
    },
    {
      id: 'a_big_room', kind: 'achievement', name: 'I Didn\'t Ask How Big The Room Was',
      desc: 'Light {n} cards on fire.',
      stat: 'cardsIgnited', secret: true, infinite: true,
      scale: { targetGrowth: 2.2, compPerLevel: 1, chipBase: 100, chipGrowth: 1.3, compCap: 30 },
      tiers: [
        { target: 10, reward: { chips: 200, comps: 1 } },
        { target: 50, reward: { comps: 2 } },
        { target: 200, reward: { comps: 4 } },
        { target: 1000, reward: { comps: 6 } }
      ]
    },
    {
      id: 'a_perks', kind: 'achievement', name: 'Lounge Regular',
      desc: 'Buy {n} VIP perks.',
      stat: 'prestigeBought', unlockAt: 8, infinite: true,
      scale: { targetGrowth: 1.9, compPerLevel: 1, compCap: 30 },
      tiers: [
        { target: 1, reward: { comps: 1 } },
        { target: 5, reward: { comps: 2 } },
        { target: 15, reward: { comps: 4 } },
        { target: 40, reward: { comps: 6 } }
      ]
    },
    {
      id: 'a_claims', kind: 'achievement', name: 'Trophy Case',
      desc: 'Claim {n} achievement reward(s).',
      stat: 'achievementClaims', unlockAt: 1, infinite: true,
      scale: { targetGrowth: 2.1, compPerLevel: 1, chipBase: 40, chipGrowth: 1.3, compCap: 25 },
      tiers: [
        { target: 3, reward: { chips: 75 } },
        { target: 10, reward: { comps: 1 } },
        { target: 25, reward: { comps: 2 } },
        { target: 60, reward: { comps: 4 } }
      ]
    },
    {
      id: 'a_settings', kind: 'achievement', name: 'House Rules',
      desc: 'Open Settings for the first time.',
      stat: 'settingsOpened', unlockAt: 1,
      tiers: [{ target: 1, reward: { chips: 50 } }]
    },
    {
      id: 'a_version', kind: 'achievement', name: 'Stay Current',
      desc: 'Update Poker to a new version {n} times.',
      stat: 'versionUpgrades', secret: true, infinite: true,
      scale: { targetGrowth: 1.8, compPerLevel: 1, compCap: 25 },
      tiers: [
        { target: 1, reward: { comps: 1 } },
        { target: 3, reward: { comps: 2 } },
        { target: 10, reward: { comps: 5 } }
      ]
    }
  ];
