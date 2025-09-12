'use client';

import { useState, useEffect } from 'react';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { User, AuthProps } from '../types';

// Local authentication system (fallback when Supabase is not available)
export default function Auth({ onAuthenticated }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is signed in via session storage (more secure for demo)
    const sessionToken = sessionStorage.getItem('smtw_session_token');
    const storedUser = sessionStorage.getItem('smtw_user');
    
    if (sessionToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        onAuthenticated(user);
      } catch (error) {
        // Clear invalid session data
        sessionStorage.removeItem('smtw_session_token');
        sessionStorage.removeItem('smtw_user');
      }
    }
  }, [onAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simple local authentication
      if (isSignUp) {
        // Create a new user locally
        const user: User = {
          id: `user_${Date.now()}`,
          email: email,
          created_at: new Date().toISOString()
        };
        
        // Hash the password before storing
        const hashedPassword = await hashPassword(password);
        
        // Store user credentials with hashed password (for demo only - not secure for production)
        const users = JSON.parse(localStorage.getItem('smtw_users') || '{}');
        users[email] = { hashedPassword, user };
        localStorage.setItem('smtw_users', JSON.stringify(users));
        
        // Generate a session token instead of storing user directly
        const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('smtw_session_token', sessionToken);
        sessionStorage.setItem('smtw_user', JSON.stringify(user));
        
        onAuthenticated(user);
      } else {
        // Sign in with existing user
        const users = JSON.parse(localStorage.getItem('smtw_users') || '{}');
        const userAccount = users[email];
        
        if (userAccount && await verifyPassword(password, userAccount.hashedPassword)) {
          // Generate a session token
          const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('smtw_session_token', sessionToken);
          sessionStorage.setItem('smtw_user', JSON.stringify(userAccount.user));
          onAuthenticated(userAccount.user);
        } else {
          setError('Invalid email or password');
        }
      }
    } catch (err) {
      setError('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create demo user
      const demoUser: User = {
        id: 'demo_user_12345',
        email: 'demo@socialwarden.app',
        created_at: new Date().toISOString()
      };
      
      // Generate a session token for demo user
      const sessionToken = `demo_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('smtw_session_token', sessionToken);
      sessionStorage.setItem('smtw_user', JSON.stringify(demoUser));
      onAuthenticated(demoUser);
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🛡️ Social Media Time Warden</h1>
          <p className="text-purple-100">Sign in to track your digital wellbeing</p>
          <p className="text-purple-200 text-sm mt-2">Local demo version</p>
        </div>

        {/* Security Warning */}
        <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/40 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-300 text-lg">⚠️</span>
            <div className="text-yellow-100 text-sm">
              <p className="font-medium mb-1">Demo Security Notice</p>
              <p>This is a demonstration app with limited security. Credentials are temporarily stored and sessions expire when you close the browser. Do not use real passwords.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-100 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-purple-100 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter password (min 6 chars)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 text-white font-medium py-3 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-purple-200 hover:text-white text-sm underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="mt-4 border-t border-white/20 pt-4">
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-medium py-3 rounded-lg transition-colors duration-200"
          >
            🚀 Try Demo Account
          </button>
          <p className="text-purple-200 text-xs text-center mt-2">
            Quick access with demo user
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-purple-300 text-xs">
            💡 This is a local demo. Data is stored in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
