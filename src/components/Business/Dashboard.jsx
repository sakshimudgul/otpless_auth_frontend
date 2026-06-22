import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../services/authService';
import api from '../../services/api';
import { 
  FiUsers, FiUserPlus, FiTrash2, FiLogOut, 
  FiHome, FiRefreshCw, FiMenu,
  FiTrendingUp, FiEdit2, FiPlus, FiX, 
  FiSettings, FiCreditCard, FiBarChart2, FiMail
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { MdSms } from 'react-icons/md';

export default function BusinessDashboard() {
  const [endUsers, setEndUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [purchaseData, setPurchaseData] = useState({ service_id: '', credits: 10 });
  const [stats, setStats] = useState({ totalEndUsers: 0, activeServices: 0, totalCredits: 0 });
  const { user, logout: clearStore } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [endUsersRes, servicesRes, availableRes, statsRes] = await Promise.all([
        api.get('/business/end-users'),
        api.get('/business/services'),
        api.get('/business/available-services'),
        api.get('/business/stats')
      ]);
      
      setEndUsers(endUsersRes.data.endUsers || []);
      setServices(servicesRes.data.services || []);
      setAvailableServices(availableRes.data.services || []);
      setStats(statsRes.data.stats || { totalEndUsers: 0, activeServices: 0, totalCredits: 0 });
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEndUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/business/end-users', formData);
      setShowAddModal(false);
      setFormData({ name: '', phone: '', email: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create end user');
    }
  };

  const handleDeleteEndUser = async (id) => {
    if (!confirm('Delete this end user?')) return;
    try {
      await api.delete(`/business/end-users/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete end user');
    }
  };

  const handlePurchaseService = async (e) => {
    e.preventDefault();
    try {
      await api.post('/business/services/purchase', purchaseData);
      setShowPurchaseModal(false);
      setPurchaseData({ service_id: '', credits: 10 });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to purchase service');
    }
  };

  const handleLogout = async () => {
    await logout();
    clearStore();
    navigate('/business/login');
  };

  const getServiceIcon = (name) => {
    switch(name) {
      case 'sms': return <MdSms className="text-purple-600" size={24} />;
      case 'whatsapp': return <FaWhatsapp className="text-green-600" size={24} />;
      case 'email': return <FiMail className="text-blue-600" size={24} />;
      default: return <FiCreditCard className="text-gray-600" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-72 h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">Business Panel</h1>
          <p className="text-sm text-white/50">{user?.business_name || user?.name}</p>
        </div>
        <nav className="p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10">
            <FiHome /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <FiUsers /> End Users
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <FiCreditCard /> Services
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <FiBarChart2 /> Analytics
          </a>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md">
        <FiMenu size={22} />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="lg:ml-72 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Manage your end users and services</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowPurchaseModal(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <FiCreditCard /> Buy Credits
            </button>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <FiUserPlus /> Add End User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total End Users</p>
                <p className="text-2xl font-bold">{stats.totalEndUsers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiUsers className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Services</p>
                <p className="text-2xl font-bold">{stats.activeServices}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiCreditCard className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Credits</p>
                <p className="text-2xl font-bold">{stats.totalCredits}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Your Services</h2>
          </div>
          <div className="p-6">
            {services.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No services purchased yet. Buy credits to get started.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {getServiceIcon(service.name)}
                      <h3 className="font-semibold">{service.display_name}</h3>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">{service.credits_remaining}</p>
                    <p className="text-sm text-gray-500">credits remaining</p>
                    <p className="text-xs text-gray-400 mt-2">${service.price_per_unit || 0} per credit</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* End Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">End Users</h2>
            <button onClick={fetchData} className="text-gray-500 hover:text-indigo-600">
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : endUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No end users yet. Add your first end user!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {endUsers.map((endUser) => (
                    <tr key={endUser.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{endUser.name}</td>
                      <td className="px-6 py-4">{endUser.phone_number}</td>
                      <td className="px-6 py-4">{endUser.email || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          endUser.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {endUser.is_verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDeleteEndUser(endUser.id)} className="text-red-600 hover:text-red-800">
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

      {/* Add End User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add End User</h2>
              <button onClick={() => setShowAddModal(false)}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleCreateEndUser}>
              <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              <input type="email" placeholder="Email (optional)" className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create End User</button>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Service Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPurchaseModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Purchase Credits</h2>
              <button onClick={() => setShowPurchaseModal(false)}><FiX size={20} /></button>
            </div>
            <form onSubmit={handlePurchaseService}>
              <select className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={purchaseData.service_id} onChange={e => setPurchaseData({...purchaseData, service_id: e.target.value})} required>
                <option value="">Select Service</option>
                {availableServices.map((service) => (
                  <option key={service.id} value={service.id}>{service.display_name}</option>
                ))}
              </select>
              <input type="number" placeholder="Number of Credits" className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={purchaseData.credits} onChange={e => setPurchaseData({...purchaseData, credits: parseInt(e.target.value)})} min="1" required />
              <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Purchase Credits</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}