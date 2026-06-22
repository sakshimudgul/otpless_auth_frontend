import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import EndUserLogin from './components/EndUser/Login';
import EndUserVerify from './components/EndUser/Verify';
import AdminLogin from './components/Admin/Login';
import BusinessLogin from './components/Business/Login';
import AdminDashboard from './components/Admin/Dashboard';
import BusinessDashboard from './components/Business/Dashboard';
import EndUserDashboard from './components/EndUser/Dashboard';

function App() {
  const { token, userRole } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - End User Login */}
        <Route path="/" element={<EndUserLogin />} />
        <Route path="/verify" element={<EndUserVerify />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={token && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
        />
        
        {/* Business User Routes - Only Login (No Register) */}
        <Route path="/business/login" element={<BusinessLogin />} />
        <Route 
          path="/business/dashboard" 
          element={token && userRole === 'user' ? <BusinessDashboard /> : <Navigate to="/business/login" />} 
        />
        
        {/* End User Dashboard */}
        <Route 
          path="/dashboard" 
          element={token && userRole === 'enduser' ? <EndUserDashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;