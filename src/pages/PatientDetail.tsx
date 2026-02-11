import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2, Clock, AlertTriangle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { patients, WORKFLOW_STAGES, type WorkflowStatus } from '@/lib/mockData';
import { useI18n } from '@/lib/i18n';
import { GlassCard } from '@/components/GlassCard';
import { StatusBadge } from '@/components/StatusBadge';

const stageIcons: Record<WorkflowStatus, any> = {
  completed: CheckCircle2,
  'in-progress': Clock,
  pending: Circle,
  delayed: AlertTriangle,
};

const stageColors: Record<WorkflowStatus, string> = {
  completed: 'text-status-completed',
  'in-progress': 'text-status-in-progress',
  pending: 'text-muted-foreground',
  delayed: 'text-status-delayed',
};

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const patient = patients.find(p => p.id === id);
  if (!patient) return <div className="p-8 text-center text-muted-foreground">Patient not found</div>;

  const completedStages = patient.timeline.filter(e => e.status === 'completed').length;
  const progress = (completedStages / WORKFLOW_STAGES.length) * 100;

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

      {/* Patient Summary */}
      <GlassCard>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{patient.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>{t('age')}: {patient.age}</span>
              <span>{patient.gender}</span>
              <span>{patient.assignedDoctor}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={patient.status} className="text-sm px-3 py-1" />
            <span className="text-sm text-muted-foreground">{patient.currentStage}</span>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>{t('progressTracker')}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Timeline */}
        <GlassCard delay={0.1}>
          <h2 className="text-lg font-semibold mb-6">{t('timeline')}</h2>
          <div className="relative space-y-0">
            {patient.timeline.map((event, i) => {
              const Icon = stageIcons[event.status];
              const color = stageColors[event.status];
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === 'completed' ? 'bg-status-completed/10' :
                      event.status === 'in-progress' ? 'bg-status-in-progress/10' :
                      event.status === 'delayed' ? 'bg-status-delayed/10' :
                      'bg-secondary'
                    }`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    {i < patient.timeline.length - 1 && (
                      <div className={`w-px flex-1 min-h-[32px] ${
                        event.status === 'completed' ? 'bg-status-completed/30' : 'bg-border'
                      }`} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium">{event.stage}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.timestamp || '—'}
                      {event.department && ` • ${event.department}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Tests & Reports */}
        <GlassCard delay={0.2}>
          <h2 className="text-lg font-semibold mb-4">{t('testsReports')}</h2>
          {patient.tests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tests ordered yet.</p>
          ) : (
            <div className="space-y-3">
              {patient.tests.map((test, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium">{test.testName}</p>
                    <p className="text-xs text-muted-foreground">{t('orderedBy')}: {test.orderedBy}</p>
                    {test.uploadTimestamp && (
                      <p className="text-xs text-muted-foreground">{test.uploadTimestamp}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={test.resultStatus} />
                    {test.reportFile && (
                      <button className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
