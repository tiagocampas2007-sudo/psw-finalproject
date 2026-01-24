"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { getAvailableMechanics, hireMechanic } from "@/lib/api";
import type { Mechanic } from "@/lib/api";
import ConfirmModal from "@/components/common/ConfirmModal";
import "@/styles/mechanics.css";

export default function MechanicsPage() {
  const { showToast } = useToast();

  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hiring, setHiring] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAvailableMechanics();
        setMechanics(data);
      } catch {
        showToast("Erro ao carregar mecânicos.", "error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [showToast]);

  function askHire(id: string) {
    setSelectedId(id);
    setConfirmOpen(true);
  }

  async function confirmHire() {
    if (!selectedId || hiring) return;

    try {
      setHiring(true);
      await hireMechanic(selectedId);

      setMechanics((prev) => prev.filter((m) => m._id !== selectedId));

      showToast("Mecânico contratado com sucesso.", "success");
    } catch {
      showToast("Erro ao contratar mecânico.", "error");
    } finally {
      setHiring(false);
      setConfirmOpen(false);
      setSelectedId(null);
    }
  }

  return (
    <main className="mechanics-page">
      <header className="mechanics-header">
        <h1>Mecânicos disponíveis</h1>
        <p>Utilizadores candidatos a trabalhar como mecânicos.</p>
      </header>

      <section className="mechanics-card card">
        <div className="mechanics-table">
          <div className="mechanics-row mechanics-head">
            <span>Nome</span>
            <span>Email</span>
            <span>Especialidades</span>
            <span></span>
          </div>

          {!loading &&
            mechanics.map((m) => (
              <div key={m._id} className="mechanics-row">
                <span>{m.user.name}</span>
                <span>{m.user.email}</span>
                <span className="mechanics-specialties">
                  {m.specialties.map((s) => s.label).join(", ")}
                </span>
                <span className="row-actions">
                  <button
                    className="primary-btn small"
                    onClick={() => askHire(m._id)}
                    disabled={hiring}
                  >
                    Contratar
                  </button>
                </span>
              </div>
            ))}
        </div>
      </section>

      <ConfirmModal
        open={confirmOpen}
        message="Tem a certeza que deseja contratar este mecânico?"
        onConfirm={confirmHire}
        onCancel={() => setConfirmOpen(false)}
      />
    </main>
  );
}
