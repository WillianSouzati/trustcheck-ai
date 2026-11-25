import { Info } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <aside
      aria-label="Aviso sobre o caráter experimental da ferramenta"
      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs leading-relaxed text-slate-600"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
      <p>
        Esta ferramenta é experimental e oferece apoio à análise de anúncios. Os indicadores
        apresentados não comprovam fraude e não substituem a avaliação humana.
      </p>
    </aside>
  );
}
