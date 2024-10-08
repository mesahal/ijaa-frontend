import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import ListUserComponent from "./pages/ListUserComponent";
import Register from "./pages/RegisterComponent";
import Login from "./pages/LoginComponent";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import LogoutComponent from "./pages/LogoutComponent"; // Import logout component

function App() {
  return (
    <BrowserRouter>
      <HeaderComponent />
      <div className="container">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          {/* Protect the users route */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <ListUserComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<LogoutComponent />} />{" "}
        </Routes>
      </div>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
