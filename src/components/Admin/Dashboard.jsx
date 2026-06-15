import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../services/authService';
import api from '../../services/api';
import { 
  FiUsers, FiUserPlus, FiTrash2, FiLogOut, 
  FiUser, FiPhone, FiMail, FiCheckCircle, 
  FiHome, FiRefreshCw, FiMenu,
  FiTrendingUp, FiClock, FiEdit2,
  FiPlus, FiX, FiBell, FiSettings, FiHelpCircle
} from 'react-icons/fi';
import { MdAdminPanelSettings, MdSms, MdVerified } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({ 
    name: '', phone: '', email: '', password: '', is_active: true 
  });
  const { user, logout: clearStore, token, setToken, setUser, setUserRole } = useAuthStore();
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const storeToken = token;
      
      if (!accessToken && !storeToken) {
        navigate('/');
        return;
      }
      
      if (accessToken && !storeToken) {
        setToken(accessToken);
      }
      
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          if (!user && response.data.user) {
            setUser(response.data.user);
            setUserRole(response.data.user.role || 'admin');
          }
          fetchUsers();
        } else {
          throw new Error('Invalid response');
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        clearStore();
        navigate('/');
      }
    };
    
    checkAuth();
  }, []);

  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/auth/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        clearStore();
        navigate('/');
      }
      showNotification('Failed to fetch users', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showNotification('Name and phone number are required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/auth/admin/users', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        password: formData.password || null,
        is_active: formData.is_active
      });
      
      showNotification('User created successfully!', 'success');
      setShowAddModal(false);
      setFormData({ name: '', phone: '', email: '', password: '', is_active: true });
      fetchUsers();
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to create user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/auth/admin/users/${editingUser.id}`, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        is_active: formData.is_active
      });
      
      showNotification('User updated successfully!', 'success');
      setEditingUser(null);
      setFormData({ name: '', phone: '', email: '', password: '', is_active: true });
      fetchUsers();
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    try {
      await api.delete(`/auth/admin/users/${id}`);
      showNotification(`${name} deleted successfully`, 'success');
      setShowDeleteConfirm(null);
      fetchUsers();
    } catch (error) {
      showNotification('Failed to delete user', 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    clearStore();
    navigate('/');
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', phone: '', email: '', password: '', is_active: true });
    setShowAddModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      phone: user.phone_number,
      email: user.email || '',
      is_active: user.is_active,
      password: ''
    });
    setShowAddModal(true);
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    totalLogins: users.reduce((sum, u) => sum + (u.login_count || 0), 0),
    todayLogins: users.filter(u => {
      if (!u.last_login) return false;
      const today = new Date().toDateString();
      return new Date(u.last_login).toDateString() === today;
    }).length
  };

  const getMethodIcon = (method) => {
    if (!method) return null;
    switch(method) {
      case 'sms': return <MdSms size={14} className="text-purple-600" />;
      case 'whatsapp': return <FaWhatsapp size={14} className="text-green-600" />;
      case 'email': return <FiMail size={14} className="text-blue-600" />;
      default: return null;
    }
  };

  const getMethodColor = (method) => {
    switch(method) {
      case 'sms': return 'bg-purple-100 text-purple-700';
      case 'whatsapp': return 'bg-green-100 text-green-700';
      case 'email': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <FiMenu size={22} />
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-72 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MdAdminPanelSettings size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold">Admin Panel</h1>
                <p className="text-xs text-white/50">Control Dashboard</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-lg font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <h4 className="font-semibold">{user?.name || 'Administrator'}</h4>
                <p className="text-xs text-white/50">Admin</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white">
              <FiHome size={18} />
              <span>Dashboard</span>
            </a>
            <button onClick={openAddModal} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all">
              <FiUserPlus size={18} />
              <span>Add New User</span>
            </button>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all">
              <FiUsers size={18} />
              <span>Manage Users</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all">
              <FiSettings size={18} />
              <span>Settings</span>
            </a>
          </nav>

          <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="lg:ml-72 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name || 'Admin'}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiUsers className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.totalUsers}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Users</h3>
            <p className="text-sm text-gray-400 mt-1">All registered users</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.activeUsers}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Active Users</h3>
            <p className="text-sm text-gray-400 mt-1">{stats.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-orange-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.totalLogins}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Logins</h3>
            <p className="text-sm text-gray-400 mt-1">Across all users</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiClock className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.todayLogins}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Today's Logins</h3>
            <p className="text-sm text-gray-400 mt-1">Active today</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <FiUsers className="text-purple-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">{users.length} total</span>
            </div>
            <div className="flex gap-3">
              <button onClick={fetchUsers} className="p-2 text-gray-500 hover:text-purple-600 transition-colors">
                <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={18} />
              </button>
              <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all">
                <FiPlus size={18} />
                Add User
              </button>
            </div>
          </div>

          {refreshing ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiUsers size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No users yet</h3>
              <p className="text-gray-500 mb-4">Create your first user to get started</p>
              <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg">
                <FiUserPlus size={18} />
                Add Your First User
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logins</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center font-semibold text-indigo-600">
                            {userItem.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{userItem.name}</p>
                            <p className="text-xs text-gray-400">ID: {userItem.id?.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <FiPhone size={12} /> {userItem.phone_number}
                          </p>
                          {userItem.email && (
                            <p className="flex items-center gap-2 text-sm text-gray-500">
                              <FiMail size={12} /> {userItem.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex flex-col items-center px-3 py-1 bg-green-50 rounded-lg">
                          <span className="text-lg font-bold text-green-600">{userItem.login_count || 0}</span>
                          <span className="text-xs text-gray-500">times</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {userItem.last_login ? (
                          <div>
                            <p className="text-sm text-gray-800">{new Date(userItem.last_login).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-400">{new Date(userItem.last_login).toLocaleTimeString()}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Never</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {userItem.last_login_method ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(userItem.last_login_method)}`}>
                            {getMethodIcon(userItem.last_login_method)}
                            {userItem.last_login_method}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          userItem.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {userItem.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(userItem)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <FiEdit2 size={16} />
                          </button>
                          <button onClick={() => setShowDeleteConfirm(userItem)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowAddModal(false); setEditingUser(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                {editingUser ? <FiEdit2 className="text-purple-600" size={20} /> : <FiUserPlus className="text-purple-600" size={20} />}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{editingUser ? 'Edit User' : 'Create New User'}</h2>
              <button onClick={() => { setShowAddModal(false); setEditingUser(null); }} className="ml-auto text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Leave empty for no password"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">Active Account</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowAddModal(false); setEditingUser(null); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50">
                  {loading ? 'Processing...' : (editingUser ? 'Update User' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FiTrash2 className="text-red-600" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Delete User</h2>
              <button onClick={() => setShowDeleteConfirm(null)} className="ml-auto text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700">Are you sure you want to delete <strong>{showDeleteConfirm.name}</strong>?</p>
              <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDeleteUser(showDeleteConfirm.id, showDeleteConfirm.name)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}