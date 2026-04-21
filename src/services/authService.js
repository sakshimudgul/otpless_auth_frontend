import api from './api';

// Send SMS OTP
export const sendSmsOtp = async (data) => {
  const response = await api.post('/auth/send-sms-otp', {
    phone: data.phone,
    name: data.name || ''
  });
  return response.data;
};

// Send WhatsApp OTP
export const sendWhatsAppOtp = async (data) => {
  const response = await api.post('/auth/send-whatsapp-otp', {
    phone: data.phone,
    name: data.name || ''
  });
  return response.data;
};

// Verify SMS OTP
export const verifySmsOtp = async (data) => {
  const response = await api.post('/auth/verify-sms-otp', {
    phone: data.phone,
    otp: data.otp,
    name: data.name || ''
  });
  return response.data;
};

// Verify WhatsApp OTP
export const verifyWhatsAppOtp = async (data) => {
  const response = await api.post('/auth/verify-whatsapp-otp', {
    phone: data.phone,
    otp: data.otp,
    name: data.name || ''
  });
  return response.data;
};

// Get profile
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};