"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getMyAgenda } from "@/lib/api";
import type { AgendaAppointment } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";

import "@/styles/agenda.css";

function minutesToHour(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function MechanicAgendaPage() {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<AgendaAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAgenda()
      .then(setAppointments)
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const groupedByDate = useMemo(() => {
    const map: Record<string, AgendaAppointment[]> = {};

    appointments.forEach((a) => {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });

    return map;
  }, [appointments]);

  return (
    <div className="agenda-page">
      <header className="agenda-header">
        <h1>Agenda</h1>
        <p>Marcações pendentes atribuídas a si</p>
      </header>

      {loading && <p>A carregar agenda…</p>}

      {!loading && appointments.length === 0 && (
        <p className="muted">Sem marcações pendentes.</p>
      )}

      <div className="agenda-list">
        {Object.entries(groupedByDate).map(([date, items]) => (
          <section key={date} className="agenda-day">
            <h2>
              {new Date(date).toLocaleDateString("pt-PT", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </h2>

            <div className="agenda-items">
              {items.map((a) => (
                <div key={a._id} className="agenda-item">
                  <div className="agenda-main">
                    <strong>{a.serviceId.name}</strong>

                    <span>
                      <Clock size={14} /> {minutesToHour(a.startMinutes)} - {minutesToHour(a.endMinutes)}
                    </span>

                    <Link
                      href={`/vehicle/${a.vehicleId._id}`}
                      className="vehicle-link"
                    >
                      Ver veículo
                    </Link>
                  </div>

                  {a.notes && (
                    <p className="agenda-notes">{a.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
