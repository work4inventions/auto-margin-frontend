import React, { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import { Menu, Moon, Sun } from "lucide-react";
import NavbarProfile from "../components/common/NavbarProfile";
import { useAppTheme } from "../context/ThemeContext";
import "./AppLayout.css";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useAppTheme();
  const location = useLocation();

  const pageTitle = useMemo(() => {
    const pathname = location.pathname;
    if (pathname.startsWith("/collections/") && pathname.length > "/collections".length) {
      return "Collection Vendors";
    }
    if (pathname.includes("/collections")) return "Collections";
    if (pathname.includes("/products")) return "Products";
    if (pathname.includes("/settings")) return "Settings";
    return "Overview";
  }, [location.pathname]);

  return (
    <div className="dashboard-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="dashboard-main">
        <header className="dashboard-navbar">
          <button
            className="icon-btn mobile-only"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="dashboard-title">{pageTitle}</h1>
            <p className="dashboard-subtitle">AutoMargin Shopify Admin</p>
          </div>
          <div className="dashboard-nav-actions">
            <button
              className="icon-btn"
              onClick={toggleTheme}
              title="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <NavbarProfile />
          </div>
        </header>
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
