import express from 'express';
import { Request, Response } from 'express';
import Appointment from '../models/Appointment';

const router = express.Router();

// Validate appointment data
const validateAppointment = (data: any) => {
  const errors = [];
  if (!data.patientName) errors.push('Patient name is required');
  if (!data.patientPhone) errors.push('Phone number is required');
  if (!data.village) errors.push('Village is required');
  if (!data.appointmentDate) errors.push('Appointment date is required');
  if (!data.doctorType) errors.push('Doctor type is required');
  if (!data.preferredTime) errors.push('Preferred time is required');
  if (!data.symptoms) errors.push('Symptoms are required');
  return errors;
};

// Create appointment
router.post('/', async (req: Request, res: Response) => {
  try {
    const validationErrors = validateAppointment(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const appointment = await Appointment.create({
      ...req.body,
      status: 'pending'
    });

    console.log('Appointment created:', appointment);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment. Please try again.' });
  }
});

// Get appointments
router.get('/', async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) {
      query = { patientEmail: email };
    }
    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: 1, createdAt: -1 })
      .exec();

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Update appointment
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (req.body.status && !['pending', 'confirmed', 'cancelled'].includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid appointment status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    console.log('Appointment updated:', appointment);
    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Delete appointment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    console.log('Appointment deleted:', req.params.id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

export default router;
