import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminLogin,
  sendUserOtp,
  sendWhatsAppOtp,
  sendEmailOtp,
} from "../services/authService";
import { useAuthStore } from "../store/authStore";
import {
  FiMail,
  FiLock,
  FiSmartphone,
  FiSend,
  FiUser,
  FiShield,
  FiZap,
  FiGlobe,
  FiCheckCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { MdSms, MdAdminPanelSettings } from "react-icons/md";

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // For SMS/WhatsApp
  const [emailAddress, setEmailAddress] = useState(""); // For Email
  const [method, setMethod] = useState("sms");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser, setUserRole, setIdentifier: setStoreIdentifier } = useAuthStore();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLogin({ email, password });
      if (res.token) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        setUserRole("admin");
        navigate("/admin/dashboard");
      } else {
        alert("Login failed: No token received");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      alert(error.response?.data?.error || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUserOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let identifier = "";
      
      if (method === "sms") {
        if (!phoneNumber) {
          alert("Please enter your phone number");
          setLoading(false);
          return;
        }
        console.log("Sending SMS OTP to:", phoneNumber);
        await sendUserOtp({ phone: phoneNumber, name: "User" });
        identifier = phoneNumber;
      } else if (method === "whatsapp") {
        if (!phoneNumber) {
          alert("Please enter your phone number");
          setLoading(false);
          return;
        }
        console.log("Sending WhatsApp OTP to:", phoneNumber);
        await sendWhatsAppOtp({ phone: phoneNumber, name: "User" });
        identifier = phoneNumber;
      } else if (method === "email") {
        if (!emailAddress) {
          alert("Please enter your email address");
          setLoading(false);
          return;
        }
        console.log("Sending Email OTP to:", emailAddress);
        await sendEmailOtp({ email: emailAddress, name: "User" });
        identifier = emailAddress;
      }
      
      console.log("OTP sent successfully, identifier:", identifier);
      setStoreIdentifier(identifier);
      navigate("/verify", { state: { method, identifier } });
    } catch (error) {
      console.error("OTP send error:", error);
      alert(error.response?.data?.error || "Failed to send OTP");
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
              <span>Secure Login</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Welcome to
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                OTPless Auth
              </span>
            </h1>
            
            <p className="text-purple-200 mb-10 leading-relaxed text-base">
              Experience passwordless authentication with SMS, WhatsApp, or Email. 
              Fast, secure, and hassle-free.
            </p>
            
            <div className="flex justify-between gap-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <FiUser className="text-purple-300 mb-2 mx-auto" size={24} />
                <div className="text-2xl font-bold">2.5k+</div>
                <div className="text-sm text-purple-300 mt-1">Happy Users</div>
              </div>
              <div className="text-center">
                <FiZap className="text-purple-300 mb-2 mx-auto" size={24} />
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-purple-300 mt-1">Success Rate</div>
              </div>
              <div className="text-center">
                <FiGlobe className="text-purple-300 mb-2 mx-auto" size={24} />
                <div className="text-2xl font-bold">&lt;3s</div>
                <div className="text-sm text-purple-300 mt-1">OTP Delivery</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              
              {/* Toggle Switch */}
              <div className="flex gap-2 bg-gray-100 p-1 rounded-full mb-8">
                <button
                  type="button"
                  onClick={() => setIsAdmin(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full transition-all duration-300 ${
                    !isAdmin 
                      ? "bg-white text-gray-800 shadow-md" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiUser size={18} />
                  <span className="font-semibold">User</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdmin(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full transition-all duration-300 ${
                    isAdmin 
                      ? "bg-white text-gray-800 shadow-md" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <MdAdminPanelSettings size={18} />
                  <span className="font-semibold">Admin</span>
                </button>
              </div>

              {/* Admin Login Form */}
              {isAdmin ? (
                <form onSubmit={handleAdminLogin} className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back! 🎉</h2>
                    <p className="text-gray-500 text-sm mt-2">Admin access only</p>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      id="admin-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
                      placeholder="Enter your email"
                      required
                    />
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>

                  <div className="relative">
                    <input
                      type="password"
                      id="admin-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3.5 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
                      placeholder="Enter your password"
                      required
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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

                  <div className="text-center pt-4">
                    <p className="text-xs text-gray-400 bg-gray-50 inline-block px-5 py-2.5 rounded-full">
                      🔐 Demo: admin@otpless.com / Admin@123
                    </p>
                  </div>
                </form>
              ) : (
                /* User Login Form */
                <form onSubmit={handleUserOtp} className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Hey There! 👋</h2>
                    <p className="text-gray-500 text-sm mt-2">Enter your details to get started</p>
                  </div>

                  {/* Dynamic Input Field based on method */}
                  {method === "email" ? (
                    <div className="relative">
                      <input
                        type="email"
                        id="user-email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full px-4 py-3.5 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
                        placeholder="Enter your email address"
                        required
                      />
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="tel"
                        id="user-phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3.5 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
                        placeholder="Enter your phone number"
                        required
                      />
                      <FiSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  )}

                  {/* Delivery Method Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Choose Delivery Method
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {/* SMS Option */}
                      <div
                        onClick={() => {
                          setMethod("sms");
                          setPhoneNumber("");
                          setEmailAddress("");
                        }}
                        className={`cursor-pointer rounded-xl p-4 text-center border-2 transition-all duration-300 relative ${
                          method === "sms" 
                            ? "border-purple-500 bg-purple-50" 
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <MdSms className={`mx-auto mb-2 text-2xl ${method === "sms" ? "text-purple-600" : "text-gray-500"}`} />
                        <span className={`text-sm font-semibold block ${method === "sms" ? "text-purple-700" : "text-gray-700"}`}>SMS</span>
                        <p className="text-xs text-gray-400 mt-1">Text message</p>
                        {method === "sms" && <FiCheckCircle className="absolute top-2 right-2 text-purple-500" size={14} />}
                      </div>

                      {/* WhatsApp Option */}
                      <div
                        onClick={() => {
                          setMethod("whatsapp");
                          setPhoneNumber("");
                          setEmailAddress("");
                        }}
                        className={`cursor-pointer rounded-xl p-4 text-center border-2 transition-all duration-300 relative ${
                          method === "whatsapp" 
                            ? "border-green-500 bg-green-50" 
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <FaWhatsapp className={`mx-auto mb-2 text-2xl ${method === "whatsapp" ? "text-green-600" : "text-gray-500"}`} />
                        <span className={`text-sm font-semibold block ${method === "whatsapp" ? "text-green-700" : "text-gray-700"}`}>WhatsApp</span>
                        <p className="text-xs text-gray-400 mt-1">Instant delivery</p>
                        {method === "whatsapp" && <FiCheckCircle className="absolute top-2 right-2 text-green-500" size={14} />}
                      </div>

                      {/* Email Option */}
                      <div
                        onClick={() => {
                          setMethod("email");
                          setPhoneNumber("");
                          setEmailAddress("");
                        }}
                        className={`cursor-pointer rounded-xl p-4 text-center border-2 transition-all duration-300 relative ${
                          method === "email" 
                            ? "border-blue-500 bg-blue-50" 
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <FiMail className={`mx-auto mb-2 text-2xl ${method === "email" ? "text-blue-600" : "text-gray-500"}`} />
                        <span className={`text-sm font-semibold block ${method === "email" ? "text-blue-700" : "text-gray-700"}`}>Email</span>
                        <p className="text-xs text-gray-400 mt-1">Check inbox</p>
                        {method === "email" && <FiCheckCircle className="absolute top-2 right-2 text-blue-500" size={14} />}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <FiSend className="animate-spin" /> Sending OTP...
                      </span>
                    ) : (
                      <span>Continue →</span>
                    )}
                  </button>

                  <div className="text-center pt-4">
                    <p className="text-xs text-gray-400 bg-gray-50 inline-block px-5 py-2.5 rounded-full">
                      ✨ No password needed. Just your phone number or email.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}