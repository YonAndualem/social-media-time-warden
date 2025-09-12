'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from './Modal';

const API_BASE_URL = 'http://localhost:3002';

interface DailyLimit {
  platform: string;
  daily_limit: number;
}

const PLATFORMS = ['Twitter', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'Snapchat'];

const PLATFORM_EMOJIS = {
  Twitter: '🐦',
  Facebook: '📘',
  Instagram: '📷',
  TikTok: '🎵',
  YouTube: '📺',
  Snapchat: '👻'
};

interface LimitsManagerProps {
  user: any;
}

export default function LimitsManager({ user }: LimitsManagerProps) {
  const [limits, setLimits] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  const userId = user?.id; // Use Supabase user ID

  useEffect(() => {
    if (userId) {
      loadLimits();
    }
  }, [userId]);

  const loadLimits = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/limit?user_id=${userId}`);
      if (response.ok) {
        const limitsData: DailyLimit[] = await response.json();
        const limitsMap: Record<string, number> = {};
        limitsData.forEach(limit => {
          limitsMap[limit.platform] = limit.daily_limit;
        });
        setLimits(limitsMap);
      }
    } catch (error) {
      console.error('Error loading limits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = (platform: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setLimits(prev => ({
      ...prev,
      [platform]: numValue
    }));
  };

  const saveLimits = async () => {
    setSaving(true);
    try {
      for (const [platform, limit] of Object.entries(limits)) {
        if (limit > 0) {
          await fetch(`${API_BASE_URL}/limit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_id: userId,
              platform,
              daily_limit: limit
            })
          });
        }
      }
      setModalConfig({
        isOpen: true,
        message: 'Limits saved successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving limits:', error);
      setModalConfig({
        isOpen: true,
        message: 'Error saving limits. Please try again.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading your limits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/"
              className="text-white hover:text-purple-200 transition-colors"
            >
              ← Back
            </Link>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              🛡️ Daily Limits
            </h1>
          </div>
          <p className="text-purple-100 text-lg">Set daily time limits for each social media platform</p>
        </div>

        {/* Limits Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {PLATFORMS.map(platform => (
              <div key={platform} className="bg-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">
                    {PLATFORM_EMOJIS[platform as keyof typeof PLATFORM_EMOJIS]}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{platform}</h3>
                    <p className="text-purple-200 text-sm">Daily time limit</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    🕐
                    <input
                      type="number"
                      min="0"
                      max="1440"
                      value={limits[platform] || ''}
                      onChange={(e) => handleLimitChange(platform, e.target.value)}
                      placeholder="Minutes"
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="text-purple-200 text-sm">min</span>
                  </div>
                  
                  {limits[platform] > 0 && (
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-purple-500/30 rounded-full text-purple-100 text-sm">
                        {formatTime(limits[platform])} per day
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <button
              onClick={saveLimits}
              disabled={saving}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  💾 Save Limits
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 p-6 bg-white/5 rounded-xl">
            <h4 className="text-lg font-medium text-white mb-3">💡 Tips</h4>
            <ul className="text-purple-100 space-y-2">
              <li>• Set realistic limits that you can stick to</li>
              <li>• Start with higher limits and gradually reduce them</li>
              <li>• You'll get notifications when you approach 80% of your limit</li>
              <li>• Leave a platform at 0 minutes to disable tracking for that platform</li>
              <li>• Limits reset every day at midnight</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Modal
        isOpen={modalConfig.isOpen}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        autoClose={true}
        duration={3000}
      />
    </div>
  );
}
