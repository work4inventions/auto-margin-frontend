import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const RequireAuth = () => {
  const token = Cookies.get("auth_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
