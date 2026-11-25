export const LISTING_CATEGORIES = [
  'Eletrônicos',
  'Veículos',
  'Imóveis',
  'Moda e acessórios',
  'Casa e decoração',
  'Esportes e lazer',
  'Outros',
] as const;

export type ListingCategory = (typeof LISTING_CATEGORIES)[number];

export type ClassificationLevel =
  | 'Sem indicadores relevantes identificados'
  | 'Atenção recomendada'
  | 'Revisão prioritária';

export type AttentionSeverity = 'baixo' | 'moderado' | 'elevado';

export type IndicatorCategory =
  | 'Inconsistência entre título e descrição'
  | 'Preço aparentemente incompatível com as informações fornecidas'
  | 'Solicitação de contato fora da plataforma'
  | 'Expressões de negociação fora do padrão'
  | 'Informações incompletas ou contraditórias'
  | 'Solicitação de pagamento ou adiantamento';

export interface RiskIndicator {
  id: string;
  type: IndicatorCategory;
  severity: AttentionSeverity;
  justification: string;
  excerpt?: string;
  field?: 'title' | 'description' | 'price';
}

export interface ListingInput {
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
}

export interface AnalysisResult {
  id: string;
  listing: ListingInput;
  classification: ClassificationLevel;
  attentionLevelLabel: string;
  humanReviewRecommendation: string;
  summary: string;
  indicators: RiskIndicator[];
  analyzedAt: string;
  sourceMode: 'demonstrativo' | 'simulacao_local';
}

export interface DashboardKPIs {
  totalAnalyzed: number;
  noRelevantIndicators: number;
  attentionRecommended: number;
  priorityReview: number;
}

export interface ClassificationDistributionItem {
  classification: ClassificationLevel;
  count: number;
  percentage: number;
}

export interface IndicatorFrequencyItem {
  type: IndicatorCategory;
  shortLabel: string;
  count: number;
}

export interface DemoPreset {
  id: string;
  label: string;
  expectedClassification: ClassificationLevel;
  input: {
    title: string;
    description: string;
    priceRaw: string;
    category: ListingCategory;
  };
}

/**
 * Contrato de serviço preparado para integração futura com
 * Supabase Edge Functions + Google Gemini API.
 */
export interface IAnalysisService {
  analyzeListing(input: ListingInput): Promise<AnalysisResult>;
}
