'use strict';

const duration = 30_000;
const storageKey = 'click-rush-best';
const scoreView = document.querySelector('#score');
const timeView = document.querySelector('#time');
const bestView = document.querySelector('#best');
const timer = document.querySelector('#timer');
const message = document.querySelector('#message');
const target = document.querySelector('#target');
const start = document.querySelector('#start');
let score = 0;
let best = 0;
let deadline = 0;
let running = false;

try {
  const saved = Number(localStorage.getItem(storageKey));
  if (Number.isSafeInteger(saved) && saved >= 0) best = saved;
} catch { /* Storage may be unavailable in private or restricted browsers. */ }
bestView.textContent = best;

function finish() {
  running = false;
  target.disabled = true;
  start.disabled = false;
  start.textContent = 'もう一度挑戦';
  timeView.textContent = '0.0';
  timer.value = 0;
  const newBest = score > best;
  if (newBest) {
    best = score;
    bestView.textContent = best;
    try { localStorage.setItem(storageKey, String(best)); } catch { /* Gameplay still works. */ }
  }
  message.textContent = `${score}回！${newBest ? ' 自己ベスト更新！' : ' おつかれさま！もう一度挑戦してみよう。'}`;
  start.focus({ preventScroll: true });
}

function tick() {
  if (!running) return;
  const remaining = Math.max(0, deadline - performance.now());
  timeView.textContent = (remaining / 1000).toFixed(1);
  timer.value = remaining / 1000;
  if (remaining === 0) finish();
  else requestAnimationFrame(tick);
}

start.addEventListener('click', () => {
  if (running) return;
  score = 0;
  scoreView.textContent = '0';
  deadline = performance.now() + duration;
  running = true;
  target.disabled = false;
  start.disabled = true;
  message.textContent = '連打しよう！残り30秒。';
  target.focus({ preventScroll: true });
  tick();
});

target.addEventListener('click', () => {
  if (!running) return;
  if (performance.now() >= deadline) {
    finish();
    return;
  }
  scoreView.textContent = ++score;
});
