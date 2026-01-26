import { apiFetch } from "../client";
import type { User, UpdateMyProfilePayload } from "./user.types";

// Dados do perfil
export function getMyProfile(): Promise<User> {
  return apiFetch<User>("/api/users/profile");
}

// Atualizar dados do perfil
export function updateMyProfile(
  payload: UpdateMyProfilePayload
): Promise<{ message: string; user: User }> {
  return apiFetch("/api/users/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
