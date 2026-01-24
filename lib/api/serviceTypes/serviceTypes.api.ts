import { apiFetch } from "../client";
import type { ServiceType } from "./serviceTypes.types";

export function getServiceTypes(): Promise<ServiceType[]> {
  return apiFetch<ServiceType[]>("/api/service-types");
}