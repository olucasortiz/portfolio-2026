import type { YearMonth } from './career-duration';
export type Locale = 'pt' | 'en';
export const locales: Locale[] = ['pt', 'en'];
export function isLocale(value: string): value is Locale { return value === 'pt' || value === 'en'; }
export type ProjectExternalLinks = {
 liveDemo?: string;
 sourceCode?: string;
 documentation?: string;
};
export type ProjectMedia = {
 src: string;
 width: number;
 height: number;
 alt: Record<Locale, string>;
 mobile?: { src: string; width: number; height: number; alt: Record<Locale, string> };
};
export const copy = {
 pt: {
 nav: { projects:'Projetos', about:'Sobre', experience:'Experiência', contact:'Contato' },
 heroTitle:'Lucas Ortiz', heroRole:'Software Developer', heroSpecialty:'/ Full Stack', heroLead:'Desenvolvo aplicações web de ponta a ponta, conectando interfaces, sistemas e experiências digitais.', heroAction:'Explorar projetos',
 selected:'TRABALHOS SELECIONADOS', selectedTitle:'Sistemas feitos para funcionar. E para pessoas usarem.', viewProject:'Ver estudo de caso',
 showcaseTitle:'Projetos selecionados', exploreProject:'Conhecer projeto', projectPremiereAction:'Explorar projeto',
 lionOverview:'Sistema Full Stack para gestão de academias. Um estudo de caso do desenvolvimento completo, dos requisitos às integrações e aos relatórios.',
 lionAttribution:'Fui o principal responsável pela implementação durante um estágio acadêmico supervisionado, com orientação e revisão técnica de um professor.',
 scopeLabel:'Escopo', lionScope:'Documentação ERS, modelagem de classes, banco de dados, frontend, backend, pagamentos e relatórios.',
 mediaPending:'Capturas reais serão adicionadas após a atualização do frontend.',
 projectResources:'Acessar o projeto', liveDemo:'Ver aplicação', sourceCode:'Código-fonte', technicalDocumentation:'Documentação técnica', opensNewTab:'abre em nova aba',
 expertise:'COMO EU TRABALHO', expertiseTitle:'Do problema ao produto.', expertiseBody:'Experiência prática com documentação, modelagem, desenvolvimento de interfaces, APIs e persistência de dados. Trabalho com diferentes tecnologias conforme as necessidades do projeto.',
 experienceLabel:'TRAJETÓRIA', experienceTitle:'Experiência além do código.', experienceBody:'Desenvolvimento de software, ensino de tecnologia e atendimento ao público — experiências que ampliaram minha visão sobre sistemas e pessoas.', experienceAction:'Conhecer trajetória',
 contactLabel:'PRÓXIMO PASSO', contactTitle:'Vamos conversar?', contactBody:'Aberto a oportunidades e conversas sobre desenvolvimento de software.', contactAction:'Entrar em contato',
 footer:'Desenvolvido com atenção aos detalhes.', projectsTitle:'Projetos selecionados.', projectsIntro:'Dois produtos com desafios diferentes de arquitetura, implementação e experiência.',
 aboutLabel:'SOBRE', aboutTitle:'Tecnologia com propósito e execução.', aboutBody:'Sou Lucas Ortiz, desenvolvedor de software com atuação Full Stack. Minha experiência envolve construção de sistemas web, modelagem de dados e integração entre frontend e backend.',
 education:'Formação', educationValue:'Sistemas de Informação — UNOESTE', educationDate:'Em andamento · conclusão prevista para dezembro de 2026', techTitle:'Tecnologias em contexto', techIntro:'Ferramentas utilizadas nos projetos apresentados, não uma lista de proficiências autodeclaradas.',
 expPageTitle:'Uma trajetória em construção.', expPageIntro:'Experiências com desenvolvimento, ensino e serviços ao público.',
 projectOverview:'Visão geral', contribution:'Minha participação', stack:'Tecnologias', gallery:'Produto em imagens', noMedia:'Capturas do Lion Fitness serão adicionadas após a atualização do frontend.', publicApplication:'Aplicação pública', nextProject:'Outro projeto', backProjects:'Todos os projetos',
 resume:'Currículo em preparação', pending:'Informações de contato e currículo serão disponibilizadas após confirmação dos links.',
 },
 en: {
 nav: { projects:'Projects', about:'About', experience:'Experience', contact:'Contact' },
 heroTitle:'Lucas Ortiz', heroRole:'Software Developer', heroSpecialty:'/ Full Stack', heroLead:'I build end-to-end web applications, connecting interfaces, systems and digital experiences.', heroAction:'Explore projects',
 selected:'SELECTED WORK', selectedTitle:'Systems built to work. And built for people.', viewProject:'View case study',
 showcaseTitle:'Selected projects', exploreProject:'Explore project', projectPremiereAction:'Explore project',
 lionOverview:'A Full Stack gym management system. A case study of the complete development process, from requirements to integrations and reporting.',
 lionAttribution:'I was primarily responsible for implementation during a supervised academic internship, with technical guidance and reviews from a professor.',
 scopeLabel:'Scope', lionScope:'Requirements specification, class modeling, database, frontend, backend, payments and reporting.',
 mediaPending:'Real screenshots will be added after the frontend update.',
 projectResources:'Access the project', liveDemo:'Live demo', sourceCode:'Source code', technicalDocumentation:'Technical documentation', opensNewTab:'opens in a new tab',
 expertise:'MY APPROACH', expertiseTitle:'From problem to product.', expertiseBody:'Hands-on experience in documentation, modeling, interface development, APIs, and data persistence. I choose technologies based on the needs of each project.',
 experienceLabel:'BACKGROUND', experienceTitle:'Experience beyond code.', experienceBody:'Software development, teaching technology, and public service — experiences that shaped how I think about systems and people.', experienceAction:'Explore experience',
 contactLabel:'NEXT STEP', contactTitle:'Let’s talk.', contactBody:'Open to opportunities and conversations about software development.', contactAction:'Get in touch',
 footer:'Built with attention to detail.', projectsTitle:'Selected projects.', projectsIntro:'Two products with different challenges in architecture, implementation, and experience.',
 aboutLabel:'ABOUT', aboutTitle:'Technology with purpose and execution.', aboutBody:'I’m Lucas Ortiz, a Full Stack software developer. My experience includes building web systems, data modeling, and integrating frontend and backend.',
 education:'Education', educationValue:'Information Systems — UNOESTE', educationDate:'In progress · expected graduation December 2026', techTitle:'Technologies in context', techIntro:'Tools used in the projects shown, not a list of self-assessed proficiency levels.',
 expPageTitle:'A career in progress.', expPageIntro:'Experience in development, teaching, and public services.',
 projectOverview:'Overview', contribution:'My contribution', stack:'Technology', gallery:'Product imagery', noMedia:'Lion Fitness screenshots will be added after the frontend update.', publicApplication:'Public application', nextProject:'Another project', backProjects:'All projects',
 resume:'Resume coming soon', pending:'Contact information and resume will be published once the links are confirmed.',
 }
} as const;
export const projects = {
 'lion-fitness': {
  name:'Lion Fitness', number:'01', year:'—', category:{pt:'Sistema de gestão · Full Stack',en:'Management system · Full Stack'},
  summary:{pt:'Sistema de gestão para academia desenvolvido desde a documentação e modelagem até a implementação de funcionalidades e integração de pagamentos.',en:'Gym management system built from requirements and modeling through feature implementation and payment integration.'},
  detail:{pt:'Durante um estágio supervisionado, fui o principal responsável pela implementação do sistema, com revisão e orientação de um professor da faculdade. Trabalhei na especificação de requisitos (ERS), modelos de classes, estruturação do banco de dados, interfaces, backend, pagamentos e relatórios.',en:'During a supervised internship, I was primarily responsible for implementing the system, with reviews and guidance from a university professor. My work covered requirements specification, class models, database design, interfaces, backend, payments, and reporting.'},
  tech:['Java','Spring','PostgreSQL','Next.js','React','TypeScript','Tailwind CSS','Node.js'], images:[] as string[], status:null,
  links: {} as ProjectExternalLinks,
  // Add verified media here to switch this homepage entry to the cinematic presentation.
  showcaseMedia: {
    src:'/projects/lion-fitness/admin-overview.webp', width:1227, height:590,
    alt:{pt:'Lion Fitness — painel administrativo real com indicadores de alunos e assinaturas, gráfico de receita mensal e receita por plano. Valores financeiros removidos.',en:'Lion Fitness — real administrative dashboard with member and subscription indicators, a monthly revenue chart and revenue by plan. Financial values removed.'},
   } as ProjectMedia | undefined,
 },
 feedqr: {
  name:'FeedQR', number:'02', year:'2026', category:{pt:'Plataforma de feedback · Full Stack',en:'Feedback platform · Full Stack'},
  summary:{pt:'Aplicação pública de pesquisas de satisfação via QR Code, com questionários personalizados, coleta de respostas e painel de análise.',en:'A publicly accessible QR-code satisfaction survey app with custom questionnaires, response collection, and an analytics dashboard.'},
  detail:{pt:'O FeedQR simplifica a coleta de feedbacks em empresas, com pesquisas vinculadas a pontos de coleta, formulários públicos pensados para celulares, indicadores e exportação CSV. A aplicação está acessível publicamente; a validação de cada fluxo em produção continua sendo necessária.',en:'FeedQR supports business feedback collection with location-linked surveys, mobile-first public forms, analytics, and CSV exports. The application is publicly accessible; individual production flows still require verification.'},
  tech:['Vue.js','Node.js','Express','MongoDB','Prisma','JWT','Zod'],images:['/projects/feedqr/dashboard.png','/projects/feedqr/surveys.png','/projects/feedqr/create.png','/projects/feedqr/login.png','/projects/feedqr/dashboard-mobile.png'], status:'public',
  links: {} as ProjectExternalLinks,
  showcaseMedia: {
   src:'/projects/feedqr/create.png', width:1440, height:900,
   alt:{pt:'FeedQR — interface de gerenciamento de pesquisas.',en:'FeedQR — survey management interface.'},
   mobile:{src:'/projects/feedqr/surveys.png', width:1440, height:1188, alt:{pt:'FeedQR — lista de pesquisas com seus status e datas.',en:'FeedQR — survey list with statuses and dates.'}},
  } as ProjectMedia,
 }
} as const;
export type ProjectSlug = keyof typeof projects;
// Homepage presentation order, independent of project significance and archive order.
export const homepageProjectOrder: readonly ProjectSlug[] = ['feedqr', 'lion-fitness'];
export const experiences = [
 {name:'Lion Fitness', role:{pt:'Desenvolvimento Full Stack · estágio supervisionado',en:'Full Stack Development · supervised internship'}, start:{year:2026,month:1}, end:null as YearMonth | null, description:{pt:'Principal responsável pela implementação do sistema, com orientação e revisões de um professor da faculdade. Atuação em requisitos, modelagem, banco de dados, frontend, backend, pagamentos e relatórios.',en:'Primarily responsible for implementing the system, guided and reviewed by a university professor. Worked on requirements, modeling, database, frontend, backend, payments, and reports.'}},
 {name:'Colégio Maximus', role:{pt:'Professor de Robótica e Programação',en:'Robotics and Programming Teacher'},start:{year:2025,month:5}, end:null as YearMonth | null,description:{pt:'Ensino de programação e robótica para crianças e adolescentes de 6 a 14 anos, adaptando conceitos técnicos para diferentes faixas etárias.',en:'Taught programming and robotics to children aged 6 to 14, adapting technical concepts to different age groups.'}},
 {name:'INSS',role:{pt:'Estagiário',en:'Intern'},start:{year:2023,month:5}, end:{year:2025,month:4} as YearMonth | null,description:{pt:'Atendimento ao público, auxílio em demandas de TI e atividades relacionadas a serviços previdenciários, incluindo aposentadorias e pensões.',en:'Public-facing service, IT assistance, and support with social security processes, including retirement and pension services.'}}
];
