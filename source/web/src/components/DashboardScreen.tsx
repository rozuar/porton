'use client';

import { useAuthStore } from '@/stores/auth';

export default function DashboardScreen() {
  const {
    deviceId,
    isLoading,
    isGateActive,
    statusMessage,
    error,
    updateDeviceId,
    openGate,
    logout,
  } = useAuthStore();

  const buttonClass = isGateActive
    ? 'w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
    : 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Abrir Portón</h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-1">
              Device ID
            </label>
            <input
              id="deviceId"
              type="text"
              value={deviceId}
              onChange={(e) => updateDeviceId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="porton-001"
              disabled={isLoading || isGateActive}
            />
          </div>

          <button
            onClick={openGate}
            disabled={isLoading || isGateActive}
            className={buttonClass}
          >
            {isLoading || isGateActive ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isGateActive ? 'Abriendo...' : 'Enviando...'}
              </span>
            ) : (
              'Abrir'
            )}
          </button>

          {statusMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center">
              {statusMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={logout}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors mt-4"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
