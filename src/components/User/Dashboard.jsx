import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout as logoutService } from '../../services/authService';
import { 
  FiUser, FiPhone, FiMail, FiLogOut, FiShield, 
  FiClock, FiCalendar, FiCheckCircle, FiHome,
  FiSmartphone, FiMessageCircle, FiBell
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { MdSms, MdVerified } from 'react-icons/md';

export default function UserDashboard() {
  const { user, logout: clearStore } = useAuthStore();
  const navigate = useNavigate();

 const handleLogout = async () => {
  try {
    // Clear token from store first
    clearStore();
    
    // Try to call logout API (optional)
    try {
      await logout();
    } catch (e) {
      // Ignore API errors
    }
    
    // Navigate to login
    navigate('/');
  } catch (error) {
    console.error('Logout failed:', error);
    // Force logout even if error
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
    <div className="user-dashboard">
      {/* Sidebar */}
      <aside className="user-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar-large">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h3>{user?.name || 'User'}</h3>
          <span className="user-role-badge">
            <FiShield size={12} /> {user?.role || 'User'}
          </span>
        </div>
        <nav className="user-nav">
          <a href="#" className="nav-item active" onClick={(e) => e.preventDefault()}>
            <FiHome /> Dashboard
          </a>
          <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
            <FiUser /> Profile
          </a>
          <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
            <FiBell /> Notifications
          </a>
          <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
            <FiShield /> Security
          </a>
        </nav>
        
        {/* Logout Button - Visible at bottom of sidebar */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="user-main">
        {/* Top Bar with Logout (Alternative position) */}
        <div className="top-bar">
          <div className="header-welcome">
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
            <p>Here's what's happening with your account today.</p>
          </div>
          <button onClick={handleLogout} className="top-logout-btn">
            <FiLogOut /> Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="user-stats">
          <div className="stat-item">
            <div className="stat-icon purple">
              <MdVerified />
            </div>
            <div className="stat-details">
              <span className="stat-value">Verified</span>
              <span className="stat-label">Account Status</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon blue">
              <FiSmartphone />
            </div>
            <div className="stat-details">
              <span className="stat-value">{user?.phone || '—'}</span>
              <span className="stat-label">Phone Number</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon green">
              <FiClock />
            </div>
            <div className="stat-details">
              <span className="stat-value">{loginTime}</span>
              <span className="stat-label">Last Login</span>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="card-header">
            <FiUser className="card-icon" />
            <h2>Profile Information</h2>
          </div>
          <div className="profile-info">
            <div className="info-row">
              <div className="info-label">
                <FiUser /> Full Name
              </div>
              <div className="info-value">{user?.name || 'Not provided'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <FiMail /> Email Address
              </div>
              <div className="info-value">{user?.email || 'Not provided'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <FiPhone /> Phone Number
              </div>
              <div className="info-value">{user?.phone || 'Not provided'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <FiShield /> Account Type
              </div>
              <div className="info-value">
                <span className="role-tag">
                  {user?.role === 'admin' ? 'Administrator' : 'Regular User'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Methods Card */}
        <div className="delivery-card">
          <div className="card-header">
            <FiMessageCircle className="card-icon" />
            <h2>Delivery Methods</h2>
          </div>
          <div className="delivery-methods">
            <div className="method-chip">
              <MdSms className="method-icon" />
              <span>SMS OTP</span>
              <FiCheckCircle className="check-icon" />
            </div>
            <div className="method-chip">
              <FaWhatsapp className="method-icon" />
              <span>WhatsApp OTP</span>
              <FiCheckCircle className="check-icon" />
            </div>
          </div>
          <p className="delivery-note">
            You'll receive OTPs via your preferred delivery method during login.
          </p>
        </div>

        {/* Recent Activity */}
        <div className="activity-card">
          <div className="card-header">
            <FiClock className="card-icon" />
            <h2>Recent Activity</h2>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon green">
                <FiCheckCircle />
              </div>
              <div className="activity-details">
                <span className="activity-title">Login Successful</span>
                <span className="activity-time">{loginTime}</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon blue">
                <FiSmartphone />
              </div>
              <div className="activity-details">
                <span className="activity-title">Account Created</span>
                <span className="activity-time">First login</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .user-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f5f7fb;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Sidebar */
        .user-sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          text-align: center;
          border-bottom: 1px solid #f1f5f9;
        }

        .user-avatar-large {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 2rem;
          font-weight: 600;
          color: white;
        }

        .sidebar-header h3 {
          font-size: 1.1rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .user-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          background: #f1f5f9;
          border-radius: 20px;
          font-size: 0.7rem;
          color: #475569;
        }

        .user-nav {
          flex: 1;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }

        .nav-item:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .nav-item.active {
          background: #eef2ff;
          color: #4f46e5;
        }

        /* Sidebar Footer with Logout */
        .sidebar-footer {
          padding: 1rem 1.5rem 1.5rem;
          border-top: 1px solid #f1f5f9;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem;
          background: #fee2e2;
          border: none;
          border-radius: 12px;
          color: #dc2626;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #fecaca;
        }

        /* Top Bar with Logout */
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .top-logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          color: #64748b;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .top-logout-btn:hover {
          background: #fee2e2;
          border-color: #fecaca;
          color: #dc2626;
        }

        /* Main Content */
        .user-main {
          flex: 1;
          margin-left: 280px;
          padding: 1.5rem;
        }

        .header-welcome h1 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .header-welcome p {
          color: #64748b;
        }

        /* Stats */
        .user-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-item {
          background: white;
          border-radius: 16px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-icon.purple {
          background: #f3e8ff;
          color: #9333ea;
        }

        .stat-icon.blue {
          background: #dbeafe;
          color: #2563eb;
        }

        .stat-icon.green {
          background: #dcfce7;
          color: #16a34a;
        }

        .stat-details {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #64748b;
        }

        /* Cards */
        .profile-card, .delivery-card, .activity-card {
          background: white;
          border-radius: 20px;
          margin-bottom: 1.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .card-icon {
          font-size: 1.2rem;
          color: #8b5cf6;
        }

        .card-header h2 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .profile-info {
          padding: 1rem 1.5rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f8fafc;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #64748b;
        }

        .info-value {
          font-size: 0.9rem;
          font-weight: 500;
          color: #1e293b;
        }

        .role-tag {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          background: #eef2ff;
          border-radius: 20px;
          font-size: 0.7rem;
          color: #4f46e5;
        }

        .delivery-methods {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.5rem;
        }

        .method-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border-radius: 40px;
          font-size: 0.85rem;
          color: #1e293b;
        }

        .method-icon {
          font-size: 1rem;
        }

        .check-icon {
          color: #10b981;
          font-size: 0.8rem;
        }

        .delivery-note {
          padding: 0 1.5rem 1rem 1.5rem;
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .activity-list {
          padding: 0.5rem 1.5rem 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f8fafc;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .activity-icon.green {
          background: #dcfce7;
          color: #16a34a;
        }

        .activity-icon.blue {
          background: #dbeafe;
          color: #2563eb;
        }

        .activity-details {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .activity-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: #1e293b;
        }

        .activity-time {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        @media (max-width: 768px) {
          .user-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s;
            z-index: 100;
          }
          .user-main {
            margin-left: 0;
          }
          .user-stats {
            grid-template-columns: 1fr;
          }
          .info-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}