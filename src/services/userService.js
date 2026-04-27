import api from './api';

export const sendUserOtp = async (data) => {
  const response = await api.post('/user/send-otp', data);
  return response.data;
};

export const verifyUserOtp = async (data) => {
  const response = await api.post('/user/verify-otp', data);
  return response.data;
};