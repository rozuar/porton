const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

// Validar que la URL de la API esté configurada en producción
if (typeof window !== 'undefined' && API_BASE === 'http://localhost:3000') {
  console.warn('⚠️ NEXT_PUBLIC_API_URL no está configurada. Usando localhost (solo para desarrollo)');
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

export async function api<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: `Error ${response.status}: ${response.statusText}` 
      }));
      throw new Error(error.message || `Error en la petición (${response.status})`);
    }

    return response.json();
  } catch (error) {
    // Mejorar mensajes de error para problemas de conexión
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `No se pudo conectar a la API. Verifica que:\n` +
        `1. La variable NEXT_PUBLIC_API_URL esté configurada\n` +
        `2. La API esté corriendo en: ${API_BASE}\n` +
        `3. No haya problemas de CORS o red`
      );
    }
    throw error;
  }
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
};

// Gates
export const gatesApi = {
  open: (token: string, deviceId: string) =>
    api<{ success: boolean; requestId: string; message: string }>('/gates/open', {
      method: 'POST',
      body: { deviceId },
      token,
    }),
};
