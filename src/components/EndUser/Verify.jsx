import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { FiCheckCircle, FiAlertCircle, FiSend } from 'react-icons/fi';

export default function EndUserVerify() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser, setUserRole } = useAuthStore();
  const phone = location.state?.identifier;
  const method = location.state?.method || 'sms';

  useEffect(() => {
    if (!phone) {
      navigate('/enduser');
      return;
    }
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
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/enduser/verify', { 
        phone, 
        otp: otpCode,
        name: 'User'
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        setUserRole('enduser');
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/enduser/login', { phone });
      setTimeLeft(300);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter the 6-digit code sent to <strong className="text-green-600">{phone}</strong>
          </p>
          <p className="text-xs text-gray-400 mt-1">via {method.toUpperCase()}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
            <FiAlertCircle /> {error}
          </div>
        )}

        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all disabled:opacity-50"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <FiSend className="animate-spin" /> Verifying...
            </span>
          ) : (
            'Verify & Login →'
          )}
        </button>

        <div className="text-center mt-6">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-400">
              Resend code in <span className="font-semibold text-green-600">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <button onClick={handleResend} className="text-sm text-green-600 font-semibold hover:underline">
              Resend OTP
            </button>
          )}
        </div>

        <div className="text-center mt-4">
          <a href="/" className="text-sm text-gray-500 hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}