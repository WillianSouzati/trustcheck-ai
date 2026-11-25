import {
  AnalysisResult,
  ClassificationDistributionItem,
  DashboardKPIs,
  DemoPreset,
  IndicatorFrequencyItem,
} from '../types/analysis';

export const DEMO_DASHBOARD_KPIS: DashboardKPIs = {
  totalAnalyzed: 1284,
  noRelevantIndicators: 896,
  attentionRecommended: 274,
  priorityReview: 114,
};

export const DEMO_CLASSIFICATION_DISTRIBUTION: ClassificationDistributionItem[] = [
  {
    classification: 'Sem indicadores relevantes identificados',
    count: 896,
    percentage: 69.8,
  },
  {
    classification: 'Atenção recomendada',
    count: 274,
    percentage: 21.3,
  },
  {
    classification: 'Revisão prioritária',
    count: 114,
    percentage: 8.9,
  },
];

export const DEMO_INDICATOR_FREQUENCY: IndicatorFrequencyItem[] = [
  {
    type: 'Solicitação de contato fora da plataforma',
    shortLabel: 'Contato externo',
    count: 162,
  },
  {
    type: 'Informações incompletas ou contraditórias',
    shortLabel: 'Info. incompleta/contraditória',
    count: 138,
  },
  {
    type: 'Preço aparentemente incompatível com as informações fornecidas',
    shortLabel: 'Preço incompatível',
    count: 119,
  },
  {
    type: 'Solicitação de pagamento ou adiantamento',
    shortLabel: 'Pagamento antecipado',
    count: 94,
  },
  {
    type: 'Inconsistência entre título e descrição',
    shortLabel: 'Título × descrição',
    count: 87,
  },
  {
    type: 'Expressões de negociação fora do padrão',
    shortLabel: 'Negociação atípica',
    count: 68,
  },
];

