import {notFound} from 'next/navigation';import {isLocale,locales} from '@/lib/content';import {SiteHeader} from '@/components/site-header';import {SiteFooter} from '@/components/site-footer';
export function generateStaticParams(){return locales.map(locale=>({locale}))}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <><SiteHeader locale={locale}/><main id="main-content">{children}</main><SiteFooter locale={locale}/></>}
