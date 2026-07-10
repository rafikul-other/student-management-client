import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loader from "./common/Loader";
import AppRouter from "./AppRouter";
import NotFound from "./components/NotFound";
import Docs from "./pages/Docs/Docs";
import Landing from "./pages/Landing/Landing";
import { AuthProvider } from "./context/AuthContext";
import { ColorModeProvider } from "./context/ColorModeContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { ToastProvider } from "./hooks/useToast";

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
                <Route path="/" element={<Landing />} />
                <Route path="/admin/*" element={<AppRouter />} />
                <Route path="/docs" element={<Docs />} />
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
