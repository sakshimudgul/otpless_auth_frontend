import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, sendUserOtp, sendWhatsAppOtp } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState('sms');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser, setUserRole, setIdentifier } = useAuthStore();

  // Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLogin({ email, password });
      setToken(res.token);
      setUser(res.user);
      setUserRole('admin');
      navigate('/admin/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  // User OTP Login - Send OTP (SMS or WhatsApp)
  const handleUserOtp = async (e) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    try {
      if (method === 'sms') {
        await sendUserOtp({ phone, name: 'User' });
      } else {
        // Call WhatsApp API
        await sendWhatsAppOtp({ phone, name: 'User' });
      }
      setIdentifier(phone);
      navigate('/verify', { state: { method } });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="toggle-buttons">
          <button className={!isAdmin ? 'active' : ''} onClick={() => setIsAdmin(false)}>User Login</button>
          <button className={isAdmin ? 'active' : ''} onClick={() => setIsAdmin(true)}>Admin Login</button>
        </div>

        {!isAdmin ? (
          <form onSubmit={handleUserOtp}>
            <div className="icon">📱</div>
            <h2>OTP Login</h2>
            <p>Enter your phone number to receive OTP</p>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <div className="method-group">
              <button 
                type="button" 
                className={method === 'sms' ? 'active' : ''} 
                onClick={() => setMethod('sms')}
              >
                📱 SMS
              </button>
              <button 
                type="button" 
                className={method === 'whatsapp' ? 'active' : ''} 
                onClick={() => setMethod('whatsapp')}
              >
                💚 WhatsApp
              </button>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin}>
            <div className="icon">👨‍💼</div>
            <h2>Admin Login</h2>
            <p>Enter your admin credentials</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        <div className="footer">
          {!isAdmin ? (
            <p>Default admin: admin@otpless.com / Admin@123</p>
          ) : (
            <p>Use OTP login for user access</p>
          )}
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', sans-serif;
          padding: 1rem;
        }
        .login-card {
          max-width: 420px;
          width: 100%;
          background: white;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .toggle-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }
        .toggle-buttons button {
          flex: 1;
          padding: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: #666;
          transition: all 0.3s;
        }
        .toggle-buttons button.active {
          color: #667eea;
          border-bottom: 2px solid #667eea;
        }
        .icon { font-size: 3rem; text-align: center; margin-bottom: 1rem; }
        h2 { text-align: center; margin-bottom: 0.5rem; color: #1a1a2e; }
        p { text-align: center; color: #666; margin-bottom: 1.5rem; font-size: 0.85rem; }
        input {
          width: 100%;
          padding: 0.9rem;
          margin-bottom: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          outline: none;
        }
        input:focus { border-color: #667eea; }
        .method-group { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .method-group button {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }
        .method-group button.active { border-color: #667eea; background: #667eea; color: white; }
        button[type="submit"] {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        button[type="submit"]:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .footer { text-align: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.75rem; color: #999; }
      `}</style>
    </div>
  );
}