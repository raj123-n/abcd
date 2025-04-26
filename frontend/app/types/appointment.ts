export interface Appointment {
  _id: string;
  patientName: string;
  patientEmail: string;
  doctorEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  preferredTime?: string;
  village?: string;
  doctorType?: string;
  symptoms: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
