const API_BASE_URL = 'http://localhost:5000/api';

export async function createAppointment(data: {
  patientName: string;
  patientPhone: string;
  village: string;
  appointmentDate: Date;
  doctorType: string;
  preferredTime: string;
  symptoms: string;
}) {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function getAppointments() {
  const response = await fetch(`${API_BASE_URL}/appointments`);
  return response.json();
}

export async function updateAppointment(id: string, data: Partial<{
  patientName: string;
  patientPhone: string;
  village: string;
  appointmentDate: Date;
  doctorType: string;
  preferredTime: string;
  symptoms: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}>) {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteAppointment(id: string) {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}
