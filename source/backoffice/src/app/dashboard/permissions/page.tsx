'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { permissionsApi, usersApi, devicesApi, Permission, User, Device, CreatePermissionDto } from '@/lib/api';

export default function PermissionsPage() {
  const { token } = useAuthStore();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreatePermissionDto>({
    userId: '',
    deviceId: '',
    fromTime: '',
    toTime: '',
  });

  const fetchData = async () => {
    if (!token) return;
    try {
      const [permsData, usersData, devicesData] = await Promise.all([
        permissionsApi.getAll(token),
        usersApi.getAll(token),
        devicesApi.getAll(token),
      ]);
      setPermissions(permsData);
      setUsers(usersData);
      setDevices(devicesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const data: CreatePermissionDto = {
        userId: formData.userId,
        deviceId: formData.deviceId,
      };
      if (formData.fromTime) data.fromTime = formData.fromTime;
      if (formData.toTime) data.toTime = formData.toTime;

      await permissionsApi.create(token, data);
      setShowForm(false);
      setFormData({ userId: '', deviceId: '', fromTime: '', toTime: '' });
      fetchData();
    } catch (error) {
      alert('Error al crear permiso');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('¿Eliminar este permiso?')) return;
    try {
      await permissionsApi.delete(token, id);
      fetchData();
    } catch (error) {
      alert('Error al eliminar permiso');
    }
  };

  if (loading) {
    return <div className="text-gray-500">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Permisos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nuevo Permiso'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <select
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
              required
            >
              <option value="">Seleccionar usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.email}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dispositivo</label>
            <select
              value={formData.deviceId}
              onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
              required
            >
              <option value="">Seleccionar dispositivo</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>{device.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desde (opcional)</label>
              <input
                type="time"
                value={formData.fromTime}
                onChange={(e) => setFormData({ ...formData, fromTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta (opcional)</label>
              <input
                type="time"
                value={formData.toTime}
                onChange={(e) => setFormData({ ...formData, toTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">Dejar vacío para acceso las 24 horas</p>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Crear Permiso
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispositivo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {permissions.map((perm) => (
              <tr key={perm.id}>
                <td className="px-6 py-4 text-gray-800">{perm.user?.email || perm.userId}</td>
                <td className="px-6 py-4 text-gray-800">{perm.device?.name || perm.deviceId}</td>
                <td className="px-6 py-4 text-gray-600">
                  {perm.fromTime && perm.toTime
                    ? `${perm.fromTime} - ${perm.toTime}`
                    : '24 horas'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(perm.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
