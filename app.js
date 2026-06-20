/* ============================================================
   Brazil Bet — SPORTSBOOK
   Bet on real fixtures (1 / X / 2 odds) with a bet slip.
   Polished indigo design + real flag images + paywall + real crypto wallet.
   ============================================================ */

// ---------------- i18n ----------------
const I18N = {
  pt: {
    'nav.sports': 'Esportes', 'nav.live': 'Ao Vivo', 'nav.mybets': 'Minhas apostas', 'nav.wallet': 'Carteira',
    'top.search': 'Buscar times ou ligas', 'top.deposit': 'Depositar',
    'top.balance': 'Saldo', 'top.addmore': 'Adicionar',
    'feed.upcoming': '{league} · Próximas partidas', 'feed.count': '{n} partidas',
    'odds.1': '1', 'odds.X': 'X', 'odds.2': '2', 'live': 'AO VIVO', 'inplay': 'em jogo', 'final': 'Encerrado',
    'today': 'Hoje', 'tomorrow': 'Amanhã',
    'slip.title': 'Bilhete', 'slip.empty': 'Toque em uma odd para começar a apostar.',
    'slip.stake': 'Valor (R$)', 'slip.totalOdds': 'Odds totais', 'slip.stakeRow': 'Aposta',
    'slip.return': 'Retorno potencial', 'slip.place': 'Apostar agora', 'slip.clear': 'Limpar',
    'bet.win': '{t} vence', 'bet.draw': 'Empate', 'vs': 'x', 'loading': 'Carregando partidas…',
    'pw.title': 'Acesso exclusivo — pague para continuar',
    'pw.sub': 'Assine para ver odds ao vivo e apostar.',
    'pw.day': 'Diário', 'pw.dayPer': '/dia', 'pw.month': 'Mensal', 'pw.monthPer': '/mês',
    'pw.year': 'Anual VIP', 'pw.yearPer': '/ano', 'pw.popular': 'POPULAR',
    'pw.payCard': 'Cartão', 'pw.payCrypto': 'Cripto (USDT)',
    'pw.cta': 'Pagar agora e entrar', 'pw.ctaCrypto': 'Pagar com carteira',
    'pw.processing': 'Processando…', 'pw.demo': 'Demonstração — pagamento simulado, nenhum valor é cobrado.',
    'pw.connectFirst': 'Conecte sua carteira para pagar com USDT.',
    'wm.title': 'Carteira Cripto', 'wm.metamask': 'Carteira de navegador (EVM)', 'wm.wc': 'Escaneie com seu app',
    'wm.noWallet': 'Nenhuma carteira detectada. Instale a MetaMask para continuar.', 'wm.install': 'Instalar MetaMask',
    'wm.address': 'Endereço', 'wm.network': 'Rede', 'wm.native': 'Saldo nativo', 'wm.usdt': 'Saldo USDT',
    'wm.deposit': 'Depositar USDT', 'wm.to': 'Endereço de destino', 'wm.amount': 'Valor (USDT)',
    'wm.send': 'Enviar USDT', 'wm.disconnect': 'Desconectar',
    'wm.warn': 'Você assina a transação na sua carteira. Os fundos vão para o endereço que você informar — esta plataforma não tem custódia.',
    'wm.needAddr': 'Informe um endereço de destino válido.', 'wm.sending': 'Confirme na carteira…',
    'wm.sent': 'Transação enviada:', 'wm.failed': 'Falha/cancelada na carteira.',
    'wm.unsupported': 'USDT não mapeado nesta rede. Troque para Ethereum, BNB Chain ou Polygon.',
    'mock': '⚠️ Dados de exemplo para esta competição (fora de temporada). As demais ligas usam dados reais.',
  },
  en: {
    'nav.sports': 'Sports', 'nav.live': 'Live', 'nav.mybets': 'My bets', 'nav.wallet': 'Wallet',
    'top.search': 'Search teams or leagues', 'top.deposit': 'Deposit',
    'top.balance': 'Balance', 'top.addmore': 'Add more',
    'feed.upcoming': '{league} · Upcoming matches', 'feed.count': '{n} matches',
    'odds.1': '1', 'odds.X': 'X', 'odds.2': '2', 'live': 'LIVE', 'inplay': 'in play', 'final': 'Final',
    'today': 'Today', 'tomorrow': 'Tomorrow',
    'slip.title': 'Bet slip', 'slip.empty': 'Tap an odd to start betting.',
    'slip.stake': 'Stake (R$)', 'slip.totalOdds': 'Total odds', 'slip.stakeRow': 'Stake',
    'slip.return': 'Potential return', 'slip.place': 'Place bet', 'slip.clear': 'Clear',
    'bet.win': '{t} to win', 'bet.draw': 'Draw', 'vs': 'vs', 'loading': 'Loading matches…',
    'pw.title': 'Members only — pay to continue',
    'pw.sub': 'Subscribe to see live odds and place bets.',
    'pw.day': 'Daily', 'pw.dayPer': '/day', 'pw.month': 'Monthly', 'pw.monthPer': '/mo',
    'pw.year': 'Annual VIP', 'pw.yearPer': '/yr', 'pw.popular': 'POPULAR',
    'pw.payCard': 'Card', 'pw.payCrypto': 'Crypto (USDT)',
    'pw.cta': 'Pay now & enter', 'pw.ctaCrypto': 'Pay with wallet',
    'pw.processing': 'Processing…', 'pw.demo': 'Demo — simulated payment, nothing is charged.',
    'pw.connectFirst': 'Connect your wallet to pay with USDT.',
    'wm.title': 'Crypto Wallet', 'wm.metamask': 'Browser wallet (EVM)', 'wm.wc': 'Scan with your app',
    'wm.noWallet': 'No wallet detected. Install MetaMask to continue.', 'wm.install': 'Install MetaMask',
    'wm.address': 'Address', 'wm.network': 'Network', 'wm.native': 'Native balance', 'wm.usdt': 'USDT balance',
    'wm.deposit': 'Deposit USDT', 'wm.to': 'Destination address', 'wm.amount': 'Amount (USDT)',
    'wm.send': 'Send USDT', 'wm.disconnect': 'Disconnect',
    'wm.warn': 'You sign the transaction in your own wallet. Funds go to the address you enter — this platform takes no custody.',
    'wm.needAddr': 'Enter a valid destination address.', 'wm.sending': 'Confirm in your wallet…',
    'wm.sent': 'Transaction sent:', 'wm.failed': 'Failed/rejected in wallet.',
    'wm.unsupported': 'USDT not mapped on this network. Switch to Ethereum, BNB Chain or Polygon.',
    'mock': '⚠️ Sample data for this competition (off-season). Other leagues use real data.',
  },
};
let lang = 'pt';
function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.pt[key] || key; }
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  const togLabel = lang === 'pt' ? '🇬🇧 EN' : '🇧🇷 PT';
  document.querySelectorAll('.lang-toggle').forEach(b => { b.textContent = togLabel; });
}
function setLang(l) {
  lang = l;
  try { localStorage.setItem('bb_lang', l); } catch (e) {}
  document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en';
  applyI18n();
  loadFixtures(state.league);
  renderSlip();
  if (wallet.address) renderWallet();
}
function toggleLang() { setLang(lang === 'pt' ? 'en' : 'pt'); }

