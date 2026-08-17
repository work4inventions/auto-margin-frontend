import React from "react";

const LoadingSkeleton = ({ type = "card", count = 1 }) => {
  const PulseItem = ({ style }) => (
    <div 
      className="skeleton-pulse"
      style={{
        background: "linear-gradient(90deg, var(--border) 25%, var(--bg) 50%, var(--border) 75%)",
        backgroundSize: "200% 100%",
        animation: "pulseShimmer 1.5s infinite linear",
        borderRadius: "var(--radius-sm)",
        ...style
      }}
    />
  );

  const renderSkeleton = () => {
    switch (type) {
      case "stat-grid":
        return (
          <div className="grid-stats">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <PulseItem style={{ width: "80px", height: "16px" }} />
                  <PulseItem style={{ width: "28px", height: "28px", borderRadius: "8px" }} />
                </div>
                <PulseItem style={{ width: "120px", height: "32px", marginTop: "4px" }} />
                <PulseItem style={{ width: "160px", height: "14px", marginTop: "4px" }} />
              </div>
            ))}
          </div>
        );

      case "chart":
        return (
          <div className="glass-card" style={{ height: "350px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <PulseItem style={{ width: "150px", height: "20px" }} />
                <PulseItem style={{ width: "200px", height: "14px" }} />
              </div>
              <PulseItem style={{ width: "80px", height: "36px", borderRadius: "10px" }} />
            </div>
            <PulseItem style={{ flex: 1, borderRadius: "var(--radius-md)" }} />
          </div>
        );

      case "table":
        return (
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <PulseItem style={{ width: "140px", height: "20px" }} />
              <PulseItem style={{ width: "100px", height: "36px", borderRadius: "10px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
                {Array(5).fill(0).map((_, i) => (
                  <PulseItem key={i} style={{ flex: 1, height: "16px" }} />
                ))}
              </div>
              {Array(count).fill(0).map((_, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex", gap: "16px", padding: "8px 0" }}>
                  {Array(5).fill(0).map((_, colIndex) => (
                    <PulseItem key={colIndex} style={{ flex: 1, height: "20px" }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <PulseItem style={{ width: "60px", height: "12px" }} />
            <PulseItem style={{ width: "100%", height: "20px" }} />
            <PulseItem style={{ width: "80%", height: "16px" }} />
          </div>
        );
    }
  };

  return (
    <>
      {renderSkeleton()}
      
      {/* Keyframe styles */}
      <style>{`
        @keyframes pulseShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .skeleton-pulse {
          opacity: 0.85;
        }
      `}</style>
    </>
  );
};

export default LoadingSkeleton;
