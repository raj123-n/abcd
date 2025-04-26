"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Phone, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Appointment {
  _id: string;
  patientName: string;
  patientPhone: string;
  village: string;
  appointmentDate: string;
  doctorType: string;
  preferredTime: string;
  symptoms: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  patientName: string;
  patientPhone: string;
  village: string;
  appointmentDate: string;
  doctorType: string;
  preferredTime: string;
  symptoms: string;
}

interface FormErrors {
  patientName?: string;
  patientPhone?: string;
  village?: string;
  appointmentDate?: string;
  doctorType?: string;
  preferredTime?: string;
  symptoms?: string;
}

export default function AppointmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"book" | "view">("book")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    patientName: "",
    patientPhone: "",
    village: "",
    appointmentDate: "",
    doctorType: "",
    preferredTime: "",
    symptoms: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (activeTab === "view") {
      fetchAppointments();
    }
  }, [activeTab]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('Fetching all appointments');
      const response = await fetch('/api/appointments', {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store', // Ensure we don't get cached data
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch appointments');
      }
      
      const data = await response.json();
      console.log('Fetched appointments:', data);
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Failed to fetch appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshAppointments = () => {
    fetchAppointments();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }
    
    if (!formData.patientPhone.trim()) {
      newErrors.patientPhone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.patientPhone.trim())) {
      newErrors.patientPhone = "Please enter a valid 10-digit phone number";
    }
    
    if (!formData.village.trim()) {
      newErrors.village = "Village is required";
    }
    
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required";
    } else {
      const appointmentDate = new Date(formData.appointmentDate);
      if (appointmentDate < new Date()) {
        newErrors.appointmentDate = "Appointment date cannot be in the past";
      }
    }
    
    if (!formData.doctorType) {
      newErrors.doctorType = "Please select a doctor type";
    }
    
    if (!formData.preferredTime) {
      newErrors.preferredTime = "Please select a preferred time";
    }
    
    if (!formData.symptoms.trim()) {
      newErrors.symptoms = "Symptoms are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      const appointmentDate = new Date(formData.appointmentDate);
      if (isNaN(appointmentDate.getTime())) {
        setErrors({ appointmentDate: "Invalid date format" });
        setLoading(false);
        return;
      }

      const appointmentData = {
        patientName: formData.patientName.trim(),
        patientPhone: formData.patientPhone.trim(),
        village: formData.village.trim(),
        appointmentDate: appointmentDate.toISOString(),
        doctorType: formData.doctorType,
        preferredTime: formData.preferredTime,
        symptoms: formData.symptoms.trim(),
        appointmentTime: formData.preferredTime,
        doctorEmail: "default@example.com",
        patientEmail: "patient@example.com",
        status: 'pending'
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          const fieldErrors: FormErrors = {};
          if (data.error.includes('is required')) {
            const field = data.error.split(' ')[0] as keyof FormErrors;
            fieldErrors[field] = data.error;
          } else if (data.details) {
            data.details.forEach((error: string) => {
              if (error.includes('patientName')) fieldErrors.patientName = error;
              if (error.includes('village')) fieldErrors.village = error;
              if (error.includes('appointmentDate')) fieldErrors.appointmentDate = error;
              if (error.includes('doctorType')) fieldErrors.doctorType = error;
              if (error.includes('preferredTime')) fieldErrors.preferredTime = error;
              if (error.includes('symptoms')) fieldErrors.symptoms = error;
            });
          }
          
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            throw new Error('Please check the form for errors');
          }
          
          throw new Error(data.error);
        }
        throw new Error('Failed to book appointment');
      }
      
      alert('Appointment booked successfully!');
      setActiveTab('view');
      fetchAppointments();

      setFormData({
        patientName: "",
        patientPhone: "",
        village: "",
        appointmentDate: "",
        doctorType: "",
        preferredTime: "",
        symptoms: ""
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      if (!(error instanceof Error) || !error.message.includes('check the form')) {
        alert(error instanceof Error ? error.message : 'Failed to book appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="bg-green-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push('/')} className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Back to Home</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "book" | "view")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="book">Book Appointment</TabsTrigger>
            <TabsTrigger value="view">View Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="book">
            <Card className="border-green-100 shadow-sm">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="text-2xl text-green-800">Book an Appointment</CardTitle>
                <CardDescription className="text-green-700">
                  Fill in your details to schedule an appointment
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input
                        id="patientName"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        required
                        className={errors.patientName ? "border-red-500" : ""}
                      />
                      {errors.patientName && (
                        <p className="text-sm text-red-500">{errors.patientName}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="patientPhone">Patient Phone</Label>
                      <Input
                        id="patientPhone"
                        name="patientPhone"
                        value={formData.patientPhone}
                        onChange={handleInputChange}
                        required
                        className={errors.patientPhone ? "border-red-500" : ""}
                      />
                      {errors.patientPhone && (
                        <p className="text-sm text-red-500">{errors.patientPhone}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="village">Village</Label>
                      <Input
                        id="village"
                        name="village"
                        value={formData.village}
                        onChange={handleInputChange}
                        required
                        className={errors.village ? "border-red-500" : ""}
                      />
                      {errors.village && (
                        <p className="text-sm text-red-500">{errors.village}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="appointmentDate">Appointment Date</Label>
                      <Input
                        id="appointmentDate"
                        name="appointmentDate"
                        type="date"
                        value={formData.appointmentDate}
                        onChange={handleInputChange}
                        required
                        className={errors.appointmentDate ? "border-red-500" : ""}
                      />
                      {errors.appointmentDate && (
                        <p className="text-sm text-red-500">{errors.appointmentDate}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="doctorType">Doctor Type</Label>
                      <Select
                        value={formData.doctorType}
                        onValueChange={(value) => handleSelectChange("doctorType", value)}
                        required
                      >
                        <SelectTrigger id="doctorType" className={errors.doctorType ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select doctor type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Physician</SelectItem>
                          <SelectItem value="pediatrician">Pediatrician</SelectItem>
                          <SelectItem value="orthopedic">Orthopedic</SelectItem>
                          <SelectItem value="dermatologist">Dermatologist</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.doctorType && (
                        <p className="text-sm text-red-500">{errors.doctorType}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="preferredTime">Preferred Time</Label>
                      <Select
                        value={formData.preferredTime}
                        onValueChange={(value) => handleSelectChange("preferredTime", value)}
                        required
                      >
                        <SelectTrigger id="preferredTime" className={errors.preferredTime ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select preferred time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (2 PM - 5 PM)</SelectItem>
                          <SelectItem value="evening">Evening (6 PM - 9 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.preferredTime && (
                        <p className="text-sm text-red-500">{errors.preferredTime}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="symptoms">Symptoms</Label>
                      <Input
                        id="symptoms"
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleInputChange}
                        required
                        className={errors.symptoms ? "border-red-500" : ""}
                      />
                      {errors.symptoms && (
                        <p className="text-sm text-red-500">{errors.symptoms}</p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                    {loading ? "Booking..." : "Book Appointment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view">
            <Card className="border-green-100 shadow-sm">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-green-800">All Appointments</CardTitle>
                    <CardDescription className="text-green-700">
                      View all appointment details
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-green-200 text-green-700 hover:bg-green-50"
                    onClick={refreshAppointments}
                  >
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-2 text-green-600">Loading appointments...</span>
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment._id} className="border-green-100">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg text-green-800">{appointment.doctorType}</h3>
                                <Badge 
                                  variant={
                                    appointment.status === 'confirmed' 
                                      ? 'default' 
                                      : appointment.status === 'cancelled' 
                                      ? 'destructive' 
                                      : appointment.status === 'completed'
                                      ? 'secondary'
                                      : 'outline'
                                  }
                                  className="ml-2"
                                >
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Calendar className="h-4 w-4 text-green-600" />
                                <span>
                                  {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.preferredTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin className="h-4 w-4 text-green-600" />
                                <span>{appointment.village}</span>
                              </div>
                              {appointment.diagnosis && (
                                <div className="mt-2 p-2 bg-green-50 rounded">
                                  <p><strong>Diagnosis:</strong> {appointment.diagnosis}</p>
                                  {appointment.prescription && (
                                    <p className="mt-1"><strong>Prescription:</strong> {appointment.prescription}</p>
                                  )}
                                  {appointment.notes && (
                                    <p className="mt-1"><strong>Notes:</strong> {appointment.notes}</p>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col items-end">
                              <p className="text-xs text-gray-500">
                                Created: {new Date(appointment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No appointments found</p>
                    <Button
                      className="mt-4 bg-green-600 hover:bg-green-700"
                      onClick={() => setActiveTab("book")}
                    >
                      Book an Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
