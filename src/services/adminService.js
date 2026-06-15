import api from './api';

// Admin Login
export const adminLogin = async (data) => {
  const response = await api.post('/auth/admin-login', data);
  // Store both tokens
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }
  return response.data;
};

// User OTP Login
export const sendUserOtp = async (data) => {
  const response = await api.post('/auth/send-otp', data);
  return response.data;
};

export const verifyUserOtp = async (data) => {
  const response = await api.post('/auth/verify-otp', data);
  // Store both tokens
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }
  return response.data;
};

// Refresh Token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await api.post('/auth/refresh-token', { refreshToken });
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  return response.data;
};

// Logout
export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('auth-storage');
  }
};

// Logout from all devices
export const logoutAllDevices = async () => {
  const response = await api.post('/auth/logout-all');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('auth-storage');
  return response.data;
};

// Get current user
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Get token info
export const getTokenInfo = async () => {
  const response = await api.get('/auth/token-info');
  return response.data;
};