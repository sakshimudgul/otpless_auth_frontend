import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifySmsOtp, verifyWhatsAppOtp } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function Verify() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { identifier, tempUserInfo, setToken, setUser } = useAuthStore();
  const method = location.state?.method || 'sms';

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setTimeLeft(300);
    setCanResend(false);
    try {
      if (method === 'sms') {
        await sendSmsOtp({ phone: identifier, name: tempUserInfo?.name });
      } else {
        await sendWhatsAppOtp({ phone: identifier, name: tempUserInfo?.name });
      }
      alert(`${method.toUpperCase()} OTP resent successfully!`);
    } catch (error) {
      alert(`Failed to resend ${method.toUpperCase()} OTP`);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;

    setLoading(true);
    try {
      let response;
      if (method === 'sms') {
        response = await verifySmsOtp({ 
          phone: identifier, 
          otp: otpCode,
          name: tempUserInfo?.name || null
        });
      } else {
        response = await verifyWhatsAppOtp({ 
          phone: identifier, 
          otp: otpCode,
          name: tempUserInfo?.name || null
        });
      }
      
      console.log(`${method.toUpperCase()} Verify response:`, response);
      
      if (response.success && response.token) {
        setToken(response.token);
        setUser(response.user);
        navigate('/dashboard');
      } else {
        alert(response.message || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Verify error:', error);
      alert(error.response?.data?.error || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Back
        </button>

        <div className="verify-icon">
          {method === 'sms' ? '📱' : '💚'}
        </div>

        <h2>Verify via {method.toUpperCase()}</h2>
        <p>Enter the 6-digit code sent to <strong>{identifier}</strong></p>

        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input"
              disabled={loading}
            />
          ))}
        </div>

        <button className="verify-btn" onClick={handleVerify} disabled={loading || otp.join('').length !== 6}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Verifying...
            </>
          ) : (
            'Verify & Continue'
          )}
        </button>

        <div className="resend-section">
          {!canResend ? (
            <p>Resend code in <strong>{formatTime(timeLeft)}</strong></p>
          ) : (
            <button className="resend-btn" onClick={handleResend}>Resend {method.toUpperCase()} Code</button>
          )}
        </div>
      </div>

      <style>{`
        .verify-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', sans-serif;
          padding: 1rem;
        }

        .verify-card {
          max-width: 450px;
          width: 100%;
          background: white;
          border-radius: 2rem;
          padding: 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          position: relative;
          text-align: center;
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

        .back-btn {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
        }

        .back-btn:hover {
          color: #667eea;
        }

        .back-btn svg {
          width: 18px;
          height: 18px;
        }

        .verify-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        h2 {
          font-size: 1.75rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        p {
          color: #64748b;
          margin-bottom: 2rem;
        }

        p strong {
          color: #667eea;
        }

        .otp-container {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .otp-input {
          width: 55px;
          height: 65px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 600;
          border: 2px solid #e2e8f0;
          border-radius: 1rem;
          background: white;
          transition: all 0.3s;
          outline: none;
        }

        .otp-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
          transform: scale(1.05);
        }

        .verify-btn {
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

        .verify-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(102,126,234,0.4);
        }

        .verify-btn:disabled {
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

        .resend-section {
          margin-top: 1.5rem;
        }

        .resend-section p {
          color: #94a3b8;
          font-size: 0.85rem;
          margin-bottom: 0;
        }

        .resend-section p strong {
          color: #667eea;
        }

        .resend-btn {
          background: none;
          border: none;
          color: #667eea;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
        }

        .resend-btn:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .verify-card {
            padding: 1.5rem;
          }
          .otp-input {
            width: 45px;
            height: 55px;
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}