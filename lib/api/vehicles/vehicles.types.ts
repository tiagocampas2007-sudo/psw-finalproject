export interface Vehicle {
  id: string;
  plate: string;
  year: number;
  fuelType: string;
  gearbox: string;
  cc: number;
  color: string;
  brand: string;
  model: string;
  brandId: number;
  brandImage: string;
  modelId: number;
}

export interface CreateVehiclePayload {
  plate: string;
  year: number;
  fuelType: string;
  gearbox: string;
  cc: number;
  color: string;
  brandId: number;
  modelId: number;
}
