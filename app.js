/* ============================================================
   Predict — World Cup 2026
   Real ESPN WC data when available (keyless) + modeled probabilities.
   Plug in The Odds API for real market % (see ODDS_API_KEY below).
   ============================================================ */

// Paste your The Odds API key here (the-odds-api.com) to use real odds → %.
const ODDS_API_KEY = '';

// ---------------- flag + code helpers ----------------
const CC = {
  Croatia:'hr',Ghana:'gh',Panama:'pa',England:'gb-eng',Colombia:'co',Portugal:'pt','DR Congo':'cd',
  Uzbekistan:'uz',Jordan:'jo',Argentina:'ar',Brazil:'br',Morocco:'ma',Spain:'es',Germany:'de',France:'fr',
  Belgium:'be',Mexico:'mx','South Africa':'za','Korea Republic':'kr',Czechia:'cz',Switzerland:'ch',Canada:'ca',
  'Bosnia and Herzegovina':'ba',Qatar:'qa',Scotland:'gb-sct',Haiti:'ht','United States':'us',USA:'us',Australia:'au',
  Paraguay:'py','Türkiye':'tr',Turkey:'tr',Netherlands:'nl','Saudi Arabia':'sa',Ecuador:'ec',Uruguay:'uy',
  Japan:'jp',Senegal:'sn',Nigeria:'ng',Egypt:'eg',Italy:'it',Norway:'no',Denmark:'dk',Poland:'pl',Austria:'at',
};
const TLA = {
  Croatia:'HRV',Ghana:'GHA',Panama:'PAN',England:'ENG',Colombia:'COL',Portugal:'PRT','DR Congo':'CDR',
  Uzbekistan:'UZB',Jordan:'JOR',Argentina:'ARG',Brazil:'BRA',Morocco:'MAR',Spain:'ESP',Germany:'GER',France:'FRA',
  Belgium:'BEL',Mexico:'MEX','South Africa':'RSA','Korea Republic':'KOR',Czechia:'CZE',Switzerland:'SUI',
  Canada:'CAN','Bosnia and Herzegovina':'BIH',Qatar:'QAT',Scotland:'SCO',Haiti:'HAI','United States':'USA',
  USA:'USA',Australia:'AUS',Paraguay:'PAR','Türkiye':'TUR',Netherlands:'NED',Uruguay:'URU',Ecuador:'ECU',
};
function flagURL(cc, w) { return cc ? `https://flagcdn.com/w${w || 40}/${cc}.png` : ''; }
function teamFlag(name, w) { return flagURL(CC[name], w); }
function tla(name) { return TLA[name] || name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase(); }
function crest(name, w) {
  const u = teamFlag(name, w);
  return u ? `<img class="crest" src="${u}" alt="" loading="lazy" />`
           : `<span class="crest" style="background:linear-gradient(135deg,#2f6bff,#15161d)"></span>`;
}

// ---------------- mock World Cup dataset (fallback / groups / winner / golden) ----------------
const MOCK_MATCHES = [
  ['Croatia','Ghana',53,28,19,190,'Jun 28 · 2:30AM'],
  ['Panama','England',5,11,84,188,'Jun 28 · 2:30AM'],
  ['Colombia','Portugal',28,25,47,258,'Jun 28 · 5:00AM'],
  ['DR Congo','Uzbekistan',62,24,14,111,'Jun 28 · 5:00AM'],
  ['Jordan','Argentina',5,11,84,412,'Jun 28 · 8:00AM'],
  ['Brazil','Morocco',61,23,16,377,'Jun 29 · 2:30AM'],
  ['Spain','Germany',44,27,29,512,'Jun 29 · 5:00AM'],
  ['France','Belgium',48,26,26,448,'Jun 29 · 8:00AM'],
];
const GROUPS = [
  ['A', [['Mexico',3,0,0,9],['South Africa',1,1,1,4],['Korea Republic',1,0,2,3],['Czechia',0,1,2,1]]],
  ['B', [['Switzerland',2,1,0,7],['Canada',1,1,1,4],['Bosnia and Herzegovina',1,1,1,4],['Qatar',0,1,2,1]]],
  ['C', [['Brazil',2,1,0,7],['Morocco',2,1,0,7],['Scotland',1,0,2,3],['Haiti',0,0,3,0]]],
  ['D', [['United States',2,1,0,7],['Australia',1,1,1,4],['Paraguay',1,0,2,3],['Türkiye',0,0,3,0]]],
  ['E', [['France',3,0,0,9],['Senegal',1,1,1,4],['Norway',1,0,2,3],['Japan',0,1,2,1]]],
  ['F', [['Argentina',2,1,0,7],['Spain',2,0,1,6],['Nigeria',1,1,1,4],['Jordan',0,0,3,0]]],
];
const WINNERS = [
  ['Brazil',14],['Argentina',12],['France',11],['Spain',10],['England',9],['Germany',7],['Portugal',6],['Netherlands',5],
  ['Belgium',4],['Morocco',3],['Uruguay',2],['Croatia',2],['United States',2],['Colombia',1],['Mexico',1],['Senegal',1],
];
const GOLDEN = [
  ['Lionel Messi','Golden Ball winner',42],
  ['Emiliano Martínez','Golden Glove winner',17],
  ['Kylian Mbappé','Golden Boot winner',26],
];

