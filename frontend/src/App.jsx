import { Navigate, Route, Routes } from "react-router-dom";
import { LoaderIcon } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import NavBar from "./components/system/NavBar";
import Home from "./pages/system/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/system/ProtectedRoute";
import Tasks from "./pages/task/Tasks";
import Create from "./pages/task/Create";
import Archived from "./pages/task/Archived";
import Update from "./pages/task/Update";
import NotFound from "./pages/system/NotFound";
import Footer from "./components/system/Footer";

const AppContent = () => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  if (!user && !loading && error) {
    return <div className="p-4 text-error">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/tasks" replace /> : <Home />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/tasks" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/tasks" replace /> : <Register />}
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            }
          />
          <Route
            path="/archived"
            element={
              <ProtectedRoute>
                <Archived />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task/:id"
            element={
              <ProtectedRoute>
                <Update />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
