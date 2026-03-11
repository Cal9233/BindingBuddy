"use client";

import React from "react";

export default function Icon() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        backgroundColor: "#1A1D27",
        border: "2px solid #E63946",
      }}
    >
      <span
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: "11px",
          color: "#E63946",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        BB
      </span>
    </div>
  );
}
