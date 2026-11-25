import {
  AnalysisResult,
  AttentionSeverity,
  ClassificationLevel,
  IAnalysisService,
  ListingCategory,
  ListingInput,
  RiskIndicator,
} from '../types/analysis';
import { formatCurrencyBRL } from '../utils/formatters';

interface CategoryBaseline {
  typicalLowThreshold: number;
  highValueKeywords: { pattern: RegExp; minExpectedPrice: number; label: string }[];
}

const CATEGORY_PRICE_BASELINES: Record<ListingCategory, CategoryBaseline> = {
  Eletrônicos: {
    typicalLowThreshold: 40,
    highValueKeywords: [
      { pattern: /\biphone\s*(14|15|16)\b/i, minExpectedPrice: 2800, label: 'smartphone recente desta linha' },
      { pattern: /\bmacbook\b/i, minExpectedPrice: 3800, label: 'notebook desta linha' },
      { pattern: /\b(ps5|playstation\s*5)\b/i, minExpectedPrice: 2400, label: 'console de geração atual' },
      { pattern: /\brtx\s*(4070|4080|4090|5080|5090)\b/i, minExpectedPrice: 2800, label: 'placa de vídeo de alto desempenho' },
      { pattern: /\bnotebook\b/i, minExpectedPrice: 700, label: 'notebook funcional' },
    ],
  },
  Veículos: {
    typicalLowThreshold: 3500,
    highValueKeywords: [
      { pattern: /\b(civic|corolla|onix|hb20|hr-v|compass|hilux|jeep|toyota|honda)\b/i, minExpectedPrice: 25000, label: 'automóvel desta categoria' },
      { pattern: /\b(moto|cb\s*500|xj6|hornet|fz25|lander|cg\s*160)\b/i, minExpectedPrice: 6500, label: 'motocicleta funcional' },
    ],
  },
  Imóveis: {
    typicalLowThreshold: 600,
    highValueKeywords: [
      { pattern: /\b(apartamento|casa|sobrado|cobertura|terreno)\b.*\b(venda|vendo|escritura)\b/i, minExpectedPrice: 60000, label: 'imóvel anunciado para venda' },
      { pattern: /\b(mobiliado|2\s*quartos|3\s*quartos|suíte|garagem)\b/i, minExpectedPrice: 1300, label: 'imóvel com as características descritas' },
    ],
  },
  'Moda e acessórios': {
    typicalLowThreshold: 20,
    highValueKeywords: [
      { pattern: /\b(rolex|omega|tag\s*heuer|louis\s*vuitton|gucci|prada)\b/i, minExpectedPrice: 1500, label: 'artigo de luxo declarado' },
    ],
  },
  'Casa e decoração': {
    typicalLowThreshold: 25,
    highValueKeywords: [
      { pattern: /\b(geladeira|fogão|máquina de lavar|lava e seca|ar[- ]condicionado)\b/i, minExpectedPrice: 450, label: 'eletrodoméstico desta linha' },
    ],
  },
  'Esportes e lazer': {
    typicalLowThreshold: 25,
    highValueKeywords: [
      { pattern: /\b(bicicleta\s*(elétrica|carbono)|scott|specialized|cannondale)\b/i, minExpectedPrice: 2200, label: 'equipamento esportivo especializado' },
    ],
  },
  Outros: {
    typicalLowThreshold: 15,
    highValueKeywords: [],
  },
};

function findExcerpt(text: string, regex: RegExp): string | undefined {
  const match = text.match(regex);
  if (!match || match.index === undefined) return undefined;

  const start = Math.max(0, match.index - 22);
  const end = Math.min(text.length, match.index + match[0].length + 28);
  let snippet = text.slice(start, end).trim();

  if (start > 0) snippet = `...${snippet}`;
  if (end < text.length) snippet = `${snippet}...`;
  return snippet;
}

/**
 * Implementação demonstrativa local (sem chamadas externas ou chaves de API).
 * Simula a análise de texto para prototipagem da interface e dos fluxos de revisão.
 */
