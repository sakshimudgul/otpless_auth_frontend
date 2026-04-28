import api from './api';

// Admin Login
export const adminLogin = async (data) => {
  try {
    const response = await api.post('/auth/admin-login', data);
    return response.data;
  } catch (error) {
    console.error('Admin login API error:', error);
    throw error;
  }
};

// SMS OTP
export const sendUserOtp = async (data) => {
  try {
    const response = await api.post('/auth/send-otp', data);
    return response.data;
  } catch (error) {
    console.error('Send SMS OTP error:', error);
    throw error;
  }
};

export const verifyUserOtp = async (data) => {
  try {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  } catch (error) {
    console.error('Verify SMS OTP error:', error);
    throw error;
  }
};

// WhatsApp OTP
export const sendWhatsAppOtp = async (data) => {
  try {
    const response = await api.post('/whatsapp/send', data);
    return response.data;
  } catch (error) {
    console.error('Send WhatsApp OTP error:', error);
    throw error;
  }
};

export const verifyWhatsAppOtp = async (data) => {
  try {
    const response = await api.post('/whatsapp/verify', data);
    return response.data;
  } catch (error) {
    console.error('Verify WhatsApp OTP error:', error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get me error:', error);
    throw error;
  }
};