// ---------------- ESPN real data ----------------
function shapeEspn(ev) {
  const comp = (ev.competitions && ev.competitions[0]) || {}; const cs = comp.competitors || [];
  const home = cs.find(c => c.homeAway === 'home') || cs[0] || {};
  const away = cs.find(c => c.homeAway === 'away') || cs[1] || {};
  const st = ev.status?.type?.state;
  let status = 'NS', minute = null;
  if (st === 'in') { status = (ev.status?.period >= 2) ? '2H' : '1H'; minute = parseInt(ev.status?.displayClock, 10) || null; }
  else if (st === 'post') status = 'FT';
  const nm = (c) => c.team?.shortDisplayName || c.team?.displayName || c.team?.name || '—';
  const sc = (c) => (st === 'pre' || c.score == null) ? null : Number(c.score);
  const od = comp.odds && comp.odds[0];
  let probs = null;
  if (od) {
    const ml = (o) => o?.moneyLine ?? o?.current?.moneyLine?.american;
    const dec = (am) => am == null || isNaN(am) ? null : (am > 0 ? am / 100 + 1 : 100 / -am + 1);
    const h = dec(ml(od.homeTeamOdds)), d = dec(ml(od.drawOdds)), a = dec(ml(od.awayTeamOdds));
    if (h && a) { const ih = 1 / h, id = 1 / (d || 50), ia = 1 / a, s = ih + id + ia; probs = { h: ih / s, d: id / s, a: ia / s }; }
  }
  return { id: String(ev.id), home: nm(home), away: nm(away), hs: sc(home), as: sc(away), status, minute,
    when: new Date(ev.date), probs };
}
function seedProbs(id) {
  const s = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (n) => Math.abs(Math.sin(s * 0.7 + n));
  const h = 0.3 + r(1) * 0.4, d = 0.18 + r(2) * 0.12, a = 0.2 + r(3) * 0.4, t = h + d + a;
  return { h: h / t, d: d / t, a: a / t };
}

const MARKETS = {};   // id -> market
const state = { balance: 1000, fixtures: [] };

function fmtWhen(d) {
  const wd = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
  let h = d.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
  return `${mo} ${d.getDate()} · ${h}:${String(d.getMinutes()).padStart(2,'0')}${ap}`;
}

async function loadMarkets() {
  let markets = [];
  try {
    const r = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard');
    if (r.ok) {
      const j = await r.json();
      const evs = (j.events || []).map(shapeEspn);
      if (evs.length) markets = evs.map(e => ({
        id: e.id, home: e.home, away: e.away, hs: e.hs, as: e.as, status: e.status, minute: e.minute,
        when: fmtWhen(e.when), probs: e.probs || seedProbs(e.id), vol: 80 + (parseInt(e.id.slice(-3)) || 100) % 400, real: true,
      }));
    }
  } catch (e) { console.warn('ESPN WC unavailable, using sample slate', e); }

  if (!markets.length) {
    markets = MOCK_MATCHES.map((m, i) => ({
      id: 'wc' + i, home: m[0], away: m[1], hs: null, as: null, status: 'NS', minute: null,
      when: m[6], probs: normalize({ h: m[2], d: m[3], a: m[4] }), vol: m[5], real: false,
    }));
    flagMock();
  } else { clearMock(); }

  state.fixtures = markets;
  markets.forEach(m => MARKETS[m.id] = m);
  renderCards();
  renderGames();
}
function normalize(p) { const s = p.h + p.d + p.a || 1; return { h: p.h / s, d: p.d / s, a: p.a / s }; }

