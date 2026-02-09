"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Trash2 } from "lucide-react";
import {
  getBrands,
  getModelsByBrand,
  getMyVehicles,
  createVehicle,
  deleteVehicle,
} from "@/lib/api";
import type { Brand, Model, Vehicle } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import ConfirmModal from "@/components/common/ConfirmModal";
import "@/styles/garage.css";

const FUEL_TYPES = ["Gasóleo", "Gasolina", "Elétrico", "Híbrido"];
const GEARBOX_TYPES = ["Manual", "Automática"];

export default function GaragePage() {
  const { showToast } = useToast();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [open, setOpen] = useState(false);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);

  const [brandId, setBrandId] = useState<number | null>(null);
  const [modelId, setModelId] = useState<number | null>(null);

  const [plate, setPlate] = useState("");
  const [year, setYear] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [gearbox, setGearbox] = useState("");
  const [cc, setCc] = useState("");
  const [color, setColor] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const brandsData = await getBrands();
      setBrands(brandsData);

      const vehiclesData = await getMyVehicles();
      setVehicles(vehiclesData);
    })();
  }, []);

  useEffect(() => {
    if (!brandId) return;
    getModelsByBrand(brandId).then(setModels);
  }, [brandId]);

  function formatPlate(value: string) {
    const raw = value.replace(/[^A-Z0-9]/g, "").toUpperCase().slice(0, 6);
    const parts = raw.match(/.{1,2}/g) || [];
    return parts.join("-");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !plate.trim() ||
      !year.trim() ||
      !fuelType ||
      !gearbox ||
      !cc.trim() ||
      !color.trim() ||
      !brandId ||
      !modelId
    ) {
      showToast("Todos os campos são obrigatórios!", "error");
      return;
    }

    try {
      await createVehicle({
        plate,
        year: Number(year),
        fuelType,
        gearbox,
        cc: Number(cc),
        color,
        brandId,
        modelId,
      });

      const vehiclesData = await getMyVehicles();
      setVehicles(vehiclesData);

      showToast("Veículo adicionado com sucesso.", "success");

      setOpen(false);
      setPlate("");
      setYear("");
      setFuelType("");
      setGearbox("");
      setCc("");
      setColor("");
      setBrandId(null);
      setModelId(null);
      setModels([]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, "error");
      } else {
        showToast("Erro ao adicionar veículo.", "error");
      }
    }
  }

  function askDeleteVehicle(id: string) {
    setVehicleToDelete(id);
    setConfirmOpen(true);
  }

  async function confirmDeleteVehicle() {
    if (!vehicleToDelete) return;

    try {
      await deleteVehicle(vehicleToDelete);

      const vehiclesData = await getMyVehicles();
      setVehicles(vehiclesData);

      showToast("Veículo removido com sucesso.", "success");
    } catch {
      showToast("Erro ao remover veículo.", "error");
    } finally {
      setConfirmOpen(false);
      setVehicleToDelete(null);
    }
  }

  function cancelDeleteVehicle() {
    setConfirmOpen(false);
    setVehicleToDelete(null);
  }

  return (
    <main className="garage">
      <div className="garage-header">
        <h1>A minha garagem</h1>
        <button onClick={() => setOpen(true)}>Adicionar carro</button>
      </div>

      <div className="garage-grid">
        {vehicles.length === 0 && (
          <h4 className="no-vehicles">
            Ainda não adicionou nenhum veículo.
          </h4>
        )}

        {vehicles.map((v) => (
          <div key={v.id} className="vehicle-card">
            <div className="vehicle-main">
              <div className="vehicle-brand">
                {/* ✅ FIX: Image conditionnelle avec fallback */}
                {v.brandImage ? (
                  <Image
                    src={v.brandImage}
                    alt={`${v.brand || 'Marca'} logo`}
                    width={50}
                    height={50}
                    unoptimized
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-[50px] h-[50px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500 font-medium">
                      {v.brand || 'Carro'}
                    </span>
                  </div>
                )}
              </div>

              <div className="vehicle-details">
                <strong className="vehicle-title">
                  {v.brand || 'Marca'} {v.model || 'Modelo'}
                </strong>

                <span className="vehicle-meta">
                  {v.year || '—'} · {v.fuelType || '—'} · {v.gearbox || '—'} · {v.cc || '—'}cc
                </span>

                <span className="vehicle-color">Cor: {v.color || '—'}</span>
              </div>
            </div>

            <div className="vehicle-footer">
              <div className="vehicle-plate">{v.plate || '—'}</div>

              <button
                className="vehicle-remove"
                onClick={() => askDeleteVehicle(v.id.toString())}
                aria-label="Remover veículo"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Adicionar carro</h2>
              <button onClick={() => setOpen(false)}>
                <X className="modal-close-icon" size={18} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <input
                placeholder="Matrícula"
                value={plate}
                onChange={(e) => setPlate(formatPlate(e.target.value))}
                maxLength={8}
                required
              />

              <select
                value={brandId ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setBrandId(id);
                  setModelId(null);
                  setModels([]);
                }}
                required
              >
                <option value="">Marca</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <select
                value={modelId ?? ""}
                onChange={(e) => setModelId(Number(e.target.value))}
                disabled={!brandId}
                required
              >
                <option value="">Modelo</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Ano"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                max="2030"
                required
              />

              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                required
              >
                <option value="">Combustível</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <select
                value={gearbox}
                onChange={(e) => setGearbox(e.target.value)}
                required
              >
                <option value="">Tipo de caixa</option>
                {GEARBOX_TYPES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Cilindrada (cc)"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                min="1"
                required
              />

              <input
                placeholder="Cor"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
              />

              <button type="submit">Guardar carro</button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        message="Tem a certeza que deseja remover este veículo?"
        onConfirm={confirmDeleteVehicle}
        onCancel={cancelDeleteVehicle}
      />
    </main>
  );
}
