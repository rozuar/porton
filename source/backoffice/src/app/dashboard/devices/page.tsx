'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { devicesApi, Device, CreateDeviceDto } from '@/lib/api';

export default function DevicesPage() {
  const { token } = useAuthStore();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateDeviceDto>({
    deviceId: '',
    name: '',
    location: '',
  });

  const fetchDevices = async () => {
    if (!token) return;
    try {
      const data = await devicesApi.getAll(token);
      setDevices(data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await devicesApi.create(token, formData);
      setShowForm(false);
      setFormData({ deviceId: '', name: '', location: '' });
      fetchDevices();
    } catch (error) {
      alert('Error al crear dispositivo');
    }
  };

  if (loading) {
    return <div className="text-gray-500">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dispositivos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nuevo Dispositivo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID del Dispositivo</label>
            <input
              type="text"
              value={formData.deviceId}
              onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
              placeholder="porton-002"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
              placeholder="Portón Garage"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
              placeholder="Garage"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Crear Dispositivo
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div key={device.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">{device.name}</h3>
                <p className="text-sm text-gray-500">{device.deviceId}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                device.status === 'online' ? 'bg-green-100 text-green-700' :
                device.status === 'offline' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {device.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              📍 {device.location || 'Sin ubicación'}
            </p>
            <p className="text-xs text-gray-400">
              Creado: {new Date(device.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
