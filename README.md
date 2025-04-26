# Swasthya - Healthcare Appointment Management System

Swasthya is a comprehensive healthcare appointment management system designed to connect patients with doctors in rural areas. The platform facilitates appointment booking, management, and tracking for both patients and healthcare providers.

## Features

### For Patients
- **Appointment Booking**: Schedule appointments with different types of doctors
- **Appointment Tracking**: View and track the status of appointments
- **Medical Records**: Access diagnosis, prescriptions, and notes from doctors
- **Village-based Healthcare**: Connect with healthcare providers in your village

### For Doctors
- **Appointment Management**: View and manage patient appointments
- **Patient Records**: Update patient diagnosis, prescriptions, and notes
- **Status Updates**: Change appointment status (pending, confirmed, completed, cancelled)
- **Dashboard**: Overview of all appointments with filtering options

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: Firebase Authentication
- **Database**: MongoDB
- **UI Components**: Shadcn UI

## Project Structure

```
swasthya/
├── frontend/                  # Next.js frontend application
│   ├── app/                   # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── appointments/      # Patient appointment pages
│   │   ├── doctor/            # Doctor dashboard pages
│   │   └── ...
│   ├── backend/               # Backend models and configuration
│   │   ├── config/            # Database configuration
│   │   └── models/            # MongoDB models
│   ├── components/            # Reusable UI components
│   └── ...
├── backend/                   # Express backend application
│   ├── config/                # Backend configuration
│   ├── models/                # MongoDB models
│   ├── routes/                # API routes
│   └── ...
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Firebase account (for authentication)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/swasthya.git
cd swasthya
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables
Create a `.env.local` file in the frontend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/swasthya
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Start the development servers
```bash
# Start the frontend server
cd frontend
npm run dev

# Start the backend server (in a separate terminal)
cd backend
npm run dev
```

5. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Appointments
- `GET /api/appointments` - Get all appointments (with optional filters)
- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments/:id` - Get a specific appointment
- `PUT /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Delete an appointment

## Appointment Data Model

```typescript
interface Appointment {
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
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Shadcn UI for the beautiful UI components
- Next.js team for the amazing framework
- MongoDB for the database
- Firebase for authentication 