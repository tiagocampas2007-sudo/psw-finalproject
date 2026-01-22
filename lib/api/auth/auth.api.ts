import { apiFetch } from "../client";
import type {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  RegisterOfficePayload,
  RegisterOfficeResponse,
} from "./auth.types";

export function registerUser(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerOffice(
  payload: RegisterOfficePayload
): Promise<RegisterOfficeResponse> {
  return apiFetch<RegisterOfficeResponse>("/api/auth/register-office", {
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