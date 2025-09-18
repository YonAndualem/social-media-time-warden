'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import LocalAuth from '@/components/LocalAuth';
import { User } from '@/types';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is signed in via session storage
    const sessionToken = sessionStorage.getItem('smtw_session_token');
    const storedUser = sessionStorage.getItem('smtw_user');

    if (sessionToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUser(user);
      } catch (error) {
        // Clear invalid session data
        sessionStorage.removeItem('smtw_session_token');
        sessionStorage.removeItem('smtw_user');
      }
    }
    setLoading(false);
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem('smtw_session_token');
    sessionStorage.removeItem('smtw_user');
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
