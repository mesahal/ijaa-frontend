import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FeatureFlagProvider } from "./context/FeatureFlagContext";

// Components
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";

/**
 * Main App Component
 * Sets up the application with providers and routing
 */
function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <FeatureFlagProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              {/* Main Content */}
              <AppRoutes />
              
              {/* Toast Notifications */}
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={document.documentElement.classList.contains("dark") ? "dark" : "light"}
              />
            </div>
          </FeatureFlagProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
