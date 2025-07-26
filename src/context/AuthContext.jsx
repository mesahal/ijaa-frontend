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

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem("alumni_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await fetch(
        "http://localhost:8000/ijaa/api/v1/user/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign-in failed");
      }

      const user = {
        email: email,
        token: data.data.token,
        // Add other user fields from backend if available
      };

      setUser(user);
      localStorage.setItem("alumni_user", JSON.stringify(user));
      return user;
    } catch (err) {
      throw new Error(err.message || "Sign-in failed");
    }
  };

  const signUp = async ({ email, password }) => {
    try {
      const response = await fetch(
        "http://localhost:8000/ijaa/api/v1/user/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error codes from backend
        if (data.code === "409") {
          throw new Error("User already exists");
        }
        throw new Error(data.message || "Registration failed");
      }

      const user = {
        email: email,
        token: data.data.token,
      };

      setUser(user);
      localStorage.setItem("alumni_user", JSON.stringify(user));
      return user;
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
