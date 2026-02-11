export type WorkflowStatus = 'completed' | 'in-progress' | 'pending' | 'delayed';

export type WorkflowStage =
  | 'OPD Visit'
  | 'Consultation'
  | 'Lab Ordered'
  | 'Sample Collected'
  | 'Result Uploaded'
  | 'Prescription Dispensed';

export const WORKFLOW_STAGES: WorkflowStage[] = [
  'OPD Visit',
  'Consultation',
  'Lab Ordered',
  'Sample Collected',
  'Result Uploaded',
  'Prescription Dispensed',
];

export interface TimelineEvent {
  stage: WorkflowStage;
  timestamp: string;
  status: WorkflowStatus;
  department: string;
}

export interface TestReport {
  testName: string;
  orderedBy: string;
  resultStatus: WorkflowStatus;
  reportFile?: string;
  uploadTimestamp?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  assignedDoctor: string;
  currentStage: WorkflowStage;
  status: WorkflowStatus;
  lastUpdated: string;
  timeline: TimelineEvent[];
  tests: TestReport[];
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  activePatients: number;
  completedCases: number;
  avatar?: string;
}

export const patients: Patient[] = [
  {
    id: 'PT-1001',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    assignedDoctor: 'Dr. Sarah Chen',
    currentStage: 'Result Uploaded',
    status: 'in-progress',
    lastUpdated: '2026-02-11 09:30',
    timeline: [
      { stage: 'OPD Visit', timestamp: '2026-02-10 08:00', status: 'completed', department: 'OPD' },
      { stage: 'Consultation', timestamp: '2026-02-10 09:15', status: 'completed', department: 'Cardiology' },
      { stage: 'Lab Ordered', timestamp: '2026-02-10 10:00', status: 'completed', department: 'Cardiology' },
      { stage: 'Sample Collected', timestamp: '2026-02-10 11:30', status: 'completed', department: 'Lab' },
      { stage: 'Result Uploaded', timestamp: '2026-02-11 09:30', status: 'in-progress', department: 'Lab' },
      { stage: 'Prescription Dispensed', timestamp: '', status: 'pending', department: 'Pharmacy' },
    ],
    tests: [
      { testName: 'CBC', orderedBy: 'Dr. Sarah Chen', resultStatus: 'completed', reportFile: 'cbc_report.pdf', uploadTimestamp: '2026-02-11 09:30' },
      { testName: 'Lipid Panel', orderedBy: 'Dr. Sarah Chen', resultStatus: 'in-progress' },
    ],
  },
  {
    id: 'PT-1002',
    name: 'Maria Garcia',
    age: 32,
    gender: 'Female',
    assignedDoctor: 'Dr. James Wilson',
    currentStage: 'Prescription Dispensed',
    status: 'completed',
    lastUpdated: '2026-02-11 08:00',
    timeline: [
      { stage: 'OPD Visit', timestamp: '2026-02-09 07:30', status: 'completed', department: 'OPD' },
      { stage: 'Consultation', timestamp: '2026-02-09 08:45', status: 'completed', department: 'Dermatology' },
      { stage: 'Lab Ordered', timestamp: '2026-02-09 09:30', status: 'completed', department: 'Dermatology' },
      { stage: 'Sample Collected', timestamp: '2026-02-09 10:15', status: 'completed', department: 'Lab' },
      { stage: 'Result Uploaded', timestamp: '2026-02-10 14:00', status: 'completed', department: 'Lab' },
      { stage: 'Prescription Dispensed', timestamp: '2026-02-11 08:00', status: 'completed', department: 'Pharmacy' },
    ],
    tests: [
      { testName: 'Skin Biopsy', orderedBy: 'Dr. James Wilson', resultStatus: 'completed', reportFile: 'biopsy.pdf', uploadTimestamp: '2026-02-10 14:00' },
    ],
  },
  {
    id: 'PT-1003',
    name: 'Robert Smith',
    age: 58,
    gender: 'Male',
    assignedDoctor: 'Dr. Sarah Chen',
    currentStage: 'Lab Ordered',
    status: 'pending',
    lastUpdated: '2026-02-10 16:00',
    timeline: [
      { stage: 'OPD Visit', timestamp: '2026-02-10 14:00', status: 'completed', department: 'OPD' },
      { stage: 'Consultation', timestamp: '2026-02-10 15:30', status: 'completed', department: 'Cardiology' },
      { stage: 'Lab Ordered', timestamp: '2026-02-10 16:00', status: 'pending', department: 'Cardiology' },
      { stage: 'Sample Collected', timestamp: '', status: 'pending', department: 'Lab' },
      { stage: 'Result Uploaded', timestamp: '', status: 'pending', department: 'Lab' },
      { stage: 'Prescription Dispensed', timestamp: '', status: 'pending', department: 'Pharmacy' },
    ],
    tests: [
      { testName: 'ECG', orderedBy: 'Dr. Sarah Chen', resultStatus: 'pending' },
      { testName: 'Troponin', orderedBy: 'Dr. Sarah Chen', resultStatus: 'pending' },
    ],
  },
  {
    id: 'PT-1004',
    name: 'Emily Johnson',
    age: 29,
    gender: 'Female',
    assignedDoctor: 'Dr. Aisha Patel',
    currentStage: 'Sample Collected',
    status: 'delayed',
    lastUpdated: '2026-02-09 11:00',
    timeline: [
      { stage: 'OPD Visit', timestamp: '2026-02-08 09:00', status: 'completed', department: 'OPD' },
      { stage: 'Consultation', timestamp: '2026-02-08 10:30', status: 'completed', department: 'Endocrinology' },
      { stage: 'Lab Ordered', timestamp: '2026-02-08 11:00', status: 'completed', department: 'Endocrinology' },
      { stage: 'Sample Collected', timestamp: '2026-02-09 11:00', status: 'delayed', department: 'Lab' },
      { stage: 'Result Uploaded', timestamp: '', status: 'pending', department: 'Lab' },
      { stage: 'Prescription Dispensed', timestamp: '', status: 'pending', department: 'Pharmacy' },
    ],
    tests: [
      { testName: 'Thyroid Panel', orderedBy: 'Dr. Aisha Patel', resultStatus: 'delayed' },
      { testName: 'HbA1c', orderedBy: 'Dr. Aisha Patel', resultStatus: 'delayed' },
    ],
  },
  {
    id: 'PT-1005',
    name: 'David Lee',
    age: 67,
    gender: 'Male',
    assignedDoctor: 'Dr. James Wilson',
    currentStage: 'Consultation',
    status: 'in-progress',
    lastUpdated: '2026-02-11 10:15',
    timeline: [
      { stage: 'OPD Visit', timestamp: '2026-02-11 08:30', status: 'completed', department: 'OPD' },
      { stage: 'Consultation', timestamp: '2026-02-11 10:15', status: 'in-progress', department: 'Orthopedics' },
      { stage: 'Lab Ordered', timestamp: '', status: 'pending', department: '' },
      { stage: 'Sample Collected', timestamp: '', status: 'pending', department: '' },
      { stage: 'Result Uploaded', timestamp: '', status: 'pending', department: '' },
      { stage: 'Prescription Dispensed', timestamp: '', status: 'pending', department: '' },
    ],
    tests: [],
  },
  {
    id: 'PT-1006',
    name: 'Sophie Williams',
    age: 41,
    gender: 'Female',
    assignedDoctor: 'Dr. Aisha Patel',
    currentStage: 'Result Uploaded',
    status: 'delayed',
    lastUpdated: '2026-02-08 17:00',
    timeline: [
      { stage: 'OPD Visit', timestamp: '2026-02-06 09:00', status: 'completed', department: 'OPD' },
      { stage: 'Consultation', timestamp: '2026-02-06 10:00', status: 'completed', department: 'Endocrinology' },
      { stage: 'Lab Ordered', timestamp: '2026-02-06 10:30', status: 'completed', department: 'Endocrinology' },
      { stage: 'Sample Collected', timestamp: '2026-02-07 09:00', status: 'completed', department: 'Lab' },
      { stage: 'Result Uploaded', timestamp: '2026-02-08 17:00', status: 'delayed', department: 'Lab' },
      { stage: 'Prescription Dispensed', timestamp: '', status: 'pending', department: 'Pharmacy' },
    ],
    tests: [
      { testName: 'Cortisol Level', orderedBy: 'Dr. Aisha Patel', resultStatus: 'delayed' },
    ],
  },
  {
    id: 'PT-1007',
    name: 'Ahmed Hassan',
    age: 53,
    gender: 'Male',
    assignedDoctor: 'Dr. Sarah Chen',
    currentStage: 'Prescription Dispensed',
    status: 'completed',
    lastUpdated: '2026-02-10 15:00',
    timeline: [
      { stage: 'OPD Visit', timestamp: '2026-02-09 07:00', status: 'completed', department: 'OPD' },
      { stage: 'Consultation', timestamp: '2026-02-09 08:30', status: 'completed', department: 'Cardiology' },
      { stage: 'Lab Ordered', timestamp: '2026-02-09 09:00', status: 'completed', department: 'Cardiology' },
      { stage: 'Sample Collected', timestamp: '2026-02-09 10:00', status: 'completed', department: 'Lab' },
      { stage: 'Result Uploaded', timestamp: '2026-02-10 11:00', status: 'completed', department: 'Lab' },
      { stage: 'Prescription Dispensed', timestamp: '2026-02-10 15:00', status: 'completed', department: 'Pharmacy' },
    ],
    tests: [
      { testName: 'Cardiac Enzymes', orderedBy: 'Dr. Sarah Chen', resultStatus: 'completed', reportFile: 'cardiac.pdf', uploadTimestamp: '2026-02-10 11:00' },
    ],
  },
  {
    id: 'PT-1008',
    name: 'Lisa Chen',
    age: 36,
    gender: 'Female',
    assignedDoctor: 'Dr. James Wilson',
    currentStage: 'Lab Ordered',
    status: 'pending',
    lastUpdated: '2026-02-11 07:45',
    timeline: [
      { stage: 'OPD Visit', timestamp: '2026-02-11 06:30', status: 'completed', department: 'OPD' },
      { stage: 'Consultation', timestamp: '2026-02-11 07:15', status: 'completed', department: 'Dermatology' },
      { stage: 'Lab Ordered', timestamp: '2026-02-11 07:45', status: 'pending', department: 'Dermatology' },
      { stage: 'Sample Collected', timestamp: '', status: 'pending', department: 'Lab' },
      { stage: 'Result Uploaded', timestamp: '', status: 'pending', department: 'Lab' },
      { stage: 'Prescription Dispensed', timestamp: '', status: 'pending', department: 'Pharmacy' },
    ],
    tests: [
      { testName: 'Allergy Panel', orderedBy: 'Dr. James Wilson', resultStatus: 'pending' },
    ],
  },
];

export const doctors: Doctor[] = [
  { id: 'DR-001', name: 'Dr. Sarah Chen', specialization: 'Cardiology', department: 'Cardiology', activePatients: 3, completedCases: 45 },
  { id: 'DR-002', name: 'Dr. James Wilson', specialization: 'Dermatology', department: 'Dermatology', activePatients: 2, completedCases: 38 },
  { id: 'DR-003', name: 'Dr. Aisha Patel', specialization: 'Endocrinology', department: 'Endocrinology', activePatients: 2, completedCases: 52 },
];

export function getPatientsByDoctor(doctorName: string): Patient[] {
  return patients.filter(p => p.assignedDoctor === doctorName);
}

export function getActivePatients(): Patient[] {
  return patients.filter(p => p.status === 'in-progress' || p.status === 'pending');
}

export function getPendingPatients(): Patient[] {
  return patients.filter(p => p.status === 'pending');
}

export function getDelayedPatients(): Patient[] {
  return patients.filter(p => p.status === 'delayed');
}

export function getCompletedToday(): Patient[] {
  return patients.filter(p => p.status === 'completed' && p.lastUpdated.startsWith('2026-02-11'));
}
