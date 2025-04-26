import { Document } from 'mongoose';

export interface IAppointment extends Document {
  patientName: string;
  patientPhone: string;
  village: string;
  appointmentDate: Date;
  doctorType: string;
  preferredTime: string;
  symptoms: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}
