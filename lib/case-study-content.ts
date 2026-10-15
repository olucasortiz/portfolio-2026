import type { Locale, ProjectExternalLinks, ProjectSlug } from './content';

type Bilingual = Record<Locale, string>;
export type CaseSection = { id: string; title: Bilingual; body: Bilingual; points?: Record<Locale, readonly string[]> };
export type CaseScreenshot = { src: string; width: number; height: number; caption: Bilingual };
type CaseContent = { stack: readonly string[]; links: ProjectExternalLinks; sections: readonly CaseSection[]; screenshots: readonly CaseScreenshot[] };
const text = (pt: string, en: string): Bilingual => ({ pt, en });

export const caseSectionLabels: Record<Locale, Record<string, string>> = {
  pt: { overview: 'Visão geral', workflows: 'Fluxos', gallery: 'Capturas', architecture: 'Arquitetura', data: 'Dados', security: 'Segurança', quality: 'Qualidade', status: 'Estado atual', resources: 'Recursos', 'public-survey': 'Pesquisa pública' },
  en: { overview: 'Overview', workflows: 'Workflows', gallery: 'Screenshots', architecture: 'Architecture', data: 'Data', security: 'Security', quality: 'Quality', status: 'Current status', resources: 'Resources', 'public-survey': 'Public survey' },
};

export const caseCopy = {
  pt: {
    home: 'Voltar ao início', details: 'Ver detalhes', navigation: 'Neste projeto', readingProgress: 'Progresso de leitura',
    gallery: 'Produto em imagens', openImage: 'Ampliar captura', close: 'Fechar galeria',
    previous: 'Captura anterior', next: 'Próxima captura', original: 'Abrir imagem original',
    galleryHint: 'Use as setas para navegar e Escape para fechar. A imagem pode ser rolada.',
    stack: 'Stack verificada', resources: 'Código e recursos', resourcesPending: 'Aplicação pública e outros recursos serão vinculados quando os destinos forem confirmados.',
    mediaPending: 'Capturas reais do Lion Fitness ainda não estão disponíveis. Esta apresentação usa somente tipografia.',
    nextProject: 'Continuar explorando', survey: 'Experimentar pesquisa', surveyTitle: 'Experimente o FeedQR com este portfólio.',
    surveyDescription: 'Uma pesquisa pública real para avaliar o portfólio com 1–5 estrelas e, se desejar, deixar um comentário.',
    surveyPending: 'Pesquisa ainda não publicada e validada. A demonstração será disponibilizada após a configuração da aplicação de produção.',
    surveyExternal: 'Abre a pesquisa pública do FeedQR em uma nova aba, sem cadastro.',
    newTab: 'abre em nova aba',
  },
  en: {
    home: 'Back to home', details: 'View details', navigation: 'In this project', readingProgress: 'Reading progress',
    gallery: 'Product screenshots', openImage: 'Enlarge screenshot', close: 'Close gallery',
    previous: 'Previous screenshot', next: 'Next screenshot', original: 'Open original image',
    galleryHint: 'Use arrow keys to navigate and Escape to close. The image can be scrolled.',
    stack: 'Verified stack', resources: 'Code and resources', resourcesPending: 'The public application and other resources will be linked once their destinations are confirmed.',
    mediaPending: 'Real Lion Fitness screenshots are not available yet. This presentation uses typography only.',
    nextProject: 'Keep exploring', survey: 'Try the survey', surveyTitle: 'Experience FeedQR through this portfolio.',
    surveyDescription: 'A real public survey to rate the portfolio with 1–5 stars and optionally leave a comment.',
    surveyPending: 'The survey has not been published and verified yet. The demo will be available after the production application is configured.',
    surveyExternal: 'Opens the public FeedQR survey in a new tab, without registration.',
    newTab: 'opens in a new tab',
  },
} as const;