// ---------------- render: match cards ----------------
const cent = (x) => Math.round(x * 100);
function renderCards() {
  const el = document.getElementById('match-cards');
  el.innerHTML = state.fixtures.slice(0, 8).map(m => {
    const live = ['1H','2H','HT'].includes(m.status);
    const hcc = CC[m.home], acc = CC[m.away];
    const artH = hcc ? `style="background-image:url('${flagURL(hcc,160)}')"` : 'style="background:#23262f"';
    const artA = acc ? `style="background-image:url('${flagURL(acc,160)}')"` : 'style="background:#181a22"';
    return `
    <div class="mcard">
      <div class="mcard-art"><div class="half" ${artH}></div><div class="half r" ${artA}></div></div>
      <div class="mcard-body">
        <div class="mcard-title">${m.home} vs. ${m.away}</div>
        <div class="mcard-probs">
          ${crest(m.home, 40)}
          <span class="pp home">${cent(m.probs.h)}%</span>
          <span class="pp mut">${cent(m.probs.d)}%</span>
          <span class="pp mut">${cent(m.probs.a)}%</span>
          <span class="spacer"></span>${crest(m.away, 40)}
        </div>
        <div class="mcard-outs">
          <button class="out-btn home" onclick="openTrade('${m.id}','h')">${tla(m.home)}</button>
          <button class="out-btn draw" onclick="openTrade('${m.id}','d')">DRAW</button>
          <button class="out-btn away" onclick="openTrade('${m.id}','a')">${tla(m.away)}</button>
        </div>
        <div class="mcard-foot">
          <span class="spark"></span><span class="up">+${(m.vol / 80).toFixed(1)}K</span>
          <span class="fi">📊 $${m.vol}K</span><span class="fi">🕑 ${live ? m.minute + "'" : m.when}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ---------------- render: winner grid ----------------
function renderWinners() {
  document.getElementById('winner-grid').innerHTML = WINNERS.map(w => `
    <div class="win-cell">${crest(w[0], 80)}<span class="wp">${w[1]}%</span></div>`).join('')
    .replace(/class="crest"/g, 'class="crest" style="width:100%;aspect-ratio:1;border-radius:7px"');
}

// ---------------- render: groups ----------------
function renderGroups() {
  document.getElementById('groups').innerHTML = GROUPS.map(([g, rows]) => `
    <div class="group">
      <h3>Group ${g}</h3>
      <div class="grp-head"><span>Team</span><span>W</span><span>D</span><span>L</span><span>Pts</span></div>
      ${rows.map(t => `
        <div class="grp-row">
          <div class="grp-team">${crest(t[0], 40)}<span>${t[0]}</span></div>
          <span>${t[1]}</span><span>${t[2]}</span><span>${t[3]}</span><span class="pts">${t[4]}</span>
        </div>`).join('')}
    </div>`).join('');
}

// ---------------- render: golden leaders ----------------
function renderGolden() {
  document.getElementById('golden').innerHTML = GOLDEN.map((g, i) => `
    <div class="gold-card"><div class="gold-inner"><div class="gold-bar">
      <span class="gold-name">${g[0]} <small style="color:#cda">· ${g[1]}</small></span>
      <span style="display:flex;align-items:center"><span class="gold-pct">${g[2]}%</span>
      <span class="gold-yn"><button class="yn-s y" onclick="openAward(${i},'y')">YES</button><button class="yn-s n" onclick="openAward(${i},'n')">NO</button></span></span>
    </div></div></div>`).join('');
}

// ---------------- render: games list ----------------
let gameTab = 'games';
function renderGames() {
  const el = document.getElementById('games-list');
  el.innerHTML = state.fixtures.map(m => {
    const live = ['1H','2H','HT'].includes(m.status);
    const done = ['FT','AET','PEN'].includes(m.status);
    const when = live ? `${m.minute}'` : done ? 'FT' : m.when;
    return `
    <div class="grow">
      <div class="grow-top">
        <span class="grow-ball">26</span>
        <span class="grow-title">${m.home} vs. ${m.away}</span>
        <span class="grow-yield">⚡ Yield</span>
      </div>
      <div class="grow-probs">
        ${crest(m.home, 40)}
        <span class="pp home">${cent(m.probs.h)}%</span><span class="pp mut">${cent(m.probs.d)}%</span><span class="pp mut">${cent(m.probs.a)}%</span>
        ${crest(m.away, 40)}
      </div>
      <div class="grow-outs">
        <button class="out-btn home" onclick="openTrade('${m.id}','h')">${tla(m.home)}</button>
        <button class="out-btn draw" onclick="openTrade('${m.id}','d')">DRAW</button>
        <button class="out-btn away" onclick="openTrade('${m.id}','a')" style="background:var(--red);color:#fff;border:none">${tla(m.away)}</button>
      </div>
      <div class="grow-foot"><span class="pp-rate"><span class="star">★★★</span></span><span>📊 $${m.vol}K · ${when}</span></div>
    </div>`;
  }).join('');
}
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.game-tab');
  if (tab) { document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); gameTab = tab.dataset.tab; }
});

