'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import LocalAuth from '@/components/LocalAuth';

export default function Home() {
  const [user, setUser] = useState<any>(null);
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

  const handleSignOut = () => {
    localStorage.removeItem('smtw_user');
    setUser(null);
  };

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

  return <Dashboard user={user} onSignOut={handleSignOut} />;
}
