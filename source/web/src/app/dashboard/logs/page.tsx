'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { logsApi, Log } from '@/lib/api';

export default function LogsPage() {
  const { token } = useAuthStore();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchLogs = async () => {
      try {
        const data = await logsApi.getAll(token, 100);
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token]);

  if (loading) {
    return <div className="text-gray-500">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Logs de Acceso</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispositivo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-800">{log.user?.email || '-'}</td>
                <td className="px-6 py-4 text-gray-800">{log.device?.name || '-'}</td>
                <td className="px-6 py-4 text-gray-800">{log.action}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    log.result === 'success' ? 'bg-green-100 text-green-700' :
                    log.result === 'denied' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {log.result}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {log.details || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
