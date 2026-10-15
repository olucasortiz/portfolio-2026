import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { copy, homepageProjectOrder, projects, type Locale } from '@/lib/content';
import { FeedqrShowcase } from './feedqr-showcase';
import stage from './project-stage.module.css';
import styles from './selected-projects.module.css';
import './project-navigation.css';

function LionProject({ locale, chapter }: { locale: Locale; chapter: string }) {
  const project = projects['lion-fitness'];
  const t = copy[locale];
  const media = project.showcaseMedia;
  const mascotAlt = locale === 'pt'
    ? 'Mascote do Lion Fitness: leão musculoso segurando halteres sobre o nome da marca.'
    : 'Lion Fitness mascot: a muscular lion holding dumbbells above the brand name.';
  return (
    <article className={`${stage.stage} ${styles.lion}`} aria-labelledby="lion-fitness-title" data-lion>
      <span className={`${stage.rail} ${styles.lionRail}`} aria-hidden="true">{chapter}</span>
      <div className={styles.scene} aria-hidden="true">
        <div className={styles.gymEnvWrapper}>
          <Image
            src="/projects/lion-fitness/gym-environment.webp"
            alt=""
            fill
            unoptimized
            className={styles.gymEnv}
          />
        </div>
        <div className={styles.gymLighting} data-lion-glow />
        <div className={styles.floorGlow} />
      </div>
      <div className={styles.lionStage}>
        <div className={styles.lionHeading} data-lion-heading>
          <p className={stage.category}>{project.category[locale]}</p>
          <h3 id="lion-fitness-title" aria-label={project.name} className="premiere-lion-title">
            <span className={styles.lionMask} aria-hidden="true"><span data-lion-word>LION</span></span>
            <span className={`${styles.lionMask} ${styles.fitness}`} aria-hidden="true"><span data-lion-word>FITNESS</span></span>
          </h3>
        </div>
        <div className={styles.intro} data-lion-content>
          <p className={styles.lionOverview}>{t.lionOverview}</p>
          <a className={`${stage.action} ${styles.action}`} href={`/${locale}/projetos/lion-fitness`}>
            <span className={stage.actionIcon}><ArrowRight size={22} aria-hidden="true" /></span>
            <span className={stage.actionText}>{t.projectPremiereAction}</span>
          </a>
        </div>
        {media ? (
          <div className={styles.art}>
            <div className={styles.mascotWrapper}>
              <Image
                className={styles.mascot}
                data-lion-mascot
                src="/projects/lion-fitness/lion-mascot-transparent.webp"
                alt={mascotAlt}
                width={1081}
                height={844}
                sizes="(max-width: 700px) 70vw, (max-width: 900px) 50vw, (max-width: 1920px) 29vw, 530px"
                quality={90}
              />
            </div>
            <figure className={styles.screen} data-lion-media>
              <div className={styles.bezel}>
                <Image
                  src={media.src}
                  alt={media.alt[locale]}
                  width={media.width}
                  height={media.height}
                  // The reviewed lossless source is only 38 KB. Serve its pixels
                  // directly instead of a larger, lossy second-generation export.
                  unoptimized
                />
              </div>
              <div className={styles.screenContactShadow} />
              <div className={styles.screenFloorGlow} />
            </figure>
          </div>
        ) : null}
        <div className={styles.technicalContext}>
          <p className={styles.attribution}>{t.lionAttribution}</p>
          <dl className={styles.context}>
            <div><dt>{t.scopeLabel}</dt><dd>{t.lionScope}</dd></div>
          </dl>
          {!media && <p className={styles.pending}>{t.mediaPending}</p>}
        </div>
      </div>
    </article>
  );
}

export function SelectedProjects({ locale }: { locale: Locale }) {
  return (
    <section className={styles.selected} id="projetos" aria-labelledby="selected-projects-title" data-selected-projects>
      <div className={`${styles.sectionHeading} container`}>
        <h2 id="selected-projects-title"><span data-selected-heading>{copy[locale].showcaseTitle}</span></h2>
      </div>
      {homepageProjectOrder.map((slug, index) => {
        const chapter = String(index + 1).padStart(2, '0');
        return slug === 'feedqr'
          ? <FeedqrShowcase key={slug} locale={locale} chapter={chapter} />
          : <LionProject key={slug} locale={locale} chapter={chapter} />;
      })}
    </section>
  );
}
