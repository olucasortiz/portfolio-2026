import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/content';
import { HomeHero } from '@/components/home-hero';
import { SelectedProjects } from '@/components/selected-projects';
import { HomeMotion } from '@/components/home-motion';
import { HomeExperience } from '@/components/home-experience';
import { TechnicalExpertise } from '@/components/technical-expertise';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <HomeMotion>
      <HomeHero locale={locale} />
      <SelectedProjects locale={locale} />
      <TechnicalExpertise locale={locale} />
      <HomeExperience locale={locale} />
    </HomeMotion>
  );
}
