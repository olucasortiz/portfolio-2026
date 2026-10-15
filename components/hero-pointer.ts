import { gsap } from '@/lib/motion';

/** Preserve shaped text geometry; animate only the overlaid glyph plane. */
export function createHeroPointer(name: HTMLElement) {
  const context = gsap.context(() => {}, name);
  const media = gsap.matchMedia();
  try {
    context.add(() => {
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const groups = Array.from(name.querySelectorAll<HTMLElement>('[data-hero-group]'));
      const letters = groups.flatMap((group) => {
        const source = group.querySelector<HTMLElement>('[data-hero-source]');
        return Array.from(group.querySelectorAll<HTMLElement>('[data-hero-letter]')).map((element, index) => ({
          element, group, source, index, left: 0, width: 0,
          y: gsap.quickTo(element, 'y', { duration: 0.3, ease: 'back.out(1.15)' }),
          scale: gsap.quickTo(element, 'scale', { duration: 0.3, ease: 'back.out(1.15)' }),
          rotation: gsap.quickTo(element, 'rotation', { duration: 0.3, ease: 'back.out(1.15)' }),
        }));
      });
      let alive = true;
      let ready = false;
      let frame = 0;
      let pointer: { x: number; y: number } | null = null;

      const reset = () => {
        pointer = null;
        letters.forEach((letter) => { letter.y(0); letter.scale(1); letter.rotation(0); });
      };
      const render = () => {
        frame = 0;
        if (!ready || !pointer || !name.hasAttribute('data-hero-assembled')) return;
        // Read the unanimated group plane so hovered glyphs never chase themselves.
        const bounds = new Map(groups.map((group) => [group, group.getBoundingClientRect()]));
        letters.forEach((letter) => {
          const box = bounds.get(letter.group)!;
          const radius = Math.max(100, letter.width * 2.2);
          const dx = pointer!.x - (box.left + letter.left + letter.width / 2);
          const dy = pointer!.y - (box.top + box.height * 0.45);
          const falloff = Math.max(0, 1 - Math.hypot(dx / radius, dy / Math.max(1, box.height * 0.8)));
          const strength = falloff * falloff * (3 - 2 * falloff);
          letter.y(-14 * strength);
          letter.scale(1 + 0.055 * strength);
          letter.rotation(-2 * Math.max(-1, Math.min(1, dx / radius)) * strength);
        });
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
      const measure = () => {
        if (!alive) return;
        // Range measurements retain the font's original within-group kerning.
        const positions = letters.map((letter) => {
          const node = letter.source?.firstChild;
          if (!node || node.nodeType !== Node.TEXT_NODE) return null;
          const range = document.createRange();
          range.setStart(node, letter.index);
          range.setEnd(node, letter.index + 1);
          const rect = range.getBoundingClientRect();
          return { left: rect.left - letter.group.getBoundingClientRect().left, width: rect.width };
        });
        if (positions.some((position) => !position || position.width <= 0)) return;
        letters.forEach((letter, index) => {
          Object.assign(letter, positions[index]);
          letter.element.style.left = `${letter.left}px`;
          letter.element.style.width = `${letter.width}px`;
        });
        groups.forEach((group) => group.setAttribute('data-pointer-ready', ''));
        ready = true;
        schedule();
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse' || event.buttons || !name.hasAttribute('data-hero-assembled')) {
          reset();
          return;
        }
        pointer = { x: event.clientX, y: event.clientY };
        schedule();
      };
      const scroll = () => { if (pointer) schedule(); };
      name.addEventListener('pointermove', move, { passive: true });
      name.addEventListener('pointerleave', reset);
      name.addEventListener('pointercancel', reset);
      name.addEventListener('pointerdown', reset, { passive: true });
      window.addEventListener('scroll', scroll, { passive: true });
      window.addEventListener('blur', reset);
      const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
      observer?.observe(name);
      window.addEventListener('resize', measure, { passive: true });
      void document.fonts.ready.then(measure);
      return () => {
        alive = false;
        if (frame) cancelAnimationFrame(frame);
        observer?.disconnect();
        window.removeEventListener('resize', measure);
        name.removeEventListener('pointermove', move);
        name.removeEventListener('pointerleave', reset);
        name.removeEventListener('pointercancel', reset);
        name.removeEventListener('pointerdown', reset);
        window.removeEventListener('scroll', scroll);
        window.removeEventListener('blur', reset);
        groups.forEach((group) => group.removeAttribute('data-pointer-ready'));
        letters.forEach(({ element }) => { element.style.removeProperty('left'); element.style.removeProperty('width'); });
      };
    });
    });
  } catch (error) {
    media.revert();
    context.revert();
    console.warn('Hero pointer motion unavailable; keeping the original typography.', error);
  }
  return () => { media.revert(); context.revert(); };
}
