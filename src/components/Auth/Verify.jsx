import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifySmsOtp, verifyWhatsAppOtp, sendSmsOtp, sendWhatsAppOtp } from '../../services/authService';
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
      alert(`${method.toUpperCase()} OTP resent!`);
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
        response = await verifySmsOtp({ phone: identifier, otp: otpCode, name: tempUserInfo?.name });
      } else {
        response = await verifyWhatsAppOtp({ phone: identifier, otp: otpCode, name: tempUserInfo?.name });
      }
      
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
          ← Back
        </button>

        <div className="verify-icon">
          {method === 'sms' ? '📱' : '💚'}
        </div>

        <h2>Verify your identity</h2>
        <p>Enter the 6-digit code sent to <strong>{identifier}</strong> via {method.toUpperCase()}</p>

        <div className="otp-group">
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
          {loading ? <div className="spinner"></div> : 'Verify & Continue'}
        </button>

        <div className="resend-section">
          {!canResend ? (
            <p>Resend code in <strong>{formatTime(timeLeft)}</strong></p>
          ) : (
            <button className="resend-btn" onClick={handleResend}>Resend Code</button>
          )}
        </div>
      </div>

      <style>{`
        .verify-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          padding: 1rem;
        }

        .verify-card {
          max-width: 480px;
          width: 100%;
          background: white;
          border-radius: 24px;
          padding: 2.5rem;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.1);
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .back-btn {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 0.9rem;
          transition: color 0.3s;
        }

        .back-btn:hover {
          color: #667eea;
        }

        .verify-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .verify-card h2 {
          font-size: 1.5rem;
          color: #1a1a2e;
          margin-bottom: 0.5rem;
        }

        .verify-card p {
          color: #666;
          margin-bottom: 2rem;
        }

        .verify-card p strong {
          color: #667eea;
        }

        .otp-group {
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
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          transition: all 0.3s;
          outline: none;
        }

        .otp-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
          transform: translateY(-2px);
        }

        .verify-btn {
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
          margin-bottom: 1rem;
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
          margin: 0 auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .resend-section {
          text-align: center;
        }

        .resend-section p {
          color: #999;
          font-size: 0.85rem;
        }

        .resend-section p strong {
          color: #667eea;
        }

        .resend-btn {
          background: none;
          border: none;
          color: #667eea;
          font-size: 0.85rem;
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