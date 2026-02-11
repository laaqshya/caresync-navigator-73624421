import { motion } from 'framer-motion';
import { Activity, Users, CheckCircle2, Clock } from 'lucide-react';
import { getActivePatients, getCompletedToday, patients } from '@/lib/mockData';
import { useI18n } from '@/lib/i18n';
import { GlassCard } from '@/components/GlassCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';

export default function ActiveWorkflow() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const activePatients = getActivePatients();
  const completedToday = getCompletedToday();
  const inProgressCount = patients.filter(p => p.status === 'in-progress').length;

  const stats = [
    { label: t('totalActive'), value: activePatients.length, icon: Users, color: 'text-primary' },
    { label: t('inProgress'), value: inProgressCount, icon: Activity, color: 'text-status-in-progress' },
    { label: t('completedToday'), value: completedToday.length, icon: CheckCircle2, color: 'text-status-completed' },
    { label: t('avgProcessingTime'), value: '4.2h', icon: Clock, color: 'text-status-pending' },
  ];

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold tracking-tight">
        {t('activeWorkflow')}
      </motion.h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.05} className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-secondary ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-0 overflow-hidden" hover={false} delay={0.2}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('name')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('currentStage')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">{t('department')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">{t('timeSpent')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {activePatients.map((p, i) => {
                const currentEvent = p.timeline.find(e => e.stage === p.currentStage);
                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => navigate(`/patients/${p.id}`)}
                    className="border-b border-border/30 last:border-0 hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.currentStage}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{currentEvent?.department || '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">—</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
