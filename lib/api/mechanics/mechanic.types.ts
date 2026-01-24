import type { ServiceType } from "@/lib/api";

export interface Mechanic {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  specialties: ServiceType[];
  status: "AVAILABLE" | "HIRED";
  office: string | null;
}

export interface ApplyMechanicPayload {
  specialties: string[];
}
