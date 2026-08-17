/** Normalize API user object for UI (name, email, role). */
export const normalizeProfile = (raw) => {
  if (!raw) return null;

  const user = raw.user ?? raw;
  if (!user || typeof user !== "object") return null;

  const name = String(user.name || user.fullName || "").trim();
  const email = String(user.email || "").trim();

  return {
    id: user._id || user.id || null,
    name,
    fullName: name,
    email,
    role: user.role || null,
    avatar: user.avatar || null,
  };
};

export const getProfileName = (profile) =>
  profile?.name || profile?.fullName || "";
