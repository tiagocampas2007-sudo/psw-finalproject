import { apiFetch } from "../client";
import type {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
} from "./auth.types";

export function registerUser(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(
  payload: LoginPayload
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}