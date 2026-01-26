import {apiFetch} from "@/lib/api/client";
import type {
  CreateAppointmentPayload,
  CreateAppointmentResponse,
  AvailabilitySlot,
  AppointmentPage,
} from "./appointment.types";

export function createAppointment(
  payload: CreateAppointmentPayload
): Promise<CreateAppointmentResponse> {
  return apiFetch<CreateAppointmentResponse>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

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

export function getMyAppointments(): Promise<AppointmentPage[]> {
  return apiFetch<AppointmentPage[]>("/api/appointments/my-appointments");
}

export function getAppointmentsByOffice(): Promise<AppointmentPage[]> {
  return apiFetch<AppointmentPage[]>("/api/appointments/office-appointments");
}

export function cancelAppointment(id: string): Promise<void> {
  return apiFetch<void>(`/api/appointments/${id}/cancel`, {
    method: "PATCH",
  });
}

export function completeAppointment(id: string): Promise<void> {
  return apiFetch<void>(`/api/appointments/${id}/complete`, {
    method: "PATCH",
  });
}

