import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { patients, type WorkflowStatus } from '@/lib/mockData';
import { useI18n } from '@/lib/i18n';
import { GlassCard } from '@/components/GlassCard';
import { StatusBadge } from '@/components/StatusBadge';

const statusFilters: (WorkflowStatus | 'all')[] = ['all', 'completed', 'in-progress', 'pending', 'delayed'];

export default function Patients() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.assignedDoctor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold tracking-tight"
      >
        {t('patients')}
      </motion.h1>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Filters */}
        <GlassCard className="sm:w-64 shrink-0 space-y-4" hover={false}>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="w-4 h-4" />
            {t('filterByStatus')}
          </div>
          <div className="space-y-1">
            {statusFilters.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  statusFilter === s
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {s === 'all' ? t('all') : t(s === 'in-progress' ? 'inProgress' : s)}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Patient Table */}
        <div className="flex-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
            />
          </div>

          <GlassCard className="p-0 overflow-hidden" hover={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('patientId')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('name')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('age')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">{t('gender')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">{t('assignedDoctor')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">{t('currentStage')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('status')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">{t('lastUpdated')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => navigate(`/patients/${p.id}`)}
                      className="border-b border-border/30 last:border-0 hover:bg-accent/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">{p.age}</td>
                      <td className="px-4 py-3 hidden md:table-cell">{p.gender}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">{p.assignedDoctor}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.currentStage}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 hidden xl:table-cell text-muted-foreground text-xs">{p.lastUpdated}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
