export type Role = 'admin' | 'professional';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  specialty?: string;
  imageUrl?: string | null;
}

export interface Professional {
  id: number;
  name: string;
  email: string;
  specialty: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: number;
  fullName: string;
  rut: string;
  age: number;
  contactPhone?: string | null;
  guardianName?: string | null;
  initialSurveyData?: unknown;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicalReport {
  id: number;
  patientId: number;
  professionalId: number;
  professional?: { id: number; name: string; specialty: string };
  date: string;
  therapeuticGoal: string;
  activityPerformed: string;
  goalsAchieved: string;
  clinicalObservations: string;
  behaviorObservation: string;
  additionalComments?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatientFile extends Patient {
  clinicalReports: ClinicalReport[];
}
