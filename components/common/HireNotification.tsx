"use client";

import { useEffect, useState } from "react";
import { getHireNotification, markHireSeen } from "@/lib/api";
import "@/styles/components/HireNotification.css";

export default function HireNotification() {
  const [open, setOpen] = useState(false);
  const [office, setOffice] = useState<string>("");

  useEffect(() => {
    async function check() {
      try {
        const res = await getHireNotification();

        if (res?.show) {
          setOffice(res.officeName ?? "");
          setOpen(true);
        }
      } catch {
      }
    }

    check();
  }, []);

  async function handleConfirm() {
    try {
      await markHireSeen();
    } finally {
      setOpen(false);
    }
  }

  if (!open) return null;

  return (
    <div className="hire-notification-backdrop">
      <div className="hire-notification-card">
        <div className="hire-notification-emoji">🎉</div>

        <h2 className="hire-notification-title">
          Parabéns!
        </h2>

        <p className="hire-notification-text">
          Foste contratado para trabalhar na oficina
          <strong> {office}</strong>.
        </p>

        <div className="hire-notification-features">
          <p>A partir de agora tens acesso a:</p>
          <ul>
            <li>Consulta da tua agenda</li>
            <li>Visualização de marcações</li>
            <li>Gestão dos serviços atribuídos</li>
          </ul>
        </div>

        <button
          className="hire-notification-btn"
          onClick={handleConfirm}
        >
          Começar 🚀
        </button>
      </div>
    </div>
  );
}
