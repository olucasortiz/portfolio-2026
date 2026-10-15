import { ArrowUpRight } from 'lucide-react';
import { caseCopy } from '@/lib/case-study-content';
import type { Locale } from '@/lib/content';
import { getFeedqrDemoUrl } from '@/lib/feedqr-demo';
import styles from './case-study.module.css';

export function FeedqrDemo({ locale }: { locale: Locale }) {
  const href = getFeedqrDemoUrl();
  const t = caseCopy[locale];
  return (
    <section id="public-survey" tabIndex={-1} className={styles.demo} aria-labelledby="survey-title" data-case-section>
      <div><h2 id="survey-title">{t.surveyTitle}</h2><p>{t.surveyDescription}</p></div>
      <div>
        {href ? <><a className={styles.primaryAction} href={href} target="_blank" rel="noopener noreferrer">{t.survey}<ArrowUpRight size={20} aria-hidden="true" /><span className="sr-only"> ({t.newTab})</span></a><p className={styles.note}>{t.surveyExternal}</p></>
          : <><button type="button" className={styles.primaryAction} disabled aria-describedby="survey-pending">{t.survey}</button><p id="survey-pending" className={styles.note}>{t.surveyPending}</p></>}
      </div>
    </section>
  );
}
