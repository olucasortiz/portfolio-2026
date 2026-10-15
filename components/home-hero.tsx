import { ArrowDown } from 'lucide-react';
import { copy, type Locale } from '@/lib/content';
import styles from './home-hero.module.css';

export function HomeHero({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className={`${styles.hero} container`} aria-labelledby="hero-title" data-home-hero>
      <div className={styles.composition}>
        <p className={styles.role} data-hero-support="role">
          <span className={styles.marker} aria-hidden="true" />
          <span>{t.heroRole}</span>
          <span className={styles.specialty}>{t.heroSpecialty}</span>
        </p>

        <h1 id="hero-title" className={styles.name} aria-label={t.heroTitle}>
          <span className={`${styles.mask} ${styles.firstLine}`} aria-hidden="true" data-hero-line="first">
            <span className={styles.word}>
              {['LU', 'CA', 'S'].map((group) => (
                <span className={styles.groupMask} key={group}>
                  <span className={styles.group} data-hero-group="first">
                    <span className={styles.glyphSource} data-hero-source>{group}</span>
                    {Array.from(group).map((letter, index) => <span className={styles.letter} data-hero-letter key={index}>{letter}</span>)}
                  </span>
                </span>
              ))}
            </span>
          </span>
          <span className={`${styles.mask} ${styles.secondLine}`} aria-hidden="true" data-hero-line="second">
            <span className={styles.word}>
              {['OR', 'TI', 'Z'].map((group) => (
                <span className={styles.groupMask} key={group}>
                  <span className={styles.group} data-hero-group="second">
                    <span className={styles.glyphSource} data-hero-source>{group}</span>
                    {Array.from(group).map((letter, index) => <span className={styles.letter} data-hero-letter key={index}>{letter}</span>)}
                  </span>
                </span>
              ))}
              <span className={styles.period} data-hero-period>.</span>
            </span>
          </span>
        </h1>

        <div className={styles.intro} data-hero-support="intro">
          <p className={styles.description}>{t.heroLead}</p>
        </div>
        <a className={styles.projectLink} href="#projetos" data-hero-support="action">
          <span className={styles.actionIcon} aria-hidden="true">
            <ArrowDown size={22} strokeWidth={1.5} />
          </span>
          <span className={styles.actionText}>{t.heroAction}</span>
        </a>
        <span className={styles.scrollCue} aria-hidden="true"><span /></span>
      </div>
    </section>
  );
}
