import { apiFetch } from "../client";
import type { Office } from "./office.types";

export function getOffices(): Promise<Office[]> {
  return apiFetch<Office[]>("/api/offices");
}
