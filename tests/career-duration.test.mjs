import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  currentYearMonth, experienceDuration, formatDuration, formatPeriod, monthsBetween,
} from '../lib/career-duration.ts';

const ym = (year, month) => ({ year, month });

test('ongoing roles use the current calendar month', () => {
  assert.equal(experienceDuration(ym(2026, 1), null, ym(2026, 10), 'pt'), '9 meses');
  assert.equal(experienceDuration(ym(2026, 1), null, ym(2026, 10), 'en'), '9 months');
  assert.equal(experienceDuration(ym(2025, 5), null, ym(2026, 10), 'pt'), '1 ano e 5 meses');
  assert.equal(experienceDuration(ym(2025, 5), null, ym(2026, 10), 'en'), '1 year and 5 months');
});

test('duration updates when the month or year changes', () => {
  assert.equal(experienceDuration(ym(2025, 5), null, ym(2026, 11), 'en'), '1 year and 6 months');
  assert.equal(experienceDuration(ym(2025, 5), null, ym(2027, 1), 'en'), '1 year and 8 months');
  assert.equal(monthsBetween(ym(2025, 12), ym(2026, 1)), 1);
  assert.equal(monthsBetween(ym(2026, 1), ym(2026, 1)), 0);
});

test('completed roles use fixed start and end months', () => {
  const now = ym(2030, 6);
  assert.equal(experienceDuration(ym(2023, 5), ym(2025, 4), now, 'pt'), '1 ano e 11 meses');
  assert.equal(experienceDuration(ym(2023, 5), ym(2025, 4), now, 'en'), '1 year and 11 months');
});

test('singular, plural, zero and exact-year formatting', () => {
  assert.equal(formatDuration(1, 'pt'), '1 mês');
  assert.equal(formatDuration(1, 'en'), '1 month');
  assert.equal(formatDuration(11, 'en'), '11 months');
  assert.equal(formatDuration(12, 'pt'), '1 ano');
  assert.equal(formatDuration(12, 'en'), '1 year');
  assert.equal(formatDuration(24, 'pt'), '2 anos');
  assert.equal(formatDuration(25, 'pt'), '2 anos e 1 mês');
  assert.equal(formatDuration(13, 'en'), '1 year and 1 month');
  assert.equal(formatDuration(0, 'pt'), 'menos de 1 mês');
  assert.equal(formatDuration(0, 'en'), 'less than 1 month');
});

test('period labels in both languages', () => {
  assert.equal(formatPeriod(ym(2026, 1), null, 'pt'), 'Janeiro de 2026 — Atual');
  assert.equal(formatPeriod(ym(2026, 1), null, 'en'), 'January 2026 — Present');
  assert.equal(formatPeriod(ym(2025, 5), null, 'pt'), 'Maio de 2025 — Atual');
  assert.equal(formatPeriod(ym(2023, 5), ym(2025, 4), 'pt'), 'Maio de 2023 — Abril de 2025');
  assert.equal(formatPeriod(ym(2023, 5), ym(2025, 4), 'en'), 'May 2023 — April 2025');
});

test('currentYearMonth reads a supplied date', () => {
  assert.deepEqual(currentYearMonth(new Date(2026, 9, 14)), ym(2026, 10));
  assert.deepEqual(currentYearMonth(new Date(2027, 0, 1)), ym(2027, 1));
});
