import React, { useEffect, useState } from 'react';
import type { Professional } from '../../types';
import {
  listProfessionals,
  createProfessional,
  updateProfessional,
  deleteProfessional,
  type ProfessionalInput,
} from '../../api/services/professionals';
import { getErrorMessage } from '../../utils/errors';

const EMPTY_FORM: ProfessionalInput = { name: '', email: '', password: '', specialty: '', imageUrl: '' };

const ProfessionalsPanel: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProfessionalInput>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setProfessionals(await listProfessionals());
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar el listado de profesionales.'));
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

  const startEdit = (professional: Professional) => {
    setEditingId(professional.id);
    setForm({
      name: professional.name,
      email: professional.email,
      password: '',
      specialty: professional.specialty,
      imageUrl: professional.imageUrl || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        const payload: Partial<ProfessionalInput> = { ...form };
        if (!payload.password) delete payload.password;
        await updateProfessional(editingId, payload);
      } else {
        await createProfessional(form);
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el profesional.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (professional: Professional) => {
    if (!window.confirm(`¿Eliminar a ${professional.name}? Esta acción no se puede deshacer.`)) return;
    setError('');
    try {
      await deleteProfessional(professional.id);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar el profesional.'));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Profesionales</h2>
        <button
          onClick={startCreate}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Nuevo profesional
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 mb-6 space-y-3">
          <h3 className="font-semibold text-slate-700">{editingId ? 'Editar profesional' : 'Nuevo profesional'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="Nombre completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              required
              type="email"
              placeholder="correo@interterapia.cl"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="Especialidad"
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="password"
              placeholder={editingId ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              required={!editingId}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="URL de foto (opcional)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
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
                <th className="px-4 py-2">Correo</th>
                <th className="px-4 py-2">Especialidad</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {professionals.map((professional) => (
                <tr key={professional.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{professional.name}</td>
                  <td className="px-4 py-2">{professional.email}</td>
                  <td className="px-4 py-2">{professional.specialty}</td>
                  <td className="px-4 py-2 space-x-3">
                    <button onClick={() => startEdit(professional)} className="text-emerald-700 hover:underline">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(professional)} className="text-red-600 hover:underline">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {professionals.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    Aún no hay profesionales registrados.
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

export default ProfessionalsPanel;
