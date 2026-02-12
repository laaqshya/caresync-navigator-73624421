import { motion } from 'framer-motion';
import { Stethoscope, Users, CheckCircle2, Phone } from 'lucide-react';
import { doctors } from '@/lib/mockData';
import { useI18n } from '@/lib/i18n';
import { GlassCard } from '@/components/GlassCard';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function Doctors() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleCall = (e: React.MouseEvent, doctorName: string) => {
    e.stopPropagation();
    toast({ title: '📞 Calling', description: `Initiating call to ${doctorName}...` });
  };

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold tracking-tight">
        {t('doctors')}
      </motion.h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doc, i) => (
          <GlassCard
            key={doc.id}
            delay={i * 0.08}
            className="cursor-pointer"
          >
            <div onClick={() => navigate(`/doctors/${doc.id}`)}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.specialization}</p>
                </div>
                <button
                  onClick={(e) => handleCall(e, doc.name)}
                  className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500/20 transition-colors"
                  title={`Call ${doc.name}`}
                >
                  <Phone className="w-4 h-4 text-green-600" />
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>{doc.activePatients} {t('activePatients')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-status-completed" />
                  <span>{doc.completedCases} {t('completedCases')}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
