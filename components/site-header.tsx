'use client';

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { copy, type Locale } from '@/lib/content';

export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const t = copy[locale];
  const items = [
    { href: `/${locale}/projetos`, text: t.nav.projects },
    { href: `/${locale}/sobre`, text: t.nav.about },
    { href: `/${locale}/experiencia`, text: t.nav.experience },
    { href: `/${locale}#contato`, text: t.nav.contact },
  ];
  const otherLocale = locale === 'pt' ? 'en' : 'pt';
  const languageHref = pathname.replace(/^\/(pt|en)(?=\/|$)/, `/${otherLocale}`);
  const navigationLabel = locale === 'pt' ? 'Navegação principal' : 'Main navigation';

  function closeMenu() { setOpen(false); }

  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          closeMenu();
          toggle.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <a className="skip-link" href="#main-content">
        {locale === 'pt' ? 'Ir para o conteúdo' : 'Skip to content'}
      </a>
      <div className="container header-inner">
        <Link
          href={`/${locale}`}
          className="brand"
          onClick={closeMenu}
          aria-label={locale === 'pt' ? 'Lucas Ortiz — início' : 'Lucas Ortiz — home'}
        >
          LO<span className="brand-dot">.</span>
        </Link>
        <nav className="desktop-nav" aria-label={navigationLabel}>
          {items.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
              {item.text}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            className="lang-switch"
            href={languageHref}
            hrefLang={otherLocale}
            lang={otherLocale}
            onClick={closeMenu}
            aria-label={locale === 'pt' ? 'Switch to English' : 'Mudar para português'}
          >
            {otherLocale.toUpperCase()}
          </Link>
          <button
            ref={toggle}
            type="button"
            className="mobile-menu-toggle"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={locale === 'pt' ? (open ? 'Fechar menu' : 'Abrir menu') : (open ? 'Close menu' : 'Open menu')}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav id={menuId} className="mobile-nav" aria-label={navigationLabel} hidden={!open}>
        {items.map((item) => (
          <Link key={item.href} href={item.href} onClick={closeMenu} aria-current={pathname === item.href ? 'page' : undefined}>
            {item.text}
          </Link>
        ))}
      </nav>
    </header>
  );
}
