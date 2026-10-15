'use client';

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import { gsap } from '@/lib/motion';
import { experiences, type Locale } from '@/lib/content';
import { careerActivities, careerCopy } from '@/lib/career-content';
import { formatPeriod } from '@/lib/career-duration';
import { ExperiencePeriod } from './experience-period';
import styles from './home-experience.module.css';

export function HomeExperience({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = careerCopy[locale];

  useLayoutEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const content = scope.querySelector(`[data-career-panel="${active}"] [data-career-content]`);
        if (content) gsap.fromTo(content, { y: 8, opacity: 0.85 },
          { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
      });
    }, scope);
    return () => { media.revert(); context.revert(); };
  }, [active]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'ArrowDown' ? (index + 1) % experiences.length
      : event.key === 'ArrowUp' ? (index + experiences.length - 1) % experiences.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? experiences.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    buttons.current[next]?.focus();
  }

  return (
    <section ref={root} lang={locale} className={styles.experience} aria-labelledby="experience-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.heading}>
          <div><h2 id="experience-title">{labels.title}</h2></div>
          <p className={styles.introduction}>{labels.introduction}</p>
        </div>
        <div className={styles.journey}>
          <p className={styles.instruction}>{labels.select}</p>
          <div className={styles.timeline}>
            {experiences.map((experience, index) => {
              const selected = active === index;
              const panelId = `career-panel-${index}`;
              const buttonId = `career-entry-${index}`;
              return (
                <div className={styles.item} key={experience.name}>
                  <button
                    ref={(element) => { buttons.current[index] = element; }}
                    type="button" id={buttonId} aria-expanded={selected} aria-controls={panelId}
                    className={styles.entry} data-active={selected} style={{ gridRow: index + 1 }}
                    onClick={() => setActive(index)} onKeyDown={(event) => navigate(event, index)}
                  >
                    <span className={styles.marker} aria-hidden="true" />
                    <span className={styles.entryText}><span className={styles.date}><ExperiencePeriod period={experience} locale={locale} /></span><span className={styles.entryName}>{experience.name}</span><span className={styles.role}>{experience.role[locale]}</span></span>
                    <span className={styles.toggle} aria-hidden="true">{selected ? <Minus size={20} /> : <Plus size={20} />}</span>
                  </button>
                  <div id={panelId} role="region" aria-labelledby={buttonId} aria-hidden={!selected} inert={!selected}
                    className={styles.panel} data-active={selected} data-career-panel={index}>
                    <div className={styles.panelInner}>
                      <div className={styles.panelContent} data-career-content>
                        <p className={styles.detailRole}>{experience.role[locale]}</p>
                        <h3>{experience.name}</h3>
                        <p className={styles.detailDate}><ExperiencePeriod period={experience} locale={locale} /></p>
                        <div className={styles.description}>{experience.description[locale].split(/(?<=\.)\s+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                        <h4>{labels.activities}</h4>
                        <ul>{careerActivities[experience.name][locale].map((activity) => <li key={activity}>{activity}</li>)}</ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <noscript>
            <style>{`.${styles.timeline}, .${styles.instruction} { display: none; }`}</style>
            <div className={styles.fallback}>{experiences.map((experience) => (
              <article key={experience.name}><h3>{experience.name}</h3><p>{formatPeriod(experience.start, experience.end, locale)} · {experience.role[locale]}</p><p>{experience.description[locale]}</p></article>
            ))}</div>
          </noscript>
          <Link className={styles.action} href={`/${locale}/experiencia`}>{labels.archive}<ArrowUpRight size={20} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
