import Cookies from "js-cookie";
import { showErrorToast, showSuccessToast } from "../components/common/Toast";
import { refreshToken } from "../redux/slice/refreshTokenSlice";

// Manual token refresh function for components
export const handleTokenRefresh = async (dispatch) => {
  try {
    const currentRefreshToken = Cookies.get("refresh_token");

    if (!currentRefreshToken) {
      throw new Error("No refresh token available");
    }

    const res = await dispatch(refreshToken(currentRefreshToken));

    if (res.type === "refreshToken/fulfilled") {
      if (res?.payload?.data?.accessToken && res?.payload?.data?.refreshToken) {
        // Update tokens in cookies
        Cookies.set("auth_token", res.payload.data.accessToken);
        Cookies.set("refresh_token", res.payload.data.refreshToken);

        // showSuccessToast("Token refreshed successfully");
        return res.payload.data;
      }
    }

    throw new Error("Token refresh failed");
  } catch (error) {
    // Clear tokens on failure
    Cookies.remove("auth_token");
    Cookies.remove("refresh_token");

    const errorMessage = error?.message || "Token refresh failed";
    showErrorToast(errorMessage);
    console.error("Token refresh error:", error);

    // Redirect to login
    window.location.href = "/login";
    throw error;
  }
};

// Check if token is expired (basic check)
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Get token expiration time
export const getTokenExpiration = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

// Check if token will expire soon (within 5 minutes)
export const isTokenExpiringSoon = (token, minutes = 5) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;
    const minutesUntilExpiry = timeUntilExpiry / 60;

    return minutesUntilExpiry <= minutes;
  } catch (error) {
    return true;
  }
};

export const getInitials = (fullName) => {
  if (!fullName) return "";

  return fullName
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n[0].toUpperCase())
    .join("");
};
