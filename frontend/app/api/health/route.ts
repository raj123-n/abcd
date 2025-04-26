import { NextResponse } from 'next/server';
import connectDB from '@/backend/config/db';

export async function GET() {
  try {
    // Try to connect to MongoDB to check if the database is accessible
    await connectDB();
    
    return NextResponse.json({ 
      status: 'ok',
      message: 'API is healthy and connected to MongoDB',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'API is not healthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 