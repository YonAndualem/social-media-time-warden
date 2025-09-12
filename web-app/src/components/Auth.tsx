'use client';

import { useState, useEffect } from 'react';
import { supabase, signInWithEmail, signUpWithEmail, signOut } from '@/lib/supabase';

interface AuthProps {
  onAuthenticated: (user: any) => void;
}

export default function Auth({ onAuthenticated }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already signed in
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        onAuthenticated(user);
      }
    };
    
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        onAuthenticated(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [onAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isSignUp) {
        result = await signUpWithEmail(email, password);
        if (result.error) {
          setError(result.error.message);
        } else {
          setError('Check your email for confirmation link!');
        }
      } else {
        result = await signInWithEmail(email, password);
        if (result.error) {
          setError(result.error.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    
    // Create a demo account with a consistent ID
    const demoEmail = 'demo@socialwarden.app';
    const demoPassword = 'demo123456';
    
    try {
      // Try to sign in first
      let result = await signInWithEmail(demoEmail, demoPassword);
      
      if (result.error && result.error.message.includes('Invalid login credentials')) {
        // If demo account doesn't exist, create it
        result = await signUpWithEmail(demoEmail, demoPassword);
        if (result.error) {
          setError('Could not create demo account: ' + result.error.message);
        } else {
          setError('Demo account created! Check email for confirmation or try signing in.');
        }
      } else if (result.error) {
        setError(result.error.message);
      }
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
            Quick access with pre-configured demo data
          </p>
        </div>
      </div>
    </div>
  );
}
