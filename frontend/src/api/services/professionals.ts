import apiClient from '../client';
import type { Professional } from '../../types';

export interface ProfessionalInput {
  name: string;
  email: string;
  password?: string;
  specialty: string;
  imageUrl?: string;
}

export const listProfessionals = async (): Promise<Professional[]> => {
  const { data } = await apiClient.get<Professional[]>('/admin/professionals');
  return data;
};

export const createProfessional = async (input: ProfessionalInput): Promise<Professional> => {
  const { data } = await apiClient.post('/admin/professionals', input);
  return data.professional;
};

export const updateProfessional = async (
  id: number,
  input: Partial<ProfessionalInput>
): Promise<Professional> => {
  const { data } = await apiClient.put(`/admin/professionals/${id}`, input);
  return data.professional;
};

export const deleteProfessional = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/professionals/${id}`);
};
