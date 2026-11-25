import { useMemo, useState } from 'react';
import { ArrowRight, BarChart3, FlaskConical, PlusCircle, Search } from 'lucide-react';
import {
  DEMO_CLASSIFICATION_DISTRIBUTION,
  DEMO_DASHBOARD_KPIS,
  DEMO_INDICATOR_FREQUENCY,
} from '../data/demoAnalyses';
import { AnalysisResult, ClassificationLevel } from '../types/analysis';
import { formatCurrencyBRL, formatShortDateBR } from '../utils/formatters';
import { ClassificationDisplay } from './ClassificationDisplay';

interface DashboardViewProps {
  analyses: AnalysisResult[];
  onSelectAnalysis: (analysis: AnalysisResult) => void;
  onStartNewAnalysis: () => void;
}

type FilterOption = 'Todas' | ClassificationLevel;

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'Todas', label: 'Todas' },
  { value: 'Sem indicadores relevantes identificados', label: 'Sem indicadores' },
  { value: 'Atenção recomendada', label: 'Atenção recomendada' },
  { value: 'Revisão prioritária', label: 'Revisão prioritária' },
];

export function DashboardView({
  analyses,
  onSelectAnalysis,
  onStartNewAnalysis,
}: DashboardViewProps) {
  const [statusFilter, setStatusFilter] = useState<FilterOption>('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const maxIndicatorCount = useMemo(
    () => Math.max(...DEMO_INDICATOR_FREQUENCY.map((item) => item.count), 1),
    []
  );

  const filteredAnalyses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return analyses.filter((item) => {
      const matchesStatus = statusFilter === 'Todas' || item.classification === statusFilter;
      const matchesQuery =
        !query ||
        item.listing.title.toLowerCase().includes(query) ||
        item.listing.category.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [analyses, statusFilter, searchQuery]);

  // SVG Donut chart geometry (r = 52, circumference = 2 * Math.PI * 52 ≈ 326.725)
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const distributionColors: Record<ClassificationLevel, string> = {
    'Sem indicadores relevantes identificados': '#16A34A',
    'Atenção recomendada': '#D97706',
    'Revisão prioritária': '#DC2626',
  };

  let accumulatedPercent = 0;
  const donutSegments = DEMO_CLASSIFICATION_DISTRIBUTION.map((item) => {
    const strokeLength = (item.percentage / 100) * circumference;
    const strokeOffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += item.percentage;
    return {
      ...item,
      color: distributionColors[item.classification],
      strokeDasharray: `${strokeLength} ${circumference - strokeLength}`,
      strokeDashoffset: strokeOffset,
    };
  });

  const kpiCards = [
    {
      label: 'Total de anúncios analisados',
      value: DEMO_DASHBOARD_KPIS.totalAnalyzed.toLocaleString('pt-BR'),
      context: 'Base ilustrativa · 30 dias',
      accentClass: 'text-slate-900',
    },
    {
      label: 'Sem indicadores relevantes',
      value: DEMO_DASHBOARD_KPIS.noRelevantIndicators.toLocaleString('pt-BR'),
      context: '69,8% do volume demonstrativo',
      accentClass: 'text-emerald-700',
    },
    {
      label: 'Análises com sinais de atenção',
      value: DEMO_DASHBOARD_KPIS.attentionRecommended.toLocaleString('pt-BR'),
      context: '21,3% · Atenção recomendada',
      accentClass: 'text-amber-700',
    },
    {
      label: 'Recomendadas para revisão humana',
      value: DEMO_DASHBOARD_KPIS.priorityReview.toLocaleString('pt-BR'),
      context: '8,9% · Revisão prioritária',
      accentClass: 'text-red-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página + CTA principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Dashboard de moderação
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Painel demonstrativo para acompanhamento de triagem e sinais de atenção em anúncios.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNewAnalysis}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap shrink-0"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          <span>Nova análise</span>
        </button>
      </div>

      {/* Aviso explícito de dados demonstrativos */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/70 px-4 py-3 text-sm text-slate-700">
        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-slate-900">Dados fictícios para demonstração:</strong>{' '}
          os totais, gráficos e registros históricos abaixo são ilustrativos para apresentar os
          recursos do protótipo e não representam análises reais de usuários.
        </p>
      </div>

      {/* KPI Cards */}
      <section aria-label="Indicadores gerais demonstrativos" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
            <p className={`mt-2 font-display text-3xl font-bold tracking-tight tabular-nums ${kpi.accentClass}`}>
              {kpi.value}
            </p>
            <p className="mt-1.5 text-xs text-slate-500 tabular-nums">{kpi.context}</p>
          </div>
        ))}
      </section>

      {/* Gráficos discretos */}
      <section aria-label="Gráficos demonstrativos" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico 1: Distribuição dos resultados */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900">
                Distribuição dos resultados
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Proporção demonstrativa por classificação indicativa
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
              Demonstração
            </span>
          </div>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="relative h-36 w-36 shrink-0">
              <svg
                viewBox="0 0 140 140"
                className="h-full w-full -rotate-90"
                role="img"
                aria-label="Gráfico de rosca mostrando a distribuição demonstrativa das classificações"
              >
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="16"
                />
                {donutSegments.map((segment) => (
                  <circle
                    key={segment.classification}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="16"
                    strokeDasharray={segment.strokeDasharray}
                    strokeDashoffset={segment.strokeDashoffset}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-lg font-bold text-slate-900 tabular-nums">
                  {DEMO_DASHBOARD_KPIS.totalAnalyzed.toLocaleString('pt-BR')}
                </span>
                <span className="text-[11px] text-slate-500">anúncios</span>
              </div>
            </div>

            <div className="w-full flex-1 space-y-3.5">
              {donutSegments.map((item) => (
                <div key={item.classification} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-xs"
                        style={{ backgroundColor: item.color }}
                        aria-hidden="true"
                      />
                      <span className="truncate font-medium text-slate-700">
                        {item.classification}
                      </span>
                    </div>
                    <span className="shrink-0 font-mono text-xs font-medium text-slate-900 tabular-nums">
                      {item.count.toLocaleString('pt-BR')} ({item.percentage.toFixed(1).replace('.', ',')}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico 2: Indicadores identificados */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900">
                Indicadores identificados
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Frequência demonstrativa por tipo de sinal observado
              </p>
            </div>
            <BarChart3 className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
          </div>

          <div className="mt-5 space-y-3">
            {DEMO_INDICATOR_FREQUENCY.map((item) => {
              const widthPercent = Math.round((item.count / maxIndicatorCount) * 100);
              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="truncate font-medium text-slate-700" title={item.type}>
                      {item.shortLabel}
                    </span>
                    <span className="shrink-0 font-mono font-medium text-slate-900 tabular-nums">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-sm bg-slate-100">
                    <div
                      className="h-full rounded-sm bg-blue-700"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Histórico demonstrativo de análises recentes */}
      <section
        aria-label="Histórico demonstrativo de análises recentes"
        className="rounded-lg border border-slate-200 bg-white"
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900">
              Histórico demonstrativo de análises recentes
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Selecione qualquer registro ilustrativo para visualizar a tela completa de resultado.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar título ou categoria..."
                aria-label="Buscar no histórico demonstrativo"
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none sm:w-56"
              />
            </div>

            <div
              role="group"
              aria-label="Filtrar por classificação"
              className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
            >
              {FILTER_OPTIONS.map((option) => {
                const isSelected = statusFilter === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatusFilter(option.value)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredAnalyses.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-900">
              Nenhum registro encontrado para os filtros aplicados.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Ajuste o termo de busca ou limpe o filtro de classificação.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('Todas');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500">
                  <th className="px-5 py-3">Anúncio</th>
                  <th className="px-4 py-3 whitespace-nowrap">Categoria</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Preço</th>
                  <th className="px-4 py-3 whitespace-nowrap">Classificação</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Sinais</th>
                  <th className="px-5 py-3 text-right whitespace-nowrap">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAnalyses.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="truncate font-medium text-slate-900" title={item.listing.title}>
                        {item.listing.title}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 tabular-nums">
                        <span>{item.sourceMode === 'demonstrativo' ? 'Demonstração' : 'Análise real'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatShortDateBR(item.analyzedAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                      {item.listing.category}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-xs font-medium text-slate-900 tabular-nums whitespace-nowrap">
                      {formatCurrencyBRL(item.listing.price)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <ClassificationDisplay classification={item.classification} />
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
                      {item.indicators.length}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectAnalysis(item)}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-700 whitespace-nowrap shrink-0"
                      >
                        <span>Detalhes</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
