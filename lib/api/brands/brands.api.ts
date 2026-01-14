import { apiFetch } from "../client";
import type { Brand } from "./brands.types";

export function getBrands(): Promise<Brand[]> {
  return apiFetch<Brand[]>("/api/brands");
}