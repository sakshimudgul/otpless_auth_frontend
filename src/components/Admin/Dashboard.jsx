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
  FiPlus, FiX, FiBell, FiSettings, FiHelpCircle,
  FiBriefcase, FiSidebar
} from 'react-icons/fi';
import { MdAdminPanelSettings, MdSms, MdVerified } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [businessUsers, setBusinessUsers] = useState([]);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [businessFormData, setBusinessFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    business_name: '',
    is_active: true
  });
  const { user, logout: clearStore, token, setToken, setUser, setUserRole } = useAuthStore();
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('token');
      const storeToken = token;
      
      if (!accessToken && !storeToken) {
        navigate('/admin/login');
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
          fetchBusinessUsers();
        } else {
          throw new Error('Invalid response');
        }
      } catch (error) {
        localStorage.removeItem('token');
        clearStore();
        navigate('/admin/login');
      }
    };
    
    checkAuth();
  }, []);

  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        clearStore();
        navigate('/admin/login');
      }
      showNotification('Failed to fetch users', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const fetchBusinessUsers = async () => {
    try {
      const response = await api.get('/admin/business-users');
      setBusinessUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch business users:', error);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleCreateBusinessUser = async (e) => {
    e.preventDefault();
    if (!businessFormData.name || !businessFormData.email || !businessFormData.password) {
      showNotification('Name, email and password are required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/admin/business-users', {
        name: businessFormData.name,
        email: businessFormData.email,
        phone: businessFormData.phone || null,
        password: businessFormData.password,
        business_name: businessFormData.business_name || null,
        is_active: businessFormData.is_active
      });
      
      showNotification('Business user created successfully!', 'success');
      setShowBusinessModal(false);
      setBusinessFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        business_name: '',
        is_active: true
      });
      fetchBusinessUsers();
      fetchUsers();
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to create business user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    try {
      await api.delete(`/admin/users/${id}`);
      showNotification(`${name} deleted successfully`, 'success');
      setShowDeleteConfirm(null);
      fetchUsers();
      fetchBusinessUsers();
    } catch (error) {
      showNotification('Failed to delete user', 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    clearStore();
    navigate('/admin/login');
  };

  const openBusinessModal = () => {
    setShowBusinessModal(true);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    totalBusiness: businessUsers.length,
    activeBusiness: businessUsers.filter(u => u.is_active).length,
    totalLogins: users.reduce((sum, u) => sum + (u.login_count || 0), 0),
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
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
      >
        <FiMenu size={24} className="text-gray-700" />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-72 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
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

          {/* Admin Info */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-lg font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <h4 className="font-semibold">{user?.name || 'Admin'}</h4>
                <p className="text-xs text-white/50">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'users' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FiUsers size={18} />
              <span>End Users</span>
            </button>
            <button 
              onClick={() => setActiveTab('business')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'business' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FiBriefcase size={18} />
              <span>Business Users</span>
            </button>
            <button 
              onClick={openBusinessModal} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600/20 text-white hover:bg-blue-600/30 transition-all"
            >
              <FiUserPlus size={18} />
              <span>Add Business User</span>
            </button>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name || 'Admin'}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiUsers className="text-purple-600" size={20} />
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-800">{stats.totalUsers}</span>
            </div>
            <h3 className="text-xs md:text-sm text-gray-600 font-medium">Total End Users</h3>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiBriefcase className="text-blue-600" size={20} />
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-800">{stats.totalBusiness}</span>
            </div>
            <h3 className="text-xs md:text-sm text-gray-600 font-medium">Business Users</h3>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="text-green-600" size={20} />
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-800">{stats.activeBusiness}</span>
            </div>
            <h3 className="text-xs md:text-sm text-gray-600 font-medium">Active Business</h3>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-orange-600" size={20} />
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-800">{stats.totalLogins}</span>
            </div>
            <h3 className="text-xs md:text-sm text-gray-600 font-medium">Total Logins</h3>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              {activeTab === 'users' ? (
                <FiUsers className="text-purple-600" size={20} />
              ) : (
                <FiBriefcase className="text-blue-600" size={20} />
              )}
              <h2 className="text-lg font-semibold text-gray-800">
                {activeTab === 'users' ? 'End Users' : 'Business Users'}
              </h2>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {activeTab === 'users' ? users.length : businessUsers.length} total
              </span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={activeTab === 'users' ? fetchUsers : fetchBusinessUsers} 
                className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
              >
                <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={18} />
              </button>
              {activeTab === 'business' && (
                <button 
                  onClick={openBusinessModal} 
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all text-sm w-full sm:w-auto justify-center"
                >
                  <FiPlus size={18} />
                  Add Business
                </button>
              )}
            </div>
          </div>

          {refreshing ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logins</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(activeTab === 'users' ? users : businessUsers).map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center font-semibold text-indigo-600 text-sm">
                            {userItem.name?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">{userItem.name}</p>
                            <p className="text-xs text-gray-400">ID: {userItem.id?.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <FiPhone size={12} className="flex-shrink-0" /> 
                            <span className="truncate">{userItem.phone_number || '—'}</span>
                          </p>
                          {userItem.email && (
                            <p className="flex items-center gap-2 text-sm text-gray-500">
                              <FiMail size={12} className="flex-shrink-0" /> 
                              <span className="truncate">{userItem.email}</span>
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="truncate block max-w-[100px]">{userItem.business_name || '—'}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="inline-flex flex-col items-center px-3 py-1 bg-green-50 rounded-lg">
                          <span className="text-lg font-bold text-green-600">{userItem.login_count || 0}</span>
                          <span className="text-xs text-gray-500">times</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          userItem.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {userItem.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <button 
                          onClick={() => setShowDeleteConfirm(userItem)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Business User Modal */}
      {showBusinessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowBusinessModal(false); }}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center gap-3 sticky top-0 bg-white z-10">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiBriefcase className="text-blue-600" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Add Business User</h2>
              <button onClick={() => { setShowBusinessModal(false); }} className="ml-auto text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateBusinessUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={businessFormData.name}
                  onChange={(e) => setBusinessFormData({ ...businessFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={businessFormData.email}
                  onChange={(e) => setBusinessFormData({ ...businessFormData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={businessFormData.phone}
                  onChange={(e) => setBusinessFormData({ ...businessFormData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessFormData.business_name}
                  onChange={(e) => setBusinessFormData({ ...businessFormData, business_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={businessFormData.password}
                  onChange={(e) => setBusinessFormData({ ...businessFormData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="business_is_active"
                  checked={businessFormData.is_active}
                  onChange={(e) => setBusinessFormData({ ...businessFormData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="business_is_active" className="text-sm text-gray-700">Active Account</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowBusinessModal(false); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Business User'}
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