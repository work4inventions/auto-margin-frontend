import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, change, changeType, desc, color = "var(--primary)" }) => {
  const isUp = changeType === "up";
  const isDown = changeType === "down";

  return (
    <div className="glass-card animated-fade-in" style={{ display: "flex", flexDirection: "column", gap: "12px", position: "relative", overflow: "hidden" }}>
      {/* Subtle backdrop accent glow */}
      <div 
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: color,
          opacity: 0.05,
          filter: "blur(20px)",
          pointerEvents: "none"
        }}
      />
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)" }}>{title}</span>
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            width: "36px", 
            height: "36px", 
            borderRadius: "var(--radius-md)", 
            backgroundColor: `rgba(var(--primary-rgb), 0.08)`,
            color: color
          }}
        >
          {Icon && <Icon size={18} />}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h3 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em" }}>{value}</h3>
        
        {(change !== undefined || desc) && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            {change !== undefined && (
              <span 
                className={`badge ${isUp ? "badge-success" : isDown ? "badge-danger" : "badge-neutral"}`}
                style={{ display: "inline-flex", alignItems: "center", gap: "2px", padding: "2px 6px", fontSize: "11px" }}
              >
                {isUp ? <TrendingUp size={10} /> : isDown ? <TrendingDown size={10} /> : null}
                {isUp ? "+" : ""}{change}%
              </span>
            )}
            {desc && <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>{desc}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
