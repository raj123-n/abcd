'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function FirebaseTest() {
  const [status, setStatus] = useState('Checking Firebase connection...');

  useEffect(() => {
    try {
      // Test auth state change listener
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (auth) {
          setStatus('✅ Firebase successfully connected!');
        }
      });

      return () => unsubscribe();
    } catch (error: any) {
      setStatus(`❌ Firebase connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  return (
    <div className="p-4 m-4 bg-gray-100 rounded">
      <h2 className="text-lg font-bold mb-2">Firebase Connection Status:</h2>
      <p>{status}</p>
    </div>
  );
}
