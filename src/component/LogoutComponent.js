import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear JWT token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/");
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default LogoutComponent;
