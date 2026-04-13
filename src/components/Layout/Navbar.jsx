import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login/phone');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">OTPless Clone</Link>
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <span className="text-gray-700">Welcome, {user?.name || user?.email || user?.phone}</span>
              <button onClick={handleLogout} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login/phone" className="text-blue-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}