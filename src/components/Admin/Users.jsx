import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { 
  FiUsers, FiUserPlus, FiTrash2, FiLogOut, 
  FiUser, FiPhone, FiMail, FiCalendar, FiCheckCircle, 
  FiXCircle, FiHome, FiRefreshCw, FiMenu,
  FiClock, FiFilter, FiSearch, FiEye, FiDownload
} from 'react-icons/fi';
import { MdAdminPanelSettings, MdSms, MdVerified } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
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

  useEffect(() => {
    filterUsers();
  }, [searchTerm, filterMethod, filterStatus, users]);

  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/auth/admin/users');
      setUsers(response.data.users || []);
      setFilteredUsers(response.data.users || []);
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

  const filterUsers = () => {
    let filtered = [...users];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone_number?.includes(searchTerm) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Method filter
    if (filterMethod !== 'all') {
      filtered = filtered.filter(u => u.last_verification_method === filterMethod);
    }
    
    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(u => 
        filterStatus === 'active' ? u.is_active : !u.is_active
      );
    }
    
    setFilteredUsers(filtered);
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

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
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

  const getMethodBadge = (method) => {
    if (!method) return <span className="badge gray">Never</span>;
    switch(method) {
      case 'sms':
        return <span className="badge purple"><MdSms /> SMS</span>;
      case 'whatsapp':
        return <span className="badge green"><FaWhatsapp /> WhatsApp</span>;
      case 'email':
        return <span className="badge blue"><FiMail /> Email</span>;
      default:
        return <span className="badge gray">Unknown</span>;
    }
  };

  const getVerificationBadge = (isVerified) => {
    return isVerified ? 
      <span className="badge success"><MdVerified /> Verified</span> :
      <span className="badge warning">Pending</span>;
  };

  return (
    <div className="users-page">
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
          <Link to="/admin/dashboard" className="nav-item">
            <FiHome /> Dashboard
          </Link>
          <Link to="/admin/users" className="nav-item active">
            <FiUsers /> Users
          </Link>
          <Link to="/admin/reports" className="nav-item">
            <FiDownload /> Reports
          </Link>
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
            <p className="text-gray-500 text-sm mt-1">Manage and monitor all registered users</p>
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

        {/* Stats Summary */}
        <div className="stats-summary">
          <div className="stat-item">
            <FiUsers />
            <div>
              <span className="stat-value">{filteredUsers.length}</span>
              <span className="stat-label">Users</span>
            </div>
          </div>
          <div className="stat-item">
            <MdVerified />
            <div>
              <span className="stat-value">{filteredUsers.filter(u => u.last_verification_status).length}</span>
              <span className="stat-label">Verified</span>
            </div>
          </div>
          <div className="stat-item">
            <FiCheckCircle />
            <div>
              <span className="stat-value">{filteredUsers.filter(u => u.is_active).length}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-card">
          <div className="filters-header">
            <FiFilter />
            <h3>Filter Users</h3>
          </div>
          <div className="filters-grid">
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search by name, phone or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
              <option value="all">All Methods</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="add-user-btn" onClick={() => setShowModal(true)}>
              <FiUserPlus /> Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-card">
          <div className="card-header">
            <div className="header-title">
              <FiUsers />
              <h2>All Users</h2>
              <span className="user-count">{filteredUsers.length} users</span>
            </div>
          </div>
          
          {refreshing ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
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
                    <th>Verification Method</th>
                    <th>Status</th>
                    <th><FiCalendar /> Last Login</th>
                    <th><FiClock /> Last Verification</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="user-name-cell">
                        <div className="user-avatar-small">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td>{u.phone_number}</td>
                      <td>{u.email || '—'}</td>
                      <td>{getMethodBadge(u.last_verification_method)}</td>
                      <td>
                        <span className={`status-badge ${u.is_active ? 'active' : 'inactive'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="date-cell">
                        {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                        {u.last_login && <span className="time">{new Date(u.last_login).toLocaleTimeString()}</span>}
                      </td>
                      <td>
                        {u.last_verification_time ? (
                          <div className="verification-cell">
                            {getVerificationBadge(u.last_verification_status)}
                            <span className="time">{new Date(u.last_verification_time).toLocaleString()}</span>
                          </div>
                        ) : 'Never'}
                      </td>
                      <td>
                        <button className="delete-user-btn" onClick={() => handleDeleteUser(u.id, u.name)}>
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
        .users-page {
          display: flex;
          min-height: 100vh;
          background: #f0f2f5;
          font-family: 'Inter', sans-serif;
        }

        /* Sidebar Styles (same as dashboard) */
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
        }

        .nav-item:hover, .nav-item.active {
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
        }

        .refresh-btn {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.5rem;
          cursor: pointer;
        }

        .mobile-menu-btn, .mobile-logout-btn {
          display: none;
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Stats Summary */
        .stats-summary {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-item {
          background: white;
          border-radius: 16px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .stat-item svg {
          font-size: 1.75rem;
          color: #8b5cf6;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          display: block;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #64748b;
        }

        /* Filters Card */
        .filters-card {
          background: white;
          border-radius: 16px;
          padding: 1rem 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .filters-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .filters-header h3 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }

        .filters-grid {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.85rem;
        }

        .filters-grid select {
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          font-size: 0.85rem;
          outline: none;
        }

        .add-user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
        }

        /* Users Table */
        .users-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .card-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-count {
          font-size: 0.75rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
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
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .badge.purple { background: #f3e8ff; color: #9333ea; }
        .badge.green { background: #dcfce7; color: #16a34a; }
        .badge.blue { background: #dbeafe; color: #2563eb; }
        .badge.gray { background: #f1f5f9; color: #64748b; }
        .badge.success { background: #dcfce7; color: #16a34a; }
        .badge.warning { background: #fed7aa; color: #ea580c; }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .status-badge.active { background: #dcfce7; color: #16a34a; }
        .status-badge.inactive { background: #fee2e2; color: #dc2626; }

        .date-cell, .verification-cell {
          display: flex;
          flex-direction: column;
        }

        .time {
          font-size: 0.65rem;
          color: #94a3b8;
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
        }

        .delete-user-btn:hover { background: #fecaca; }

        .loading-state, .empty-state {
          text-align: center;
          padding: 3rem;
        }

        .empty-icon { font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem; }
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
          background: rgba(0,0,0,0.5);
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
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          position: relative;
        }

        .modal-close {
          position: absolute;
          right: 1.25rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #94a3b8;
        }

        .modal-form { padding: 1.5rem; }
        .form-group { margin-bottom: 1rem; }
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
          outline: none;
        }
        .form-group input:focus { border-color: #8b5cf6; }

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

          .mobile-logout-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: #fee2e2;
            border: none;
            border-radius: 10px;
            color: #dc2626;
            cursor: pointer;
          }

          .top-actions .refresh-btn {
            display: none;
          }

          .stats-summary {
            flex-direction: column;
          }

          .filters-grid {
            flex-direction: column;
          }

          .users-table th, .users-table td {
            padding: 0.75rem;
            font-size: 0.7rem;
          }

          .delete-user-btn span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}