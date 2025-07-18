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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser = {
      id: 1,
      name: "John Doe",
      email: email,
      batch: "2020",
      department: "Computer Science & Engineering",
      profession: "Software Engineer",
      location: "Dhaka, Bangladesh",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    };

    setUser(mockUser);
    localStorage.setItem("alumni_user", JSON.stringify(mockUser));
    return mockUser;
  };

  const signUp = async (userData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser = {
      id: Date.now(),
      ...userData,
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    };

    setUser(mockUser);
    localStorage.setItem("alumni_user", JSON.stringify(mockUser));
    return mockUser;
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
