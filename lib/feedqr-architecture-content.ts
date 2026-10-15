import type { Locale } from './content';

type Bilingual = Record<Locale, string>;
type FlowStep = { id: string; title: Bilingual; technology: string; heading: Bilingual; description: Bilingual; details: Record<Locale, readonly string[]> };
const text = (pt: string, en: string): Bilingual => ({ pt, en });

export const architectureCopy = {
  pt: {
    title: 'O caminho de uma resposta.', intro: 'Uma avaliação, do envio à confirmação.',
    diagram: 'Fluxo de envio de uma resposta pública', select: 'Selecione uma etapa ou use as setas quando um controle estiver em foco.',
    play: 'Reproduzir percurso', stop: 'Interromper percurso', complete: 'Percurso concluído.',
    showAll: 'Ver sequência completa', hideAll: 'Voltar à etapa selecionada',
    visual: 'Reprodução explicativa, sem enviar dados.', request: 'Envio', response: 'Retorno pela API',
    step: 'Etapa', of: 'de', fallback: 'Sequência completa',
  },
  en: {
    title: 'The path of a response.', intro: 'One review, from submission to confirmation.',
    diagram: 'Public survey response submission flow', select: 'Select a step or use arrow keys while a control is focused.',
    play: 'Play the flow', stop: 'Stop the flow', complete: 'Flow complete.',
    showAll: 'View the full sequence', hideAll: 'Return to the selected step',
    visual: 'Explanatory playback; no data is submitted.', request: 'Submission', response: 'Return through the API',
    step: 'Step', of: 'of', fallback: 'Full sequence',
  },
} as const;

// Source evidence, route names and implementation details are retained in
// docs/FEEDQR-ARCHITECTURE.md. This remains the same verified operation.
export const architectureSteps: readonly FlowStep[] = [
  {
    id: 'interface', title: text('Interface pública', 'Public interface'), technology: 'Vue 3',
    heading: text('O visitante envia sua avaliação.', 'The visitor submits their feedback.'),
    description: text('A pesquisa abre no celular, sem cadastro. O visitante responde às perguntas e envia sua avaliação.', 'The survey opens on a phone without an account. Visitors answer the questions and submit their feedback.'),
    details: {
      pt: ['A interface confere as respostas antes do envio.', 'Se a conexão falhar, a tentativa fica preservada para tentar novamente.'],
      en: ['The interface checks answers before submission.', 'If the connection fails, the attempt is preserved for a retry.'],
    },
  },
  {
    id: 'request', title: text('Chegada à API', 'Reaching the API'), technology: 'Node.js · Express',
    heading: text('A avaliação chega ao servidor.', 'The feedback reaches the server.'),
    description: text('A interface envia as respostas à API, que conecta a pesquisa pública ao processamento e à gravação dos dados.', 'The interface sends answers to the API, connecting the public survey to processing and data storage.'),
    details: {
      pt: ['Responder à pesquisa não exige login.', 'O servidor limita a frequência de envios.'],
      en: ['Answering the survey requires no sign-in.', 'The server limits submission frequency.'],
    },
  },
  {
    id: 'processing', title: text('Validação', 'Validation'), technology: 'Zod',
    heading: text('As respostas precisam fazer sentido.', 'The answers must be valid.'),
    description: text('O sistema verifica se a pesquisa está ativa, se as respostas pertencem às perguntas e se os campos obrigatórios foram preenchidos.', 'The system checks that the survey is active, answers belong to its questions and required fields are filled in.'),
    details: {
      pt: ['Cada tipo de pergunta aceita valores específicos.', 'Informações inválidas são recusadas antes de registrar a avaliação.'],
      en: ['Each question type accepts specific values.', 'Invalid information is rejected before feedback is recorded.'],
    },
  },
  {
    id: 'persistence', title: text('Gravação', 'Saving'), technology: 'Prisma · MongoDB',
    heading: text('Os dados são registrados em conjunto.', 'The data is saved together.'),
    description: text('A avaliação fica vinculada à pesquisa e ao ponto de coleta, quando utilizado. A gravação em conjunto evita registros parciais se essa operação falhar.', 'Feedback is linked to the survey and collection point, when used. Saving together prevents partial records if that operation fails.'),
    details: {
      pt: ['A mesma tentativa pode ser confirmada sem criar uma nova avaliação.', 'A confirmação só segue adiante depois que a gravação termina.'],
      en: ['The same attempt can be confirmed without creating another review.', 'Confirmation proceeds only after saving has finished.'],
    },
  },
  {
    id: 'confirmation', title: text('Confirmação', 'Confirmation'), technology: 'API → Vue',
    heading: text('A interface confirma o resultado.', 'The interface confirms the result.'),
    description: text('A API retorna a confirmação e a interface mostra o sucesso. Se o resultado for incerto, ela permite tentar novamente sem presumir que os dados foram gravados.', 'The API returns confirmation and the interface shows success. If the outcome is uncertain, it allows a retry without assuming the data was saved.'),
    details: {
      pt: ['O sucesso depende de uma confirmação válida do servidor.'],
      en: ['Success depends on a valid server confirmation.'],
    },
  },
];
