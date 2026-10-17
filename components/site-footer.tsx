import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { copy, type Locale } from '@/lib/content';
import { FooterMotion } from './footer-motion';
import styles from './site-footer.module.css';

const whatsappMessage = encodeURIComponent('Olá, Lucas! Encontrei seu portfólio e gostaria de conversar.');

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const links = [
    { href: 'https://www.linkedin.com/in/lucasortizcampos/', title: 'LinkedIn', icon: Linkedin, label: `LinkedIn — Lucas Ortiz (${t.opensNewTab})`, external: true },
    { href: 'https://github.com/olucasortiz', title: 'GitHub', icon: Github, label: `GitHub — olucasortiz (${t.opensNewTab})`, external: true },
    { href: 'mailto:lucassas@outlook.com', title: t.contactEmail, icon: Mail, label: `${t.contactEmail} — lucassas@outlook.com`, external: false },
    { href: `https://wa.me/5518996992139?text=${whatsappMessage}`, title: 'WhatsApp', icon: MessageCircle, label: `WhatsApp — +55 18 99699-2139 (${t.opensNewTab})`, external: true },
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
          </div>
          <nav data-contact-links aria-label={t.contactLinksLabel}>
            <ul className={styles.links}>
              {links.map(({ href, title, icon: Icon, label, external }) => (
                <li key={href}>
                  <a href={href} aria-label={label} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
                    <Icon className={styles.icon} size={20} strokeWidth={1.5} aria-hidden="true" />
                    <span>{title}</span>
                    <ArrowUpRight className={styles.arrow} size={24} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Lucas Ortiz</span>
          <span>{t.footer}</span>
          <a href="#" aria-label={t.backToTop}><ArrowUp size={16} aria-hidden="true" />{t.heroTitle}</a>
        </div>
      </div>
    </FooterMotion>
  );
}
