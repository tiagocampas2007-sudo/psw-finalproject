import { ServiceType } from "@/lib/api";

export interface Service {
  _id: string;
  name: string;
  durationMinutes: number;
  minAdvanceDays: number;
  price: number;
  description: string;
  serviceTypeId: ServiceType;
}

export interface ServicePage {
  _id: string;
  name: string;
  description: string;
  durationMinutes: number;
  minAdvanceDays: number;
  price: number;
  serviceTypeId: {
    _id: string;
    label: string;
    slug: string;
  };
  office: {
    id: string;
    name: string;
  };
}

export interface ServicePayload {
  name: string;
  durationMinutes: number;
  minAdvanceDays: number;
  price: number;
  description: string;
  serviceTypeId: string;
}