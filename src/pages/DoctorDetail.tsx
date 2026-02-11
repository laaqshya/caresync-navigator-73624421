import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Stethoscope, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { doctors, getPatientsByDoctor } from '@/lib/mockData';
import { useI18n } from '@/lib/i18n';
import { GlassCard } from '@/components/GlassCard';
import { StatusBadge } from '@/components/StatusBadge';

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const doctor = doctors.find(d => d.id === id);
  if (!doctor) return <div className="p-8 text-center text-muted-foreground">Doctor not found</div>;

  const assignedPatients = getPatientsByDoctor(doctor.name);

  return (
    <div className="space-y-6">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </motion.button>

      {/* Doctor Overview */}
      <GlassCard>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Stethoscope className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{doctor.name}</h1>
            <p className="text-sm text-muted-foreground">{doctor.specialization} • {doctor.department}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-primary" /> {doctor.activePatients} {t('activePatients')}</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-status-completed" /> {doctor.completedCases} {t('completedCases')}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Assigned Patients */}
      <GlassCard className="p-0 overflow-hidden" hover={false} delay={0.1}>
        <div className="px-4 py-3 border-b border-border/50">
          <h2 className="font-semibold">{t('assignedPatients')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('name')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">{t('currentStage')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">{t('testsOrdered')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {assignedPatients.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => navigate(`/patients/${p.id}`)}
                  className="border-b border-border/30 last:border-0 hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.currentStage}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.tests.length}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
