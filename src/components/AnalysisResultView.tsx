import { Fragment } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  PlusCircle,
  Quote,
} from 'lucide-react';
import { AnalysisResult } from '../types/analysis';
import { formatCurrencyBRL, formatDateTimeBR } from '../utils/formatters';
import {
  ClassificationDisplay,
  SeverityIndicator,
  getClassificationTheme,
} from './ClassificationDisplay';

interface AnalysisResultViewProps {
  result: AnalysisResult | null;
  successMessage: string | null;
  onNewAnalysis: () => void;
  onBackToDashboard: () => void;
}

function renderHighlightedText(text: string, evidences: string[]) {
  const cleanEvidences = evidences
    .map((e) => e.replace(/^\.\.\.|\.\.\.$/g, '').trim())
    .filter((e) => e.length >= 4);

  if (cleanEvidences.length === 0) {
    return <span>{text}</span>;
  }

  const escaped = cleanEvidences.map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = cleanEvidences.some(
          (evidence) => evidence.toLowerCase() === part.toLowerCase()
        );
        if (isMatch) {
          return (
            <mark
              key={index}
              className="rounded-xs bg-amber-100 px-1 py-0.5 font-medium text-slate-900"
            >
              {part}
            </mark>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

export function AnalysisResultView({
  result,
  successMessage,
  onNewAnalysis,
  onBackToDashboard,
}: AnalysisResultViewProps) {
  if (!result) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <FileSearch className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-4 font-display text-xl font-bold text-slate-900">
          Nenhuma análise selecionada
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          Envie um anúncio no formulário de nova análise ou selecione um registro ilustrativo no
          Dashboard para visualizar os indicadores detalhados.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onNewAnalysis}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            <span>Nova análise</span>
          </button>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Ir para o Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const theme = getClassificationTheme(result.classification);
  const evidences = result.indicators
    .map((ind) => ind.evidence)
    .filter((ev): ev is string => Boolean(ev));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Barra superior contextual */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Voltar ao Dashboard</span>
          </button>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900">
            Resultado da análise
          </h1>
        </div>

        <button
          type="button"
          onClick={onNewAnalysis}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap shrink-0"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          <span>Realizar nova análise</span>
        </button>
      </div>

      {/* Mensagem de sucesso da análise real */}
      {successMessage && result.sourceMode === 'real' && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Bloco 1: Identificação e Classificação Geral */}
      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 tabular-nums">
            <span className="font-mono font-medium text-slate-700">{result.id}</span>
            <span aria-hidden="true">·</span>
            <span>{result.listing.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono font-semibold text-slate-800">
              {formatCurrencyBRL(result.listing.price)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatDateTimeBR(result.analyzedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>
              {result.sourceMode === 'demonstrativo'
                ? 'Registro demonstrativo'
                : 'Análise via Supabase'}
            </span>
          </div>

          <h2 className="mt-2.5 font-display text-xl font-bold text-slate-900">
            {result.listing.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 divide-y divide-slate-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <div className="p-6 lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <ClassificationDisplay classification={result.classification} variant="banner" />
              <span className={`text-xs font-medium ${theme.textClass}`}>
                {result.attentionLevelLabel}
              </span>
            </div>

            {result.summary && (
              <p className="text-sm leading-relaxed text-slate-700">{result.summary}</p>
            )}
          </div>

          <div className="bg-slate-50/70 p-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <ClipboardCheck className="h-4 w-4 text-blue-700 shrink-0" aria-hidden="true" />
              <span>Recomendação de revisão humana</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              {result.humanReviewRecommendation}
            </p>
          </div>
        </div>
      </section>

      {/* Bloco 2: Indicadores identificados */}
      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">
              Indicadores identificados
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Sinais objetivos observados no texto e nas informações do anúncio
            </p>
          </div>
          <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
            {result.indicators.length}{' '}
            {result.indicators.length === 1 ? 'indicador' : 'indicadores'}
          </span>
        </div>

        {result.indicators.length === 0 ? (
          <div className="flex items-start gap-3.5 px-6 py-6">
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                Nenhum indicador relevante de risco foi identificado
              </p>
              <p className="text-sm leading-relaxed text-slate-600">
                O anúncio não apresentou sinais relevantes de inconsistência ou desvio de
                negociação na análise realizada. Ainda assim, a avaliação humana segue soberana caso
                a equipe identifique algum contexto adicional.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {result.indicators.map((indicator, index) => (
              <article key={indicator.id} className="p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-slate-400 tabular-nums">
                      0{index + 1}.
                    </span>
                    <h4 className="font-display text-sm font-semibold text-slate-900">
                      {indicator.title}
                    </h4>
                  </div>
                  <SeverityIndicator
                    severity={indicator.severity}
                    label={indicator.severityLabel}
                  />
                </div>

                <p className="text-sm leading-relaxed text-slate-700">
                  {indicator.justification}
                </p>

                {indicator.evidence && (
                  <div className="flex items-start gap-2.5 rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700">
                    <Quote
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="font-medium text-slate-500">
                        Evidência encontrada no anúncio:{' '}
                      </span>
                      <span className="font-medium text-slate-900">“{indicator.evidence}”</span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Bloco 3: Conteúdo analisado com destaque nos trechos */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-display text-base font-semibold text-slate-900">
            Conteúdo do anúncio analisado
          </h3>
          {evidences.length > 0 && (
            <span className="text-xs text-slate-500">
              Trechos relacionados às evidências destacados em amarelo
            </span>
          )}
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-4 text-sm">
          <div>
            <span className="block text-xs font-medium text-slate-500">Título</span>
            <p className="mt-1 font-medium text-slate-900">
              {renderHighlightedText(result.listing.title, evidences)}
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-500">Descrição completa</span>
            <p className="mt-1 whitespace-pre-line leading-relaxed text-slate-700">
              {renderHighlightedText(result.listing.description, evidences)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
