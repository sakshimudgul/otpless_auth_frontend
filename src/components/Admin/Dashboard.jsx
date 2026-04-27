// frontend/src/components/Admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../services/authService';
import api from '../../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const { user, token, logout: clearStore } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await api.get('/auth/admin/users');
      console.log('Users response:', response.data);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Fetch users error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        clearStore();
        navigate('/');
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Creating user:', formData);
      const response = await api.post('/auth/admin/create-user', formData);
      console.log('Create response:', response.data);
      setShowModal(false);
      setFormData({ name: '', phone: '', email: '' });
      fetchUsers();
      alert('User created successfully!');
    } catch (error) {
      console.error('Create user error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    clearStore();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <nav>
        <h1>Admin Dashboard</h1>
        <div>
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      
      <div className="content">
        <div className="card">
          <div className="card-header">
            <h2>Users List</h2>
            <button onClick={() => setShowModal(true)}>+ Add User</button>
          </div>
          
          {users.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No users found. Create your first user.</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.phone_number}</td>
                    <td>{u.email || '-'}</td>
                    <td>{u.is_active ? 'Active' : 'Inactive'}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New User</h2>
            <form onSubmit={handleCreateUser}>
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number * (e.g., 9356612017)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create User'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dashboard { min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Inter', sans-serif; }
        nav { background: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        nav h1 { margin: 0; color: #1a1a2e; }
        nav div { display: flex; gap: 1rem; align-items: center; }
        nav button { background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
        .content { padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .card { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .card-header button { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
        .user-table { width: 100%; border-collapse: collapse; }
        .user-table th, .user-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee; }
        .user-table th { background: #f8f9fa; font-weight: 600; }
        .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 16px; padding: 2rem; width: 90%; max-width: 400px; }
        .modal-content input { width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 8px; }
        .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; }
        .modal-actions button { padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
        .modal-actions button[type="submit"] { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; }
        .modal-actions button[type="button"] { background: #ef4444; color: white; border: none; }
      `}</style>
    </div>
  );
}