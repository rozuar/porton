'use client';

import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/stores/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow max-w-md text-center space-y-4">
          <h1 className="text-xl font-semibold text-gray-800">Acceso restringido</h1>
          <p className="text-gray-600">
            El backoffice esta disponible solo para administradores.
          </p>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