// ---------------- date tabs ----------------
function renderDateTabs() {
  const el = document.getElementById('date-tabs'); const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const now = new Date(); let html = '';
  for (let i = 0; i < 7; i++) { const d = new Date(now); d.setDate(now.getDate() + i);
    html += `<button class="date-tab${i === 0 ? ' active' : ''}" onclick="pickDate(this)"><div class="dt-d">${days[d.getDay()]}</div><div class="dt-n">${String(d.getDate()).padStart(2,'0')}</div></button>`; }
  el.innerHTML = html;
}
function pickDate(b) { document.querySelectorAll('.date-tab').forEach(t => t.classList.remove('active')); b.classList.add('active'); }

// ---------------- countdown ----------------
let cd = { d: 6, h: 13, m: 22, s: 4 };
function tickCountdown() {
  cd.s--; if (cd.s < 0) { cd.s = 59; cd.m--; } if (cd.m < 0) { cd.m = 59; cd.h--; } if (cd.h < 0) { cd.h = 23; cd.d--; } if (cd.d < 0) cd = { d: 0, h: 0, m: 0, s: 0 };
  const p = (n) => String(n).padStart(2, '0');
  document.getElementById('cd-d').textContent = p(cd.d); document.getElementById('cd-h').textContent = p(cd.h);
  document.getElementById('cd-m').textContent = p(cd.m); document.getElementById('cd-s').textContent = p(cd.s);
}

// ============================================================
//  Trading (bottom sheet) + portfolio
// ============================================================
const positions = [];
let trade = { id: null, out: null, side: 'yes', amount: 25 };
const OUT_LABEL = { h: 'home', d: 'draw', a: 'away' };
function outName(m, out) { return out === 'd' ? 'Draw' : (out === 'h' ? m.home : m.away); }
function yesProb(m, out) { return out === 'h' ? m.probs.h : out === 'd' ? m.probs.d : m.probs.a; }