export const DEMO_RECENT_ANALYSES: AnalysisResult[] = [
  {
    id: 'DEMO-2026-0841',
    listing: {
      title: 'iPhone 15 Pro 256GB Titânio Natural - Lacrado com Nota Fiscal',
      description:
        'Aparelho novo na caixa original, nunca ativado, acompanha nota fiscal em meu nome. Motivo da venda é viagem urgente amanhã cedo. Não faço entrega pelo site, chamar direto no WhatsApp (11) 99812-0000 para reservar com sinal de 30% via Pix antes de retirar.',
      price: 2150,
      category: 'Eletrônicos',
    },
    classification: 'Revisão prioritária',
    attentionLevelLabel: 'Nível elevado de atenção',
    humanReviewRecommendation:
      'Encaminhar para análise manual antes da publicação ou liberação de contato, verificando coerência de preço e regras de comunicação e pagamento da plataforma.',
    summary:
      'Foram identificados múltiplos sinais relevantes que merecem verificação humana, incluindo valor significativamente abaixo do padrão da categoria, direcionamento para contato externo e menção a adiantamento financeiro.',
    indicators: [
      {
        id: 'ind-1',
        title: 'Preço aparentemente incompatível com as informações fornecidas',
        severity: 'elevado',
        justification:
          'O valor anunciado (R$ 2.150,00) apresenta diferença expressiva em relação à faixa habitual para um aparelho descrito como novo e lacrado deste modelo.',
        evidence: 'iPhone 15 Pro 256GB Titânio Natural - Lacrado',
      },
      {
        id: 'ind-2',
        title: 'Solicitação de contato fora da plataforma',
        severity: 'elevado',
        justification:
          'O texto convida o interessado a continuar a conversa por canal externo, o que reduz a rastreabilidade das interações pela moderação.',
        evidence: 'chamar direto no WhatsApp (11) 99812-0000',
      },
      {
        id: 'ind-3',
        title: 'Solicitação de pagamento ou adiantamento',
        severity: 'elevado',
        justification:
          'Há pedido explícito de transferência antecipada antes da conferência presencial ou mediação da plataforma.',
        evidence: 'reservar com sinal de 30% via Pix antes de retirar',
      },
      {
        id: 'ind-4',
        title: 'Expressões de negociação fora do padrão',
        severity: 'moderado',
        justification:
          'O anúncio utiliza argumento de urgência combinado com recusa do fluxo padrão da plataforma.',
        evidence: 'viagem urgente amanhã cedo. Não faço entrega pelo site',
      },
    ],
    analyzedAt: '2026-11-24T15:42:00-03:00',
    sourceMode: 'demonstrativo',
  },
  {
    id: 'DEMO-2026-0840',
    listing: {
      title: 'Bicicleta Caloi Explorer Sport Aro 29 Tamanho M',
      description:
        'Bicicleta em ótimo estado de conservação, utilizada apenas aos finais de semana em parques. Possui freios a disco hidráulicos, câmbio Shimano de 24 marchas e suspensão dianteira revisada em outubro. Acompanha suporte de garrafa e capacete simples. Entrega e pagamento realizados exclusivamente pela plataforma ou retirada em mãos em local público.',
      price: 2350,
      category: 'Esportes e lazer',
    },
    classification: 'Sem indicadores relevantes identificados',
    attentionLevelLabel: 'Sem sinais relevantes de atenção',
    humanReviewRecommendation:
      'Não há necessidade de revisão manual prioritária. O anúncio pode seguir o fluxo padrão de publicação da plataforma.',
    summary:
      'As informações apresentadas mostram coerência entre título, descrição, categoria e faixa de valor, sem pedidos de pagamento antecipado ou desvio de canal.',
    indicators: [],
    analyzedAt: '2026-11-24T15:18:00-03:00',
    sourceMode: 'demonstrativo',
  },
  {
    id: 'DEMO-2026-0839',
    listing: {
      title: 'Sofá Retrátil 3 Lugares Linho Cinza Novo',
      description:
        'Sofá usado por cerca de 2 anos em sala sem animais de estimação. Tecido em bom estado, apenas com leve desgaste no braço esquerdo. Dimensões: 2,10m de largura. Retirada por conta do comprador no bairro Pinheiros. Mais fotos e combinação de horário pelo chat oficial ou no insta @loja_exemplo.',
      price: 1180,
      category: 'Casa e decoração',
    },
    classification: 'Atenção recomendada',
    attentionLevelLabel: 'Nível moderado de atenção',
    humanReviewRecommendation:
      'Recomenda-se revisão simples ou solicitação de ajuste de texto ao anunciante para alinhar o estado de conservação no título e remover referência a rede social externa.',
    summary:
      'Foram observados pontos que justificam conferência moderada: divergência entre o estado informado no título e na descrição, além de menção a perfil externo.',
    indicators: [
      {
        id: 'ind-5',
        title: 'Inconsistência entre título e descrição',
        severity: 'moderado',
        justification:
          'O título descreve o item como "Novo", enquanto o corpo do anúncio informa uso prévio de aproximadamente dois anos e desgaste visível.',
        evidence: 'Sofá Retrátil 3 Lugares Linho Cinza Novo',
      },
      {
        id: 'ind-6',
        title: 'Solicitação de contato fora da plataforma',
        severity: 'baixo',
        justification:
          'Embora mencione o chat oficial, o texto também disponibiliza perfil em rede social externa para combinar detalhes.',
        evidence: 'ou no insta @loja_exemplo',
      },
    ],
    analyzedAt: '2026-11-24T14:50:00-03:00',
    sourceMode: 'demonstrativo',
  },
  {
    id: 'DEMO-2026-0838',
    listing: {
      title: 'Honda Civic EXL 2.0 Automático 2021 Completo',
      description:
        'Veículo de único dono, todas as revisões realizadas em concessionária autorizada com manual e chave reserva. IPVA quitado, pneus novos e laudo cautelar aprovado. Disponível para vistoria presencial em horário comercial. Documentação pronta para transferência imediata em cartório após confirmação.',
      price: 114900,
      category: 'Veículos',
    },
    classification: 'Sem indicadores relevantes identificados',
    attentionLevelLabel: 'Sem sinais relevantes de atenção',
    humanReviewRecommendation:
      'Fluxo regular aprovado. Os dados de descrição, histórico de manutenção e valor estão compatíveis com o segmento.',
    summary:
      'Anúncio bem estruturado, com informações verificáveis mencionadas para inspeção presencial e valor alinhado ao mercado da categoria.',
    indicators: [],
    analyzedAt: '2026-11-24T13:25:00-03:00',
    sourceMode: 'demonstrativo',
  },
  {
    id: 'DEMO-2026-0837',
    listing: {
      title: 'Apartamento 2 Quartos Mobiliado Próximo ao Metrô',
      description:
        'Locação direta sem burocracia. Apartamento reformado com varanda e vaga de garagem. Como há muita procura, exigimos depósito de caução adiantado para garantir a visita e entrega das chaves no mesmo dia. Tratar somente fora do aplicativo pelo telefone indicado no texto: 11 98765-4321.',
      price: 1200,
      category: 'Imóveis',
    },
    classification: 'Revisão prioritária',
    attentionLevelLabel: 'Nível elevado de atenção',
    humanReviewRecommendation:
      'Priorizar revisão humana antes de manter o anúncio visível, verificando a exigência de caução prévia à visita e a instrução de contato externo exclusivo.',
    summary:
      'O anúncio reúne combinação de valor atípico para as características descritas, solicitação de adiantamento financeiro antes da visita e pedido de exclusividade de contato externo.',
    indicators: [
      {
        id: 'ind-7',
        title: 'Solicitação de pagamento ou adiantamento',
        severity: 'elevado',
        justification:
          'Solicita valor adiantado antes mesmo da realização da visita presencial ao imóvel.',
        evidence: 'exigimos depósito de caução adiantado para garantir a visita',
      },
      {
        id: 'ind-8',
        title: 'Solicitação de contato fora da plataforma',
        severity: 'elevado',
        justification:
          'Orienta explicitamente os interessados a não utilizarem os canais internos da plataforma.',
        evidence: 'Tratar somente fora do aplicativo pelo telefone indicado',
      },
      {
        id: 'ind-9',
        title: 'Preço aparentemente incompatível com as informações fornecidas',
        severity: 'moderado',
        justification:
          'O valor informado destoa da média observada para imóveis mobiliados com dois dormitórios e vaga próximos ao metrô.',
        evidence: 'Apartamento 2 Quartos Mobiliado Próximo ao Metrô',
      },
    ],
    analyzedAt: '2026-11-24T11:40:00-03:00',
    sourceMode: 'demonstrativo',
  },
  {
    id: 'DEMO-2026-0836',
    listing: {
      title: 'Jaqueta Corta-Vento Original Tamanho G',
      description:
        'Jaqueta importada primeira linha premium, nunca usada, com etiquetas. Não sei informar o tecido exato nem medidas, pois ganhei de presente. Envio pelos Correios após confirmação.',
      price: 290,
      category: 'Moda e acessórios',
    },
    classification: 'Atenção recomendada',
    attentionLevelLabel: 'Nível moderado de atenção',
    humanReviewRecommendation:
      'Revisar clareza sobre autenticidade declarada e orientar o anunciante a incluir especificações objetivas do produto.',
    summary:
      'Há possível contradição entre o termo "Original" no título e "primeira linha" na descrição, além de ausência de especificações básicas de material e medidas.',
    indicators: [
      {
        id: 'ind-10',
        title: 'Informações incompletas ou contraditórias',
        severity: 'moderado',
        justification:
          'A descrição utiliza a expressão "primeira linha", que frequentemente contradiz a declaração de produto "Original" presente no título, além de omitir medidas básicas.',
        evidence: 'importada primeira linha premium',
      },
    ],
    analyzedAt: '2026-11-24T10:12:00-03:00',
    sourceMode: 'demonstrativo',
  },
];

