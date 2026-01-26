import { apiFetch } from "../client";
import type { Vehicle, CreateVehiclePayload, VehicleAppointment } from "./vehicles.types";

export function getMyVehicles(): Promise<Vehicle[]> {
  return apiFetch<Vehicle[]>("/api/vehicles");
}

export function createVehicle(
  payload: CreateVehiclePayload
): Promise<{ message: string; vehicle: Vehicle }> {
  return apiFetch("/api/vehicles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteVehicle(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/vehicles/${id}`, {
    method: "DELETE",
  });
}

export function getVehicleById(id: string): Promise<Vehicle> {
  return apiFetch(`/api/vehicles/${id}`);
}

export function getVehicleHistory(
  id: string
): Promise<VehicleAppointment[]> {
  return apiFetch(`/api/vehicles/${id}/history`);
}