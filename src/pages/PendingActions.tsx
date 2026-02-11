import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { getPendingPatients } from '@/lib/mockData';
import { useI18n } from '@/lib/i18n';
import { GlassCard } from '@/components/GlassCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';

export default function PendingActions() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const pending = getPendingPatients();

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold tracking-tight">
        {t('pendingActions')}
      </motion.h1>

      <div className="space-y-3">
        {pending.map((p, i) => {
          const pendingEvent = p.timeline.find(e => e.status === 'pending' && e.stage === p.currentStage);
          return (
            <GlassCard
              key={p.id}
              delay={i * 0.05}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4" onClick={() => navigate(`/patients/${p.id}`)}>
                <div className="w-10 h-10 rounded-xl bg-status-pending/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-status-pending" />
                </div>
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{t('actionRequired')}: {p.currentStage}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">{t('responsibleRole')}</p>
                  <p className="text-sm">{pendingEvent?.department || '—'}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">{t('lastUpdated')}</p>
                  <p className="text-sm">{p.lastUpdated}</p>
                </div>
                <StatusBadge status="pending" />
              </div>
            </GlassCard>
          );
        })}
        {pending.length === 0 && (
          <GlassCard hover={false}>
            <p className="text-center text-muted-foreground text-sm">No pending actions</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
