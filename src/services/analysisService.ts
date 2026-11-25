import { ensureAnonymousSession, getSupabaseClient } from '../lib/supabaseClient';
import {
  AnalysisResult,
  AttentionSeverity,
  ClassificationLevel,
  EdgeAnalysisIndicatorRaw,
  EdgeAnalysisRecord,
  EdgeAnalyzeListingRequest,
  EdgeAnalyzeListingResponse,
  IAnalysisService,
  ListingInput,
  RiskIndicator,
} from '../types/analysis';

const EDGE_FUNCTION_NAME = 'analyze-trustcheck-listing';

function normalizeClassification(raw: string | undefined | null): ClassificationLevel {
  const value = (raw ?? '').trim().toLowerCase();

  if (
    value === 'revisão prioritária' ||
    value === 'revisao prioritaria' ||
    value.includes('priorit') ||
    value === 'high' ||
    value === 'alto'
  ) {
    return 'Revisão prioritária';
  }

  if (
    value === 'atenção recomendada' ||
    value === 'atencao recomendada' ||
    value.includes('atenção') ||
    value.includes('atencao') ||
    value === 'medium' ||
    value === 'moderate' ||
    value === 'moderado'
  ) {
    return 'Atenção recomendada';
  }

  return 'Sem indicadores relevantes identificados';
}

function getAttentionLevelLabel(classification: ClassificationLevel): string {
  switch (classification) {
    case 'Sem indicadores relevantes identificados':
      return 'Sem sinais relevantes de atenção';
    case 'Atenção recomendada':
      return 'Nível moderado de atenção';
    case 'Revisão prioritária':
      return 'Nível elevado de atenção';
  }
}

function normalizeSeverity(raw: string | undefined | null): {
  severity: AttentionSeverity;
  severityLabel?: string;
} {
  const trimmed = (raw ?? '').trim();
  const lower = trimmed.toLowerCase();

  if (
    lower === 'elevado' ||
    lower === 'elevada' ||
    lower === 'alto' ||
    lower === 'alta' ||
    lower === 'high' ||
    lower === 'crítico' ||
    lower === 'critico' ||
    lower === 'crítica' ||
    lower === 'critica' ||
    lower === 'critical'
  ) {
    return { severity: 'elevado', severityLabel: trimmed || 'Elevada' };
  }

  if (
    lower === 'moderado' ||
    lower === 'moderada' ||
    lower === 'médio' ||
    lower === 'medio' ||
    lower === 'média' ||
    lower === 'media' ||
    lower === 'medium' ||
    lower === 'moderate'
  ) {
    return { severity: 'moderado', severityLabel: trimmed || 'Moderada' };
  }

  return { severity: 'baixo', severityLabel: trimmed || 'Baixa' };
}

function mapIndicator(raw: EdgeAnalysisIndicatorRaw, index: number): RiskIndicator {
  const title =
    raw.title?.trim() ||
    raw.type?.trim() ||
    raw.name?.trim() ||
    raw.label?.trim() ||
    `Indicador ${index + 1}`;

  const justification =
    raw.justification?.trim() ||
    raw.reason?.trim() ||
    raw.explanation?.trim() ||
    raw.description?.trim() ||
    'Justificativa não informada pelo serviço de análise.';

  const rawEvidence =
    raw.evidence ?? raw.excerpt ?? raw.quote ?? raw.snippet ?? undefined;
  const evidence =
    typeof rawEvidence === 'string' && rawEvidence.trim().length > 0
      ? rawEvidence.trim()
      : undefined;

  const { severity, severityLabel } = normalizeSeverity(
    raw.severity ?? raw.level ?? raw.risk_level
  );

  return {
    id: raw.id?.trim() || `indicator-${index + 1}`,
    title,
    severity,
    severityLabel,
    justification,
    evidence,
  };
}

function mapEdgeRecordToAnalysisResult(record: EdgeAnalysisRecord): AnalysisResult {
  const classification = normalizeClassification(record.classification);
  const rawIndicators = Array.isArray(record.indicators) ? record.indicators : [];

  return {
    id: String(record.id),
    listing: {
      title: record.listing_title,
      description: record.listing_description,
      price: Number(record.listing_price),
      category: record.listing_category,
    },
    classification,
    attentionLevelLabel: getAttentionLevelLabel(classification),
    humanReviewRecommendation:
      record.recommendation?.trim() ||
      'Recomenda-se avaliação contextual pela equipe de moderação.',
    summary: record.summary?.trim() || undefined,
    indicators: rawIndicators.map(mapIndicator),
    analyzedAt: record.created_at || new Date().toISOString(),
    sourceMode: 'real',
  };
}

/**
 * Serviço de análise conectado à Edge Function `analyze-trustcheck-listing` do Supabase.
 */
export class SupabaseAnalysisService implements IAnalysisService {
  async analyzeListing(input: ListingInput): Promise<AnalysisResult> {
    const session = await ensureAnonymousSession();
    const client = getSupabaseClient();

    const payload: EdgeAnalyzeListingRequest = {
      listing_title: input.title.trim(),
      listing_description: input.description.trim(),
      listing_price: Number(input.price),
      listing_category: input.category,
    };

    const { data, error } = await client.functions.invoke<EdgeAnalyzeListingResponse>(
      EDGE_FUNCTION_NAME,
      {
        body: payload,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (error) {
      let detailedMessage = error.message;
      const context = (error as { context?: Response }).context;
      if (context && typeof context.json === 'function') {
        try {
          const errorBody = (await context.json()) as {
            error?: string;
            message?: string;
          };
          if (errorBody?.error || errorBody?.message) {
            detailedMessage = errorBody.error || errorBody.message || detailedMessage;
          }
        } catch {
          // Mantém a mensagem padrão caso o corpo não seja JSON
        }
      }
      throw new Error(`Erro ao executar a análise no Supabase: ${detailedMessage}`);
    }

    if (!data || !data.success || !data.analysis) {
      throw new Error(
        data?.error ||
          data?.message ||
          'A função de análise não retornou os dados esperados.'
      );
    }

    return mapEdgeRecordToAnalysisResult(data.analysis);
  }
}

export const analysisService: IAnalysisService = new SupabaseAnalysisService();
