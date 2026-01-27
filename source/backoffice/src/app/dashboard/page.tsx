'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { usersApi, devicesApi, logsApi, gatesApi, User, Device, Log } from '@/lib/api';

export default function DashboardPage() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [usersData, devicesData, logsData] = await Promise.all([
          usersApi.getAll(token),
          devicesApi.getAll(token),
          logsApi.getAll(token, 5),
        ]);
        setUsers(usersData);
        setDevices(devicesData);
        setLogs(logsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleOpenGate = async (deviceId: string) => {
    if (!token) return;
    try {
      await gatesApi.open(token, deviceId);
      alert('Comando enviado');
      const logsData = await logsApi.getAll(token, 5);
      setLogs(logsData);
    } catch (error) {
      alert('Error al abrir portón');
    }
  };

  if (loading) {
    return <div className="text-gray-500">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-blue-600">{users.length}</div>
          <div className="text-gray-500">Usuarios</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-green-600">{devices.length}</div>
          <div className="text-gray-500">Dispositivos</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-purple-600">
            {devices.filter((d) => d.status === 'online').length}
          </div>
          <div className="text-gray-500">En línea</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-4">
          {devices.map((device) => (
            <button
              key={device.id}
              onClick={() => handleOpenGate(device.deviceId)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Abrir {device.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Logs */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimos accesos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Usuario</th>
                <th className="pb-2">Dispositivo</th>
                <th className="pb-2">Acción</th>
                <th className="pb-2">Resultado</th>
                <th className="pb-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100">
                  <td className="py-2 text-gray-800">{log.user?.email || '-'}</td>
                  <td className="py-2 text-gray-800">{log.device?.name || '-'}</td>
                  <td className="py-2 text-gray-800">{log.action}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        log.result === 'success'
                          ? 'bg-green-100 text-green-700'
                          : log.result === 'denied'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {log.result}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