// ---------------- real flag images ----------------
function flagURL(code, w) { return `https://flagcdn.com/w${w || 40}/${(code || 'br').toLowerCase()}.png`; }

// Map team names → country code (for the demo). With a real API key, the fixtures
// API returns real club crest URLs and those are used instead.
const TEAM_CC = {
  'flamengo': 'br', 'fluminense': 'br', 'palmeiras': 'br', 'corinthians': 'br', 'são paulo': 'br',
  'santos': 'br', 'grêmio': 'br', 'internacional': 'br', 'atlético-mg': 'br', 'cruzeiro': 'br',
  'botafogo': 'br', 'brasil': 'br', 'boca juniors': 'ar', 'river plate': 'ar', 'argentina': 'ar',
  'peñarol': 'uy', 'uruguai': 'uy', 'real madrid': 'es', 'espanha': 'es', 'frança': 'fr', 'psg': 'fr',
  'inglaterra': 'gb-eng', 'manchester city': 'gb-eng', 'portugal': 'pt', 'bayern de munique': 'de',
  'colômbia': 'co', 'equador': 'ec', 'al hilal': 'sa',
};
function crestHTML(name, logo) {
  const url = logo || (TEAM_CC[name.toLowerCase()] ? flagURL(TEAM_CC[name.toLowerCase()], 40) : null);
  if (url) return `<img class="crest" src="${url}" alt="" loading="lazy" />`;
  const hue = (name.charCodeAt(0) * 11) % 360;
  return `<span class="crest" style="background:linear-gradient(135deg,hsl(${hue} 60% 52%),hsl(${(hue + 40) % 360} 55% 34%));"></span>`;
}

