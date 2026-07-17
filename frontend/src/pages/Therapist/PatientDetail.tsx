import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import type { PatientFile, ClinicalReport } from '../../types';
import { getPatientFile } from '../../api/services/patients';
import { createReport, updateReport } from '../../api/services/reports';
import { getErrorMessage } from '../../utils/errors';
import ReportForm, { type ReportFormValues } from './ReportForm';

interface PatientDetailProps {
  patientId: number;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patientId }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<PatientFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingReport, setEditingReport] = useState<ClinicalReport | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setFile(await getPatientFile(patientId));
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la ficha del paciente.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- resetea el formulario y recarga la ficha al cambiar de paciente seleccionado */
    setShowNewForm(false);
    setEditingReport(null);
    load();
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleCreate = async (values: ReportFormValues) => {
    await createReport({ patientId, ...values });
    setShowNewForm(false);
    await load();
  };

  const handleUpdate = async (values: ReportFormValues) => {
    if (!editingReport) return;
    await updateReport(editingReport.id, values);
    setEditingReport(null);
    await load();
  };

  if (loading) return <p className="text-slate-500 text-sm">Cargando ficha del paciente...</p>;
  if (error) return <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>;
  if (!file) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="text-xl font-semibold text-slate-800">{file.fullName}</h2>
        <p className="text-sm text-slate-500">
          RUT: {file.rut} · Edad: {file.age} {file.guardianName ? `· Apoderado/a: ${file.guardianName}` : ''}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">Historial de informes</h3>
        {!showNewForm && (
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + Nuevo informe
          </button>
        )}
      </div>

      {showNewForm && (
        <ReportForm submitLabel="Enviar informe" onSubmit={handleCreate} onCancel={() => setShowNewForm(false)} />
      )}

      <div className="space-y-4">
        {file.clinicalReports.length === 0 && (
          <p className="text-slate-400 text-sm">Este paciente aún no tiene informes registrados.</p>
        )}
        {file.clinicalReports.map((report) => {
          const isOwner = user?.role === 'professional' && report.professionalId === user.id;
          const isEditing = editingReport?.id === report.id;

          if (isEditing) {
            return (
              <ReportForm
                key={report.id}
                initial={report}
                submitLabel="Guardar cambios"
                onSubmit={handleUpdate}
                onCancel={() => setEditingReport(null)}
              />
            );
          }

          return (
            <div key={report.id} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-700">
                  {report.professional?.name} · {report.professional?.specialty}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{new Date(report.date).toLocaleDateString('es-CL')}</span>
                  {isOwner && (
                    <button onClick={() => setEditingReport(report)} className="text-emerald-700 text-sm hover:underline">
                      Editar
                    </button>
                  )}
                </div>
              </div>
              <dl className="text-sm text-slate-600 space-y-1">
                <div>
                  <dt className="font-medium text-slate-500 inline">Objetivo terapéutico: </dt>
                  <dd className="inline">{report.therapeuticGoal}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500 inline">Actividad realizada: </dt>
                  <dd className="inline">{report.activityPerformed}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500 inline">Cumplimiento de logros: </dt>
                  <dd className="inline">{report.goalsAchieved}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500 inline">Observaciones clínicas: </dt>
                  <dd className="inline">{report.clinicalObservations}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500 inline">Observación de trato/conducta: </dt>
                  <dd className="inline">{report.behaviorObservation}</dd>
                </div>
                {report.additionalComments && (
                  <div>
                    <dt className="font-medium text-slate-500 inline">Observaciones adicionales: </dt>
                    <dd className="inline">{report.additionalComments}</dd>
                  </div>
                )}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PatientDetail;
