import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp } from '../../services/authService';
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
    animation: 'slideUp 0.5s ease-out',
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
    boxShadow: shadows.md,
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: colors.gray[500],
    marginBottom: '2rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: '0.5rem',
  },
  optionalBadge: {
    display: 'inline-block',
    marginLeft: '0.5rem',
    padding: '0.125rem 0.5rem',
    fontSize: '0.625rem',
    fontWeight: '500',
    color: colors.gray[500],
    backgroundColor: colors.gray[100],
    borderRadius: '0.375rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: colors.gray[200],
    borderRadius: '0.75rem',
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: 'white',
  },
  inputFocus: {
    borderColor: colors.primary[400],
    boxShadow: `0 0 0 3px ${colors.primary[100]}`,
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  footer: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '0.875rem',
    color: colors.gray[500],
  },
  link: {
    color: colors.primary[600],
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default function PhoneLogin() {
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ phone: false, username: false });
  const navigate = useNavigate();
  const { setIdentifier, setUserInfo } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return;
    
    setLoading(true);
    try {
      // Store username if provided
      if (username) {
        setUserInfo({ name: username });
      }
      
      await sendOtp({ phone: phone });
      setIdentifier(phone);
      navigate('/verify');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (field) => ({
    ...styles.input,
    ...(isFocused[field] && styles.inputFocus),
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={styles.logoContainer}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in with your phone number</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={styles.label}>
              Phone Number <span style={styles.optionalBadge}>Required</span>
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={() => setIsFocused({ ...isFocused, phone: true })}
              onBlur={() => setIsFocused({ ...isFocused, phone: false })}
              style={getInputStyle('phone')}
              disabled={loading}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={styles.label}>
              Name <span style={styles.optionalBadge}>Optional</span>
            </label>
            <input
              type="text"
              placeholder="Enter your name (optional)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setIsFocused({ ...isFocused, username: true })}
              onBlur={() => setIsFocused({ ...isFocused, username: false })}
              style={getInputStyle('username')}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !phone}
            style={{
              ...styles.button,
              ...((loading || !phone) && styles.buttonDisabled),
            }}
            onMouseEnter={(e) => {
              if (!loading && phone) {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Sending code...
              </>
            ) : (
              <>
                Continue
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          By continuing, you agree to our{' '}
          <a href="#" style={styles.link}>Terms</a> and{' '}
          <a href="#" style={styles.link}>Privacy Policy</a>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}