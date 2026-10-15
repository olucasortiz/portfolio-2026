import Link from 'next/link';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { copy, type Locale } from '@/lib/content';
import { FooterMotion } from './footer-motion';
import styles from './site-footer.module.css';

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const links = [
    { href: `/${locale}/projetos`, title: t.nav.projects },
    { href: `/${locale}/sobre`, title: t.nav.about },
    { href: `/${locale}/experiencia`, title: t.nav.experience },
  ];
  return (
    <FooterMotion>
      <div className="container">
        <div className={styles.composition}>
          <div>
            <div className={styles.heading}>
              <h2><span data-contact-title>{t.contactTitle}</span></h2>
            </div>
            <p className={styles.body}>{t.contactBody}</p>
            <p className={styles.pending}>{t.pending}</p>
          </div>
          <nav className={styles.links} data-contact-links aria-label={locale === 'pt' ? 'Navegação complementar' : 'Footer navigation'}>
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span>{link.title}</span><ArrowUpRight size={24} aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Lucas Ortiz</span>
          <span>{t.footer}</span>
          <Link href={`/${locale}`}><ArrowUp size={16} aria-hidden="true" />{t.heroTitle}</Link>
        </div>
      </div>
    </FooterMotion>
  );
}
