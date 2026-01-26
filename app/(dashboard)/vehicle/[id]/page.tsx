"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";

import {
  getVehicleById,
  getVehicleHistory,
  getBrands,
  getModelsByBrand,
} from "@/lib/api";

import type {
  Vehicle,
  VehicleAppointment,
  Brand,
  Model,
} from "@/lib/api";

import { useToast } from "@/contexts/ToastContext";
import "@/styles/vehicle-detail.css";

function minutesToHour(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [appointments, setAppointments] = useState<VehicleAppointment[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const vehicleData = await getVehicleById(id);
        setVehicle(vehicleData);

        const [historyData, brandsData] = await Promise.all([
          getVehicleHistory(id),
          getBrands(),
        ]);

        setAppointments(historyData);
        setBrands(brandsData);

        // carregar modelos da brand correta
        const modelsData = await getModelsByBrand(vehicleData.brandId);
        setModels(modelsData);
      } catch (err) {
        if (err instanceof Error) {
          showToast(err.message, "error");
        } else {
          showToast("Erro ao carregar dados do veículo.", "error");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, showToast]);

  /**
   * Resolver marca e modelo via ID numérico
   */
  const resolvedVehicle = useMemo(() => {
    if (!vehicle) return null;

    const brand = brands.find((b) => b.id === vehicle.brandId);
    const model = models.find((m) => m.id === vehicle.modelId);

    return {
      ...vehicle,
      brandName: brand?.name ?? "—",
      brandImage: brand?.image ?? "/brands/default.png",
      modelName: model?.name ?? "—",
    };
  }, [vehicle, brands, models]);

  if (loading) {
    return <p className="loading">A carregar veículo…</p>;
  }

  if (!resolvedVehicle) return null;

  return (
    <div className="vehicle-detail">
      {/* FICHA DO VEÍCULO */}
      <section className="vehicle-card">
        <div className="vehicle-header">
          <Image
            src={resolvedVehicle.brandImage}
            alt={resolvedVehicle.brandName}
            width={64}
            height={64}
            unoptimized
          />

          <div>
            <h1>
              {resolvedVehicle.brandName} {resolvedVehicle.modelName}
            </h1>
            <p className="plate">{resolvedVehicle.plate}</p>
          </div>
        </div>

        <div className="vehicle-meta">
          <span>{resolvedVehicle.year}</span>
          <span>{resolvedVehicle.fuelType}</span>
          <span>{resolvedVehicle.gearbox}</span>
          <span>{resolvedVehicle.cc}cc</span>
          <span>Cor: {resolvedVehicle.color}</span>
        </div>
      </section>

      {/* HISTÓRICO */}
      <section className="history">
        <h2>Histórico de serviços</h2>

        {appointments.length === 0 && (
          <p className="muted">
            Este veículo ainda não teve serviços registados.
          </p>
        )}

        <div className="history-list">
          {appointments.map((a) => (
            <div key={a._id} className="history-card">
              <div className="history-main">
                <strong>{a.serviceId.name}</strong>

                <div className="history-meta">
                  <span>
                    <MapPin size={14} /> {a.officeId.name}
                  </span>
                  <span>
                    <Clock size={14} />{" "}
                    {new Date(a.date).toLocaleDateString("pt-PT")} ·{" "}
                    {minutesToHour(a.startMinutes)}
                  </span>
                </div>

                {a.notes && (
                  <p className="notes">
                    <strong>Observações:</strong> {a.notes}
                  </p>
                )}
              </div>

              <div className={`status ${a.statusId.label.toLowerCase()}`}>
                {STATUS_LABELS[a.statusId.label]}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
