import { apiFetch } from "../client";
import type { User, UpdateMyProfilePayload } from "./user.types";

export function getMyProfile(): Promise<User> {
  return apiFetch<User>("/api/users/profile");
}

export function updateMyProfile(
  payload: UpdateMyProfilePayload
): Promise<{ message: string; user: User }> {
  return apiFetch("/api/users/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
