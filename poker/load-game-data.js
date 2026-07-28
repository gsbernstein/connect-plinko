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
    'QUEST_RARITY',
    'QUEST_RARITY_WEIGHTS_BY_INK',
    'QUEST_TEMPLATES'
  ];

  // Resolve sibling JSON paths from this script's URL — not location.href, which
  // breaks when the page is served as /poker (no trailing slash) or file://.
  const DATA_BASE = (() => {
    const cur = document.currentScript;
    if (cur && cur.src) return new URL('./', cur.src);
    let path = location.pathname || '/';
    if (/\.html?$/i.test(path)) path = path.replace(/[^/]+$/, '');
    else if (!path.endsWith('/')) path += '/';
    return new URL(path, location.origin);
  })();
  window.POKER_DATA_BASE = DATA_BASE;

  async function fetchJson(file, cacheBust) {
    const url = new URL(file, DATA_BASE);
    if (cacheBust) url.searchParams.set('t', String(Date.now()));
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load ' + file + ': HTTP ' + res.status + ' (' + url.href + ')');
    return res.json();
  }

  window.loadGameData = async function loadGameData(opts) {
    if (location.protocol === 'file:') {
      throw new Error('Poker must be served over HTTP (e.g. python3 -m http.server 8080 from the repo root, then open http://localhost:8080/poker/)');
    }
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
        QUEST_RARITY: window.QUEST_RARITY,
        QUEST_RARITY_WEIGHTS_BY_INK: window.QUEST_RARITY_WEIGHTS_BY_INK,
        QUEST_TEMPLATES: window.QUEST_TEMPLATES
      }
    };
  };
})();
