import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/config/db';
import Appointment from '@/backend/models/Appointment';

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    console.log(`Updating appointment with ID: ${context.params.id}`);
    await connectDB();
    const updates = await request.json();
    
    console.log('Update data:', JSON.stringify(updates, null, 2));
    
    const appointment = await Appointment.findByIdAndUpdate(
      context.params.id,
      { $set: updates },
      { new: true }
    ).lean();
    
    if (!appointment) {
      console.log(`Appointment with ID ${context.params.id} not found`);
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    console.log('Appointment updated successfully:', JSON.stringify(appointment, null, 2));
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();
    
    const appointment = await Appointment.findById(context.params.id).lean();
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();
    
    const appointment = await Appointment.findByIdAndDelete(context.params.id);
    
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
