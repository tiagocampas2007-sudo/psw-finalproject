import { apiFetch } from "../client";
export interface ServiceType {
  _id: string;
  label: string;
  slug: string;
}

export function getServiceTypes(): Promise<ServiceType[]> {
  return apiFetch<ServiceType[]>("/api/services");
}
