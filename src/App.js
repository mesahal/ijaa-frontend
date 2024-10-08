import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderComponent from "./component/HeaderComponent";
import FooterComponent from "./component/FooterComponent";
import ListUserComponent from "./component/ListUserComponent";
import Register from "./component/RegisterComponent";
import Login from "./component/LoginComponent";
import ProtectedRoute from "./component/ProtectedRoute"; // Import ProtectedRoute
import LogoutComponent from "./component/LogoutComponent"; // Import logout component

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
