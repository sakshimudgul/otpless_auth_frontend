import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import PhoneLogin from './components/Auth/PhoneLogin';
import VerifyOtp from './components/Auth/VerifyOtp';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Login route - matches "/login" */}
        <Route path="/login" element={<PhoneLogin />} />
        
        {/* Verify OTP route */}
        <Route path="/verify" element={<VerifyOtp />} />
        
        {/* Dashboard route - protected */}
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;