import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, sendUserOtp, sendWhatsAppOtp } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { 
  FiMail, FiLock, FiSmartphone, FiSend, FiUser, 
  FiShield, FiZap, FiGlobe, FiCheckCircle, FiMessageCircle 
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { MdSms, MdAdminPanelSettings } from 'react-icons/md';

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState('sms');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser, setUserRole, setIdentifier } = useAuthStore();

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

  const handleUserOtp = async (e) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    try {
      if (method === 'sms') {
        await sendUserOtp({ phone, name: 'User' });
      } else {
        await sendWhatsAppOtp({ phone, name: 'User' });
      }
      setIdentifier(phone);
      // Pass method to verify page
      navigate('/verify', { state: { method } });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-backdrop"></div>
      <div className="login-grid">
        
        {/* Left Side - Brand Story */}
        <div className="login-brand">
          <div className="brand-content">
            <div className="brand-badge">
              <FiShield size={12} />
              <span>Secure Login</span>
            </div>
            <h1 className="brand-title">
              Welcome to<br />
              <span>OTPless</span> Auth
            </h1>
            <p className="brand-desc">
              Experience passwordless authentication with SMS or WhatsApp. 
              Fast, secure, and hassle-free.
            </p>
            <div className="brand-stats">
              <div className="stat">
                <FiUser className="stat-icon" />
                <span className="stat-number">2.5k+</span>
                <span className="stat-label">Happy Users</span>
              </div>
              <div className="stat">
                <FiZap className="stat-icon" />
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Success Rate</span>
              </div>
              <div className="stat">
                <FiGlobe className="stat-icon" />
                <span className="stat-number">&lt;3s</span>
                <span className="stat-label">OTP Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-wrapper">
          <div className="login-form-card">
            {/* Toggle Switch */}
            <div className="form-toggle">
              <button 
                className={`toggle-option ${!isAdmin ? 'active' : ''}`}
                onClick={() => setIsAdmin(false)}
              >
                <FiUser size={16} /> User
              </button>
              <button 
                className={`toggle-option ${isAdmin ? 'active' : ''}`}
                onClick={() => setIsAdmin(true)}
              >
                <MdAdminPanelSettings size={16} /> Admin
              </button>
            </div>

            {!isAdmin ? (
              // User Login Form
              <form className="login-form" onSubmit={handleUserOtp}>
                <div className="form-header">
                  <h2>Hey there! 👋</h2>
                  <p>Enter your number to get started</p>
                </div>

                <div className="input-field">
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="phone">Phone Number</label>
                  <FiSmartphone className="field-icon" />
                </div>

                <div className="method-selector">
                  <label>Choose delivery method</label>
                  <div className="method-cards">
                    <div 
                      className={`method-card ${method === 'sms' ? 'selected' : ''}`}
                      onClick={() => setMethod('sms')}
                    >
                      <MdSms className="method-icon" />
                      <span className="method-name">SMS</span>
                      <span className="method-note">Text message</span>
                      {method === 'sms' && <FiCheckCircle className="check-icon" />}
                    </div>
                    <div 
                      className={`method-card ${method === 'whatsapp' ? 'selected' : ''}`}
                      onClick={() => setMethod('whatsapp')}
                    >
                      <FaWhatsapp className="method-icon" />
                      <span className="method-name">WhatsApp</span>
                      <span className="method-note">Instant delivery</span>
                      {method === 'whatsapp' && <FiCheckCircle className="check-icon" />}
                    </div>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <span className="btn-loading">
                      <FiSend className="spinner" /> Sending...
                    </span>
                  ) : (
                    <span>Continue →</span>
                  )}
                </button>
              </form>
            ) : (
              // Admin Login Form
              <form className="login-form" onSubmit={handleAdminLogin}>
                <div className="form-header">
                  <h2>Welcome back! 👨‍💼</h2>
                  <p>Admin access only</p>
                </div>

                <div className="input-field">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="email">Email Address</label>
                  <FiMail className="field-icon" />
                </div>

                <div className="input-field">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="password">Password</label>
                  <FiLock className="field-icon" />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <span className="btn-loading">
                      <FiSend className="spinner" /> Logging in...
                    </span>
                  ) : (
                    <span>Login →</span>
                  )}
                </button>
              </form>
            )}

            <div className="form-footer">
              <p className="demo-note">
                {!isAdmin ? (
                  <>✨ No password needed. Just your phone number.</>
                ) : (
                  <>🔐 Demo: admin@otpless.com / Admin@123</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-root {
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          background: #f0f4f8;
        }

        .login-backdrop {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.08), transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.06), transparent 60%);
          pointer-events: none;
        }

        .login-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        /* Left Side - Brand */
        .login-brand {
          background: linear-gradient(135deg, #1e1b4b 0%, #2e1065 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          position: relative;
          overflow: hidden;
        }

        .login-brand::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -20%;
          width: 80%;
          height: 80%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent);
          border-radius: 50%;
        }

        .brand-content {
          max-width: 450px;
          position: relative;
          z-index: 2;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 40px;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          letter-spacing: 0.5px;
          width: fit-content;
        }

        .brand-title {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .brand-title span {
          background: linear-gradient(135deg, #a78bfa, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-desc {
          color: #c4b5fd;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .brand-stats {
          display: flex;
          gap: 2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-icon {
          color: #a78bfa;
          font-size: 1.25rem;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #a78bfa;
        }

        /* Right Side - Form */
        .login-form-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          padding: 2rem;
        }

        .login-form-card {
          max-width: 440px;
          width: 100%;
          background: white;
          border-radius: 28px;
        }

        .form-toggle {
          display: flex;
          gap: 0.5rem;
          background: #f1f5f9;
          padding: 0.25rem;
          border-radius: 60px;
          margin-bottom: 2rem;
        }

        .toggle-option {
          flex: 1;
          padding: 0.6rem;
          border: none;
          background: transparent;
          border-radius: 40px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #64748b;
        }

        .toggle-option.active {
          background: white;
          color: #1e293b;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .login-form {
          width: 100%;
        }

        .form-header {
          margin-bottom: 1.75rem;
        }

        .form-header h2 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: #64748b;
          font-size: 0.9rem;
        }

        .input-field {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .input-field input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          font-size: 0.95rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          background: #fafcfc;
          transition: all 0.2s;
          outline: none;
        }

        .input-field input:focus {
          border-color: #8b5cf6;
          background: white;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.08);
        }

        .input-field label {
          position: absolute;
          left: 3rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          transition: 0.2s;
          pointer-events: none;
          background: transparent;
          padding: 0 0.25rem;
          font-size: 0.9rem;
        }

        .input-field input:focus + label,
        .input-field input:not(:placeholder-shown) + label {
          top: 0;
          font-size: 0.7rem;
          transform: translateY(-50%);
          background: white;
          color: #8b5cf6;
        }

        .field-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          color: #94a3b8;
        }

        .method-selector {
          margin-bottom: 1.75rem;
        }

        .method-selector label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #475569;
          margin-bottom: 0.75rem;
        }

        .method-cards {
          display: flex;
          gap: 0.75rem;
        }

        .method-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .method-card:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-2px);
        }

        .method-card.selected {
          border-color: #8b5cf6;
          background: #f5f3ff;
        }

        .method-icon {
          font-size: 1.8rem;
          color: #64748b;
        }

        .method-card.selected .method-icon {
          color: #8b5cf6;
        }

        .method-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
        }

        .method-note {
          font-size: 0.65rem;
          color: #94a3b8;
        }

        .check-icon {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          font-size: 0.9rem;
          color: #8b5cf6;
        }

        .submit-btn {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 40px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0.75rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-loading {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .form-footer {
          text-align: center;
          margin-top: 1.25rem;
        }

        .demo-note {
          font-size: 0.7rem;
          color: #94a3b8;
          background: #f8fafc;
          padding: 0.6rem;
          border-radius: 20px;
        }

        @media (max-width: 900px) {
          .login-grid {
            grid-template-columns: 1fr;
          }
          .login-brand {
            padding: 2rem;
            text-align: center;
          }
          .brand-badge {
            margin-left: auto;
            margin-right: auto;
          }
          .brand-stats {
            justify-content: center;
          }
          .form-toggle {
            max-width: 280px;
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 480px) {
          .method-cards {
            flex-direction: column;
          }
          .login-form-card {
            padding: 0;
          }
          .brand-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}