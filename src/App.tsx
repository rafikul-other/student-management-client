import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loader from "./common/Loader";
import SignIn from "./pages/Authentication/SignIn";
import AppRouter from "./AppRouter";
import NotFound from "./components/NotFound";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ColorModeProvider } from "./context/ColorModeContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { ToastProvider } from "./hooks/useToast";

const getHomeRoute = (role?: string) => {
  if (role === "Student") return "/admin/calendar";
  if (role === "DepartmentManager") return "/admin/students";
  return "/admin/dashboard";
};

const SignInRoute = () => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated ? <Navigate to={getHomeRoute(user?.role)} replace /> : <SignIn />;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ColorModeProvider>
          <ToastProvider>
            {loading ? (
              <Loader />
            ) : (
              <Routes>
                <Route path="/" element={<SignInRoute />} />
                <Route path="/admin/*" element={<AppRouter />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </ToastProvider>
        </ColorModeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
