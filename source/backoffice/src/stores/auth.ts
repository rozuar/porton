'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, authApi } from '@/lib/api';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: true,

      login: async (email: string, password: string) => {
        const response = await authApi.login(email, password);
        set({ token: response.access_token, user: response.user });
      },

      logout: () => {
        set({ token: null, user: null });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isLoading: false });
          return;
        }

        try {
          const user = await authApi.me(token);
          set({ user, isLoading: false });
        } catch {
          set({ token: null, user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
