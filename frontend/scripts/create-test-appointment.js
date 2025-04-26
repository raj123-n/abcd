const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBRyWzGl9drPADQ1XrNgxL20V5tiD99Xxo",
  authDomain: "help-c0571.firebaseapp.com",
  projectId: "help-c0571",
  storageBucket: "help-c0571.firebasestorage.app",
  messagingSenderId: "600652981510",
  appId: "1:600652981510:web:ce19bd0e00974a378d2a87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createTestAppointment() {
  try {
    const appointmentsRef = collection(db, 'appointments');
    
    const appointmentData = {
      patientId: 'test-patient-1',
      doctorId: 'YOUR_DOCTOR_ID', // Replace with actual doctor ID
      patientName: 'John Doe',
      date: Timestamp.fromDate(new Date()),
      time: '10:00 AM',
      status: 'pending',
      symptoms: 'Fever and headache',
      diagnosis: '',
      prescription: '',
      notes: '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(appointmentsRef, appointmentData);
    console.log('Test appointment created with ID:', docRef.id);
  } catch (error) {
    console.error('Error creating test appointment:', error);
  }
}

createTestAppointment();
