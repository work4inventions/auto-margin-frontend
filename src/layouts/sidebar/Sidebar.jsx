import Cookies from "js-cookie";
import { Folder, Home, X, ShoppingBag, LogOut } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  showErrorToast,
  showSuccessToast,
} from "../../components/common/Toast";
import { getProfile } from "../../redux/slice/getProfileSlice";
import images from "../../utils/images";
import { getProfileName } from "../../utils/profile";
import { getInitials } from "../../utils/tokenUtils";
import "./Sidebar.css";

function Sidebar({ isOpen, toggleSidebar, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { data: profile, loading: profileLoading } = useSelector((state) => state.getProfile);

  const displayName = getProfileName(profile) || (profileLoading ? "…" : "User");
  const displayEmail = profile?.email || "";
  const initials = useMemo(() => getInitials(displayName) || "AM", [displayName]);
  const roleLabel = profile?.role === "admin" ? "Administrator" : profile?.role || null;

  const navItems = [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "Collections", icon: Folder, path: "/collections" },
    { label: "Products", icon: ShoppingBag, path: "/products" },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await dispatch(getProfile());
        if (res.type === "getProfile/fulfilled") {
          console.log("User profile get successfully");
        } else {
          console.error("Authentication failed:", res.payload?.message);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    checkAuth();
  }, [dispatch]);

  const handleLogout = () => {
    try {
      Cookies.remove("auth_token");
      Cookies.remove("refresh_token");
      showSuccessToast("Logged out successfully");
      // navigate("/login", { replace: true });

      window.location.href = "/login";
    } catch (error) {
      showErrorToast("Logout failed");
      console.error("Logout error:", error);
    }
  };

  const handleClose = onClose || toggleSidebar || (() => {});

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={handleClose}
        aria-hidden={!isOpen}
      />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-wrap">
            <img src={images.logo} alt="Diamond Gallery" className="sidebar-logo-img" />
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={handleClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

      <nav className="nav">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const pathname = location.pathname;
          const isActive =
            item.path === "/collections"
              ? pathname === "/collections" || pathname.startsWith("/collections/")
              : pathname === item.path;

          return (
            <button
              key={idx}
              className={`nav-button ${isActive ? "active" : ""}`}
              onClick={() => {
                navigate(item.path);
                handleClose();
              }}
            >
              <Icon size={20} aria-hidden />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-profile">
        <div className="sidebar-profile-card">
          <div className="sidebar-profile-user">
            <div className="sidebar-profile-avatar" aria-hidden>
              {profileLoading ? (
                <span className="sidebar-profile-avatar-skeleton" />
              ) : (
                initials
              )}
            </div>
            <div className="sidebar-profile-details">
              <p className="sidebar-profile-name">{displayName}</p>
              <p className="sidebar-profile-email">{displayEmail}</p>
              {roleLabel && (
                <span className="sidebar-profile-role">{roleLabel}</span>
              )}
            </div>
          </div>
          <button type="button" className="sidebar-profile-logout" onClick={handleLogout}>
            <LogOut size={16} aria-hidden />
            <span>Logout</span>
          </button>
        </div>
      </div>
      </aside>
    </>
  );
}

export default Sidebar;
