import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import type { WorkflowStatus } from '@/lib/mockData';

const statusMap: Record<WorkflowStatus, { class: string; key: string }> = {
  completed: { class: 'status-completed', key: 'completed' },
  'in-progress': { class: 'status-in-progress', key: 'inProgress' },
  pending: { class: 'status-pending', key: 'pending' },
  delayed: { class: 'status-delayed', key: 'delayed' },
};

export function StatusBadge({ status, className }: { status: WorkflowStatus; className?: string }) {
  const { t } = useI18n();
  const config = statusMap[status];

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.class, className)}>
      {t(config.key)}
    </span>
  );
}
