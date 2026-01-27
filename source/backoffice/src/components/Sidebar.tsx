'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { 
  FaShieldAlt, 
  FaChartBar, 
  FaUsers, 
  FaMicrochip, 
  FaLock, 
  FaFileAlt,
  FaSignOutAlt 
} from 'react-icons/fa';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FaChartBar },
  { name: 'Usuarios', href: '/dashboard/users', icon: FaUsers },
  { name: 'Dispositivos', href: '/dashboard/devices', icon: FaMicrochip },
  { name: 'Permisos', href: '/dashboard/permissions', icon: FaLock },
  { name: 'Logs', href: '/dashboard/logs', icon: FaFileAlt },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <FaShieldAlt className="text-2xl text-blue-400" />
          <h1 className="text-xl font-bold">Portón Admin</h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <IconComponent className="text-lg" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="text-sm text-gray-400 mb-2">{user?.email}</div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
