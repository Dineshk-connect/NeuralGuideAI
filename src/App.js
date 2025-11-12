import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import ChatPage from "./components/ChatPage";
import CodeAnalyzer from "./components/CodeAnalyzer";
import RoadmapGenerator from "./components/RoadmapGenerator";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./components/AuthPage";

<Route path="/login" element={<AuthPage />} />


function AppContent() {
  const location = useLocation();

  // ✅ Hide navbar on login page
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {/* Navigation (hidden on login page) */}
      {!hideNavbar && (
        <nav className="bg-gray-800 p-4 flex justify-center gap-6 text-white">
          <Link to="/dashboard" className="hover:text-blue-400">
            🏠 Home
          </Link>
          <Link to="/chat" className="hover:text-blue-400">
            💬 Chat
          </Link>
          <Link to="/analyzer" className="hover:text-green-400">
            🧠 Analyzer
          </Link>
          <Link to="/roadmap" className="hover:text-yellow-400">
            🎓 Roadmap
          </Link>
        </nav>
      )}

      <Routes>
        {/* Redirect root → login if not logged in */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public route */}
        <Route path="/login" element={<AuthPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analyzer"
          element={
            <ProtectedRoute>
              <CodeAnalyzer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <RoadmapGenerator />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
