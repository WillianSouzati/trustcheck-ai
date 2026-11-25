import { FormEvent, useState } from 'react';
import { AlertCircle, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { DEMO_FORM_PRESETS } from '../data/demoAnalyses';
import {
  DemoPreset,
  LISTING_CATEGORIES,
  ListingCategory,
  ListingInput,
} from '../types/analysis';
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  ListingFormErrors,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  validateListingForm,
} from '../utils/formatters';

interface NewAnalysisViewProps {
  onSubmitAnalysis: (input: ListingInput) => Promise<void>;
  isAnalyzing: boolean;
  submissionError: string | null;
}

export function NewAnalysisView({
  onSubmitAnalysis,
  isAnalyzing,
  submissionError,
}: NewAnalysisViewProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceRaw, setPriceRaw] = useState('');
  const [category, setCategory] = useState<ListingCategory>('Eletrônicos');
  const [errors, setErrors] = useState<ListingFormErrors>({});
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);

  const runValidation = (next = { title, description, priceRaw, category }) => {
    const result = validateListingForm(next);
    setErrors(result.errors);
    return result;
  };

  const handleApplyPreset = (preset: DemoPreset) => {
    setTitle(preset.input.title);
    setDescription(preset.input.description);
    setPriceRaw(preset.input.priceRaw);
    setCategory(preset.input.category);
    setErrors({});
    setHasSubmittedOnce(false);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setPriceRaw('');
    setCategory('Eletrônicos');
    setErrors({});
    setHasSubmittedOnce(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmittedOnce(true);

    const validation = runValidation();
    if (!validation.isValid || validation.parsedPrice === null) {
      return;
    }

    await onSubmitAnalysis({
      title: title.trim(),
      description: description.trim(),
      price: validation.parsedPrice,
      category,
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Nova análise de anúncio
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Preencha os dados do anúncio para identificar sinais de atenção e recomendações de
          revisão humana.
        </p>
      </div>

      {/* Exemplos rápidos demonstrativos */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <Sparkles className="h-4 w-4 text-blue-700 shrink-0" aria-hidden="true" />
            <span>Preencher com exemplo demonstrativo:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {DEMO_FORM_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                disabled={isAnalyzing}
                onClick={() => handleApplyPreset(preset)}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Erro de processamento */}
      {submissionError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          <div>
            <p className="font-semibold">Não foi possível concluir a análise</p>
            <p className="mt-0.5 text-xs text-red-700">{submissionError}</p>
          </div>
        </div>
      )}

      {/* Formulário principal */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-lg border border-slate-200 bg-white p-6 space-y-6"
      >
        {/* Título */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="listing-title" className="text-sm font-medium text-slate-900">
              Título do anúncio <span className="text-red-600">*</span>
            </label>
            <span
              className={`font-mono text-xs tabular-nums ${
                title.length > TITLE_MAX_LENGTH ? 'text-red-600' : 'text-slate-400'
              }`}
            >
              {title.length}/{TITLE_MAX_LENGTH}
            </span>
          </div>
          <input
            id="listing-title"
            type="text"
            value={title}
            disabled={isAnalyzing}
            maxLength={TITLE_MAX_LENGTH + 20}
            placeholder="Ex.: Smartphone Samsung Galaxy S24 256GB Preto com Nota Fiscal"
            onChange={(e) => {
              const value = e.target.value;
              setTitle(value);
              if (hasSubmittedOnce) {
                runValidation({ title: value, description, priceRaw, category });
              }
            }}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : 'title-hint'}
            className={`mt-1.5 h-11 w-full rounded-lg border px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 ${
              errors.title
                ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                : 'border-slate-200 bg-white focus:border-blue-600'
            }`}
          />
          {errors.title ? (
            <p id="title-error" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.title}
            </p>
          ) : (
            <p id="title-hint" className="mt-1.5 text-xs text-slate-500">
              Mínimo de {TITLE_MIN_LENGTH} caracteres. Informe exatamente como aparece para o comprador.
            </p>
          )}
        </div>

        {/* Categoria e Preço */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="listing-category" className="block text-sm font-medium text-slate-900">
              Categoria <span className="text-red-600">*</span>
            </label>
            <select
              id="listing-category"
              value={category}
              disabled={isAnalyzing}
              onChange={(e) => {
                const value = e.target.value as ListingCategory;
                setCategory(value);
                if (hasSubmittedOnce) {
                  runValidation({ title, description, priceRaw, category: value });
                }
              }}
              aria-invalid={Boolean(errors.category)}
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
            >
              {LISTING_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1.5 text-xs font-medium text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="listing-price" className="block text-sm font-medium text-slate-900">
              Preço anunciado (R$) <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-500">
                R$
              </span>
              <input
                id="listing-price"
                type="text"
                inputMode="decimal"
                value={priceRaw}
                disabled={isAnalyzing}
                placeholder="2.450,00"
                onChange={(e) => {
                  const value = e.target.value;
                  setPriceRaw(value);
                  if (hasSubmittedOnce) {
                    runValidation({ title, description, priceRaw: value, category });
                  }
                }}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={errors.price ? 'price-error' : 'price-hint'}
                className={`h-11 w-full rounded-lg border pl-10 pr-3.5 font-mono text-sm text-slate-900 tabular-nums placeholder:text-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 ${
                  errors.price
                    ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                    : 'border-slate-200 bg-white focus:border-blue-600'
                }`}
              />
            </div>
            {errors.price ? (
              <p id="price-error" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.price}
              </p>
            ) : (
              <p id="price-hint" className="mt-1.5 text-xs text-slate-500">
                Informe o valor em reais para comparação contextual com a categoria.
              </p>
            )}
          </div>
        </div>

        {/* Descrição */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="listing-description" className="text-sm font-medium text-slate-900">
              Descrição do anúncio <span className="text-red-600">*</span>
            </label>
            <span
              className={`font-mono text-xs tabular-nums ${
                description.length > DESCRIPTION_MAX_LENGTH ? 'text-red-600' : 'text-slate-400'
              }`}
            >
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="listing-description"
            rows={6}
            value={description}
            disabled={isAnalyzing}
            maxLength={DESCRIPTION_MAX_LENGTH + 50}
            placeholder="Descreva estado de conservação, especificações, acessórios incluídos e condições de entrega ou pagamento..."
            onChange={(e) => {
              const value = e.target.value;
              setDescription(value);
              if (hasSubmittedOnce) {
                runValidation({ title, description: value, priceRaw, category });
              }
            }}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'description-error' : 'description-hint'}
            className={`mt-1.5 w-full rounded-lg border p-3.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 ${
              errors.description
                ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                : 'border-slate-200 bg-white focus:border-blue-600'
            }`}
          />
          {errors.description ? (
            <p id="description-error" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.description}
            </p>
          ) : (
            <p id="description-hint" className="mt-1.5 text-xs text-slate-500">
              Mínimo de {DESCRIPTION_MIN_LENGTH} caracteres. Quanto mais completo o texto, mais
              precisa será a identificação de sinais.
            </p>
          )}
        </div>

        {/* Rodapé do formulário */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={isAnalyzing}
            onClick={handleReset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Limpar campos</span>
          </button>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="inline-flex h-11 items-center justify-center gap-2.5 rounded-lg bg-blue-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-blue-600 whitespace-nowrap shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Analisando anúncio...</span>
              </>
            ) : (
              <span>Analisar anúncio</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
