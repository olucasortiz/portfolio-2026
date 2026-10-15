import type { Locale } from './content';

// Existing fragments stay valid; only these four destinations appear in the
// FeedQR index. Detailed implementation evidence remains in the Markdown audit.
export const feedqrChapters = ['overview', 'gallery', 'architecture', 'resources'] as const;
export const feedqrCaseCopy = {
  pt: {
    chapters: { overview: 'Descobrir', gallery: 'Explorar', architecture: 'Por dentro', resources: 'Continuar' },
    lead: 'Pesquisas de satisfação por QR Code. A empresa cria questionários e acompanha os resultados; o visitante responde pelo celular, sem cadastro.',
    explore: 'Explorar a interface', github: 'GitHub', documentation: 'Documentação',
    app: 'Explorar sistema', account: 'A gestão exige uma conta. Você pode precisar criar uma para explorar o sistema.',
    tourTitle: 'Explore o produto.', insideTitle: 'Por dentro do FeedQR.',
    inside: 'A gestão exige autenticação e mantém os dados vinculados à empresa. O diagrama acompanha o envio de uma avaliação pública.',
    continueTitle: 'A experiência continua.', statusTitle: 'Aplicação pública',
    documentationNote: 'Explore o sistema real ou consulte o código e a documentação do projeto.',
  },
  en: {
    chapters: { overview: 'Discover', gallery: 'Explore', architecture: 'Inside', resources: 'Continue' },
    lead: 'QR-code satisfaction surveys. Companies create questionnaires and follow the results; visitors respond on their phones without an account.',
    explore: 'Explore the interface', github: 'GitHub', documentation: 'Documentation',
    app: 'Explore the app', account: 'Management requires an account. You may need to create one to explore the app.',
    tourTitle: 'Explore the product.', insideTitle: 'Inside FeedQR.',
    inside: 'Management requires authentication and associates data with each company. The diagram follows a public survey submission.',
    continueTitle: 'The experience continues.', statusTitle: 'Public application',
    documentationNote: 'Explore the real app or read the project’s source code and documentation.',
  },
} satisfies Record<Locale, object>;

export const feedqrPortfolioCopy = {
  pt: {
    label: 'Seu feedback', title: ['Seu olhar.', 'Meu próximo passo.'],
    description: 'O que este portfólio comunica para você? Deixe sua avaliação na pesquisa pública do FeedQR e ajude a orientar os próximos ajustes.',
    action: 'Avaliar portfólio', external: 'A avaliação acontece no FeedQR, em uma nova aba.',
    pending: 'A pesquisa do portfólio ainda não está disponível. Você já pode explorar o sistema real pelos links abaixo.',
    scan: 'Pelo celular, aponte a câmera.', loading: 'Preparando QR Code…',
    qrAlt: 'QR Code para abrir a pesquisa de avaliação do portfólio Lucas Ortiz no FeedQR.',
    qrError: 'O QR Code não carregou. Use o link para abrir a mesma pesquisa.',
    retry: 'Tentar carregar QR Code novamente', noScript: 'Use o botão para abrir a pesquisa. O QR Code requer JavaScript.',
  },
  en: {
    label: 'Your feedback', title: ['Your perspective.', 'My next step.'],
    description: 'What does this portfolio communicate to you? Share your rating through FeedQR’s public survey and help guide the next refinements.',
    action: 'Rate this portfolio', external: 'The rating takes place on FeedQR, in a new tab.',
    pending: 'The portfolio survey is not available yet. You can already explore the real app through the links below.',
    scan: 'On your phone, point the camera.', loading: 'Preparing QR code…',
    qrAlt: 'QR code to open the Lucas Ortiz portfolio rating survey on FeedQR.',
    qrError: 'The QR code could not load. Use the link to open the same survey.',
    retry: 'Try loading the QR code again', noScript: 'Use the button to open the survey. The QR code requires JavaScript.',
  },
} satisfies Record<Locale, object>;
