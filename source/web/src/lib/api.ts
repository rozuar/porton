const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
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
