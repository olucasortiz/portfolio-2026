'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { gsap } from '@/lib/motion';
import type { Locale } from '@/lib/content';
import { caseCopy, caseSectionLabels } from '@/lib/case-study-content';
import styles from './case-chapters.module.css';

export function CaseChapters({ chapters, locale, labels: customLabels }: { chapters: readonly string[]; locale: Locale; labels?: Readonly<Record<string, string>> }) {
  const root = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDetailsElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const labels = customLabels ?? caseSectionLabels[locale];
  const t = caseCopy[locale];

  useLayoutEffect(() => {
    const navigation = root.current;
    const reading = navigation?.closest<HTMLElement>('[data-case-reading]');
    if (!navigation || !reading) return;
    const sections = chapters.map((id) => reading.querySelector<HTMLElement>(`#${id}`)).filter((section) => section !== null);
    if (!sections.length) return;
    let positions: number[] = [];
    let offset = 104;
    let selected: string | null = null;
    let frame = 0;
    let alive = true;
    let lastPercent = -1;
    const measure = () => {
      offset = parseFloat(getComputedStyle(reading).getPropertyValue('--chapter-offset')) || 104;
      positions = sections.map((section) => section.getBoundingClientRect().top + window.scrollY);
    };
    const update = (trigger: ScrollTrigger) => {
      const line = window.scrollY + offset + 2;
      let index = -1;
      for (let i = 0; i < positions.length && positions[i] <= line; i++) index = i;
      if (trigger.progress >= 1) index = sections.length - 1;
      const next = index < 0 ? null : sections[index].id;
      if (next !== selected) {
        selected = next;
        setActive(next);
        sections.forEach((section) => section.setAttribute('data-chapter-active', String(section.id === next)));
      }
      // Only a CSS variable changes per frame; React renders on chapter changes.
      navigation.style.setProperty('--chapter-progress', String(trigger.progress));
      const percent = Math.round(trigger.progress * 100);
      if (percent !== lastPercent) {
        progress.current?.setAttribute('aria-valuenow', String(percent));
        lastPercent = percent;
      }
    };
    gsap.registerPlugin(ScrollTrigger);
    measure();
    const trigger = ScrollTrigger.create({
      trigger: reading, start: () => `top ${offset}px`, end: 'bottom bottom',
      onUpdate: update,
      onRefreshInit: measure,
      onRefresh: update,
      onLeave: update, onLeaveBack: update,
    });
    update(trigger);
    const refresh = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { frame = 0; trigger.refresh(); });
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(refresh);
    observer?.observe(reading);
    window.addEventListener('resize', refresh, { passive: true });
    window.addEventListener('hashchange', refresh);
    window.addEventListener('popstate', refresh);
    void document.fonts.ready.then(() => { if (alive) refresh(); });
    return () => {
      alive = false;
      observer?.disconnect();
      window.removeEventListener('resize', refresh);
      window.removeEventListener('hashchange', refresh);
      window.removeEventListener('popstate', refresh);
      if (frame) cancelAnimationFrame(frame);
      trigger.kill();
      navigation.style.removeProperty('--chapter-progress');
      sections.forEach((section) => section.removeAttribute('data-chapter-active'));
    };
  }, [chapters]);

  const links = () => <ul className={styles.links}>{chapters.map((id) => (
    <li key={id}><a href={`#${id}`} aria-current={active === id ? 'location' : undefined}
      onClick={() => { if (menu.current) menu.current.open = false; }}>{labels[id]}</a></li>
  ))}</ul>;

  return (
    <nav ref={root} className={styles.navigation} aria-label={t.navigation}>
      <div className={styles.desktop}><p className={styles.label}>{t.navigation}</p>{links()}</div>
      <details ref={menu} className={styles.mobile}>
        <summary><span>{t.navigation}<strong>{active ? labels[active] : labels[chapters[0]]}</strong></span><ChevronDown size={20} aria-hidden="true" /></summary>
        {links()}
      </details>
      <div ref={progress} className={styles.progress} role="progressbar" aria-label={t.readingProgress}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}><span /></div>
      <noscript><style>{`.${styles.progress} { display: none; }`}</style></noscript>
    </nav>
  );
}
