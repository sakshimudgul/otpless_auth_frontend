import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './components/Login';
import UserVerify from './components/User/Verify';
import AdminDashboard from './components/Admin/Dashboard';
import UserDashboard from './components/User/Dashboard';

function App() {
  const { token, userRole } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify" element={<UserVerify />} />
        <Route path="/admin/dashboard" element={token && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={token && userRole === 'user' ? <UserDashboard /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;