import api from './api';

// Get all users (Admin only)
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

// Get users created by this admin
export const getMyUsers = async () => {
  const response = await api.get('/admin/my-users');
  return response.data;
};

// Create user
export const createUser = async (data) => {
  const response = await api.post('/admin/users', data);
  return response.data;
};

// Update user
export const updateUser = async (id, data) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};