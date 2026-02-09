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

import "@/styles/appointments.css";

export default function AppointmentsPage() {
  // Passo atual do fluxo de marcação
  const [step, setStep] = useState(0);
  const { showToast } = useToast();

  // Estado dos veículos do utilizador
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  // Estado das oficinas
  const [offices, setOffices] = useState<Office[]>([]);
  const [officesLoading, setOfficesLoading] = useState(true);

  // Estado dos serviços da oficina selecionada
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Estado dos horários disponíveis (turnos/slots)
  const [shifts, setShifts] = useState<AvailabilitySlot[]>([]);
  const [shiftsLoading, setShiftsLoading] = useState(false);

  // Seleções do utilizador ao longo dos passos
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedShift, setSelectedShift] = useState<number | null>(null);

  // Observações da marcação e estado de criação
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // Mês atualmente visível no calendário
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Carregar veículos do utilizador ao entrar na página
  useEffect(() => {
    getMyVehicles()
      .then(setVehicles)
      .catch(() => {
        showToast("Não foi possível carregar os veículos.", "error");
      })
      .finally(() => setVehiclesLoading(false));
  }, [showToast]);

  // Carregar lista de oficinas ao entrar na página
  useEffect(() => {
    getOffices()
      .then(setOffices)
      .catch(() => {
        showToast("Não foi possível carregar as oficinas.", "error");
      })
      .finally(() => setOfficesLoading(false));
  }, [showToast]);

  // Quando a oficina muda, carregar serviços dessa oficina
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

    // Cancelar atualização se o componente for desmontado
    return () => {
      cancelled = true;
    };
  }, [selectedOffice, showToast]);

  // Quando está no passo 3 e há oficina, serviço e data, carregar horários disponíveis
  useEffect(() => {
    if (step !== 3) return;
    if (!selectedOffice || !selectedService || !selectedDate) return;

    const officeId = Number(selectedOffice.id);
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

    // Cancelar atualização se o componente for desmontado
    return () => {
      cancelled = true;
    };
  }, [step, selectedDate, selectedOffice, selectedService, showToast]);

  // Formatar texto do mês (ex.: “janeiro 2026”)
  const formatMonth = (date: Date) =>
    date.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });

  // Formatar duração em minutos para um texto legível
  function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}min`;
  }

  // Gerar matriz de dias para o calendário (inclui espaços vazios no início da semana)
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

  // Hoje sem horas (para comparação de datas)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Data mínima que o utilizador pode selecionar
  const minSelectableDate = new Date(today);
  minSelectableDate.setDate(today.getDate() + 1);
  if (selectedService) {
    minSelectableDate.setDate(
      today.getDate() + (selectedService.minAdvanceDays + 1)
    );
  }

  // Definição dos passos do assistente de marcação
  const steps = [
    { id: 0, label: "Veículo", icon: Car },
    { id: 1, label: "Oficina", icon: MapPin },
    { id: 2, label: "Serviço", icon: Settings },
    { id: 3, label: "Data", icon: Clock },
    { id: 4, label: "Confirmar", icon: Bookmark },
  ];

  // Criar marcação com base nas escolhas do utilizador
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
      window.location.href = "/my-appointments";
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
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
      {/* Cabeçalho principal da página */}
      <section className="appointments-header">
        <h1>Agendar Serviço</h1>
        <p>Selecione o veículo, oficina, serviço e data pretendidos.</p>
      </section>

      {/* Barra de passos (wizard) */}
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

      {/* Conteúdo principal que muda consoante o passo */}
      <section className="appointments-content">
        {/* Passo 0: escolher veículo */}
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
                      {/* Imagem da marca, com fallback para iniciais */}
                      {v.brandImage ? (
                        <Image
                          src={v.brandImage}
                          alt={`${v.brand || "Marca"} logo`}
                          width={28}
                          height={28}
                          unoptimized
                          className="rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-[28px] h-[28px] bg-gray-200 rounded flex items-center justify-center flex-shrink-0 mr-2">
                          <span className="text-xs text-gray-500 font-medium">
                            {v.brand?.[0]?.toUpperCase() || "C"}
                          </span>
                        </div>
                      )}
                      <strong>
                        {v.brand || "Marca"} {v.model || "Modelo"}
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
                        .join(" · ") || "—"}
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

        {/* Passo 1: escolher oficina */}
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

        {/* Passo 2: escolher serviço */}
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

        {/* Passo 3: escolher data e horário */}
        {step === 3 && (
          <div className="calendar-grid">
            {/* Calendário de seleção de dia */}
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

            {/* Lista de horários disponíveis para a data escolhida */}
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
          </div>
        )}

        {/* Passo 4: ecrã de confirmação */}
        {step === 4 && (
          <div className="confirm-card">
            <h2>Confirmar marcação</h2>

            <div className="summary">
              <div className="summary-row">
                <div className="summary-label">
                  <Car size={18} />
                  <span>Veículo</span>
                </div>
                <strong>
                  {selectedVehicle?.brand} {selectedVehicle?.model}
                </strong>
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

            {/* Campo de observações opcionais */}
            <div className="form-group">
              <label>Observações (opcional)</label>
              <textarea
                rows={4}
                placeholder="Ex.: barulho ao travar, revisão antes de viagem, etc."
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
