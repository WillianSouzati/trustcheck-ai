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
  title: string;
  severity: AttentionSeverity;
  severityLabel?: string;
  justification: string;
  evidence?: string;
}

export interface ListingInput {
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
}

export interface AnalysisResult {
  id: string;
  listing: {
    title: string;
    description: string;
    price: number;
    category: string;
  };
  classification: ClassificationLevel;
  attentionLevelLabel: string;
  humanReviewRecommendation: string;
  summary?: string;
  indicators: RiskIndicator[];
  analyzedAt: string;
  sourceMode: 'demonstrativo' | 'real';
}

/**
 * Payload exato esperado pela Edge Function `analyze-trustcheck-listing`
 */
export interface EdgeAnalyzeListingRequest {
  listing_title: string;
  listing_description: string;
  listing_price: number;
  listing_category: string;
}

/**
 * Estrutura de indicador retornada no campo `analysis.indicators`
 */
export interface EdgeAnalysisIndicatorRaw {
  id?: string;
  title?: string;
  type?: string;
  name?: string;
  label?: string;
  severity?: string;
  level?: string;
  risk_level?: string;
  justification?: string;
  reason?: string;
  explanation?: string;
  description?: string;
  evidence?: string | null;
  excerpt?: string | null;
  quote?: string | null;
  snippet?: string | null;
}

/**
 * Estrutura do objeto `analysis` retornado pela Edge Function `analyze-trustcheck-listing`
 */
export interface EdgeAnalysisRecord {
  id: string;
  listing_title: string;
  listing_description: string;
  listing_price: number;
  listing_category: string;
  classification: string;
  indicators: EdgeAnalysisIndicatorRaw[] | null;
  recommendation: string;
  summary?: string | null;
  created_at: string;
}

export interface EdgeAnalyzeListingResponse {
  success: boolean;
  analysis?: EdgeAnalysisRecord;
  error?: string;
  message?: string;
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

export interface IAnalysisService {
  analyzeListing(input: ListingInput): Promise<AnalysisResult>;
}
