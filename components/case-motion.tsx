'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { createMotionScope, gsap } from '@/lib/motion';

export function CaseMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const entered = new WeakSet<HTMLElement>();
    return createMotionScope(scope, (desktop) => {
      scope.querySelectorAll<HTMLElement>('[data-case-section]').forEach((section) => {
        if (entered.has(section) || section.getBoundingClientRect().top <= window.innerHeight * 0.9) return;
        const heading = section.querySelector<HTMLElement>('[data-chapter-heading]');
        const body = section.querySelector<HTMLElement>('[data-chapter-body]');
        if (!heading) return;
        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: section, start: 'top 90%', once: true,
            onEnter: () => { entered.add(section); },
            onLeave: (trigger) => { trigger.animation?.progress(1); },
          },
        });
        reveal.fromTo(heading, { yPercent: desktop ? 18 : 10, opacity: 0.9 },
          { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0);
        // One supporting plane per technical chapter; never animate the tour's
        // frame or its own image/story layers from this controller.
        if (body) reveal.fromTo(body, { y: desktop ? 8 : 4, opacity: 0.9 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.08);
      });
      const media = scope.querySelector<HTMLElement>('[data-case-media]');
      if (media) {
        const reveal = gsap.fromTo(media, { clipPath: 'inset(3% 3% 3% 3%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', ease: 'power1.out',
          scrollTrigger: { trigger: media, start: 'top 92%', end: 'top 40%', scrub: desktop ? 0.4 : 0.2 },
        });
        reveal.scrollTrigger?.refresh();
        reveal.progress(reveal.scrollTrigger?.progress ?? 0);
      }
      scope.querySelectorAll<HTMLElement>('[data-case-capture]').forEach((capture) => {
        gsap.fromTo(capture, { y: desktop ? 14 : 6 }, {
          y: 0, ease: 'power2.out',
          scrollTrigger: { trigger: capture, start: 'top 96%', end: 'top 68%', scrub: 0.2 },
        });
      });
    });
  }, []);
  return <div ref={root}>{children}</div>;
}
