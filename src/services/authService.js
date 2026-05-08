import api from './api';

// Admin Login
export const adminLogin = async (data) => {
  const response = await api.post('/auth/admin-login', data);
  return response.data;
};

// SMS OTP
export const sendUserOtp = async (data) => {
  const response = await api.post('/auth/send-otp', data);
  return response.data;
};

export const verifyUserOtp = async (data) => {
  const response = await api.post('/auth/verify-otp', data);
  return response.data;
};

// WhatsApp OTP
export const sendWhatsAppOtp = async (data) => {
  const response = await api.post('/whatsapp/send', data);
  return response.data;
};

export const verifyWhatsAppOtp = async (data) => {
  const response = await api.post('/whatsapp/verify', data);
  return response.data;
};

// Email OTP
export const sendEmailOtp = async (data) => {
  const response = await api.post('/email/send', data);
  return response.data;
};

export const verifyEmailOtp = async (data) => {
  const response = await api.post('/email/verify', data);
  return response.data;
};

// Logout - Don't send token, just clear local storage
export const logout = async () => {
  try {
    // Try to call logout endpoint (optional)
    await api.post('/auth/logout');
  } catch (error) {
    // Ignore error - just clear local storage
    console.log('Logout API call failed, clearing local storage');
  }
  // Always clear local storage regardless of API response
  localStorage.removeItem('auth-storage');
  sessionStorage.clear();
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};