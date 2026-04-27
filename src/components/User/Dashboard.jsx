import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout as logoutService } from '../../services/authService';

export default function UserDashboard() {
  const { user, logout: clearStore } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutService();
      clearStore();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      clearStore();
      navigate('/');
    }
  };

  return (
    <div className="dashboard">
      <nav>
        <h1>User Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <div className="content">
        <div className="card">
          <h2>Welcome, {user?.name}!</h2>
          <p>Phone: {user?.phone}</p>
          <p>Role: {user?.role}</p>
        </div>
      </div>

      <style>{`
        .dashboard { min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Inter', sans-serif; }
        nav { background: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { margin: 0; color: #1a1a2e; }
        button { background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
        .content { padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        h2 { margin-top: 0; color: #1a1a2e; }
      `}</style>
    </div>
  );
}