export class DemoAnalysisService implements IAnalysisService {
  async analyzeListing(input: ListingInput): Promise<AnalysisResult> {
    // Simula latência de processamento para demonstrar o estado de carregamento na UI
    await new Promise((resolve) => setTimeout(resolve, 950));

    const title = input.title.trim();
    const description = input.description.trim();
    const combinedText = `${title}\n${description}`;
    const indicators: RiskIndicator[] = [];

    // 1. Solicitação de contato fora da plataforma
    const externalContactRegex =
      /(whatsapp|wpp|zap|telegram|instagram|insta|@\w{3,}|fora\s+d[oa]\s+(app|aplicativo|site|plataforma)|chama\s+no\s+(número|numero|pv|direct)|(\(?\d{2}\)?\s*9?\d{4}[-.\s]?\d{4}))/i;
    const contactMatch = combinedText.match(externalContactRegex);
    if (contactMatch) {
      const onlyPhoneOrSocial = /@\w{3,}|insta|instagram/i.test(contactMatch[0]);
      const strictAvoidPlatform = /fora\s+d[oa]\s+(app|aplicativo|site|plataforma)|somente\s+(pelo|no)\s+(whats|zap|telegram)/i.test(
        combinedText
      );
      indicators.push({
        id: `ind-contact-${Date.now()}`,
        type: 'Solicitação de contato fora da plataforma',
        severity: strictAvoidPlatform ? 'elevado' : onlyPhoneOrSocial ? 'moderado' : 'elevado',
        justification:
          'O anúncio direciona a conversa para meios externos ao ambiente da plataforma, o que dificulta a rastreabilidade e a mediação em caso de divergência.',
        excerpt: findExcerpt(description, externalContactRegex) ?? findExcerpt(title, externalContactRegex),
        field: description.match(externalContactRegex) ? 'description' : 'title',
      });
    }

    // 2. Solicitação de pagamento ou adiantamento
    const prepaymentRegex =
      /(sinal\s*(de\s*reserva|via\s*pix|antecipado)?|adiantamento|pix\s*(antecipado|antes)|dep[óo]sito\s*(pr[ée]vio|antecipado|antes)|cau[çc][ãa]o\s*(antecipad|para\s*visita)|taxa\s*de\s*(reserva|entrega|envio)|n[ãa]o\s*aceito\s*(pagamento\s*)?(pela|na)\s*plataforma|sem\s*intermedia[çc][ãa]o)/i;
    if (prepaymentRegex.test(combinedText)) {
      indicators.push({
        id: `ind-payment-${Date.now()}`,
        type: 'Solicitação de pagamento ou adiantamento',
        severity: 'elevado',
        justification:
          'Foram identificadas menções a transferência prévia, sinal ou recusa dos meios de pagamento protegidos da plataforma antes da entrega ou conferência.',
        excerpt: findExcerpt(description, prepaymentRegex) ?? findExcerpt(title, prepaymentRegex),
        field: 'description',
      });
    }

    // 3. Inconsistência entre título e descrição
    const titleSaysNew = /\b(novo|nov[íi]ssimo|lacrado|na\s+caixa)\b/i.test(title);
    const descSaysUsedOrDefect =
      /\b(usado|usada|meses\s+de\s+uso|anos\s+de\s+uso|desgaste|detalhe\s+est[ée]tico|para\s+pe[çc]as|com\s+defeito|n[ãa]o\s+liga|quebrad[oa])\b/i.test(
        description
      );
    const titleSaysOriginal = /\boriginal\b/i.test(title);
    const descSaysReplica = /\b(primeira\s+linha|r[ée]plica|similar|1ª\s+linha|aaa\+?)\b/i.test(description);

    if (titleSaysNew && descSaysUsedOrDefect) {
      indicators.push({
        id: `ind-inconsistency-cond-${Date.now()}`,
        type: 'Inconsistência entre título e descrição',
        severity: 'moderado',
        justification:
          'O título indica condição de item novo ou lacrado, porém a descrição relata uso prévio, desgaste ou necessidade de reparo.',
        excerpt: findExcerpt(
          description,
          /\b(usado|usada|meses\s+de\s+uso|anos\s+de\s+uso|desgaste|detalhe\s+est[ée]tico|para\s+pe[çc]as|com\s+defeito|n[ãa]o\s+liga|quebrad[oa])\b/i
        ),
        field: 'description',
      });
    } else if (titleSaysOriginal && descSaysReplica) {
      indicators.push({
        id: `ind-inconsistency-auth-${Date.now()}`,
        type: 'Inconsistência entre título e descrição',
        severity: 'elevado',
        justification:
          'O título classifica o produto como original, enquanto a descrição utiliza termos associados a itens similares ou de "primeira linha".',
        excerpt: findExcerpt(description, /\b(primeira\s+linha|r[ée]plica|similar|1ª\s+linha|aaa\+?)\b/i),
        field: 'description',
      });
    }

    // 4. Preço aparentemente incompatível
    const baseline = CATEGORY_PRICE_BASELINES[input.category];
    const matchedHighValue = baseline.highValueKeywords.find((rule) => rule.pattern.test(combinedText));
    const isDefectOrParts = /\b(para\s+pe[çc]as|sucata|carca[çc]a|com\s+defeito|n[ãa]o\s+funciona)\b/i.test(combinedText);

    if (matchedHighValue && !isDefectOrParts && input.price < matchedHighValue.minExpectedPrice) {
      const ratio = input.price / matchedHighValue.minExpectedPrice;
      const severity: AttentionSeverity = ratio < 0.6 ? 'elevado' : 'moderado';
      indicators.push({
        id: `ind-price-high-${Date.now()}`,
        type: 'Preço aparentemente incompatível com as informações fornecidas',
        severity,
        justification: `O preço informado (${formatCurrencyBRL(input.price)}) está expressivamente abaixo da faixa usual para um ${matchedHighValue.label} nas condições descritas.`,
        excerpt: findExcerpt(title, matchedHighValue.pattern) ?? title,
        field: 'price',
      });
    } else if (!isDefectOrParts && input.price < baseline.typicalLowThreshold) {
      indicators.push({
        id: `ind-price-low-${Date.now()}`,
        type: 'Preço aparentemente incompatível com as informações fornecidas',
        severity: 'moderado',
        justification: `O valor informado (${formatCurrencyBRL(input.price)}) é muito reduzido para a categoria "${input.category}", podendo indicar preço simbólico ou erro de digitação.`,
        excerpt: `Preço anunciado: ${formatCurrencyBRL(input.price)}`,
        field: 'price',
      });
    }

    // 5. Expressões de negociação fora do padrão
    const unusualNegotiationRegex =
      /(urgente\s*(hoje|essa\s*semana|amanh[ãa])?|motivo\s*(de\s*)?(viagem|mudan[çc]a)\s*(urgente|r[áa]pid[oa])?|s[óo]\s*hoje|sem\s*burocracia|sem\s*perguntas|n[ãa]o\s*fa[çc]o\s*(entrega|envio)\s*pelo\s*site)/i;
    if (unusualNegotiationRegex.test(combinedText)) {
      indicators.push({
        id: `ind-negotiation-${Date.now()}`,
        type: 'Expressões de negociação fora do padrão',
        severity: 'moderado',
        justification:
          'O texto emprega apelos de urgência imediata ou restrições incomuns de negociação que merecem conferência contextual pela equipe de moderação.',
        excerpt: findExcerpt(description, unusualNegotiationRegex) ?? findExcerpt(title, unusualNegotiationRegex),
        field: 'description',
      });
    }

    // 6. Informações incompletas ou contraditórias
    const incompleteRegex =
      /(n[ãa]o\s*sei\s*(informar|detalhes|o\s*modelo)|sem\s*garantia\s*de\s*funcionamento|fotos\s*ilustrativas|chamar\s*para\s*saber\s*o\s*pre[çc]o|valor\s*real\s*no\s*chat)/i;
    const isVeryShortDescription = description.length < 45;
    if (incompleteRegex.test(combinedText) || (isVeryShortDescription && indicators.length === 0)) {
      indicators.push({
        id: `ind-incomplete-${Date.now()}`,
        type: 'Informações incompletas ou contraditórias',
        severity: 'baixo',
        justification: isVeryShortDescription
          ? 'A descrição apresenta poucos detalhes objetivos sobre estado de conservação, especificações ou condições de entrega.'
          : 'O anúncio contém declarações vagas, imagens apenas ilustrativas ou ausência de dados essenciais sobre o item.',
        excerpt:
          findExcerpt(description, incompleteRegex) ??
          (isVeryShortDescription ? description : undefined),
        field: 'description',
      });
    }

    // Classificação geral não acusatória baseada na soma e severidade dos sinais
    const highSeverityCount = indicators.filter((i) => i.severity === 'elevado').length;
    const moderateSeverityCount = indicators.filter((i) => i.severity === 'moderado').length;

    let classification: ClassificationLevel = 'Sem indicadores relevantes identificados';
    let attentionLevelLabel = 'Sem sinais relevantes de atenção';
    let humanReviewRecommendation =
      'Não foram detectados sinais relevantes que exijam intervenção imediata. O anúncio pode seguir o fluxo padrão da plataforma.';
    let summary =
      'A análise textual não encontrou inconsistências relevantes entre título, descrição, categoria e faixa de valor, nem solicitações atípicas de contato ou pagamento.';

    if (highSeverityCount >= 2 || (highSeverityCount >= 1 && indicators.length >= 2)) {
      classification = 'Revisão prioritária';
      attentionLevelLabel = 'Nível elevado de atenção';
      humanReviewRecommendation =
        'Recomenda-se encaminhar este anúncio para revisão humana prioritária antes da liberação ou manutenção no catálogo, validando preço, canal de contato e condições de pagamento.';
      summary = `Foram identificados ${indicators.length} indicadores que justificam verificação humana prioritária para assegurar conformidade com as políticas do marketplace.`;
    } else if (indicators.length > 0 || moderateSeverityCount >= 1) {
      classification = 'Atenção recomendada';
      attentionLevelLabel = 'Nível moderado de atenção';
      humanReviewRecommendation =
        'Recomenda-se revisão humana complementar ou solicitação de esclarecimentos/ajustes no texto do anúncio antes de concluir a moderação.';
      summary = `A análise identificou ${indicators.length} ${
        indicators.length === 1 ? 'sinal de atenção' : 'sinais de atenção'
      } que merecem conferência contextual por um analista.`;
    }

    return {
      id: `SIM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      listing: {
        ...input,
        title,
        description,
      },
      classification,
      attentionLevelLabel,
      humanReviewRecommendation,
      summary,
      indicators,
      analyzedAt: new Date().toISOString(),
      sourceMode: 'simulacao_local',
    };
  }
}

/**
 * Adaptador futuro para integração real com Supabase Edge Functions + Gemini API.
 * Mantido desacoplado e sem credenciais no frontend.
 *
 * Exemplo de implementação futura:
 * - Chamada autenticada para `supabase.functions.invoke('analyze-listing', { body: input })`
 * - Persistência do resultado retornado na tabela `listing_analyses` no Supabase Postgres.
 */
export class SupabaseEdgeAnalysisService implements IAnalysisService {
  private readonly edgeFunctionEndpoint: string;

  constructor(edgeFunctionEndpoint = '/functions/v1/analyze-listing') {
    this.edgeFunctionEndpoint = edgeFunctionEndpoint;
  }

  async analyzeListing(_input: ListingInput): Promise<AnalysisResult> {
    throw new Error(
      `Integração com Edge Function (${this.edgeFunctionEndpoint}) será ativada na próxima etapa com Supabase e Google Gemini API.`
    );
  }
}

export const analysisService: IAnalysisService = new DemoAnalysisService();
