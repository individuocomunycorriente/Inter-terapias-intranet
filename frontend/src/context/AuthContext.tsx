import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import type { AuthUser } from '../types';
import { AuthContext } from './authContextInstance';

function extractUser(data: { administrator?: AuthUser; professional?: AuthUser }): AuthUser | null {
  return data.administrator ?? data.professional ?? null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // La sesión vive en una cookie httpOnly; la restauramos preguntándole al backend
    // en vez de confiar en algo guardado localmente en el navegador.
    let cancelled = false;

    apiClient
      .get('/auth/me')
      .then((response) => {
        if (!cancelled) setUser(extractUser(response.data));
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
