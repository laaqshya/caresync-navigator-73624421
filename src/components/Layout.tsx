import { NavLink, Outlet } from 'react-router-dom';
import { useI18n, type Language } from '@/lib/i18n';
import { VoiceAssistant } from './VoiceAssistant';
import { Activity, Users, Clock, AlertTriangle, Stethoscope, LogOut, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
];

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        )
      }
    >
      <Icon className="w-4 h-4" />
      <span className="hidden lg:inline">{label}</span>
    </NavLink>
  );
}

export function Layout() {
  const { t, lang, setLang } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="glass-nav sticky top-0 z-50 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">CareSync</span>
          </div>
          <nav className="flex items-center gap-1">
            <NavItem to="/patients" icon={Users} label={t('patients')} />
            <NavItem to="/active-workflow" icon={Activity} label={t('activeWorkflow')} />
            <NavItem to="/pending-actions" icon={Clock} label={t('pendingActions')} />
            <NavItem to="/delayed-actions" icon={AlertTriangle} label={t('delayedActions')} />
            <NavItem to="/doctors" icon={Stethoscope} label={t('doctors')} />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
            <Globe className="w-3.5 h-3.5 text-muted-foreground ml-1.5" />
            {languages.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={cn(
                  'px-2 py-1 rounded-md text-xs font-medium transition-all duration-200',
                  lang === l.code
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          <VoiceAssistant />

          {/* Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">A</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium leading-tight">{t('admin')}</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-6 max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
