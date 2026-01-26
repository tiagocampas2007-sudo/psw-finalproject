"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, MapPin, XCircle } from "lucide-react";
import {
  getMyAppointments,
  cancelAppointment,
  getMyVehicles,
} from "@/lib/api";
import type { AppointmentPage, Vehicle } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import ConfirmModal from "@/components/common/ConfirmModal";

import "@/styles/my-appointments.css";

function minutesToHour(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
};

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentPage[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(
    null
  );

  const { showToast } = useToast();

  async function loadData() {
    try {
      setLoading(true);

      const [appointmentsData, vehiclesData] = await Promise.all([
        getMyAppointments(),
        getMyVehicles(),
      ]);

      setAppointments(appointmentsData);
      setVehicles(vehiclesData);
    } catch {
      showToast("Erro ao carregar marcações.", "error");
    } finally {
      setLoading(false);
    }
  }

  function askCancelAppointment(id: string) {
    setAppointmentToCancel(id);
    setConfirmOpen(true);
  }

  async function confirmCancelAppointment() {
    if (!appointmentToCancel) return;

    try {
      await cancelAppointment(appointmentToCancel);
      showToast("Marcação cancelada com sucesso.", "success");
      loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, "error");
      } else {
        showToast("Erro ao cancelar marcação.", "error");
      }
    } finally {
      setConfirmOpen(false);
      setAppointmentToCancel(null);
    }
  }

  function cancelModal() {
    setConfirmOpen(false);
    setAppointmentToCancel(null);
  }

  useEffect(() => {
    loadData();
  }, []);

  const vehicleMap = useMemo(() => {
    const map: Record<string, Vehicle> = {};
    vehicles.forEach((v) => {
      map[v.id] = v;
    });
    return map;
  }, [vehicles]);

  return (
    <div className="my-appointments">
      <h1>As minhas marcações</h1>

      {loading && <p>A carregar marcações…</p>}

      {!loading && appointments.length === 0 && (
        <p className="muted">Ainda não tens marcações.</p>
      )}

      <div className="appointments-list">
        {appointments.map((a) => {
          const vehicle = vehicleMap[a.vehicleId];

          return (
            <div key={a._id} className="appointment-card">
              <div className="appointment-main">
                <h3>{a.serviceId.name}</h3>

                {vehicle && (
                  <div className="appointment-vehicle">
                    <span>
                      {vehicle.brand} {vehicle.model} · {vehicle.plate}
                    </span>
                  </div>
                )}

                <div className="appointment-meta">
                  <span>
                    <MapPin size={14} /> {a.officeId.name}
                  </span>
                  <span>
                    <Clock size={14} />{" "}
                    {new Date(a.date).toLocaleDateString("pt-PT")} ·{" "}
                    {minutesToHour(a.startMinutes)}
                  </span>
                </div>
              </div>

              <div className={`status ${a.statusId.label.toLowerCase()}`}>
                {APPOINTMENT_STATUS_LABELS[a.statusId.label] ??
                  a.statusId.label}
              </div>

              {a.statusId.label === "PENDING" && (
                <button
                  className="cancel-btn"
                  onClick={() => askCancelAppointment(a._id)}
                >
                  <XCircle size={16} />
                  Cancelar
                </button>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={confirmOpen}
        message="Tens a certeza que queres cancelar esta marcação?"
        onConfirm={confirmCancelAppointment}
        onCancel={cancelModal}
      />
    </div>
  );
}
