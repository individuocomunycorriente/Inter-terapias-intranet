import React, { useState } from 'react';
import type { ClinicalReport } from '../../types';
import { getErrorMessage } from '../../utils/errors';

export interface ReportFormValues {
  therapeuticGoal: string;
  activityPerformed: string;
  goalsAchieved: string;
  clinicalObservations: string;
  behaviorObservation: string;
  additionalComments: string;
}

const EMPTY_VALUES: ReportFormValues = {
  therapeuticGoal: '',
  activityPerformed: '',
  goalsAchieved: '',
  clinicalObservations: '',
  behaviorObservation: '',
  additionalComments: '',
};

interface ReportFormProps {
  initial?: ClinicalReport | null;
  onSubmit: (values: ReportFormValues) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
}

const FIELDS: Array<{ key: keyof ReportFormValues; label: string; required?: boolean }> = [
  { key: 'therapeuticGoal', label: 'Objetivo terapéutico', required: true },
  { key: 'activityPerformed', label: 'Actividad realizada', required: true },
  { key: 'goalsAchieved', label: 'Cumplimiento de logros', required: true },
  { key: 'clinicalObservations', label: 'Observaciones clínicas', required: true },
  { key: 'behaviorObservation', label: 'Observación de trato / conducta', required: true },
  { key: 'additionalComments', label: 'Observaciones adicionales (opcional)' },
];

const ReportForm: React.FC<ReportFormProps> = ({ initial, onSubmit, onCancel, submitLabel }) => {
  const [values, setValues] = useState<ReportFormValues>(
    initial
      ? {
          therapeuticGoal: initial.therapeuticGoal,
          activityPerformed: initial.activityPerformed,
          goalsAchieved: initial.goalsAchieved,
          clinicalObservations: initial.clinicalObservations,
          behaviorObservation: initial.behaviorObservation,
          additionalComments: initial.additionalComments || '',
        }
      : EMPTY_VALUES
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(values);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el informe.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>}
      {FIELDS.map((field) => (
        <div key={field.key}>
          <label className="block text-xs font-semibold text-slate-500 mb-1">{field.label}</label>
          <textarea
            required={field.required}
            rows={2}
            value={values[field.key]}
            onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      ))}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {saving ? 'Guardando...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ReportForm;
