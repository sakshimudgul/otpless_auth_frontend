import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { colors, gradients, shadows } from '../../styles/theme';

const styles = {
  container: {
    minHeight: '100vh',
    background: gradients.hero,
  },
  header: {
    backgroundColor: 'white',
    borderBottom: `1px solid ${colors.gray[200]}`,
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  headerContent: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    width: '2.5rem',
    height: '2.5rem',
    background: gradients.primary,
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: colors.gray[700],
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: colors.gray[600],
    background: 'transparent',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  main: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  welcomeCard: {
    background: gradients.primary,
    borderRadius: '1.5rem',
    padding: '2rem',
    marginBottom: '2rem',
    color: 'white',
  },
  welcomeTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.9)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: shadows.md,
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  statTitle: {
    fontSize: '0.875rem',
    color: colors.gray[500],
  },
  statIcon: {
    width: '2rem',
    height: '2rem',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: colors.gray[800],
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: shadows.md,
    textAlign: 'center',
  },
  infoIcon: {
    width: '4rem',
    height: '4rem',
    margin: '0 auto 1rem',
    backgroundColor: colors.primary[100],
    borderRadius: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: colors.gray[800],
    marginBottom: '0.5rem',
  },
  infoText: {
    fontSize: '0.875rem',
    color: colors.gray[600],
    marginBottom: '1.5rem',
  },
  phoneCard: {
    backgroundColor: colors.gray[50],
    borderRadius: '1rem',
    padding: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'monospace',
    fontSize: '1rem',
    fontWeight: '600',
    color: colors.primary[600],
  },
};

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span style={styles.logoText}>OTPless Auth</span>
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.name || user?.phoneNumber}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <div>
            <h1 style={styles.welcomeTitle}>Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
            <p style={styles.welcomeText}>You have successfully authenticated using OTP verification.</p>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statTitle}>Phone Number</span>
              <div style={{ ...styles.statIcon, background: colors.primary[100] }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary[600]} strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
            </div>
            <div style={styles.statValue}>{user?.phoneNumber || '—'}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statTitle}>Login Time</span>
              <div style={{ ...styles.statIcon, background: colors.secondary[100] }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.secondary[600]} strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div style={styles.statValue}>{currentTime.toLocaleTimeString()}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statTitle}>Status</span>
              <div style={{ ...styles.statIcon, background: colors.success.light }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.success.main} strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div style={styles.statValue}>Verified ✓</div>
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.primary[600]} strokeWidth="2">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 style={styles.infoTitle}>Authentication Successful</h2>
          <p style={styles.infoText}>
            You have successfully verified your phone number using OTP authentication.
            Your session is secure and active.
          </p>
          <div style={styles.phoneCard}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.primary[600]} strokeWidth="2">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {user?.phoneNumber}
          </div>
        </div>
      </main>
    </div>
  );
}