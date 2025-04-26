import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/config/db';
import Appointment from '@/backend/models/Appointment';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'patientName',
      'village',
      'appointmentDate',
      'doctorType',
      'preferredTime',
      'symptoms',
      'appointmentTime',
      'doctorEmail',
      'patientEmail'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate date format
    if (new Date(data.appointmentDate).toString() === 'Invalid Date') {
      return NextResponse.json(
        { error: 'Invalid appointment date format' },
        { status: 400 }
      );
    }

    // Set default status to pending
    const appointmentData = {
      ...data,
      status: 'pending'
    };

    const appointment = await Appointment.create(appointmentData);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    console.error('POST Error:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate appointment found' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected successfully');

    const { searchParams } = new URL(request.url);
    const doctorEmail = searchParams.get('doctorEmail');
    
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    let query = {};
    if (doctorEmail) {
      console.log('Using doctor email filter:', doctorEmail);
      query = { ...query, doctorEmail };
    } else {
      console.log('No doctor email provided, fetching all appointments');
    }
    
    console.log('Final query:', JSON.stringify(query));
    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: -1, updatedAt: -1 })
      .lean();
    
    console.log(`Found ${appointments.length} appointments`);
    
    // Log the first appointment if any exist
    if (appointments.length > 0) {
      console.log('Sample appointment:', JSON.stringify(appointments[0], null, 2));
    }
    
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).lean();
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    const appointment = await Appointment.findByIdAndDelete(id);
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
