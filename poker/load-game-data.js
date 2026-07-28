// Loads poker game data from JSON files (single source of truth for game + tools).
(function () {
  const FILES = [
  ['prestige-defs.json', 'PRESTIGE_DEFS'],
  ['upgrade-defs.json', 'UPGRADE_DEFS'],
  ['achievement-defs.json', 'ACHIEVEMENT_DEFS'],
  ['changelog.json', 'CHANGELOG']
  ];

  const QUEST_FILE = 'quest-defs.json';
  const QUEST_KEYS = [
  'QUEST_SLOT_UNLOCK_LEVELS',
  'QUEST_RARITIES',
  'QUEST_RARITY_WEIGHTS_BY_INK',
  'QUEST_TEMPLATES'
  ];

  async function fetchJson(file, cacheBust) {
    const base = new URL(file, document.baseURI || location.href).href;
    const url = cacheBust ? base + (base.includes('?') ? '&' : '?') + 't=' + Date.now() : base;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load ' + file + ': HTTP ' + res.status);
    return res.json();
  }

  window.loadGameData = async function loadGameData(opts) {
    opts = opts || {};
    const bust = !!opts.cacheBust;
    const loads = FILES.map(([file, key]) =>
      fetchJson(file, bust).then(data => { window[key] = data; return data; })
    );
    loads.push(
      fetchJson(QUEST_FILE, bust).then(quest => {
        for (const key of QUEST_KEYS) {
          if (!(key in quest)) throw new Error('quest-defs.json missing ' + key);
          window[key] = quest[key];
        }
        return quest;
      })
    );
    await Promise.all(loads);
    return {
      PRESTIGE_DEFS: window.PRESTIGE_DEFS,
      UPGRADE_DEFS: window.UPGRADE_DEFS,
      ACHIEVEMENT_DEFS: window.ACHIEVEMENT_DEFS,
      CHANGELOG: window.CHANGELOG,
      quest: {
        QUEST_SLOT_UNLOCK_LEVELS: window.QUEST_SLOT_UNLOCK_LEVELS,
        QUEST_RARITIES: window.QUEST_RARITIES,
        QUEST_RARITY_WEIGHTS_BY_INK: window.QUEST_RARITY_WEIGHTS_BY_INK,
        QUEST_TEMPLATES: window.QUEST_TEMPLATES
      }
    };
  };
})();
