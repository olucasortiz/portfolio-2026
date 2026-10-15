import Image from 'next/image';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/content';
import { projects } from '@/lib/content';
import { caseCopy, caseStudies } from '@/lib/case-study-content';
import { feedqrCaseCopy, feedqrChapters } from '@/lib/feedqr-case-content';
import { FEEDQR_APP_URL, getFeedqrSurveyUrl } from '@/lib/feedqr-demo';
import { FeedqrPortfolioSurvey } from './feedqr-portfolio-survey';
import { CaseChapters } from './case-chapters';
import { CaseMotion } from './case-motion';
import { FeedqrTour } from './feedqr-tour';
import { FeedqrArchitecture } from './feedqr-architecture';
import shared from './case-study.module.css';
import styles from './feedqr-case-study.module.css';

export function FeedqrCaseStudy({ locale }: { locale: Locale }) {
  const t = feedqrCaseCopy[locale];
  const common = caseCopy[locale];
  const content = caseStudies.feedqr;
  const survey = getFeedqrSurveyUrl();
  const actions = (position: 'cover' | 'closing') => (
    <>
      <div className={styles.actions}>
        {position === 'cover' && <a className={shared.primaryAction} href="#gallery">{t.explore}<ArrowDown size={20} aria-hidden="true" /></a>}
        <a className={styles.external} href={FEEDQR_APP_URL} target="_blank" rel="noopener noreferrer">{t.app}<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> ({common.newTab})</span></a>
        {content.links.sourceCode && <a className={styles.external} href={content.links.sourceCode} target="_blank" rel="noopener noreferrer">{t.github}<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> ({common.newTab})</span></a>}
        {content.links.documentation && <a className={styles.external} href={content.links.documentation} target="_blank" rel="noopener noreferrer">{t.documentation}<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> ({common.newTab})</span></a>}
      </div>
      <p className={styles.pending}>{t.account}</p>
    </>
  );

  return (
    <article lang={locale} className={`${shared.caseStudy} ${styles.presentation}`}>
      <CaseMotion>
        <div className={styles.reading} data-case-reading>
          <header id="overview" tabIndex={-1} className={shared.cover} aria-labelledby="feedqr-title">
            <div className="container">
              <a className={shared.back} href={`/${locale}#projetos`}><ArrowLeft size={17} aria-hidden="true" />{common.home}</a>
              <div className={shared.coverGrid}>
                <div className={shared.identity}>
                  <h1 id="feedqr-title" className={`${shared.title} premiere-feedqr-title`} aria-label="FeedQR"><span aria-hidden="true">Feed<span className={shared.accent}>QR</span></span></h1>
                  <p className={styles.lead}>{t.lead}</p>
                  <p className={styles.status}>{t.statusTitle}</p>
                  {actions('cover')}
                </div>
                <div className={`${shared.coverMedia} premiere-feedqr-media`} data-case-media>
                  <Image src="/projects/feedqr/dashboard.png" width={1440} height={1684} priority
                    alt={content.screenshots[0].caption[locale]} sizes="(max-width: 1000px) calc(100vw - 56px), 58vw" quality={85} />
                </div>
              </div>
            </div>
          </header>
          <div className={`container ${styles.layout}`}>
            <CaseChapters chapters={feedqrChapters} locale={locale} labels={t.chapters} />
            <div className={styles.chapters}>
              <section id="gallery" tabIndex={-1} className={styles.chapter} aria-labelledby="feedqr-tour-title" data-case-section>
                <span id="workflows" className={styles.alias} aria-hidden="true" />
                <h2 id="feedqr-tour-title"><span data-chapter-heading>{t.tourTitle}</span></h2>
                <FeedqrTour locale={locale} />
              </section>
              <section id="architecture" tabIndex={-1} className={styles.chapter} aria-labelledby="feedqr-inside-title" data-case-section>
                {['data', 'security', 'quality'].map((id) => <span key={id} id={id} className={styles.alias} aria-hidden="true" />)}
                <h2 id="feedqr-inside-title"><span data-chapter-heading>{t.insideTitle}</span></h2>
                <p className={styles.introduction} data-chapter-body>{t.inside}</p>
                <FeedqrArchitecture locale={locale} />
              </section>
              <section id="resources" tabIndex={-1} className={styles.chapter} aria-labelledby="feedqr-continue-title" data-case-section>
                <span id="status" className={styles.alias} aria-hidden="true" />
                <h2 id="feedqr-continue-title"><span data-chapter-heading>{t.continueTitle}</span></h2>
                <div data-chapter-body>
                  <FeedqrPortfolioSurvey locale={locale} surveyUrl={survey} />
                  <div className={styles.resourcesFooter}>{actions('closing')}<p className={styles.documentationNote}>{t.documentationNote}</p></div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className="container">
          <footer className={shared.nextProject}>
            <p>{common.nextProject}</p>
            <a href={`/${locale}/projetos/lion-fitness`}>{projects['lion-fitness'].name}<ArrowRight size={30} aria-hidden="true" /></a>
            <a className={shared.back} href={`/${locale}#projetos`}><ArrowLeft size={17} aria-hidden="true" />{common.home}</a>
          </footer>
        </div>
      </CaseMotion>
    </article>
  );
}
