import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../services/authService';
import { 
  FiUser, FiPhone, FiMail, FiLogOut, FiShield, 
  FiClock, FiCheckCircle, FiHome, FiSmartphone, 
  FiMessageCircle, FiCalendar, FiTrendingUp
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { MdSms, MdVerified } from 'react-icons/md';

export default function UserDashboard() {
  const { user, logout: clearStore } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      clearStore();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      clearStore();
      navigate('/');
    }
  };

  const loginTime = new Date().toLocaleTimeString();
  const loginDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h3 className="text-xl font-semibold">{user?.name || 'User'}</h3>
            <span className="inline-flex items-center gap-1 px-3 py-1 mt-2 bg-white/10 rounded-full text-sm">
              <FiShield size={12} /> {user?.role || 'User'}
            </span>
          </div>
          
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white">
              <FiHome /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 transition-all">
              <FiUser /> Profile
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 transition-all">
              <FiMessageCircle /> Notifications
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 transition-all">
              <FiShield /> Security
            </a>
          </nav>
          
          <div className="mt-8 pt-8 border-t border-white/10">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all">
              <FiLogOut /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your account today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MdVerified className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="text-xl font-bold text-green-600">Verified</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiSmartphone className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-lg font-semibold text-gray-800">{user?.phone || user?.phone_number || '—'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FiClock className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="text-md font-semibold text-gray-800">{loginTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FiUser className="text-purple-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100">
                <span className="flex items-center gap-2 text-gray-500">
                  <FiUser size={16} /> Full Name
                </span>
                <span className="font-medium text-gray-800">{user?.name || 'Not provided'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100">
                <span className="flex items-center gap-2 text-gray-500">
                  <FiMail size={16} /> Email Address
                </span>
                <span className="font-medium text-gray-800">{user?.email || 'Not provided'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100">
                <span className="flex items-center gap-2 text-gray-500">
                  <FiPhone size={16} /> Phone Number
                </span>
                <span className="font-medium text-gray-800">{user?.phone || user?.phone_number || 'Not provided'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3">
                <span className="flex items-center gap-2 text-gray-500">
                  <FiShield size={16} /> Account Type
                </span>
                <span className="inline-flex px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {user?.role === 'admin' ? 'Administrator' : 'Regular User'}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Methods */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FiMessageCircle className="text-purple-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">Delivery Methods</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
                  <MdSms className="text-purple-600" size={16} />
                  <span className="text-sm text-gray-700">SMS OTP</span>
                  <FiCheckCircle className="text-green-500" size={14} />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                  <FaWhatsapp className="text-green-600" size={16} />
                  <span className="text-sm text-gray-700">WhatsApp OTP</span>
                  <FiCheckCircle className="text-green-500" size={14} />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                  <FiMail className="text-blue-600" size={16} />
                  <span className="text-sm text-gray-700">Email OTP</span>
                  <FiCheckCircle className="text-green-500" size={14} />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                You'll receive OTPs via your preferred delivery method during login.
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FiClock className="text-purple-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiCheckCircle className="text-green-600" size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Login Successful</p>
                  <p className="text-sm text-gray-500">{loginTime}</p>
                </div>
                <FiCalendar className="text-gray-400" size={14} />
              </div>
              <div className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiSmartphone className="text-blue-600" size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Account Created</p>
                  <p className="text-sm text-gray-500">First login</p>
                </div>
                <FiCalendar className="text-gray-400" size={14} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}