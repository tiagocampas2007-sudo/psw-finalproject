"use client";

import { useEffect, useState } from "react";
import { getMechanicsByOffice, deleteMechanic } from "@/lib/api";
import type { Mechanic } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function MechanicsTable() {
  const { showToast } = useToast();

  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mechanicToDelete, setMechanicToDelete] = useState<string | null>(null);

  async function loadMechanics() {
    try {
      setLoading(true);
      const data = await getMechanicsByOffice();
      setMechanics(data);
    } catch {
      showToast("Erro ao carregar mecânicos.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMechanics();
  }, []);

  function askDeleteMechanic(id: string) {
    setMechanicToDelete(id);
    setConfirmOpen(true);
  }

  async function confirmDeleteMechanic() {
    if (!mechanicToDelete) return;

    try {
      await deleteMechanic(mechanicToDelete);

      await loadMechanics();

      showToast("Mecânico despedido com sucesso.", "success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, "error");
      } else {
        showToast( "Não foi possível despedir o mecânico. Verifica se tem marcações pendentes.", "error");
      }
    } finally {
      setConfirmOpen(false);
      setMechanicToDelete(null);
    }
  }

  function cancelDeleteMechanic() {
    setConfirmOpen(false);
    setMechanicToDelete(null);
  }

  return (
    <>
      <section className="orders-card">
        <div className="orders-header">
          <h2>Mecânicos da oficina</h2>
        </div>

        <div className="services-table">
          <div className="mechanics-row services-head">
            <span>Nome</span>
            <span>Email</span>
            <span>Especialidades</span>
            <span></span>
          </div>

          {loading && (
            <div className="mechanics-row">
              <span>A carregar mecânicos…</span>
            </div>
          )}

          {!loading && mechanics.length === 0 && (
            <div className="mechanics-row">
              <span>Nenhum mecânico registado.</span>
            </div>
          )}

          {mechanics.map((m) => (
            <div key={m._id} className="mechanics-row">
              <span>{m.user.name}</span>

              <span>{m.user.email}</span>

              <span>
                {m.specialties.length > 0
                  ? m.specialties.map((s) => s.label).join(", ")
                  : "—"}
              </span>

              <span className="row-actions">
                <button
                  className="icon-btn danger"
                  onClick={() => askDeleteMechanic(m._id)}
                >
                  Despedir
                </button>
              </span>
            </div>
          ))}
        </div>
      </section>

      <ConfirmModal
        open={confirmOpen}
        message="Tem a certeza que deseja despedir este mecânico?"
        onConfirm={confirmDeleteMechanic}
        onCancel={cancelDeleteMechanic}
      />
    </>
  );
}
