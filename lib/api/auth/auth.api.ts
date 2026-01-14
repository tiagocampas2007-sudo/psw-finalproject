import { apiFetch } from "../client";
import type { RegisterPayload, RegisterResponse } from "./auth.types";

export function registerUser(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}