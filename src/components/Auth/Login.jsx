import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendSmsOtp, sendWhatsAppOtp } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [method, setMethod] = useState('sms');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIdentifier, setUserInfo } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return;
    
    setLoading(true);
    try {
      if (name) setUserInfo({ name });
      
      if (method === 'sms') {
        await sendSmsOtp({ phone, name });
      } else {
        await sendWhatsAppOtp({ phone, name });
      }
      
      setIdentifier(phone);
      navigate('/verify', { state: { method } });
    } catch (error) {
      alert(error.response?.data?.error || `Failed to send ${method.toUpperCase()} OTP`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" fill="currentColor"/>
            </svg>
          </div>
          <h1>OTP<span>less</span></h1>
          <p>Passwordless authentication</p>
        </div>

        <div className="login-card">
          <div className="card-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder=" "
              />
              <label htmlFor="phone">Phone Number</label>
              <span className="input-icon">📱</span>
            </div>

            <div className="input-group">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
              />
              <label htmlFor="name">Your Name (Optional)</label>
              <span className="input-icon">👤</span>
            </div>

            <div className="method-section">
              <label>Delivery Method</label>
              <div className="method-buttons">
                <button
                  type="button"
                  className={`method-btn ${method === 'sms' ? 'active' : ''}`}
                  onClick={() => setMethod('sms')}
                >
                  <span>📱</span>
                  <span>SMS</span>
                </button>
                <button
                  type="button"
                  className={`method-btn ${method === 'whatsapp' ? 'active' : ''}`}
                  onClick={() => setMethod('whatsapp')}
                >
                  <span>💚</span>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading || !phone}>
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>Continue →</>
              )}
            </button>
          </form>

          <div className="card-footer">
            <p>By continuing, you agree to our <a href="#">Terms</a> & <a href="#">Privacy</a></p>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .login-wrapper {
          display: flex;
          min-height: 100vh;
        }

        /* Left Side - Brand */
        .login-brand {
          flex: 1;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem;
          color: white;
        }

        .brand-icon {
          width: 80px;
          height: 80px;
          background: rgba(255,255,255,0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .brand-icon svg {
          width: 45px;
          height: 45px;
        }

        .login-brand h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .login-brand h1 span {
          font-weight: 300;
        }

        .login-brand p {
          opacity: 0.9;
          font-size: 0.9rem;
        }

        /* Right Side - Form */
        .login-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2rem;
          max-width: 500px;
          margin: 0 auto;
          width: 100%;
        }

        .card-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .card-header h2 {
          font-size: 1.75rem;
          color: #1a1a2e;
          margin-bottom: 0.5rem;
        }

        .card-header p {
          color: #666;
          font-size: 0.9rem;
        }

        .input-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .input-group input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          font-size: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          transition: all 0.3s;
          outline: none;
        }

        .input-group input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }

        .input-group label {
          position: absolute;
          left: 3rem;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          transition: all 0.3s;
          pointer-events: none;
          background: white;
          padding: 0 0.25rem;
        }

        .input-group input:focus + label,
        .input-group input:not(:placeholder-shown) + label {
          top: 0;
          font-size: 0.75rem;
          transform: translateY(-50%);
          color: #667eea;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
        }

        .method-section {
          margin-bottom: 1.5rem;
        }

        .method-section label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          color: #333;
          margin-bottom: 0.75rem;
        }

        .method-buttons {
          display: flex;
          gap: 1rem;
        }

        .method-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
          color: #666;
        }

        .method-btn:hover {
          border-color: #667eea;
          background: #f8f9ff;
        }

        .method-btn.active {
          border-color: #667eea;
          background: #667eea;
          color: white;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(102,126,234,0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .card-footer {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e0e0e0;
        }

        .card-footer p {
          font-size: 0.75rem;
          color: #999;
        }

        .card-footer a {
          color: #667eea;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .login-wrapper {
            flex-direction: column;
          }
          .login-brand {
            padding: 2rem;
          }
          .login-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}