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
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        const error = await response.json();
        
        // NestJS devuelve errores en formato { message, error, statusCode }
        // o puede ser un string simple
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (Array.isArray(error.message)) {
          // Errores de validación vienen como array
          errorMessage = error.message.join('; ');
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.error) {
          errorMessage = error.error;
        }
        
        // Mensajes más amigables para errores comunes
        if (response.status === 409) {
          errorMessage = errorMessage.includes('email') || errorMessage.includes('Email')
            ? errorMessage
            : 'Este email ya está registrado. Usa otro email.';
        } else if (response.status === 400) {
          if (!errorMessage.includes('email') && !errorMessage.includes('password')) {
            errorMessage = errorMessage || 'Datos inválidos. Verifica el email y que la contraseña tenga al menos 6 caracteres.';
          }
        } else if (response.status === 403) {
          errorMessage = 'No tienes permisos para realizar esta acción.';
        } else if (response.status === 401) {
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        }
      } catch (parseError) {
        // Si no se puede parsear el JSON, usar el mensaje por defecto
        console.error('Error parsing error response:', parseError);
      }
      
      throw new Error(errorMessage);
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
    api<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  me: (token: string) => api<User>('/auth/me', { token }),
};

// Users
export const usersApi = {
  getAll: (token: string) => api<User[]>('/users', { token }),
  create: (token: string, data: CreateUserDto) =>
    api<User>('/users', { method: 'POST', body: data, token }),
};

// Devices
export const devicesApi = {
  getAll: (token: string) => api<Device[]>('/devices', { token }),
  create: (token: string, data: CreateDeviceDto) =>
    api<Device>('/devices', { method: 'POST', body: data, token }),
};

// Permissions
export const permissionsApi = {
  getAll: (token: string) => api<Permission[]>('/permissions', { token }),
  create: (token: string, data: CreatePermissionDto) =>
    api<Permission>('/permissions', { method: 'POST', body: data, token }),
  delete: (token: string, id: string) =>
    api<void>(`/permissions/${id}`, { method: 'DELETE', token }),
};

// Logs
export const logsApi = {
  getAll: (token: string, limit?: number) =>
    api<Log[]>(`/logs${limit ? `?limit=${limit}` : ''}`, { token }),
};

// Gates
export const gatesApi = {
  open: (token: string, deviceId: string) =>
    api<{ success: boolean; requestId: string }>('/gates/open', {
      method: 'POST',
      body: { deviceId },
      token,
    }),
};

// Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  isActive: boolean;
  createdAt: string;
}

export interface Device {
  id: string;
  deviceId: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'unknown';
  createdAt: string;
}

export interface Permission {
  id: string;
  userId: string;
  deviceId: string;
  user?: User;
  device?: Device;
  fromTime: string | null;
  toTime: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Log {
  id: string;
  userId: string;
  deviceId: string;
  user?: User;
  device?: Device;
  action: string;
  result: 'success' | 'denied' | 'error';
  details: string;
  timestamp: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role?: 'admin' | 'user' | 'guest';
}

export interface CreateDeviceDto {
  deviceId: string;
  name: string;
  location?: string;
}

export interface CreatePermissionDto {
  userId: string;
  deviceId: string;
  fromTime?: string;
  toTime?: string;
}
