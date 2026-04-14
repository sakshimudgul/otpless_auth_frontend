import api from './api';

export const sendOtp = async (data) => {
  // Send with 'phone' field
  const response = await api.post('/auth/send-otp', {
    phone: data.phone || data.phoneNumber
  });
  return response.data;
};

export const verifyOtp = async (data) => {
  // Send with 'phone' and 'otp' fields
  const response = await api.post('/auth/verify-otp', {
    phone: data.identifier || data.phone,
    otp: data.otp,
    name: data.name
  });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};