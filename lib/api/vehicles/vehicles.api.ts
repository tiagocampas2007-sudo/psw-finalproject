import { apiFetch } from "../client";
import type { Vehicle, CreateVehiclePayload } from "./vehicles.types";

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