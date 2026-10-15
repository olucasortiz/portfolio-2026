/*
* Career date helpers. Pure and deterministic: "now" is always an argument.
*
* Duration convention: whole calendar months between the start month and the
* end month (or the current month for ongoing roles), i.e.
* (endYear - startYear) * 12 + (endMonth - startMonth). The day of month is
* ignored, so January 2026 → October 2026 = 9 months and
* May 2025 → October 2026 = 17 months = 1 year and 5 months.
* The same rule is used for completed roles (May 2023 → April 2025 = 23 months).
*/
export type CareerLocale = 'pt' | 'en';
export type YearMonth = { year: number; month: number }; // month: 1–12

const months = {
  pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
} as const;

export function currentYearMonth(date: Date = new Date()): YearMonth {
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function monthsBetween(start: YearMonth, end: YearMonth): number {
  return Math.max(0, (end.year - start.year) * 12 + (end.month - start.month));
}

export function formatYearMonth(value: YearMonth, locale: CareerLocale): string {
  const name = months[locale][value.month - 1];
  return locale === 'pt' ? `${name} de ${value.year}` : `${name} ${value.year}`;
}

export function formatPeriod(start: YearMonth, end: YearMonth | null, locale: CareerLocale): string {
  const present = locale === 'pt' ? 'Atual' : 'Present';
  return `${formatYearMonth(start, locale)} — ${end ? formatYearMonth(end, locale) : present}`;
}

export function formatDuration(totalMonths: number, locale: CareerLocale): string {
  const total = Math.max(0, Math.floor(totalMonths));
  const years = Math.floor(total / 12);
  const rest = total % 12;
  const yearUnit = locale === 'pt' ? (years === 1 ? 'ano' : 'anos') : (years === 1 ? 'year' : 'years');
  const monthUnit = locale === 'pt' ? (rest === 1 ? 'mês' : 'meses') : (rest === 1 ? 'month' : 'months');
  if (total === 0) return locale === 'pt' ? 'menos de 1 mês' : 'less than 1 month';
  if (years === 0) return `${rest} ${monthUnit}`;
  if (rest === 0) return `${years} ${yearUnit}`;
  return `${years} ${yearUnit} ${locale === 'pt' ? 'e' : 'and'} ${rest} ${monthUnit}`;
}

export function experienceDuration(start: YearMonth, end: YearMonth | null, now: YearMonth, locale: CareerLocale): string {
  return formatDuration(monthsBetween(start, end ?? now), locale);
}
