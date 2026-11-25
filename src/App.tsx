/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { AnalysisResultView } from './components/AnalysisResultView';
import { DashboardView } from './components/DashboardView';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { NewAnalysisView } from './components/NewAnalysisView';
import { AppSection, Sidebar } from './components/Sidebar';
import { DEMO_RECENT_ANALYSES } from './data/demoAnalyses';
import { analysisService } from './services/analysisService';
import { AnalysisResult, ListingInput } from './types/analysis';

const SECTION_TITLES: Record<AppSection, string> = {
  dashboard: 'Dashboard',
  'nova-analise': 'Nova análise',
  resultado: 'Resultado da análise',
};

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('dashboard');
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [resultSuccessMessage, setResultSuccessMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectDemoAnalysis = (analysis: AnalysisResult) => {
    setSelectedResult(analysis);
    setResultSuccessMessage(null);
    setActiveSection('resultado');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (section: AppSection) => {
    setSubmissionError(null);
    if (section !== 'resultado') {
      setResultSuccessMessage(null);
    }
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRunAnalysis = async (input: ListingInput) => {
    setIsAnalyzing(true);
    setSubmissionError(null);
    setResultSuccessMessage(null);

    try {
      const result = await analysisService.analyzeListing(input);
      setSelectedResult(result);
      setResultSuccessMessage(
        'Análise concluída com sucesso. Os indicadores abaixo foram retornados pelo serviço do Supabase.'
      );
      setActiveSection('resultado');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ocorreu uma falha inesperada ao processar o anúncio.';
      setSubmissionError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        hasActiveResult={selectedResult !== null}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior contextual */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu de navegação"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-2 text-sm min-w-0">
              <ShieldCheck
                className="h-4 w-4 shrink-0 text-blue-700 lg:hidden"
                aria-hidden="true"
              />
              <span className="font-display font-semibold text-slate-900 whitespace-nowrap">
                TrustCheck AI
              </span>
              <span className="text-slate-300" aria-hidden="true">
                /
              </span>
              <span className="truncate text-slate-600">{SECTION_TITLES[activeSection]}</span>
            </div>
          </div>

          <span className="hidden text-xs font-medium text-slate-500 sm:inline whitespace-nowrap shrink-0">
            Analisador Inteligente de Riscos em Anúncios
          </span>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {activeSection === 'dashboard' && (
              <DashboardView
                analyses={DEMO_RECENT_ANALYSES}
                onSelectAnalysis={handleSelectDemoAnalysis}
                onStartNewAnalysis={() => handleNavigate('nova-analise')}
              />
            )}

            {activeSection === 'nova-analise' && (
              <NewAnalysisView
                onSubmitAnalysis={handleRunAnalysis}
                isAnalyzing={isAnalyzing}
                submissionError={submissionError}
              />
            )}

            {activeSection === 'resultado' && (
              <AnalysisResultView
                result={selectedResult}
                successMessage={resultSuccessMessage}
                onNewAnalysis={() => handleNavigate('nova-analise')}
                onBackToDashboard={() => handleNavigate('dashboard')}
              />
            )}

            <DisclaimerBanner />
          </div>
        </main>
      </div>
    </div>
  );
}
