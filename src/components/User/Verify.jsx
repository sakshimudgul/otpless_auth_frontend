import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyUserOtp } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function UserVerify() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { identifier, setToken, setUser, setUserRole } = useAuthStore();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
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

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;
    setLoading(true);
    try {
      const res = await verifyUserOtp({ phone: identifier, otp: otpCode });
      setToken(res.token);
      setUser(res.user);
      setUserRole('user');
      navigate('/dashboard');
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
        <div className="icon">🔐</div>
        <h2>Verify OTP</h2>
        <p>Enter the 6-digit code sent to <strong>{identifier}</strong></p>
        <div className="otp-group">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              disabled={loading}
            />
          ))}
        </div>
        <button onClick={handleVerify} disabled={loading || otp.join('').length !== 6}>
          {loading ? 'Verifying...' : 'Verify & Login'}
        </button>
        <p className="timer">Resend code in {formatTime(timeLeft)}</p>
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
          border-radius: 24px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .icon { font-size: 3rem; margin-bottom: 1rem; }
        h2 { margin-bottom: 0.5rem; color: #1a1a2e; }
        p { color: #666; margin-bottom: 2rem; }
        .otp-group { display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 2rem; }
        .otp-group input {
          width: 55px; height: 65px; text-align: center; font-size: 1.5rem;
          font-weight: 600; border: 2px solid #e0e0e0; border-radius: 12px;
          transition: all 0.3s;
        }
        .otp-group input:focus { border-color: #667eea; outline: none; }
        button {
          width: 100%; padding: 1rem; background: linear-gradient(135deg, #667eea, #764ba2);
          color: white; border: none; border-radius: 12px; font-size: 1rem;
          font-weight: 600; cursor: pointer;
        }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        .timer { margin-top: 1rem; font-size: 0.85rem; color: #999; }
      `}</style>
    </div>
  );
}