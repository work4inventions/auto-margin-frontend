import React from "react";

const SIZE_CLASS = {
  sm: "app-loader--sm",
  md: "app-loader--md",
  lg: "app-loader--lg",
};

/**
 * Shared loader — single-color ring + orbiting dot.
 * @param {'sm'|'md'|'lg'} size
 * @param {string} [label]
 * @param {string} [className]
 */
const Loader = ({ size = "md", label, className = "" }) => {
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.md;

  return (
    <div
      className={`app-loader ${sizeClass} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label || "Loading"}
    >
      <div className="app-loader__visual" aria-hidden="true">
        <span className="app-loader__ring" />
        <span className="app-loader__orbit">
          <span className="app-loader__dot" />
        </span>
      </div>
      {label ? <span className="app-loader__label">{label}</span> : null}
    </div>
  );
};

export default Loader;
