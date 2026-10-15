'use client';

import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X, ArrowUpRight } from 'lucide-react';
import { caseCopy, type CaseScreenshot } from '@/lib/case-study-content';
import type { Locale } from '@/lib/content';
import styles from './case-study.module.css';

export function CaseGallery({ screenshots, locale }: { screenshots: readonly CaseScreenshot[]; locale: Locale }) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const origin = useRef<HTMLAnchorElement | null>(null);
  const t = caseCopy[locale];
  const image = selected === null ? null : screenshots[selected];
  useLayoutEffect(() => { if (viewport.current) viewport.current.scrollTop = 0; }, [selected]);

  function open(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.current?.showModal) return;
    try {
      dialog.current.showModal();
      origin.current = event.currentTarget;
      event.preventDefault();
      setSelected(index);
    } catch { /* The real image link remains the fallback. */ }
  }
  function move(direction: number) {
    setSelected((current) => current === null ? null : (current + direction + screenshots.length) % screenshots.length);
  }
  return (
    <>
      <div className={styles.galleryGrid}>
        {screenshots.map((screenshot, index) => (
          <figure key={screenshot.src} data-case-capture>
            <a href={screenshot.src} target="_blank" rel="noopener noreferrer" onClick={(event) => open(event, index)}
              aria-label={`${t.openImage}: ${screenshot.caption[locale]}`}>
              <span className={styles.thumbnail}>
                <Image src={screenshot.src} alt={screenshot.caption[locale]} width={screenshot.width} height={screenshot.height}
                  sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1600px) 44vw, 680px" quality={85} />
              </span>
              <figcaption><span>{screenshot.caption[locale]}</span><ArrowUpRight size={18} aria-hidden="true" /></figcaption>
            </a>
          </figure>
        ))}
      </div>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby="case-gallery-caption" aria-describedby="case-gallery-hint"
        onClose={() => { setSelected(null); origin.current?.focus({ preventScroll: true }); }}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); }
        }}>
        <div className={styles.dialogBar}>
          <p id="case-gallery-caption" aria-live="polite">{image?.caption[locale] ?? t.gallery} {selected !== null && <span>{selected + 1} / {screenshots.length}</span>}</p>
          <button type="button" aria-label={t.close} onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true" /></button>
        </div>
        <div ref={viewport} className={styles.dialogViewport} tabIndex={0} aria-label={image?.caption[locale] ?? t.gallery}>
          {image && <Image src={image.src} alt={image.caption[locale]} width={image.width} height={image.height}
            sizes="(max-width: 1200px) 90vw, 1120px" quality={90} />}
        </div>
        <div className={styles.dialogControls}>
          <button type="button" onClick={() => move(-1)} aria-label={t.previous}><ArrowLeft size={20} aria-hidden="true" /></button>
          {image && <a href={image.src} target="_blank" rel="noopener noreferrer">{t.original}<span className="sr-only"> ({t.newTab})</span></a>}
          <button type="button" onClick={() => move(1)} aria-label={t.next}><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
        <p id="case-gallery-hint" className={styles.galleryHint}>{t.galleryHint}</p>
      </dialog>
    </>
  );
}