// Claims derive from the inspected local sources, not the illustrative board.
// Evidence paths, revision differences and test results live in docs/CASE-STUDY-AUDIT.md.
export const caseStudies: Record<ProjectSlug, CaseContent> = {
  feedqr: {
    stack: ['Vue 3', 'Node.js', 'Express', 'Prisma', 'MongoDB', 'JWT', 'Zod'],
    links: { sourceCode: 'https://github.com/olucasortiz/qrcode-avaliacao', documentation: 'https://github.com/olucasortiz/qrcode-avaliacao#readme' },
    sections: [
      { id: 'overview', title: text('Feedback no momento da experiência.', 'Feedback at the moment of experience.'),
        body: text('Uma plataforma para empresas criarem pesquisas e pontos de coleta por QR Code. O visitante responde por uma rota pública, enquanto a gestão de pesquisas e resultados fica na área autenticada. A implementação segue em desenvolvimento; uma aplicação pública de produção ainda não foi validada.', 'A platform for companies to create surveys and QR-code collection points. Visitors answer through a public route, while survey and results management stays in the authenticated area. Development is ongoing; a public production application has not been verified.') },
      { id: 'workflows', title: text('Da pesquisa à resposta.', 'From survey to response.'),
        body: text('O código implementa rascunho, publicação e encerramento de pesquisas. A publicação exige perguntas válidas; pesquisas publicadas não podem ser editadas como rascunhos. A resposta pública dispensa login.', 'The code implements draft, publication and closure states. Publication requires valid questions; published surveys cannot be edited as drafts. Public responses require no login.'),
        points: { pt: ['Estrelas de 1–5, NPS de 0–10, sim/não, texto e múltipla escolha.', 'Perguntas obrigatórias e opcionais; comentário de até 2.000 caracteres.', 'Pontos de coleta com tokens públicos, filtros, resultados e exportação CSV.'], en: ['1–5 stars, 0–10 NPS, yes/no, text and multiple choice.', 'Required and optional questions; comments up to 2,000 characters.', 'Collection points with public tokens, filters, results and CSV export.'] } },
      { id: 'architecture', title: text('Interface pública, gestão protegida.', 'Public interface, protected management.'),
        body: text('Vue separa /p/:slug da área /app. A API Express organiza rotas, controllers e services, com Prisma na persistência. O envio público percorre validação, consulta da pesquisa ativa e uma transação que grava a resposta e seus itens.', 'Vue separates /p/:slug from the /app area. The Express API uses routes, controllers and services, with Prisma for persistence. Public submission validates input, checks the active survey and uses a transaction to write the response and its items.') },
      { id: 'data', title: text('Persistência e concorrência.', 'Persistence and concurrency.'),
        body: text('A versão local inspecionada usa MongoDB com Prisma e relações entre empresa, pesquisa, pergunta, ponto de coleta e resposta. O envio usa transação, chave de idempotência e hash do payload para reconciliar novas tentativas. O repositório público ainda documenta SQLite: essa documentação não representa toda a versão local atual.', 'The inspected local version uses MongoDB with Prisma and relations between company, survey, question, collection point and response. Submission uses a transaction, idempotency key and payload hash to reconcile retries. The public repository still documents SQLite: it does not represent the full current local version.') },
      { id: 'security', title: text('A empresa vem da sessão.', 'The company comes from the session.'),
        body: text('Rotas administrativas verificam JWT HS256 e consultam o usuário para obter empresaId. As consultas de pesquisas usam esse vínculo de empresa. Rotas públicas expõem a pesquisa ativa por slug e validam se cada pergunta e ponto de coleta pertence à pesquisa. Há limites de requisições por IP e validação Zod no servidor.', 'Administrative routes verify HS256 JWTs and look up the user to obtain empresaId. Survey queries use that company association. Public routes expose active surveys by slug and verify that each question and collection point belongs to the survey. IP-based request limits and server-side Zod validation are present.') },
      { id: 'quality', title: text('Falhas também fazem parte do fluxo.', 'Failures are part of the workflow.'),
        body: text('Os testes inspecionados e executados cobrem validação, respostas opcionais, tentativas repetidas, concorrência com a mesma chave e isolamento entre empresas. No frontend, a confirmação aparece somente após o serviço aceitar o envio; uma falha de rede preserva a tentativa para reconciliação. Esses testes isolados não validam uma implantação pública.', 'Inspected and executed tests cover validation, optional answers, retries, concurrency using the same key and company isolation. The frontend confirms success only after the service accepts submission; a network failure preserves the attempt for reconciliation. These isolated tests do not verify a public deployment.') },
      { id: 'status', title: text('O próximo passo é a publicação real.', 'The next step is a real deployment.'),
        body: text('Repetir uma chave impede duplicar a mesma tentativa; não impede uma pessoa de gerar novas chaves. A publicação precisa confirmar configuração de proxy, limites de abuso, empresa de demonstração, política de retenção e URL pública. A pesquisa do portfólio permanece pendente até uma verificação ponta a ponta.', 'Reusing a key prevents duplication of the same attempt; it does not prevent a person from generating new keys. Publication must confirm proxy configuration, abuse limits, the demo company, retention policy and public URL. The portfolio survey remains pending until an end-to-end verification.') },
    ],
    screenshots: [
      { src: '/projects/feedqr/dashboard.png', width: 1440, height: 1684, caption: text('Visão geral e indicadores', 'Overview and indicators') },
      { src: '/projects/feedqr/surveys.png', width: 1440, height: 1188, caption: text('Gestão de pesquisas', 'Survey management') },
      { src: '/projects/feedqr/create.png', width: 1440, height: 900, caption: text('Criação de pesquisa', 'Survey creation') },
      { src: '/projects/feedqr/login.png', width: 1440, height: 900, caption: text('Acesso à área de gestão', 'Management sign-in') },
      { src: '/projects/feedqr/dashboard-mobile.png', width: 360, height: 2865, caption: text('Dashboard no celular', 'Mobile dashboard') },
    ],
  },
  'lion-fitness': {
    stack: ['Java 21', 'Spring Boot', 'Spring Security', 'PostgreSQL', 'JDBC', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    links: { liveDemo: 'https://lionfitness-sa.duckdns.org/', sourceCode: 'https://github.com/olucasortiz/estagio-supervisionado-monorepo' },
    sections: [
      { id: 'overview', title: text('Da especificação à implementação.', 'From specification to implementation.'),
        body: text('Sistema de gestão de academia desenvolvido durante um estágio acadêmico supervisionado. Fui o principal responsável pela implementação, com orientação e revisão de um professor. O trabalho inclui requisitos ERS, modelagem de classes, banco, frontend, backend, pagamentos e relatórios.', 'A gym management system developed during a supervised academic internship. I was primarily responsible for implementation, with guidance and reviews from a professor. The work includes requirements, class modeling, database, frontend, backend, payments and reports.') },
      { id: 'workflows', title: text('Operação e acompanhamento.', 'Operations and follow-up.'),
        body: text('O código organiza alunos, assinaturas, treinos e pagamentos. Os relatórios consultam novos alunos e cancelamentos por período. A integração de pagamentos contém serviços Pix/cartão e processamento de eventos do Mercado Pago; existência do código não equivale a pagamentos de produção validados.', 'The code organizes members, subscriptions, workouts and payments. Reports query new members and cancellations by date range. Payment integration includes Pix/card services and Mercado Pago event handling; source code presence does not imply verified production payments.'),
        points: { pt: ['Backend Java/Spring e interface Next.js/React.', 'Persistência PostgreSQL e consultas JDBC.', 'Relatórios e controle de acesso por perfil.'], en: ['Java/Spring backend and Next.js/React interface.', 'PostgreSQL persistence and JDBC queries.', 'Reporting and role-based access control.'] } },
      { id: 'architecture', title: text('Camadas com responsabilidades claras.', 'Layers with clear responsibilities.'),
        body: text('Controllers Spring expõem os endpoints, services coordenam regras de negócio e repositories fazem consultas com JdbcTemplate. O frontend Next.js tem rotas de login e áreas por perfil, com serviços próprios para comunicação com a API.', 'Spring controllers expose endpoints, services coordinate business rules and repositories query through JdbcTemplate. The Next.js frontend has sign-in and role-based areas, with dedicated services for API communication.') },
      { id: 'data', title: text('Dados relacionais e transações.', 'Relational data and transactions.'),
        body: text('O backend utiliza PostgreSQL, identificadores UUID e scripts SQL para evoluir o banco. As consultas usam parâmetros; os serviços de pagamentos marcam operações de negócio com @Transactional. A integração mantém registros de transações e estados do gateway para acompanhamento.', 'The backend uses PostgreSQL, UUID identifiers and SQL scripts for database evolution. Queries use parameters; payment services mark business operations with @Transactional. Integration keeps transaction records and gateway states for follow-up.') },
      { id: 'security', title: text('Permissões em cada contexto.', 'Permissions in each context.'),
        body: text('Spring Security aplica autenticação stateless com JWT e senhas BCrypt. O filtro consulta usuários ativos e atribui seus perfis; relatórios usam autorização ADMIN. O código inclui validação de assinatura para webhooks de pagamento. Essas observações são uma leitura do código, não uma certificação de segurança.', 'Spring Security applies stateless JWT authentication and BCrypt passwords. The filter looks up active users and assigns their roles; reports require ADMIN authorization. Payment webhook signature validation is implemented. These observations come from source review, not a security certification.') },
      { id: 'quality', title: text('Regras que precisam sobreviver a mudanças.', 'Rules that must survive change.'),
        body: text('Há testes de autorização, pagamentos, webhooks, renovação e histórico de treinos no repositório local. Eles documentam cenários relevantes, mas não foram executados nesta tarefa do portfólio. Não há resultados ou métricas de produção confirmados para apresentar.', 'The local repository contains tests for authorization, payments, webhooks, renewal and workout history. They document relevant scenarios but were not run during this portfolio task. No verified production results or metrics are presented.') },
      { id: 'status', title: text('Implementação supervisionada, evolução contínua.', 'Supervised implementation, ongoing evolution.'),
        body: text('Os desafios verificáveis no código incluem reconciliação de pagamentos, permissões por perfil e preservação do histórico de treinos. As capturas públicas, as datas do estágio e os destinos de aplicação/documentação ainda precisam ser confirmados. A apresentação mantém esses limites explícitos.', 'Challenges visible in the code include payment reconciliation, role permissions and preserving workout history. Public screenshots, internship dates and application/documentation destinations still need confirmation. The presentation keeps these limits explicit.') },
    ],
    screenshots: [],
  },
};