// ---------------- leagues (banner selectors) ----------------
const LEAGUES = {
  '71': { label: 'Brasileirão', sub: 'Série A', grad: 'linear-gradient(100deg,#0a5a2a 0%,#0f7d3a 55%,#23c065 100%)', photo: 'https://loremflickr.com/640/240/soccer,player?lock=21' },
  '1':  { label: 'Copa do Mundo FIFA', sub: 'Seleções', grad: 'linear-gradient(100deg,#16264f 0%,#234f86 60%,#2b6fd6 100%)', photo: 'https://loremflickr.com/640/240/football,stadium?lock=22' },
  '13': { label: 'Libertadores', sub: 'CONMEBOL', grad: 'linear-gradient(100deg,#3a1606 0%,#7a3410 55%,#d4711f 100%)', photo: 'https://loremflickr.com/640/240/soccer,fans?lock=13' },
};

const state = { league: '71' };

// ---------------- real data: ESPN public API (called directly from the browser) ----------------
// ESPN's scoreboard endpoints are CORS-enabled, so the static site fetches them
// directly — no backend needed. Real fixtures, live scores, crests, and (when
// available) real odds. Production: move to a licensed feed.
const ESPN_SLUG = { '71': 'bra.1', '1': 'fifa.world', '13': 'conmebol.libertadores', '2': 'uefa.champions', '15': 'fifa.cwc' };
const ESPN_NAME = { '71': 'Brasileirão Série A', '1': 'Copa do Mundo FIFA', '13': 'CONMEBOL Libertadores', '2': 'UEFA Champions League', '15': 'Mundial de Clubes FIFA' };

// Sample fallback (e.g. World Cup off-season, when ESPN returns no events).
const MOCK = {
  '1': [
    { id: 'wc1', league: 'Copa do Mundo FIFA', date: new Date(Date.now() + 6 * 36e5).toISOString(), status: 'NS', minute: null, home: { name: 'Brasil', logo: '', score: null }, away: { name: 'Argentina', logo: '', score: null }, odds: null },
    { id: 'wc2', league: 'Copa do Mundo FIFA', date: new Date(Date.now() + 30 * 36e5).toISOString(), status: 'NS', minute: null, home: { name: 'França', logo: '', score: null }, away: { name: 'Inglaterra', logo: '', score: null }, odds: null },
    { id: 'wc3', league: 'Copa do Mundo FIFA', date: new Date(Date.now() + 54 * 36e5).toISOString(), status: 'NS', minute: null, home: { name: 'Portugal', logo: '', score: null }, away: { name: 'Espanha', logo: '', score: null }, odds: null },
  ],
  '15': [
    { id: 'cwc1', league: 'Mundial de Clubes FIFA', date: new Date(Date.now() + 48 * 36e5).toISOString(), status: 'NS', minute: null, home: { name: 'Flamengo', logo: '', score: null }, away: { name: 'Real Madrid', logo: '', score: null }, odds: null },
    { id: 'cwc2', league: 'Mundial de Clubes FIFA', date: new Date(Date.now() + 50 * 36e5).toISOString(), status: 'NS', minute: null, home: { name: 'Palmeiras', logo: '', score: null }, away: { name: 'Al Hilal', logo: '', score: null }, odds: null },
  ],
};

