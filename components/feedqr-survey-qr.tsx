'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/content';
import { feedqrPortfolioCopy } from '@/lib/feedqr-case-content';
import { createFeedqrQr } from '@/lib/feedqr-qr';
import styles from './feedqr-portfolio-survey.module.css';

type QrState = { url: string; data: string; phase: 'loading' | 'ready' | 'error' };

export function FeedqrSurveyQr({ url, locale }: { url: string; locale: Locale }) {
  const t = feedqrPortfolioCopy[locale];
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<QrState>({ url, data: '', phase: 'loading' });
  const current = state.url === url ? state : { url, data: '', phase: 'loading' };
  useEffect(() => {
    let cancelled = false;
    // Generate locally. No URL or survey token is sent to a QR service.
    createFeedqrQr(url).then(data => {
      if (!cancelled) setState({ url, data, phase: 'loading' });
    }).catch(() => {
      if (!cancelled) setState({ url, data: '', phase: 'error' });
    });
    return () => { cancelled = true; };
  }, [url, attempt]);

  const retry = () => { setState({ url, data: '', phase: 'loading' }); setAttempt(value => value + 1); };
  return (
    <figure className={styles.code}>
      <div className={styles.codeSurface} aria-busy={current.phase === 'loading'}>
        {current.data && current.phase !== 'error' && <Image src={current.data} width={640} height={640} unoptimized
          className={styles.qrImage} alt={t.qrAlt} onLoad={() => setState(value => value.url === url ? { ...value, phase: 'ready' } : value)}
          onError={() => setState({ url, data: '', phase: 'error' })} />}
        {current.phase === 'loading' && <p className={styles.codeStatus} role="status">{t.loading}</p>}
        {current.phase === 'error' && <div className={styles.codeStatus}>
          <p role="status">{t.qrError}</p><button type="button" className={styles.retry} onClick={retry}>{t.retry}</button>
        </div>}
        <noscript><p className={styles.codeStatus}>{t.noScript}</p></noscript>
      </div>
      <figcaption className={styles.caption}>{t.scan}</figcaption>
    </figure>
  );
}
