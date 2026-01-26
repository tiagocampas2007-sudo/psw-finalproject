export interface Appointment {
  _id: string;

  userId: string;
  vehicleId: string;
  officeId: string;
  serviceId: string;
  mechanicId: string;

  statusId: string;

  date: string; // YYYY-MM-DD
  startMinutes: number;
  endMinutes: number;

  description?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentPayload {
  vehicleId: string;
  officeId: string;
  serviceId: string;
  date: string;
  startMinutes: number;
  description?: string;
}

export interface CreateAppointmentResponse {
  message: string;
  appointment: Appointment;
}

export interface AvailabilitySlot {
  id: string; // startMinutes em string
  hour: string; // "09:00"
  startMinutes: number;
  endMinutes: number;
  available: boolean;
  availableMechanics: number;
}

export interface AppointmentPage {
  _id: string;
  date: string;
  startMinutes: number;

  mechanicId: {
    _id: string;
    user: {
      name: string;
    };
  };

  vehicleId: string;

  officeId: {
    name: string;
    location: string;
  };

  serviceId: {
    name: string;
    durationMinutes: number;
  };

  statusId: {
    label: "PENDING" | "CONFIRMED" | "CANCELLED";
  };
}

