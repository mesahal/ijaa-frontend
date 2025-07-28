import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get API base URL from environment or use default
  const API_BASE =
    process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:8000/ijaa/api/v1/user";

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("alumni_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign-in failed");
      }

      // Backend returns { message, code, data: { token, userId } }
      const userData = {
        email: email,
        token: data.data.token,
        userId: data.data.userId,
      };

      setUser(userData);
      localStorage.setItem("alumni_user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      throw new Error(err.message || "Sign-in failed");
    }
  };

  const signUp = async ({ email, password }) => {
    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error codes from backend
        if (
          response.status === 409 ||
          data.message?.includes("already exists")
        ) {
          throw new Error("User already exists");
        }
        throw new Error(data.message || "Registration failed");
      }

      // Backend returns { message, code, data: { token, userId } }
      const userData = {
        email: email,
        token: data.data.token,
        userId: data.data.userId,
      };

      setUser(userData);
      localStorage.setItem("alumni_user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      throw new Error(err.message || "Registration failed");
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("alumni_user");
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
