import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import apiClient from '../api/client';
import { getErrorMessage } from '../utils/errors';
import { Shield, Stethoscope, Lock, Mail, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { professional, administrator } = response.data;
      const authenticatedUser = administrator ?? professional;

      login(authenticatedUser);
      navigate(authenticatedUser.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Error de conexión con el servidor'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
        
        {/* Encabezado Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-emerald-100 rounded-full text-emerald-700 mb-3">
            <Stethoscope size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">InterTerapia</h1>
          <p className="text-slate-500 text-sm">Intranet de Gestión Clínica</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm border border-red-100">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@interterapia.cl"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Validando Credenciales...' : 'Ingresar a la Plataforma'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center flex justify-center items-center gap-1.5 text-xs text-slate-400">
          <Shield size={14} /> Conexión cifrada de extremo a extremo
        </div>
      </div>
    </div>
  );
};

export default Login;