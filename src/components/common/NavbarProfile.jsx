import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";
import { getProfile } from "../../redux/slice/getProfileSlice";
import { getProfileName } from "../../utils/profile";
import { getInitials } from "../../utils/tokenUtils";
import ProfileModal from "./ProfileModal";

const NavbarProfile = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: profile, loading } = useSelector((state) => state.getProfile);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const displayName = getProfileName(profile) || (loading ? "…" : "User");
  const displayEmail = profile?.email || "";
  const initials = useMemo(() => getInitials(displayName) || "AM", [displayName]);

  return (
    <>
      <button
        type="button"
        className="navbar-profile-chip"
        onClick={() => setModalOpen(true)}
        aria-label="Open profile settings"
      >
        <span className="navbar-profile-avatar" aria-hidden>
          {loading ? "…" : initials}
        </span>
        <span className="navbar-profile-text">
          <span className="navbar-profile-name">{displayName}</span>
          {displayEmail ? (
            <span className="navbar-profile-email">{displayEmail}</span>
          ) : null}
        </span>
        <ChevronDown size={16} className="navbar-profile-chevron" aria-hidden />
      </button>

      <ProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default NavbarProfile;
