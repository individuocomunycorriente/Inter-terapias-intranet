import React, { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import ProfessionalsPanel from './ProfessionalsPanel';
import PatientsPanel from './PatientsPanel';

type Tab = 'professionals' | 'patients';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('professionals');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-emerald-900 text-white px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">InterTerapia — Panel de Administración</h1>
          <p className="text-sm text-emerald-100">Bienvenido/a, {user?.name}</p>
        </div>
        <button onClick={logout} className="bg-emerald-800 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm">
          Cerrar sesión
        </button>
      </header>

      <nav className="bg-white border-b border-slate-200 px-8 flex gap-6">
        <button
          onClick={() => setTab('professionals')}
          className={`py-3 text-sm font-medium border-b-2 ${
            tab === 'professionals' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500'
          }`}
        >
          Profesionales
        </button>
        <button
          onClick={() => setTab('patients')}
          className={`py-3 text-sm font-medium border-b-2 ${
            tab === 'patients' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500'
          }`}
        >
          Pacientes
        </button>
      </nav>

      <main className="p-8">{tab === 'professionals' ? <ProfessionalsPanel /> : <PatientsPanel />}</main>
    </div>
  );
};

export default AdminDashboard;
