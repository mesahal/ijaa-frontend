import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    
    // Safely check for dark mode preference, fallback to false if not available
    let prefersDark = false;
    try {
      if (window.matchMedia) {
        prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    } catch (error) {
      // Fallback to light mode if matchMedia is not available (e.g., in tests)
      console.warn("matchMedia not available, defaulting to light mode");
    }

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      if (document && document.documentElement) {
        document.documentElement.classList.add("dark");
      }
    } else {
      setIsDark(false);
      if (document && document.documentElement) {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      if (document && document.documentElement) {
        document.documentElement.classList.add("dark");
      }
      localStorage.setItem("theme", "dark");
    } else {
      if (document && document.documentElement) {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", "light");
    }
  };

  const value = {
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
