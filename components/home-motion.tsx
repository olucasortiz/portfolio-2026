'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { createMotionScope, gsap, motion } from '@/lib/motion';
import { createHeroPointer } from './hero-pointer';
import { setupProjectStages } from './project-stage-motion';

export function HomeMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const find = (selector: string) => root.querySelector<HTMLElement>(selector);
    const all = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
    let entrancePlayed = false;

    const name = find('#hero-title');
    const disposeMotion = createMotionScope(root, (desktop) => {
      const hero = find('[data-home-hero]');
      const first = find('[data-hero-line="first"]');
      const second = find('[data-hero-line="second"]');
      if (hero && first && second) {
        // Entrance animates clipped letter groups; scroll owns the outer lines.
        // Separate planes prevent a fast first scroll from fighting the entrance.
        if (!entrancePlayed && hero.getBoundingClientRect().top >= -80) {
          const firstGroups = all('[data-hero-group="first"]');
          const secondGroups = all('[data-hero-group="second"]');
          const support = all('[data-hero-support]');
          gsap.timeline({
            defaults: { ease: motion.signature.ease },
            onComplete: () => { name?.setAttribute('data-hero-assembled', ''); },
          })
            .fromTo(firstGroups, {
              yPercent: (index: number) => index === 1 ? -105 : 105,
              x: (index: number) => (index % 2 ? 1 : -1) * (desktop ? 24 : 10),
            }, { yPercent: 0, x: 0, duration: desktop ? 0.82 : 0.58, stagger: 0.09 }, 0)
            .fromTo(secondGroups, {
              yPercent: (index: number) => index === 1 ? 105 : -105,
              x: (index: number) => (index % 2 ? -1 : 1) * (desktop ? 28 : 12),
            }, { yPercent: 0, x: 0, duration: desktop ? 0.86 : 0.6, stagger: 0.08 }, desktop ? 0.22 : 0.14)
            .fromTo(all('[data-hero-period]'), { scale: 0.6, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.3 }, desktop ? 0.92 : 0.68)
            .fromTo(support, { x: desktop ? 8 : 0, y: 6, opacity: 0.35 },
              { x: 0, y: 0, opacity: 1, duration: desktop ? 0.42 : 0.32, stagger: 0.08 }, desktop ? 1.18 : 0.8);
        } else name?.setAttribute('data-hero-assembled', '');
        entrancePlayed = true;
        gsap.timeline({
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: motion.signature.scrub },
        })
          .fromTo(first, { x: 0, y: 0 }, { x: desktop ? -30 : -4, y: desktop ? -44 : -12, ease: 'none' }, 0)
          .fromTo(second, { x: 0, y: 0 }, { x: desktop ? 34 : 4, y: desktop ? -18 : -6, ease: 'none' }, 0);
      }

      setupProjectStages(root, desktop);

    });
    const disposePointer = name ? createHeroPointer(name) : undefined;
    return () => {
      disposePointer?.();
      disposeMotion();
      name?.removeAttribute('data-hero-assembled');
    };
  }, []);

  return <div ref={ref} className="home-motion">{children}</div>;
}