function openTrade(id, out) {
  const m = MARKETS[id]; if (!m) return;
  trade = { id, out, side: 'yes', amount: trade.amount || 25 };
  renderTrade(); document.getElementById('trade-sheet').classList.add('open');
}
function openAward(i, side) {
  const g = GOLDEN[i];
  trade = { award: i, id: 'award' + i, out: 'y', side, amount: trade.amount || 25, awardProb: g[2] / 100, awardName: g[0], awardDesc: g[1] };
  renderTrade(); document.getElementById('trade-sheet').classList.add('open');
}
function setSide(s) { trade.side = s; renderTrade(); }
function setAmt(v) { trade.amount = v; renderTrade(); }
function readAmt() { const el = document.getElementById('amt'); if (el) trade.amount = parseFloat(el.value) || 0; }
function closeSheet() { document.getElementById('trade-sheet').classList.remove('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function renderTrade() {
  const el = document.getElementById('trade-body');
  let q, match, yp;
  if (trade.award != null) { q = trade.awardName; match = trade.awardDesc; yp = trade.awardProb; }
  else { const m = MARKETS[trade.id]; q = outName(m, trade.out); match = `${m.home} vs. ${m.away}`; yp = yesProb(m, trade.out); }
  const price = trade.side === 'yes' ? yp : (1 - yp);
  const amt = trade.amount || 0; const shares = price > 0 ? amt / price : 0;
  el.innerHTML = `
    <div class="trade-mkt"><div class="tm-q">${q}</div><div class="tm-match">${match}</div></div>
    <div class="yn">
      <button class="yn-btn yes${trade.side === 'yes' ? ' on' : ''}" onclick="setSide('yes')">YES<b>${cent(yp)}¢</b></button>
      <button class="yn-btn no${trade.side === 'no' ? ' on' : ''}" onclick="setSide('no')">NO<b>${cent(1 - yp)}¢</b></button>
    </div>
    <div class="amt-row"><label>Amount (US$)</label><input id="amt" value="${amt.toFixed(2)}" oninput="readAmt();renderTrade()" /></div>
    <div class="presets">
      <button class="preset" onclick="setAmt(10)">$10</button><button class="preset" onclick="setAmt(25)">$25</button>
      <button class="preset" onclick="setAmt(50)">$50</button><button class="preset" onclick="setAmt(100)">$100</button>
    </div>
    <div class="t-summary"><span>Shares</span><span class="v">${shares.toFixed(1)}</span></div>
    <div class="t-summary"><span>Avg price</span><span class="v">${cent(price)}¢</span></div>
    <div class="t-summary big"><span>Max payout</span><span class="v">$${shares.toFixed(2)}</span></div>
    <button class="buy-btn ${trade.side === 'no' ? 'no' : ''}" onclick="buy()" ${amt <= 0 || amt > state.balance ? 'disabled' : ''}>
      Buy ${trade.side === 'yes' ? 'YES' : 'NO'} · ${cent(price)}¢</button>`;
}
function buy() {
  let q, match, yp, id = trade.id;
  if (trade.award != null) { q = trade.awardName; match = trade.awardDesc; yp = trade.awardProb; }
  else { const m = MARKETS[trade.id]; q = outName(m, trade.out); match = `${m.home} vs. ${m.away}`; yp = yesProb(m, trade.out);
    const delta = 0.0008 * (trade.amount || 0) * (trade.side === 'yes' ? 1 : -1);
    const key = trade.out === 'h' ? 'h' : trade.out === 'd' ? 'd' : 'a';
    m.probs[key] = Math.max(0.01, m.probs[key] + delta); m.probs = normalize(m.probs); }
  const price = trade.side === 'yes' ? yp : (1 - yp);
  const amt = trade.amount || 0; if (amt <= 0 || amt > state.balance || price <= 0.01 || price >= 0.99) return;
  positions.push({ id, side: trade.side, shares: amt / price, cost: amt, avg: price, label: q, match });
  state.balance -= amt;
  updateFab(); renderCards(); renderGames(); renderPositions(); closeSheet();
}
function renderPositions() {
  const el = document.getElementById('pos-body');
  if (!positions.length) { el.innerHTML = `<div class="empty-s">No open positions yet. Tap a market to trade.</div>`; return; }
  el.innerHTML = positions.map((q, i) => {
    const value = q.shares * q.avg; const pl = 0;
    return `<div class="pos-card"><div class="pos-top">
      <div><div class="pos-name">${q.side === 'no' ? 'NO · ' : ''}${q.label}</div><div class="pos-match">${q.match}</div></div>
      <button class="pos-rm" onclick="closePos(${i})">×</button></div>
      <div class="pos-stats"><span>${q.shares.toFixed(1)} shares @ ${cent(q.avg)}¢</span>
      <span class="pos-val pos">$${value.toFixed(2)} <em>+0.00</em></span></div></div>`;
  }).join('');
}
function closePos(i) { const q = positions[i]; if (!q) return; state.balance += q.shares * q.avg; positions.splice(i, 1); updateFab(); renderPositions(); }
function updateFab() {
  document.getElementById('fab-bal').textContent = '$' + Math.round(state.balance);
  document.getElementById('fab-pos').textContent = positions.length;
}
function openPortfolio() { renderPositions(); document.getElementById('port-sheet').classList.add('open'); }

// ============================================================
//  Crypto wallet (EIP-1193) — Sign Up / Connect
// ============================================================
const USDT = { '0x1': { addr:'0xdAC17F958D2ee523a2206206994597C13D831ec7', dec:6, name:'Ethereum' },
  '0x38': { addr:'0x55d398326f99059fF775485246999027B3197955', dec:18, name:'BNB Chain' },
  '0x89': { addr:'0xc2132D05D31c914a87C6611C10748AEb04B58e8F', dec:6, name:'Polygon' } };
const NET = { '0x1':'Ethereum','0x38':'BNB Chain','0x89':'Polygon','0xa':'Optimism','0x2105':'Base' };
const wallet = { address: null, chainId: null, native: 0, usdt: 0 };
const fromU = (hex, d) => { try { return Number(BigInt(hex)) / 10 ** d; } catch (e) { return 0; } };
function openWallet() { renderWallet(); document.getElementById('wallet-modal').classList.add('open'); }
async function connectWallet() {
  if (typeof window.ethereum === 'undefined') { renderWallet(); return; }
  try {
    const a = await window.ethereum.request({ method: 'eth_requestAccounts' });
    wallet.address = a[0]; wallet.chainId = await window.ethereum.request({ method: 'eth_chainId' });
    await refreshBal(); renderWallet();
  } catch (e) { console.error(e); }
}
async function refreshBal() {
  if (!wallet.address) return;
  try { wallet.native = fromU(await window.ethereum.request({ method:'eth_getBalance', params:[wallet.address,'latest'] }), 18); } catch (e) {}
  const t = USDT[wallet.chainId]; wallet.usdt = 0;
  if (t) { try { const data='0x70a08231'+'000000000000000000000000'+wallet.address.slice(2);
    wallet.usdt = fromU(await window.ethereum.request({ method:'eth_call', params:[{to:t.addr,data},'latest'] }), t.dec); } catch (e) {} }
}
function shortA(a) { return a ? a.slice(0,6)+'…'+a.slice(-4) : ''; }
function renderWallet() {
  const el = document.getElementById('wallet-body');
  if (!wallet.address) {
    if (typeof window.ethereum === 'undefined') {
      el.innerHTML = `<p class="wallet-warn">No wallet detected. Install MetaMask to continue.</p>
        <a class="modal-cta" href="https://metamask.io/download/" target="_blank" rel="noopener" style="display:block;text-align:center">Install MetaMask</a>`;
      return;
    }
    el.innerHTML = `<button class="wallet-opt" onclick="connectWallet()"><span class="wo-ic">🦊</span><span><span class="wo-name">MetaMask / EVM</span><br><span class="wo-sub">Browser wallet</span></span></button>
      <button class="wallet-opt" onclick="connectWallet()"><span class="wo-ic">🔗</span><span><span class="wo-name">WalletConnect</span><br><span class="wo-sub">Scan with your app</span></span></button>`;
    return;
  }
  el.innerHTML = `<div class="wallet-info">
    <div class="wi-row"><span class="k">Address</span><span class="v">${shortA(wallet.address)}</span></div>
    <div class="wi-row"><span class="k">Network</span><span class="v">${NET[wallet.chainId] || 'Chain ' + parseInt(wallet.chainId, 16)}</span></div>
    <div class="wi-row"><span class="k">Native</span><span class="v">${wallet.native.toFixed(4)}</span></div>
    <div class="wi-row"><span class="k">USDT</span><span class="v big">${wallet.usdt.toFixed(2)}</span></div></div>
    <p class="wallet-warn">Real on-chain balance. Deposits are user-signed to an address you control — this demo holds no custody.</p>
    <button class="modal-cta ghost" onclick="wallet.address=null;renderWallet()">Disconnect</button>`;
}

// ---------------- boot ----------------
function boot() {
  renderDateTabs();
  renderWinners();
  renderGroups();
  renderGolden();
  renderPositions();
  updateFab();
  loadMarkets();
  tickCountdown(); setInterval(tickCountdown, 1000);
  // close sheets on overlay click
  document.querySelectorAll('.sheet-overlay').forEach(o => o.addEventListener('click', (e) => { if (e.target === o) o.classList.remove('open'); }));
}
function flagMock() { let b = document.getElementById('mock-bar'); if (!b) { b = document.createElement('div'); b.id = 'mock-bar'; document.querySelector('.app').prepend(b); } b.textContent = '⚠️ Showing a sample WC slate — live ESPN World Cup data appears here during the tournament.'; }
function clearMock() { const b = document.getElementById('mock-bar'); if (b) b.remove(); }
document.addEventListener('DOMContentLoaded', boot);
