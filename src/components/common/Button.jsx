import React from "react";

const VARIANT_CLASS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  danger: "btn-danger",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  type = "button",
  disabled = false,
  onClick,
  fullWidth = false,
  className = "",
}) {
  const variantClass = VARIANT_CLASS[variant] || VARIANT_CLASS.primary;

  return (
    <button
      type={type}
      className={[
        variantClass,
        fullWidth ? "btn-full-width" : "",
        loading ? "btn-is-loading" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading ? <span className="btn-inline-spinner" aria-hidden /> : null}
      {children}
    </button>
  );
}
