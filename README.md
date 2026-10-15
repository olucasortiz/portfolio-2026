# Lucas Ortiz — Portfólio

Portfólio bilíngue de desenvolvimento Full Stack, construído com Next.js App Router. A apresentação combina tipografia editorial, fundo Graphite e destaques Electric Lime no hero, nos projetos e nas seções interativas. As rotas em português (`/pt`) e inglês (`/en`) compartilham a mesma estrutura.

Este repositório contém o portfólio. FeedQR e Lion Fitness são projetos apresentados nos estudos de caso; seus backends e bancos de dados não fazem parte desta aplicação.

## Experiência atual

- **Hero LUCAS / ORTIZ:** entrada tipográfica, movimento durante a rolagem e resposta individual das letras à proximidade do ponteiro. A interação de ponteiro é restrita a dispositivos com hover e ponteiro preciso.
- **Projetos na homepage:** apresentações independentes de FeedQR e Lion Fitness, com navegação para os respectivos estudos de caso.
- **Tecnologias:** repertório geral organizado em Frontend, Backend, Bancos de dados & Dados e Cloud & DevOps, sem percentuais de habilidade ou associações obrigatórias a projetos.
- **Experiência profissional:** seleção interativa de Lion Fitness, Colégio Maximus e INSS; no mobile, um acordeão mantém uma experiência expandida por vez. Períodos não confirmados continuam identificados como pendentes.
- **Estudos de caso:** conteúdo factual, navegação por capítulos, links reais quando verificados e mídia original quando disponível.

### FeedQR: quatro experiências

1. **Descobrir:** capa cinematográfica, explicação curta e ações do projeto.
2. **Explorar:** tour manual de cinco capturas reais — painel, pesquisas, criação, login e painel mobile — com acesso às imagens completas.
3. **Por dentro:** diagrama interativo do envio de uma avaliação, da interface pública à validação, persistência e confirmação. A reprodução ilustra o fluxo; não envia respostas à API.
4. **Continuar:** convite editorial para avaliar o portfólio, QR/link da pesquisa quando configurada e acesso ao sistema real, código e documentação.

O diagrama representa a implementação local auditada com Vue, Express, Zod, Prisma e MongoDB. Referências detalhadas de código permanecem na documentação técnica, separadas da leitura principal do case. O README público vinculado no case descreve uma versão anterior com SQLite.

