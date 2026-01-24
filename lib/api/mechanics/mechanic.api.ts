import { apiFetch } from "../client";
import type { ApplyMechanicPayload, Mechanic } from "./mechanic.types";

export function applyMechanic(
  payload: ApplyMechanicPayload
): Promise<{ message: string; mechanicId: string }> {
  return apiFetch("/api/mechanics/apply", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAvailableMechanics(): Promise<Mechanic[]> {
  return apiFetch("/api/mechanics/available");
}

export function hireMechanic(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/mechanics/${id}/hire`, {
    method: "POST",
  });
}

export function getHireNotification(): Promise<{
  show: boolean;
  officeName?: string;
}> {
  return apiFetch("/api/mechanics/hire-notification");
}

export function markHireSeen(): Promise<{ message: string }> {
  return apiFetch("/api/mechanics/hire-notification/seen", {
    method: "POST",
  });
}
