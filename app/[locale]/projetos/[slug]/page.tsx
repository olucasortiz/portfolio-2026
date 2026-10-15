import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowDown, ArrowRight } from 'lucide-react';
import { copy, isLocale, locales, projects, type ProjectSlug } from '@/lib/content';
import { caseCopy, caseSectionLabels, caseStudies, type CaseSection } from '@/lib/case-study-content';
import { CaseGallery } from '@/components/case-gallery';
import { FeedqrTour } from '@/components/feedqr-tour';
import { FeedqrCaseStudy } from '@/components/feedqr-case-study';
import { LionCaseStudy } from '@/components/lion-case-study';
import { FeedqrArchitecture } from '@/components/feedqr-architecture';
import { tourCopy } from '@/lib/feedqr-tour-content';
import { CaseMotion } from '@/components/case-motion';
import { CaseChapters } from '@/components/case-chapters';
import { FeedqrDemo } from '@/components/feedqr-demo';
import { ProjectLinks } from '@/components/project-links';
import styles from '@/components/case-study.module.css';
import '@/components/project-navigation.css';

export function generateStaticParams() {
  return locales.flatMap((locale) => Object.keys(projects).map((slug) => ({ locale, slug })));
}

export default async function CaseStudy({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !Object.hasOwn(projects, slug)) notFound();
  if (slug === 'feedqr') return <FeedqrCaseStudy locale={locale} />;
  if (slug === 'lion-fitness') return <LionCaseStudy locale={locale} />;
  const projectSlug = slug as ProjectSlug;
  const project = projects[projectSlug];
  const content = caseStudies[projectSlug];
  const t = caseCopy[locale];
  const labels = caseSectionLabels[locale];
  const feedqr = projectSlug === 'feedqr';
  const other = feedqr ? 'lion-fitness' : 'feedqr';
  const navigation = [...content.sections.slice(0, 2).map((section) => section.id), 'gallery',
    ...content.sections.slice(2).map((section) => section.id), ...(feedqr ? ['public-survey'] : []), 'resources'];
  const renderSection = (section: CaseSection) => (
    <section key={section.id} id={section.id} tabIndex={-1} className={styles.readingSection} aria-labelledby={`case-${section.id}-title`} data-case-section data-chapter={section.id}>
      <div className={styles.chapterHeading}>
        <p className={styles.chapterLabel}>{labels[section.id]}</p>
        <h2 id={`case-${section.id}-title`}><span data-chapter-heading>{section.title[locale]}</span></h2>
      </div>
      <div className={styles.sectionBody} data-chapter-body>
        <p>{section.body[locale]}</p>
        {section.points && <ul>{section.points[locale].map((point) => <li key={point}>{point}</li>)}</ul>}
      </div>
      {feedqr && section.id === 'architecture' && <FeedqrArchitecture locale={locale} />}
    </section>
  );
  return (
    <article lang={locale} className={styles.caseStudy}>
      <CaseMotion>
        <header className={styles.cover}>
          <div className="container">
            <a className={styles.back} href={`/${locale}#projetos`}><ArrowLeft size={17} aria-hidden="true" />{t.home}</a>
            <div className={feedqr ? styles.coverGrid : styles.lionCover}>
              <div className={styles.identity}>
                <p className={styles.eyebrow}>{project.category[locale]}</p>
                <h1 className={`${styles.title} ${feedqr ? 'premiere-feedqr-title' : 'premiere-lion-title'}`} aria-label={project.name}>
                  {feedqr ? <span aria-hidden="true">Feed<span className={styles.accent}>QR</span></span>
                    : <span aria-hidden="true">LION<br /><span className={styles.accent}>FITNESS</span></span>}
                </h1>
                <p className={styles.lead}>{project.summary[locale]}</p>
                {feedqr && <p className={styles.status}>{copy[locale].publicApplication}</p>}
                <a className={styles.primaryAction} href="#overview">{t.details}<ArrowDown size={20} aria-hidden="true" /></a>
              </div>
              {feedqr && <div className={`${styles.coverMedia} premiere-feedqr-media`} data-case-media>
                <Image src="/projects/feedqr/dashboard.png" width={1440} height={1684} priority
                  alt={content.screenshots[0].caption[locale]} sizes="(max-width: 1000px) calc(100vw - 56px), 58vw" quality={85} />
              </div>}
            </div>
            <div className={styles.stack}><p>{t.stack}</p><p>{content.stack.join(' · ')}</p></div>
          </div>
        </header>
        <div className={`container ${styles.readingLayout}`} data-case-reading>
          <CaseChapters chapters={navigation} locale={locale} />
          <div className={styles.chapters}>
            {content.sections.slice(0, 2).map(renderSection)}
            <section id="gallery" tabIndex={-1} className={styles.gallery} aria-labelledby="case-gallery-title" data-case-section data-media-pending={!content.screenshots.length}>
              <h2 id="case-gallery-title"><span data-chapter-heading>{feedqr ? tourCopy[locale].heading : t.gallery}</span></h2>
              {content.screenshots.length ? (feedqr ? <FeedqrTour locale={locale} /> : <CaseGallery screenshots={content.screenshots} locale={locale} />)
                : <p className={styles.mediaPending}>{t.mediaPending}</p>}
            </section>
            {content.sections.slice(2).map(renderSection)}
            {feedqr && <FeedqrDemo locale={locale} />}
            <section id="resources" tabIndex={-1} className={styles.resources} aria-labelledby="case-resources-title" data-case-section>
              <h2 id="case-resources-title"><span data-chapter-heading>{t.resources}</span></h2>
              <ProjectLinks locale={locale} links={content.links} />
              <p className={styles.note}>{t.resourcesPending}</p>
            </section>
          </div>
        </div>
        <div className="container">
          <footer className={styles.nextProject}>
            <p>{t.nextProject}</p>
            <a href={`/${locale}/projetos/${other}`}>{projects[other].name}<ArrowRight size={30} aria-hidden="true" /></a>
            <a className={styles.back} href={`/${locale}#projetos`}><ArrowLeft size={17} aria-hidden="true" />{t.home}</a>
          </footer>
        </div>
      </CaseMotion>
    </article>
  );
}
