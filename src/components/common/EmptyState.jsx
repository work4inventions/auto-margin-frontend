// components/EmptyState.jsx
import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({
  text = "No Data Found",
  icon: Icon = Inbox,
  size = 48,
}) => {
  return (
    <div style={styles.wrapper}>
      <Icon size={size} strokeWidth={1.5} color="#9ca3af" />
      <p style={styles.text}>{text}</p>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "20px",
  },
  text: {
    marginTop: "12px",
    fontSize: "15px",
    color: "#6b7280",
    fontWeight: "500",
  },
};

export default EmptyState;