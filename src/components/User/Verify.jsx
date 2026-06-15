import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyUserOtp, verifyWhatsAppOtp, verifyEmailOtp } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function UserVerify() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser, setUserRole } = useAuthStore();
  const identifier = location.state?.identifier;
  const method = location.state?.method || 'sms';

  useEffect(() => {
    if (!identifier) {
      navigate('/');
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
      let response;
      
      // Call appropriate verification API based on method
      if (method === 'sms') {
        response = await verifyUserOtp({ 
          phone: identifier, 
          otp: otpCode,
          name: 'User'
        });
      } else if (method === 'whatsapp') {
        response = await verifyWhatsAppOtp({ 
          phone: identifier, 
          otp: otpCode,
          name: 'User'
        });
      } else {
        response = await verifyEmailOtp({ 
          email: identifier, 
          otp: otpCode,
          name: 'User'
        });
      }
      
      console.log('Verification response:', response);
      
      // Check for success (handle both 'token' and 'accessToken' formats)
      if (response.success && (response.accessToken || response.token)) {
        const token = response.accessToken || response.token;
        setToken(token);
        setUser(response.user);
        setUserRole('user');
        navigate('/dashboard');
      } else {
        setError(response.message || response.error || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(errorMsg);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = () => {
    switch(method) {
      case 'sms': return '📱';
      case 'whatsapp': return '💚';
      case 'email': return '📧';
      default: return '🔐';
    }
  };

  const getMethodColor = () => {
    switch(method) {
      case 'sms': return 'from-purple-500 to-purple-600';
      case 'whatsapp': return 'from-green-500 to-green-600';
      case 'email': return 'from-blue-500 to-blue-600';
      default: return 'from-indigo-500 to-purple-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">{getMethodIcon()}</div>
          <h2 className="text-2xl font-bold text-gray-800">Verify {method.toUpperCase()} OTP</h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter the 6-digit code sent to <strong className="text-purple-600">{identifier}</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
            <FiAlertCircle />
            <span>{error}</span>
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
              className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all disabled:opacity-50"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
          className={`w-full py-3 bg-gradient-to-r ${getMethodColor()} text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <FiSend className="animate-spin" /> Verifying...
            </span>
          ) : (
            <span>Verify & Login →</span>
          )}
        </button>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Resend code in <span className="font-semibold text-purple-600">{formatTime(timeLeft)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}