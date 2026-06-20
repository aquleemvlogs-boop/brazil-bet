/**
 * Brazil Bet — backend proxy for API-Football
 *
 * Why a proxy?
 *  - Keeps your API key off the client.
 *  - Caches responses in-memory so we don't burn the free 100-req/day quota.
 *  - Lets us reshape the API-Football JSON into something the frontend wants.
 *
 * Endpoints exposed to the browser:
 *   GET /api/live                       → currently in-play fixtures (all leagues we follow)
 *   GET /api/fixtures?league=71         → upcoming + recent fixtures for a league
 *   GET /api/odds?fixture=12345         → 1X2 odds for one fixture (from real bookmakers)
 *
 * Brazilian league IDs in API-Football:
 *   71  = Brasileirão Série A
 *   72  = Brasileirão Série B
 *   13  = CONMEBOL Libertadores
 *   11  = CONMEBOL Sudamericana
 *   2   = UEFA Champions League
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.API_FOOTBALL_KEY;
const API_BASE = 'https://v3.football.api-sports.io';

if (!API_KEY) {
  console.warn('⚠️  API_FOOTBALL_KEY not set. Falling back to mock data.');
  console.warn('   Get a free key at https://www.api-football.com/ and add it to .env');
}

// ---------- Tiny in-memory cache ----------
// Free tier = 100 requests/day. With 15s caching, 24h of live polling = ~5,760 hits
// against the cache and only ~96 against the real API. Safely under quota.
const cache = new Map();

function cacheGet(key, ttlMs) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.t > ttlMs) {
    cache.delete(key);
    return null;
  }
  return entry.v;
}

function cacheSet(key, value) {
  cache.set(key, { t: Date.now(), v: value });
}

// ---------- API-Football fetch wrapper ----------
async function apiFootball(endpoint, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${API_BASE}${endpoint}${qs ? '?' + qs : ''}`;
  const res = await fetch(url, {
    headers: { 'x-apisports-key': API_KEY },
  });
  if (!res.ok) {
    throw new Error(`API-Football ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  // API-Football puts rate-limit info in headers — log it so you can see usage
  const remaining = res.headers.get('x-ratelimit-requests-remaining');
  if (remaining !== null) {
    console.log(`[api-football] ${endpoint} · ${remaining} requests remaining today`);
  }
  return json;
}

// ---------- Shaping helpers ----------
// API-Football fixtures have a deep structure. The frontend only needs a flat row.
function shapeFixture(f) {
  return {
    id: f.fixture.id,
    league: f.league.name,
    leagueId: f.league.id,
    country: f.league.country,
    date: f.fixture.date,
    status: f.fixture.status.short, // NS=not started, 1H/2H/HT=in play, FT=full time
    minute: f.fixture.status.elapsed,
    home: {
      name: f.teams.home.name,
      logo: f.teams.home.logo,
      score: f.goals.home,
    },
    away: {
      name: f.teams.away.name,
      logo: f.teams.away.logo,
      score: f.goals.away,
    },
  };
}

// ---------- Mock data (used when no API key is configured) ----------
function mockFixtures() {
  const now = Date.now();
  return [
    {
      id: 1, league: 'Brasileirão Série A', leagueId: 71, country: 'Brazil',
      date: new Date(now).toISOString(), status: '2H', minute: 73,
      home: { name: 'Flamengo', logo: '', score: 2 },
      away: { name: 'Fluminense', logo: '', score: 1 },
    },
    {
      id: 2, league: 'Brasileirão Série A', leagueId: 71, country: 'Brazil',
      date: new Date(now + 4 * 3600 * 1000).toISOString(), status: 'NS', minute: null,
      home: { name: 'Palmeiras', logo: '', score: null },
      away: { name: 'Corinthians', logo: '', score: null },
    },
    {
      id: 3, league: 'Brasileirão Série A', leagueId: 71, country: 'Brazil',
      date: new Date(now + 28 * 3600 * 1000).toISOString(), status: 'NS', minute: null,
      home: { name: 'São Paulo', logo: '', score: null },
      away: { name: 'Santos', logo: '', score: null },
    },
    {
      id: 4, league: 'CONMEBOL Libertadores', leagueId: 13, country: 'World',
      date: new Date(now + 72 * 3600 * 1000).toISOString(), status: 'NS', minute: null,
      home: { name: 'Palmeiras', logo: '', score: null },
      away: { name: 'Boca Juniors', logo: '', score: null },
    },
    // ---- FIFA World Cup (league 1) — national teams ----
    {
      id: 10, league: 'Copa do Mundo FIFA', leagueId: 1, country: 'World',
      date: new Date(now + 6 * 3600 * 1000).toISOString(), status: 'NS', minute: null,
      home: { name: 'Brasil', logo: '', score: null },
      away: { name: 'Argentina', logo: '', score: null },
    },
    {
      id: 11, league: 'Copa do Mundo FIFA', leagueId: 1, country: 'World',
      date: new Date(now + 30 * 3600 * 1000).toISOString(), status: 'NS', minute: null,
      home: { name: 'França', logo: '', score: null },
      away: { name: 'Inglaterra', logo: '', score: null },
    },
    {
      id: 12, league: 'Copa do Mundo FIFA', leagueId: 1, country: 'World',
      date: new Date(now + 54 * 3600 * 1000).toISOString(), status: 'NS', minute: null,
      home: { name: 'Portugal', logo: '', score: null },
      away: { name: 'Espanha', logo: '', score: null },
    },
    // ---- FIFA World Cup Qualifiers — South America (league 34) ----
    {
      id: 13, league: 'Eliminatórias FIFA · América do Sul', leagueId: 34, country: 'World',
      date: new Date(now + 2 * 3600 * 1000).toISOString(), status: '1H', minute: 31,
      home: { name: 'Brasil', logo: '', score: 1 },
      away: { name: 'Uruguai', logo: '', score: 0 },
    },
    {
      id: 14, league: 'Eliminatórias FIFA · América do Sul', leagueId: 34, country: 'World',
      date: new Date(now + 26 * 3600 * 1000).toISOString(), status: 'NS', minute: null,
      home: { name: 'Colômbia', logo: '', score: null },
      away: { name: 'Equador', logo: '', score: null },
    },
    // ---- FIFA Club World Cup (league 15) ----
    {
      id: 15, league: 'Mundial de Clubes FIFA', leagueId: 15, country: 'World',
      date: new Date(now + 48 * 3600 * 1000).toISOString(), status: 'NS', minute: null,
      home: { name: 'Flamengo', logo: '', score: null },
      away: { name: 'Real Madrid', logo: '', score: null },
    },
    {
      id: 16, league: 'Mundial de Clubes FIFA', leagueId: 15, country: 'World',
      date: new Date(now + 50 * 3600 * 1000).toISOString(), status: 'NS', minute: null,
      home: { name: 'Palmeiras', logo: '', score: null },
      away: { name: 'Al Hilal', logo: '', score: null },
    },
  ];
}

function mockOdds(fixtureId) {
  // Wobble the odds a tiny bit each call so the UI feels alive.
  const wobble = () => (Math.random() - 0.5) * 0.1;
  const seed = fixtureId * 0.13;
  return {
    home: +(1.6 + (seed % 1) + wobble()).toFixed(2),
    draw: +(3.4 + wobble()).toFixed(2),
    away: +(4.2 + (seed % 0.5) + wobble()).toFixed(2),
  };
}

// ---------- ESPN public API (REAL data, no key required) ----------
// Undocumented but public ESPN endpoints — perfect for pulling real fixtures and
// live scores with zero signup. For PRODUCTION use a licensed feed (API-Football,
// Sportradar): ESPN grants no commercial license and the endpoints can change.
const ESPN_SLUG = {
  '71': 'bra.1',                  // Brasileirão Série A
  '1':  'fifa.world',             // FIFA World Cup (only during the tournament)
  '13': 'conmebol.libertadores',  // Copa Libertadores
  '2':  'uefa.champions',         // UEFA Champions League
  '15': 'fifa.cwc',               // FIFA Club World Cup
};
const ESPN_NAME = {
  '71': 'Brasileirão Série A', '1': 'Copa do Mundo FIFA', '13': 'CONMEBOL Libertadores',
  '2': 'UEFA Champions League', '15': 'Mundial de Clubes FIFA',
};

function shapeEspn(ev, leagueName) {
  const comp = (ev.competitions && ev.competitions[0]) || {};
  const cs = comp.competitors || [];
  const home = cs.find(c => c.homeAway === 'home') || cs[0] || {};
  const away = cs.find(c => c.homeAway === 'away') || cs[1] || {};
  const stateName = ev.status?.type?.state; // 'pre' | 'in' | 'post'
  let status = 'NS', minute = null;
  if (stateName === 'in') {
    status = (ev.status?.period >= 2) ? '2H' : '1H';
    minute = parseInt(ev.status?.displayClock, 10) || ev.status?.clock || null;
  } else if (stateName === 'post') {
    status = 'FT';
  }
  const teamOf = (c) => ({
    name: c.team?.shortDisplayName || c.team?.displayName || c.team?.name || '—',
    logo: c.team?.logo || '',
    score: (stateName === 'pre' || c.score == null) ? null : Number(c.score),
  });
  return { id: String(ev.id), league: leagueName, date: ev.date, status, minute, home: teamOf(home), away: teamOf(away) };
}

async function espnFixtures(leagueId) {
  const slug = ESPN_SLUG[leagueId];
  if (!slug) return [];
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard`;
  const res = await fetch(url, { headers: { 'User-Agent': 'BrazilBet/0.1 (+demo)' } });
  if (!res.ok) throw new Error(`ESPN ${res.status}`);
  const json = await res.json();
  return (json.events || []).map(ev => shapeEspn(ev, ESPN_NAME[leagueId] || json.leagues?.[0]?.name));
}

// ---------- Routes ----------

// GET /api/live — every live match across the leagues we follow
app.get('/api/live', async (req, res) => {
  const TTL = 15_000; // 15s — short, but still saves us from per-second polling

  const cached = cacheGet('live', TTL);
  if (cached) return res.json({ source: 'cache', fixtures: cached });

  // Premium path.
  if (API_KEY) {
    try {
      const data = await apiFootball('/fixtures', { live: 'all' });
      const fixtures = data.response.map(shapeFixture);
      cacheSet('live', fixtures);
      return res.json({ source: 'api', fixtures });
    } catch (err) { console.error('API-Football live failed, trying ESPN:', err.message); }
  }

  // Real + keyless: pull each league's scoreboard from ESPN and keep in-play games.
  try {
    const live = ['71', '13', '2'];
    const all = (await Promise.all(live.map(id => espnFixtures(id).catch(() => [])))).flat();
    const fixtures = all.filter(f => ['1H', '2H', 'HT'].includes(f.status));
    if (fixtures.length) { cacheSet('live', fixtures); return res.json({ source: 'espn', fixtures }); }
  } catch (err) { console.error('ESPN live failed, using mock:', err.message); }

  const fixtures = mockFixtures().filter(f => f.status === '1H' || f.status === '2H' || f.status === 'HT');
  cacheSet('live', fixtures);
  res.json({ source: 'mock', fixtures });
});

// GET /api/fixtures?league=71 — real fixtures for a league.
// Preference: API-Football (if a key is set) → ESPN public API → mock fallback.
app.get('/api/fixtures', async (req, res) => {
  const league = req.query.league || '71';
  const season = req.query.season || new Date().getFullYear();
  const TTL = 30_000; // 30s — short enough that live scores stay fresh

  const key = `fixtures:${league}:${season}`;
  const cached = cacheGet(key, TTL);
  if (cached) return res.json({ source: 'cache', fixtures: cached });

  // 1) Premium: API-Football, if configured.
  if (API_KEY) {
    try {
      const data = await apiFootball('/fixtures', { league, season, next: 12 });
      const fixtures = data.response.map(shapeFixture);
      cacheSet(key, fixtures);
      return res.json({ source: 'api', fixtures });
    } catch (err) { console.error('API-Football failed, trying ESPN:', err.message); }
  }

  // 2) Real + keyless: ESPN public API.
  try {
    const fixtures = await espnFixtures(league);
    if (fixtures.length) {
      cacheSet(key, fixtures);
      return res.json({ source: 'espn', fixtures });
    }
  } catch (err) { console.error('ESPN failed, using mock:', err.message); }

  // 3) Fallback: mock sample data (e.g. World Cup off-season).
  const fixtures = mockFixtures().filter(f => String(f.leagueId) === String(league));
  cacheSet(key, fixtures);
  res.json({ source: 'mock', fixtures });
});

// GET /api/odds?fixture=12345 — 1X2 odds from the first available bookmaker
app.get('/api/odds', async (req, res) => {
  const fixture = req.query.fixture;
  if (!fixture) return res.status(400).json({ error: 'fixture query param required' });

  const TTL = 30_000; // 30s — odds move, but not THAT fast on the free tier
  const key = `odds:${fixture}`;
  const cached = cacheGet(key, TTL);
  if (cached) return res.json({ source: 'cache', odds: cached });

  if (!API_KEY) {
    const odds = mockOdds(Number(fixture));
    cacheSet(key, odds);
    return res.json({ source: 'mock', odds });
  }

  try {
    const data = await apiFootball('/odds', { fixture, bet: 1 }); // bet=1 → match winner
    // Dig out the 1X2 prices from the first bookmaker that has them
    const book = data.response?.[0]?.bookmakers?.[0];
    const values = book?.bets?.[0]?.values || [];
    const get = (label) => Number(values.find(v => v.value === label)?.odd) || null;
    const odds = { home: get('Home'), draw: get('Draw'), away: get('Away') };
    cacheSet(key, odds);
    res.json({ source: 'api', odds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- Peer-to-peer match-wager data (the new dashboard) ----------
// Original game labels — deliberately NOT EA/FIFA/Madden trademarks. Swap for
// licensed names/art only if you hold the rights.
const GAMES = ['soccer21', 'soccer22', 'gridiron'];
const GAME_LABEL = { soccer21: 'Soccer Clash 21', soccer22: 'Soccer Clash 22', gridiron: 'Gridiron Pro' };

const PLAYERS = [
  { name: 'MarcusTheDevilEye', division: 9, hue: 280, country: 'br' },
  { name: 'Aspect123', division: 1, hue: 200, country: 'ar' },
  { name: 'O’Doyle', division: 5, hue: 330, country: 'gb-eng' },
  { name: 'Ranger', division: 6, hue: 265, country: 'fr' },
  { name: 'Lynch_lynch', division: 2, hue: 20, country: 'pt' },
  { name: 'Big Papa', division: 2, hue: 180, country: 'es' },
  { name: 'NovaStriker', division: 3, hue: 145, country: 'de' },
  { name: 'KhrisP', division: 7, hue: 305, country: 'us' },
  { name: 'ZeroChill', division: 4, hue: 215, country: 'nl' },
  { name: 'Vortex', division: 8, hue: 350, country: 'it' },
  { name: 'SaintWest', division: 1, hue: 95, country: 'br' },
  { name: 'Mbappe_fan7', division: 3, hue: 40, country: 'fr' },
];

const CONSOLES = ['XBOX', 'PlayStation'];
const TAGS_POOL = ['Exhibition', 'Head-to-head', 'Ranked', 'Public', 'Private'];

// Deterministic pseudo-random so listings are stable across cache hits.
function seeded(n) { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); }

function buildMatches(game, count) {
  const label = GAME_LABEL[game] || GAME_LABEL.soccer21;
  return Array.from({ length: count }, (_, i) => {
    const p = PLAYERS[(i + game.length) % PLAYERS.length];
    const r = seeded(i + 1 + game.length * 7);
    const amount = +(2 + r * 18).toFixed(2);
    const duration = [4, 8, 10, 12][Math.floor(seeded(i + 3) * 4)];
    return {
      id: `${game}-${i + 1}`,
      player: p,
      tags: ['Exhibition', 'Head-to-head'],
      visibility: seeded(i + 5) > 0.25 ? 'Public' : 'Private',
      game: label,
      gameKey: game,
      console: CONSOLES[Math.floor(seeded(i + 2) * 2)],
      duration: `${duration} min`,
      amount,
    };
  });
}

// GET /api/matches?game=soccer21&page=1 — available P2P wager listings (mock)
app.get('/api/matches', (req, res) => {
  const game = GAMES.includes(req.query.game) ? req.query.game : 'soccer21';
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = 6;
  const total = 51; // headline count
  const all = buildMatches(game, 60);
  const start = (page - 1) * pageSize;
  res.json({
    game,
    gameLabel: GAME_LABEL[game],
    total,
    page,
    pages: Math.ceil(total / pageSize),
    matches: all.slice(start, start + pageSize),
  });
});

// GET /api/users — recommended online users to challenge
app.get('/api/users', (req, res) => {
  const users = PLAYERS.slice(0, 6).map(p => ({ ...p, online: true }));
  res.json({ users });
});

// ---------- Static frontend ----------
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`🇧🇷 Brazil Bet running at http://localhost:${PORT}`);
  console.log(`   Mode: ${API_KEY ? 'live API-Football' : 'mock data'}`);
});
