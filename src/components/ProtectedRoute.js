import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true, // ✅ ensure JWT cookie is sent
        });
        setUser(res.data.user);
      } catch (err) {
        console.warn("Auth check failed:", err.response?.data || err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="text-center p-4">🔄 Checking login status...</div>;
  if (!user) return <Navigate to="/login" replace />; // ✅ redirects to login page if not logged in

  return children;
}
