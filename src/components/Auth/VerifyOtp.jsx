import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { colors, gradients, shadows } from '../../styles/theme';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: gradients.hero,
    padding: '1rem',
  },
  card: {
    maxWidth: '28rem',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '1.5rem',
    boxShadow: shadows.xl,
    padding: '2rem',
  },
  logoContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '4rem',
    height: '4rem',
    background: gradients.primary,
    borderRadius: '1rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  otpContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  otpInput: {
    width: '3.5rem',
    height: '3.5rem',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    border: `2px solid ${colors.gray[200]}`,
    borderRadius: '0.75rem',
    outline: 'none',
    transition: 'all 0.2s',
  },
  button: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: gradients.primary,
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '1rem',
  },
  ghostButton: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'transparent',
    color: colors.gray[600],
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default function VerifyOtp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  
  // Get all needed values from auth store
  const { identifier, tempUserInfo, setToken, setUser } = useAuthStore();

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
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
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;

    setLoading(true);
    try {
      // Get username from tempUserInfo if available
      const username = tempUserInfo?.name || null;
      
      const { token, user } = await verifyOtp({ 
        phone: identifier,  // Use 'phone' as the field name
        otp: otpCode,
        name: username
      });
      setToken(token);
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Verify error:', error.response?.data);
      alert(error.response?.data?.error || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimeLeft(300);
    setCanResend(false);
    alert('New OTP sent successfully!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={styles.logoContainer}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h1 style={styles.title}>Verify your identity</h1>
          <p style={{ color: colors.gray[500], marginBottom: '2rem' }}>
            Enter the 6-digit code sent to<br />
            <strong style={{ color: colors.primary[600] }}>{identifier}</strong>
          </p>
        </div>

        <div style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={(e) => e.target.style.borderColor = colors.primary[400]}
              onBlur={(e) => e.target.style.borderColor = colors.gray[200]}
              style={styles.otpInput}
              disabled={loading}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
          style={{
            ...styles.button,
            ...((loading || otp.join('').length !== 6) && { opacity: 0.5, cursor: 'not-allowed' }),
          }}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {!canResend ? (
            <p style={{ fontSize: '0.875rem', color: colors.gray[500] }}>
              Resend code in <strong style={{ color: colors.primary[600] }}>{formatTime(timeLeft)}</strong>
            </p>
          ) : (
            <button
              onClick={handleResend}
              style={{ color: colors.primary[600], fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Resend verification code
            </button>
          )}
        </div>

        <button
          onClick={() => navigate('/login')}
          style={styles.ghostButton}
        >
          ← Back to login
        </button>
      </div>
    </div>
  );
}