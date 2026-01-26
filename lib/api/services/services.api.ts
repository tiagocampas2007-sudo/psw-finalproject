import { apiFetch } from "../client";
import type {
  Service,
  ServicePage,
  ServicePayload,
} from "./services.types";

// Todos os serviços
export function getServices(): Promise<ServicePage[]> {
  return apiFetch<ServicePage[]>("/api/services");
}

// Serviços por ID do escritório
export function getServicesByOfficeId(): Promise<Service[]> {
  return apiFetch<Service[]>("/api/services/office");
}

// Serviços por ID do escritório (parâmetro)
export function getServicesByOffice(
  officeId: string
): Promise<Service[]> {
  return apiFetch<Service[]>(`/api/services?officeId=${officeId}`);
}

// Serviço por ID
export function getServiceById(id: string): Promise<Service> {
  return apiFetch<Service>(`/api/services/${id}`);
}

// Criar novo serviço
export function createService(
  payload: ServicePayload
): Promise<{ message: string; service: Service }> {
  return apiFetch("/api/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Atualizar serviço existente
export function updateService(
  id: string,
  payload: ServicePayload
): Promise<{ message: string; service: Service }> {
  return apiFetch(`/api/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// Deletar serviço
export function deleteService(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/services/${id}`, {
    method: "DELETE",
  });
}
