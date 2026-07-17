declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: 'admin' | 'professional';
        specialty?: string;
      };
    }
  }
}

export {};
