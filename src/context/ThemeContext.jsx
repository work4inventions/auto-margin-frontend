import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { applyTheme, getStoredTheme } from "../utils/theme";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => getStoredTheme() === "dark");

  const setTheme = useCallback((dark) => {
    setIsDarkMode(dark);
    applyTheme(dark ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      applyTheme(next ? "dark" : "light");
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ isDarkMode, setTheme, toggleTheme }),
    [isDarkMode, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return ctx;
};
