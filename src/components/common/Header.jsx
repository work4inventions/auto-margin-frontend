import { Menu, Eye, EyeOff, EllipsisVertical } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { updateProfile } from "../../redux/slice/updateProfileSlice";
import { changePassword } from "../../redux/slice/changePasswordSlice";
import { getInitials } from "../../utils/tokenUtils";
import Button from "../common/Button";
import { showErrorToast, showSuccessToast } from "../common/Toast";

export default function Header({ title = "Welcome to dashboard", subtitle }) {
  const { toggleSidebar } = useOutletContext();
  const dispatch = useDispatch();
  const profileRef = useRef();
  const { data } = useSelector((state) => state.getProfile);
  const { loading: profileLoading } = useSelector(
    (state) => state.updateProfile,
  );
  const { loading: changePasswordLoading } = useSelector(
    (state) => state.changePassword,
  );

  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState(data?.fullName || "");
  const [email, setEmail] = useState(data?.email || "");
  const [profileErrors, setProfileErrors] = useState({});
  const isChanged =
    name !== (data?.fullName || "") || email !== (data?.email || "");
  const initials = getInitials(data?.fullName);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (profileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [profileOpen]);

  useEffect(() => {
    if (changePasswordOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [changePasswordOpen]);

  useEffect(() => {
    setName(data?.fullName || "");
    setEmail(data?.email || "");
    setProfileErrors({});
  }, [data]);

  const validateProfile = () => {
    const newErrors = {};

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      newErrors.name = "Name is required";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (trimmedName.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmedEmail)) {
      newErrors.email = "Invalid email address";
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const isValid = validateProfile();
    if (!isValid) return;

    try {
      const response = await dispatch(updateProfile({ name, email }));

      if (response.type === "updateProfile/fulfilled") {
        setProfileOpen(false);
        showSuccessToast("Profile updated successfully");
      } else {
        const errorMsg =
          response.payload?.message || "Failed to update profile";
        showErrorToast(errorMsg);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      showErrorToast("Something went wrong");
    }
  };

  const resetChangePasswordState = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleOpenChangePassword = () => {
    setProfileOpen(false);
    resetChangePasswordState();
    setChangePasswordOpen(true);
  };

  const handleCancelChangePassword = () => {
    setConfirmPassword("");
    setNewPassword("");
    setCurrentPassword("");
    setPasswordErrors({});
    resetChangePasswordState();
    setChangePasswordOpen(false);
  };

  const handleChangePassword = async () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      showErrorToast("Please fix the highlighted errors");
      return;
    }

    setPasswordErrors({});

    try {
      const response = await dispatch(
        changePassword({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      );

      if (response.type === "changePassword/fulfilled") {
        showSuccessToast(
          response.payload?.message || "Password updated successfully",
        );
        setChangePasswordOpen(false);
        resetChangePasswordState();
      } else {
        const errorMsg =
          response.payload?.message || "Failed to update password";
        showErrorToast(errorMsg);
      }
    } catch (err) {
      console.error("Change password error:", err);
      showErrorToast("Something went wrong");
    }
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <Menu />
            </button>

            <div className="header-titles">
              <h1>{title}</h1>
              {subtitle && <p className="header-subtitle">{subtitle}</p>}
            </div>
          </div>

          <div className="dashboard-header-actions" ref={profileRef}>
            <div
              className="user-info desktop"
              onClick={() => setProfileOpen(!profileOpen)}
              style={{ cursor: "pointer" }}
            >
              <div className="user-avatar">{initials || "AB"}</div>
              <div className="user-details">
                <p className="user-name">{data?.fullName || "Alex Brown"}</p>
                <p className="user-email">{data?.email || "admin@brand.com"}</p>
              </div>
            </div>
            <div className="mobile-menu">
              <button
                className="dots-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <EllipsisVertical />
              </button>
            </div>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="user-avatar">{initials || "AB"}</div>
                  <div className="user-details">
                    <p className="user-name">
                      {data?.fullName || "Alex Brown"}
                    </p>
                    <p className="user-email">
                      {data?.email || "admin@brand.com"}
                    </p>
                  </div>
                </div>

                <div className="profile-body">
                  <div className="form-row">
                    <label>Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (profileErrors.name) {
                          setProfileErrors((prev) => ({ ...prev, name: "" }));
                        }
                      }}
                    />
                  </div>
                  {profileErrors.name && (
                    <p className="profile-error">{profileErrors.name}</p>
                  )}

                  <div className="form-row">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (profileErrors.email) {
                          setProfileErrors((prev) => ({ ...prev, email: "" }));
                        }
                      }}
                    />
                  </div>
                  {profileErrors.email && (
                    <p className="profile-error">{profileErrors.email}</p>
                  )}

                  <div className="change-password-row">
                    <button
                      type="button"
                      className="change-password-link"
                      onClick={handleOpenChangePassword}
                    >
                      Change Password
                    </button>
                  </div>
                  <div className="save-btn">
                    <Button
                      variant="secondary"
                      onClick={handleSave}
                      disabled={profileLoading || !isChanged}
                    >
                      {profileLoading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {changePasswordOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-header">
              <h2>Change Password</h2>
            </div>

            <div className="custom-modal-body">
              <div className="form-group password-group">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (passwordErrors.currentPassword) {
                      setPasswordErrors((prev) => ({
                        ...prev,
                        currentPassword: "",
                      }));
                    }
                  }}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </span>
                {passwordErrors.currentPassword && (
                  <p className="password-error">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="form-group password-group">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordErrors.newPassword) {
                      setPasswordErrors((prev) => ({
                        ...prev,
                        newPassword: "",
                      }));
                    }
                  }}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
                {passwordErrors.newPassword && (
                  <p className="password-error">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div className="form-group password-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordErrors.confirmPassword) {
                      setPasswordErrors((prev) => ({
                        ...prev,
                        confirmPassword: "",
                      }));
                    }
                  }}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </span>
                {passwordErrors.confirmPassword && (
                  <p className="password-error">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="custom-modal-footer">
              <button
                className="cancel-btn"
                onClick={handleCancelChangePassword}
              >
                Cancel
              </button>

              <Button
                variant="secondary"
                onClick={handleChangePassword}
                disabled={changePasswordLoading}
              >
                {changePasswordLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-header {
          position: sticky;
          top: 0;
          background: linear-gradient(
              180deg,
              rgb(13 61 84 / .05) 0%,
              rgb(68 183 74 / .05) 100%
            ),
            #F8F9FA;
          z-index: 30;
        }

        .dashboard-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          height: 70px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .header-titles {
          display: flex;
          flex-direction: column;
        }

        .header-left h1 {
          font-size: 20px;
          margin: 0;
          line-height: 1.2;
        }

        .header-subtitle {
          font-size: 13px;
          margin: 2px 0 0 0;
          opacity: 0.7;
        }

        .menu-toggle {
          font-size: 22px;
          background: none;
          border: none;
          cursor: pointer;
          display: none;
        }

        @media (max-width: 991px) {
          .menu-toggle {
            display: block;
          }
        }

        .dashboard-header-actions {
          display: flex;
          gap: 0.75rem;
          position: relative;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(90deg, #0d3d54, #44b74a);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0;
          text-transform: capitalize;
        }

        .user-email {
          font-size: 0.75rem;
          margin: 0;
          opacity: 0.7;
        }

        /* Mobile dots button */
        .mobile-menu {
          display: none;
          position: relative;
        }

        .dots-btn {
          font-size: 22px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .dropdown {
          position: absolute;
          top: 30px;
          right: 5px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        /* Show mobile menu only on <=767px */
        @media (max-width: 767px) {
          .dashboard-header-content {
            padding: 0 1rem;
          }
          .header-left h1 {
          font-size: 18px;
          }

         .header-subtitle {
          font-size: 11px;
         }
          .user-info.desktop {
            display: none;
          }
          .mobile-menu {
            display: block;
          }
        }
           /* PROFILE DROPDOWN */
        .profile-dropdown {
          position: absolute;
          top: 65px;
          right: 0;
          width: 350px;
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          animation: fadeIn 0.2s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-header {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 20px;
        }

        .profile-avatar {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: linear-gradient(90deg, #0d3d54, #44b74a);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .form-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .form-row label {
          font-size: 13px;
        }

        .form-row input {
          border: none;
          border-bottom: 1px solid #ccc;
          background: transparent;
          padding: 4px;
          text-align: right;
          outline: none;
          width: 55%;
        }

        .profile-error {
          margin: 4px 0 0;
          font-size: 12px;
          color: #d32f2f;
          text-align: right;
        }

        .password-error {
          margin: 4px 0 8px;
          font-size: 12px;
          color: #d32f2f;
        }

        .save-btn {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .change-password-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 8px;
        }

        .change-password-link {
          background: none;
          border: none;
          color: #0d6efd;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        /* Centered modal (same style as Add User) */
        .custom-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
          padding: 16px;
        }

        .custom-modal {
          background: #ffffff;
          width: 100%;
          max-width: 500px;
          border-radius: 10px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        .custom-modal-header {
          padding: 18px 24px;
          border-bottom: 1px solid var(--border);
        }

        .custom-modal-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .custom-modal-body {
          padding: 20px 24px;
        }

        .form-group {
          margin-bottom: 18px;
          position: relative;
        }

        .form-group input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
          outline: none;
          transition: 0.2s ease;
        }

        .form-group input:focus {
          border-color: #0d3c48;
        }

        .password-group {
          position: relative;
        }

        .toggle-password {
          position: absolute;
          right: 12px;
          top: 12px;
          cursor: pointer;
          font-size: 14px;
        }

        .custom-modal-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .cancel-btn {
          padding: 10px 18px;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--white);
          color: var(--primary-color);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover:not(:disabled) {
          background: var(--primary-color);
          color: var(--white);
        }

        @media (max-width: 480px) {
          .profile-dropdown {
            position: fixed;
            top: 80px;
            left: 50%;
            width: 95%;
            max-width: 95%; 
            border-radius: 12px;
            animation: mobileSlideUp 0.3s ease forwards;
          }
        }

        @keyframes mobileSlideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      }
      `}</style>
    </>
  );
}
