import apiClient from '../client';
import type { ClinicalReport } from '../../types';

export interface ReportInput {
  patientId: number;
  therapeuticGoal: string;
  activityPerformed: string;
  goalsAchieved: string;
  clinicalObservations: string;
  behaviorObservation: string;
  additionalComments?: string;
}

export type ReportUpdateInput = Partial<Omit<ReportInput, 'patientId'>>;

export const createReport = async (input: ReportInput): Promise<ClinicalReport> => {
  const { data } = await apiClient.post('/reports', input);
  return data.report;
};

export const updateReport = async (id: number, input: ReportUpdateInput): Promise<ClinicalReport> => {
  const { data } = await apiClient.put(`/reports/${id}`, input);
  return data.report;
};

export const deleteReport = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/reports/${id}`);
};
