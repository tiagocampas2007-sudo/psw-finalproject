"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getServiceById,
  createService,
  updateService,
} from "@/lib/api";
import { getServiceTypes } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import type { ServicePayload, ServiceType } from "@/lib/api";
import { getServiceTypeIcon } from "@/lib/serviceTypeIcons";
import "@/styles/service.css";

const EMPTY_FORM: ServicePayload = {
  name: "",
  durationMinutes: 30,
  price: 0,
  description: "",
  minAdvanceDays: 1,
  serviceTypeId: "",
};

export default function ServicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const isNew = id === "new";

  const [form, setForm] = useState<ServicePayload>(EMPTY_FORM);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedType = serviceTypes.find((t) => t._id === form.serviceTypeId);
  const Icon = getServiceTypeIcon(selectedType?.slug);

  const isFormValid =
  form.name.trim().length > 0 &&
  form.durationMinutes >= 1 &&
  form.price >= 0 &&
  form.minAdvanceDays >= 1 &&
  form.serviceTypeId.trim().length > 0;

  useEffect(() => {
    async function loadData() {
      try {
        const types = await getServiceTypes();
        setServiceTypes(types);

        if (!isNew) {
          const service = await getServiceById(id);

          setForm({
            name: service.name,
            durationMinutes: service.durationMinutes,
            price: service.price,
            description: service.description,
            minAdvanceDays: service.minAdvanceDays,
            serviceTypeId: service.serviceTypeId._id,
          });
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          showToast(err.message, "error");
        } else {
          showToast("Erro desconhecido ao carregar dados.", "error");
        }
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, isNew, router, showToast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (isNew) {
        await createService(form);
        showToast("Serviço criado com sucesso.");
      } else {
        await updateService(id, form);
        showToast("Serviço atualizado com sucesso.");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, "error");
      } else {
        showToast("Erro desconhecido ao guardar serviço.", "error");
      }
   }
 }

  if (loading) return null;

return (
  <div className="services-page">
    <header className="services-header">
      <h1 className="services-title">
        {isNew ? "Criar novo serviço" : `Editar · ${form.name || "Serviço"}`}
      </h1>
      <p className="services-description">
        {isNew
          ? "Defina as informações do novo serviço disponibilizado pela oficina."
          : "Atualize os dados do serviço existente."}
      </p>
    </header>

    <main className="services-content">
      <div className="services-grid">
        <div className="services-card-wrapper">
          <span className="services-card-label">Formulário</span>

          <form className="services-form card" onSubmit={handleSubmit}>
            <div className="services-form-grid">
              <div>
                <label>Nome</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label>Duração (min)</label>
                <input
                  type="number"
                  min={1}
                  value={form.durationMinutes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      durationMinutes: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div>
                <label>Preço (€)</label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div>
                <label>Tipo de Serviço</label>
                <select
                  value={form.serviceTypeId}
                  onChange={(e) =>
                    setForm({ ...form, serviceTypeId: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Selecionar tipo
                  </option>

                  {serviceTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="advance-days">
              <label>Dias de avanço de marcação</label>
              <input
                type="number"
                min={1}
                max={30}
                value={form.minAdvanceDays}
                onChange={(e) =>
                  setForm({ ...form, minAdvanceDays: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label>Descrição</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="services-form-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => router.push("/dashboard")}
              >
                Cancelar
              </button>
              <button type="submit" disabled={!isFormValid}>
                {isNew ? "Criar serviço" : "Guardar alterações"}
              </button>
            </div>
          </form>
        </div>

        <div className="services-card-wrapper">
          <span className="services-card-label">Pré-visualização</span>

          <div className="service-preview-card">
            <div className="service-preview-header">
              <div className="service-preview-icon">
                <Icon size={24} />
              </div>
            </div>

            <h3 className="service-preview-title">
              {form.name || "Nome do serviço"}
            </h3>

            <p className="service-preview-description">
              {form.description ||
                "Descrição do serviço apresentada ao cliente."}
            </p>

            <div className="service-preview-meta">
              <span>{form.durationMinutes} min</span>
              <span>{form.price || "Preço"} €</span>
            </div>

            <button className="service-preview-button">
              Agendar →
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
);

}
