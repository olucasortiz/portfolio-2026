'use client';

import { useSyncExternalStore } from 'react';
import { currentYearMonth, experienceDuration, formatPeriod, type YearMonth } from '@/lib/career-duration';
import type { Locale } from '@/lib/content';

type Period = { start: YearMonth; end: YearMonth | null };

// Read once per snapshot key so React sees a stable value; never ticks.
function snapshot() {
  const { year, month } = currentYearMonth();
  return `${year}-${month}`;
}
const subscribe = () => () => {};
const serverSnapshot = () => '';

/** Fixed period text (server-rendered) plus a duration computed on the client from the current month. */
export function ExperiencePeriod({ period, locale }: { period: Period; locale: Locale }) {
  const key = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const label = formatPeriod(period.start, period.end, locale);
  if (!key) return <>{label}</>;
  const [year, month] = key.split('-').map(Number);
  return <>{label} · {experienceDuration(period.start, period.end, { year, month }, locale)}</>;
}
