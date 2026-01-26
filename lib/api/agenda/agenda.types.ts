export interface AgendaAppointment {
  _id: string;
  date: string; // YYYY-MM-DD
  startMinutes: number;
  endMinutes: number;
  notes?: string;

  serviceId: {
    _id: string;
    name: string;
    durationMinutes: number;
  };

  vehicleId: {
    _id: string;
  };

  officeId: {
    name: string;
  };
}
