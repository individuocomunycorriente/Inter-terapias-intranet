import React, { useEffect, useState } from 'react';
import type { Patient } from '../../types';
import {
  listPatients,
  createPatient,
  updatePatient,
  deletePatient,
  type PatientInput,
} from '../../api/services/patients';
import { getErrorMessage } from '../../utils/errors';

const EMPTY_FORM: PatientInput = { fullName: '', rut: '', age: 0, contactPhone: '', guardianName: '' };

const PatientsPanel: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PatientInput>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setPatients(await listPatients());
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar el listado de pacientes.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial del listado al montar
    load();
  }, []);

  const startCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const startEdit = (patient: Patient) => {
    setEditingId(patient.id);
    setForm({
      fullName: patient.fullName,
      rut: patient.rut,
      age: patient.age,
      contactPhone: patient.contactPhone || '',
      guardianName: patient.guardianName || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await updatePatient(editingId, form);
      } else {
        await createPatient(form);
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el paciente.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (patient: Patient) => {
    if (!window.confirm(`¿Eliminar a ${patient.fullName}? Esta acción no se puede deshacer.`)) return;
    setError('');
    try {
      await deletePatient(patient.id);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar el paciente.'));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Pacientes</h2>
        <button
          onClick={startCreate}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Nuevo paciente
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 mb-6 space-y-3">
          <h3 className="font-semibold text-slate-700">{editingId ? 'Editar paciente' : 'Nuevo paciente'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="Nombre completo"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="RUT"
              value={form.rut}
              onChange={(e) => setForm({ ...form, rut: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              required
              type="number"
              min={0}
              placeholder="Edad"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Teléfono de contacto (opcional)"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Nombre del apoderado (opcional)"
              value={form.guardianName}
              onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm sm:col-span-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-slate-500 text-sm">Cargando...</p>
      ) : (
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">RUT</th>
                <th className="px-4 py-2">Edad</th>
                <th className="px-4 py-2">Apoderado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{patient.fullName}</td>
                  <td className="px-4 py-2">{patient.rut}</td>
                  <td className="px-4 py-2">{patient.age}</td>
                  <td className="px-4 py-2">{patient.guardianName || '—'}</td>
                  <td className="px-4 py-2 space-x-3">
                    <button onClick={() => startEdit(patient)} className="text-emerald-700 hover:underline">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(patient)} className="text-red-600 hover:underline">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    Aún no hay pacientes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientsPanel;
