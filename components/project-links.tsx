import { ArrowUpRight } from 'lucide-react';
import { copy, type Locale, type ProjectExternalLinks } from '@/lib/content';
import styles from './project-links.module.css';

const linkKeys = ['liveDemo', 'sourceCode', 'documentation'] as const;

export function ProjectLinks({ locale, links }: { locale: Locale; links: ProjectExternalLinks }) {
  const t = copy[locale];
  const labels = { liveDemo: t.liveDemo, sourceCode: t.sourceCode, documentation: t.technicalDocumentation };
  const available = linkKeys.flatMap((key) => {
    const href = links[key];
    if (!href) return [];
    try {
      const url = new URL(href);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return [];
      return [{ key, href: url.href, label: labels[key] }];
    } catch { return []; }
  });

  if (!available.length) return null;

  return (
    <section className={styles.resources} aria-label={t.projectResources}>
      <h2>{t.projectResources}</h2>
      <ul>
        {available.map(({ key, href, label }) => (
          <li key={key}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              {label}<ArrowUpRight size={18} aria-hidden="true" />
              <span className="sr-only"> ({t.opensNewTab})</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
