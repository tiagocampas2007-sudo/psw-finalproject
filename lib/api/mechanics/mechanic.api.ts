import { apiFetch } from "../client";
import type { ApplyMechanicPayload, Mechanic } from "./mechanic.types";

// Candidatura a mecânico
export function applyMechanic(
  payload: ApplyMechanicPayload
): Promise<{ message: string; mechanicId: string }> {
  return apiFetch("/api/mechanics/apply", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Obter mecânicos disponíveis para contratação
export function getAvailableMechanics(): Promise<Mechanic[]> {
  return apiFetch("/api/mechanics/available");
}

// Obter mecânicos por oficina
export function getMechanicsByOffice(): Promise<Mechanic[]> {
  return apiFetch("/api/mechanics/by-office");
}

// Despedir mecânico
export function deleteMechanic(id: string): Promise<{ success: boolean }> {
  return apiFetch(`/api/mechanics/${id}`, {
    method: "DELETE",
  });
}

// Contratar mecânico
export function hireMechanic(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/mechanics/${id}/hire`, {
    method: "POST",
  });
}

// Notificação de contratação de mecânico
export function getHireNotification(): Promise<{
  show: boolean;
  officeName?: string;
}> {
  return apiFetch("/api/mechanics/hire-notification");
}

// Marcar notificação de contratação como vista
export function markHireSeen(): Promise<{ message: string }> {
  return apiFetch("/api/mechanics/hire-notification/seen", {
    method: "POST",
  });
}
