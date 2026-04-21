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
      
      let response;
      if (method === 'sms') {
        response = await sendSmsOtp({ phone, name });
      } else {
        response = await sendWhatsAppOtp({ phone, name });
      }
      
      console.log(`${method.toUpperCase()} OTP Response:`, response);
      
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
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" fill="currentColor"/>
            </svg>
          </div>
          <h1>OTP<span>less</span></h1>
          <p>Secure passwordless authentication</p>
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
            <label>Choose Delivery Method</label>
            <div className="method-options">
              <button
                type="button"
                className={`method-btn ${method === 'sms' ? 'active' : ''}`}
                onClick={() => setMethod('sms')}
              >
                <span className="method-icon">📱</span>
                <span className="method-name">SMS</span>
                <span className="method-desc">Get OTP via text message</span>
              </button>
              <button
                type="button"
                className={`method-btn ${method === 'whatsapp' ? 'active' : ''}`}
                onClick={() => setMethod('whatsapp')}
              >
                <span className="method-icon">💚</span>
                <span className="method-name">WhatsApp</span>
                <span className="method-desc">Get OTP on WhatsApp</span>
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading || !phone}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending {method.toUpperCase()} OTP...
              </>
            ) : (
              <>
                Continue with {method.toUpperCase()}
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="footer">
          <p>By continuing, you agree to our <a href="#">Terms</a> & <a href="#">Privacy</a></p>
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
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 1rem;
        }

        .login-card {
          max-width: 450px;
          width: 100%;
          background: white;
          border-radius: 2rem;
          padding: 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .brand {
          text-align: center;
          margin-bottom: 2rem;
        }

        .brand-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .brand-icon svg {
          width: 40px;
          height: 40px;
          color: white;
        }

        .brand h1 {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand h1 span {
          background: linear-gradient(135deg, #f093fb, #f5576c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand p {
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .input-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .input-group input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          font-size: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 1rem;
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
          color: #9ca3af;
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
          font-size: 1.25rem;
        }

        .method-section {
          margin-bottom: 1.5rem;
        }

        .method-section label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.75rem;
        }

        .method-options {
          display: flex;
          gap: 1rem;
        }

        .method-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 1rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .method-btn:hover {
          border-color: #667eea;
          background: #f8f9ff;
          transform: translateY(-2px);
        }

        .method-btn.active {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .method-btn.active .method-icon,
        .method-btn.active .method-name,
        .method-btn.active .method-desc {
          color: white;
        }

        .method-icon {
          font-size: 2rem;
        }

        .method-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .method-desc {
          font-size: 0.7rem;
          color: #6b7280;
        }

        button[type="submit"] {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 1rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        button[type="submit"]:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(102,126,234,0.4);
        }

        button[type="submit"]:disabled {
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

        .footer {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .footer p {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .footer a {
          color: #667eea;
          text-decoration: none;
        }

        @media (max-width: 640px) {
          .login-card {
            padding: 1.5rem;
          }
          .method-desc {
            display: none;
          }
          .method-btn {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}