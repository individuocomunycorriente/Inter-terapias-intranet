import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import type { Patient } from '../../types';
import { listPatients } from '../../api/services/patients';
import PatientDetail from './PatientDetail';

const TherapistDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    listPatients()
      .then(setPatients)
      .catch((err) => setError(err.response?.data?.message || 'No se pudo cargar el listado de pacientes.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-emerald-900 text-white px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">InterTerapia — Panel Clínico</h1>
          <p className="text-sm text-emerald-100">
            Bienvenido/a, {user?.name} {user?.specialty ? `(${user.specialty})` : ''}
          </p>
        </div>
        <button onClick={logout} className="bg-emerald-800 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm">
          Cerrar sesión
        </button>
      </header>

      <main className="p-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="bg-white border border-slate-200 rounded-xl p-4 h-fit">
          <h2 className="font-semibold text-slate-700 mb-3">Pacientes</h2>
          <input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-3"
          />
          {loading && <p className="text-slate-400 text-sm">Cargando...</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
            {filteredPatients.map((patient) => (
              <li key={patient.id}>
                <button
                  onClick={() => setSelectedId(patient.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedId === patient.id ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {patient.fullName}
                </button>
              </li>
            ))}
            {!loading && filteredPatients.length === 0 && (
              <li className="text-slate-400 text-sm px-3 py-2">Sin resultados.</li>
            )}
          </ul>
        </aside>

        <section>
          {selectedId ? (
            <PatientDetail patientId={selectedId} />
          ) : (
            <p className="text-slate-400 text-sm">Selecciona un paciente para ver su ficha e informes.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default TherapistDashboard;
