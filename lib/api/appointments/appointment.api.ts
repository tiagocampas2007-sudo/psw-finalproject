import {apiFetch} from "@/lib/api/client";
import type {
  CreateAppointmentPayload,
  CreateAppointmentResponse,
  AvailabilitySlot,
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

