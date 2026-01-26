import {apiFetch} from "@/lib/api/client";
import type {
  CreateAppointmentPayload,
  CreateAppointmentResponse,
  AvailabilitySlot,
  AppointmentPage,
} from "./appointment.types";

// Criar uma nova marcação
export function createAppointment(
  payload: CreateAppointmentPayload
): Promise<CreateAppointmentResponse> {
  return apiFetch<CreateAppointmentResponse>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Obter disponibilidade de marcações
export function getAvailability(payload: {
  officeId: string;
  serviceId: string;
  date: string;
}): Promise<AvailabilitySlot[]> {
  return apiFetch<AvailabilitySlot[]>("/api/appointments/availability", {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

// Obter marcações do utilizador autenticado
export function getMyAppointments(): Promise<AppointmentPage[]> {
  return apiFetch<AppointmentPage[]>("/api/appointments/my-appointments");
}

// Obter marcações associadas ao escritório do utilizador autenticado
export function getAppointmentsByOffice(): Promise<AppointmentPage[]> {
  return apiFetch<AppointmentPage[]>("/api/appointments/office-appointments");
}

// Cancelar uma marcação
export function cancelAppointment(id: string): Promise<void> {
  return apiFetch<void>(`/api/appointments/${id}/cancel`, {
    method: "PATCH",
  });
}

// Completar uma marcação
export function completeAppointment(id: string): Promise<void> {
  return apiFetch<void>(`/api/appointments/${id}/complete`, {
    method: "PATCH",
  });
}

