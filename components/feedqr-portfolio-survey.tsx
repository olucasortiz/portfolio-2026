import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/content';
import { caseCopy } from '@/lib/case-study-content';
import { feedqrPortfolioCopy } from '@/lib/feedqr-case-content';
import { FeedqrSurveyQr } from './feedqr-survey-qr';
import styles from './feedqr-portfolio-survey.module.css';

export function FeedqrPortfolioSurvey({ locale, surveyUrl }: { locale: Locale; surveyUrl: string | null }) {
  const t = feedqrPortfolioCopy[locale];
  return (
    <section id="public-survey" className={styles.survey} data-available={Boolean(surveyUrl)} aria-labelledby="portfolio-feedback-title">
      <div className={styles.story}>
        <p className={styles.label}>{t.label}</p>
        <h3 id="portfolio-feedback-title" className={styles.title}>{t.title[0]}<br /><span>{t.title[1]}</span></h3>
        <p className={styles.description}>{t.description}</p>
        {surveyUrl ? <>
          <a className={styles.action} href={surveyUrl} target="_blank" rel="noopener noreferrer">
            {t.action}<ArrowUpRight size={21} aria-hidden="true" /><span className="sr-only"> ({caseCopy[locale].newTab})</span>
          </a>
          <p className={styles.note}>{t.external}</p>
        </> : <p className={styles.pending}>{t.pending}</p>}
      </div>
      {surveyUrl && <FeedqrSurveyQr url={surveyUrl} locale={locale} />}
    </section>
  );
}
