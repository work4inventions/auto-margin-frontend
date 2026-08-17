import React from "react";

const ChartCard = ({ title, subtitle, actions, children }) => {
  return (
    <div className="glass-card animated-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>{title}</h3>
          {subtitle && <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px", fontWeight: "500" }}>{subtitle}</p>}
        </div>
        {actions && <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>{actions}</div>}
      </div>
      <div style={{ flex: 1, minHeight: "260px", width: "100%" }}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
