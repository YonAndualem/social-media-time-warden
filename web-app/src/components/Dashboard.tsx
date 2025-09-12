'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3002';

interface UsageRecord {
  platform: string;
  time_spent: number;
}

interface DailyLimit {
  platform: string;
  daily_limit: number;
}

interface DashboardProps {
  user: any;
  onSignOut: () => void;
}

const PLATFORM_COLORS = {
  Twitter: '#1DA1F2',
  Facebook: '#4267B2', 
  Instagram: '#E4405F',
  TikTok: '#000000',
  YouTube: '#FF0000',
  Snapchat: '#FFFC00'
};

const PLATFORM_EMOJIS = {
  Twitter: '🐦',
  Facebook: '📘',
  Instagram: '📷',
  TikTok: '🎵',
  YouTube: '📺',
  Snapchat: '👻'
};

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [usageData, setUsageData] = useState<UsageRecord[]>([]);
  const [limits, setLimits] = useState<DailyLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const userId = user?.id; // Use Supabase user ID

  useEffect(() => {
    if (userId) {
      loadData();
      
      // Set up auto-refresh every 30 seconds
      const interval = setInterval(() => {
        loadData();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [userId, selectedDate]);

  const loadData = async () => {
    setRefreshing(true);
    try {
      console.log('Dashboard - User ID:', userId);
      console.log('Dashboard - Date:', selectedDate);
      
      // Load usage data
      const usageResponse = await fetch(`${API_BASE_URL}/usage?user_id=${userId}&date=${selectedDate}`);
      if (usageResponse.ok) {
        const usage = await usageResponse.json();
        console.log('Dashboard - Usage data:', usage);
        setUsageData(usage);
      }

      // Load limits
      const limitsResponse = await fetch(`${API_BASE_URL}/limit?user_id=${userId}`);
      if (limitsResponse.ok) {
        const limitsData = await limitsResponse.json();
        setLimits(limitsData);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const totalTime = usageData.reduce((sum, item) => sum + item.time_spent, 0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getUsageWithLimits = () => {
    return usageData.map(usage => {
      const limit = limits.find(l => l.platform === usage.platform);
      return {
        ...usage,
        limit: limit?.daily_limit || 0,
        percentage: limit ? (usage.time_spent / limit.daily_limit) * 100 : 0,
        color: PLATFORM_COLORS[usage.platform as keyof typeof PLATFORM_COLORS] || '#8884d8'
      };
    });
  };

  const chartData = getUsageWithLimits();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading your social media insights...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              🛡️ Social Media Time Warden
            </h1>
            <p className="text-purple-100 text-lg">Take control of your digital wellbeing</p>
            <p className="text-purple-200 text-sm">Welcome, {user.email}</p>
          </div>
          <button
            onClick={onSignOut}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            Sign Out
          </button>
        </div>

        {/* Date Selector */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            📅
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-lg border-0 bg-white/20 text-white"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="flex items-center gap-4 text-white/70 text-sm">
            {refreshing && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </div>
            )}
            {lastUpdated && !refreshing && (
              <div className="flex items-center gap-2">
                🔄 Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live tracking
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Time Today</p>
                <p className="text-2xl font-bold">{formatTime(totalTime)}</p>
              </div>
              🕐
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Platforms Visited</p>
                <p className="text-2xl font-bold">{usageData.length}</p>
              </div>
              📈
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Limits Set</p>
                <p className="text-2xl font-bold">{limits.length}</p>
              </div>
              ⚙️
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Average Session</p>
                <p className="text-2xl font-bold">
                  {usageData.length > 0 ? formatTime(Math.round(totalTime / usageData.length)) : '0m'}
                </p>
              </div>
              🕐
            </div>
          </div>
        </div>

        {/* Detailed List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Platform Details</h3>
          {chartData.length > 0 ? (
            <div className="space-y-4">
              {chartData.map((item) => (
                <div key={item.platform} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {PLATFORM_EMOJIS[item.platform as keyof typeof PLATFORM_EMOJIS]}
                    </span>
                    <div>
                      <p className="text-white font-medium">{item.platform}</p>
                      <p className="text-purple-200 text-sm">
                        {formatTime(item.time_spent)} {item.limit > 0 && `/ ${formatTime(item.limit)} limit`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatTime(item.time_spent)}</p>
                    {item.limit > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.percentage > 100 ? 'bg-red-500' : 
                              item.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs ${
                          item.percentage > 100 ? 'text-red-300' : 
                          item.percentage > 80 ? 'text-yellow-300' : 'text-green-300'
                        }`}>
                          {Math.round(item.percentage)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/70 py-8">
              🕐
              <p>No social media usage recorded for this date.</p>
              <p className="text-sm mt-1">Install the browser extension to start tracking!</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <button 
            onClick={() => window.open('/limits', '_blank')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            ⚙️ Manage Limits
          </button>
          <button 
            onClick={loadData}
            disabled={refreshing}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            {refreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Refreshing...
              </>
            ) : (
              <>
                🔄 Refresh Data
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
