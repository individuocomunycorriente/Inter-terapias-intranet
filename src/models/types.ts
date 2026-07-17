export type UserRole = 'admin' | 'professional';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  specialty?: string; // Solo para profesionales (Kinesiólogo, Psicólogo, etc.)
  createdAt: Date;
}