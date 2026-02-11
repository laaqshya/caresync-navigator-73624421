import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { getDelayedPatients } from '@/lib/mockData';
import { useI18n } from '@/lib/i18n';
import { GlassCard } from '@/components/GlassCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';

export default function DelayedActions() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const delayed = getDelayedPatients();

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold tracking-tight">
        {t('delayedActions')}
      </motion.h1>

      <div className="space-y-3">
        {delayed.map((p, i) => {
          const delayedEvent = p.timeline.find(e => e.status === 'delayed');
          return (
            <GlassCard
              key={p.id}
              delay={i * 0.05}
              className="border-status-delayed/20 cursor-pointer"
              hover
            >
              <div className="flex items-center justify-between" onClick={() => navigate(`/patients/${p.id}`)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-status-delayed/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-status-delayed" />
                  </div>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('stageOfDelay')}: {delayedEvent?.stage || p.currentStage}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">{t('responsibleDept')}</p>
                    <p className="text-sm">{delayedEvent?.department || '—'}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">{t('delayDetected')}</p>
                    <p className="text-sm">{delayedEvent?.timestamp || '—'}</p>
                  </div>
                  <StatusBadge status="delayed" />
                </div>
              </div>
            </GlassCard>
          );
        })}
        {delayed.length === 0 && (
          <GlassCard hover={false}>
            <p className="text-center text-muted-foreground text-sm">No delayed actions</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
