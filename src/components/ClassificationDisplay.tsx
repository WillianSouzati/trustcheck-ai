import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { AttentionSeverity, ClassificationLevel } from '../types/analysis';

interface ClassificationDisplayProps {
  classification: ClassificationLevel;
  variant?: 'inline' | 'banner';
}

export function getClassificationTheme(classification: ClassificationLevel) {
  switch (classification) {
    case 'Sem indicadores relevantes identificados':
      return {
        textClass: 'text-emerald-700',
        surfaceClass: 'bg-emerald-50/70 border-emerald-200',
        barClass: 'bg-emerald-600',
        Icon: CheckCircle2,
      };
    case 'Atenção recomendada':
      return {
        textClass: 'text-amber-700',
        surfaceClass: 'bg-amber-50/70 border-amber-200',
        barClass: 'bg-amber-500',
        Icon: AlertTriangle,
      };
    case 'Revisão prioritária':
      return {
        textClass: 'text-red-700',
        surfaceClass: 'bg-red-50/70 border-red-200',
        barClass: 'bg-red-600',
        Icon: ShieldAlert,
      };
  }
}

export function ClassificationDisplay({
  classification,
  variant = 'inline',
}: ClassificationDisplayProps) {
  const { textClass, surfaceClass, Icon } = getClassificationTheme(classification);

  if (variant === 'banner') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 rounded-md border px-3 py-1.5 text-sm font-semibold ${surfaceClass} ${textClass}`}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{classification}</span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${textClass}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{classification}</span>
    </span>
  );
}

interface SeverityIndicatorProps {
  severity: AttentionSeverity;
}

export function SeverityIndicator({ severity }: SeverityIndicatorProps) {
  const config: Record<AttentionSeverity, { label: string; colorClass: string }> = {
    baixo: {
      label: 'Atenção leve',
      colorClass: 'text-slate-700 bg-slate-100 border-slate-200',
    },
    moderado: {
      label: 'Atenção moderada',
      colorClass: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    elevado: {
      label: 'Atenção elevada',
      colorClass: 'text-red-800 bg-red-50 border-red-200',
    },
  };

  const current = config[severity];

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 ${current.colorClass}`}
    >
      {current.label}
    </span>
  );
}
