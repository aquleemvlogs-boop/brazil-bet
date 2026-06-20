# Brazil Bet

A sports-betting **demo/prototype** — Brazilian flag palette, dark esports-style UI.
Bet on real football fixtures (1 / X / 2 odds) with a bet slip, PT/EN, a subscription
paywall, and a real EIP-1193 crypto wallet.

> **This is a prototype, not a live betting operation.** Payments are simulated, the
> wallet takes no custody, and operating it for real money requires gambling licensing
> (in Brazil, Lei 14.790/2023 / SPA-MF) plus KYC/AML. Don't take real bets on it.

## Hosting

It's a **fully static site** — `index.html`, `styles.css`, `app.js`. Match data comes
straight from ESPN's public API in the browser (CORS-enabled), so **no backend is needed**
to host it. Drop those three files on any static host (GitHub Pages, Netlify, Vercel static…).

### Data sources
- **Live fixtures / scores / crests:** ESPN public API (keyless). Off-season competitions
  fall back to sample data.
- **Odds:** ESPN moneylines when present, otherwise generated for display. For full real
  odds use a licensed feed (The Odds API, API-Football).

## Optional local backend

`server.js` (Express) is included for local dev and as a proxy if you add an
`API_FOOTBALL_KEY` (see `.env.example`) — not required for the static deploy.

```bash
npm install
npm start   # http://localhost:3100
```
