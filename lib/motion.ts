import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Signature, section and micro motion share restrained travel and a quick settle.
// Microinteractions use the matching CSS tokens; scrolling always stays native.
export const motion = {
  signature: { duration: 0.9, ease: 'power3.out', scrub: 0.55 },
  section: { duration: 0.75, ease: 'power2.out', offset: 24 },
} as const;

export function createMotionScope(root: HTMLElement, setup: (desktop: boolean) => void) {
  const context = gsap.context(() => {}, root);
  const queries = gsap.matchMedia();
  try {
    gsap.registerPlugin(ScrollTrigger);
    context.add(() => {
      queries.add({ desktop: '(min-width: 1024px)', motion: '(prefers-reduced-motion: no-preference)' }, (match) => {
        if (!match.conditions?.motion) return;
        setup(Boolean(match.conditions.desktop));
        // Refresh only this scope after fonts settle; never measure on scroll frames.
        const triggers = ScrollTrigger.getAll().filter((trigger) => trigger.trigger && root.contains(trigger.trigger));
        let active = true;
        void document.fonts.ready.then(() => {
          if (active) triggers.forEach((trigger) => trigger.refresh());
        });
        return () => { active = false; };
      });
    });
  } catch (error) {
    queries.revert();
    context.revert();
    console.warn('Motion unavailable; keeping the static composition.', error);
  }
  return () => { queries.revert(); context.revert(); };
}

export { gsap };
