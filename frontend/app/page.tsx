'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, LogIn } from "lucide-react";
import { Stethoscope, Bell, Calendar, LogOut } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LanguageSelector from './components/LanguageSelector';

export default function Page() {
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    // Rest of the analyze symptoms code...
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <LanguageSelector />
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900"><center></center></h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/doctor/login">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <LogIn size={16} />
                  Doctor Login
                </Button>
              </Link>
              <Link href="/doctor/signup">
                <Button variant="default" size="sm" className="flex items-center gap-2">
                  <UserPlus size={16} />
                  Doctor Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative bg-gradient-to-b from-green-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start mb-8">
            <div className="text-center max-w-3xl">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">Your Health Companion</h1>
              <p className="text-xl text-gray-600 mb-8">Empowering you to take control of your health journey with expert guidance and support.</p>
              <div className="flex justify-center gap-4 mb-12">
                <div className="text-center px-8">
                  <p className="text-4xl font-bold text-green-600 mb-2">00%</p>
                  <p className="text-gray-600">Patient Satisfaction</p>
                </div>
                <div className="text-center px-8">
                  <p className="text-4xl font-bold text-green-600 mb-2">24/7</p>
                  <p className="text-gray-600">Health Support</p>
                </div>
                <div className="text-center px-8">
                  <p className="text-4xl font-bold text-green-600 mb-2">50+</p>
                  <p className="text-gray-600">Health Checkups</p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              {user ? (
                <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-green-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <Stethoscope className="h-12 w-12 text-green-600 mb-2" />
                <CardTitle className="text-xl text-green-800">Check Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 mb-4">
                  Describe your symptoms and get helpful information about possible conditions.
                </CardDescription>
                <Button
                  asChild
                  variant="ghost"
                  className="text-green-600 p-0 hover:text-green-800 hover:bg-transparent"
                >
                  <Link href="/symptoms" className="flex items-center">
                    Check Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-green-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <Calendar className="h-12 w-12 text-green-600 mb-2" />
                <CardTitle className="text-xl text-green-800">Book Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 mb-4">
                  Schedule appointments with doctors and healthcare providers near you.
                </CardDescription>
                <Button
                  asChild
                  variant="ghost"
                  className="text-green-600 p-0 hover:text-green-800 hover:bg-transparent"
                >
                  <Link href="/appointments" className="flex items-center">
                    Book Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-green-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <Bell className="h-12 w-12 text-green-600 mb-2" />
                <CardTitle className="text-xl text-green-800">Awareness News</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 mb-4">
                  Get the latest health awareness news and information.
                </CardDescription>
                <Button
                  asChild
                  variant="ghost"
                  className="text-green-600 p-0 hover:text-green-800 hover:bg-transparent"
                >
                  <Link href="/awareness" className="flex items-center">
                    View News <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
