import type { Locale } from './content';

export type ExpertiseGroup = {
  id: string;
  name: Record<Locale, string>;
  technologies: readonly string[];
};

export const expertiseCopy = {
  pt: { title: 'Tecnologias que', emphasis: 'utilizo.' },
  en: { title: 'Technologies', emphasis: 'I use.' },
} as const;

// General repertoire, confirmed by source evidence and the user's AWS/CI/CD
// confirmation. No service names, deployment status or proficiency ratings.
export const expertiseGroups: readonly ExpertiseGroup[] = [
  { id: 'frontend', name: { pt: 'Frontend', en: 'Frontend' },
    technologies: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'HTML', 'CSS'] },
  { id: 'backend', name: { pt: 'Backend', en: 'Backend' },
    technologies: ['Java', 'Spring Boot', 'Node.js', 'Express'] },
  { id: 'data', name: { pt: 'Bancos de dados & Dados', en: 'Databases & Data' },
    technologies: ['PostgreSQL', 'MongoDB', 'SQLite', 'Prisma'] },
  { id: 'cloud', name: { pt: 'Cloud & DevOps', en: 'Cloud & DevOps' },
    technologies: ['AWS', 'GitHub Actions', 'CI/CD', 'Git'] },
];
