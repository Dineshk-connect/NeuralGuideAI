import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api/auth";

const AuthPage = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 Login handler
  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log("Login success:", res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Register handler
  const handleRegister = async () => {
    setError("");
    setLoading(true);
    if (!name || !email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/register`,
        { name, email, password },
        { withCredentials: true }
      );
      console.log("Register success:", res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 transition-transform hover:scale-[1.01]">
        {/* App Name */}
        <h1 className="text-3xl font-extrabold text-sky-600 text-center mb-2 tracking-tight">
          DevMentor
        </h1>

        {/* Form Title */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          {isLoginForm ? "Welcome Back 👋" : "Create an Account 🚀"}
        </h2>
        <p className="text-gray-500 text-center mb-6">
          {isLoginForm
            ? "Log in to continue your journey"
            : "Join DevMentor and start exploring"}
        </p>

        {/* Error */}
        {error && (
          <p className="bg-red-50 border border-red-200 text-red-600 text-sm p-2 rounded-md mb-4 text-center">
            {error}
          </p>
        )}

        {/* Registration Name Field */}
        {!isLoginForm && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          className={`w-full py-3 rounded-md font-semibold transition-all duration-200 shadow-md ${
            loading
              ? "bg-sky-300 cursor-not-allowed"
              : "bg-sky-500 hover:bg-sky-600 text-white"
          }`}
          onClick={isLoginForm ? handleLogin : handleRegister}
          disabled={loading}
        >
          {loading ? "Please wait..." : isLoginForm ? "Login" : "Register"}
        </button>

        {/* Divider */}
        <div className="my-5 border-t border-gray-200"></div>

        {/* Switch between login/register */}
        <p
          className="text-center text-sky-600 hover:text-sky-700 font-medium cursor-pointer"
          onClick={() => setIsLoginForm((prev) => !prev)}
        >
          {isLoginForm
            ? "Don’t have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
