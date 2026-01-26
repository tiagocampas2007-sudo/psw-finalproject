"use client";

import { useEffect, useState } from "react";
import {
  getAppointmentsByOffice,
  completeAppointment,
} from "@/lib/api";
import type { AppointmentPage } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import ConfirmModal from "@/components/common/ConfirmModal";

function minutesToHour(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
};

export default function OfficeAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentPage[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [appointmentToComplete, setAppointmentToComplete] =
    useState<string | null>(null);

  const { showToast } = useToast();

  async function loadAppointments() {
    try {
      setLoading(true);
      const data = await getAppointmentsByOffice();
      setAppointments(data);
    } catch {
      showToast("Erro ao carregar marcações da oficina.", "error");
    } finally {
      setLoading(false);
    }
  }

  console.log(appointments);

  function askComplete(id: string) {
    setAppointmentToComplete(id);
    setConfirmOpen(true);
  }

  async function confirmComplete() {
    if (!appointmentToComplete) return;

    try {
      await completeAppointment(appointmentToComplete);
      showToast("Marcação concluída com sucesso.", "success");
      loadAppointments();
    } catch {
      showToast("Erro ao concluir marcação.", "error");
    } finally {
      setConfirmOpen(false);
      setAppointmentToComplete(null);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <>
      <section className="orders-card">
        <div className="orders-header">
          <h2>Marcações da oficina</h2>
        </div>

        <div className="services-table">
          <div className="services-row services-head">
            <span>Serviço</span>
            <span>Data</span>
            <span>Hora</span>
            <span>Mecânico</span>
            <span>Estado</span>
            <span></span>
          </div>

          {loading && (
            <div className="services-row">
              <span>A carregar marcações…</span>
            </div>
          )}

          {!loading && appointments.length === 0 && (
            <div className="services-row">
              <span>Não existem marcações.</span>
            </div>
          )}

          {appointments.map((a) => (
            <div key={a._id} className="services-row">
              <span>{a.serviceId.name}</span>

              <span>{new Date(a.date).toLocaleDateString("pt-PT")}</span>

              <span>{minutesToHour(a.startMinutes)}</span>

              <span>{a.mechanicId?.user.name ?? "—"}</span>

              <span className={`status ${a.statusId.label.toLowerCase()}`}>
                {STATUS_LABELS[a.statusId.label] ?? a.statusId.label}
              </span>

              <span className="row-actions">
                {a.statusId.label === "PENDING" && (
                  <button
                    className="icon-btn"
                    onClick={() => askComplete(a._id)}
                    title="Concluir marcação"
                  >
                    Concluir
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      <ConfirmModal
        open={confirmOpen}
        message="Confirmar conclusão desta marcação?"
        onConfirm={confirmComplete}
        onCancel={() => {
          setConfirmOpen(false);
          setAppointmentToComplete(null);
        }}
      />
    </>
  );
}
