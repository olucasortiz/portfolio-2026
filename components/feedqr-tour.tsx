'use client';

import { useLayoutEffect, useReducer, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { gsap } from '@/lib/motion';
import type { Locale } from '@/lib/content';
import { feedqrTourScenes as scenes, tourCopy } from '@/lib/feedqr-tour-content';
import { createTourState, tourReducer } from '@/lib/feedqr-tour-state';
import styles from './feedqr-tour.module.css';

export function FeedqrTour({ locale }: { locale: Locale }) {
  const [state, dispatch] = useReducer(tourReducer, scenes.length, createTourState);
  const [reduced, setReduced] = useState(false);
  const [inspection, setInspection] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const currentMedia = useRef<HTMLDivElement>(null);
  const incomingMedia = useRef<HTMLDivElement>(null);
  const currentStory = useRef<HTMLDivElement>(null);
  const incomingStory = useRef<HTMLDivElement>(null);
  const incomingImage = useRef<HTMLImageElement>(null);
  const currentViewport = useRef<HTMLDivElement>(null);
  const incomingViewport = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const dialogViewport = useRef<HTMLDivElement>(null);
  const origin = useRef<HTMLAnchorElement | null>(null);
  const t = tourCopy[locale];
  const active = scenes[state.active];
  const inspected = inspection === null ? null : scenes[inspection];

  useLayoutEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    const viewport = currentViewport.current;
    if (viewport) {
      viewport.scrollTop = 0;
      viewport.scrollLeft = active.centered ? Math.max(0, (viewport.scrollWidth - viewport.clientWidth) / 2) : 0;
    }
  }, [state.active, active.centered]);

  useLayoutEffect(() => {
    if (state.phase !== 'loading' || state.incoming === null) return;
    const viewport = incomingViewport.current;
    if (viewport) {
      viewport.scrollTop = 0;
      viewport.scrollLeft = scenes[state.incoming].centered ? Math.max(0, (viewport.scrollWidth - viewport.clientWidth) / 2) : 0;
    }
    if (incomingImage.current?.complete && incomingImage.current.naturalWidth > 0) {
      dispatch({ type: 'ready', index: state.incoming });
    }
  }, [state.phase, state.incoming]);

  useLayoutEffect(() => {
    if (state.phase !== 'animating' || state.incoming === null) return;
    const index = state.incoming;
    if (reduced || !root.current || !currentMedia.current || !incomingMedia.current || !currentStory.current || !incomingStory.current) {
      dispatch({ type: 'finish', index });
      return;
    }
    let alive = true;
    const context = gsap.context(() => {}, root.current);
    try {
      context.add(() => {
        gsap.timeline({
          defaults: { ease: 'power3.inOut' },
          onComplete: () => { if (alive) dispatch({ type: 'finish', index }); },
        })
          .to(currentMedia.current, { x: -state.direction * 24, opacity: 0, duration: 0.3 }, 0)
          .to(currentStory.current, { y: -6, opacity: 0, duration: 0.22 }, 0)
          .fromTo(incomingMedia.current, { x: state.direction * 30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.48 }, 0.2)
          .fromTo(incomingStory.current, { y: 8, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4 }, 0.22);
      });
    } catch {
      context.revert();
      dispatch({ type: 'finish', index });
    }
    return () => { alive = false; context.revert(); };
  }, [state.phase, state.incoming, state.direction, reduced]);

  useLayoutEffect(() => {
    if (dialogViewport.current) { dialogViewport.current.scrollTop = 0; dialogViewport.current.scrollLeft = 0; }
  }, [inspection]);

  function navigate(direction: number) { dispatch({ type: 'navigate', direction }); }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    // The inspection frame keeps arrow keys for native image panning.
    if (dialog.current?.open || event.altKey || event.ctrlKey || event.metaKey ||
      (event.target as Element).closest('[data-tour-scroll]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }
  function enlarge(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.current?.showModal) return;
    try {
      dialog.current.showModal();
      origin.current = event.currentTarget;
      setInspection(state.active);
      event.preventDefault();
    } catch { /* Keep the original-image anchor available. */ }
  }
  function media(index: number, incoming: boolean) {
    const scene = scenes[index];
    return (
      <div key={index} ref={incoming ? incomingMedia : currentMedia} className={`${styles.layer} ${incoming ? styles.incoming : ''}`}
        aria-hidden={incoming} inert={incoming}>
        <div ref={incoming ? incomingViewport : currentViewport} className={styles.inspection} data-tour-scroll tabIndex={incoming ? -1 : 0}
          role="region" aria-label={scene.caption[locale]} aria-describedby="feedqr-tour-inspect">
          <Image ref={incoming ? incomingImage : undefined} src={scene.src} width={scene.width} height={scene.height}
            alt={scene.caption[locale]} className={scene.responsive ? styles.responsiveImage : styles.desktopImage}
            sizes={scene.responsive ? '(max-width: 400px) calc(100vw - 40px), 360px' : '(max-width: 1100px) 960px, (max-width: 1600px) calc(100vw - 96px), 1440px'}
            quality={85} loading="eager"
            onLoad={() => dispatch({ type: 'ready', index })}
            onError={() => dispatch({ type: 'ready', index, failed: true })} />
          {state.failed.includes(index) && <p className={styles.imageError}>{t.error}</p>}
        </div>
      </div>
    );
  }
  function story(index: number, incoming: boolean) {
    const scene = scenes[index];
    return <div key={index} ref={incoming ? incomingStory : currentStory} className={`${styles.story} ${incoming ? styles.incoming : ''}`} aria-hidden={incoming} inert={incoming}>
      <h3>{scene.caption[locale]}</h3><p>{scene.description[locale]}</p>
    </div>;
  }
  return (
    <div ref={root} className={styles.tour} onKeyDown={keyboard} role="region" aria-label={t.heading}>
      <div className={styles.topBar}>
        <p>{active.responsive ? t.responsive : t.desktop}</p>
        <p className={styles.counter} role="status" aria-live="polite" aria-atomic="true">
          {state.active + 1} {t.count} {scenes.length}<span className="sr-only"> — {active.caption[locale]}</span>
        </p>
      </div>
      <div id="feedqr-tour-frame" className={styles.frame} aria-busy={state.phase !== 'idle'}>
        {media(state.active, false)}
        {state.incoming !== null && media(state.incoming, true)}
      </div>
      <p id="feedqr-tour-inspect" className={styles.inspectHint}>{t.inspect}</p>
      <div className={styles.lower}>
        <div id="feedqr-tour-story" className={styles.stories}>{story(state.active, false)}{state.incoming !== null && story(state.incoming, true)}</div>
        <div className={styles.controls}>
          <button type="button" onClick={() => navigate(-1)} aria-label={t.previous} aria-controls="feedqr-tour-frame feedqr-tour-story" className={styles.previous}><ArrowLeft size={24} aria-hidden="true" /></button>
          <button type="button" onClick={() => navigate(1)} aria-label={t.next} aria-controls="feedqr-tour-frame feedqr-tour-story" className={styles.next}><ArrowRight size={24} aria-hidden="true" /></button>
          <a href={active.src} target="_blank" rel="noopener noreferrer" onClick={enlarge} className={styles.enlarge}>{t.enlarge}<ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
      <p className={styles.loading} role="status" aria-live="polite">{state.phase === 'loading' ? t.loading : ''}</p>
      <noscript>
        <style>{`.${styles.controls} { display: none; }`}</style>
        <div className={styles.fallback}><h3>{t.fallback}</h3><ol>{scenes.map((scene) => (
          <li key={scene.src}><a href={scene.src} target="_blank" rel="noopener noreferrer">{scene.caption[locale]} ({t.original})</a><p>{scene.description[locale]}</p></li>
        ))}</ol></div>
      </noscript>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby="feedqr-tour-dialog-title" aria-describedby="feedqr-tour-dialog-hint"
        onClose={() => { setInspection(null); origin.current?.focus({ preventScroll: true }); }}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className={styles.dialogBar}><p id="feedqr-tour-dialog-title">{inspected?.caption[locale] ?? t.enlarge}</p><button type="button" aria-label={t.close} onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true" /></button></div>
        <div ref={dialogViewport} className={styles.dialogViewport} data-tour-scroll tabIndex={0} aria-label={inspected?.caption[locale] ?? t.enlarge}>
          {inspected && <Image src={inspected.src} alt={inspected.caption[locale]} width={inspected.width} height={inspected.height}
            className={inspected.responsive ? styles.responsiveOriginal : styles.desktopOriginal} sizes={inspected.responsive ? '360px' : '1440px'} quality={90} />}
        </div>
        <div className={styles.dialogFooter}><p id="feedqr-tour-dialog-hint">{t.hint}</p>{inspected && <a href={inspected.src} target="_blank" rel="noopener noreferrer">{t.original}<span className="sr-only"> ({t.newTab})</span></a>}</div>
      </dialog>
    </div>
  );
}
