'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/config/firebase';
import { API_ENDPOINTS } from '@/app/config/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Clock, Edit, LogOut } from "lucide-react";
import type { Appointment } from '@/app/types/appointment';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/doctor/login');
      } else {
        // Check API health before fetching appointments
        const isApiHealthy = await checkApiHealth();
        if (!isApiHealthy) {
          setError('Cannot connect to the server. Please try again later.');
          setIsLoading(false);
          return;
        }
        fetchAppointments(user.email || '');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchAppointments = async (doctorEmail: string) => {
    try {
      setIsLoading(true);
      console.log('Fetching appointments for doctor:', doctorEmail);
      
      // First try to fetch appointments with doctorEmail
      let response = await fetch(`${API_ENDPOINTS.appointments}?doctorEmail=${doctorEmail}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      let data;
      
      // If no appointments found, try to fetch all appointments
      if (response.ok) {
        data = await response.json();
        if (data.length === 0) {
          console.log('No appointments found with doctorEmail, fetching all appointments');
          response = await fetch(API_ENDPOINTS.appointments, {
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch appointments');
          }
          
          data = await response.json();
        }
      } else {
        throw new Error('Failed to fetch appointments');
      }
      
      console.log('Fetched appointments:', data);
      setAppointments(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAppointment = async (appointmentId: string, updates: Partial<Appointment>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update appointment');
      }

      const data = await response.json();
      // Refresh appointments after update
      if (auth.currentUser) {
        await fetchAppointments(auth.currentUser.email || '');
      }
      setIsEditing(false);
      setSelectedAppointment(null);
      setError(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError(error instanceof Error ? error.message : 'Failed to update appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/doctor/login');
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  const filteredAppointments = appointments.filter((appointment: Appointment) => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const checkApiHealth = async () => {
    try {
      console.log('Checking API health...');
      // Use the appointments endpoint instead of the health endpoint
      const response = await fetch(API_ENDPOINTS.appointments, {
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log('API health check response:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Error checking API health:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Doctor Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <Select
            value={filter}
            onValueChange={(value: typeof filter) => setFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter appointments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-gray-500">
            Total Appointments: {filteredAppointments.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading appointments...</p>
              </div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No appointments found.</p>
            </div>
          ) : (
            filteredAppointments.map((appointment: Appointment) => (
              <Card key={appointment._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{appointment.patientName}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Appointment</DialogTitle>
                          <DialogDescription>
                            Update appointment details for {appointment.patientName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                              value={selectedAppointment?.status}
                              onValueChange={(value: Appointment['status']) =>
                                setSelectedAppointment(prev => prev ? ({
                                  ...prev,
                                  status: value
                                }) : null)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Diagnosis</label>
                            <Textarea
                              value={selectedAppointment?.diagnosis || ''}
                              onChange={(e) =>
                                setSelectedAppointment(prev => prev ? ({
                                  ...prev,
                                  diagnosis: e.target.value
                                }) : null)
                              }
                              placeholder="Enter diagnosis"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Prescription</label>
                            <Textarea
                              value={selectedAppointment?.prescription || ''}
                              onChange={(e) =>
                                setSelectedAppointment(prev => prev ? ({
                                  ...prev,
                                  prescription: e.target.value
                                }) : null)
                              }
                              placeholder="Enter prescription"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Notes</label>
                            <Textarea
                              value={selectedAppointment?.notes || ''}
                              onChange={(e) =>
                                setSelectedAppointment(prev => prev ? ({
                                  ...prev,
                                  notes: e.target.value
                                }) : null)
                              }
                              placeholder="Enter additional notes"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedAppointment(null);
                              setIsEditing(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              if (selectedAppointment) {
                                handleUpdateAppointment(selectedAppointment._id, {
                                  status: selectedAppointment.status,
                                  diagnosis: selectedAppointment.diagnosis,
                                  prescription: selectedAppointment.prescription,
                                  notes: selectedAppointment.notes,
                                });
                              }
                            }}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{appointment.appointmentTime || appointment.preferredTime}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium">Symptoms</h4>
                      <p className="text-sm text-gray-600">{appointment.symptoms}</p>
                    </div>
                    
                    {appointment.diagnosis && (
                      <div>
                        <h4 className="text-sm font-medium">Diagnosis</h4>
                        <p className="text-sm text-gray-600">{appointment.diagnosis}</p>
                      </div>
                    )}
                    
                    {appointment.prescription && (
                      <div>
                        <h4 className="text-sm font-medium">Prescription</h4>
                        <p className="text-sm text-gray-600">{appointment.prescription}</p>
                      </div>
                    )}
                    
                    {appointment.notes && (
                      <div>
                        <h4 className="text-sm font-medium">Notes</h4>
                        <p className="text-sm text-gray-600">{appointment.notes}</p>
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : appointment.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
