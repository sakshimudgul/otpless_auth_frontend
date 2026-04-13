import api from './api';

export const sendOtp = async (data) => {
  const response = await api.post('/auth/send-otp', data);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await api.post('/auth/verify-otp', data);
  return response.data;
};

// Remove these client-related functions
// export const getMyClients = async () => { ... }
// export const createClient = async (clientData) => { ... }
// export const deleteClient = async (clientId) => { ... }