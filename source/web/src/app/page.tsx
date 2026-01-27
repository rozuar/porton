'use client';

import { useAuthStore } from '@/stores/auth';
import LoginScreen from '@/components/LoginScreen';
import DashboardScreen from '@/components/DashboardScreen';

export default function Home() {
  const { token } = useAuthStore();

  if (token) {
    return <DashboardScreen />;
  }

  return <LoginScreen />;
}
