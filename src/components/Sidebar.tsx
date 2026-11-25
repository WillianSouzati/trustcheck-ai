import { FileCheck2, LayoutDashboard, PlusCircle, ShieldCheck, X } from 'lucide-react';

export type AppSection = 'dashboard' | 'nova-analise' | 'resultado';

interface SidebarProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  hasActiveResult: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: AppSection;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Visão geral demonstrativa',
    icon: LayoutDashboard,
  },
  {
    id: 'nova-analise',
    label: 'Nova análise',
    description: 'Avaliar texto e preço',
    icon: PlusCircle,
  },
  {
    id: 'resultado',
    label: 'Resultado da análise',
    description: 'Indicadores e revisão',
    icon: FileCheck2,
  },
];

export function Sidebar({
  activeSection,
  onNavigate,
  hasActiveResult,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const handleSelect = (section: AppSection) => {
    onNavigate(section);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-[#0B192C] text-slate-100">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-5">
          <button
            type="button"
            onClick={() => handleSelect('dashboard')}
            className="flex items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 rounded-md"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="block font-display text-base font-bold tracking-tight text-white whitespace-nowrap">
                TrustCheck AI
              </span>
              <span className="block text-xs text-slate-400 whitespace-nowrap">
                Apoio à moderação
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Fechar menu de navegação"
            className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Navegação principal" className="px-3 py-5 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const showDot = item.id === 'resultado' && hasActiveResult;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                    {showDot && (
                      <span className="text-[11px] font-medium text-blue-200 whitespace-nowrap">
                        Ativo
                      </span>
                    )}
                  </div>
                  <p
                    className={`truncate text-xs ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800/80 px-5 py-4 text-xs text-slate-400 space-y-1">
        <p className="font-medium text-slate-300">Ambiente integrado</p>
        <p className="leading-relaxed">
          Dashboard demonstrativo e análises processadas via Supabase Edge Function.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden w-[264px] shrink-0 border-r border-slate-800 lg:block">
        <div className="sticky top-0 h-screen">{navContent}</div>
      </aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-[272px] max-w-[85vw] shadow-xl">{navContent}</div>
        </div>
      )}
    </>
  );
}
