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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '2rem',
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '500px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2.5rem'
        }}>
          🎉
        </div>
        <h1 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Welcome!</h1>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
          You have successfully logged in!
        </p>
        <div style={{
          background: '#f1f5f9',
          padding: '1rem',
          borderRadius: '1rem',
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <p><strong>Name:</strong> {user?.name || 'Not provided'}</p>
          <p><strong>Phone:</strong> {user?.phoneNumber}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}