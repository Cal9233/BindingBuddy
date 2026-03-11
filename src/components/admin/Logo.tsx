import React from "react";

export default function Logo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2px",
      }}
    >
      <span
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: "32px",
          color: "#F0F0F8",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        Binding
      </span>
      <span
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: "32px",
          color: "#E63946",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        Buddy
      </span>
    </div>
  );
}
