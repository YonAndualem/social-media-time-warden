'use client';

import { useState, useEffect } from 'react';
import LimitsManager from '@/components/LimitsManager';
import LocalAuth from '@/components/LocalAuth';
import { User } from '@/types';

export default function LimitsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is signed in locally
    const storedUser = localStorage.getItem('smtw_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUser(user);
      } catch (error) {
        localStorage.removeItem('smtw_user');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LocalAuth onAuthenticated={setUser} />;
  }

  return <LimitsManager user={user} />;
}
