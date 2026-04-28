import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../services/authService';
import api from '../../services/api';
import { 
  FiUsers, FiUserPlus, FiTrash2, FiLogOut, 
  FiUser, FiPhone, FiMail, FiCalendar, FiCheckCircle, 
  FiXCircle, FiShield, FiHome, FiRefreshCw, FiMenu,
  FiBell, FiSettings, FiHelpCircle
} from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const { user, logout: clearStore, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/auth/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Fetch users error:', error);
      if (error.response?.status === 401) {
        clearStore();
        navigate('/');
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/admin/users', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null
      });
      setShowModal(false);
      setFormData({ name: '', phone: '', email: '' });
      fetchUsers();
      alert('User created successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/auth/admin/users/${id}`);
        fetchUsers();
        alert('User deleted successfully');
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    clearStore();
    navigate('/');
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FiMenu />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <MdAdminPanelSettings className="logo-icon" />
            <span>Admin<span>Panel</span></span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active" onClick={(e) => e.preventDefault()}>
            <FiHome /> Dashboard
          </a>
          <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
            <FiUsers /> Users
          </a>
          <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
            <FiBell /> Notifications
          </a>
          <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
            <FiSettings /> Settings
          </a>
          <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
            <FiHelpCircle /> Help
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Users Management</h1>
          </div>
          <div className="top-actions">
            <button onClick={fetchUsers} className="refresh-btn" disabled={refreshing}>
              <FiRefreshCw className={refreshing ? 'spin' : ''} />
            </button>
            <button onClick={handleLogout} className="mobile-logout-btn">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">
              <FiUsers />
            </div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p>{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <FiCheckCircle />
            </div>
            <div className="stat-info">
              <h3>Active Users</h3>
              <p>{stats.active}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <FiXCircle />
            </div>
            <div className="stat-info">
              <h3>Inactive Users</h3>
              <p>{stats.inactive}</p>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="users-card">
          <div className="card-header">
            <div className="header-title">
              <FiUsers />
              <h2>All Users</h2>
              <span className="user-count">{users.length} users</span>
            </div>
            <button className="add-user-btn" onClick={() => setShowModal(true)}>
              <FiUserPlus /> Add User
            </button>
          </div>
          
          {refreshing ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <FiUsers className="empty-icon" />
              <h3>No users found</h3>
              <p>Click "Add User" to create your first user</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th><FiUser /> Name</th>
                    <th><FiPhone /> Phone</th>
                    <th><FiMail /> Email</th>
                    <th><FiCheckCircle /> Status</th>
                    <th><FiCalendar /> Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="user-name-cell">
                        <div className="user-avatar-small">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td>{u.phone_number}</td>
                      <td>{u.email || '—'}</td>
                      <td>
                        <span className={`status-badge ${u.is_active ? 'active' : 'inactive'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="delete-user-btn" onClick={() => handleDeleteUser(u.id)}>
                          <FiTrash2 /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <FiUserPlus className="modal-icon" />
              <h2>Add New User</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateUser} className="modal-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email (Optional)</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" disabled={loading} className="btn-create">
                  {loading ? <div className="btn-spinner"></div> : 'Create User'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f0f2f5;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 100;
          background: white;
          border: none;
          border-radius: 12px;
          padding: 0.5rem;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          transition: transform 0.3s ease;
          z-index: 1000;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .logo-icon {
          font-size: 1.75rem;
          color: #a78bfa;
        }

        .logo span span {
          color: #a78bfa;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-item.active {
          background: rgba(139, 92, 246, 0.3);
          color: white;
        }

        .sidebar-footer {
          padding: 1rem 1.5rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .user-role {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          color: #f87171;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.25);
          border-color: #ef4444;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 1.5rem;
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .page-title h1 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #1e293b;
        }

        .top-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .refresh-btn {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .refresh-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .mobile-logout-btn {
          display: none;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #fee2e2;
          border: none;
          border-radius: 10px;
          color: #dc2626;
          cursor: pointer;
          font-weight: 500;
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-icon.purple {
          background: #f3e8ff;
          color: #9333ea;
        }

        .stat-icon.green {
          background: #dcfce7;
          color: #16a34a;
        }

        .stat-icon.orange {
          background: #ffedd5;
          color: #f97316;
        }

        .stat-info h3 {
          font-size: 0.75rem;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .stat-info p {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
        }

        /* Users Card */
        .users-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-title h2 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .user-count {
          font-size: 0.75rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
        }

        .add-user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .add-user-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .table-responsive {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th {
          text-align: left;
          padding: 1rem 1.25rem;
          background: #f8fafc;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }

        .users-table td {
          padding: 1rem 1.25rem;
          font-size: 0.85rem;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
        }

        .user-name-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar-small {
          width: 32px;
          height: 32px;
          background: #e0e7ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #4f46e5;
          font-size: 0.85rem;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #16a34a;
        }

        .status-badge.inactive {
          background: #fee2e2;
          color: #dc2626;
        }

        .delete-user-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.7rem;
          background: #fee2e2;
          border: none;
          border-radius: 8px;
          color: #dc2626;
          cursor: pointer;
          font-size: 0.7rem;
          transition: all 0.2s;
        }

        .delete-user-btn:hover {
          background: #fecaca;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 3rem;
        }

        .empty-icon {
          font-size: 3rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #64748b;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal-container {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 450px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          position: relative;
        }

        .modal-icon {
          font-size: 1.5rem;
          color: #8b5cf6;
        }

        .modal-header h2 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
        }

        .modal-close {
          position: absolute;
          right: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #94a3b8;
        }

        .modal-form {
          padding: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #475569;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.7rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.9rem;
          transition: all 0.2s;
          outline: none;
        }

        .form-group input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .btn-create {
          flex: 1;
          padding: 0.7rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-create:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-cancel {
          flex: 1;
          padding: 0.7rem;
          background: #f1f5f9;
          border: none;
          border-radius: 12px;
          color: #475569;
          cursor: pointer;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin: 0 auto;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-overlay {
            display: block;
          }

          .main-content {
            margin-left: 0;
            padding-top: 4rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .mobile-logout-btn {
            display: flex;
          }

          .top-actions .refresh-btn {
            display: none;
          }

          .users-table th, .users-table td {
            padding: 0.75rem;
            font-size: 0.75rem;
          }

          .delete-user-btn span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}