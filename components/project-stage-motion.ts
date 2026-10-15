import { gsap, motion } from '@/lib/motion';

/** Runs inside the existing React/GSAP scope; never controls hero elements. */
export function setupProjectStages(root: HTMLElement, desktop: boolean) {
  const selected = root.querySelector<HTMLElement>('[data-selected-projects]');
  if (!selected) return;
  const find = (selector: string) => selected.querySelector<HTMLElement>(selector);
  const all = (selector: string) => Array.from(selected.querySelectorAll<HTMLElement>(selector));
  const restoreProgress = (timeline: gsap.core.Timeline) => {
    timeline.scrollTrigger?.refresh();
    timeline.progress(timeline.scrollTrigger?.progress ?? 0);
  };

  const heading = find('[data-selected-heading]');
  if (heading) {
    gsap.fromTo(heading, { yPercent: 40 }, {
      yPercent: 0, ease: motion.section.ease,
      scrollTrigger: { trigger: selected, start: 'top 94%', end: 'top 68%', scrub: 0.35 },
    });
  }

  const feedqr = find('[data-feedqr]');
  const frame = find('[data-feedqr-frame]');
  const capture = find('[data-feedqr-image]');
  const title = find('[data-feedqr-heading]');
  const action = find('[data-feedqr-action]');
  const exitPlane = find('[data-feedqr-exit]');
  if (feedqr && frame && capture && title && action) {
    const entrance = gsap.timeline({
      scrollTrigger: {
        trigger: feedqr, start: 'top 90%', end: desktop ? 'top 28%' : 'top 35%',
        scrub: desktop ? 0.55 : 0.3, invalidateOnRefresh: true,
      },
    });
    entrance
      .fromTo(title, { yPercent: desktop ? 108 : 80 },
        { yPercent: 0, duration: 0.72, ease: motion.signature.ease }, 0)
      .fromTo(frame, { y: desktop ? 36 : 12, clipPath: desktop ? 'inset(10% 14% 10% 14%)' : 'inset(4% 0% 4% 0%)' },
        { y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.out' }, 0.08)
      .fromTo(capture, { scale: desktop ? 1.035 : 1, y: desktop ? 18 : 0 },
        { scale: 1, y: 0, duration: 1, ease: 'power1.out' }, 0.08)
      .fromTo(action, { y: 8, opacity: 0.85 },
        { y: 0, opacity: 1, duration: 0.45, ease: motion.section.ease }, 0.5);
    restoreProgress(entrance);

    // A separate outer plane yields priority as Lion enters, without competing
    // with the frame reveal, image hover wrapper or title mask.
    if (exitPlane) {
      const exit = gsap.timeline({
        scrollTrigger: {
          trigger: feedqr, start: 'bottom 60%', end: 'bottom 16%',
          scrub: desktop ? 0.45 : 0.25,
        },
      }).fromTo(exitPlane, { y: 0, opacity: 1 },
        { y: desktop ? -24 : -10, opacity: desktop ? 0.72 : 0.85, ease: 'power1.inOut' });
      restoreProgress(exit);
    }
  }

  const lion = find('[data-lion]');
  const lionHeading = find('[data-lion-heading]');
  const lionContent = find('[data-lion-content]');
  const lionWords = all('[data-lion-word]');
  const lionMedia = find('[data-lion-media]');
  if (lion && lionHeading && lionContent && lionWords.length) {
    const entrance = gsap.timeline({
      scrollTrigger: {
        trigger: lion, start: 'top 92%', end: desktop ? 'top 26%' : 'top 32%',
        scrub: desktop ? 0.45 : 0.25, invalidateOnRefresh: true,
      },
    });
    entrance
      .fromTo(lionWords, { yPercent: desktop ? 106 : 80, x: (index: number) => desktop ? (index ? 20 : -14) : 0 },
        { yPercent: 0, x: 0, duration: 0.8, stagger: 0.12, ease: motion.signature.ease }, 0)
      .fromTo(lionHeading, { scale: desktop ? 0.975 : 1 },
        { scale: 1, duration: 0.95, ease: 'power2.out' }, 0)
      .fromTo(lionContent, { x: desktop ? 20 : 0, y: desktop ? 0 : 10, opacity: 0.85 },
        { x: 0, y: 0, opacity: 1, duration: 0.7, ease: motion.section.ease }, 0.2);
    restoreProgress(entrance);

    // The art plays on its own trigger so it is settled by the time it is centred, on any layout.
    const lionArt = lionMedia?.parentElement ?? null;
    const lionBezel = find('[data-lion-media] > div');
    const lionMascot = find('[data-lion-mascot]');
    const lionGlow = find('[data-lion-glow]');
    if (lionMedia && lionArt) {
      const art = gsap.timeline({
        scrollTrigger: { trigger: lionArt, start: 'top 94%', end: desktop ? 'top 40%' : 'top 50%', scrub: 0.4, invalidateOnRefresh: true },
      });
      if (lionGlow) art.fromTo(lionGlow, { opacity: 0.25 }, { opacity: 1, duration: 1, ease: 'power1.out' }, 0);
      // Equal travel keeps the complete wordmark clear of the display throughout entry.
      if (lionMascot) art.fromTo(lionMascot, { y: desktop ? 24 : 12, opacity: 0.7 }, { y: 0, opacity: 1, duration: 0.9, ease: motion.signature.ease }, 0.12);
      art.fromTo(lionMedia, { y: desktop ? 24 : 12, opacity: 0.75 }, { y: 0, opacity: 1, duration: 0.9, ease: motion.signature.ease }, 0.12);
      if (lionBezel && desktop) {
        const settledTilt = parseFloat(getComputedStyle(lionBezel).getPropertyValue('--tilt-y'));
        art.fromTo(lionBezel, { '--tilt-y': `${settledTilt - 2}deg` }, { '--tilt-y': `${settledTilt}deg`, duration: 0.9, ease: 'power2.out' }, 0.12);
      }
      restoreProgress(art);
    }
  }
}
