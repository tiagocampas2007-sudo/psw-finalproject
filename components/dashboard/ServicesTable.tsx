"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash } from "lucide-react";
import { getServicesByOfficeId, deleteService } from "@/lib/api";
import type { Service } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function ServicesTable() {
  const { showToast } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  async function loadServices() {
    try {
      const data = await getServicesByOfficeId();
      setServices(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, "error");
      } else {
        showToast("Erro ao carregar serviços.", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  });

  function askDeleteService(id: string) {
    setServiceToDelete(id);
    setConfirmOpen(true);
  }

  async function confirmDeleteService() {
    if (!serviceToDelete) return;

    try {
      await deleteService(serviceToDelete);

      setServices((prev) =>
        prev.filter((s) => s._id !== serviceToDelete)
      );

      showToast("Serviço removido com sucesso.", "success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, "error");
      } else {
        showToast("Erro ao remover serviço.", "error");
      }
    } finally {
      setConfirmOpen(false);
      setServiceToDelete(null);
    }
  }

  function cancelDeleteService() {
    setConfirmOpen(false);
    setServiceToDelete(null);
  }

  return (
    <>
      <section className="orders-card">
        <div className="orders-header orders-header-actions">
          <h2>Serviços</h2>

          <Link href="/service/new">
            <button className="primary-btn">
              <Plus size={16} />
              Novo serviço
            </button>
          </Link>
        </div>

        <div className="services-table">
          <div className="services-row services-head">
            <span>Nome</span>
            <span>Tipo</span>
            <span>Duração</span>
            <span>Preço</span>
            <span></span>
          </div>

          {loading && (
            <div className="services-row">
              <span>A carregar serviços…</span>
            </div>
          )}

          {!loading && services.length === 0 && (
            <div className="services-row">
              <span>Nenhum serviço registado.</span>
            </div>
          )}

          {services.map((service) => (
            <div key={service._id} className="services-row">
              <span>{service.name}</span>

              <span>{service.serviceTypeId?.label ?? "-"}</span>

              <span>{service.durationMinutes} min</span>

              <span>{service.price} €</span>

              <span className="row-actions">
                <Link href={`/service/${service._id}`}>
                  <button className="icon-btn">
                    <Pencil size={16} />
                  </button>
                </Link>

                <button
                  className="icon-btn danger"
                  onClick={() => askDeleteService(service._id)}
                >
                  <Trash size={16} />
                </button>
              </span>
            </div>
          ))}
        </div>
      </section>

      <ConfirmModal
        open={confirmOpen}
        message="Tem a certeza que deseja remover este serviço?"
        onConfirm={confirmDeleteService}
        onCancel={cancelDeleteService}
      />
    </>
  );
}
