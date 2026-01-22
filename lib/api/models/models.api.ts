import { apiFetch } from "../client";
import type { Model } from "./models.types";

export function getModelsByBrand(brandId: number): Promise<Model[]> {
  return apiFetch<Model[]>(`/api/models?brandId=${brandId}`);
}