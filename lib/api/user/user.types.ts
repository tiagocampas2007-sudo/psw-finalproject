export type UserRole = "CLIENT" | "ADMIN" | "STAFF";
import type { ServiceType } from "../serviceTypes/serviceTypes.types";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  mechanic: {
    id: string,
    specialties: ServiceType[],
    status: string,
  }
}

export interface UpdateMyProfilePayload {
  name: string;
}