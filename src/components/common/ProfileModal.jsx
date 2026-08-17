import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { ChevronDown, Eye, EyeOff, Lock, LogOut, X } from "lucide-react";
import { getProfile } from "../../redux/slice/getProfileSlice";
import { updateProfile } from "../../redux/slice/updateProfileSlice";
import { changePassword } from "../../redux/slice/changePasswordSlice";
import { getProfileName } from "../../utils/profile";
import { getInitials } from "../../utils/tokenUtils";
import { showErrorToast, showSuccessToast } from "./Toast";
import "./ProfileModal.css";

const PasswordField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  visible,
  onToggleVisible,
  onClearError,
}) => (
  <div className="profile-field">
    <label className="form-label" htmlFor={id}>{label}</label>
    <div className="profile-password-input">
      <input
        id={id}
        type={visible ? "text" : "password"}
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          onClearError?.();
        }}
        autoComplete={id === "profile-current-password" ? "current-password" : "new-password"}
      />
      <button
        type="button"
        className="profile-password-toggle"
        onClick={onToggleVisible}
        aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
        tabIndex={-1}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    <p className={`profile-field-error ${error ? "is-visible" : ""}`} role="alert">
      {error || ""}
    </p>
  </div>
);

const ProfileModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { data: profile, loading: profileFetchLoading } = useSelector((state) => state.getProfile);
  const { loading: profileLoading } = useSelector((state) => state.updateProfile);
  const { loading: changePasswordLoading } = useSelector((state) => state.changePassword);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileErrors, setProfileErrors] = useState({});
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileName = getProfileName(profile);
  const displayName = profileName || (profileFetchLoading ? "Loading…" : "User");
  const initials = getInitials(profileName || "User") || "U";
  const roleLabel = profile?.role === "admin" ? "Administrator" : profile?.role || null;

  const isChanged =
    name.trim() !== profileName.trim()
    || email.trim() !== (profile?.email || "").trim();

  useEffect(() => {
    if (open) {
      dispatch(getProfile());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setProfileErrors({});
      setShowPasswordSection(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setName(profileName);
    setEmail(profile?.email || "");
  }, [open, profileName, profile?.email]);

  const validateProfile = () => {
    const errors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.name = "Name is required";
    } else if (trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!trimmedEmail) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmedEmail)) {
      errors.email = "Invalid email address";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    try {
      const response = await dispatch(updateProfile({
        name: name.trim(),
        email: email.trim(),
      }));

      if (response.type === "updateProfile/fulfilled") {
        showSuccessToast("Profile updated successfully");
        onClose();
      } else {
        showErrorToast(response.payload?.message || "Failed to update profile");
      }
    } catch {
      showErrorToast("Something went wrong");
    }
  };

  const handleChangePassword = async () => {
    const errors = {};
    if (!currentPassword) errors.currentPassword = "Current password is required";
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    try {
      const response = await dispatch(changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }));

      if (response.type === "changePassword/fulfilled") {
        showSuccessToast(response.payload?.message || "Password updated successfully");
        setShowPasswordSection(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showErrorToast(response.payload?.message || "Failed to update password");
      }
    } catch {
      showErrorToast("Something went wrong");
    }
  };

  const handleLogout = () => {
    try {
      Cookies.remove("auth_token");
      Cookies.remove("refresh_token");
      showSuccessToast("Logged out successfully");
      onClose();
      window.location.href = "/login";
    } catch {
      showErrorToast("Logout failed");
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="profile-modal-overlay animated-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glass-card profile-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <div className="profile-modal-header">
          <h2 id="profile-modal-title" className="profile-modal-title">Profile settings</h2>
          <button
            type="button"
            className="icon-btn profile-modal-close"
            onClick={onClose}
            aria-label="Close profile"
          >
            <X size={18} />
          </button>
        </div>

        <div className="profile-modal-user">
          <div className="profile-modal-user-main">
            <div className="profile-modal-avatar">{initials}</div>
            <div className="profile-modal-user-text">
              <p className="profile-modal-name">{displayName}</p>
              <p className="profile-modal-email">{profile?.email}</p>
              {roleLabel && <span className="profile-modal-role">{roleLabel}</span>}
            </div>
          </div>
          <button
            type="button"
            className="profile-modal-logout"
            onClick={handleLogout}
          >
            <LogOut size={16} aria-hidden />
            <span>Logout</span>
          </button>
        </div>

        <div className="profile-modal-body">
          <section className="profile-modal-section">
            <h3 className="profile-modal-section-title">Account details</h3>

            <div className="profile-field">
              <label className="form-label" htmlFor="profile-name">Full name</label>
              <input
                id="profile-name"
                type="text"
                className="input-field"
                placeholder="Enter your full name"
                value={name}
                disabled={profileFetchLoading && !profileName}
                onChange={(e) => {
                  setName(e.target.value);
                  if (profileErrors.name) setProfileErrors((p) => ({ ...p, name: "" }));
                }}
              />
              <p className={`profile-field-error ${profileErrors.name ? "is-visible" : ""}`} role="alert">
                {profileErrors.name || ""}
              </p>
            </div>

            <div className="profile-field">
              <label className="form-label" htmlFor="profile-email">Email address</label>
              <input
                id="profile-email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                disabled={profileFetchLoading && !profile?.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (profileErrors.email) setProfileErrors((p) => ({ ...p, email: "" }));
                }}
              />
              <p className={`profile-field-error ${profileErrors.email ? "is-visible" : ""}`} role="alert">
                {profileErrors.email || ""}
              </p>
            </div>
          </section>

          <section className="profile-modal-section profile-modal-section--password">
            <button
              type="button"
              className={`profile-modal-password-toggle ${showPasswordSection ? "is-open" : ""}`}
              onClick={() => setShowPasswordSection((v) => !v)}
              aria-expanded={showPasswordSection}
            >
              <span className="profile-modal-password-toggle-left">
                <Lock size={16} aria-hidden />
                <span>Change password</span>
              </span>
              <ChevronDown size={18} className="profile-modal-password-chevron" aria-hidden />
            </button>

            {showPasswordSection && (
              <div className="profile-modal-password-block">
                <PasswordField
                  id="profile-current-password"
                  label="Current password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  error={passwordErrors.currentPassword}
                  visible={showCurrentPassword}
                  onToggleVisible={() => setShowCurrentPassword((v) => !v)}
                  onClearError={() => setPasswordErrors((p) => ({ ...p, currentPassword: "" }))}
                />
                <PasswordField
                  id="profile-new-password"
                  label="New password"
                  placeholder="Enter new password (min. 6 characters)"
                  value={newPassword}
                  onChange={setNewPassword}
                  error={passwordErrors.newPassword}
                  visible={showNewPassword}
                  onToggleVisible={() => setShowNewPassword((v) => !v)}
                  onClearError={() => setPasswordErrors((p) => ({ ...p, newPassword: "" }))}
                />
                <PasswordField
                  id="profile-confirm-password"
                  label="Confirm new password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  error={passwordErrors.confirmPassword}
                  visible={showConfirmPassword}
                  onToggleVisible={() => setShowConfirmPassword((v) => !v)}
                  onClearError={() => setPasswordErrors((p) => ({ ...p, confirmPassword: "" }))}
                />
                <button
                  type="button"
                  className="btn-primary profile-modal-password-submit"
                  onClick={handleChangePassword}
                  disabled={changePasswordLoading}
                >
                  {changePasswordLoading ? "Updating password..." : "Update password"}
                </button>
              </div>
            )}
          </section>
        </div>

        <div className="profile-modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveProfile}
            disabled={profileLoading || !isChanged}
          >
            {profileLoading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfileModal;
