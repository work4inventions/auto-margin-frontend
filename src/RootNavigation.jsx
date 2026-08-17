import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authenticateUser } from "./redux/slice/authenticateSlice";
import AppRoutes from "./routes/AppRoutes";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Cookies from "js-cookie";
import { showErrorToast } from "./components/common/Toast";
import {
  isTokenExpired,
  isTokenExpiringSoon,
  handleTokenRefresh,
} from "./utils/tokenUtils";

const RootNavigation = () => {
  const dispatch = useDispatch();
  const { loading  } = useSelector((state) => state.login);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = Cookies.get("auth_token");
        const refreshToken = Cookies.get("refresh_token");

        if (!token || !refreshToken) {
          setHasCheckedAuth(true);
          return;
        }

        setIsAuthenticating(true);

        // Check if token is expired
        if (isTokenExpired(token)) {
          // Try to refresh the token
          try {
            await handleTokenRefresh(dispatch);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect
            Cookies.remove("auth_token");
            Cookies.remove("refresh_token");
            showErrorToast("Session expired. Please login again.");
            setHasCheckedAuth(true);
            setIsAuthenticating(false);
            return;
          }
        }

        // Check if token is expiring soon (within 5 minutes)
        if (isTokenExpiringSoon(token, 5)) {
          // Proactively refresh the token
          try {
            await handleTokenRefresh(dispatch);
          } catch (refreshError) {
            // Refresh failed, but token is still valid for now
            console.warn("Proactive token refresh failed:", refreshError);
          }
        }

        // Now authenticate with the server
        const res = await dispatch(authenticateUser());
        
        if (res.type === "authenticateUser/fulfilled") {
        } else {
          Cookies.remove("auth_token");
          Cookies.remove("refresh_token");
          showErrorToast("Session expired. Please login again.");
        }
      } catch (error) {
        console.error("RootNavigation: Authentication error:", error);
        Cookies.remove("auth_token");
        Cookies.remove("refresh_token");
      } finally {
        setIsAuthenticating(false);
        setHasCheckedAuth(true);
      }
    };

    // Only run authentication check if we haven't checked yet
    if (!hasCheckedAuth) {
      checkAuthentication();
    }
  }, [dispatch, hasCheckedAuth]);

  // Show loading spinner only when actively authenticating
  if (isAuthenticating || (loading && !hasCheckedAuth)) {
    return <LoadingSpinner />;
  }

  return <AppRoutes />;
};

export default RootNavigation;
