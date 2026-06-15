import api from './api';

// ==================== ADMIN LOGIN ====================
export const adminLogin = async (data) => {
  console.log('📤 Admin login request:', data.email);
  const response = await api.post('/auth/admin-login', data);
  console.log('📥 Admin login response:', response.data);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// ==================== SMS OTP ====================
export const sendUserOtp = async (data) => {
  console.log('📤 Send SMS OTP to:', data.phone);
  const response = await api.post('/auth/send-otp', data);
  console.log('📥 Send SMS OTP response:', response.data);
  return response.data;
};

export const verifyUserOtp = async (data) => {
  console.log('📤 Verify SMS OTP for:', data.phone);
  const response = await api.post('/auth/verify-otp', {
    phone: data.phone,
    otp: data.otp,
    name: data.name
  });
  console.log('📥 Verify SMS OTP response:', response.data);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// ==================== WHATSAPP OTP ====================
export const sendWhatsAppOtp = async (data) => {
  console.log('📤 Send WhatsApp OTP to:', data.phone);
  const response = await api.post('/auth/send-whatsapp', data);
  console.log('📥 Send WhatsApp OTP response:', response.data);
  return response.data;
};

export const verifyWhatsAppOtp = async (data) => {
  console.log('📤 Verify WhatsApp OTP for:', data.phone);
  const response = await api.post('/auth/verify-whatsapp', {
    phone: data.phone,
    otp: data.otp,
    name: data.name
  });
  console.log('📥 Verify WhatsApp OTP response:', response.data);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// ==================== EMAIL OTP ====================
export const sendEmailOtp = async (data) => {
  console.log('📤 Send Email OTP to:', data.email);
  const response = await api.post('/auth/send-email', data);
  console.log('📥 Send Email OTP response:', response.data);
  return response.data;
};

export const verifyEmailOtp = async (data) => {
  console.log('📤 Verify Email OTP for:', data.email);
  const response = await api.post('/auth/verify-email', {
    email: data.email,
    otp: data.otp,
    name: data.name
  });
  console.log('📥 Verify Email OTP response:', response.data);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// ==================== LOGOUT ====================
export const logout = async () => {
  console.log('📤 Logout request');
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
  localStorage.removeItem('token');
  localStorage.removeItem('auth-storage');
};

// ==================== GET CURRENT USER ====================
export const getMe = async () => {
  console.log('📤 Get current user request');
  const response = await api.get('/auth/me');
  console.log('📥 Get current user response:', response.data);
  return response.data;
};

// ==================== ADMIN USERS MANAGEMENT ====================
export const getAllUsers = async () => {
  console.log('📤 Get all users request');
  const response = await api.get('/auth/admin/users');
  return response.data;
};

export const createUser = async (data) => {
  console.log('📤 Create user request:', data);
  const response = await api.post('/auth/admin/users', data);
  return response.data;
};

export const updateUser = async (id, data) => {
  console.log('📤 Update user request:', id, data);
  const response = await api.put(`/auth/admin/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  console.log('📤 Delete user request:', id);
  const response = await api.delete(`/auth/admin/users/${id}`);
  return response.data;
};