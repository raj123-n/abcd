import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  village: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  doctorType: {
    type: String,
    required: true,
  },
  preferredTime: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  diagnosis: {
    type: String,
    default: '',
  },
  prescription: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  appointmentTime: {
    type: String,
    required: false,
  },
  doctorEmail: {
    type: String,
    required: true,
    default: 'default@example.com',
  },
  patientEmail: {
    type: String,
    required: true,
    default: 'patient@example.com',
  },
}, {
  timestamps: true,
});

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default Appointment;
