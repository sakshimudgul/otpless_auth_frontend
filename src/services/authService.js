// frontend/src/services/authService.js
import api from './api';

export const sendOtp = async (data) => {
  const response = await api.post('/auth/send-otp', {
    phone: data.phone
  });
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await api.post('/auth/verify-otp', {
    phone: data.phone,  // Make sure this is 'phone', not 'identifier'
    otp: data.otp,
    name: data.name
  });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};