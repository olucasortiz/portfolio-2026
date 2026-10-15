import type { Locale } from './content';
import { caseStudies, type CaseScreenshot } from './case-study-content';

export type TourScene = CaseScreenshot & { description: Record<Locale, string>; responsive: boolean; centered: boolean };
const descriptions: Record<Locale, readonly string[]> = {
  pt: [
    'Filtros por data, pesquisa e ponto de coleta acompanham os indicadores e o gráfico de respostas. A captura mostra a visão geral da área de gestão.',
    'A lista reúne pesquisas, status e datas de criação. O filtro distingue pesquisas ativas, rascunhos e pesquisas encerradas.',
    'O formulário define título, descrição opcional e slug público. Esta é a configuração inicial da pesquisa, antes de organizar suas perguntas.',
    'A entrada por email e senha dá acesso à área de gestão. A pesquisa pública tem um fluxo separado, sem exigir cadastro do visitante.',
    'O mesmo dashboard reorganiza filtros, indicadores e resultados em uma coluna. Role o quadro para inspecionar esta captura responsiva completa.',
  ],
  en: [
    'Date, survey and collection-point filters accompany the indicators and response chart. This capture shows the management overview.',
    'The list brings together surveys, statuses and creation dates. The filter distinguishes active surveys, drafts and closed surveys.',
    'The form defines a title, optional description and public slug. This is the initial survey setup, before organizing its questions.',
    'Email and password provide access to management. Public surveys follow a separate flow without requiring visitor registration.',
    'The same dashboard rearranges filters, indicators and results into one column. Scroll the frame to inspect this full responsive capture.',
  ],
};
export const feedqrTourScenes: readonly TourScene[] = caseStudies.feedqr.screenshots.map((shot, index) => ({
  ...shot, description: { pt: descriptions.pt[index], en: descriptions.en[index] },
  responsive: shot.width < 700, centered: index === 2 || index === 3,
}));
export const tourCopy = {
  pt: {
    heading: 'Explore a interface', previous: 'Cena anterior', next: 'Próxima cena',
    enlarge: 'Ampliar imagem', original: 'Abrir imagem original', close: 'Fechar imagem',
    desktop: 'Captura desktop', responsive: 'Captura responsiva', inspect: 'Role dentro do quadro para inspecionar a captura.',
    loading: 'Preparando a próxima captura…', error: 'A imagem não carregou. Você pode abrir o arquivo original ou escolher outra cena.',
    hint: 'Use as setas quando o foco estiver nos controles. Escape fecha a ampliação.',
    count: 'de', fallback: 'Todas as telas', newTab: 'abre em nova aba',
  },
  en: {
    heading: 'Explore the interface', previous: 'Previous scene', next: 'Next scene',
    enlarge: 'Enlarge image', original: 'Open original image', close: 'Close image',
    desktop: 'Desktop capture', responsive: 'Responsive capture', inspect: 'Scroll inside the frame to inspect the capture.',
    loading: 'Preparing the next capture…', error: 'The image could not load. Open the original file or choose another scene.',
    hint: 'Use arrow keys while the controls are focused. Escape closes the enlarged view.',
    count: 'of', fallback: 'All screens', newTab: 'opens in a new tab',
  },
} as const;
