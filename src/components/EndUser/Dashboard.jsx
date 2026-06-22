import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../services/authService';
import api from '../../services/api';
import { FiUser, FiLogOut, FiHome, FiClock, FiCheckCircle, FiSmartphone } from 'react-icons/fi';

export default function EndUserDashboard() {
  const { user, logout: clearStore } = useAuthStore();
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    setLoading(true);
    try {
      const response = await api.get('/enduser/usage');
      setUsage(response.data.usage || []);
    } catch (error) {
      console.error('Error fetching usage:', error);
      // Don't show error to user, just show empty state
      setUsage([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    clearStore();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">End User Dashboard</h1>
            <p className="text-indigo-200">Welcome back, {user?.name || 'User'}!</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30">
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500">{user?.phone}</p>
              {user?.email && <p className="text-gray-500">{user?.email}</p>}
              <span className="inline-flex items-center gap-1 px-3 py-1 mt-2 bg-green-100 text-green-700 rounded-full text-sm">
                <FiCheckCircle size={14} /> Verified
              </span>
            </div>
          </div>
        </div>

        {/* Usage History */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Service Usage History</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : usage.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No usage history yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {usage.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{item.service_name || item.display_name}</p>
                    <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    -{item.credits_used} credits
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}