import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="nav-logo">✅</span>
          <span>VerifyMe</span>
        </div>
        <button onClick={handleLogout} className="nav-logout">Logout</button>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <div className="welcome-icon">🎉</div>
          <h1>Welcome back, {user?.name || 'User'}!</h1>
          <p>You have successfully logged in using OTP verification.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📱</div>
            <div className="stat-info">
              <h3>Phone</h3>
              <p>{user?.phoneNumber}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>Name</h3>
              <p>{user?.name || 'Not provided'}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🕐</div>
            <div className="stat-info">
              <h3>Login Time</h3>
              <p>{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Status</h3>
              <p className="status-active">Verified</p>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>Account Information</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">User ID</span>
              <span className="info-value">{user?.id?.slice(0, 8)}...</span>
            </div>
            <div className="info-item">
              <span className="info-label">Login Date</span>
              <span className="info-value">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Session Status</span>
              <span className="info-value status-active">Active</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          font-family: 'Inter', sans-serif;
        }

        .dashboard-nav {
          background: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a2e;
        }

        .nav-logo {
          font-size: 1.5rem;
        }

        .nav-logout {
          background: #f0f0f0;
          border: none;
          color: #666;
          padding: 0.5rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }

        .nav-logout:hover {
          background: #e0e0e0;
          color: #333;
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .welcome-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          margin-bottom: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .welcome-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .welcome-card h1 {
          font-size: 1.5rem;
          color: #1a1a2e;
          margin-bottom: 0.5rem;
        }

        .welcome-card p {
          color: #666;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: transform 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-info h3 {
          font-size: 0.85rem;
          color: #999;
          margin-bottom: 0.25rem;
        }

        .stat-info p {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a2e;
        }

        .status-active {
          color: #10b981;
        }

        .info-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .info-card h3 {
          font-size: 1.1rem;
          color: #1a1a2e;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
        }

        .info-label {
          color: #999;
          font-size: 0.85rem;
        }

        .info-value {
          color: #1a1a2e;
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .dashboard-content {
            padding: 1rem;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}