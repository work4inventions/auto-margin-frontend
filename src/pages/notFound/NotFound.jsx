import React from "react";
import "./NotFound.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1 className="not-found-page__code">404</h1>
      <p className="not-found-page__message">Oops! Page not found.</p>
      <p className="not-found-page__message">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <button
        type="button"
        className="not-found-page__btn"
        onClick={() => (window.location.href = "/")}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFoundPage;