export const DEMO_FORM_PRESETS: DemoPreset[] = [
  {
    id: 'preset-clean',
    label: 'Exemplo sem indicadores',
    expectedClassification: 'Sem indicadores relevantes identificados',
    input: {
      title: 'Monitor Dell UltraSharp 27" 4K USB-C U2723QE',
      description:
        'Monitor comprado há 10 meses, em perfeito estado de funcionamento, sem dead pixels ou riscos na tela. Acompanha caixa original, cabo de energia, cabo USB-C e nota fiscal. Venda apenas pela plataforma com envio segurado ou retirada presencial em horário comercial.',
      priceRaw: '2890,00',
      category: 'Eletrônicos',
    },
  },
  {
    id: 'preset-attention',
    label: 'Exemplo atenção recomendada',
    expectedClassification: 'Atenção recomendada',
    input: {
      title: 'Notebook MacBook Air M2 Novo Lacrado',
      description:
        'Notebook usado por 6 meses em escritório, bateria com 94% de saúde e pequeno detalhe estético na tampa inferior. Acompanha carregador original. Caso prefira agilizar fotos adicionais, podemos conversar pelo Telegram @vendedor_demo.',
      priceRaw: '5600,00',
      category: 'Eletrônicos',
    },
  },
  {
    id: 'preset-priority',
    label: 'Exemplo revisão prioritária',
    expectedClassification: 'Revisão prioritária',
    input: {
      title: 'PlayStation 5 Slim 1TB Edição Disco Novo',
      description:
        'Console lacrado com dois controles e três jogos. Estou vendendo com valor reduzido por motivo de mudança urgente esta semana. Não aceito pagamento pela plataforma. Interessados chamar no WhatsApp (21) 99900-1122 para enviar sinal de reserva via Pix e garantir o envio hoje.',
      priceRaw: '1150,00',
      category: 'Eletrônicos',
    },
  },
];
