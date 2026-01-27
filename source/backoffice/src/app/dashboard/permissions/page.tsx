'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { permissionsApi, usersApi, devicesApi, Permission, User, Device, CreatePermissionDto, UpdatePermissionDto } from '@/lib/api';

export default function PermissionsPage() {
  const { token } = useAuthStore();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState<CreatePermissionDto>({
    userId: '',
    deviceId: '',
    fromTime: '',
    toTime: '',
  });
  const [editFormData, setEditFormData] = useState<UpdatePermissionDto>({
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

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setEditFormData({
      fromTime: permission.fromTime || '',
      toTime: permission.toTime || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingPermission(null);
    setEditFormData({ fromTime: '', toTime: '' });
  };

  const handleUpdate = async (id: string) => {
    if (!token) return;
    try {
      const updateData: UpdatePermissionDto = {};
      if (editFormData.fromTime) updateData.fromTime = editFormData.fromTime;
      if (editFormData.toTime) updateData.toTime = editFormData.toTime;
      // Si ambos están vacíos, establecer null para acceso 24 horas
      if (!editFormData.fromTime && !editFormData.toTime) {
        updateData.fromTime = null;
        updateData.toTime = null;
      }
      await permissionsApi.update(token, id, updateData);
      setEditingPermission(null);
      setEditFormData({ fromTime: '', toTime: '' });
      fetchData();
    } catch (error) {
      alert('Error al actualizar permiso');
      console.error('Error updating permission:', error);
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
                  {editingPermission?.id === perm.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="time"
                        value={editFormData.fromTime || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, fromTime: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-800"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={editFormData.toTime || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, toTime: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-800"
                      />
                      <button
                        onClick={() => handleUpdate(perm.id)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium ml-2"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <span>
                      {perm.fromTime && perm.toTime
                        ? `${perm.fromTime} - ${perm.toTime}`
                        : '24 horas'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {editingPermission?.id !== perm.id && (
                      <>
                        <button
                          onClick={() => handleEdit(perm)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(perm.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
