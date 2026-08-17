import React from "react";
import Loader from "./Loader";

const LoadingSpinner = () => (
  <div className="app-loader-overlay">
    <Loader size="lg" />
  </div>
);

export default LoadingSpinner;
