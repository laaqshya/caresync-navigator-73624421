import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Users, FlaskConical, Pill, ShieldCheck, Activity, Clock, AlertTriangle, Phone } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { GlassCard } from '@/components/GlassCard';
import { patients, doctors } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

const roles = [
  { key: 'doctor', icon: Stethoscope, color: 'text-blue-500', bg: 'bg-blue-500/10', route: '/doctors' },
  { key: 'nurse', icon: Users, color: 'text-pink-500', bg: 'bg-pink-500/10', route: '/patients' },
  { key: 'labTechnician', icon: FlaskConical, color: 'text-amber-500', bg: 'bg-amber-500/10', route: '/active-workflow' },
  { key: 'pharmacist', icon: Pill, color: 'text-green-500', bg: 'bg-green-500/10', route: '/pending-actions' },
  { key: 'admin', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-500/10', route: '/patients' },
];

const stats = [
  { key: 'totalPatients', icon: Users, value: () => patients.length },
  { key: 'totalActive', icon: Activity, value: () => patients.filter(p => p.status === 'in-progress' || p.status === 'pending').length },
  { key: 'completedToday', icon: Clock, value: () => patients.filter(p => p.status === 'completed').length },
  { key: 'delayedActions', icon: AlertTriangle, value: () => patients.filter(p => p.status === 'delayed').length },
];

export default function Index() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const handleCall = (e: React.MouseEvent, doctorName: string) => {
    e.stopPropagation();
    toast({ title: '📞 Calling', description: `Initiating call to ${doctorName}...` });
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{t('welcomeCareSync')}</h1>
        <p className="text-muted-foreground">{t('selectRole')}</p>
      </motion.div>

      {/* Role Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {roles.map((role, i) => (
          <GlassCard key={role.key} delay={i * 0.06} className="cursor-pointer text-center">
            <div onClick={() => navigate(role.route)} className="flex flex-col items-center gap-3 py-2">
              <div className={`w-14 h-14 rounded-2xl ${role.bg} flex items-center justify-center`}>
                <role.icon className={`w-7 h-7 ${role.color}`} />
              </div>
              <p className="font-semibold text-sm">{t(role.key)}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t('quickOverview')}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <GlassCard key={stat.key} delay={0.3 + i * 0.06}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value()}</p>
                  <p className="text-xs text-muted-foreground">{t(stat.key)}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Recent Doctors */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t('doctors')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc, i) => (
            <GlassCard key={doc.id} delay={0.5 + i * 0.06} className="cursor-pointer">
              <div onClick={() => navigate(`/doctors/${doc.id}`)} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.specialization} · {doc.activePatients} {t('activePatients')}</p>
                </div>
                <button
                  onClick={(e) => handleCall(e, doc.name)}
                  className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500/20 transition-colors"
                  title={`Call ${doc.name}`}
                >
                  <Phone className="w-4 h-4 text-green-600" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
