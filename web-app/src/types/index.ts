// Type definitions for the Social Media Time Warden application

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthProps {
  onAuthenticated: (user: User) => void;
}

export interface DashboardProps {
  user: User;
}

export interface LimitsManagerProps {
  user: User;
}

export interface UsageRecord {
  id?: string;
  user_id: string;
  platform: string;
  date: string;
  time_spent: number;
  created_at?: string;
}

export interface DailyLimit {
  id?: string;
  user_id: string;
  platform: string;
  daily_limit: number;
  created_at?: string;
}

export interface Platform {
  name: string;
  displayName: string;
  color: string;
  icon: string;
}

export type SupportedPlatform = 'Twitter' | 'Facebook' | 'Instagram' | 'TikTok' | 'YouTube' | 'Snapchat';

export interface SnoozeData {
  isActive: boolean;
  endsAt: string;
  totalSnoozeTime: number;
}
