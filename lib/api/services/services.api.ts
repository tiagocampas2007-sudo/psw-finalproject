import { apiFetch } from "../client";
import type {
  Service,
  ServicePage,
  ServicePayload,
} from "./services.types";

export function getServices(): Promise<ServicePage[]> {
  return apiFetch<ServicePage[]>("/api/services");
}

export function getServicesByOfficeId(): Promise<Service[]> {
  return apiFetch<Service[]>("/api/services/office");
}

export function getServicesByOffice(
  officeId: string
): Promise<Service[]> {
  return apiFetch<Service[]>(`/api/services?officeId=${officeId}`);
}

export function getServiceById(id: string): Promise<Service> {
  return apiFetch<Service>(`/api/services/${id}`);
}

export function createService(
  payload: ServicePayload
): Promise<{ message: string; service: Service }> {
  return apiFetch("/api/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateService(
  id: string,
  payload: ServicePayload
): Promise<{ message: string; service: Service }> {
  return apiFetch(`/api/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteService(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/services/${id}`, {
    method: "DELETE",
  });
}
