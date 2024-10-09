import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import ListUserComponent from "./pages/ListUserComponent";
import Register from "./pages/RegisterComponent";
import Login from "./pages/LoginComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import LogoutComponent from "./pages/LogoutComponent";
import Sidebar from "./components/Sidebar"; // Import your Sidebar

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Listen to token changes in localStorage (for example, when login/logout happens)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, [token]); // Trigger this effect when the token state changes

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken); // Update the state when the user logs in
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null); // Update the state when the user logs out
  };

  return (
    <BrowserRouter>
      <HeaderComponent />
      <div className="app-layout">
        {token && <Sidebar />}{" "}
        {/* Show Sidebar only when the user is logged in */}
        <div className="container">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={<Login onLogin={handleLogin} />} // Pass the login handler
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <ListUserComponent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logout"
              element={<LogoutComponent onLogout={handleLogout} />}
            />{" "}
            {/* Pass the logout handler */}
          </Routes>
        </div>
      </div>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
