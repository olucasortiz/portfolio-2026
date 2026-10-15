'use client';

import { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';
import type { Locale } from '@/lib/content';
import { createMotionScope, gsap } from '@/lib/motion';
import { expertiseCopy, expertiseGroups } from '@/lib/expertise-content';
import styles from './technical-expertise.module.css';

export function TechnicalExpertise({ locale }: { locale: Locale }) {
  const t = expertiseCopy[locale];
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const groups = Array.from(section.querySelectorAll<HTMLDetailsElement>('details'));
    const mobile = window.matchMedia('(max-width: 800px)');
    let frame = 0;
    const refresh = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { frame = 0; ScrollTrigger.refresh(); });
    };
    const composition = () => {
      // All four groups are visible on desktop. Mobile keeps native, exclusive
      // disclosure controls. Without JS every list remains available.
      const selected = Math.max(0, groups.findIndex((group) => group.open));
      groups.forEach((group, index) => {
        group.removeAttribute('name');
        group.open = !mobile.matches || index === selected;
      });
      if (mobile.matches) groups.forEach((group) => group.setAttribute('name', 'portfolio-expertise'));
      refresh();
    };
    section.addEventListener('toggle', refresh, true);
    composition();
    mobile.addEventListener('change', composition);
    const disposeMotion = createMotionScope(section, () => {
      if (section.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      gsap.fromTo(groups, { y: 12, opacity: 0.85 }, {
        y: 0, opacity: 1, duration: 0.45, stagger: 0.045, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 90%', once: true },
      });
    });
    return () => {
      mobile.removeEventListener('change', composition);
      section.removeEventListener('toggle', refresh, true);
      if (frame) cancelAnimationFrame(frame);
      disposeMotion();
    };
  }, []);

  return (
    <section ref={root} className={styles.expertise} lang={locale} aria-labelledby="expertise-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.heading}>
          <h2 id="expertise-title">{t.title}{' '}<span>{t.emphasis}</span></h2>
        </div>
        <div className={styles.groups}>
          {expertiseGroups.map((group) => (
            <details className={styles.group} key={group.id} open>
              <summary><h3>{group.name[locale]}</h3><Plus size={22} aria-hidden="true" /></summary>
              <ul className={styles.technologies}>
                {group.technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
