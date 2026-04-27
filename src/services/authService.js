import api from './api';

// Admin Login
export const adminLogin = async (data) => {
  const response = await api.post('/auth/admin-login', data);
  return response.data;
};

// User Send OTP (SMS)
export const sendUserOtp = async (data) => {
  // This endpoint exists in your backend
  const response = await api.post('/auth/send-otp', data);
  return response.data;
};

// User Verify OTP (SMS)
export const verifyUserOtp = async (data) => {
  const response = await api.post('/auth/verify-otp', data);
  return response.data;
};

// WhatsApp Send OTP
export const sendWhatsAppOtp = async (data) => {
  const response = await api.post('/whatsapp/send', data);
  return response.data;
};

// WhatsApp Verify OTP
export const verifyWhatsAppOtp = async (data) => {
  const response = await api.post('/whatsapp/verify', data);
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// Get current user
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};