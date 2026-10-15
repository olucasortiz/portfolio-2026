import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/content';
import { caseStudies } from '@/lib/case-study-content';
import { lionAssets, lionChapters, lionCopy } from '@/lib/lion-case-content';
import { CaseChapters } from './case-chapters';
import { CaseMotion } from './case-motion';
import { LionImage, LionOperations, LionTraining } from './lion-evidence';
import shared from './case-study.module.css';
import styles from './lion-case-study.module.css';

export function LionCaseStudy({ locale }: { locale: Locale }) {
  const t = lionCopy[locale];
  const links = caseStudies['lion-fitness'].links;
  const applicationAction = links.liveDemo && <a className={`${styles.textLink} ${styles.liveAction}`} href={links.liveDemo} target="_blank" rel="noopener noreferrer">{t.app}<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> ({t.newTab})</span></a>;
  return (
    <article lang={locale} className={`${shared.caseStudy} ${styles.case}`}>
      <CaseMotion>
        <div className={`container ${styles.reading}`} data-case-reading>
          <CaseChapters chapters={lionChapters} locale={locale} labels={t.chapters} />
          <div className={styles.acts}>
            <header id="vision" tabIndex={-1} className={styles.vision} aria-labelledby="lion-title">
              <span id="overview" className={styles.alias} aria-hidden="true" />
              <a className={styles.back} href={`/${locale}#projetos`}><ArrowLeft size={17} aria-hidden="true" />{t.home}</a>
              <p className={styles.eyebrow}>{t.eyebrow}</p>
              <h1 id="lion-title" className="premiere-lion-title">{t.vision}</h1>
              <div className={styles.visionIntro}><p>{t.lead}</p><a className={styles.textLink} href="#operations">{t.explore}<ArrowDown size={20} aria-hidden="true" /></a></div>
              <div className={styles.access}>{applicationAction}<p className={styles.note}>{t.account}</p></div>
              <div data-case-media><LionImage asset={lionAssets.dashboard} locale={locale} priority variant="hero" /></div>
              <p className={styles.note}>{t.sample}</p>
            </header>
            <section id="operations" tabIndex={-1} className={styles.act} aria-labelledby="lion-operations-title" data-case-section>
              <span id="workflows" className={styles.alias} aria-hidden="true" />
              <span id="gallery" className={styles.alias} aria-hidden="true" />
              <p className={styles.eyebrow}>02 / {t.chapters.operations}</p>
              <h2 id="lion-operations-title"><span data-chapter-heading>{t.operations}</span></h2>
              <p className={styles.intro} data-chapter-body>{t.operationsLead}</p>
              <LionOperations locale={locale} />
            </section>
            <section id="training" tabIndex={-1} className={styles.act} aria-labelledby="lion-training-title" data-case-section>
              <p className={styles.eyebrow}>03 / {t.chapters.training}</p>
              <h2 id="lion-training-title"><span data-chapter-heading>{t.training}</span></h2>
              <p className={styles.intro} data-chapter-body>{t.trainingLead}</p>
              <LionTraining locale={locale} />
            </section>
            <section id="insights" tabIndex={-1} className={styles.act} aria-labelledby="lion-insights-title" data-case-section>
              <p className={styles.eyebrow}>04 / {t.chapters.insights}</p>
              <h2 id="lion-insights-title"><span data-chapter-heading>{t.insights}</span></h2>
              <p className={styles.intro} data-chapter-body>{t.insightsLead}</p>
              <div className={styles.reportSpread}><LionImage asset={lionAssets.reportMembers} locale={locale} variant="paper" /><LionImage asset={lionAssets.reportEnrollment} locale={locale} variant="paper" /></div>
              <p className={styles.note}>{t.reportsNote}</p>
              <div className={styles.context}>
                {['architecture', 'data', 'security', 'quality', 'status', 'resources'].map(id => <span key={id} id={id} className={styles.alias} aria-hidden="true" />)}
                <h3>{t.contextTitle}</h3><div><p>{t.context}</p><p className={styles.note}>{t.stack}</p>
                  <div className={styles.actions}>{applicationAction}<a className={styles.textLink} href={links.sourceCode} target="_blank" rel="noopener noreferrer">{t.source}<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> ({t.newTab})</span></a></div>
                </div>
              </div>
            </section>
            <footer className={styles.exit}><a href={`/${locale}/projetos/feedqr`}>{t.next}<ArrowRight size={28} aria-hidden="true" /></a><a className={styles.back} href={`/${locale}#projetos`}><ArrowLeft size={17} aria-hidden="true" />{t.home}</a></footer>
          </div>
        </div>
      </CaseMotion>
    </article>
  );
}
