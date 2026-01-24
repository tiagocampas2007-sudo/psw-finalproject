"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import {
  getMyProfile,
  updateMyProfile,
  getServiceTypes,
} from "@/lib/api";
import { applyMechanic } from "@/lib/api";
import type { User, ServiceType } from "@/lib/api";
import { serviceTypeIconMap } from "@/lib/serviceTypeIcons";
import ConfirmModal from "@/components/common/ConfirmModal";
import "@/styles/profile.css";

export default function ProfilePage() {
  const { showToast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [profile, types] = await Promise.all([
          getMyProfile(),
          getServiceTypes(),
        ]);

        setUser(profile);
        setServiceTypes(types);
      } catch (err: unknown) {
        console.log(err);
        showToast("Erro ao carregar perfil.", "error");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [showToast]);

  console.log(user);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user || saving) return;

    try {
      setSaving(true);
      await updateMyProfile({ name: user.name.trim() });
      showToast("Perfil atualizado com sucesso.", "success");
    } catch {
      showToast("Erro ao atualizar perfil.", "error");
    } finally {
      setSaving(false);
    }
  }

  function toggleServiceType(id: string) {
    setSelectedTypes((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  }

  function askApplyMechanic() {
    if (selectedTypes.length === 0) {
      showToast("Selecione pelo menos um tipo de serviço.", "error");
      return;
    }

    setConfirmOpen(true);
  }

  async function confirmApplyMechanic() {
    if (saving) return;

    try {
      setSaving(true);

      await applyMechanic({
        specialties: selectedTypes,
      });

      showToast(
        "Candidatura submetida com sucesso. Aguarde contacto de uma oficina.",
        "success"
      );
    } catch {
      showToast("Erro ao submeter candidatura.", "error");
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  }

  if (loading || !user) return null;

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Perfil</h1>
        <p>Atualize os seus dados pessoais e preferências.</p>
      </header>

      <div className="profile-content">
        <section className="profile-card card">
          <h2 className="profile-card-title">Dados pessoais</h2>

          <form className="profile-form" onSubmit={handleSaveProfile}>
            <div>
              <label>Nome</label>
              <input
                value={user.name}
                onChange={(e) =>
                  setUser({ ...user, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input value={user.email} disabled />
            </div>

            <div className="profile-actions">
              <button type="submit" disabled={saving}>
                Guardar alterações
              </button>
            </div>
          </form>
        </section>

        {user.role === "CLIENT" && (
          <section className="profile-card card profile-mechanic-card">
            <h2 className="profile-card-title">Trabalhar como mecânico</h2>

            {!user.mechanic ? (
              <>
                <p className="profile-card-description">
                  Selecione os serviços nos quais tem experiência.
                </p>

                <div className="mechanic-services-grid">
                  {serviceTypes.map((type) => {
                    const Icon =
                      serviceTypeIconMap[type.slug] ??
                      serviceTypeIconMap.default;

                    const active = selectedTypes.includes(type._id);

                    return (
                      <button
                        key={type._id}
                        type="button"
                        className={`mechanic-service-item ${
                          active ? "active" : ""
                        }`}
                        onClick={() => toggleServiceType(type._id)}
                      >
                        <Icon size={20} />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="profile-mechanic-btn"
                  onClick={askApplyMechanic}
                  disabled={saving}
                >
                  Candidatar-me como mecânico
                </button>
              </>
            ) : (
              <p className="profile-card-description success">
                A sua candidatura foi submetida com sucesso.
              </p>
            )}
          </section>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        message="Tem a certeza que deseja candidatar-se como mecânico com os serviços selecionados?"
        onConfirm={confirmApplyMechanic}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
