"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/contexts/ToastContext";
import {
  getMyProfile,
  updateMyProfile,
  getServiceTypes,
} from "@/lib/api";
import { applyMechanic } from "@/lib/api";
import type { User, ServiceType } from "@/lib/api";
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

  const loadData = useCallback(async () => {
    console.log('[DEBUG] Início carregamento perfil');
    
    try {
      setLoading(true);

      const profileResponse = await getMyProfile();
      console.log('[DEBUG] Resposta perfil:', profileResponse);
      
      if (profileResponse?.success && profileResponse.user) {
        setUser(profileResponse.user);
      } else {
        console.error('[DEBUG] Estrutura inválida:', profileResponse);
        setUser(null);
        return;
      }

      const types = await getServiceTypes();
      console.log('[DEBUG] Tipos de serviço (RAW):', types);
      
      // CORRIGIDO: Usa 'name' da tua BD e mapeia para 'label'
      const validTypes = types
        .filter(type => type.name && type.name.trim() !== '')
        .map(type => ({
          ...type,
          label: type.name // ← Mapeia name → label
        }));
      
      console.log('[DEBUG] Tipos após filtro:', validTypes);
      setServiceTypes(validTypes);

    } catch (error: any) {
      console.error('[DEBUG] Erro API:', error.message);
      showToast("Erro ao carregar. Faça login novamente.", "error");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveProfile = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || saving) return;

    try {
      setSaving(true);
      await updateMyProfile({ name: user.name.trim() });
      showToast("Perfil atualizado com sucesso.", "success");
    } catch (error) {
      console.error('Erro ao guardar:', error);
      showToast("Erro ao atualizar perfil.", "error");
    } finally {
      setSaving(false);
    }
  }, [user, saving, showToast]);

  const toggleServiceType = useCallback((id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  }, []);

  const askApplyMechanic = useCallback(() => {
    if (selectedTypes.length === 0) {
      showToast("Selecione pelo menos um tipo de serviço.", "error");
      return;
    }
    setConfirmOpen(true);
  }, [selectedTypes.length, showToast]);

  const confirmApplyMechanic = useCallback(async () => {
    if (saving) return;

    try {
      setSaving(true);
      await applyMechanic({ specialties: selectedTypes });
      showToast(
        "Candidatura submetida com sucesso. Aguarde contacto.",
        "success"
      );
      setSelectedTypes([]);
    } catch (error) {
      console.error('Erro candidatura:', error);
      showToast("Erro ao submeter candidatura.", "error");
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  }, [saving, selectedTypes, showToast]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading">A carregar...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div>Nenhum utilizador. <a href="/login">Faça login</a></div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Perfil - {user.name || 'Sem nome'}</h1>
        <p>Atualize os seus dados pessoais.</p>
      </header>

      <div className="profile-content">
        <section className="profile-card card">
          <h2 className="profile-card-title">Dados pessoais</h2>

          <form className="profile-form" onSubmit={handleSaveProfile}>
            <div>
              <label>Nome</label>
              <input
                value={user.name || ''}
                onChange={(e) => {
                  const newUser = { ...user, name: e.target.value } as User;
                  setUser(newUser);
                }}
                placeholder="Introduza o seu nome"
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input 
                value={user.email || ''} 
                disabled 
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="profile-actions">
              <button type="submit" disabled={saving}>
                {saving ? "A guardar..." : "Guardar alterações"}
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
                  Selecione os serviços nos quais tem experiência ({serviceTypes.length} disponíveis).
                </p>

                {serviceTypes.length === 0 ? (
                  <p className="profile-card-description error">
                    Nenhum serviço disponível na base de dados.
                  </p>
                ) : (
                  <div className="mechanic-services-grid">
                    {serviceTypes.map((type) => {
                      const active = selectedTypes.includes(type._id);
                      
                      return (
                        <button
                          key={type._id}
                          type="button"
                          className={`mechanic-service-item ${active ? "active" : ""}`}
                          onClick={() => toggleServiceType(type._id)}
                        >
                          <span className="service-name">
                            {type.label} {/* ← Agora mostra "Reparação Motor" */}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="profile-actions">
                  <button
                    type="button"
                    className="profile-mechanic-btn"
                    onClick={askApplyMechanic}
                    disabled={saving || selectedTypes.length === 0}
                  >
                    Candidatar-me ({selectedTypes.length})
                  </button>
                </div>
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
        message={`Confirmar candidatura como mecânico com ${selectedTypes.length} serviços selecionados?`}
        onConfirm={confirmApplyMechanic}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
