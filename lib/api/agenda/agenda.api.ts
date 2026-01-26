import { apiFetch } from "../client";
import type { AgendaAppointment } from "./agenda.types";

// Marcações do mecânico com sessão
export function getMyAgenda(): Promise<AgendaAppointment[]> {
  return apiFetch("/api/mechanics/my-agenda");
}