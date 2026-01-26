import { apiFetch } from "../client";
import type { Vehicle, CreateVehiclePayload, VehicleAppointment } from "./vehicles.types";

// Veículos do utilizador com sessão
export function getMyVehicles(): Promise<Vehicle[]> {
  return apiFetch<Vehicle[]>("/api/vehicles");
}

// Criar um novo veículo
export function createVehicle(
  payload: CreateVehiclePayload
): Promise<{ message: string; vehicle: Vehicle }> {
  return apiFetch("/api/vehicles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Eliminar um veículo pelo ID
export function deleteVehicle(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/vehicles/${id}`, {
    method: "DELETE",
  });
}

// Obter detalhes de um veículo pelo ID
export function getVehicleById(id: string): Promise<Vehicle> {
  return apiFetch(`/api/vehicles/${id}`);
}

// Obter histórico de agendamentos de um veículo pelo ID
export function getVehicleHistory(
  id: string
): Promise<VehicleAppointment[]> {
  return apiFetch(`/api/vehicles/${id}/history`);
}