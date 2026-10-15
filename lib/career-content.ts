import type { Locale } from './content';

export const careerCopy: Record<Locale, { title: string; introduction: string; select: string; activities: string; archive: string }> = {
  pt: { title: 'Experiência', introduction: 'Desenvolvimento Full Stack, ensino de robótica e atendimento ao público.', select: 'Selecione uma experiência', activities: 'Atividades', archive: 'Todas as experiências' },
  en: { title: 'Experience', introduction: 'Full Stack development, robotics teaching and public-facing service.', select: 'Select an experience', activities: 'Activities', archive: 'All experiences' },
};

export const careerActivities: Record<string, Record<Locale, readonly string[]>> = {
  'Lion Fitness': {
    pt: ['Documentação de requisitos (ERS) e modelagem de classes.', 'Estruturação do banco de dados, frontend e backend.', 'Integração de pagamentos e relatórios.', 'Principal implementação com orientação e revisão de um professor.'],
    en: ['Requirements specification and class modeling.', 'Database design, frontend and backend development.', 'Payment integration and reporting.', 'Primary implementation with guidance and reviews from a professor.'],
  },
  'Colégio Maximus': {
    pt: ['Ensino de robótica e programação para crianças e adolescentes de 6 a 14 anos.', 'Adaptação de conceitos técnicos a diferentes faixas etárias.'],
    en: ['Teaching robotics and programming to children aged 6–14.', 'Adapting technical concepts for different age groups.'],
  },
  INSS: {
    pt: ['Atendimento ao público.', 'Auxílio em demandas de TI.', 'Atividades relacionadas a aposentadorias, pensões e outros serviços previdenciários.'],
    en: ['Public-facing service.', 'IT assistance.', 'Support with retirement, pension and other social security services.'],
  },
};
