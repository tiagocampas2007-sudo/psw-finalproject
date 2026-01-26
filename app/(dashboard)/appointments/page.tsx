"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Settings,
  Clock,
  Car,
  Bookmark,
} from "lucide-react";

import {
  getMyVehicles,
  getOffices,
  getServicesByOffice,
  getAvailability,
  createAppointment,
} from "@/lib/api";
import type { Vehicle, Office, Service, AvailabilitySlot } from "@/lib/api";
import { getServiceTypeIcon } from "@/lib/serviceTypeIcons";
import { useToast } from "@/contexts/ToastContext";
import Router from "next/router";

import "@/styles/appointments.css";

export default function AppointmentsPage() {
  const [step, setStep] = useState(0);
  const { showToast } = useToast();
  const router = Router;

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  const [offices, setOffices] = useState<Office[]>([]);
  const [officesLoading, setOfficesLoading] = useState(true);

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);


  const [shifts, setShifts] = useState<AvailabilitySlot[]>([]);
  const [shiftsLoading, setShiftsLoading] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedShift, setSelectedShift] = useState<number | null>(null);

  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    getMyVehicles()
      .then(setVehicles)
      .catch(() => {
        showToast("Não foi possível carregar os veículos.", "error");
      })
      .finally(() => setVehiclesLoading(false));
  }, [showToast]);

  useEffect(() => {
    getOffices()
      .then(setOffices)
      .catch(() => {
        showToast("Não foi possível carregar as oficinas.", "error");
      })
      .finally(() => setOfficesLoading(false));
  }, [showToast]);

  useEffect(() => {
    if (!selectedOffice) return;

    const officeId = selectedOffice.id;
    let cancelled = false;

    async function loadServices() {
      try {
        setServicesLoading(true);
        const data = await getServicesByOffice(officeId);
        if (!cancelled) {
          setServices(data);
        }
      } catch {
        if (!cancelled) {
          showToast("Não foi possível carregar os serviços.", "error");
        }
      } finally {
        if (!cancelled) {
          setServicesLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      cancelled = true;
    };
  }, [selectedOffice, showToast]);

  useEffect(() => {
    if (step !== 3) return;
    if (!selectedOffice || !selectedService || !selectedDate) return;

    const officeId = selectedOffice.id;
    const serviceId = selectedService._id;
    const date = selectedDate.toISOString().slice(0, 10);

    let cancelled = false;

    async function loadAvailability() {
      try {
        setShiftsLoading(true);

        const data = await getAvailability({ officeId, serviceId, date });

        if (!cancelled) {
          setShifts(data);
          setSelectedShift(null);

          if (data.length === 0) {
            showToast("Sem horários disponíveis para esta data.", "error");
          }
        }
      } catch {
        if (!cancelled) {
          setShifts([]);
          showToast("Erro ao carregar horários disponíveis.", "error");
        }
      } finally {
        if (!cancelled) {
          setShiftsLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [step, selectedDate, selectedOffice, selectedService, showToast]);

  const formatMonth = (date: Date) =>
    date.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });

  function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}min`;
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= lastDate; i++) days.push(i);
    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minSelectableDate = new Date(today);
  minSelectableDate.setDate(today.getDate() + 1);
  if (selectedService) {
    minSelectableDate.setDate(
      today.getDate() + (selectedService.minAdvanceDays + 1)
    );
  }

  const steps = [
    { id: 0, label: "Veículo", icon: Car },
    { id: 1, label: "Oficina", icon: MapPin },
    { id: 2, label: "Serviço", icon: Settings },
    { id: 3, label: "Data", icon: Clock },
    { id: 4, label: "Confirmar", icon: Bookmark },
  ];

  async function handleCreateAppointment() {
    if (
      !selectedVehicle ||
      !selectedOffice ||
      !selectedService ||
      !selectedDate ||
      selectedShift === null
    ) {
      showToast("Preencha todos os dados da marcação.", "error");
      return;
    }

    try {
      setCreating(true);

      await createAppointment({
        vehicleId: selectedVehicle.id,
        officeId: selectedOffice.id,
        serviceId: selectedService._id,
        date: selectedDate.toISOString().slice(0, 10),
        startMinutes: selectedShift,
        description: description.trim() || undefined,
      });

      showToast("Marcação criada com sucesso!", "success");
      router.push("/my-appointments");
      
    } catch (err: unknown) {
      if(err instanceof Error && err.message) {
        showToast(err.message, "error");
        return;
      } else {
      showToast("Erro ao criar a marcação.", "error");
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="appointments-card">
      <section className="appointments-header">
        <h1>Agendar Serviço</h1>
        <p>Selecione a oficina, serviço e data pretendidos.</p>
      </section>

      <section className="appointments-steps">
        <div className="steps-container">
          {steps.map((s, i) => (
            <div key={s.id} className="step-wrapper">
              <button
                className={`step ${
                  step === s.id ? "active" : step > s.id ? "done" : ""
                }`}
                disabled
              >
                <s.icon size={16} />
                <span>{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`step-line ${step > s.id ? "done" : ""}`} />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="appointments-content">
        {step === 0 && (
          <div className="card-block">
            <h2>Selecione o veículo</h2>

            {vehiclesLoading && <p>A carregar veículos…</p>}

            {!vehiclesLoading && (
              <div className="list-grid">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    className={`list-item ${
                      selectedVehicle?.id === v.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedVehicle(v)}
                  >
                    <div className="car-title">
                      <Image
                        src={v.brandImage}
                        alt={v.brand}
                        width={28}
                        height={28}
                        unoptimized
                      />
                      <strong>
                        {v.brand} {v.model}
                      </strong>
                    </div>

                    <small>
                      {[
                        v.plate,
                        v.year,
                        v.fuelType,
                        v.gearbox,
                        `${v.cc}cc`,
                        v.color,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </small>
                  </button>
                ))}
              </div>
            )}

            <div className="actions">
              <button
                className="primary-btn full"
                disabled={!selectedVehicle}
                onClick={() => setStep(1)}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="card-block">
            <h2>Selecione uma oficina</h2>

            {officesLoading && <p>A carregar oficinas…</p>}

            {!officesLoading && (
              <div className="list-grid">
                {offices.map((o) => (
                  <button
                    key={o.id}
                    className={`list-item ${
                      selectedOffice?.id === o.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedOffice(o)}
                  >
                    <span>{o.name}</span>
                    <div className="list-location">
                      <MapPin size={16} /> {o.location}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="actions">
              <button
                className="secondary-btn full"
                onClick={() => {
                  setSelectedOffice(null);
                  setSelectedService(null);
                  setSelectedDate(null);
                  setSelectedShift(null);
                  setShifts([]);
                  setStep(0);
                }}
              >
                Voltar
              </button>
              <button
                className="primary-btn full"
                disabled={!selectedOffice}
                onClick={() => setStep(2)}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card-block">
            <h2>Selecione o serviço</h2>

            {servicesLoading && <p>A carregar serviços…</p>}

            {!servicesLoading && (
              <div className="list-grid">
                {services.map((s) => {
                  const ServiceIcon = getServiceTypeIcon(s.serviceTypeId.slug);

                  return (
                    <button
                      key={s._id}
                      className={`list-item ${
                        selectedService?._id === s._id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedService(s)}
                    >
                      <div className="service-item-left">
                        <ServiceIcon size={18} />
                        <span>{s.name}</span>
                      </div>
                      <small>~ {formatDuration(s.durationMinutes)}</small>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="actions">
              <button
                className="secondary-btn full"
                onClick={() => {
                  setSelectedService(null);
                  setSelectedDate(null);
                  setSelectedShift(null);
                  setShifts([]);
                  setStep(1);
                }}
              >
                Voltar
              </button>
              <button
                className="primary-btn full"
                disabled={!selectedService}
                onClick={() => setStep(3)}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="calendar-grid">
            <div className="calendar">
              <div className="calendar-header">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1
                      )
                    )
                  }
                >
                  <ChevronLeft />
                </button>

                <h3>{formatMonth(currentMonth)}</h3>

                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1
                      )
                    )
                  }
                >
                  <ChevronRight />
                </button>
              </div>

              <div className="calendar-days">
                {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                  <span key={`${d}-${i}`}>{d}</span>
                ))}
              </div>

              <div className="calendar-dates">
                {days.map((d, i) => {
                  if (!d) return <span key={i} />;

                  const cellDate = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    d
                  );

                  const isUnavailable = cellDate < minSelectableDate;
                  const isSelected =
                    selectedDate?.getTime() === cellDate.getTime();

                  return (
                    <button
                      key={i}
                      disabled={isUnavailable}
                      className={`${isSelected ? "selected" : ""} ${
                        isUnavailable ? "unavailable" : ""
                      }`}
                      onClick={() => {
                        if (isUnavailable) return;
                        setSelectedDate(cellDate);
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="slots">
              <h3>Horários disponíveis</h3>

              {!selectedDate && (
                <p className="muted">
                  Selecione uma data para ver os horários disponíveis.
                </p>
              )}

              {shiftsLoading ? (
                <p>A carregar horários…</p>
              ) : (
                <div className="slots-grid">
                  {shifts.map((t) => (
                    <button
                      key={t.id}
                      disabled={!t.available}
                      className={`${selectedShift === t.startMinutes ? "selected" : ""} ${
                        !t.available ? "unavailable" : ""
                      }`}
                      onClick={() => {
                        if (!t.available) return;
                        setSelectedShift(t.startMinutes);
                      }}
                    >
                      {t.hour}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="actions full-width">
              <button
                className="secondary-btn full"
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedShift(null);
                  setShifts([]);
                  setStep(2);
                }}
              >
                Voltar
              </button>
              <button
                className="primary-btn full"
                disabled={!selectedDate || selectedShift === null}
                onClick={() => setStep(4)}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="confirm-card">
            <h2>Confirmar marcação</h2>

            <div className="summary">
              <div className="summary-row">
                <div className="summary-label">
                  <Car size={18} />
                  <span>Veículo</span>
                </div>
                <strong>{selectedVehicle?.brand} {selectedVehicle?.model}</strong>
              </div>


              <div className="summary-row">
                <div className="summary-label">
                  <MapPin size={18} />
                  <span>Oficina</span>
                </div>
                <strong>{selectedOffice?.name}</strong>
              </div>

              <div className="summary-row">
                <div className="summary-label">
                  <Settings size={18} />
                  <span>Serviço</span>
                </div>
                <strong>{selectedService?.name}</strong>
              </div>

              <div className="summary-row">
                <div className="summary-label">
                  <Clock size={18} />
                  <span>Data e Hora</span>
                </div>
                <strong>
                  {selectedDate?.toLocaleDateString("pt-PT")} ·{" "}
                  {shifts.find((t) => t.startMinutes === selectedShift)?.hour}
                </strong>
              </div>
            </div>

            <div className="form-group">
              <label>Observações (opcional)</label>
              <textarea
                rows={4}
                placeholder="Ex: barulho ao travar, revisão antes de viagem, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="actions">
              <button className="secondary-btn full" onClick={() => setStep(3)}>
                Voltar
              </button>

              <button
                className="primary-btn full"
                disabled={creating}
                onClick={handleCreateAppointment}
              >
                {creating ? "A criar marcação…" : "Confirmar Marcação"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}