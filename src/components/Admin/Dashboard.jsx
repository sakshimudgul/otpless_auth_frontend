import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../services/authService';
import api from '../../services/api';
import { 
  FiUsers, FiUserPlus, FiTrash2, FiLogOut, 
  FiUser, FiPhone, FiMail, FiCalendar, FiCheckCircle, 
  FiXCircle, FiHome, FiRefreshCw, FiMenu,
  FiTrendingUp, FiClock, FiMessageCircle, FiEdit2,
  FiPlus, FiX, FiSearch, FiFilter, FiDownload,
  FiBarChart2, FiActivity, FiShield, FiStar, FiAward,
  FiBell, FiSettings, FiHelpCircle
} from 'react-icons/fi';
import { MdAdminPanelSettings, MdSms, MdVerified } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    password: '',
    is_active: true 
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
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
      showNotification('Failed to fetch users', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showNotification('Name and phone number are required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/auth/admin/users', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        password: formData.password || null,
        is_active: formData.is_active
      });
      
      showNotification('User created successfully!', 'success');
      setShowAddModal(false);
      setFormData({ name: '', phone: '', email: '', password: '', is_active: true });
      fetchUsers();
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to create user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/auth/admin/users/${editingUser.id}`, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        is_active: formData.is_active
      });
      
      showNotification('User updated successfully!', 'success');
      setEditingUser(null);
      setFormData({ name: '', phone: '', email: '', password: '', is_active: true });
      fetchUsers();
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    try {
      await api.delete(`/auth/admin/users/${id}`);
      showNotification(`${name} deleted successfully`, 'success');
      setShowDeleteConfirm(null);
      fetchUsers();
    } catch (error) {
      showNotification('Failed to delete user', 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    clearStore();
    navigate('/');
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', phone: '', email: '', password: '', is_active: true });
    setShowAddModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      phone: user.phone_number,
      email: user.email || '',
      is_active: user.is_active,
      password: ''
    });
    setShowAddModal(true);
  };

  // Calculate stats
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    totalLogins: users.reduce((sum, u) => sum + (u.login_count || 0), 0),
    todayLogins: users.filter(u => {
      if (!u.last_login) return false;
      const today = new Date().toDateString();
      return new Date(u.last_login).toDateString() === today;
    }).length
  };

  const getMethodIcon = (method) => {
    if (!method) return null;
    switch(method) {
      case 'sms': return <MdSms size={12} />;
      case 'whatsapp': return <FaWhatsapp size={12} />;
      case 'email': return <FiMail size={12} />;
      default: return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FiMenu size={22} />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <MdAdminPanelSettings />
            </div>
            <div className="logo-text">
              <span className="logo-title">Admin</span>
              <span className="logo-subtitle">Control Panel</span>
            </div>
          </div>
        </div>

        <div className="admin-info">
          <div className="admin-avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="admin-details">
            <h4>{user?.name || 'Admin'}</h4>
            <p>Administrator</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="nav-item active">
            <FiHome />
            <span>Dashboard</span>
          </Link>
          <button onClick={openAddModal} className="nav-item add-user-item">
            <FiUserPlus />
            <span>Add New User</span>
          </button>
          <Link to="/admin/users" className="nav-item">
            <FiUsers />
            <span>Manage Users</span>
          </Link>
          <Link to="/admin/settings" className="nav-item">
            <FiSettings />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <div className="content-header">
          <div className="header-left">
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.name || 'Admin'}</p>
          </div>
          <div className="header-right">
            <button className="icon-btn refresh" onClick={fetchUsers}>
              <FiRefreshCw className={refreshing ? 'spin' : ''} />
            </button>
            <div className="notification-icon">
              <FiBell />
              <span className="dot"></span>
            </div>
            <div className="admin-badge">
              <div className="badge-avatar">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`notification-toast ${notification.type}`}>
            <span>{notification.message}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-box">
            <div className="stat-icon purple">
              <FiUsers />
            </div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
              <span className="stat-change">Total registered</span>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon green">
              <FiCheckCircle />
            </div>
            <div className="stat-info">
              <h3>Active Users</h3>
              <p className="stat-number">{stats.activeUsers}</p>
              <span className="stat-change">{stats.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total</span>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon orange">
              <FiTrendingUp />
            </div>
            <div className="stat-info">
              <h3>Total Logins</h3>
              <p className="stat-number">{stats.totalLogins}</p>
              <span className="stat-change">Across all users</span>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon blue">
              <FiClock />
            </div>
            <div className="stat-info">
              <h3>Today's Logins</h3>
              <p className="stat-number">{stats.todayLogins}</p>
              <span className="stat-change">Active today</span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-section">
          <div className="section-header">
            <div className="header-title">
              <FiUsers />
              <h2>All Users</h2>
              <span className="badge">{users.length} total</span>
            </div>
            <button className="add-user-button" onClick={openAddModal}>
              <FiPlus />
              Add User
            </button>
          </div>

          {refreshing ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-container">
              <div className="empty-icon">
                <FiUsers />
              </div>
              <h3>No users yet</h3>
              <p>Create your first user using the "Add User" button</p>
              <button className="primary-button" onClick={openAddModal}>
                <FiUserPlus />
                Add Your First User
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th><FiUser /> User</th>
                    <th><FiPhone /> Contact</th>
                    <th><FiTrendingUp /> Login Count</th>
                    <th><FiClock /> Last Login</th>
                    <th><FiShield /> Login Method</th>
                    <th>IP Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem) => (
                    <tr key={userItem.id}>
                      <td className="user-cell">
                        <div className="user-avatar">
                          {userItem.name?.charAt(0)}
                        </div>
                        <div className="user-details">
                          <span className="user-name">{userItem.name}</span>
                          <span className="user-id">ID: {userItem.id?.slice(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="contact-cell">
                        <div className="contact-info">
                          <span className="phone-number">
                            <FiPhone size={12} /> {userItem.phone_number}
                          </span>
                          {userItem.email && (
                            <span className="email-address">
                              <FiMail size={12} /> {userItem.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="login-count-cell">
                        <div className="login-count-badge">
                          <span className="count-number">{userItem.login_count || 0}</span>
                          <span className="count-label">times</span>
                        </div>
                      </td>
                      <td className="login-cell">
                        {userItem.last_login ? (
                          <div className="login-datetime">
                            <div className="login-date">{new Date(userItem.last_login).toLocaleDateString()}</div>
                            <div className="login-time">{new Date(userItem.last_login).toLocaleTimeString()}</div>
                          </div>
                        ) : (
                          <span className="never-login">Never</span>
                        )}
                      </td>
                      <td className="method-cell">
                        {userItem.last_login_method ? (
                          <span className={`method-badge ${userItem.last_login_method}`}>
                            {getMethodIcon(userItem.last_login_method)}
                            {userItem.last_login_method}
                          </span>
                        ) : (
                          <span className="method-badge never">Not logged in</span>
                        )}
                      </td>
                      <td className="ip-cell">
                        <code className="ip-address">{userItem.last_login_ip || '—'}</code>
                      </td>
                      <td>
                        <span className={`status ${userItem.is_active ? 'active' : 'inactive'}`}>
                          {userItem.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button className="action-btn edit" onClick={() => openEditModal(userItem)}>
                          <FiEdit2 />
                        </button>
                        <button className="action-btn delete" onClick={() => setShowDeleteConfirm(userItem)}>
                          <FiTrash2 />
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

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => {
          setShowAddModal(false);
          setEditingUser(null);
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                {editingUser ? <FiEdit2 /> : <FiUserPlus />}
              </div>
              <h2>{editingUser ? 'Edit User' : 'Create New User'}</h2>
              <button className="close-btn" onClick={() => {
                setShowAddModal(false);
                setEditingUser(null);
              }}>
                <FiX />
              </button>
            </div>
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              <div className="modal-body">
                <div className="input-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                {!editingUser && (
                  <div className="input-field">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Leave empty for no password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                )}
                <div className="input-field checkbox">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <span>Active Account</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Processing...' : (editingUser ? 'Update User' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header delete">
              <div className="modal-icon delete">
                <FiTrash2 />
              </div>
              <h2>Delete User</h2>
              <button className="close-btn" onClick={() => setShowDeleteConfirm(null)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{showDeleteConfirm.name}</strong>?</p>
              <p className="warning">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={() => handleDeleteUser(showDeleteConfirm.id, showDeleteConfirm.name)}>
                Delete User
              </button>
            </div>
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
          background: #f0f2f8;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: #1a1a2e;
          color: #fff;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          transition: transform 0.3s ease;
          z-index: 1000;
          box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .logo-title {
          font-size: 18px;
          font-weight: 700;
          display: block;
        }

        .logo-subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          display: block;
        }

        .admin-info {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .admin-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 600;
        }

        .admin-details h4 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .admin-details p {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }

        .nav-item.active {
          background: rgba(139, 92, 246, 0.2);
          color: #fff;
        }

        .add-user-item {
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
          margin-top: 8px;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          color: #f87171;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 24px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .header-left h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 4px;
        }

        .header-left p {
          color: #666;
          font-size: 14px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-btn {
          background: #fff;
          border: none;
          padding: 10px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .icon-btn:hover {
          transform: rotate(180deg);
        }

        .notification-icon {
          position: relative;
          background: #fff;
          padding: 10px;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
        }

        .admin-badge {
          cursor: pointer;
        }

        .badge-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #fff;
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Notification Toast */
        .notification-toast {
          position: fixed;
          top: 80px;
          right: 24px;
          padding: 12px 20px;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          z-index: 1100;
          animation: slideIn 0.3s ease;
        }

        .notification-toast.success {
          background: #10b981;
        }

        .notification-toast.error {
          background: #ef4444;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* Stats */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-box {
          background: #fff;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
        }

        .stat-box:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
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

        .stat-icon.blue {
          background: #dbeafe;
          color: #2563eb;
        }

        .stat-info h3 {
          font-size: 12px;
          font-weight: 500;
          color: #666;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-number {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 4px;
        }

        .stat-change {
          font-size: 11px;
          color: #10b981;
        }

        /* Users Section */
        .users-section {
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-title svg {
          color: #8b5cf6;
          font-size: 20px;
        }

        .header-title h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a2e;
        }

        .badge {
          background: #f3e8ff;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          color: #9333ea;
          font-weight: 500;
        }

        .add-user-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .add-user-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
        }

        /* Table */
        .table-wrapper {
          overflow-x: auto;
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
        }

        .user-table th {
          text-align: left;
          padding: 14px 12px;
          background: #f8fafc;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }

        .user-table td {
          padding: 16px 12px;
          font-size: 14px;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #4f46e5;
          font-size: 16px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .user-id {
          font-size: 11px;
          color: #94a3b8;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .phone-number, .email-address {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }

        /* Login Count Badge */
        .login-count-cell {
          text-align: center;
        }

        .login-count-badge {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 4px 12px;
          background: #f0fdf4;
          border-radius: 12px;
        }

        .count-number {
          font-size: 18px;
          font-weight: 700;
          color: #16a34a;
        }

        .count-label {
          font-size: 10px;
          color: #64748b;
        }

        /* Login Date/Time */
        .login-datetime {
          display: flex;
          flex-direction: column;
        }

        .login-date {
          font-weight: 500;
          color: #1e293b;
          font-size: 12px;
        }

        .login-time {
          font-size: 10px;
          color: #94a3b8;
        }

        .never-login {
          color: #94a3b8;
          font-style: italic;
          font-size: 12px;
        }

        /* Method Badges */
        .method-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
        }

        .method-badge.sms {
          background: #f3e8ff;
          color: #9333ea;
        }

        .method-badge.whatsapp {
          background: #dcfce7;
          color: #16a34a;
        }

        .method-badge.email {
          background: #dbeafe;
          color: #2563eb;
        }

        .method-badge.never {
          background: #f1f5f9;
          color: #64748b;
        }

        /* IP Address */
        .ip-cell {
          font-family: monospace;
        }

        .ip-address {
          font-size: 11px;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 6px;
          display: inline-block;
          font-family: 'Courier New', monospace;
        }

        .status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .status.active {
          background: #dcfce7;
          color: #16a34a;
        }

        .status.inactive {
          background: #fee2e2;
          color: #dc2626;
        }

        .login-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 13px;
        }

        .actions-cell {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn.edit {
          background: #dbeafe;
          color: #2563eb;
        }

        .action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-btn:hover {
          transform: scale(1.05);
        }

        /* Empty State */
        .loading-container, .empty-container {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 20px;
          background: #f1f5f9;
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: #94a3b8;
        }

        .empty-container h3 {
          font-size: 20px;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .empty-container p {
          color: #64748b;
          margin-bottom: 24px;
        }

        .primary-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal {
          background: #fff;
          border-radius: 24px;
          width: 90%;
          max-width: 480px;
          animation: modalFade 0.3s ease;
        }

        @keyframes modalFade {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .modal-icon {
          width: 44px;
          height: 44px;
          background: #f3e8ff;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: #9333ea;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .close-btn {
          position: absolute;
          right: 20px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #94a3b8;
        }

        .modal-body {
          padding: 24px;
        }

        .input-field {
          margin-bottom: 20px;
        }

        .input-field label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          margin-bottom: 8px;
        }

        .input-field input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s;
          outline: none;
        }

        .input-field input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-label input {
          width: auto;
        }

        .modal-footer {
          padding: 16px 24px 24px;
          display: flex;
          gap: 12px;
          border-top: 1px solid #e2e8f0;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: #f1f5f9;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          color: #475569;
        }

        .btn-submit {
          flex: 1;
          padding: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          color: #fff;
        }

        .btn-danger {
          flex: 1;
          padding: 12px;
          background: #ef4444;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          color: #fff;
        }

        .warning {
          color: #ef4444;
          font-size: 13px;
          margin-top: 8px;
        }

        /* Mobile */
        .mobile-menu-btn {
          display: none;
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 100;
          background: #fff;
          border: none;
          border-radius: 12px;
          padding: 10px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .sidebar-overlay {
          display: none;
        }

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
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }

          .main-content {
            margin-left: 0;
            padding: 16px;
            padding-top: 70px;
          }

          .stats-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .user-table th, .user-table td {
            padding: 10px 8px;
            font-size: 11px;
          }

          .actions-cell {
            flex-direction: column;
            gap: 4px;
          }
          
          .method-badge {
            padding: 2px 6px;
            font-size: 9px;
          }
          
          .count-number {
            font-size: 14px;
          }
          
          .ip-address {
            font-size: 9px;
            padding: 2px 4px;
          }
        }

        @media (max-width: 480px) {
          .stats-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}