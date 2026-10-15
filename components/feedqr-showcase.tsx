import Image, { getImageProps } from 'next/image';
import { ArrowRight } from 'lucide-react';
import { copy, projects, type Locale } from '@/lib/content';
import stage from './project-stage.module.css';
import styles from './feedqr-showcase.module.css';

export function FeedqrShowcase({ locale, chapter }: { locale: Locale; chapter: string }) {
  const project = projects.feedqr;
  const href = `/${locale}/projetos/feedqr`;
  const mobile = getImageProps({
    src: '/projects/feedqr/dashboard-mobile.png', width: 360, height: 2865,
    alt: '', sizes: '(max-width: 460px) calc(100vw - 40px), 420px', quality: 85,
  }).props;
  return (
    <article className={`${stage.stage} ${styles.feedqr}`} aria-labelledby="feedqr-title" data-feedqr>
      <span className={stage.rail} aria-hidden="true">{chapter}</span>
      <div className={`${styles.stageBody} container`} data-feedqr-exit>
        <div className={styles.introduction}>
          <p className={stage.category}>{project.category[locale]}</p>
          <h3 id="feedqr-title" className={`${styles.title} premiere-feedqr-title`}>
            <span className={styles.titleMask}><span data-feedqr-heading>{project.name.slice(0, 4)}<span className={styles.accent}>{project.name.slice(4)}</span></span></span>
          </h3>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.summary}>{project.summary[locale]}</p>
          <p className={styles.status}>{copy[locale].publicApplication}</p>
          <a className={`${stage.action} ${styles.action}`} href={href} data-feedqr-action>
            <span className={stage.actionIcon}><ArrowRight size={22} aria-hidden="true" /></span>
            <span className={stage.actionText}>{copy[locale].projectPremiereAction}</span>
          </a>
        </div>
        <div className={`${styles.frame} premiere-feedqr-media`} data-feedqr-frame>
          <a className={styles.mediaLink} href={href} aria-label={`${copy[locale].projectPremiereAction}: ${project.name}`}>
            <div className={styles.imageEmphasis}>
              <picture>
                <source media="(max-width: 700px)" srcSet={mobile.srcSet} sizes={mobile.sizes} width={360} height={2865} />
                <Image
                  src="/projects/feedqr/dashboard.png" width={1440} height={1684}
                  alt={locale === 'pt'
                    ? 'FeedQR — visão geral com filtros, indicadores e respostas na captura real da aplicação.'
                    : 'FeedQR — overview with filters, indicators and responses in the real application screenshot.'}
                  sizes="(max-width: 460px) calc(100vw - 40px), (max-width: 700px) 420px, (max-width: 1000px) calc(100vw - 56px), (max-width: 1100px) 60vw, min(64vw, 76svh, 740px)"
                  quality={85} className={styles.image} data-feedqr-image
                />
              </picture>
            </div>
          </a>
        </div>
      </div>
    </article>
  );
}
