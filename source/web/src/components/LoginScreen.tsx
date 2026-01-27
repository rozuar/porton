'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth';

const quickProfiles = [
  { label: 'Admin', email: 'admin@porton.com', password: 'CHANGE_ME_PASSWORD' },
  { label: 'Usuario', email: 'user@porton.com', password: 'user123' },
  { label: 'Invitado', email: 'guest@porton.com', password: 'guest123' },
];

export default function LoginScreen() {
  const { email, password, isLoading, error, updateEmail, updatePassword, login, loginWith, clearError } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error || localError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    await login();
  };

  const handleQuickLogin = async (profileEmail: string, profilePassword: string) => {
    setLocalError(null);
    clearError();
    await loginWith(profileEmail, profilePassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Portón</h1>
        <p className="text-center text-gray-600 text-sm mb-6">Control de Acceso</p>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 text-center mb-3">
            Accesos de Prueba
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickProfiles.map((profile) => (
              <button
                key={profile.email}
                type="button"
                onClick={() => handleQuickLogin(profile.email, profile.password)}
                disabled={isLoading}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {profile.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {displayError}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="usuario@porton.com"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => updatePassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="••••••••"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ingresando...
              </span>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