O tour e o diagrama possuem alternativas sem JavaScript. **Explorar sistema / Explore the app** abre o frontend real confirmado: [FeedQR](https://qrcode-avaliacao.pages.dev/app). A gestão exige autenticação; o visitante pode precisar criar uma conta. Não há conta demo pré-configurada confirmada nem painel administrativo incorporado.

A avaliação do portfólio é uma integração independente, habilitada localmente na TASK 18.1 com a pesquisa real publicada e confirmada pelo proprietário. O QR é gerado localmente e aponta para a mesma URL completa do botão, incluindo `origem`; as respostas acontecem exclusivamente no FeedQR. Ausência de configuração em outro ambiente mantém o estado editorial indisponível.

Lion Fitness apresenta quatro atos — visão, operação, treino e relatórios — com capturas reais sanitizadas e prévias dos relatórios sem dados pessoais. O CTA **Acessar sistema / Open the application** abre a [aplicação Lion Fitness](https://lionfitness-sa.duckdns.org/), cuja página de login HTTPS foi verificada no navegador. O acesso exige uma conta; não há credenciais demo fornecidas nem validação de pagamentos em produção. Os PDFs originais não são publicados.

## Stack do portfólio

| Camada | Tecnologias |
| --- | --- |
| Aplicação | Next.js 15, React 19, TypeScript |
| Estilos | Tailwind CSS 4, CSS global e CSS Modules |
| Movimento | GSAP e ScrollTrigger |
| Ícones | Lucide React |
| Verificação | TypeScript, ESLint e build do Next.js |

As versões e dependências estão em [package.json](package.json). O portfólio não possui backend separado e não requer conexão com o banco dos projetos para executar.

## Executar localmente

Com Node.js e npm instalados, execute na raiz do projeto:

```bash
npm ci
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000), que redireciona para `/pt`. A porta padrão de desenvolvimento é **3000**. Para escolher outra porta, pare o servidor atual antes de executar, por exemplo:

```bash
npm run dev -- --port 3002
```

A configuração opcional da demonstração FeedQR não é necessária para iniciar o portfólio.

### Desenvolvimento, build e carregamento de CSS

Use sempre `npm run dev`. O comando passa por [scripts/dev.mjs](scripts/dev.mjs), que mantém uma trava exclusiva por diretório do projeto. Uma segunda instância de desenvolvimento é rejeitada, mesmo que use outra porta. A porta é explícita: se estiver ocupada, o servidor não muda silenciosamente para 3001. A configuração rejeita chamadas diretas a `next dev` e `npx next dev`.

Os arquivos gerados ficam separados:

- `.next-dev`: desenvolvimento, CSS e HMR.
- `.next`: build e servidor de produção.

Assim, um build de produção não substitui os arquivos usados pelo servidor de desenvolvimento. Encerre o terminal correspondente com `Ctrl+C` antes de reiniciar; a trava é liberada quando o processo termina.

Se os estilos deixarem de carregar, confira a porta acessada e os processos associados a este projeto. Antes de limpar qualquer diretório gerado, pare os servidores que o utilizam. Depois, inicie uma única instância com `npm run dev` e recarregue o navegador. Não encerre processos de outros projetos nem apague o cache enquanto o servidor correspondente estiver ativo.

### Prévia de produção

```bash
npm run build
npm run start -- --port 3011
```

A prévia fica em [http://localhost:3011](http://localhost:3011), separada do desenvolvimento na porta 3000.

## Rotas

| Conteúdo | Português | Inglês |
| --- | --- | --- |
| Homepage | `/pt` | `/en` |
| Projetos | `/pt/projetos` | `/en/projetos` |
| FeedQR | `/pt/projetos/feedqr` | `/en/projetos/feedqr` |
| Lion Fitness | `/pt/projetos/lion-fitness` | `/en/projetos/lion-fitness` |
| Sobre | `/pt/sobre` | `/en/sobre` |
| Experiência | `/pt/experiencia` | `/en/experiencia` |
| Contato | `/pt#contato` | `/en#contato` |

## Configuração da pesquisa pública FeedQR

As variáveis opcionais estão em [.env.example](.env.example). Copie o arquivo para `.env.local` somente se precisar configurar essa integração:

```dotenv
NEXT_PUBLIC_FEEDQR_SURVEY_URL=<URL-real-completa-da-pesquisa-incluindo-origem>
FEEDQR_SURVEY_VERIFIED=1
```

`NEXT_PUBLIC_FEEDQR_SURVEY_URL` deve apontar para a pesquisa pública real em HTTPS no host **qrcode-avaliacao.pages.dev** (`/p/:slug`), preservando `origem` integralmente. O validador rejeita outros hosts, rotas administrativas, credenciais embutidas e parâmetros não permitidos. Defina `FEEDQR_SURVEY_VERIFIED=1` para uma pesquisa publicada e confirmada pelo proprietário. A variável antiga `FEEDQR_PUBLIC_SURVEY_URL` permanece como fallback somente se a nova estiver ausente; uma nova configuração inválida não usa silenciosamente o fallback. O link do sistema é independente dessas variáveis. Não colocar JWT, senha ou credenciais no portfólio.

Os estudos de caso são gerados no build: alterações dessas variáveis em produção exigem novo build e publicação. **Antes do build na futura hospedagem**, configurar ambas no painel de Environment Variables, no escopo Production (e Preview, se usado), copiando o valor completo de `NEXT_PUBLIC_FEEDQR_SURVEY_URL` da `.env.local`. Esse arquivo local é ignorado pelo Git e não vai automaticamente para o provedor. O procedimento e as verificações estão em [docs/FEEDQR-DEMO.md](docs/FEEDQR-DEMO.md). Não são necessárias credenciais administrativas no portfólio.

## Organização do código

```text
app/                  Layouts, CSS global e rotas PT/EN
components/           Hero, projetos, tecnologias, timeline e experiências dos cases
lib/                  Conteúdo localizado, dados, estado e utilitários de movimento
public/projects/      Capturas reais utilizadas no portfólio
scripts/dev.mjs       Inicialização protegida do servidor de desenvolvimento
docs/                 Direção visual, conteúdo verificado, auditorias e notas de validação
```

## Verificação

```bash
npm run typecheck
npm run test:feedqr
npm run lint -- --ignore-pattern ".next/**" --ignore-pattern ".next-dev/**" --ignore-pattern "next-env.d.ts"
npm run build
```

O comando de lint acima exclui os arquivos gerados pelo Next.js. Os resultados e limites de validação da implementação mais recente estão em [docs/TASK16-NOTES.md](docs/TASK16-NOTES.md).

A revisão no navegador deve incluir PT/EN, desktop e mobile, navegação por teclado, movimento reduzido, carregamento dos estilos, seleção da timeline, tour e arquitetura. Os testes programáticos não substituem essa revisão nem a aprovação visual do usuário.

## Documentação e conteúdo

- [AGENTS.md](AGENTS.md): acordo de trabalho e limites de edição.
- [docs/DESIGN.md](docs/DESIGN.md): direção de arte e comportamento visual, com histórico dos refinamentos.
- [docs/CONTENT.md](docs/CONTENT.md): fonte de informações profissionais e pendências.
- [docs/CASE-STUDY-AUDIT.md](docs/CASE-STUDY-AUDIT.md): evidências dos projetos e limites da verificação.
- [docs/FEEDQR-ARCHITECTURE.md](docs/FEEDQR-ARCHITECTURE.md): fluxo real, referências técnicas e comportamento do diagrama.
- [docs/FEEDQR-DEMO.md](docs/FEEDQR-DEMO.md): configuração e critérios para disponibilizar a pesquisa pública.
- [docs/TASK19.2-NOTES.md](docs/TASK19.2-NOTES.md): ajustes de legibilidade, acesso público e verificações mais recentes.

## Pendências para publicação

- Validar os fluxos autenticados do Lion Fitness e confirmar a documentação pública desse projeto.
- Links públicos de contato e arquivo de currículo.
- Datas exatas de Lion Fitness e Colégio Maximus.
- Configurar as variáveis da pesquisa real no ambiente de build da futura hospedagem do portfólio; a integração local já está ativa.
- Revisão visual dos refinamentos recentes em desktop/mobile e confirmação de que as capturas podem ser publicadas.

Não apresentar essas pendências como concluídas, nem acrescentar métricas, resultados profissionais, links ou imagens sem evidência.
