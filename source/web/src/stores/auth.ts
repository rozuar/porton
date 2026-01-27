'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  email: string;
  password: string;
  deviceId: string;
  token: string | null;
  isLoading: boolean;
  isGateActive: boolean;
  statusMessage: string | null;
  error: string | null;
  updateEmail: (value: string) => void;
  updatePassword: (value: string) => void;
  updateDeviceId: (value: string) => void;
  login: () => Promise<void>;
  loginWith: (email: string, password: string) => Promise<void>;
  logout: () => void;
  openGate: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      email: '',
      password: '',
      deviceId: 'porton-001',
      token: null,
      isLoading: false,
      isGateActive: false,
      statusMessage: null,
      error: null,

      updateEmail: (value: string) => {
        set({ email: value, error: null });
      },

      updatePassword: (value: string) => {
        set({ password: value, error: null });
      },

      updateDeviceId: (value: string) => {
        set({ deviceId: value, error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      login: async () => {
        const { email, password, isLoading } = get();
        if (isLoading) return;

        const emailTrimmed = email.trim();
        const passwordTrimmed = password.trim();

        if (!emailTrimmed || !passwordTrimmed) {
          set({ error: 'Por favor completa todos los campos' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const { authApi } = await import('@/lib/api');
          const response = await authApi.login(emailTrimmed, passwordTrimmed);

          if (!response.access_token) {
            throw new Error('Token no recibido del servidor');
          }

          set({
            token: response.access_token,
            isLoading: false,
            password: '',
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      loginWith: async (email: string, password: string) => {
        set({ email, password, error: null });
        await get().login();
      },

      logout: () => {
        set({
          token: null,
          email: '',
          password: '',
          deviceId: 'porton-001',
          isLoading: false,
          isGateActive: false,
          statusMessage: null,
          error: null,
        });
      },

      openGate: async () => {
        const { token, deviceId, isLoading, isGateActive } = get();

        if (isLoading || isGateActive || !token) return;

        set({ isLoading: true, error: null, statusMessage: null });

        try {
          const { gatesApi } = await import('@/lib/api');
          const result = await gatesApi.open(token, deviceId);

          set({
            isLoading: false,
            isGateActive: true,
            statusMessage: 'Comando enviado',
            error: null,
          });

          // Reset después de 10 segundos
          const timeoutId = setTimeout(() => {
            set({
              isGateActive: false,
              statusMessage: 'Listo',
            });
          }, 10000);

          // Guardar timeout ID para poder cancelarlo si es necesario
          // (aunque en este caso no es crítico)
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Error al abrir el portón';
          set({
            isLoading: false,
            isGateActive: false,
            error: errorMessage,
          });
        }
      },
    }),
    {
      name: 'porton-auth-storage',
      partialize: (state) => ({
        token: state.token,
        deviceId: state.deviceId,
        email: state.email,
      }),
    }
  )
);
