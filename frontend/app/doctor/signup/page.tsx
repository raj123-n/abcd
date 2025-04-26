'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/app/config/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import type { DoctorSignUpData } from '@/app/types/doctor';

export default function DoctorSignUpPage() {
  const [formData, setFormData] = useState<DoctorSignUpData>({
    email: '',
    password: '',
    name: '',
    licenseNumber: '',
    specialization: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.email || !formData.password || !formData.name || !formData.licenseNumber) {
        throw new Error('Please fill in all required fields');
      }

      // Create user account first
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Create doctor profile in Firestore
      const doctorData = {
        uid: user.uid,
        email: formData.email,
        name: formData.name,
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization || null,
        createdAt: serverTimestamp(),
        isApproved: false,
        role: 'doctor'
      };

      try {
        // Create the doctors collection and document
        await setDoc(doc(db, 'doctors', user.uid), doctorData);
        console.log('Doctor profile created successfully');
        router.push('/doctor/dashboard');
      } catch (firestoreError: any) {
        console.error('Firestore Error:', firestoreError);
        // If Firestore update fails, delete the auth user
        await user.delete();
        throw new Error(
          firestoreError.code === 'permission-denied'
            ? 'Permission denied. Please contact support.'
            : 'Failed to create doctor profile. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('Signup Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(error.message || 'Failed to create account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Doctor Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create your account to start using our services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2">
                <AlertCircle size={16} />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full"
                placeholder="doctor@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full"
                placeholder="Dr. John Doe"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                Medical License Number
              </label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                className="block w-full"
                placeholder="Enter your medical license number"
              />
              <p className="text-sm text-gray-500">
                Please enter your valid medical license number for verification
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                Specialization
              </label>
              <Input
                id="specialization"
                name="specialization"
                type="text"
                value={formData.specialization}
                onChange={handleChange}
                className="block w-full"
                placeholder="e.g., Cardiology, Pediatrics"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/doctor/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
