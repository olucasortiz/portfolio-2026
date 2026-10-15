'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUpRight, Maximize2, X } from 'lucide-react';
import type { Locale } from '@/lib/content';
import { lionAssets, lionCopy, type LionAsset } from '@/lib/lion-case-content';
import styles from './lion-case-study.module.css';

export function LionImage({ asset, locale, priority = false, variant = 'screen' }: {
  asset: LionAsset; locale: Locale; priority?: boolean; variant?: 'screen' | 'paper' | 'hero';
}) {
  const t = lionCopy[locale];
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const [fit, setFit] = useState(false);
  const [failed, setFailed] = useState(false);
  const src = `/projects/lion-fitness/${asset.file}.webp`;
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
  }, [open]);
  const close = () => { dialog.current?.close(); };

  return (
    <figure className={`${styles.evidence} ${styles[variant]}`}>
      <a href={src} ref={opener} target="_blank" rel="noopener noreferrer" className={styles.imageLink}
        aria-label={`${t.inspect}: ${asset.title[locale]}`}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault(); setFit(false); setOpen(true);
        }}>
        <Image src={src} width={asset.width} height={asset.height} alt={asset.alt[locale]} priority={priority}
          sizes={variant === 'paper' ? '(max-width: 700px) 85vw, 36vw' : '(max-width: 1100px) 90vw, 75vw'}
          quality={90} onError={() => setFailed(true)} />
        <span className={styles.enlarge}><Maximize2 size={17} aria-hidden="true" />{t.inspect}</span>
      </a>
      <figcaption>{asset.title[locale]}</figcaption>
      {failed && <p role="status" className={styles.note}>{t.loadError} <a href={src} target="_blank" rel="noopener noreferrer">{t.direct}</a></p>}
      <dialog ref={dialog} className={styles.dialog} aria-label={`${t.inspect}: ${asset.title[locale]}`}
        onClose={() => { setOpen(false); opener.current?.focus({ preventScroll: true }); }}>
        {open && <>
          <div className={styles.dialogBar}>
            <p>{asset.title[locale]}</p>
            <button type="button" onClick={() => setFit(!fit)}>{fit ? t.native : t.fit}</button>
            <button type="button" autoFocus onClick={close} aria-label={t.close}><X size={22} aria-hidden="true" /></button>
          </div>
          <div className={styles.dialogViewport} tabIndex={0} role="region" aria-label={`${asset.title[locale]}. ${t.scroll}`}>
            {/* The sanitized source is loaded at native resolution only on inspection. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} width={asset.width} height={asset.height} alt={asset.alt[locale]}
              style={{ width: fit ? '100%' : asset.width, maxWidth: fit ? '100%' : 'none' }} />
          </div>
          <div className={styles.dialogFooter}>
            <p>{t.scroll}</p>
            <a href={src} target="_blank" rel="noopener noreferrer">{t.direct}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> ({t.newTab})</span></a>
          </div>
        </>}
      </dialog>
    </figure>
  );
}

export function LionOperations({ locale }: { locale: Locale }) {
  const t = lionCopy[locale];
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = t.steps[selected];
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % t.steps.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + t.steps.length - 1) % t.steps.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = t.steps.length - 1;
    else return;
    event.preventDefault(); setSelected(next); tabs.current[next]?.focus();
  };
  return (
    <div className={styles.operations}>
      <div role="tablist" aria-label={t.operationsLabel} className={styles.stepTabs}>
        {t.steps.map((item, index) => <button key={item.asset} type="button" role="tab"
          id={`lion-step-${index}`} aria-controls="lion-operation-panel" aria-selected={selected === index}
          tabIndex={selected === index ? 0 : -1} ref={(element) => { tabs.current[index] = element; }}
          onClick={() => setSelected(index)} onKeyDown={(event) => keyboard(event, index)}>
          <span aria-hidden="true">0{index + 1}</span>{item.label}
        </button>)}
      </div>
      <div id="lion-operation-panel" role="tabpanel" aria-labelledby={`lion-step-${selected}`} tabIndex={0} className={styles.operationPanel}>
        <div className={styles.operationStory}><h3>{step.title}</h3><p>{step.body}</p><p className={styles.note}>{t.paymentNote}</p></div>
        <LionImage key={step.asset} asset={lionAssets[step.asset]} locale={locale} />
      </div>
      <noscript><div className={styles.noScript}>{t.steps.slice(1).map((item) => <p key={item.asset}><a href={`/projects/lion-fitness/${lionAssets[item.asset].file}.webp`}>{item.label}: {item.body}</a></p>)}</div></noscript>
    </div>
  );
}

export function LionTraining({ locale }: { locale: Locale }) {
  const t = lionCopy[locale];
  return (
    <div className={styles.trainingSequence}>
      {t.trainingSteps.map((step, index) => <details key={step.asset} name="lion-training" open={index === 0}>
        <summary><span className={styles.stepNumber} aria-hidden="true">0{index + 1}</span><h3>{lionAssets[step.asset].title[locale]}</h3><span className={styles.plus} aria-hidden="true">+</span></summary>
        <div className={styles.trainingBody}><p>{step.body}</p><LionImage asset={lionAssets[step.asset]} locale={locale} /></div>
      </details>)}
    </div>
  );
}
