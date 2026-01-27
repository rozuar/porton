'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { usersApi, User, CreateUserDto, UpdateUserDto } from '@/lib/api';

export default function UsersPage() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserDto>({
    email: '',
    password: '',
    role: 'user',
  });

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const data = await usersApi.getAll(token);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingUser) {
        const updateData: UpdateUserDto = {
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await usersApi.update(token, editingUser.id, updateData);
        setEditingUser(null);
      } else {
        await usersApi.create(token, formData);
      }
      setShowForm(false);
      setFormData({ email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : editingUser
        ? 'Error al actualizar usuario. Verifica que el email no esté duplicado y la contraseña tenga al menos 6 caracteres con letras y números.'
        : 'Error al crear usuario. Verifica que el email no esté duplicado y la contraseña tenga al menos 6 caracteres con letras y números.';
      alert(errorMessage);
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ email: '', password: '', role: 'user' });
  };

  const handleToggleActive = async (user: User) => {
    if (!token || !confirm(`¿${user.isActive ? 'Bloquear' : 'Desbloquear'} este usuario?`)) return;
    try {
      await usersApi.toggleActive(token, user.id);
      fetchUsers();
    } catch (error) {
      alert('Error al cambiar el estado del usuario');
      console.error('Error toggling user active:', error);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
        <button
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setShowForm(true);
              setEditingUser(null);
              setFormData({ email: '', password: '', role: 'user' });
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {editingUser && <span className="text-gray-500 text-xs">(dejar vacío para no cambiar)</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
              required={!editingUser}
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 6 caracteres con letras y números
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' | 'guest' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
              <option value="guest">Invitado</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id ?? user.email}>
                <td className="px-6 py-4 text-gray-800">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'user' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`text-sm font-medium ${
                        user.isActive
                          ? 'text-red-600 hover:text-red-800'
                          : 'text-green-600 hover:text-green-800'
                      }`}
                    >
                      {user.isActive ? 'Bloquear' : 'Desbloquear'}
                    </button>
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
