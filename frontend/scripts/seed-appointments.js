const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017/swasthya';
const client = new MongoClient(uri);

const testAppointments = [
  {
    patientName: 'John Doe',
    patientEmail: 'john@example.com',
    doctorEmail: 'doctor@example.com',
    appointmentDate: new Date('2025-04-05'),
    appointmentTime: '10:00 AM',
    status: 'pending',
    symptoms: 'Fever and headache',
    diagnosis: '',
    prescription: '',
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    patientName: 'Jane Smith',
    patientEmail: 'jane@example.com',
    doctorEmail: 'doctor@example.com',
    appointmentDate: new Date('2025-04-06'),
    appointmentTime: '2:00 PM',
    status: 'confirmed',
    symptoms: 'Cough and cold',
    diagnosis: '',
    prescription: '',
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedAppointments() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('swasthya');
    const appointments = db.collection('appointments');

    // Clear existing appointments
    await appointments.deleteMany({});
    console.log('Cleared existing appointments');

    // Insert test appointments
    const result = await appointments.insertMany(testAppointments);
    console.log(`Added ${result.insertedCount} test appointments`);
  } catch (error) {
    console.error('Error seeding appointments:', error);
  } finally {
    await client.close();
  }
}

seedAppointments();
