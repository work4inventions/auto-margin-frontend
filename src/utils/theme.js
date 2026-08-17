export const THEME_STORAGE_KEY = "automargin-theme";

export const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return "light";
};

export const applyTheme = (mode) => {
  const isDark = mode === "dark";
  const root = document.documentElement;

  root.classList.remove("theme-dark", "theme-light");
  root.classList.add(isDark ? "theme-dark" : "theme-light");

  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  } catch {
    /* ignore */
  }
};

/** Run before React mounts to avoid light flash on reload */
export const initTheme = () => {
  applyTheme(getStoredTheme());
};
