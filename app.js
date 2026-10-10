'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('calculator').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const token = document.getElementById('token-return').valueAsNumber;
  const btc = document.getElementById('btc-return').valueAsNumber;
  const relative = ((1 + token / 100) / (1 + btc / 100) - 1) * 100;
  if (!Number.isFinite(relative)) return;
  const rounded = Math.abs(relative) < 0.05 ? 0 : relative;
  const value = Math.abs(rounded).toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1});
  const output = document.getElementById('relative-return');
  output.textContent = `${rounded < 0 ? '−' : rounded > 0 ? '+' : ''}${value}%`;
  output.style.color = rounded < 0 ? '#edb195' : '#d4f78b';
  document.getElementById('result-description').textContent = rounded === 0
    ? 'Your token kept pace with Bitcoin over this period.'
    : `Your token buys ${value}% ${rounded < 0 ? 'less' : 'more'} BTC than it did at the start.`;
});
