import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { FiMail, FiLock, FiShield, FiSend, FiBriefcase } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setToken, setUser, setUserRole } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setUserRole("admin");
        navigate("/admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Brand Section */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 text-white flex items-center justify-center p-8 md:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-md w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-8">
              <FiShield size={14} />
              <span>Admin Access</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Admin
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Panel
              </span>
            </h1>
            
            <p className="text-purple-200 mb-10 leading-relaxed text-base">
              Secure admin access to manage users, services, and platform settings.
            </p>
            
            <div className="flex justify-between gap-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <MdAdminPanelSettings className="text-purple-300 mb-2 mx-auto" size={24} />
                <div className="text-sm text-purple-300">Admin Access</div>
              </div>
              <div className="text-center">
                <FiShield className="text-purple-300 mb-2 mx-auto" size={24} />
                <div className="text-sm text-purple-300">Secure</div>
              </div>
              <div className="text-center">
                <FiMail className="text-purple-300 mb-2 mx-auto" size={24} />
                <div className="text-sm text-purple-300">Email Login</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MdAdminPanelSettings className="text-purple-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
                <p className="text-gray-500 text-sm mt-2">Access the admin dashboard</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="Admin email"
                    required
                  />
                </div>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="Password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FiSend className="animate-spin" /> Logging in...
                    </span>
                  ) : (
                    <span>Login →</span>
                  )}
                </button>

                
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col gap-2 text-center">
                  <p className="text-sm text-gray-500">Other login options:</p>
                  <div className="flex justify-center gap-4">
                    <Link to="/" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                      <FiShield size={14} /> End User
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link to="/business/login" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <FiBriefcase size={14} /> Business
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}