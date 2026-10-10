'use strict';
const get = id => document.getElementById(id);
const money = value => value.toLocaleString('en-US', {style:'currency', currency:'USD'});
const bitcoin = value => value.toLocaleString('en-US', {minimumFractionDigits:6, maximumFractionDigits:6}) + ' BTC';
const signed = (value, format) => `${value < 0 ? '−' : value > 0 ? '+' : ''}${format(Math.abs(value))}`;
const percent = value => Math.abs(value).toLocaleString('en-US', {minimumFractionDigits:1, maximumFractionDigits:1}) + '%';
let unit = 'usd';
let current;
const ENTRY_PRICE = 44164.93;
let quote = {amount:82700, time:'2026-10-10T06:16:19Z', source:'CoinGecko', live:false};
function isDatedScenario() {return get('btc-entry').valueAsNumber === ENTRY_PRICE && get('token-return').valueAsNumber === -99 && Math.abs(get('btc-current').valueAsNumber - quote.amount) < 0.000001;}
get('year').textContent = new Date().getFullYear();
function readScenario() {
  const capital = get('investment').valueAsNumber;
  const token = get('token-return').valueAsNumber;
  const endingPrice = get('btc-current').valueAsNumber;
  const price = get('btc-entry').valueAsNumber;
  const btc = (endingPrice / price - 1) * 100;
  const altValue = capital * (1 + token / 100);
  const btcValue = capital * (1 + btc / 100);
  return {capital, token, btc, price, altValue, btcValue, endingPrice,
    gap:btcValue - altValue, relative:(altValue / btcValue - 1) * 100,
    initialBTC:capital / price, altBTC:altValue / endingPrice};
}
function drawChart() {
  const s = current;
  // The entry bar shows the capital at the entry date in the selected unit.
  const values = unit === 'usd' ? [s.capital, s.altValue, s.btcValue] : [s.initialBTC, s.altBTC, s.initialBTC];
  const maximum = Math.max(...values);
  const format = unit === 'usd' ? money : bitcoin;
  ['entry-chart-value','alt-value','btc-value'].forEach((id,i) => {get(id).textContent = format(values[i]);});
  ['entry-bar','alt-bar','btc-bar'].forEach((id,i) => {get(id).style.width = `${values[i] / maximum * 100}%`;});
  get('scale-mid').textContent = format(maximum / 2);
  get('scale-max').textContent = format(maximum);
  get('chart-unit').textContent = unit.toUpperCase();
  get('chart-subtitle').textContent = unit === 'usd' ? 'One purchase. Two different outcomes.' : 'Your ending alt value, measured in Bitcoin.';
  get('comparison-chart').setAttribute('aria-label', `Illustrative comparison in ${unit.toUpperCase()}. Capital at entry: ${format(values[0])}. Alt at end: ${format(values[1])}. Bitcoin alternative at end: ${format(values[2])}.`);
}
function update() {
  const form = get('calculator');
  if (!form.checkValidity()) {get('input-status').textContent = 'Enter valid values to update the comparison.'; return;}
  current = readScenario();
  const s = current;
  if (!Object.values(s).every(Number.isFinite)) return;
  const ahead = s.gap < -0.000001;
  const equal = Math.abs(s.gap) < 0.000001;
  get('gap-label').textContent = equal ? 'Difference vs buying BTC' : ahead ? 'Ahead of buying BTC by' : 'Cost of choosing the alt';
  get('usd-gap').textContent = money(Math.abs(s.gap));
  get('btc-gap').textContent = `${bitcoin(Math.abs(s.initialBTC - s.altBTC))} ${equal ? 'difference' : ahead ? 'ahead of BTC' : 'left behind'}`;
  get('relative-return').textContent = signed(Math.abs(s.relative) < 0.0000001 ? 0 : s.relative, percent);
  get('relative-return').classList.toggle('is-loss', !equal && !ahead);
  get('result-description').textContent = equal ? 'Your alt kept pace with Bitcoin' : `${percent(s.relative)} ${ahead ? 'more' : 'less'} BTC purchasing power`;
  get('usd-profit').textContent = signed(s.altValue - s.capital, money);
  get('usd-profit').classList.toggle('is-loss', s.token < 0);
  get('usd-profit-description').textContent = `${signed(s.token, percent)} on your initial capital`;
  const altOutcome = `Your alt ${s.token < 0 ? 'lost' : 'made'} ${money(Math.abs(s.altValue - s.capital))} in dollars.`;
  const btcOutcome = `Buying BTC instead would have ${s.btc < 0 ? 'lost' : 'made'} ${money(Math.abs(s.btcValue - s.capital))}.`;
  get('dashboard-insight').textContent = `${altOutcome} ${btcOutcome} ${equal ? 'Both choices ended at the same value.' : `Your alt ended ${bitcoin(Math.abs(s.initialBTC - s.altBTC))} ${ahead ? 'ahead of' : 'behind'} the BTC alternative.`}`;
  get('input-status').textContent = isDatedScenario() ? 'Entry: Jan 5, 2024. BTC uses the quoted price above.' : 'Custom scenario. Prices do not establish a purchase date.';
  document.querySelectorAll('[data-preset]').forEach(button => {button.setAttribute('aria-pressed', String(button.dataset.preset === 'dated' ? isDatedScenario() : button.dataset.preset.split(',').every((v,i) => Math.abs(Number(v) - (i === 0 ? s.token : s.btc)) < 0.000001)));});
  drawChart();
}
get('calculator').addEventListener('submit', event => {event.preventDefault(); if (event.currentTarget.reportValidity()) update();});
get('calculator').addEventListener('input', update);
document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.preset === 'dated') {
    get('token-return').value = -99; get('btc-entry').value = ENTRY_PRICE; get('btc-current').value = quote.amount;
  } else {
    const [token, btc] = button.dataset.preset.split(',').map(Number);
    get('token-return').value = token; get('btc-current').value = get('btc-entry').valueAsNumber * (1 + btc / 100);
  }
  update();
}));
document.querySelectorAll('[data-unit]').forEach(button => button.addEventListener('click', () => {
  unit = button.dataset.unit;
  document.querySelectorAll('[data-unit]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  drawChart();
}));
update();

function renderHero() {
  const capital = 10000, alt = 100, btc = capital / ENTRY_PRICE * quote.amount;
  const gap = btc - alt, change = (quote.amount / ENTRY_PRICE - 1) * 100;
  get('hero-gap').textContent = money(gap);
  get('hero-btc-value').textContent = money(btc);
  get('hero-btc-return').textContent = `BTC instead / ${change < 0 ? 'down' : 'up'} ${percent(change)}`;
  get('hero-relative').textContent = signed((alt / btc - 1) * 100, percent);
  get('hero-explanation').textContent = `$10,000 bought ${bitcoin(capital / ENTRY_PRICE)} at ${money(ENTRY_PRICE)}. At a BTC quote of ${money(quote.amount)}, that BTC is worth ${money(btc)}. An assumed 99% alt loss leaves $100. Opportunity cost: ${money(gap)}.`;
  const max = Math.max(capital, btc, alt), y = value => 174 - value / max * 169;
  get('hero-btc-line').setAttribute('d', `M0 ${y(capital)} L500 ${y(btc)}`);
  get('hero-alt-line').setAttribute('d', `M0 ${y(capital)} L500 ${y(alt)}`);
  get('hero-area').setAttribute('d', `M0 ${y(capital)} L500 ${y(btc)} L500 ${y(alt)} Z`);
  get('hero-start-dot').setAttribute('cy', y(capital));get('hero-btc-dot').setAttribute('cy', y(btc));get('hero-alt-dot').setAttribute('cy', y(alt));
  get('hero-chart').setAttribute('aria-label', `Entry Jan 5, 2024. $10,000 in BTC at ${money(ENTRY_PRICE)} is worth ${money(btc)} at the displayed quote. Assumed alt loss of 99 percent leaves $100. Opportunity cost: ${money(gap)}. Lines connect endpoints, not historical prices.`);
  const time = new Date(quote.time).toLocaleString('en-US', {timeZone:'America/Los_Angeles',month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'});
  get('quote-status').textContent = `${quote.live ? 'BTC quote retrieved' : 'Saved BTC quote'}: ${money(quote.amount)} · ${time} · ${quote.source}`;
  get('quote-source-link').href = quote.source === 'Coinbase' ? 'https://www.coinbase.com/price/bitcoin' : 'https://www.coingecko.com/en/coins/bitcoin';
}
async function refreshQuote() {
  const button = get('refresh-quote'); button.disabled = true; button.textContent = 'Refreshing BTC price…';
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot', {signal:controller.signal,cache:'no-store',credentials:'omit'});
    if (!response.ok) throw new Error('Quote unavailable');
    const payload = await response.json(); const amount = Number(payload.data?.amount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000000000 || payload.data.currency !== 'USD' || payload.data.base !== 'BTC') throw new Error('Invalid quote');
    const useQuote = isDatedScenario();
    quote = {amount,time:new Date().toISOString(),source:'Coinbase',live:true};
    renderHero();
    if (useQuote) {get('btc-current').value = amount; update();}
  } catch {
    renderHero();get('quote-status').textContent += ' · Refresh unavailable; retaining this timestamped quote.';
  } finally {clearTimeout(timeout);button.disabled = false;button.textContent = 'Refresh BTC price ↻';}
}
get('refresh-quote').addEventListener('click', refreshQuote);
renderHero();
refreshQuote();
