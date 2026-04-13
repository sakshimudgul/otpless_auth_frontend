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
        <Route path="/login" element={<PhoneLogin />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;