import { apiFetch } from "../client";
import type { AgendaAppointment } from "./agenda.types";

export function getMyAgenda(): Promise<AgendaAppointment[]> {
  return apiFetch("/api/mechanics/my-agenda");
}