import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import LoadingSpinner from "../components/common/LoadingSpinner";
import NotFound from "../pages/notFound/NotFound";
import RequireAuth from "./RequireAuth";
import AppLayout from "../layouts";

const Login = React.lazy(() => import("../pages/login/Login"));
const Dashboard = React.lazy(() => import("../pages/dashboard/Dashboard"));
const Collections = React.lazy(() => import("../pages/collections/Collections"));
const CollectionDetail = React.lazy(() => import("../pages/collections/CollectionDetail"));
const Products = React.lazy(() => import("../pages/product/Products"));

const AppRoutes = () => {
  const token = Cookies.get("auth_token");

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login />}
        />

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:collectionId" element={<CollectionDetail />} />
            <Route path="/vendors" element={<Navigate to="/collections" replace />} />
            <Route path="/margins" element={<Navigate to="/collections" replace />} />
            <Route path="/products" element={<Products />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
