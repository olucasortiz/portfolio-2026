'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import styles from './site-footer.module.css';

export function FooterMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  useLayoutEffect(() => {
    const root = ref.current;
    // Shared footer keeps its static form on case studies and other inner pages.
    if (!root || !/^\/(pt|en)\/?$/.test(pathname)) return;
    const title = root.querySelector<HTMLElement>('[data-contact-title]');
    const links = root.querySelector<HTMLElement>('[data-contact-links]');
    if (!title || !links) return;
    let entered = false;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    // Inner pages keep the shared footer without loading its animation runtime.
    void import('@/lib/motion').then(({ createMotionScope, gsap, motion }) => {
      if (disposed) return;
      cleanup = createMotionScope(root, (desktop) => {
        if (entered || root.getBoundingClientRect().top <= window.innerHeight * 0.88) return;
        gsap.timeline({
          defaults: { duration: motion.signature.duration, ease: motion.signature.ease },
          scrollTrigger: {
            trigger: root, start: 'top 88%', once: true,
            onEnter: () => { entered = true; },
            onLeave: (trigger) => { trigger.animation?.progress(1); },
          },
        })
          .fromTo(title, { yPercent: desktop ? 75 : 40 }, { yPercent: 0 }, 0)
          .fromTo(links, { x: desktop ? 18 : 0, y: desktop ? 0 : 10 }, { x: 0, y: 0, duration: motion.section.duration }, 0.15);
      });
    }).catch((error: unknown) => {
      console.warn('Contact motion unavailable; keeping the static footer.', error);
    });
    return () => { disposed = true; cleanup?.(); };
  }, [pathname]);
  return <footer id="contato" className={styles.footer} ref={ref}>{children}</footer>;
}