function amToDec(am) { if (am == null || isNaN(am)) return null; am = Number(am); return am > 0 ? +((am / 100) + 1).toFixed(2) : +((100 / -am) + 1).toFixed(2); }
function parseEspnOdds(comp) {
  const od = comp.odds && comp.odds[0]; if (!od) return null;
  const ml = (o) => o?.moneyLine ?? o?.current?.moneyLine?.american ?? o?.moneyLineOdds;
  const h = amToDec(ml(od.homeTeamOdds)), d = amToDec(ml(od.drawOdds)), a = amToDec(ml(od.awayTeamOdds));
  if (h && a) return { home: h, draw: d || +(((h + a) / 1.55)).toFixed(2), away: a }; // real moneylines → decimal
  return null;
}
function shapeEspn(ev, leagueName) {
  const comp = (ev.competitions && ev.competitions[0]) || {}; const cs = comp.competitors || [];
  const home = cs.find(c => c.homeAway === 'home') || cs[0] || {}; const away = cs.find(c => c.homeAway === 'away') || cs[1] || {};
  const st = ev.status?.type?.state; let status = 'NS', minute = null;
  if (st === 'in') { status = (ev.status?.period >= 2) ? '2H' : '1H'; minute = parseInt(ev.status?.displayClock, 10) || ev.status?.clock || null; }
  else if (st === 'post') status = 'FT';
  const team = (c) => ({ name: c.team?.shortDisplayName || c.team?.displayName || c.team?.name || '—', logo: c.team?.logo || '', score: (st === 'pre' || c.score == null) ? null : Number(c.score) });
  return { id: String(ev.id), league: leagueName, date: ev.date, status, minute, home: team(home), away: team(away), odds: parseEspnOdds(comp) };
}
async function fetchFixtures(leagueId) {
  const slug = ESPN_SLUG[leagueId];
  if (slug) {
    try {
      const r = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard`);
      if (r.ok) {
        const j = await r.json();
        const fx = (j.events || []).map(ev => shapeEspn(ev, ESPN_NAME[leagueId] || j.leagues?.[0]?.name));
        if (fx.length) return { source: 'espn', fixtures: fx };
      }
    } catch (e) { console.warn('ESPN failed, using sample data:', e); }
  }
  return { source: 'mock', fixtures: MOCK[leagueId] || [] };
}

// Deterministic display odds per fixture, used when ESPN doesn't expose real ones.
function genOdds(id) {
  const s = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (n) => Math.abs(Math.sin(s * 0.7 + n));
  return { home: +(1.35 + r(1) * 2.6).toFixed(2), draw: +(2.9 + r(2) * 1.7).toFixed(2), away: +(1.55 + r(3) * 4).toFixed(2) };
}

function kickoff(iso) {
  const d = new Date(iso), now = new Date();
  const tom = new Date(now); tom.setDate(now.getDate() + 1);
  const hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
  const wd = { pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
  const label = d.toDateString() === now.toDateString() ? t('today')
    : d.toDateString() === tom.toDateString() ? t('tomorrow') : wd[lang][d.getDay()];
  return { label, time: `${hh}:${mm}` };
}

async function loadFixtures(leagueId) {
  state.league = leagueId;
  const lg = LEAGUES[leagueId] || LEAGUES['71'];
  const body = document.getElementById('fixtures');
  document.getElementById('feed-title').textContent = t('feed.upcoming').replace('{league}', lg.label);
  body.innerHTML = `<div class="empty">${t('loading')}</div>`;
  try {
    const { fixtures, source } = await fetchFixtures(leagueId);
    document.getElementById('feed-count').textContent = t('feed.count').replace('{n}', fixtures.length);
    body.innerHTML = fixtures.length ? fixtures.map(fixtureRow).join('') : `<div class="empty">${t('mock')}</div>`;
    if (source === 'mock') flagMock(); else clearMock();
  } catch (e) {
    console.error(e);
    body.innerHTML = `<div class="empty">${t('wm.failed')}</div>`;
  }
}

function fixtureRow(f) {
  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'BT'].includes(f.status);
  const isDone = f.status === 'FT' || f.status === 'AET' || f.status === 'PEN';
  const showScore = isLive || isDone;
  const o = f.odds || genOdds(f.id);
  let timeHtml;
  if (isLive) timeHtml = `<span class="live">${t('live')}</span><span>${f.minute ? f.minute + "'" : f.status}</span>`;
  else if (isDone) { const k = kickoff(f.date); timeHtml = `<span class="done">${t('final')}</span><span>${k.label}</span>`; }
  else { const k = kickoff(f.date); timeHtml = `<span>${k.label}</span><span>${k.time}</span>`; }
  const sH = showScore && f.home.score != null ? `<span class="score">${f.home.score}</span>` : '';
  const sA = showScore && f.away.score != null ? `<span class="score">${f.away.score}</span>` : '';
  const h = esc(f.home.name), a = esc(f.away.name), c = esc(f.league || '');
  const odd = (type, val, label) =>
    `<button class="odd" id="odd-${f.id}-${type}" onclick="addToSlip('${f.id}','${type}',${val},'${h}','${a}','${c}')"><span class="ol">${label}</span><span class="op">${val}</span></button>`;
  return `
    <div class="fixture-row">
      <div class="fx-time">${timeHtml}</div>
      <div class="fx-teams">
        <div class="fx-team">${crestHTML(f.home.name, f.home.logo)}<span>${f.home.name}</span>${sH}</div>
        <div class="fx-team">${crestHTML(f.away.name, f.away.logo)}<span>${f.away.name}</span>${sA}</div>
      </div>
      ${odd('home', o.home, t('odds.1'))}
      ${odd('draw', o.draw, t('odds.X'))}
      ${odd('away', o.away, t('odds.2'))}
    </div>`;
}
function esc(s) { return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

function selectLeague(el, leagueId) {
  document.querySelectorAll('.banner').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  loadFixtures(leagueId);
}

function flagMock() {
  let bar = document.getElementById('mock-bar');
  if (!bar) { bar = document.createElement('div'); bar.id = 'mock-bar'; document.body.prepend(bar); }
  bar.textContent = t('mock');
}
function clearMock() { const b = document.getElementById('mock-bar'); if (b) b.remove(); }

// ============================================================
//  Bet slip
// ============================================================
const slip = [];
let lastStake = 50;

function addToSlip(id, pickType, odds, home, away, comp) {
  document.querySelectorAll(`[id^="odd-${id}-"]`).forEach(b => b.classList.remove('active'));
  const i = slip.findIndex(s => s.id === id);
  if (i >= 0 && slip[i].pickType === pickType) { slip.splice(i, 1); renderSlip(); return; } // toggle off
  if (i >= 0) slip.splice(i, 1);
  slip.push({ id, pickType, odds, home, away, comp });
  const btn = document.getElementById(`odd-${id}-${pickType}`); if (btn) btn.classList.add('active');
  renderSlip();
}
function removeFromSlip(id) {
  const i = slip.findIndex(s => s.id === id);
  if (i >= 0) { slip.splice(i, 1); document.querySelectorAll(`[id^="odd-${id}-"]`).forEach(b => b.classList.remove('active')); renderSlip(); }
}
function clearSlip() {
  slip.length = 0;
  document.querySelectorAll('.odd.active').forEach(b => b.classList.remove('active'));
  renderSlip();
}
function pickLabel(s) {
  if (s.pickType === 'draw') return t('bet.draw');
  return t('bet.win').replace('{t}', s.pickType === 'home' ? s.home : s.away);
}
function readStake() { const el = document.getElementById('stake'); if (el) lastStake = parseFloat(el.value.replace(',', '.')) || 0; return lastStake; }
function setStake(v) { lastStake = v; renderSlip(); }

function renderSlip() {
  const body = document.getElementById('slip-body');
  const cnt = document.getElementById('slip-count');
  cnt.textContent = slip.length;
  if (!slip.length) { body.innerHTML = `<div class="slip-empty">${t('slip.empty')}</div>`; return; }
  const sels = slip.map(s => `
    <div class="slip-sel">
      <div class="top">
        <div><div class="pick">${pickLabel(s)}</div><div class="match">${s.home} ${t('vs')} ${s.away}${s.comp ? ' · ' + s.comp : ''}</div></div>
        <button class="rm" onclick="removeFromSlip('${s.id}')">×</button>
      </div>
      <div class="odds">${s.odds.toFixed(2)}</div>
    </div>`).join('');
  const total = slip.reduce((a, s) => a * s.odds, 1);
  const stake = readStake();
  body.innerHTML = `
    ${sels}
    <div class="stake-row"><label>${t('slip.stake')}</label><input id="stake" value="${stake.toFixed(2).replace('.', ',')}" oninput="readStake();renderSlip()" /></div>
    <div class="presets">
      <button class="preset" onclick="setStake(10)">R$10</button>
      <button class="preset" onclick="setStake(25)">R$25</button>
      <button class="preset" onclick="setStake(50)">R$50</button>
      <button class="preset" onclick="setStake(100)">R$100</button>
    </div>
    <div class="slip-summary">
      <div class="r"><span>${t('slip.totalOdds')}</span><span class="v">${total.toFixed(2)}</span></div>
      <div class="r"><span>${t('slip.stakeRow')}</span><span class="v">R$ ${stake.toFixed(2).replace('.', ',')}</span></div>
      <div class="r total"><span>${t('slip.return')}</span><span class="v">R$ ${(stake * total).toFixed(2).replace('.', ',')}</span></div>
    </div>
    <button class="place">${t('slip.place')}</button>`;
}

// ============================================================
//  REAL crypto wallet (EIP-1193)
// ============================================================
const USDT = {
  '0x1':  { addr: '0xdAC17F958D2ee523a2206206994597C13D831ec7', dec: 6,  name: 'Ethereum' },
  '0x38': { addr: '0x55d398326f99059fF775485246999027B3197955', dec: 18, name: 'BNB Chain' },
  '0x89': { addr: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', dec: 6,  name: 'Polygon' },
};
const NET_NAMES = { '0x1': 'Ethereum', '0x38': 'BNB Chain', '0x89': 'Polygon', '0xa': 'Optimism', '0xa4b1': 'Arbitrum', '0x2105': 'Base' };
const wallet = { address: null, chainId: null, native: 0, usdt: 0 };
function hasProvider() { return typeof window.ethereum !== 'undefined'; }

async function connectWallet() {
  if (!hasProvider()) { renderWallet(); return; }
  try {
    const accts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    wallet.address = accts[0];
    wallet.chainId = await window.ethereum.request({ method: 'eth_chainId' });
    window.ethereum.on?.('accountsChanged', (a) => { wallet.address = a[0] || null; if (!wallet.address) disconnectWallet(); else refreshBalances().then(renderWallet); });
    window.ethereum.on?.('chainChanged', (c) => { wallet.chainId = c; refreshBalances().then(renderWallet); });
    await refreshBalances();
    renderWallet();
  } catch (e) { console.error('connect rejected', e); renderWallet(); }
}
function toUnits(amount, dec) { const [i, f = ''] = String(amount).split('.'); const frac = (f + '0'.repeat(dec)).slice(0, dec); return BigInt(i || '0') * 10n ** BigInt(dec) + BigInt(frac || '0'); }
function fromUnits(hex, dec) { try { return Number(BigInt(hex)) / 10 ** dec; } catch (e) { return 0; } }
async function refreshBalances() {
  if (!wallet.address) return;
  try { wallet.native = fromUnits(await window.ethereum.request({ method: 'eth_getBalance', params: [wallet.address, 'latest'] }), 18); } catch (e) { wallet.native = 0; }
  const tok = USDT[wallet.chainId]; wallet.usdt = 0;
  if (tok) { try { const data = '0x70a08231' + '000000000000000000000000' + wallet.address.slice(2); wallet.usdt = fromUnits(await window.ethereum.request({ method: 'eth_call', params: [{ to: tok.addr, data }, 'latest'] }), tok.dec); } catch (e) { wallet.usdt = 0; } }
}
async function sendUsdt() {
  const to = document.getElementById('wm-to').value.trim();
  const amount = parseFloat(document.getElementById('wm-amount').value);
  const status = document.getElementById('wm-tx');
  if (!/^0x[a-fA-F0-9]{40}$/.test(to)) { status.textContent = t('wm.needAddr'); return; }
  const tok = USDT[wallet.chainId]; if (!tok) { status.textContent = t('wm.unsupported'); return; }
  if (!(amount > 0)) return;
  const units = toUnits(amount, tok.dec).toString(16).padStart(64, '0');
  const data = '0xa9059cbb' + '000000000000000000000000' + to.slice(2) + units;
  status.textContent = t('wm.sending');
  try {
    const txHash = await window.ethereum.request({ method: 'eth_sendTransaction', params: [{ from: wallet.address, to: tok.addr, data }] });
    const ex = wallet.chainId === '0x1' ? 'https://etherscan.io/tx/' : wallet.chainId === '0x38' ? 'https://bscscan.com/tx/' : 'https://polygonscan.com/tx/';
    status.innerHTML = `${t('wm.sent')} <a href="${ex}${txHash}" target="_blank" rel="noopener">${txHash.slice(0, 12)}…</a>`;
    setTimeout(() => refreshBalances().then(renderWallet), 4000);
  } catch (e) { console.error(e); status.textContent = t('wm.failed'); }
}
function disconnectWallet() { wallet.address = null; wallet.chainId = null; wallet.native = 0; wallet.usdt = 0; renderWallet(); }
function shortAddr(a) { return a ? a.slice(0, 6) + '…' + a.slice(-4) : ''; }
function renderWallet() {
  const body = document.getElementById('wallet-body');
  if (!wallet.address) {
    if (!hasProvider()) { body.innerHTML = `<p class="wallet-warn">${t('wm.noWallet')}</p><a class="modal-cta" href="https://metamask.io/download/" target="_blank" rel="noopener" style="display:block;text-align:center;margin-top:14px;">${t('wm.install')}</a>`; return; }
    body.innerHTML = `
      <button class="wallet-opt" onclick="connectWallet()"><span class="wo-ic">🦊</span><span><span class="wo-name">MetaMask / EVM</span><br><span class="wo-sub">${t('wm.metamask')}</span></span></button>
      <button class="wallet-opt" onclick="connectWallet()"><span class="wo-ic">🔗</span><span><span class="wo-name">WalletConnect</span><br><span class="wo-sub">${t('wm.wc')}</span></span></button>`;
    return;
  }
  const netName = NET_NAMES[wallet.chainId] || ('Chain ' + parseInt(wallet.chainId, 16));
  body.innerHTML = `
    <div class="wallet-info">
      <div class="wi-row"><span class="k">${t('wm.address')}</span><span class="v">${shortAddr(wallet.address)}</span></div>
      <div class="wi-row"><span class="k">${t('wm.network')}</span><span class="v wi-net"><span class="dot"></span>${netName}</span></div>
      <div class="wi-row"><span class="k">${t('wm.native')}</span><span class="v">${wallet.native.toFixed(4)}</span></div>
      <div class="wi-row"><span class="k">${t('wm.usdt')}</span><span class="v big">${wallet.usdt.toFixed(2)} USDT</span></div>
    </div>
    <h4 style="font-size:13px;margin-bottom:10px;color:var(--muted);">${t('wm.deposit')}</h4>
    <div class="field"><label>${t('wm.to')}</label><input id="wm-to" class="mono" placeholder="0x…" /></div>
    <div class="field"><label>${t('wm.amount')}</label><input id="wm-amount" type="number" min="0" step="0.01" placeholder="10.00" /></div>
    <button class="modal-cta" onclick="sendUsdt()">${t('wm.send')}</button>
    <button class="modal-cta ghost" onclick="disconnectWallet()">${t('wm.disconnect')}</button>
    <p class="wallet-warn">${t('wm.warn')}</p>
    <p class="tx-status" id="wm-tx"></p>`;
}
function openWallet() { renderWallet(); document.getElementById('wallet-modal').classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ============================================================
//  Aggressive paywall — pops on every interaction until subscribed
// ============================================================
let hasAccess = false, selectedPlan = 'month', payMethod = 'card';
const PLAN_MS = { day: 864e5, month: 30 * 864e5, year: 365 * 864e5 };
function checkAccess() { try { const a = JSON.parse(localStorage.getItem('bb_access') || 'null'); return !!(a && a.exp && Date.now() < a.exp); } catch (e) { return false; } }
function openPaywall() { document.getElementById('paywall').classList.add('open'); }
function closePaywall() { document.getElementById('paywall').classList.remove('open'); }
function selectPlan(el) { document.querySelectorAll('.pw-plan').forEach(p => p.classList.remove('active')); el.classList.add('active'); selectedPlan = el.dataset.plan; }
function selectPay(el) { document.querySelectorAll('.pw-pay-tab').forEach(p => p.classList.remove('active')); el.classList.add('active'); payMethod = el.dataset.pay; document.getElementById('pw-cta').textContent = payMethod === 'crypto' ? t('pw.ctaCrypto') : t('pw.cta'); }
function grantAccess() { const exp = Date.now() + (PLAN_MS[selectedPlan] || PLAN_MS.month); try { localStorage.setItem('bb_access', JSON.stringify({ plan: selectedPlan, method: payMethod, exp })); } catch (e) {} hasAccess = true; closePaywall(); }
async function submitPaywall() {
  const cta = document.getElementById('pw-cta');
  if (payMethod === 'crypto') { if (!wallet.address) { await connectWallet(); if (!wallet.address) { document.getElementById('pw-note').textContent = t('pw.connectFirst'); return; } } }
  cta.textContent = t('pw.processing'); cta.disabled = true;
  setTimeout(() => { grantAccess(); cta.disabled = false; cta.textContent = t('pw.cta'); }, 900);
}
function installPaywallGate() {
  document.addEventListener('click', (e) => {
    if (hasAccess) return;
    const pw = document.getElementById('paywall');
    if (pw && pw.contains(e.target)) return;
    e.preventDefault(); e.stopPropagation(); openPaywall();
  }, true);
}

// ---------------- boot ----------------
function boot() {
  try { lang = localStorage.getItem('bb_lang') || 'pt'; } catch (e) { lang = 'pt'; }
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  applyI18n();
  loadFixtures('71');
  renderSlip();
  hasAccess = checkAccess();
  installPaywallGate();
  if (!hasAccess) openPaywall();
}
document.addEventListener('DOMContentLoaded', boot);
